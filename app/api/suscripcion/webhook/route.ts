import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Plan mapping from MP reason to plan_id
const PLAN_MAP: Record<string, string> = {
  "Plan Pro": "pro",
  "Plan Business": "business",
};

export async function POST(request: NextRequest) {
  try {
    // Log signature for debugging (full validation in production)
    const signature = request.headers.get("x-signature");
    console.log("[v0] MP Webhook received, x-signature:", signature);

    const body = await request.json();
    console.log("[v0] MP Webhook body:", JSON.stringify(body, null, 2));

    const { type, data } = body as { type?: string; data?: { id?: string } };

    // Only handle subscription_preapproval notifications
    if (type !== "subscription_preapproval" || !data?.id) {
      console.log("[v0] Ignoring notification type:", type);
      return NextResponse.json({ received: true });
    }

    const subscriptionId = data.id;

    // Fetch subscription details from Mercado Pago
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      console.error("[v0] MERCADOPAGO_ACCESS_TOKEN not configured");
      return NextResponse.json({ received: true });
    }

    const mpResponse = await fetch(
      `https://api.mercadopago.com/preapproval/${subscriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        },
      }
    );

    if (!mpResponse.ok) {
      console.error("[v0] Failed to fetch MP subscription:", mpResponse.status);
      return NextResponse.json({ received: true });
    }

    const subscription = await mpResponse.json();
    console.log("[v0] MP Subscription data:", JSON.stringify(subscription, null, 2));

    const {
      status,
      external_reference,
      reason,
    } = subscription as {
      status?: string;
      external_reference?: string;
      reason?: string;
    };

    // external_reference is the user_id we set when creating the subscription
    const userId = external_reference;

    if (!userId) {
      console.error("[v0] No external_reference (user_id) in subscription");
      return NextResponse.json({ received: true });
    }

    // Initialize Supabase admin client (service role for webhook)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[v0] Supabase env vars not configured for webhook");
      return NextResponse.json({ received: true });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Determine plan_id from reason
    const planId = reason ? PLAN_MAP[reason] : null;

    if (status === "authorized") {
      console.log("[v0] Subscription authorized for user:", userId, "plan:", planId);

      // Upsert subscription record
      const { error } = await supabase
        .from("suscripciones")
        .upsert(
          {
            user_id: userId,
            plan_id: planId || "pro",
            mp_subscription_id: subscriptionId,
            status: "active",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

      if (error) {
        console.error("[v0] Error upserting subscription:", error);
      } else {
        console.log("[v0] Subscription activated successfully");
      }
    } else if (status === "cancelled" || status === "paused") {
      console.log("[v0] Subscription", status, "for user:", userId);

      // Update subscription status and downgrade to starter
      const { error } = await supabase
        .from("suscripciones")
        .update({
          status: status,
          plan_id: "starter",
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (error) {
        console.error("[v0] Error updating subscription:", error);
      } else {
        console.log("[v0] Subscription downgraded to starter");
      }
    } else {
      console.log("[v0] Ignoring subscription status:", status);
    }

    // Always return 200 so MP doesn't retry
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[v0] Webhook error:", err);
    // Still return 200 to prevent retries
    return NextResponse.json({ received: true });
  }
}

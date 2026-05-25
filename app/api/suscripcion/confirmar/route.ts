import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

// Plan mapping from MP reason to plan_id
function getPlanIdFromReason(reason: string): "pro" | "business" | null {
  const lowerReason = reason.toLowerCase();
  if (lowerReason.includes("business")) return "business";
  if (lowerReason.includes("pro")) return "pro";
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { preapproval_id } = body as { preapproval_id?: string };

    if (!preapproval_id) {
      return NextResponse.json(
        { error: "preapproval_id es requerido" },
        { status: 400 }
      );
    }

    // Get authenticated user (usar el client normal)
const supabase = await createClient();
const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    // Fetch subscription details from Mercado Pago
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Mercado Pago no está configurado" },
        { status: 500 }
      );
    }

    const mpResponse = await fetch(
      `https://api.mercadopago.com/preapproval/${preapproval_id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!mpResponse.ok) {
      console.error("[v0] Failed to fetch MP subscription:", mpResponse.status);
      return NextResponse.json(
        { error: "No se pudo verificar la suscripción con Mercado Pago" },
        { status: 400 }
      );
    }

    const subscription = await mpResponse.json();
    const { status, reason, external_reference } = subscription as {
      status?: string;
      reason?: string;
      external_reference?: string;
    };

    // Verify this subscription belongs to the current user
    if (external_reference !== user.id) {
      return NextResponse.json(
        { error: "Esta suscripción no pertenece al usuario actual" },
        { status: 403 }
      );
    }

    // Verify subscription is authorized
    if (status !== "authorized") {
      return NextResponse.json(
        { error: `La suscripción no está activa (estado: ${status})` },
        { status: 400 }
      );
    }

    // Determine plan from reason
    const planId = reason ? getPlanIdFromReason(reason) : null;
    if (!planId) {
      return NextResponse.json(
        { error: "No se pudo determinar el plan de la suscripción" },
        { status: 400 }
      );
    }

    // Para el upsert, usar el service client
const serviceSupabase = createServiceClient();
const { error: upsertError } = await serviceSupabase
  .from("suscripciones")
  .upsert(
    {
      user_id: user.id,
      plan_id: planId,
      mp_subscription_id: preapproval_id,
      estado: "active",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

    if (upsertError) {
      console.error("[v0] Error upserting subscription:", upsertError);
      return NextResponse.json(
        { error: "Error al guardar la suscripción" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      plan_id: planId,
    });
  } catch (err) {
    console.error("[v0] Subscription confirm error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

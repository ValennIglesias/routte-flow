import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST() {
  try {
    // Require authenticated user
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    // Get subscription with mp_subscription_id
    const { data: subscription, error: subError } = await supabase
      .from("suscripciones")
      .select("mp_subscription_id, plan_id")
      .eq("user_id", user.id)
      .eq("estado", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subError) {
      console.error("[v0] Error fetching subscription:", subError);
      return NextResponse.json({ error: "Error al obtener la suscripción." }, { status: 500 });
    }

    if (!subscription) {
      return NextResponse.json({ error: "No hay suscripción activa." }, { status: 404 });
    }

    // Cancel in MercadoPago if there's a subscription ID
    if (subscription.mp_subscription_id) {
      const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      if (!mpToken) {
        console.error("[v0] MERCADOPAGO_ACCESS_TOKEN no configurado");
        return NextResponse.json({ error: "Configuración de pagos incompleta." }, { status: 500 });
      }

      const mpResponse = await fetch(
        `https://api.mercadopago.com/preapproval/${subscription.mp_subscription_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mpToken}`,
          },
          body: JSON.stringify({ status: "cancelled" }),
        }
      );

      if (!mpResponse.ok) {
        const mpError = await mpResponse.text();
        console.error("[v0] MercadoPago cancel error:", mpError);
        return NextResponse.json({ error: "Error al cancelar en MercadoPago." }, { status: 502 });
      }
    }

    // Update subscription in DB using service client (bypasses RLS)
    const serviceSupabase = createServiceClient();
    const { error: updateError } = await serviceSupabase
      .from("suscripciones")
      .update({
        plan_id: "starter",
        estado: "active",
        mp_subscription_id: null,
      })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("[v0] Error updating subscription after cancel:", updateError);
      return NextResponse.json({ error: "Error al actualizar la suscripción." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[v0] Error in cancelar route:", err);
    const message = err instanceof Error ? err.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

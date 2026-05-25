import { NextRequest, NextResponse } from "next/server";
import MercadoPagoConfig, { PreApprovalPlan } from "mercadopago";
import { createClient } from "@/lib/supabase/server";

const PLANS: Record<string, { label: string; amount: number }> = {
  pro:      { label: "Plan Pro",      amount: 25000 },
  business: { label: "Plan Business", amount: 60000 },
};

export async function POST(request: NextRequest) {
  try {
    // Parse and validate body
    const body = await request.json();
    const { plan_id } = body as { plan_id?: string };

    if (!plan_id || !PLANS[plan_id]) {
      return NextResponse.json(
        { error: "plan_id inválido. Valores permitidos: pro, business." },
        { status: 400 }
      );
    }

    // Require authenticated user
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "No autenticado." },
        { status: 401 }
      );
    }

    // Require env var
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      console.error("[v0] MERCADOPAGO_ACCESS_TOKEN no configurado");
      return NextResponse.json(
        { error: "Configuración de pagos incompleta." },
        { status: 500 }
      );
    }

    const plan = PLANS[plan_id];
    const origin = request.headers.get("origin") ?? request.nextUrl.origin;

    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    });

    const preApprovalPlan = new PreApprovalPlan(client);

    const response = await preApprovalPlan.create({
  body: {
    reason: plan.label,
    external_reference: user.id,
    back_url: `${origin}/dashboard?suscripcion=exitosa`,
    auto_recurring: {
      frequency: 1,
      frequency_type: "months",
      transaction_amount: plan.amount,
      currency_id: "ARS",
    },
  } as any,
});

    const init_point = (response as any).init_point;

    if (!init_point) {
      console.error("[v0] Mercado Pago no devolvió init_point:", response);
      return NextResponse.json(
        { error: "No se pudo obtener el link de pago." },
        { status: 502 }
      );
    }

    return NextResponse.json({ init_point });
  } catch (err) {
    console.error("[v0] Error creando suscripción MP:", err);
    const message = err instanceof Error ? err.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

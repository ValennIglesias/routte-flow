import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import MercadoPagoConfig, { PreApproval } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

const PLANS = {
  basic: {
    label: "Plan Basic",
    planId: process.env.MP_PLAN_ID_BASIC!,
  },
  pro: {
    label: "Plan Pro",
    planId: process.env.MP_PLAN_ID_PRO!,
  },
  business: {
    label: "Plan Business",
    planId: process.env.MP_PLAN_ID_BUSINESS!,
  },
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const { plan_id } = body as { plan_id?: string };

  if (!plan_id || !PLANS[plan_id as keyof typeof PLANS]) {
    return NextResponse.json({ error: "Plan inválido" }, { status: 400 });
  }

  const plan = PLANS[plan_id as keyof typeof PLANS];
  const origin = request.headers.get("origin") ?? "";

  try {
    const preApproval = new PreApproval(client);
    const response = await preApproval.create({
      body: {
        preapproval_plan_id: plan.planId,
        reason: plan.label,
        external_reference: user.id,
        back_url: `${origin}/dashboard`,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          currency_id: "ARS",
        },
      } as any,
    });

    return NextResponse.json({ init_point: response.init_point });
  } catch (err) {
    console.error("[crear] MP error:", err);
    return NextResponse.json(
      { error: "Error al crear la suscripción en Mercado Pago" },
      { status: 500 }
    );
  }
}
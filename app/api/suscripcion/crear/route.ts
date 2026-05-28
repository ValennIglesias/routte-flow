import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PLANS = {
  basic: { label: "Plan Basic", planId: process.env.MP_PLAN_ID_BASIC! },
  pro: { label: "Plan Pro", planId: process.env.MP_PLAN_ID_PRO! },
  business: { label: "Plan Business", planId: process.env.MP_PLAN_ID_BUSINESS! },
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
  const init_point = `https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=${plan.planId}&external_reference=${user.id}`;

  return NextResponse.json({ init_point });
}
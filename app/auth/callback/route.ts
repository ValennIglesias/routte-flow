import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const plan = searchParams.get("plan");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // If a paid plan was selected, go to onboarding
      if (plan === "pro" || plan === "business") {
        return NextResponse.redirect(
          new URL(`/onboarding/confirmar-plan?plan=${plan}`, request.url)
        );
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

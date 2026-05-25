import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stops, total_stops, zone } = body;

    if (!stops || !Array.isArray(stops) || !zone) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: stops y zone son obligatorios." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "No autenticado." },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("rutas")
      .insert({
        user_id: user.id,
        zone,
        stops,
        total_stops: total_stops ?? stops.length,
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al guardar la ruta";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

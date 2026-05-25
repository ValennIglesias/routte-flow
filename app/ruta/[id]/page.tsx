import { createClient } from "@/lib/supabase/server";
import DriverRouteClient from "./DriverRouteClient";

interface Stop {
  order: number;
  address: string;
  localidad?: string;
  lat: number;
  lng: number;
}

interface RouteRow {
  id: string;
  zone: string;
  stops: Stop[];
  total_stops: number;
  created_at: string;
}

// ---- Not found page ----

function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-[#fee2e2] flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-lg font-semibold text-[#1a1d26] mb-2">
          Ruta no encontrada
        </h1>
        <p className="text-sm text-[#6b7280]">
          Esta ruta no existe o fue eliminada.
        </p>
      </div>
    </div>
  );
}

// ---- Server component ----

export default async function DriverRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rutas")
    .select("id, zone, stops, total_stops, created_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    return <NotFound />;
  }

  const route = data as RouteRow;

  return <DriverRouteClient route={route} />;
}

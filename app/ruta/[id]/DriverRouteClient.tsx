"use client";

import { useState } from "react";

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

export default function DriverRouteClient({ route }: { route: RouteRow }) {
  const [deliveredStops, setDeliveredStops] = useState<Set<number>>(new Set());

  const toggleDelivered = (order: number) => {
    setDeliveredStops((prev) => {
      const next = new Set(prev);
      if (next.has(order)) {
        next.delete(order);
      } else {
        next.add(order);
      }
      return next;
    });
  };

  const openWaze = (lat: number, lng: number) => {
  window.open(`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`, "_blank");
};

  const totalStops = route.stops.length;
  const deliveredCount = deliveredStops.size;
  const progressPercent = (deliveredCount / totalStops) * 100;

  // Format date
  const formattedDate = new Date(route.created_at).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#1a1d26]">
      {/* Progress bar - sticky top */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#e5e7eb] px-4 py-3 shadow-sm">
        <div className="max-w-[430px] mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#4b5563]">Progreso</span>
            <span className="text-sm font-semibold text-[#f5a623]">
              {deliveredCount} de {totalStops} entregadas
            </span>
          </div>
          <div className="h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#f5a623] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-[#e5e7eb] px-4 py-4">
        <div className="max-w-[430px] mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <svg
              className="w-5 h-5 text-[#f5a623]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            <h1 className="text-lg font-semibold text-[#1a1d26]">
              {route.zone}
            </h1>
          </div>
          <p className="text-sm text-[#6b7280]">
            {formattedDate} &middot; {totalStops} paradas
          </p>
        </div>
      </header>

      {/* Stops list */}
      <main className="px-4 py-4">
        <div className="max-w-[430px] mx-auto space-y-3">
          {route.stops.map((stop) => {
            const isDelivered = deliveredStops.has(stop.order);
            return (
              <div
                key={stop.order}
                className={`bg-white rounded-xl border border-[#e5e7eb] p-4 transition-all duration-200 ${
                  isDelivered ? "opacity-60" : "shadow-sm"
                }`}
              >
                <div className="flex gap-3">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleDelivered(stop.order)}
                    className={`flex-shrink-0 w-6 h-6 rounded-md border-2 transition-all duration-200 flex items-center justify-center mt-1 ${
                      isDelivered
                        ? "bg-[#22c55e] border-[#22c55e]"
                        : "border-[#d1d5db] hover:border-[#f5a623]"
                    }`}
                    aria-label={isDelivered ? "Marcar como pendiente" : "Marcar como entregada"}
                  >
                    {isDelivered && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* Stop number */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-lg ${
                      isDelivered
                        ? "bg-[#e5e7eb] text-[#9ca3af]"
                        : "bg-[#fef3e2] text-[#f5a623]"
                    }`}
                  >
                    {stop.order}
                  </div>

                  {/* Address and action */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-[15px] leading-snug mb-0.5 ${
                        isDelivered
                          ? "line-through text-[#9ca3af]"
                          : "text-[#1a1d26]"
                      }`}
                    >
                      {stop.address}
                    </p>
                    {stop.localidad && (
                      <p className="text-xs text-[#9ca3af] mb-1.5">{stop.localidad}</p>
                    )}
                    <button
  onClick={() => openWaze(stop.lat, stop.lng)}
  disabled={isDelivered}
  className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
    isDelivered
      ? "text-[#d1d5db] cursor-not-allowed"
      : "text-[#3b82f6] active:text-[#1d4ed8]"
  }`}
>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Navegar
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Bottom safe area padding for mobile */}
      <div className="h-6" />

      {/* Completion celebration */}
      {deliveredCount === totalStops && totalStops > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-[320px] w-full text-center shadow-xl">
            <div className="w-16 h-16 bg-[#dcfce7] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#1a1d26] mb-2">Ruta completada</h2>
            <p className="text-[#6b7280] text-sm">
              Todas las paradas fueron entregadas. Excelente trabajo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

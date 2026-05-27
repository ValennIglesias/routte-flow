"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { createClient } from "@/lib/supabase/client";

// ---- Icons ----

function IconLink({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconEmpty({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="12" y="16" width="40" height="32" rx="4" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
      <path d="M24 32h16M32 24v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconChevronLeft({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconChevronRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---- Types ----

interface Route {
  id: string;
  created_at: string;
  zone: string;
  total_stops: number;
}

// ---- Constants ----

const ITEMS_PER_PAGE = 10;

const zoneFilterOptions = [
  { value: "", label: "Todas las zonas" },
  { value: "Zona Norte", label: "Zona Norte" },
  { value: "Zona Centro", label: "Zona Centro" },
  { value: "Zona Sur", label: "Zona Sur" },
  { value: "Zona Oeste", label: "Zona Oeste" },
  { value: "Zona Este", label: "Zona Este" },
];

const periodFilterOptions = [
  { value: "this_month", label: "Este mes" },
  { value: "last_month", label: "Mes anterior" },
  { value: "last_3_months", label: "Últimos 3 meses" },
  { value: "all", label: "Todo" },
];

// ---- Date formatter ----

function formatDateSpanish(dateString: string): string {
  const date = new Date(dateString);
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function getPeriodDateRange(period: string): { start: Date | null; end: Date | null } {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  switch (period) {
    case "this_month":
      return {
        start: new Date(currentYear, currentMonth, 1),
        end: null,
      };
    case "last_month":
      return {
        start: new Date(currentYear, currentMonth - 1, 1),
        end: new Date(currentYear, currentMonth, 0, 23, 59, 59),
      };
    case "last_3_months":
      return {
        start: new Date(currentYear, currentMonth - 2, 1),
        end: null,
      };
    case "all":
    default:
      return { start: null, end: null };
  }
}

// ---- Empty state ----

function EmptyState() {
  return (
    <Card padding="lg">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <span className="text-text-muted mb-4">
          <IconEmpty />
        </span>
        <h3 className="text-base font-medium text-text-primary mb-1">
          Sin rutas todavía
        </h3>
        <p className="text-sm text-text-muted max-w-xs">
          Cuando crees tu primera ruta optimizada, aparecerá acá.
        </p>
      </div>
    </Card>
  );
}

// ---- Main page ----

export default function RutasPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [routes, setRoutes] = React.useState<Route[]>([]);
  const [totalRoutes, setTotalRoutes] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [zoneFilter, setZoneFilter] = React.useState("");
  const [periodFilter, setPeriodFilter] = React.useState("this_month");
  const [currentPage, setCurrentPage] = React.useState(1);

  const supabase = createClient();

  // Load routes from Supabase
  React.useEffect(() => {
    const loadRoutes = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        // Build query
        let query = supabase
          .from("rutas")
          .select("id, created_at, zone, total_stops", { count: "exact" })
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        // Apply zone filter
        if (zoneFilter) {
          query = query.eq("zone", zoneFilter);
        }

        // Apply period filter
        const { start, end } = getPeriodDateRange(periodFilter);
        if (start) {
          query = query.gte("created_at", start.toISOString());
        }
        if (end) {
          query = query.lte("created_at", end.toISOString());
        }

        // Apply pagination
        const from = (currentPage - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) throw error;

        setRoutes(data ?? []);
        setTotalRoutes(count ?? 0);
      } catch (err) {
        console.error("[v0] Error loading routes:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRoutes();
  }, [supabase, zoneFilter, periodFilter, currentPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [zoneFilter, periodFilter]);

  const totalPages = Math.ceil(totalRoutes / ITEMS_PER_PAGE);

  const handleViewLink = (routeId: string) => {
    window.open(`${window.location.origin}/ruta/${routeId}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Page header */}
          <header className="mb-6">
            <h1 className="text-xl sm:text-2xl font-sans font-semibold text-text-primary">
              Mis Rutas
            </h1>
            <p className="text-sm text-text-muted mt-1">
              {totalRoutes} {totalRoutes === 1 ? "ruta" : "rutas"} en total
            </p>
          </header>

          {/* Filters row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="w-full sm:w-48">
              <Select
                options={zoneFilterOptions}
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                placeholder="Todas las zonas"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                options={periodFilterOptions}
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Loading state */}
          {isLoading ? (
            <Card padding="none">
              <div className="p-12 flex justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              </div>
            </Card>
          ) : routes.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Routes table */}
              <Card padding="none">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted px-5 py-3">
                          Fecha
                        </th>
                        <th className="text-left font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted px-5 py-3">
                          Zona
                        </th>
                        <th className="text-left font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted px-5 py-3">
                          Paradas
                        </th>
                        <th className="text-left font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted px-5 py-3">
                          Estado
                        </th>
                        <th className="text-right font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted px-5 py-3">
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {routes.map((route) => (
                        <tr key={route.id} className="border-b border-border last:border-0 hover:bg-bg-surface/50 transition-colors">
                          <td className="px-5 py-3 text-text-primary whitespace-nowrap">
                            {formatDateSpanish(route.created_at)}
                          </td>
                          <td className="px-5 py-3 text-text-muted whitespace-nowrap">
                            {route.zone}
                          </td>
                          <td className="px-5 py-3 text-text-muted">
                            {route.total_stops}
                          </td>
                          <td className="px-5 py-3">
                            <Badge variant="completed" />
                          </td>
                          <td className="px-5 py-3 text-right">
                            <Button variant="ghost" size="sm" iconLeft={<IconLink />} onClick={() => handleViewLink(route.id)}>
                              Ver link
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 text-sm">
                  <p className="text-text-muted">
                    Página {currentPage} de {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      iconLeft={<IconChevronLeft />}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      iconRight={<IconChevronRight />}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// ---- Types ----

type PlanType = "starter" | "pro" | "business";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
}

interface Subscription {
  plan_id: PlanType;
  estado: string;
  updated_at: string;
  mp_subscription_id: string | null;
}

// ---- Plan config ----

const PLAN_LIMITS: Record<PlanType, { routes: number; depots: number }> = {
  starter:  { routes: 15,  depots: 1  },
  pro:      { routes: 40,  depots: 3  },
  business: { routes: 120, depots: 10 },
};

const PLAN_LABELS: Record<PlanType, string> = {
  starter:  "Starter",
  pro:      "Pro",
  business: "Business",
};

// ---- Icons ----

function IconX({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---- Avatar ----

function AvatarInitials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span
      aria-hidden="true"
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent font-mono font-semibold text-base select-none"
    >
      {initials || "?"}
    </span>
  );
}

// ---- Plans Modal (local, same logic as dashboard) ----

interface PlansModalProps {
  currentPlan: PlanType;
  onClose: () => void;
}

function PlansModal({ currentPlan, onClose }: PlansModalProps) {
  const [loadingPlan, setLoadingPlan] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSelectPlan = async (planId: "pro" | "business") => {
    setLoadingPlan(planId);
    setError(null);
    try {
      const response = await fetch("/api/suscripcion/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: planId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al crear la suscripción");
      if (data.init_point) window.location.href = data.init_point;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoadingPlan(null);
    }
  };

  const plans = [
    {
      id: "starter" as const,
      name: "Starter",
      price: 0,
      routes: 15,
      features: ["15 rutas por mes", "Exportar a Google Maps", "Soporte por email"],
    },
    {
      id: "pro" as const,
      name: "Pro",
      price: 25000,
      routes: 40,
      highlighted: true,
      features: ["40 rutas por mes", "App para choferes", "Soporte prioritario"],
    },
    {
      id: "business" as const,
      name: "Business",
      price: 60000,
      routes: 120,
      features: ["120 rutas por mes", "Múltiples usuarios", "API access", "Soporte dedicado"],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Elegir plan"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-4xl rounded-xl border border-border bg-bg-base shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Elegí tu plan</h2>
            <p className="text-sm text-text-muted mt-1">Simple. Sin sorpresas. Pagás solo por lo que usás.</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:bg-bg-surface hover:text-text-primary transition-colors"
            aria-label="Cerrar"
          >
            <IconX size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            const isLoadingThis = loadingPlan === plan.id;
            return (
              <div
                key={plan.id}
                className={[
                  "relative flex flex-col rounded-lg border bg-bg-card p-6",
                  plan.highlighted ? "border-accent ring-1 ring-accent/20" : "border-border",
                ].join(" ")}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-bg-base text-xs font-semibold">
                      Popular
                    </span>
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="completed">Plan actual</Badge>
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="font-mono text-sm uppercase tracking-wider text-text-muted mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    {plan.price === 0 ? (
                      <span className="text-2xl font-bold text-text-primary">Gratis</span>
                    ) : (
                      <>
                        <span className="text-2xl font-bold text-text-primary">${plan.price.toLocaleString("es-AR")}</span>
                        <span className="text-text-muted text-sm">ARS / mes</span>
                      </>
                    )}
                  </div>
                </div>
                <ul className="flex-1 space-y-2.5 mb-5">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-success shrink-0 mt-0.5" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.id === "starter" ? (
                  <div className="text-center py-2 text-sm text-text-muted">
                    {isCurrent ? "Plan gratuito · Activo" : "Plan gratuito"}
                  </div>
                ) : (
                  <Button
                    variant={plan.highlighted ? "primary" : "ghost"}
                    className="w-full"
                    onClick={() => handleSelectPlan(plan.id)}
                    loading={isLoadingThis}
                    disabled={isCurrent || isLoadingThis || loadingPlan !== null}
                  >
                    {isCurrent ? "Plan actual" : "Elegir plan"}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </div>
  );
}

// ---- Cancel Confirmation Modal ----

interface CancelModalProps {
  planName: string;
  onConfirm: () => void;
  onDismiss: () => void;
  isLoading: boolean;
}

function CancelModal({ planName, onConfirm, onDismiss, isLoading }: CancelModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Cancelar suscripción"
    >
      <div className="w-full max-w-sm rounded-xl border border-border bg-bg-base shadow-xl p-6">
        <h2 className="text-base font-semibold text-text-primary mb-2">
          {"¿Cancelar tu suscripción?"}
        </h2>
        <p className="text-sm text-text-muted leading-relaxed">
          {"Perderás acceso a los beneficios del plan "}
          <span className="text-text-primary font-medium">{planName}</span>
          {" al final del período."}
        </p>
        <div className="flex gap-2 mt-6 justify-end">
          <Button variant="ghost" size="sm" onClick={onDismiss} disabled={isLoading}>
            Mantener plan
          </Button>
          <Button variant="destructive" size="sm" onClick={onConfirm} loading={isLoading} disabled={isLoading}>
            Cancelar suscripción
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---- Main Page ----

export default function ConfiguracionPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [subscription, setSubscription] = React.useState<Subscription | null>(null);
  const [currentPlan, setCurrentPlan] = React.useState<PlanType>("starter");
  const [monthlyRouteCount, setMonthlyRouteCount] = React.useState(0);
  const [showPlansModal, setShowPlansModal] = React.useState(false);
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const [isCancelling, setIsCancelling] = React.useState(false);
  const [cancelError, setCancelError] = React.useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = React.useState(false);

  const router = useRouter();
  const supabase = createClient();

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return;

        const fullName =
          authUser.user_metadata?.full_name ||
          authUser.email?.split("@")[0] ||
          "Usuario";

        setUser({
          id: authUser.id,
          email: authUser.email ?? "",
          full_name: fullName,
        });

        const now = new Date();
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        const [subResult, countResult] = await Promise.all([
          supabase
            .from("suscripciones")
            .select("plan_id, estado, updated_at, mp_subscription_id")
            .eq("user_id", authUser.id)
            .eq("estado", "active")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from("rutas")
            .select("id", { count: "exact", head: true })
            .eq("user_id", authUser.id)
            .gte("created_at", firstOfMonth),
        ]);

        if (subResult.data) {
          setSubscription(subResult.data as Subscription);
          const planId = subResult.data.plan_id as PlanType;
          if (planId === "pro" || planId === "business") {
            setCurrentPlan(planId);
          }
        }

        if (!countResult.error) {
          setMonthlyRouteCount(countResult.count ?? 0);
        }
      } catch (err) {
        console.error("[v0] Error loading configuracion data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (err) {
      console.error("[v0] Sign out error:", err);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleCancelConfirm = async () => {
    setIsCancelling(true);
    setCancelError(null);
    try {
      const response = await fetch("/api/suscripcion/cancelar", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al cancelar");
      setCurrentPlan("starter");
      setSubscription(null);
      setCancelSuccess(true);
      setShowCancelModal(false);
      setTimeout(() => setCancelSuccess(false), 5000);
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : "Error desconocido");
      setShowCancelModal(false);
    } finally {
      setIsCancelling(false);
    }
  };

  const routeLimit = PLAN_LIMITS[currentPlan].routes;
  const depotLimit = PLAN_LIMITS[currentPlan].depots;

  // Format date for next billing
  const formatNextBilling = (dateString: string) => {
    const date = new Date(dateString);
    // Approximate next billing as 1 month after updated_at
    date.setMonth(date.getMonth() + 1);
    const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      {/* Modals */}
      {showPlansModal && (
        <PlansModal currentPlan={currentPlan} onClose={() => setShowPlansModal(false)} />
      )}
      {showCancelModal && (
        <CancelModal
          planName={PLAN_LABELS[currentPlan]}
          onConfirm={handleCancelConfirm}
          onDismiss={() => setShowCancelModal(false)}
          isLoading={isCancelling}
        />
      )}

      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Header */}
          <header className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-sans font-semibold text-text-primary">
                Configuración
              </h1>
              <p className="text-sm text-text-muted mt-1">
                Gestioná tu perfil y plan de suscripción.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              loading={isSigningOut}
              disabled={isSigningOut}
            >
              Cerrar sesión
            </Button>
          </header>

          {/* Success banner */}
          {cancelSuccess && (
            <div className="mb-6 flex items-center gap-3 rounded-md border border-success/30 bg-success/10 px-4 py-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-success shrink-0" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-sm font-medium text-success">Suscripción cancelada correctamente.</p>
            </div>
          )}

          {/* Error banner */}
          {cancelError && (
            <div className="mb-6 rounded-md border border-danger/30 bg-danger/10 px-4 py-3">
              <p className="text-sm text-danger">{cancelError}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col gap-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-32 rounded-lg border border-border bg-bg-card animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {/* Profile card */}
              <Card padding="lg">
                <CardHeader>
                  <CardTitle as="h2">Perfil</CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="flex items-center gap-4">
                    <AvatarInitials name={user?.full_name ?? "U"} />
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {user?.full_name ?? "—"}
                      </p>
                      <p className="text-xs text-text-muted truncate">
                        {user?.email ?? "—"}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Plan card */}
              <Card padding="lg">
                <CardHeader>
                  <CardTitle as="h2">Mi plan</CardTitle>
                  <span
                    className={[
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium",
                      currentPlan === "business"
                        ? "bg-accent text-bg-base"
                        : currentPlan === "pro"
                        ? "bg-accent/20 text-accent border border-accent/30"
                        : "bg-bg-card text-text-muted border border-border",
                    ].join(" ")}
                  >
                    {currentPlan === "business"
                      ? "Business"
                      : currentPlan === "pro"
                      ? "Pro"
                      : "Starter"}
                  </span>
                </CardHeader>
                <CardBody>
                  <div className="flex flex-col gap-4">
                    {/* Route usage */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-text-muted">Rutas usadas este mes</span>
                        <span className="font-mono text-text-primary">
                          {monthlyRouteCount} / {routeLimit}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-bg-surface overflow-hidden">
                        <div
                          className={[
                            "h-full rounded-full transition-all duration-500",
                            monthlyRouteCount >= routeLimit ? "bg-danger" : "bg-accent",
                          ].join(" ")}
                          style={{ width: `${Math.min((monthlyRouteCount / routeLimit) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Plan limits */}
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-[11px] uppercase tracking-widest text-text-muted">Rutas / mes</span>
                        <span className="text-sm font-medium text-text-primary">{routeLimit}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-[11px] uppercase tracking-widest text-text-muted">Depósitos</span>
                        <span className="text-sm font-medium text-text-primary">{depotLimit}</span>
                      </div>
                    </div>

                    {/* Next billing or upgrade */}
                    {currentPlan !== "starter" && subscription?.updated_at ? (
                      <p className="text-xs text-text-muted">
                        Próximo pago estimado:{" "}
                        <span className="text-text-primary font-medium">
                          {formatNextBilling(subscription.updated_at)}
                        </span>
                      </p>
                    ) : null}
                  </div>
                </CardBody>

                <CardFooter className="flex-col items-start gap-3">
                  <div className="w-full flex items-center justify-between">
                    {currentPlan === "starter" ? (
                      <Button
                        variant="primary"
                        size="sm"
                        iconRight={<IconArrowRight />}
                        onClick={() => setShowPlansModal(true)}
                      >
                        Mejorar plan
                      </Button>
                    ) : (
                      <div />
                    )}
                  </div>

                  {currentPlan !== "starter" && (
                    <button
                      type="button"
                      onClick={() => setShowCancelModal(true)}
                      className="text-xs text-text-muted hover:text-danger transition-colors"
                    >
                      Cancelar suscripción
                    </button>
                  )}
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

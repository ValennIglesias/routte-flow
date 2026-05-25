"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

// ---- Types ----

type PlanId = "pro" | "business";

interface PlanDetails {
  id: PlanId;
  name: string;
  price: number;
  routes: number;
  features: string[];
  highlighted?: boolean;
}

// ---- Plan data ----

const PLANS: Record<PlanId, PlanDetails> = {
  pro: {
    id: "pro",
    name: "Pro",
    price: 25000,
    routes: 40,
    highlighted: true,
    features: [
      "40 rutas por mes",
      "App para chofer",
      "Historial de rutas",
      "Soporte prioritario",
    ],
  },
  business: {
    id: "business",
    name: "Business",
    price: 60000,
    routes: 120,
    features: [
      "120 rutas por mes",
      "Múltiples usuarios",
      "API access",
      "Soporte dedicado",
    ],
  },
};

// ---- Icons ----

function IconCheck() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-success shrink-0 mt-0.5" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconArrowLeft({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M19 12H5m0 0l7 7m-7-7l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m0 0l-7-7m7 7l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---- Main page ----

export default function ConfirmarPlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate plan param
  if (!planParam || (planParam !== "pro" && planParam !== "business")) {
    // Use effect-free redirect via render
    if (typeof window !== "undefined") router.replace("/dashboard");
    return null;
  }

  const selectedPlan = PLANS[planParam as PlanId];
  const otherPlanId: PlanId = planParam === "pro" ? "business" : "pro";
  const otherPlan = PLANS[otherPlanId];

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/suscripcion/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: selectedPlan.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear la suscripción");
      }

      if (data.init_point) {
        window.location.href = data.init_point;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-bg-base/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-bg-base">
                <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" />
                <path d="M12 22V12" />
                <path d="M4 7l8 5 8-5" />
              </svg>
            </div>
            <span className="font-mono font-medium text-sm tracking-tight text-text-primary">RouteFlow</span>
          </div>

          {/* Back button */}
          <Button
            variant="ghost"
            size="sm"
            iconLeft={<IconArrowLeft />}
            onClick={() => router.back()}
          >
            Volver
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Page title */}
        <div className="mb-10 text-center">
          <span className="font-mono text-xs text-accent uppercase tracking-widest">Onboarding</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mt-2 text-balance">
            Confirmá tu plan y empezá
          </h1>
          <p className="text-text-muted mt-2 text-sm">
            Un solo paso para acceder a todas las funcionalidades.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left: selected plan */}
          <Card
            padding="lg"
            className={["relative flex flex-col", selectedPlan.highlighted ? "border-accent ring-1 ring-accent/20" : ""].join(" ")}
          >
            {/* Badge */}
            <div className="absolute top-4 right-4">
              <Badge variant="completed">Plan seleccionado</Badge>
            </div>

            <CardHeader>
              <div>
                <span className="font-mono text-xs text-text-muted uppercase tracking-widest">
                  {selectedPlan.name}
                </span>
                <div className="flex items-baseline gap-1.5 mt-1.5">
                  <span className="text-4xl font-bold text-text-primary">
                    ${selectedPlan.price.toLocaleString("es-AR")}
                  </span>
                  <span className="text-text-muted text-sm">ARS / mes</span>
                </div>
              </div>
            </CardHeader>

            <CardBody className="flex flex-col gap-4 flex-1">
              {/* Routes bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-text-muted">Rutas disponibles</span>
                  <span className="font-mono text-accent font-medium">{selectedPlan.routes} / mes</span>
                </div>
                <div className="h-2 rounded-full bg-bg-surface overflow-hidden">
                  <div className="h-full w-full rounded-full bg-accent" />
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1">
                {selectedPlan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                    <IconCheck />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="flex flex-col gap-2 mt-4">
                <Button
                  variant="primary"
                  className="w-full"
                  iconRight={<IconArrowRight />}
                  onClick={handleConfirm}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Confirmar y pagar
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => router.push("/dashboard")}
                  disabled={isLoading}
                >
                  Continuar con plan Starter gratis
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Right: comparison with the other plan */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-mono text-text-muted uppercase tracking-widest">
              Comparativa
            </p>

            <Card padding="lg" className="relative flex flex-col">
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-border text-xs text-text-muted">
                  {otherPlan.name}
                </span>
              </div>

              <CardHeader>
                <div>
                  <span className="font-mono text-xs text-text-muted uppercase tracking-widest">
                    {otherPlan.name}
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1.5">
                    <span className="text-3xl font-bold text-text-primary">
                      ${otherPlan.price.toLocaleString("es-AR")}
                    </span>
                    <span className="text-text-muted text-sm">ARS / mes</span>
                  </div>
                </div>
              </CardHeader>

              <CardBody className="flex flex-col gap-4 flex-1">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-text-muted">Rutas disponibles</span>
                    <span className="font-mono text-text-muted">{otherPlan.routes} / mes</span>
                  </div>
                  <div className="h-2 rounded-full bg-bg-surface overflow-hidden">
                    <div className="h-full w-2/3 rounded-full bg-bg-elevated" />
                  </div>
                </div>

                <ul className="space-y-2.5 flex-1">
                  {otherPlan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                      <IconCheck />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant="ghost"
                  className="w-full mt-4"
                  onClick={() => router.push(`/onboarding/confirmar-plan?plan=${otherPlan.id}`)}
                  disabled={isLoading}
                >
                  Ver plan {otherPlan.name}
                </Button>
              </CardBody>
            </Card>

            {/* Starter note */}
            <div className="flex items-start gap-2.5 rounded-md border border-border bg-bg-surface px-3 py-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5 text-text-muted" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p className="text-xs text-text-muted leading-relaxed">
                Podés empezar con el plan Starter gratuito (15 rutas/mes) y mejorar cuando quieras desde el dashboard.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

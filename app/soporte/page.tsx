"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// ---- Types ----

type PlanType = "starter" | "basic" | "pro" | "business";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
}

// ---- Plan config ----

const PLAN_LABELS: Record<PlanType, string> = {
  starter:  "Starter",
  basic:    "Basic",
  pro:      "Pro",
  business: "Business",
};

const PLAN_BADGE_VARIANT: Record<PlanType, "neutral" | "warning" | "completed" | "in-progress"> = {
  starter:  "neutral",
  basic:    "neutral",
  pro:      "in-progress",
  business: "completed",
};

const RESPONSE_TIME: Record<PlanType, string> = {
  starter:  "hasta 72hs",
  basic:    "hasta 48hs",
  pro:      "hasta 24hs",
  business: "mismo día",
};

const SUBJECTS = [
  "Problema técnico",
  "Consulta sobre mi plan",
  "Error en una ruta",
  "Otro",
];

// ---- Icons ----

function IconSupport({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.5 7.5a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="14.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

function IconMail({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconCheck({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10l4.5 4.5L16 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---- Main page ----

export default function SoportePage() {
  const router = useRouter();
  const supabase = createClient();

  // State
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [plan, setPlan] = React.useState<PlanType>("starter");
  const [isLoading, setIsLoading] = React.useState(true);

  // Form state
  const [asunto, setAsunto] = React.useState(SUBJECTS[0]);
  const [mensaje, setMensaje] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  // Load user + plan
  React.useEffect(() => {
    async function load() {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        router.replace("/login");
        return;
      }

      const profile: UserProfile = {
        id: authUser.id,
        email: authUser.email ?? "",
        full_name:
          authUser.user_metadata?.full_name ??
          authUser.user_metadata?.name ??
          authUser.email?.split("@")[0] ??
          "Usuario",
      };
      setUser(profile);

      // Fetch subscription
      const { data: sub } = await supabase
        .from("suscripciones")
        .select("plan_id")
        .eq("user_id", authUser.id)
        .single();

      if (sub?.plan_id && sub.plan_id in PLAN_LABELS) {
        setPlan(sub.plan_id as PlanType);
      }

      setIsLoading(false);
    }

    load();
  }, []);

  // Submit handler
  const handleSubmit = () => {
    setFormError(null);

    if (mensaje.trim().length < 20) {
      setFormError("El mensaje debe tener al menos 20 caracteres.");
      return;
    }

    const nombre = user?.full_name ?? "";
    const email = user?.email ?? "";
    const planLabel = PLAN_LABELS[plan];

    const subject = encodeURIComponent(asunto);
    const body = encodeURIComponent(
      `Usuario: ${nombre} (${email})\nPlan: ${planLabel}\n\nMensaje:\n${mensaje}`
    );

    const mailtoUrl = `mailto:valen.iglesias3@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
    setSuccess(true);
  };

  const msgLength = mensaje.trim().length;
  const msgValid = msgLength >= 20;

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">

          {/* Page header */}
          <div>
            <h1 className="font-sans text-2xl font-bold text-text-primary flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <IconSupport size={18} />
              </span>
              Soporte
            </h1>
            <p className="mt-1 text-sm text-text-muted">Estamos para ayudarte</p>
          </div>

          {/* Main card */}
          <Card padding="lg">
            {/* User info */}
            <CardHeader>
              <CardTitle as="h2">Tu consulta</CardTitle>
              {!isLoading && user && (
                <Badge variant={PLAN_BADGE_VARIANT[plan]} dot>
                  {PLAN_LABELS[plan]}
                </Badge>
              )}
            </CardHeader>

            <CardBody className="flex flex-col gap-5">
              {/* User details (read-only) */}
              {isLoading ? (
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-40 rounded bg-border animate-pulse" />
                  <div className="h-4 w-56 rounded bg-border animate-pulse" />
                </div>
              ) : user ? (
                <div className="flex flex-col gap-1.5 rounded-md border border-border bg-bg-surface px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-text-muted w-14 shrink-0">Nombre</span>
                    <span className="text-sm text-text-primary">{user.full_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-text-muted w-14 shrink-0">Email</span>
                    <span className="text-sm text-text-primary truncate max-w-[200px] block">{user.email}</span>
                  </div>
                </div>
              ) : null}

              {/* Success message */}
              {success ? (
                <div className="flex items-start gap-3 rounded-md border border-[rgba(46,204,113,0.25)] bg-[rgba(46,204,113,0.08)] px-4 py-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/20 text-success">
                    <IconCheck size={12} />
                  </span>
                  <p className="text-sm text-success">
                    Tu cliente de email se abrió con la consulta lista para enviar.
                  </p>
                </div>
              ) : (
                <>
                  {/* Asunto select */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="asunto"
                      className="text-xs font-medium text-text-muted"
                    >
                      Asunto
                    </label>
                    <select
                      id="asunto"
                      value={asunto}
                      onChange={(e) => setAsunto(e.target.value)}
                      className="h-9 w-full rounded-md border border-border bg-bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors appearance-none cursor-pointer"
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Mensaje textarea */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="mensaje"
                        className="text-xs font-medium text-text-muted"
                      >
                        Mensaje
                      </label>
                      <span
                        className={[
                          "font-mono text-[11px]",
                          msgLength === 0
                            ? "text-text-muted"
                            : msgValid
                            ? "text-success"
                            : "text-accent",
                        ].join(" ")}
                      >
                        {msgLength} / mín. 20
                      </span>
                    </div>
                    <textarea
                      id="mensaje"
                      value={mensaje}
                      onChange={(e) => {
                        setMensaje(e.target.value);
                        setFormError(null);
                      }}
                      rows={5}
                      placeholder="Describí tu consulta o problema con el mayor detalle posible..."
                      className="w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                    />
                    {formError && (
                      <p className="text-xs text-danger">{formError}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      disabled={isLoading || !user}
                    >
                      Enviar consulta
                    </Button>
                  </div>
                </>
              )}
            </CardBody>
          </Card>

          {/* Direct contact card */}
          <Card padding="md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-text-primary">
                  ¿Preferís contactarnos directamente?
                </p>
                <a
                  href="mailto:soporte@routeflow.app"
                  className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline font-mono"
                >
                  <IconMail size={14} />
                  soporte@routeflow.app
                </a>
              </div>
              <div className="shrink-0 rounded-md border border-border bg-bg-surface px-3 py-2 text-right sm:text-center">
                <p className="text-[11px] font-mono text-text-muted uppercase tracking-wider">
                  Tiempo de respuesta
                </p>
                <p className="mt-0.5 text-sm font-semibold text-text-primary">
                  {RESPONSE_TIME[plan]}
                </p>
              </div>
            </div>
          </Card>

        </div>
      </main>
    </div>
  );
}

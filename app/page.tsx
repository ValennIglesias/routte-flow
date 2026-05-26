"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [hasSession, setHasSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        setHasSession(!!data.session);
      } catch (error) {
        console.error("[v0] Error checking session:", error);
        setHasSession(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const handleAuthNavigation = () => {
  router.push(hasSession ? "/dashboard" : "/login?mode=register");
};
  

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-base/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-bg-base">
                <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" />
                <path d="M12 22V12" />
                <path d="M4 7l8 5 8-5" />
              </svg>
            </div>
            <span className="font-mono font-medium text-lg tracking-tight">RouteFlow</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push(hasSession ? "/dashboard" : "/login")}>Iniciar sesión</Button>
            <Button variant="primary" size="sm" onClick={handleAuthNavigation}>Empezar gratis</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        {/* Grid background */}
        <div 
          className="absolute inset-0 opacity-[0.035]" 
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--text-muted) 1px, transparent 1px),
              linear-gradient(to bottom, var(--text-muted) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} 
        />
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--accent-soft)_0%,_transparent_70%)]" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-bold text-balance leading-tight mb-6">
            Tus repartidores salen en{" "}
            <span className="text-accent">minutos</span>, no en horas.
          </h1>
          <p className="text-text-muted text-lg sm:text-xl max-w-2xl mx-auto mb-10 text-pretty">
            Optimizá rutas de entrega al instante. Subí un Excel, elegí la zona y compartí el link con tu chofer.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" onClick={handleAuthNavigation}>
              Empezar gratis
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ml-1">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Button>
            <Button variant="ghost" size="lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
              </svg>
              Ver demo
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-28 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-accent uppercase tracking-widest">Cómo funciona</span>
            <h2 className="font-sans text-3xl sm:text-4xl font-bold mt-3 text-balance">Tres pasos. Sin complicaciones.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center p-6">
              <div className="absolute -top-2 left-4 md:-left-2 font-mono text-7xl font-bold text-accent/15 select-none">1</div>
              <div className="relative w-14 h-14 rounded-xl bg-bg-card border border-border flex items-center justify-center mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3 className="font-sans text-lg font-semibold mb-2">Subís tu Excel</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Cargá un archivo con las direcciones de entrega. Soportamos cualquier formato.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center p-6">
              <div className="absolute -top-2 left-4 md:-left-2 font-mono text-7xl font-bold text-accent/15 select-none">2</div>
              <div className="relative w-14 h-14 rounded-xl bg-bg-card border border-border flex items-center justify-center mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                  <circle cx="12" cy="10" r="3" />
                  <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 7 8 11.7z" />
                </svg>
              </div>
              <h3 className="font-sans text-lg font-semibold mb-2">Seleccionás la zona</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Elegí el área de cobertura y optimizamos el orden de las paradas automáticamente.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center p-6">
              <div className="absolute -top-2 left-4 md:-left-2 font-mono text-7xl font-bold text-accent/15 select-none">3</div>
              <div className="relative w-14 h-14 rounded-xl bg-bg-card border border-border flex items-center justify-center mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </div>
              <h3 className="font-sans text-lg font-semibold mb-2">Compartís el link</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Tu chofer recibe la ruta optimizada con navegación paso a paso. Listo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 sm:py-28 bg-bg-surface border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-accent uppercase tracking-widest">Precios</span>
            <h2 className="font-sans text-3xl sm:text-4xl font-bold mt-3">Simple. Sin sorpresas.</h2>
            <p className="text-text-muted mt-3">Pagás solo por lo que usás. Sin contratos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Starter */}
            <PricingCard
              name="Starter"
              price={10}
              routes={15}
              usedRoutes={0}
              features={["15 rutas por mes", "Exportar a Google Maps", "Soporte por email"]}
              onSelectPlan={() => router.push("/login?mode=register")}
            />

            {/* Pro */}
<PricingCard
  name="Pro"
  price={25}
  routes={40}
  usedRoutes={0}
  highlighted
  features={["40 rutas por mes", "App para chofer", "Historial de rutas", "Soporte prioritario"]}
  onSelectPlan={() => router.push(hasSession ? "/onboarding/confirmar-plan?plan=pro" : "/login?plan=pro&mode=register")}
/>

{/* Business */}
<PricingCard
  name="Business"
  price={60}
  routes={120}
  usedRoutes={0}
  features={["120 rutas por mes", "Múltiples usuarios", "API access", "Soporte dedicado"]}
  onSelectPlan={() => router.push(hasSession ? "/onboarding/confirmar-plan?plan=business" : "/login?plan=business&mode=register")}
/>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 sm:py-28 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-accent uppercase tracking-widest">Comparativa</span>
            <h2 className="font-sans text-3xl sm:text-4xl font-bold mt-3">¿Por qué RouteFlow?</h2>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-mono text-xs text-text-muted uppercase tracking-wider"></th>
                  <th className="text-center py-4 px-4 font-mono text-xs uppercase tracking-wider">
                    <span className="text-accent">RouteFlow</span>
                  </th>
                  <th className="text-center py-4 px-4 font-mono text-xs text-text-muted uppercase tracking-wider">Routific</th>
                  <th className="text-center py-4 px-4 font-mono text-xs text-text-muted uppercase tracking-wider">SimpliRoute</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4 text-text-muted">Precio por ruta</td>
                  <td className="py-4 px-4 text-center font-semibold text-accent">$0.67</td>
                  <td className="py-4 px-4 text-center text-text-muted">$2.50</td>
                  <td className="py-4 px-4 text-center text-text-muted">$1.80</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4 text-text-muted">Curva de aprendizaje</td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" />
                      Minutos
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-text-muted">Horas</td>
                  <td className="py-4 px-4 text-center text-text-muted">Días</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-4 px-4 text-text-muted">App para chofer</td>
                  <td className="py-4 px-4 text-center">
                    <CheckIcon />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <CheckIcon muted />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <CrossIcon />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-text-muted">Modelo por uso</td>
                  <td className="py-4 px-4 text-center">
                    <CheckIcon />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <CrossIcon />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <CrossIcon />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 bg-bg-surface border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-sans text-3xl sm:text-4xl font-bold mb-4 text-balance">
            Empezá a optimizar hoy
          </h2>
          <p className="text-text-muted text-lg mb-8">
            Creá tu cuenta gratis y lanzá tu primera ruta en menos de 5 minutos.
          </p>
          <Button variant="primary" size="lg" onClick={handleAuthNavigation}>
            Crear cuenta gratis
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ml-1">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-bg-base">
                  <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" />
                </svg>
              </div>
              <span className="font-mono text-sm text-text-muted">RouteFlow</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-text-muted">
              <a href="#" className="hover:text-text-primary transition-colors duration-150">Términos</a>
              <a href="#" className="hover:text-text-primary transition-colors duration-150">Privacidad</a>
              <a href="#" className="hover:text-text-primary transition-colors duration-150">Contacto</a>
            </div>
            <span className="text-xs text-text-muted">© 2026 RouteFlow</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Pricing Card Component */
function PricingCard({
  name,
  price,
  routes,
  usedRoutes,
  features,
  highlighted = false,
  onSelectPlan,
}: {
  name: string;
  price: number;
  routes: number;
  usedRoutes: number;
  features: string[];
  highlighted?: boolean;
  onSelectPlan: () => void;
}) {
  const percentage = (usedRoutes / routes) * 100;

  return (
    <Card
      padding="lg"
      className={[
        "relative flex flex-col transition-transform duration-200 hover:-translate-y-1",
        highlighted ? "border-accent ring-1 ring-accent/20" : "",
      ].join(" ")}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-bg-base text-xs font-semibold">
            Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-mono text-sm uppercase tracking-wider text-text-muted mb-2">{name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-text-muted text-sm">USD / mes</span>
        </div>
      </div>

      {/* Credits progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-text-muted">Rutas disponibles</span>
          <span className="font-mono text-accent">{routes - usedRoutes}/{routes}</span>
        </div>
        <div className="h-2 rounded-full bg-bg-surface overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{ width: `${100 - percentage}%` }}
          />
        </div>
      </div>

      <ul className="flex-1 space-y-3 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-success shrink-0 mt-0.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <Button variant={highlighted ? "primary" : "ghost"} className="w-full" onClick={onSelectPlan}>
        Elegir plan
      </Button>
    </Card>
  );
}

function CheckIcon({ muted = false }: { muted?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className={`mx-auto ${muted ? "text-text-muted" : "text-success"}`}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="mx-auto text-text-muted/50"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

import Link from "next/link";

export const metadata = {
  title: "Términos y Condiciones | RouteFlow",
  description: "Términos y condiciones de uso de RouteFlow.",
};

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-bg-base">
          <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" />
          <path d="M12 22V12" />
          <path d="M4 7l8 5 8-5" />
        </svg>
      </div>
      <span className="font-mono font-medium text-lg tracking-tight text-text-primary">RouteFlow</span>
    </Link>
  );
}

function Footer() {
  return (
    <footer className="py-8 border-t border-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-bg-base">
                <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" />
              </svg>
            </div>
            <span className="font-mono text-sm text-text-muted">RouteFlow</span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <Link href="/terminos" className="hover:text-text-primary transition-colors duration-150">Términos</Link>
            <Link href="/privacidad" className="hover:text-text-primary transition-colors duration-150">Privacidad</Link>
            <Link href="/contacto" className="hover:text-text-primary transition-colors duration-150">Contacto</Link>
          </div>
          <span className="text-xs text-text-muted">© 2026 RouteFlow</span>
        </div>
      </div>
    </footer>
  );
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Logo />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="mb-10">
            <h1 className="font-sans text-3xl sm:text-4xl font-bold text-text-primary">Términos y Condiciones</h1>
            <p className="mt-3 text-sm text-text-muted font-mono">Última actualización: Mayo 2026</p>
          </div>

          <div className="flex flex-col gap-10 text-text-secondary">

            <section>
              <h2 className="font-sans text-lg font-semibold text-text-primary mb-3">1. Descripción del servicio</h2>
              <p className="text-sm leading-relaxed">
                RouteFlow es una plataforma SaaS de optimización de rutas logísticas para empresas. Permite a los usuarios cargar listados de direcciones de entrega y obtener rutas optimizadas exportables a Google Maps. El servicio se presta de forma online a través de{" "}
                <span className="font-mono">routeflow.app</span>.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-lg font-semibold text-text-primary mb-3">2. Uso aceptable</h2>
              <p className="text-sm leading-relaxed">
                El servicio está destinado al uso comercial legítimo de optimización de rutas de entrega. Queda prohibido el uso del servicio para fines ilícitos, la ingeniería inversa de la plataforma, la reventa del servicio a terceros sin autorización expresa de RouteFlow, y cualquier actividad que pudiera comprometer la seguridad o disponibilidad del sistema.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-lg font-semibold text-text-primary mb-3">3. Suscripciones y pagos</h2>
              <p className="text-sm leading-relaxed">
                Los planes de pago se cobran mensualmente mediante Mercado Pago. Las cancelaciones son efectivas al finalizar el período de facturación vigente: el usuario conserva acceso al plan contratado hasta el cierre del ciclo mensual. No se realizan reembolsos proporcionales por días no utilizados.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-lg font-semibold text-text-primary mb-3">4. Limitación de responsabilidad</h2>
              <p className="text-sm leading-relaxed">
                RouteFlow no se responsabiliza por errores en las direcciones ingresadas por el usuario, ni por las decisiones operativas tomadas en base a las rutas generadas por la plataforma. El servicio se provee "tal cual" y sin garantías de disponibilidad continua o resultados específicos. En ningún caso RouteFlow será responsable por daños indirectos, lucro cesante o pérdida de datos derivados del uso de la plataforma.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-lg font-semibold text-text-primary mb-3">5. Modificaciones</h2>
              <p className="text-sm leading-relaxed">
                RouteFlow puede modificar estos términos con un mínimo de 30 días de anticipación, notificando al usuario por email. El uso continuado del servicio tras la entrada en vigencia de los nuevos términos implica la aceptación de los mismos.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-lg font-semibold text-text-primary mb-3">6. Contacto</h2>
              <p className="text-sm leading-relaxed">
                Para consultas relacionadas con estos términos, podés escribirnos a{" "}
                <a
                  href="mailto:valen.iglesias3@gmail.com"
                  className="text-accent hover:underline font-mono"
                >
                  valen.iglesias3@gmail.com
                </a>.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-lg font-semibold text-text-primary mb-3">7. Jurisdicción</h2>
              <p className="text-sm leading-relaxed">
                Estos términos se rigen por las leyes de la República Argentina. Cualquier controversia que no pueda resolverse amigablemente será sometida a los tribunales competentes de la Ciudad Autónoma de Buenos Aires.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

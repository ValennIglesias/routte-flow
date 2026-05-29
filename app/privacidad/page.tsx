import Link from "next/link";

export const metadata = {
  title: "Política de Privacidad | RouteFlow",
  description: "Política de privacidad y tratamiento de datos de RouteFlow.",
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

export default function PrivacidadPage() {
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
            <h1 className="font-sans text-3xl sm:text-4xl font-bold text-text-primary">Política de Privacidad</h1>
            <p className="mt-3 text-sm text-text-muted font-mono">Última actualización: Mayo 2026</p>
          </div>

          <div className="flex flex-col gap-10 text-text-secondary">

            <section>
              <h2 className="font-sans text-lg font-semibold text-text-primary mb-3">1. Datos que recopilamos</h2>
              <p className="text-sm leading-relaxed mb-3">
                Al usar RouteFlow recopilamos únicamente los datos necesarios para brindar el servicio:
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  "Nombre y dirección de email, obtenidos al registrarse mediante Google OAuth o formulario propio.",
                  "Direcciones de entrega cargadas por el usuario en la plataforma.",
                  "Historial de rutas generadas, vinculado a la cuenta del usuario.",
                  "Datos de suscripción: plan contratado e historial de pagos procesados por Mercado Pago.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-sans text-lg font-semibold text-text-primary mb-3">2. Datos que NO recopilamos</h2>
              <p className="text-sm leading-relaxed">
                RouteFlow no recopila ni almacena datos personales de los destinatarios de las entregas, ni datos personales de los choferes que ejecutan las rutas. Las direcciones cargadas son tratadas como datos operativos del usuario, no como datos de terceros identificables.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-lg font-semibold text-text-primary mb-3">3. Uso de los datos</h2>
              <p className="text-sm leading-relaxed">
                Los datos recopilados se utilizan exclusivamente para proveer el servicio de optimización de rutas: autenticar al usuario, calcular rutas, mostrar el historial de rutas y gestionar la suscripción. No utilizamos los datos para publicidad ni los vendemos a terceros.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-lg font-semibold text-text-primary mb-3">4. Terceros y servicios externos</h2>
              <p className="text-sm leading-relaxed mb-3">
                RouteFlow integra los siguientes servicios de terceros para su funcionamiento:
              </p>
              <ul className="flex flex-col gap-2">
                {[
                  "Google Maps API: utilizada para geocodificación de direcciones. No recibe datos personales de usuarios finales.",
                  "Mercado Pago: procesa los pagos de suscripciones. Maneja datos de pago según su propia política de privacidad.",
                  "Supabase: base de datos y autenticación. Almacena los datos de cuenta y rutas con cifrado en reposo.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-sans text-lg font-semibold text-text-primary mb-3">5. Retención de datos</h2>
              <p className="text-sm leading-relaxed">
                Los datos se conservan mientras la cuenta esté activa. Al cancelar la cuenta, los datos pueden eliminarse bajo solicitud explícita enviada a{" "}
                <a href="mailto:valen.iglesias3@gmail.com" className="text-accent hover:underline font-mono">
                  valen.iglesias3@gmail.com
                </a>. Las copias de respaldo pueden conservarse por un período adicional de hasta 30 días.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-lg font-semibold text-text-primary mb-3">6. Seguridad</h2>
              <p className="text-sm leading-relaxed">
                Los datos almacenados en Supabase cuentan con cifrado en reposo y en tránsito. El acceso a la base de datos está restringido mediante Row Level Security (RLS), de forma que cada usuario solo puede acceder a sus propios datos.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-lg font-semibold text-text-primary mb-3">7. Contacto</h2>
              <p className="text-sm leading-relaxed">
                Para ejercer tus derechos de acceso, rectificación o eliminación de datos, escribinos a{" "}
                <a href="mailto:valen.iglesias3@gmail.com" className="text-accent hover:underline font-mono">
                  valen.iglesias3@gmail.com
                </a>.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

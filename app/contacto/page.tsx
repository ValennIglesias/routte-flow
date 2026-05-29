"use client";

import * as React from "react";
import Link from "next/link";

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

function IconMail({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconClock({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

const SUBJECTS = [
  "Consulta sobre planes",
  "Información sobre el servicio",
  "Propuesta comercial",
  "Otro",
];

export default function ContactoPage() {
  const [asunto, setAsunto] = React.useState(SUBJECTS[0]);
  const [mensaje, setMensaje] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const msgLength = mensaje.trim().length;
  const msgValid = msgLength >= 20;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!msgValid) {
      setError("El mensaje debe tener al menos 20 caracteres.");
      return;
    }

    const subject = encodeURIComponent(asunto);
    const body = encodeURIComponent(`Asunto: ${asunto}\n\nMensaje:\n${mensaje}`);
    window.location.href = `mailto:valen.iglesias3@gmail.com?subject=${subject}&body=${body}`;
    setSuccess(true);
  };

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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex flex-col gap-10">

          {/* Intro */}
          <div>
            <h1 className="font-sans text-3xl sm:text-4xl font-bold text-text-primary">Contacto</h1>
            <p className="mt-3 text-base text-text-secondary leading-relaxed">
              ¿Tenés alguna pregunta o querés conocer más sobre RouteFlow?
            </p>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email card */}
            <div className="rounded-xl border border-border bg-bg-card p-5 flex flex-col gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <IconMail size={18} />
              </div>
              <div>
                <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-1">Email</p>
                <a
                  href="mailto:valen.iglesias3@gmail.com"
                  className="text-sm font-mono text-accent hover:underline break-all"
                >
                  valen.iglesias3@gmail.com
                </a>
              </div>
            </div>

            {/* Response time card */}
            <div className="rounded-xl border border-border bg-bg-card p-5 flex flex-col gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <IconClock size={18} />
              </div>
              <div>
                <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-1">Tiempo de respuesta</p>
                <p className="text-sm text-text-primary font-semibold">Respondemos en menos de 48 horas hábiles</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-xl border border-border bg-bg-card p-6 flex flex-col gap-5">
            <h2 className="font-sans text-lg font-semibold text-text-primary">Envianos un mensaje</h2>

            {success ? (
              <div className="flex items-start gap-3 rounded-md border border-[rgba(46,204,113,0.25)] bg-[rgba(46,204,113,0.08)] px-4 py-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/20 text-success">
                  <IconCheck size={12} />
                </span>
                <p className="text-sm text-success">
                  Tu cliente de email se abrió con el mensaje listo para enviar.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Asunto */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="asunto" className="text-xs font-medium text-text-muted">
                    Asunto
                  </label>
                  <select
                    id="asunto"
                    value={asunto}
                    onChange={(e) => setAsunto(e.target.value)}
                    className="h-9 w-full rounded-md border border-border bg-bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors appearance-none cursor-pointer"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Mensaje */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="mensaje" className="text-xs font-medium text-text-muted">
                      Mensaje
                    </label>
                    <span className={[
                      "font-mono text-[11px]",
                      msgLength === 0 ? "text-text-muted" : msgValid ? "text-success" : "text-accent",
                    ].join(" ")}>
                      {msgLength} / mín. 20
                    </span>
                  </div>
                  <textarea
                    id="mensaje"
                    value={mensaje}
                    onChange={(e) => {
                      setMensaje(e.target.value);
                      setError(null);
                    }}
                    rows={5}
                    placeholder="Contanos sobre tu consulta o proyecto..."
                    className="w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                  />
                  {error && <p className="text-xs text-danger">{error}</p>}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-accent text-bg-base text-sm font-semibold hover:bg-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    Enviar mensaje
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Dashboard note */}
          <p className="text-sm text-text-muted border-t border-border pt-6">
            Para soporte técnico si ya sos cliente, usá la sección{" "}
            <Link href="/soporte" className="text-accent hover:underline">
              Soporte
            </Link>{" "}
            dentro del dashboard.
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
}

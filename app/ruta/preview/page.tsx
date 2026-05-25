"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

// ---- Types ----

interface Stop {
  order: number;
  address: string;
  localidad: string;
  lat: number;
  lng: number;
}

interface RouteData {
  stops: Stop[];
  total_stops: number;
  zone: string;
}

// ---- Icons ----

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

function IconExternalLink({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCopy({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconCheck({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---- Share modal ----

function ShareModal({
  routeId,
  onClose,
}: {
  routeId: string;
  onClose: () => void;
}) {
  const shareUrl = `${window.location.origin}/ruta/${routeId}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement("textarea");
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenDriver = () => {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Compartir ruta con chofer"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md rounded-xl border border-border bg-bg-card shadow-xl p-6 flex flex-col gap-5">
        {/* Header */}
        <div>
          <h2 className="text-base font-semibold text-text-primary">
            Compartir con chofer
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Copiá el link y enviáselo al chofer para que vea su ruta.
          </p>
        </div>

        {/* Link box */}
        <div className="flex items-center gap-2 rounded-md border border-border bg-bg-surface px-3 py-2">
          <span className="flex-1 min-w-0 truncate font-mono text-xs text-text-muted">
            {shareUrl}
          </span>
          <button
            onClick={handleCopy}
            className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
            aria-label="Copiar link"
          >
            {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cerrar
          </Button>
          <Button size="sm" iconRight={<IconExternalLink size={14} />} onClick={handleOpenDriver}>
            Abrir vista del chofer
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---- Empty state ----

function EmptyState({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-bg-card border border-border mx-auto mb-5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted" />
          </svg>
        </div>
        <h2 className="text-base font-medium text-text-primary mb-2">
          No hay datos de ruta
        </h2>
        <p className="text-sm text-text-muted mb-6">
          No hay datos de ruta. Volvé al dashboard.
        </p>
        <Button variant="ghost" iconLeft={<IconArrowLeft />} onClick={onBack}>
          Volver al dashboard
        </Button>
      </div>
    </div>
  );
}

// ---- Main page ----

export default function RoutePreviewPage() {
  const router = useRouter();
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedRouteId, setSavedRouteId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("optimizedRoute");
      if (raw) {
        setRouteData(JSON.parse(raw));
      }
    } catch {
      // corrupted data — treat as empty
    } finally {
      setLoaded(true);
    }
  }, []);

  const handleBack = () => router.push("/dashboard");

  const handleShare = async () => {
    if (!routeData) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await fetch("/api/save-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stops: routeData.stops,
          total_stops: routeData.total_stops,
          zone: routeData.zone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al guardar la ruta");
      }

      setSavedRouteId(data.id);
      setShowShareModal(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  };

  // Wait for client mount to avoid SSR mismatch
  if (!loaded) return null;

  if (!routeData || !routeData.stops?.length) {
    return <EmptyState onBack={handleBack} />;
  }

  const { stops, total_stops, zone } = routeData;

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Share modal */}
      {showShareModal && savedRouteId && (
        <ShareModal routeId={savedRouteId} onClose={() => setShowShareModal(false)} />
      )}

      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-border bg-bg-base/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Back + title */}
          <div className="flex items-center gap-4 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              iconLeft={<IconArrowLeft />}
              onClick={handleBack}
            >
              Volver
            </Button>
            <div className="hidden sm:block w-px h-5 bg-border shrink-0" />
            <div className="min-w-0">
              <h1 className="text-sm font-medium text-text-primary truncate">
                Ruta optimizada · <span className="text-accent">{zone}</span>
              </h1>
              <p className="text-xs text-text-muted leading-tight">
                {total_stops} paradas ordenadas
              </p>
            </div>
          </div>

          {/* Share button */}
          <Button
            size="sm"
            iconRight={<IconArrowRight />}
            onClick={handleShare}
            loading={isSaving}
            disabled={isSaving}
          >
            Compartir con chofer
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {/* Mobile title (below header) */}
        <div className="sm:hidden mb-5">
          <h2 className="text-base font-medium text-text-primary">
            Ruta optimizada · <span className="text-accent">{zone}</span>
          </h2>
          <p className="text-sm text-text-muted mt-0.5">
            {total_stops} paradas ordenadas
          </p>
        </div>

        {/* Error banner */}
        {saveError && (
          <div className="mb-5 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
            {saveError}
          </div>
        )}

        {/* Stops list */}
        <ol className="flex flex-col gap-3" aria-label="Lista de paradas">
          {stops.map((stop) => (
            <li
              key={stop.order}
              className="flex items-start gap-4 rounded-lg border border-border bg-bg-card px-4 py-4 hover:border-border/80 hover:bg-bg-surface transition-colors"
            >
              {/* Order number */}
              <span
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-accent-soft text-accent font-mono font-semibold text-base leading-none"
                aria-label={`Parada ${stop.order}`}
              >
                {stop.order}
              </span>

              {/* Address */}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm font-medium text-text-primary leading-snug">
                  {stop.address}
                </p>
                <p className="text-xs text-text-muted mt-0.5">{stop.localidad}</p>
              </div>

              {/* Map link */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${stop.lat},${stop.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors pt-1"
                aria-label={`Ver ${stop.address} en mapa`}
              >
                <IconExternalLink />
                Ver en mapa
              </a>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}


// ---- Types ----

interface Stop {
  order: number;
  address: string;
  localidad: string;
  lat: number;
  lng: number;
}

interface RouteData {
  stops: Stop[];
  total_stops: number;
  zone: string;
}

// ---- Icons ----

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

function IconExternalLink({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---- Empty state ----

function EmptyState({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-bg-card border border-border mx-auto mb-5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted" />
          </svg>
        </div>
        <h2 className="text-base font-medium text-text-primary mb-2">
          No hay datos de ruta
        </h2>
        <p className="text-sm text-text-muted mb-6">
          No hay datos de ruta. Volvé al dashboard.
        </p>
        <Button variant="ghost" iconLeft={<IconArrowLeft />} onClick={onBack}>
          Volver al dashboard
        </Button>
      </div>
    </div>
  );
}

// ---- Main page ----

export default function RoutePreviewPage() {
  const router = useRouter();
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("optimizedRoute");
      if (raw) {
        setRouteData(JSON.parse(raw));
      }
    } catch {
      // corrupted data — treat as empty
    } finally {
      setLoaded(true);
    }
  }, []);

  const handleBack = () => router.push("/dashboard");

  // Wait for client mount to avoid SSR mismatch
  if (!loaded) return null;

  if (!routeData || !routeData.stops?.length) {
    return <EmptyState onBack={handleBack} />;
  }

  const { stops, total_stops, zone } = routeData;

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-border bg-bg-base/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Back + title */}
          <div className="flex items-center gap-4 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              iconLeft={<IconArrowLeft />}
              onClick={handleBack}
            >
              Volver
            </Button>
            <div className="hidden sm:block w-px h-5 bg-border shrink-0" />
            <div className="min-w-0">
              <h1 className="text-sm font-medium text-text-primary truncate">
                Ruta optimizada · <span className="text-accent">{zone}</span>
              </h1>
              <p className="text-xs text-text-muted leading-tight">
                {total_stops} paradas ordenadas
              </p>
            </div>
          </div>

          {/* Share button */}
          <Button size="sm" iconRight={<IconArrowRight />}>
            Compartir con chofer
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {/* Mobile title (below header) */}
        <div className="sm:hidden mb-5">
          <h2 className="text-base font-medium text-text-primary">
            Ruta optimizada · <span className="text-accent">{zone}</span>
          </h2>
          <p className="text-sm text-text-muted mt-0.5">
            {total_stops} paradas ordenadas
          </p>
        </div>

        {/* Stops list */}
        <ol className="flex flex-col gap-3" aria-label="Lista de paradas">
          {stops.map((stop) => (
            <li
              key={stop.order}
              className="flex items-start gap-4 rounded-lg border border-border bg-bg-card px-4 py-4 hover:border-border/80 hover:bg-bg-surface transition-colors"
            >
              {/* Order number */}
              <span
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-accent-soft text-accent font-mono font-semibold text-base leading-none"
                aria-label={`Parada ${stop.order}`}
              >
                {stop.order}
              </span>

              {/* Address */}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm font-medium text-text-primary leading-snug">
                  {stop.address}
                </p>
                <p className="text-xs text-text-muted mt-0.5">{stop.localidad}</p>
              </div>

              {/* Map link */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${stop.lat},${stop.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors pt-1"
                aria-label={`Ver ${stop.address} en mapa`}
              >
                <IconExternalLink />
                Ver en mapa
              </a>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}

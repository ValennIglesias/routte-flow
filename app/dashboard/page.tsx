"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

// ---- Icons ----

function IconUpload({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconFile({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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

function IconLink({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconMap({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 2v16m8-12v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconWarehouse({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 21V9l9-6 9 6v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

// ---- Trash icon ----

function IconTrash({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---- Depot types ----

interface Depot {
  id: string;
  nombre: string;
  direccion: string;
  user_id: string;
}

// ---- DepotSelector component ----

interface DepotSelectorProps {
  onDepotChange: (address: string) => void;
  currentPlan: PlanType;
}

function DepotSelector({ onDepotChange, currentPlan }: DepotSelectorProps) {
  const supabase = createClient();
  const [depots, setDepots] = React.useState<Depot[]>([]);
  const [selectedDepotId, setSelectedDepotId] = React.useState("");
  const [showForm, setShowForm] = React.useState(false);
  const [formNombre, setFormNombre] = React.useState("");
  const [formDireccion, setFormDireccion] = React.useState("");
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const DEPOT_LIMITS: Record<string, number> = {
    starter: 1,
    basic: 1,
    pro: 3,
    business: 5,
  };
  const depotLimit = DEPOT_LIMITS[currentPlan] ?? 1;
  

  // Load depots on mount
  React.useEffect(() => {
    const loadDepots = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("depositos")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setDepots(data ?? []);

        // Auto-select first depot and notify parent
        if (data && data.length > 0) {
          setSelectedDepotId(data[0].id);
          onDepotChange(data[0].direccion);
        }
      } catch (err) {
        console.error("[v0] Error loading depots:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDepots();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedDepotId(id);
    const depot = depots.find((d) => d.id === id);
    if (depot) onDepotChange(depot.direccion);
  };

  const validateDireccion = (dir: string) => /\d/.test(dir);

  const handleSave = async () => {
    if (!formNombre.trim()) {
      setFormError("Ingresá un nombre para el depósito.");
      return;
    }
    if (!validateDireccion(formDireccion)) {
      setFormError("Ingresá una dirección válida con altura (ej: Av. Corrientes 1234)");
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      const { data, error } = await supabase
        .from("depositos")
        .insert({ nombre: formNombre.trim(), direccion: formDireccion.trim(), user_id: user.id })
        .select()
        .single();

      if (error) throw error;

      const newDepots = [...depots, data as Depot];
      setDepots(newDepots);
      setSelectedDepotId(data.id);
      onDepotChange(data.direccion);
      setShowForm(false);
      setFormNombre("");
      setFormDireccion("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al guardar";
      setFormError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (depotId: string) => {
    const depot = depots.find((d) => d.id === depotId);
    if (!depot) return;
    if (!window.confirm(`¿Eliminar el depósito "${depot.nombre}"?`)) return;

    try {
      const { error } = await supabase.from("depositos").delete().eq("id", depotId);
      if (error) throw error;

      const remaining = depots.filter((d) => d.id !== depotId);
      setDepots(remaining);

      if (selectedDepotId === depotId) {
        const next = remaining[0] ?? null;
        setSelectedDepotId(next?.id ?? "");
        onDepotChange(next?.direccion ?? "");
      }
    } catch (err) {
      console.error("[v0] Error deleting depot:", err);
    }
  };

  const atLimit = depots.length >= depotLimit;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted">
          Depósito de origen
        </span>
        <div className="h-9 rounded-md bg-bg-surface border border-border animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {depots.length > 0 ? (
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Select
              label="Depósito de origen"
              options={depots.map((d) => ({ value: d.id, label: `${d.nombre} — ${d.direccion}` }))}
              placeholder="Seleccioná un depósito"
              value={selectedDepotId}
              onChange={handleSelectChange}
              iconLeft={<IconWarehouse />}
            />
          </div>
          <button
            type="button"
            onClick={() => selectedDepotId && handleDelete(selectedDepotId)}
            className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-bg-surface text-text-muted hover:border-danger/50 hover:text-danger transition-colors"
            aria-label="Eliminar depósito"
          >
            <IconTrash />
          </button>
        </div>
      ) : !showForm ? (
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted">
            Depósito de origen
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowForm(true)}
            className="w-full justify-start border border-dashed border-border"
          >
            + Agregar depósito
          </Button>
        </div>
      ) : null}

      {/* Plan limit notice — shown when at depot limit */}
      {atLimit && !showForm && (
        <div className="flex items-start gap-2.5 rounded-md border border-accent/30 bg-accent/10 px-3 py-2.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0 text-accent">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-xs leading-relaxed text-accent">
            Estás en el plan {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} · Solo podés guardar {depotLimit} depósito{depotLimit > 1 ? "s" : ""}.{" "}
            <span className="font-semibold">Mejorá tu plan</span> para agregar más.
          </p>
        </div>
      )}

      {/* "+ Agregar" button when depots exist and below limit */}
      {depots.length > 0 && !showForm && !atLimit && (
        <div className="w-fit">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowForm(true)}
          >
            + Agregar depósito
          </Button>
        </div>
      )}

      {/* Inline form */}
      {showForm && (
        <div className="rounded-md border border-border bg-bg-surface p-4 flex flex-col gap-3">
          <Input
            label="Nombre del depósito"
            placeholder="Ej: Depósito Central"
            value={formNombre}
            onChange={(e) => setFormNombre(e.target.value)}
          />
          <Input
            label="Dirección"
            placeholder="Ej: Av. Corrientes 1234"
            value={formDireccion}
            onChange={(e) => setFormDireccion(e.target.value)}
            iconLeft={<IconWarehouse />}
            error={formError && !validateDireccion(formDireccion) ? formError : undefined}
          />
          {formError && validateDireccion(formDireccion) && (
            <p className="text-xs text-danger">{formError}</p>
          )}
          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setShowForm(false); setFormNombre(""); setFormDireccion(""); setFormError(null); }}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSave} loading={isSaving} disabled={isSaving}>
              Guardar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Zone options ----

const zoneOptions = [
  { value: "Zona Norte", label: "Zona Norte" },
  { value: "Zona Centro", label: "Zona Centro" },
  { value: "Zona Sur", label: "Zona Sur" },
  { value: "Zona Oeste", label: "Zona Oeste" },
  { value: "Zona Este", label: "Zona Este" },
];

// ---- Route type ----

interface RecentRoute {
  id: string;
  created_at: string;
  zone: string;
  total_stops: number;
}

// ---- Date formatter ----

function formatDateSpanish(dateString: string): string {
  const date = new Date(dateString);
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

// ---- Dropzone component ----

interface DropzoneProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

function Dropzone({ file, onFileSelect }: DropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidFile(droppedFile)) {
      onFileSelect(droppedFile);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isValidFile(selectedFile)) {
      onFileSelect(selectedFile);
    }
  };

  const isValidFile = (f: File) => {
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    return validTypes.includes(f.type) || f.name.endsWith(".csv") || f.name.endsWith(".xlsx") || f.name.endsWith(".xls");
  };

  const handleRemove = () => {
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-accent/40 bg-accent-soft p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent">
          <IconFile />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">{file.name}</p>
          <p className="text-xs text-text-muted">{(file.size / 1024).toFixed(1)} KB</p>
        </div>
        <button
          onClick={handleRemove}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-muted hover:bg-bg-surface hover:text-text-primary transition-colors"
          aria-label="Eliminar archivo"
        >
          <IconX />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={[
        "relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors duration-150",
        isDragging
          ? "border-accent bg-accent-soft"
          : "border-border hover:border-text-muted/50 hover:bg-bg-surface",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleChange}
        className="sr-only"
        aria-label="Subir archivo CSV o Excel"
      />
      <span className={["text-text-muted transition-colors", isDragging && "text-accent"].join(" ")}>
        <IconUpload size={32} />
      </span>
      <div className="text-center">
        <p className="text-sm text-text-primary">
          <span className="text-accent font-medium">Hacé click para subir</span> o arrastrá tu archivo
        </p>
        <p className="text-xs text-text-muted mt-1">CSV, XLS o XLSX</p>
      </div>
    </div>
  );
}

// ---- ManualStopsForm component ----

const MAX_MANUAL_STOPS = 23;

interface ManualStop {
  direccion: string;
  localidad: string;
}

interface ManualStopsFormProps {
  stops: ManualStop[];
  onChange: (stops: ManualStop[]) => void;
}

function ManualStopsForm({ stops, onChange }: ManualStopsFormProps) {
  const [direccion, setDireccion] = React.useState("");
  const [localidad, setLocalidad] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleAdd = () => {
    const trimDir = direccion.trim();
    const trimLoc = localidad.trim();

    if (!trimDir) {
      setError("La dirección no puede estar vacía.");
      return;
    }
    if (!/\d/.test(trimDir)) {
      setError("La dirección debe incluir una altura numérica (ej: Av. Corrientes 1234).");
      return;
    }
    if (stops.length >= MAX_MANUAL_STOPS) {
      setError(`Límite máximo de ${MAX_MANUAL_STOPS} paradas alcanzado.`);
      return;
    }

    setError(null);
    onChange([...stops, { direccion: trimDir, localidad: trimLoc }]);
    setDireccion("");
    setLocalidad("");
  };

  const handleRemove = (index: number) => {
    onChange(stops.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Input row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-xs font-medium text-text-muted">Dirección</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Av. Corrientes 1234"
            className="h-9 rounded-md border border-border bg-bg-surface px-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-xs font-medium text-text-muted">Localidad</label>
          <input
            type="text"
            value={localidad}
            onChange={(e) => setLocalidad(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buenos Aires"
            className="h-9 rounded-md border border-border bg-bg-surface px-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-text-muted select-none">&nbsp;</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAdd}
            disabled={stops.length >= MAX_MANUAL_STOPS}
            className="h-9 shrink-0"
          >
            + Agregar parada
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}

      {/* Counter */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted font-mono">
          {stops.length} de {MAX_MANUAL_STOPS} paradas
        </span>
        {stops.length > 0 && (
          <button
            onClick={() => onChange([])}
            className="text-xs text-text-muted hover:text-danger transition-colors"
          >
            Limpiar todo
          </button>
        )}
      </div>

      {/* Stops list */}
      {stops.length > 0 && (
        <ol className="flex flex-col gap-2">
          {stops.map((stop, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-md border border-border bg-bg-surface px-3 py-2"
            >
              <span className="font-mono text-xs text-text-muted w-5 shrink-0 text-right">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary truncate">{stop.direccion}</p>
                {stop.localidad && (
                  <p className="text-xs text-text-muted truncate">{stop.localidad}</p>
                )}
              </div>
              <button
                onClick={() => handleRemove(i)}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-text-muted hover:bg-danger/10 hover:text-danger transition-colors"
                aria-label={`Eliminar parada ${i + 1}`}
              >
                <IconX size={14} />
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

// ---- Credits widget ----

const PLAN_LIMITS: Record<string, number> = {
  starter: 10,
  basic: 35,
  pro: 80,
  business: 200,
};


type PlanType = "starter" | "basic" | "pro" | "business";

interface CreditsWidgetProps {
  used: number;
  total: number;
  isAtLimit: boolean;
  onUpgradeClick: () => void;
}

function CreditsWidget({ used, total, isAtLimit, onUpgradeClick }: CreditsWidgetProps) {
  const percentage = Math.min((used / total) * 100, 100);
  const isNearLimit = percentage >= 80;

  return (
    <Card padding="md">
      <CardHeader>
        <CardTitle>Créditos del mes</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="flex items-end justify-between mb-3">
          <span className={["text-3xl font-mono font-semibold", isAtLimit ? "text-danger" : "text-text-primary"].join(" ")}>
            {used}
          </span>
          <span className="text-sm text-text-muted">de {total} rutas</span>
        </div>
        <div className="h-2 w-full rounded-full bg-bg-surface overflow-hidden">
          <div
            className={[
              "h-full rounded-full transition-all duration-500",
              isAtLimit ? "bg-danger" : isNearLimit ? "bg-danger" : "bg-accent",
            ].join(" ")}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className={["text-xs mt-2", isAtLimit ? "text-danger font-medium" : "text-text-muted"].join(" ")}>
          {isAtLimit
            ? "Límite alcanzado · Mejorá tu plan"
            : `${total - used} rutas restantes este mes`}
        </p>
      </CardBody>
      <CardFooter>
        <Button variant="primary" size="sm" className="w-full" onClick={onUpgradeClick}>
          Mejorar plan
        </Button>
      </CardFooter>
    </Card>
  );
}

// ---- Plans modal ----

interface PlansModalProps {
  currentPlan: PlanType;
  onClose: () => void;
}

function PlansModal({ currentPlan, onClose }: PlansModalProps) {
  const [loadingPlan, setLoadingPlan] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSelectPlan = async (planId: "basic" | "pro" | "business") => {
    setLoadingPlan(planId);
    setError(null);

    try {
      const response = await fetch("/api/suscripcion/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear la suscripción");
      }

      if (data.init_point) {
        window.location.href = data.init_point;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
    } finally {
      setLoadingPlan(null);
    }
  };

  const plans = [
    {
      id: "starter" as const,
      name: "Starter",
      price: 0,
      routes: 10,
      features: ["10 rutas gratis", "1 depósito", "Exportar a Google Maps", "Soporte por email"],
    },
    {
      id: "basic" as const,
      name: "Basic",
      price: 15000,
      routes: 35,
      features: ["35 rutas por mes", "1 depósito", "Exportar a Google Maps", "Soporte por email"],
    },
    {
      id: "pro" as const,
      name: "Pro",
      price: 40000,
      routes: 80,
      highlighted: true,
      features: ["80 rutas por mes", "3 depósitos", "App para chofer", "Historial de rutas", "Soporte prioritario"],
    },
    {
      id: "business" as const,
      name: "Business",
      price: 90000,
      routes: 200,
      features: ["200 rutas por mes", "5 depósitos", "Múltiples usuarios", "API access", "Soporte dedicado"],
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
      <div className="w-full max-w-5xl rounded-xl border border-border bg-bg-base shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
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

        {/* Error banner */}
        {error && (
          <div className="mb-4 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            const isLoading = loadingPlan === plan.id;

            return (
              <Card
                key={plan.id}
                padding="lg"
                className={[
                  "relative flex flex-col",
                  plan.highlighted ? "border-accent ring-1 ring-accent/20" : "",
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
                      <span className="text-2xl font-bold">Gratis</span>
                    ) : (
                      <>
                        <span className="text-2xl font-bold">${plan.price.toLocaleString("es-AR")}</span>
                        <span className="text-text-muted text-sm">ARS / mes</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-text-muted">Rutas disponibles</span>
                    <span className="font-mono text-accent">{plan.routes}</span>
                  </div>
                  <div className="h-2 rounded-full bg-bg-surface overflow-hidden">
                    <div className="h-full rounded-full bg-accent w-full" />
                  </div>
                </div>

                <ul className="flex-1 space-y-2.5 mb-5">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-success shrink-0 mt-0.5">
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
                    onClick={() => handleSelectPlan(plan.id as "basic" | "pro" | "business")}
                    loading={isLoading}
                    disabled={isCurrent || isLoading || loadingPlan !== null}
                  >
                    {isCurrent ? "Plan actual" : "Elegir plan"}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>

        {/* Enterprise card */}
        <div className="mt-4 rounded-lg border border-border bg-bg-card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-text-muted uppercase tracking-wider">Enterprise</span>
            <p className="text-sm text-text-primary font-semibold mt-1">Rutas a medida · Depósitos a medida</p>
            <p className="text-xs text-text-muted mt-1">SLA dedicado, onboarding personalizado y precio a consultar.</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0"
            onClick={() => { window.location.href = "mailto:valen.iglesias3@gmail.com?subject=Plan Enterprise RouteFlow"; }}
          >
            Contactar
          </Button>
        </div>

        {/* Close button */}
        <div className="mt-6 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---- Empty state ----

function EmptyState() {
  return (
    <Card padding="lg">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <span className="text-text-muted/50 mb-4">
          <IconEmpty />
        </span>
        <h3 className="font-mono text-sm font-medium text-text-primary uppercase tracking-wide mb-2">
          Todavía no optimizaste ninguna ruta
        </h3>
        <p className="text-sm text-text-muted mb-6 max-w-xs">
          Subí tu primer archivo con direcciones y empezá a ahorrar tiempo en cada reparto.
        </p>
        <Button iconRight={<IconArrowRight />}>
          Empezá ahora
        </Button>
      </div>
    </Card>
  );
}

// ---- Routes table ----

interface RoutesTableProps {
  routes: RecentRoute[];
  isLoading: boolean;
}

function RoutesTable({ routes, isLoading }: RoutesTableProps) {
  if (isLoading) {
    return (
      <Card padding="none">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-mono text-sm font-medium text-text-primary uppercase tracking-wide">
            Rutas recientes
          </h3>
        </div>
        <div className="p-8 flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      </Card>
    );
  }

  if (routes.length === 0) {
    return <EmptyState />;
  }

  const handleViewLink = (routeId: string) => {
    window.open(`${window.location.origin}/ruta/${routeId}`, "_blank", "noopener,noreferrer");
  };

  return (
    <Card padding="none">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-mono text-sm font-medium text-text-primary uppercase tracking-wide">
          Rutas recientes
        </h3>
      </div>
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
                <td className="px-5 py-3 text-text-primary whitespace-nowrap">{formatDateSpanish(route.created_at)}</td>
                <td className="px-5 py-3 text-text-muted whitespace-nowrap">{route.zone}</td>
                <td className="px-5 py-3 text-text-muted">{route.total_stops}</td>
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
  );
}

// ---- Main Dashboard ----

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [inputMode, setInputMode] = React.useState<"file" | "manual">("file");
  const [manualStops, setManualStops] = React.useState<Array<{ direccion: string; localidad: string }>>([]);
  const [zone, setZone] = React.useState("");
  const [origin, setOrigin] = React.useState("");
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const [isOptimizing, setIsOptimizing] = React.useState(false);
  const [optimizeError, setOptimizeError] = React.useState<string | null>(null);
  const [recentRoutes, setRecentRoutes] = React.useState<RecentRoute[]>([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = React.useState(true);
  const [monthlyRouteCount, setMonthlyRouteCount] = React.useState(0);
  const [companyName, setCompanyName] = React.useState("tu empresa");
  const [currentPlan, setCurrentPlan] = React.useState<PlanType>("starter");
  const [showPlansModal, setShowPlansModal] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const routeLimit = PLAN_LIMITS[currentPlan] ?? 15;
  const isAtLimit = monthlyRouteCount >= routeLimit;

  // Function to reload dashboard data
  const reloadDashboardData = React.useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date();
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [routesResult, countResult, subscriptionResult] = await Promise.all([
        supabase
          .from("rutas")
          .select("id, created_at, zone, total_stops")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("rutas")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", firstOfMonth),
        supabase
          .from("suscripciones")
          .select("plan_id, estado")
          .eq("user_id", user.id)
          .eq("estado", "active")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      if (!routesResult.error) setRecentRoutes(routesResult.data ?? []);
      if (!countResult.error) setMonthlyRouteCount(countResult.count ?? 0);

      if (subscriptionResult.data?.plan_id) {
        const planId = subscriptionResult.data.plan_id as PlanType;
        if (planId === "pro" || planId === "business") {
          setCurrentPlan(planId);
        }
      }
    } catch (err) {
      console.error("[v0] Error reloading dashboard data:", err);
    }
  }, [supabase]);

  // Check for subscription confirmation on mount
  React.useEffect(() => {
    const confirmSubscription = async () => {
      const suscripcion = searchParams.get("suscripcion");
      const preapprovalId = searchParams.get("preapproval_id");

      if (preapprovalId) {
        try {
          const response = await fetch("/api/suscripcion/confirmar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ preapproval_id: preapprovalId }),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            setSuccessMessage("Plan actualizado correctamente!");
            await reloadDashboardData();
            // Auto-hide success message after 5 seconds
            setTimeout(() => setSuccessMessage(null), 5000);
          }
        } catch (err) {
          console.error("[v0] Error confirming subscription:", err);
        }

        // Clean up URL params
        router.replace("/dashboard");
      }
    };

    confirmSubscription();
  }, [searchParams, router, reloadDashboardData]);

  // Load routes, monthly count, and subscription from Supabase
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoadingRoutes(false);
          return;
        }

        // Use display name from user metadata if available
        if (user.user_metadata?.full_name) {
          setCompanyName(user.user_metadata.full_name);
        } else if (user.email) {
          setCompanyName(user.email.split("@")[0]);
        }

        // First day of current month in ISO format
        const now = new Date();
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        // Run all queries in parallel
        const [routesResult, countResult, subscriptionResult] = await Promise.all([
          supabase
            .from("rutas")
            .select("id, created_at, zone, total_stops")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(5),
          supabase
            .from("rutas")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .gte("created_at", firstOfMonth),
          supabase
  .from("suscripciones")
  .select("plan_id, estado")
  .eq("user_id", user.id)
  .eq("estado", "active")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
        ]);

        if (routesResult.error) throw routesResult.error;
        if (countResult.error) throw countResult.error;
        // subscriptionResult.error is ok if table doesn't exist yet

        setRecentRoutes(routesResult.data ?? []);
        setMonthlyRouteCount(countResult.count ?? 0);

        // Set current plan from subscription or default to starter
        if (subscriptionResult.data?.plan_id) {
          const planId = subscriptionResult.data.plan_id as PlanType;
          if (planId === "pro" || planId === "business") {
            setCurrentPlan(planId);
          }
        }
      } catch (err) {
        console.error("[v0] Error loading dashboard data:", err);
      } finally {
        setIsLoadingRoutes(false);
      }
    };
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("[v0] Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const canOptimize =
    (inputMode === "file" ? file !== null : manualStops.length > 0) &&
    zone !== "" && origin !== "" && !isAtLimit;

  const handleOptimize = async () => {
    if ((inputMode === "file" && !file) || (inputMode === "manual" && manualStops.length === 0) || !zone || !origin) {
      setOptimizeError("Por favor completá todos los campos: paradas, zona y depósito de origen.");
      return;
    }

    setIsOptimizing(true);
    setOptimizeError(null);

    try {
      const formData = new FormData();
      formData.append("zone", zone);
      formData.append("depot", origin);

      if (inputMode === "file") {
        formData.append("file", file!);
      } else {
        formData.append("stops", JSON.stringify(manualStops));
      }

      const response = await fetch("/api/optimize-route", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al optimizar la ruta");
      }

      // Store optimized route data in sessionStorage
      sessionStorage.setItem("optimizedRoute", JSON.stringify(data));

      // Redirect to preview page
      router.push("/ruta/preview");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al optimizar la ruta";
      setOptimizeError(errorMessage);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      {/* Plans modal */}
      {showPlansModal && (
        <PlansModal currentPlan={currentPlan} onClose={() => setShowPlansModal(false)} />
      )}

      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Welcome header */}
          <header className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-sans font-semibold text-text-primary">
                {getGreeting()}, {companyName}
              </h1>
        <div className="flex items-center gap-2 mt-1">
         <span className={[
         "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium",
          currentPlan === "business" ? "bg-accent text-bg-base" :
          currentPlan === "pro" ? "bg-accent/20 text-accent border border-accent/30" :
          "bg-bg-card text-text-muted border border-border"
            ].join(" ")}>
            {currentPlan === "business" ? "★ Business" : 
               currentPlan === "pro" ? "⚡ Pro" : 
               "Starter"}
              </span>
  
            </div>
            </div>
            <Button
              onClick={handleSignOut}
              loading={isSigningOut}
              disabled={isSigningOut}
              variant="ghost"
              size="md"
            >
              Cerrar sesion
            </Button>
          </header>

          {/* Success banner */}
          {successMessage && (
            <div className="mb-6 flex items-center gap-3 rounded-md border border-success/30 bg-success/10 px-4 py-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-success shrink-0" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-sm font-medium text-success">{successMessage}</p>
              <button
                onClick={() => setSuccessMessage(null)}
                className="ml-auto text-success/70 hover:text-success transition-colors"
                aria-label="Cerrar mensaje"
              >
                <IconX size={16} />
              </button>
            </div>
          )}

          {/* Layout: Main + Sidebar widget */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content area */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* New route card */}
              <Card padding="lg">
                <CardHeader>
                  <CardTitle as="h2">Nueva ruta</CardTitle>
                </CardHeader>
                <CardBody className="flex flex-col gap-5">
                  {/* Error banner */}
                  {optimizeError && (
                    <div className="rounded-md bg-danger/10 border border-danger/30 p-3 text-sm text-danger">
                      {optimizeError}
                    </div>
                  )}

                  {/* Input mode toggle */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setInputMode("file")}
                      className={[
                        "flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                        inputMode === "file"
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border bg-bg-surface text-text-muted hover:text-text-primary",
                      ].join(" ")}
                    >
                      Subir archivo
                    </button>
                    <button
                      onClick={() => setInputMode("manual")}
                      className={[
                        "flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                        inputMode === "manual"
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border bg-bg-surface text-text-muted hover:text-text-primary",
                      ].join(" ")}
                    >
                      Cargar manualmente
                    </button>
                  </div>

                  {/* File upload or manual form */}
                  {inputMode === "file" ? (
                    <Dropzone file={file} onFileSelect={setFile} />
                  ) : (
                    <ManualStopsForm stops={manualStops} onChange={setManualStops} />
                  )}

                  {/* Form fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Zona de reparto"
                      options={zoneOptions}
                      placeholder="Seleccioná una zona"
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                      iconLeft={<IconMap />}
                    />
                    <DepotSelector 
                      onDepotChange={(address) => setOrigin(address)}
                      currentPlan={currentPlan}
                    />
                  </div>
                </CardBody>
                <CardFooter className="justify-end">
                  <div className="relative group">
                    <Button
                      disabled={!canOptimize || isOptimizing}
                      loading={isOptimizing}
                      onClick={handleOptimize}
                      iconRight={<IconArrowRight />}
                    >
                      Optimizar Ruta
                    </Button>
                    {isAtLimit && (
                      <span className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-md border border-border bg-bg-elevated px-2.5 py-1.5 text-xs text-text-muted opacity-0 shadow-sm group-hover:opacity-100 transition-opacity">
                        Límite mensual alcanzado
                      </span>
                    )}
                  </div>
                </CardFooter>
              </Card>

              {/* Recent routes table */}
              <RoutesTable routes={recentRoutes} isLoading={isLoadingRoutes} />
            </div>

            {/* Credits widget - sidebar on desktop, bottom on mobile */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <CreditsWidget used={monthlyRouteCount} total={routeLimit} isAtLimit={isAtLimit} onUpgradeClick={() => setShowPlansModal(true)} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

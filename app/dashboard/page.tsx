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
import { useRouter } from "next/navigation";

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

const STARTER_DEPOT_LIMIT = 1;

interface DepotSelectorProps {
  onDepotChange: (address: string) => void;
}

function DepotSelector({ onDepotChange }: DepotSelectorProps) {
  const supabase = createClient();
  const [depots, setDepots] = React.useState<Depot[]>([]);
  const [selectedDepotId, setSelectedDepotId] = React.useState("");
  const [showForm, setShowForm] = React.useState(false);
  const [formNombre, setFormNombre] = React.useState("");
  const [formDireccion, setFormDireccion] = React.useState("");
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

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

  const atLimit = depots.length >= STARTER_DEPOT_LIMIT;

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

      {/* "+ Agregar" button when depots exist but below limit */}
      {depots.length > 0 && !showForm && (
        <div className="relative group w-fit">
          <Button
            variant="ghost"
            size="sm"
            disabled={atLimit}
            onClick={() => !atLimit && setShowForm(true)}
          >
            + Agregar depósito
          </Button>
          {atLimit && (
            <span className="pointer-events-none absolute bottom-full left-0 mb-1.5 whitespace-nowrap rounded bg-bg-elevated px-2 py-1 text-xs text-text-muted opacity-0 shadow group-hover:opacity-100 transition-opacity border border-border">
              Mejorá tu plan para agregar más depósitos
            </span>
          )}
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
  { value: "norte", label: "Zona Norte" },
  { value: "centro", label: "Zona Centro" },
  { value: "sur", label: "Zona Sur" },
  { value: "oeste", label: "Zona Oeste" },
  { value: "este", label: "Zona Este" },
];

// ---- Mock data ----

type RouteStatus = "pending" | "in-progress" | "completed";

interface RecentRoute {
  id: string;
  date: string;
  zone: string;
  stops: number;
  status: RouteStatus;
  link: string;
}

const mockRoutes: RecentRoute[] = [
  { id: "r1", date: "21 May 2026", zone: "Zona Norte", stops: 12, status: "completed", link: "/rutas/r1" },
  { id: "r2", date: "20 May 2026", zone: "Zona Centro", stops: 8, status: "completed", link: "/rutas/r2" },
  { id: "r3", date: "19 May 2026", zone: "Zona Sur", stops: 15, status: "in-progress", link: "/rutas/r3" },
  { id: "r4", date: "18 May 2026", zone: "Zona Oeste", stops: 6, status: "completed", link: "/rutas/r4" },
  { id: "r5", date: "17 May 2026", zone: "Zona Norte", stops: 10, status: "pending", link: "/rutas/r5" },
];

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

// ---- Credits widget ----

interface CreditsWidgetProps {
  used: number;
  total: number;
}

function CreditsWidget({ used, total }: CreditsWidgetProps) {
  const percentage = Math.min((used / total) * 100, 100);
  const isNearLimit = percentage >= 80;

  return (
    <Card padding="md">
      <CardHeader>
        <CardTitle>Créditos del mes</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="flex items-end justify-between mb-3">
          <span className="text-3xl font-mono font-semibold text-text-primary">{used}</span>
          <span className="text-sm text-text-muted">de {total} rutas</span>
        </div>
        <div className="h-2 w-full rounded-full bg-bg-surface overflow-hidden">
          <div
            className={[
              "h-full rounded-full transition-all duration-500",
              isNearLimit ? "bg-danger" : "bg-accent",
            ].join(" ")}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-text-muted mt-2">
          {total - used} rutas restantes este mes
        </p>
      </CardBody>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full">
          Mejorar plan
        </Button>
      </CardFooter>
    </Card>
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
}

function RoutesTable({ routes }: RoutesTableProps) {
  if (routes.length === 0) {
    return <EmptyState />;
  }

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
                <td className="px-5 py-3 text-text-primary whitespace-nowrap">{route.date}</td>
                <td className="px-5 py-3 text-text-muted whitespace-nowrap">{route.zone}</td>
                <td className="px-5 py-3 text-text-muted">{route.stops}</td>
                <td className="px-5 py-3">
                  <Badge variant={route.status} />
                </td>
                <td className="px-5 py-3 text-right">
                  <Button variant="ghost" size="sm" iconLeft={<IconLink />}>
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
  const [zone, setZone] = React.useState("");
  const [origin, setOrigin] = React.useState("");
  const [showEmptyState, setShowEmptyState] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const [isOptimizing, setIsOptimizing] = React.useState(false);
  const [optimizeError, setOptimizeError] = React.useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

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

  const canOptimize = file !== null && zone !== "" && origin !== "";

  const handleOptimize = async () => {
    if (!file || !zone || !origin) {
      setOptimizeError("Por favor completá todos los campos: archivo, zona y depósito de origen.");
      return;
    }

    setIsOptimizing(true);
    setOptimizeError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("zone", zone);
      formData.append("depot", origin);

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

  // User data (mock)
  const userData = {
    companyName: "Logística Pérez",
    usedRoutes: 8,
    totalRoutes: 40,
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
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Welcome header */}
          <header className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-sans font-semibold text-text-primary">
                {getGreeting()}, {userData.companyName}
              </h1>
              <p className="text-sm text-text-muted mt-1">
                {userData.usedRoutes} rutas usadas este mes de {userData.totalRoutes}
              </p>
            </div>
            <Button
              onClick={handleSignOut}
              loading={isSigningOut}
              disabled={isSigningOut}
              variant="ghost"
              size="md"
            >
              Cerrar sesión
            </Button>
          </header>

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

                  {/* Dropzone */}
                  <Dropzone file={file} onFileSelect={setFile} />

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
                    <DepotSelector onDepotChange={(address) => setOrigin(address)} />
                  </div>
                </CardBody>
                <CardFooter className="justify-end">
                  <Button
                    disabled={!canOptimize || isOptimizing}
                    loading={isOptimizing}
                    onClick={handleOptimize}
                    iconRight={<IconArrowRight />}
                  >
                    Optimizar Ruta
                  </Button>
                </CardFooter>
              </Card>

              {/* Recent routes table or empty state */}
              {showEmptyState ? (
                <EmptyState />
              ) : (
                <RoutesTable routes={mockRoutes} />
              )}
            </div>

            {/* Credits widget - sidebar on desktop, bottom on mobile */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <CreditsWidget used={userData.usedRoutes} total={userData.totalRoutes} />

                {/* Quick toggle for demo */}
                <div className="mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => setShowEmptyState(!showEmptyState)}
                  >
                    {showEmptyState ? "Ver rutas de ejemplo" : "Ver estado vacío"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

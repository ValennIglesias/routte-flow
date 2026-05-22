"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-text-muted border-b border-border pb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={["flex flex-wrap items-center gap-3", className].join(" ")}>
      {children}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DesignSystemPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          companyName="Transportes Andinos S.A."
          credits={{ used: 32, total: 40 }}
          userInitials="TA"
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto flex flex-col gap-10">

            {/* Title */}
            <div className="flex flex-col gap-1">
              <h1 className="font-mono text-2xl font-medium text-text-primary tracking-tight">
                RouteFlow Design System
              </h1>
              <p className="text-sm text-text-muted leading-relaxed">
                Sistema de componentes base para la plataforma de optimización de rutas.
              </p>
            </div>

            {/* Buttons */}
            <Section title="Button — Variantes">
              <Row>
                <Button variant="primary">Nueva ruta</Button>
                <Button variant="primary" iconLeft={<PlusIcon />}>Agregar parada</Button>
                <Button variant="primary" iconRight={<ArrowIcon />}>Optimizar</Button>
                <Button variant="primary" loading>Procesando...</Button>
                <Button variant="primary" disabled>Deshabilitado</Button>
              </Row>
              <Row>
                <Button variant="ghost">Cancelar</Button>
                <Button variant="ghost" iconLeft={<SearchIcon />}>Buscar rutas</Button>
                <Button variant="ghost" disabled>Deshabilitado</Button>
              </Row>
              <Row>
                <Button variant="destructive">Eliminar ruta</Button>
                <Button variant="destructive" disabled>Deshabilitado</Button>
              </Row>
              <Row>
                <Button variant="primary" size="sm">Pequeño</Button>
                <Button variant="primary" size="md">Mediano</Button>
                <Button variant="primary" size="lg">Grande</Button>
              </Row>
            </Section>

            {/* Badges */}
            <Section title="Badge — Estados de ruta">
              <Row>
                <Badge variant="pending" />
                <Badge variant="in-progress" />
                <Badge variant="completed" />
                <Badge variant="neutral">Sin asignar</Badge>
                <Badge variant="warning">Atrasada</Badge>
              </Row>
              <Row>
                <Badge variant="pending" dot={false} />
                <Badge variant="in-progress" dot={false} />
                <Badge variant="completed" dot={false} />
              </Row>
            </Section>

            {/* Cards */}
            <Section title="Card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Ruta #RUT-0042</CardTitle>
                    <Badge variant="in-progress" />
                  </CardHeader>
                  <CardBody>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Buenos Aires → Rosario → Córdoba. 3 paradas intermedias. 847 km estimados.
                    </p>
                  </CardBody>
                  <CardFooter>
                    <span className="font-mono text-xs text-text-muted">
                      Actualizado hace 12 min
                    </span>
                    <Button variant="ghost" size="sm" iconRight={<ArrowIcon />}>
                      Ver detalle
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ruta #RUT-0039</CardTitle>
                    <Badge variant="completed" />
                  </CardHeader>
                  <CardBody>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Mendoza → San Luis → San Juan. 2 paradas. 520 km. Completada a tiempo.
                    </p>
                  </CardBody>
                  <CardFooter>
                    <span className="font-mono text-xs text-text-muted">
                      Completada ayer
                    </span>
                    <Button variant="ghost" size="sm" iconRight={<ArrowIcon />}>
                      Ver detalle
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ruta #RUT-0045</CardTitle>
                    <Badge variant="pending" />
                  </CardHeader>
                  <CardBody>
                    <p className="text-sm text-text-muted leading-relaxed">
                      Tucumán → Salta → Jujuy. 4 paradas. Pendiente de asignación de conductor.
                    </p>
                  </CardBody>
                  <CardFooter>
                    <span className="font-mono text-xs text-text-muted">
                      Creada hace 2 h
                    </span>
                    <Button variant="primary" size="sm">
                      Asignar
                    </Button>
                  </CardFooter>
                </Card>

                <Card padding="lg">
                  <CardTitle className="mb-4">Resumen del día</CardTitle>
                  <CardBody>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: "Completadas", value: "12", color: "text-success" },
                        { label: "En curso", value: "5", color: "text-accent" },
                        { label: "Pendientes", value: "8", color: "text-text-muted" },
                      ].map((stat) => (
                        <div key={stat.label} className="flex flex-col gap-1">
                          <span className={["font-mono text-2xl font-medium", stat.color].join(" ")}>
                            {stat.value}
                          </span>
                          <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                            {stat.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Section>

            {/* Inputs */}
            <Section title="Input">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Dirección de origen" placeholder="Ej: Av. Corrientes 1234, CABA" />
                <Input
                  label="Dirección de destino"
                  placeholder="Ej: Ruta 9, km 203"
                  iconLeft={<SearchIcon />}
                />
                <Input
                  label="Capacidad (kg)"
                  type="number"
                  placeholder="0"
                  hint="Peso máximo de carga en kilogramos"
                />
                <Input
                  label="Código de ruta"
                  placeholder="RUT-0000"
                  error="El código ya existe en el sistema"
                />
              </div>
            </Section>

            {/* Select */}
            <Section title="Select">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Estado de ruta"
                  placeholder="Seleccionar estado..."
                  options={[
                    { value: "pending", label: "Pendiente" },
                    { value: "in-progress", label: "En curso" },
                    { value: "completed", label: "Completada" },
                  ]}
                />
                <Select
                  label="Conductor asignado"
                  placeholder="Seleccionar conductor..."
                  options={[
                    { value: "c1", label: "Carlos Mendoza" },
                    { value: "c2", label: "Laura Vega" },
                    { value: "c3", label: "Ramón Quispe" },
                  ]}
                  hint="Solo conductores disponibles en el turno"
                />
                <Select
                  label="Prioridad"
                  options={[
                    { value: "normal", label: "Normal" },
                    { value: "urgent", label: "Urgente" },
                    { value: "low", label: "Baja prioridad" },
                  ]}
                />
                <Select
                  label="Zona"
                  options={[]}
                  error="No hay zonas configuradas"
                />
              </div>
            </Section>

          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ---- Icons ----

function IconDashboard({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconRoutes({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 4h5a2 2 0 012 2v8a2 2 0 002 2h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="3" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="16" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconHistory({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 10a7 7 0 107 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 6L5.5 10 3 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSettings({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 2v1.5M10 16.5V18M2 10h1.5M16.5 10H18M4.1 4.1l1.06 1.06M14.84 14.84l1.06 1.06M4.1 15.9l1.06-1.06M14.84 5.16l1.06-1.06"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSupport({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.5 7.5a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="14.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

function IconCredits({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 9h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="6" cy="13" r="1" fill="currentColor" />
    </svg>
  );
}

function IconChevronLeft({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---- Nav Items ----

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <IconDashboard /> },
  { label: "Rutas", href: "/rutas", icon: <IconRoutes /> },
  { label: "Créditos", href: "/creditos", icon: <IconCredits /> },
  { label: "Configuración", href: "/configuracion", icon: <IconSettings /> },
  { label: "Soporte", href: "/soporte", icon: <IconSupport /> },
];

// ---- Sidebar ----

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Navegación principal"
      className={[
        "flex flex-col h-full bg-bg-surface border-r border-border transition-all duration-200",
        collapsed ? "w-14" : "w-56",
      ].join(" ")}
    >
      {/* Logo */}
      <div
        className={[
          "flex items-center h-14 border-b border-border shrink-0 overflow-hidden",
          collapsed ? "justify-center px-0" : "px-4 gap-2.5",
        ].join(" ")}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-accent text-bg-base">
          <IconRoutes size={15} />
        </span>
        {!collapsed && (
          <span className="font-mono text-sm font-medium tracking-wider text-text-primary whitespace-nowrap">
            RouteFlow
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto py-3 px-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={[
                "group flex items-center gap-3 rounded-md transition-colors duration-150 text-sm",
                collapsed ? "justify-center h-9 w-9 mx-auto" : "h-9 px-3",
                isActive
                  ? "bg-accent-soft text-accent"
                  : "text-text-muted hover:text-text-primary hover:bg-bg-card",
              ].join(" ")}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="shrink-0 border-t border-border p-2">
        <button
          onClick={onToggle}
          title={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          className={[
            "flex h-8 w-full items-center rounded-md text-text-muted transition-colors duration-150 hover:bg-bg-card hover:text-text-primary",
            collapsed ? "justify-center" : "justify-end px-2",
          ].join(" ")}
          aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          <span
            className={[
              "transition-transform duration-200",
              collapsed ? "rotate-180" : "",
            ].join(" ")}
          >
            <IconChevronLeft />
          </span>
        </button>
      </div>
    </aside>
  );
}

import * as React from "react";

interface CreditUsage {
  used: number;
  total: number;
}

interface HeaderProps {
  companyName: string;
  credits: CreditUsage;
  userInitials?: string;
}

function CreditBar({ used, total }: CreditUsage) {
  const pct = Math.min((used / total) * 100, 100);
  const isWarning = pct >= 80;
  const isDanger = pct >= 95;

  return (
    <div className="flex items-center gap-2.5" title={`${used} de ${total} rutas usadas`}>
      <div className="hidden sm:flex flex-col items-end gap-0.5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted leading-none">
          Rutas del mes
        </span>
        <span
          className={[
            "font-mono text-xs font-medium leading-none",
            isDanger
              ? "text-danger"
              : isWarning
              ? "text-accent"
              : "text-text-primary",
          ].join(" ")}
        >
          {used}{" "}
          <span className="text-text-muted font-normal">/ {total}</span>
        </span>
      </div>
      {/* Bar */}
      <div
        className="h-6 w-24 rounded bg-bg-card border border-border overflow-hidden flex items-center px-1"
        role="progressbar"
        aria-valuenow={used}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${used} de ${total} rutas usadas`}
      >
        <div
          className={[
            "h-3 rounded-sm transition-all duration-500",
            isDanger
              ? "bg-danger"
              : isWarning
              ? "bg-accent"
              : "bg-success",
          ].join(" ")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <span
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-bg-card border border-border font-mono text-[11px] font-medium text-text-muted uppercase select-none"
      aria-hidden="true"
    >
      {initials.slice(0, 2)}
    </span>
  );
}

export function Header({ companyName, credits, userInitials = "RF" }: HeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-bg-surface px-4 gap-4">
      {/* Left: Company name */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="font-mono text-xs uppercase tracking-widest text-text-muted whitespace-nowrap">
          Empresa
        </span>
        <span className="h-3 w-px bg-border" aria-hidden="true" />
        <span className="font-sans text-sm font-medium text-text-primary truncate">
          {companyName}
        </span>
      </div>

      {/* Right: Credits + Avatar */}
      <div className="flex items-center gap-4 shrink-0">
        <CreditBar {...credits} />
        <Avatar initials={userInitials} />
      </div>
    </header>
  );
}

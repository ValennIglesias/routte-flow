import * as React from "react";

type RouteStatus = "pending" | "in-progress" | "completed";
type BadgeVariant = RouteStatus | "neutral" | "warning";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  pending:
    "bg-[rgba(122,132,153,0.12)] text-text-muted border border-[rgba(122,132,153,0.25)]",
  "in-progress":
    "bg-accent-soft text-accent border border-[rgba(245,166,35,0.25)]",
  completed:
    "bg-[rgba(46,204,113,0.12)] text-success border border-[rgba(46,204,113,0.25)]",
  neutral:
    "bg-[rgba(122,132,153,0.12)] text-text-muted border border-border",
  warning:
    "bg-accent-soft text-accent border border-[rgba(245,166,35,0.25)]",
};

const dotClasses: Record<BadgeVariant, string> = {
  pending: "bg-text-muted",
  "in-progress": "bg-accent animate-pulse",
  completed: "bg-success",
  neutral: "bg-text-muted",
  warning: "bg-accent animate-pulse",
};

const labels: Record<RouteStatus, string> = {
  pending: "Pendiente",
  "in-progress": "En curso",
  completed: "Completada",
};

export function Badge({
  variant = "neutral",
  dot = true,
  children,
  className = "",
  ...props
}: BadgeProps) {
  const isRouteStatus = variant === "pending" || variant === "in-progress" || variant === "completed";
  const displayLabel = isRouteStatus && !children ? labels[variant as RouteStatus] : children;

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5",
        "font-mono text-[11px] font-medium leading-none tracking-wide uppercase",
        variantClasses[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {dot && (
        <span
          className={["inline-block h-1.5 w-1.5 rounded-full shrink-0", dotClasses[variant]].join(" ")}
          aria-hidden="true"
        />
      )}
      {displayLabel}
    </span>
  );
}

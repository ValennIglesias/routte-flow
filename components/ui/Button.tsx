import * as React from "react";

type ButtonVariant = "primary" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-bg-base font-medium hover:bg-accent/90 active:bg-accent/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
  ghost:
    "bg-transparent text-text-primary border border-border hover:bg-bg-card hover:border-text-muted/40 active:bg-bg-surface",
  destructive:
    "bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 active:bg-danger/15",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-7 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-base gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  iconLeft,
  iconRight,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={[
        "inline-flex items-center justify-center rounded-md font-sans transition-colors duration-150 cursor-pointer select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-base",
        "disabled:pointer-events-none disabled:opacity-40",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <span
          className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : (
        iconLeft && <span className="shrink-0">{iconLeft}</span>
      )}
      {children && <span>{children}</span>}
      {!loading && iconRight && (
        <span className="shrink-0">{iconRight}</span>
      )}
    </button>
  );
}

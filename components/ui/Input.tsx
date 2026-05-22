import * as React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function Input({
  label,
  hint,
  error,
  iconLeft,
  iconRight,
  id,
  className = "",
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {iconLeft && (
          <span className="pointer-events-none absolute left-3 flex shrink-0 items-center text-text-muted">
            {iconLeft}
          </span>
        )}
        <input
          id={inputId}
          className={[
            "h-9 w-full rounded-md bg-bg-surface border font-sans text-sm text-text-primary",
            "placeholder:text-text-muted/60",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            error
              ? "border-danger/60 focus:ring-danger/30 focus:border-danger/60"
              : "border-border hover:border-text-muted/40",
            iconLeft ? "pl-9" : "pl-3",
            iconRight ? "pr-9" : "pr-3",
            className,
          ].join(" ")}
          {...props}
        />
        {iconRight && (
          <span className="pointer-events-none absolute right-3 flex shrink-0 items-center text-text-muted">
            {iconRight}
          </span>
        )}
      </div>
      {(hint || error) && (
        <p
          className={[
            "text-xs",
            error ? "text-danger" : "text-text-muted",
          ].join(" ")}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

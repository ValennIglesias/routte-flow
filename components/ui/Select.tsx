import * as React from "react";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  hint,
  error,
  options,
  placeholder,
  id,
  className = "",
  ...props
}: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="font-mono text-[11px] font-medium uppercase tracking-widest text-text-muted"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          id={selectId}
          className={[
            "h-9 w-full appearance-none rounded-md bg-bg-surface border font-sans text-sm text-text-primary",
            "pl-3 pr-8",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            error
              ? "border-danger/60 focus:ring-danger/30 focus:border-danger/60"
              : "border-border hover:border-text-muted/40",
            className,
          ].join(" ")}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Chevron icon */}
        <span className="pointer-events-none absolute right-2.5 flex items-center text-text-muted">
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      {(hint || error) && (
        <p className={["text-xs", error ? "text-danger" : "text-text-muted"].join(" ")}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

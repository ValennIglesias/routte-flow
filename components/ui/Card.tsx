import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
};

export function Card({
  children,
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "rounded-lg bg-bg-card border border-border",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        paddingClasses[padding],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardHeader({ children, className = "", ...props }: CardHeaderProps) {
  return (
    <div
      className={["flex items-center justify-between mb-4", className].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4";
}

export function CardTitle({
  children,
  as: Tag = "h3",
  className = "",
  ...props
}: CardTitleProps) {
  return (
    <Tag
      className={[
        "font-mono text-sm font-medium text-text-primary tracking-wide uppercase",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </Tag>
  );
}

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardBody({ children, className = "", ...props }: CardBodyProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardFooter({ children, className = "", ...props }: CardFooterProps) {
  return (
    <div
      className={[
        "mt-4 pt-4 border-t border-border flex items-center justify-between",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

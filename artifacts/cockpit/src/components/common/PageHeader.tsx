import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-stretch gap-3">
        <div className="w-1 rounded-full bg-gradient-to-b from-primary to-primary/40 shrink-0" />
        <div>
          <h1 className="text-3xl font-sans text-foreground font-bold tracking-tight">{title}</h1>
          {subtitle && <div className="text-foreground/70 mt-1 text-sm font-medium">{subtitle}</div>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

import type { ComponentType, ReactNode } from "react";

export function Panel({
  icon: Icon,
  title,
  action,
  children,
  bodyClassName = "p-6",
  className = "",
}: {
  icon?: ComponentType<{ className?: string }>;
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  bodyClassName?: string;
  className?: string;
}) {
  return (
    <div className={`border border-card-border bg-card rounded shadow-sm overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="px-6 py-4 border-b border-card-border flex items-center justify-between gap-3 bg-gradient-to-b from-secondary/40 to-transparent">
          <div className="flex items-center gap-3">
            {Icon && (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary ring-1 ring-primary/15 shrink-0">
                <Icon className="h-4 w-4" />
              </span>
            )}
            {title && <h2 className="text-base font-bold tracking-tight text-card-foreground">{title}</h2>}
          </div>
          {action}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}

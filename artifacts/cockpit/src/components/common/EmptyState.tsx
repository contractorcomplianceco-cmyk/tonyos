import type { ComponentType } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      {Icon && <Icon className="h-8 w-8 text-muted-foreground/50 mb-3" />}
      <p className="text-sm font-semibold text-card-foreground tracking-tight">{title}</p>
      {description && <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-relaxed">{description}</p>}
    </div>
  );
}

import { AlertTriangle } from "lucide-react";

export function ErrorState({
  title = "Unable to load data",
  description = "Something went wrong while loading this section. Please try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <AlertTriangle className="h-8 w-8 text-red-500/70 mb-3" />
      <p className="text-sm font-semibold text-card-foreground tracking-tight">{title}</p>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-relaxed">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest border border-card-border rounded px-3 py-1.5 text-card-foreground hover:border-primary/50 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}

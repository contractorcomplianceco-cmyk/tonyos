import { Lock } from "lucide-react";

export function GuardrailNote({ text }: { text?: string }) {
  return (
    <div className="bg-background border border-border rounded px-4 py-2.5 flex items-center gap-3 text-sm shadow-sm">
      <Lock className="h-4 w-4 text-primary shrink-0" />
      <span className="font-semibold text-foreground tracking-tight">Recommend / Visibility Only:</span>
      <span className="text-foreground/70">
        {text ?? "Intelligence and recommendations only. Nothing is approved, committed, or signed without explicit written founder approval."}
      </span>
    </div>
  );
}

import { Eye, Search, Lightbulb, ShieldCheck, FileSignature } from "lucide-react";
import { authorityTone, type AuthorityTone } from "@/lib/authority";

const TONE_CLASS: Record<AuthorityTone, string> = {
  neutral: "bg-secondary text-secondary-foreground border-border",
  blue: "bg-primary/15 text-primary border-primary/30",
  amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  red: "bg-red-500/15 text-red-300 border-red-500/30",
};

function iconFor(label: string) {
  const l = label.toLowerCase();
  if (l.includes("view")) return Eye;
  if (l.includes("review")) return Search;
  if (l.includes("recommend")) return Lightbulb;
  if (l.includes("written")) return FileSignature;
  return ShieldCheck;
}

const SIZE_CLASS = {
  sm: "px-2 py-0.5 text-[9px] gap-1",
  md: "px-2.5 py-1 text-[10px] gap-1.5",
} as const;

export function AuthorityBadge({
  label,
  size = "sm",
  showIcon = true,
}: {
  label?: string | null;
  size?: keyof typeof SIZE_CLASS;
  showIcon?: boolean;
}) {
  if (!label) return null;
  const tone = authorityTone(label);
  const Icon = iconFor(label);
  return (
    <span
      className={`inline-flex items-center justify-center border font-mono font-bold uppercase tracking-wider rounded-[2px] ${SIZE_CLASS[size]} ${TONE_CLASS[tone]}`}
    >
      {showIcon && <Icon className={size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3"} />}
      {label}
    </span>
  );
}

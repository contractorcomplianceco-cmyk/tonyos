type Tone = "green" | "amber" | "red" | "blue" | "neutral";

const TONE_CLASS: Record<Tone, string> = {
  green: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  red: "bg-red-500/15 text-red-300 border-red-500/30",
  blue: "bg-primary/15 text-primary border-primary/30",
  neutral: "bg-secondary text-secondary-foreground border-border",
};

const STATUS_TONE: Record<string, Tone> = {
  // green
  on_track: "green",
  completed: "green",
  complete: "green",
  active: "green",
  signed: "green",
  connected: "green",
  approved: "green",
  published: "green",
  verified: "green",
  cleared: "green",
  enforced: "green",
  // amber
  watch: "amber",
  negotiation: "amber",
  attention: "amber",
  pending: "amber",
  in_review: "amber",
  in_progress: "amber",
  draft: "amber",
  monitoring: "amber",
  // red
  action_needed: "red",
  at_risk: "red",
  blocked: "red",
  declined: "red",
  disconnected: "red",
  error: "red",
  open: "red",
  // blue
  syncing: "blue",
  info: "blue",
  // neutral
  upcoming: "neutral",
  deferred: "neutral",
  planned: "neutral",
};

export function normalizeStatus(value: string): string {
  return value.toLowerCase().trim().replace(/[\s-]+/g, "_");
}

function severityTone(severity: string): Tone {
  const s = normalizeStatus(severity);
  if (s === "high") return "red";
  if (s === "medium") return "amber";
  if (s === "low") return "green";
  return "neutral";
}

const SIZE_CLASS = {
  sm: "px-2 py-0.5 text-[9px]",
  md: "px-2.5 py-1 text-[10px]",
} as const;

export function StatusBadge({
  status,
  severity,
  tone,
  label,
  size = "sm",
}: {
  status?: string;
  severity?: string;
  tone?: Tone;
  label?: string;
  size?: keyof typeof SIZE_CLASS;
}) {
  let resolvedTone: Tone = "neutral";
  let resolvedLabel = label ?? "";

  if (severity) {
    resolvedTone = tone ?? severityTone(severity);
    resolvedLabel = label ?? `${severity} Risk`;
  } else if (status) {
    resolvedTone = tone ?? STATUS_TONE[normalizeStatus(status)] ?? "neutral";
    resolvedLabel = label ?? status;
  } else if (tone) {
    resolvedTone = tone;
  }

  return (
    <span
      className={`inline-flex items-center justify-center border font-mono font-bold uppercase tracking-widest rounded-[2px] ${SIZE_CLASS[size]} ${TONE_CLASS[resolvedTone]}`}
    >
      {resolvedLabel.replace(/_/g, " ")}
    </span>
  );
}

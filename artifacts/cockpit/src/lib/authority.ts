// Authority-labeling system for recommend-only / visibility-only governance.
// IMPORTANT: only brand-approved tones are used. Even "Needs Rose approval"
// must NOT use pink/rose/purple — it maps to amber like other review states.

export type AuthorityTone = "neutral" | "blue" | "amber" | "red";

export const AUTHORITY_LABELS = [
  "View only",
  "Review",
  "Recommend",
  "Needs Rose approval",
  "Needs Carmen systems review",
  "Needs Tony founder review",
  "Needs both founder approval",
  "Requires written approval",
] as const;

export type AuthorityLabel = (typeof AUTHORITY_LABELS)[number];

const AUTHORITY_TONE: Record<string, AuthorityTone> = {
  "view only": "neutral",
  review: "blue",
  recommend: "blue",
  "needs rose approval": "amber",
  "needs carmen systems review": "amber",
  "needs tony founder review": "amber",
  "needs both founder approval": "red",
  "requires written approval": "red",
};

export function authorityTone(label?: string | null): AuthorityTone {
  if (!label) return "neutral";
  return AUTHORITY_TONE[label.toLowerCase().trim()] ?? "neutral";
}

// Founder Authority Mode is a presentational lens (visibility framing only).
export type AuthorityMode = "view" | "review" | "recommend" | "written";

export const AUTHORITY_MODES: { id: AuthorityMode; label: string; caption: string }[] = [
  { id: "view", label: "View", caption: "Full visibility across all authority levels." },
  { id: "review", label: "Review", caption: "Items at review and systems-review level." },
  { id: "recommend", label: "Recommend", caption: "Items where Tony can record a recommendation." },
  { id: "written", label: "Written Approval", caption: "Items requiring written founder approval." },
];

// Which authority labels each lens emphasizes. "view" emphasizes everything.
const MODE_LABELS: Record<AuthorityMode, Set<string>> = {
  view: new Set(AUTHORITY_LABELS.map((l) => l.toLowerCase())),
  review: new Set([
    "review",
    "needs carmen systems review",
    "needs rose approval",
    "needs tony founder review",
  ]),
  recommend: new Set([
    "recommend",
    "review",
    "needs tony founder review",
  ]),
  written: new Set([
    "requires written approval",
    "needs both founder approval",
  ]),
};

export function matchesMode(mode: AuthorityMode, label?: string | null): boolean {
  if (mode === "view") return true;
  if (!label) return false;
  return MODE_LABELS[mode].has(label.toLowerCase().trim());
}

// Health / level helpers shared across modules.
export type LevelTone = "green" | "amber" | "red" | "neutral";

const LEVEL_TONE: Record<string, LevelTone> = {
  "on track": "green",
  low: "green",
  strong: "green",
  healthy: "green",
  moderate: "amber",
  watch: "amber",
  elevated: "red",
  high: "red",
  "at risk": "red",
  critical: "red",
};

export function levelTone(level?: string | null): LevelTone {
  if (!level) return "neutral";
  return LEVEL_TONE[level.toLowerCase().trim()] ?? "neutral";
}

export function healthTone(health: number): LevelTone {
  if (health >= 75) return "green";
  if (health >= 55) return "amber";
  return "red";
}

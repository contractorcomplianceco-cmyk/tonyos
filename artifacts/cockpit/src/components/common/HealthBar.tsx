import { healthTone, type LevelTone } from "@/lib/authority";

const FILL: Record<LevelTone, string> = {
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  neutral: "bg-primary",
};

export function HealthBar({ value, showValue = true }: { value: number; showValue?: boolean }) {
  const tone = healthTone(value);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${FILL[tone]}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showValue && (
        <span className="text-[11px] font-mono tabular-nums text-card-foreground/70 w-7 text-right">
          {value}
        </span>
      )}
    </div>
  );
}

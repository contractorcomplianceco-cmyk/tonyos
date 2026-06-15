import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import type { Predictor } from "@workspace/api-client-react";
import { AuthorityBadge } from "@/components/common/AuthorityBadge";
import { levelTone, type LevelTone } from "@/lib/authority";

const LEVEL_CLASS: Record<LevelTone, { chip: string; bar: string }> = {
  green: { chip: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", bar: "bg-emerald-500" },
  amber: { chip: "bg-amber-500/15 text-amber-300 border-amber-500/30", bar: "bg-amber-500" },
  red: { chip: "bg-red-500/15 text-red-300 border-red-500/30", bar: "bg-red-500" },
  neutral: { chip: "bg-secondary text-secondary-foreground border-border", bar: "bg-primary" },
};

export function PredictorCard({ predictor }: { predictor: Predictor }) {
  const tone = levelTone(predictor.level);
  const c = LEVEL_CLASS[tone];
  const Trend = predictor.trend === "up" ? ArrowUpRight : predictor.trend === "down" ? ArrowDownRight : Minus;
  return (
    <div className="relative h-full rounded-md border border-card-border bg-card p-4 shadow-sm overflow-hidden flex flex-col">
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${c.bar}`} />
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm font-semibold text-card-foreground tracking-tight leading-tight">{predictor.name}</div>
        <span className={`shrink-0 inline-flex items-center border font-mono font-bold uppercase tracking-wider rounded-[2px] px-2 py-0.5 text-[9px] ${c.chip}`}>
          {predictor.level}
        </span>
      </div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">{predictor.category}</div>

      <div className="flex items-end gap-2 mt-3">
        {predictor.value && (
          <div className="text-2xl font-bold text-card-foreground tracking-tight tabular-nums leading-none">{predictor.value}</div>
        )}
        {predictor.trend && (
          <span className="inline-flex items-center text-[11px] font-bold text-muted-foreground pb-0.5">
            <Trend className="h-3 w-3" />
          </span>
        )}
      </div>

      {predictor.summary && (
        <p className="text-xs text-card-foreground/70 leading-relaxed mt-2 flex-1">{predictor.summary}</p>
      )}

      {predictor.authorityLabel && (
        <div className="mt-3 pt-3 border-t border-card-border">
          <AuthorityBadge label={predictor.authorityLabel} />
        </div>
      )}
    </div>
  );
}

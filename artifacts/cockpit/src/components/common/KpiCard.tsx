import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { StatusBadge } from "@/components/common/StatusBadge";

const KPI_TONE: Record<string, { bar: string; chip: string; border: string; spark: string; delta: string }> = {
  green: { bar: "bg-emerald-500", chip: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30", border: "hover:border-emerald-500/50", spark: "hsl(142 71% 45%)", delta: "text-emerald-400" },
  amber: { bar: "bg-amber-500", chip: "bg-amber-500/15 text-amber-300 ring-amber-500/30", border: "hover:border-amber-500/50", spark: "hsl(38 92% 50%)", delta: "text-amber-400" },
  red: { bar: "bg-red-500", chip: "bg-red-500/15 text-red-300 ring-red-500/30", border: "hover:border-red-500/50", spark: "hsl(0 84% 60%)", delta: "text-red-400" },
  blue: { bar: "bg-primary", chip: "bg-primary/15 text-primary ring-primary/30", border: "hover:border-primary/50", spark: "hsl(217 91% 60%)", delta: "text-primary" },
};

export function KpiCard({
  label,
  value,
  trend,
  change,
  unit,
  helper,
  icon: Icon,
  spark,
}: {
  label: string;
  value: string;
  trend?: string | null;
  change?: string | null;
  unit?: string | null;
  helper?: string | null;
  icon: any;
  spark?: number[];
}) {
  const tone = trend === "up" ? "green" : trend === "down" ? "amber" : "blue";
  const t = KPI_TONE[tone];
  const DeltaIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;
  const sparkData = spark?.map((v, i) => ({ i, v }));
  return (
    <div className={`border border-card-border rounded bg-card p-5 shadow-sm relative overflow-hidden group flex flex-col transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${t.border}`}>
      <div className={`absolute top-0 left-0 right-0 h-1 ${t.bar}`} />
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground pt-1">{label}</div>
        <span className={`shrink-0 inline-flex h-8 w-8 items-center justify-center rounded ring-1 ${t.chip}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="flex items-end gap-2 mb-3">
        <div className="text-3xl font-sans font-bold text-card-foreground tracking-tighter tabular-nums leading-none">
          {value}{unit && <span className="text-base font-semibold text-muted-foreground ml-0.5">{unit}</span>}
        </div>
        {change && (
          <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold tabular-nums pb-0.5 ${t.delta}`}>
            <DeltaIcon className="h-3 w-3" />{change}
          </span>
        )}
      </div>
      {sparkData && sparkData.length > 1 && (
        <div className="h-8 -mx-1 mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 2, right: 2, left: 2, bottom: 0 }}>
              <Area type="monotone" dataKey="v" stroke={t.spark} strokeWidth={1.5} fill={t.spark} fillOpacity={0.12} dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="mt-auto">
        <StatusBadge status={trend === "up" ? "on_track" : trend === "down" ? "watch" : "info"} label={helper || trend || ""} />
      </div>
    </div>
  );
}

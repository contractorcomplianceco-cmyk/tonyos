import { useState } from "react";
import { useGetPredictors } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Radar as RadarIcon } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Panel } from "@/components/common/Panel";
import { IntelRadar } from "@/components/common/IntelRadar";
import { PredictorCard } from "@/components/common/PredictorCard";

const CATEGORIES = ["All", "Financial", "Operational", "People", "Strategic", "Risk"] as const;

export default function Predictors() {
  const { data: predictors, isLoading, isError, refetch } = useGetPredictors();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");

  const all = predictors ?? [];
  const filtered = category === "All" ? all : all.filter((p) => p.category === category);
  const radarData = all.filter((p) => p.onRadar).slice(0, 8).map((p) => ({ label: p.name.split(" ")[0], score: p.score, level: p.level }));

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Predictive Intelligence"
        subtitle="18 forward-looking intelligence modules across financial, operational, people, strategic, and risk signals. Recommendation only."
      />

      <Panel icon={RadarIcon} title="Intelligence Radar">
        {isLoading ? <Skeleton className="h-64" /> : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : radarData.length > 0 ? (
          <>
            <IntelRadar data={radarData} />
            <p className="text-[11px] text-muted-foreground text-center mt-2">Composite health of the top monitored modules (higher is healthier).</p>
          </>
        ) : (
          <EmptyState icon={RadarIcon} title="No modules on radar" />
        )}
      </Panel>

      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((c) => {
          const activeCat = category === c;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-sm text-[10px] font-mono uppercase tracking-widest border transition-colors ${
                activeCat
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "border-card-border text-muted-foreground hover:text-card-foreground hover:border-primary/40"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-40 w-full rounded" />)}
        </div>
      ) : isError ? null : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => <PredictorCard key={p.id} predictor={p} />)}
        </div>
      ) : (
        <div className="border border-card-border bg-card rounded shadow-sm">
          <EmptyState icon={RadarIcon} title="No modules in this category" />
        </div>
      )}
    </div>
  );
}

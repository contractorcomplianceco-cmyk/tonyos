import { useState } from "react";
import { useGetDecisions } from "@workspace/api-client-react";
import type { GetDecisionsParams } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { AlertCircle, Calendar } from "lucide-react";
import { format } from "date-fns";

type StatusFilter = NonNullable<GetDecisionsParams["status"]>;
const FILTERS: { label: string; value: StatusFilter | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Deferred", value: "deferred" },
  { label: "Declined", value: "declined" },
];

export default function Decisions() {
  const [filter, setFilter] = useState<StatusFilter | "all">("all");
  const params = filter === "all" ? undefined : { status: filter };
  const { data: decisions, isLoading } = useGetDecisions(params);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-primary">Decision Queue</h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm tracking-tight uppercase">Recommend-Only Governance / Written Approval Required</p>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3 items-start text-sm text-primary/90">
        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-mono uppercase tracking-tight">
          Authority Guardrail: No commitment or action is taken until explicit written approval is provided. Review recommendations carefully.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md border transition-colors ${
              filter === f.value
                ? "bg-primary/15 border-primary/40 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {decisions?.map((decision) => (
            <Link key={decision.id} href={`/decisions/${decision.id}`}>
              <Card className="bg-card/40 border-border/50 hover:bg-card hover:border-primary/50 transition-all cursor-pointer group">
                <CardContent className="p-5 flex items-center justify-between gap-6">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded ${
                        decision.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                        decision.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        'bg-muted text-muted-foreground border border-border'
                      }`}>
                        {decision.status}
                      </span>
                      {decision.founderApprovalRequired && (
                        <span className="text-[10px] font-mono text-primary uppercase tracking-wider flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                          Approval Required
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-medium group-hover:text-primary transition-colors">{decision.title}</h3>
                    <div className="flex gap-4 text-xs text-muted-foreground font-mono uppercase tracking-tight pt-1">
                      <span>{decision.approvalType.replace(/_/g, ' ')}</span>
                      {decision.estimatedImpact && <span>&bull; {decision.estimatedImpact}</span>}
                    </div>
                  </div>
                  
                  <div className="text-right shrink-0 flex flex-col items-end gap-2">
                    <div className="text-sm font-mono text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(decision.dueDate), 'MMM d, yyyy')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

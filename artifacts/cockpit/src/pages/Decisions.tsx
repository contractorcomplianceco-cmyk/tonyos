import { useState } from "react";
import { useGetDecisions, useGetDecisionSummary } from "@workspace/api-client-react";
import type { GetDecisionsParams } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { AlertCircle, ChevronRight, Lock } from "lucide-react";
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
  const { data: summary } = useGetDecisionSummary();

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-sans text-foreground font-bold tracking-tight">Major Decisions</h1>
        <p className="text-foreground/70 mt-1 text-sm font-medium">Recommend-Only Governance / Written Approval Required</p>
      </div>

      <div className="bg-sidebar border border-sidebar-border rounded px-5 py-4 flex gap-3 items-start text-sm shadow-sm text-sidebar-foreground">
        <Lock className="h-5 w-5 text-primary shrink-0" />
        <p className="font-semibold tracking-tight">
          Authority Guardrail: <span className="font-medium text-sidebar-foreground/70">No commitment or action is taken until explicit written approval is provided. Review recommendations carefully.</span>
        </p>
      </div>

      {summary && filter === "all" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-card-border rounded p-5 bg-card shadow-sm">
            <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Pending</div>
            <div className="text-3xl font-sans font-bold text-primary tracking-tighter mt-2 tabular-nums">{summary.pendingApproval}</div>
          </div>
          <div className="border border-card-border rounded p-5 bg-card shadow-sm">
            <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Total Impact</div>
            <div className="text-3xl font-sans font-bold text-card-foreground tracking-tighter mt-2 tabular-nums">{summary.totalImpact}</div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 text-[10px] font-mono uppercase tracking-widest rounded border transition-colors ${
              filter === f.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-card-border hover:border-primary/50 hover:text-card-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="border border-card-border bg-card rounded shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-card-border flex items-center justify-between">
          <h2 className="text-base font-bold tracking-tight text-card-foreground">Governance Review Queue</h2>
        </div>
        <div className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full rounded" />)}
            </div>
          ) : (
            <div className="divide-y divide-card-border">
              {decisions?.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground text-sm italic">
                  No decisions found for this filter.
                </div>
              ) : decisions?.map((decision) => (
                <Link key={decision.id} href={`/decisions/${decision.id}`} className="block group hover:bg-secondary transition-colors p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <StatusChip status={decision.status} />
                        {decision.founderApprovalRequired && (
                          <span className="text-[9px] font-mono text-primary uppercase tracking-widest border border-primary/20 bg-primary/5 px-1.5 py-0.5 rounded-[2px]">
                            Approval Required
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-card-foreground truncate">{decision.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                        <span className="font-semibold text-card-foreground/80 uppercase tracking-wider text-[10px]">{decision.approvalType.replace(/_/g, ' ')}</span>
                        {decision.estimatedImpact && (
                          <>
                            <span className="text-card-border">&bull;</span>
                            <span className="font-mono">{decision.estimatedImpact}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right shrink-0 flex items-center gap-5">
                      <div className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground hidden sm:block">
                        {format(new Date(decision.dueDate), 'MMM d, yyyy')}
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  let colorClass = "bg-secondary text-secondary-foreground border-border";
  let label = status.replace(/_/g, ' ');

  if (status === 'approved') {
    colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (status === 'pending') {
    colorClass = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (status === 'declined') {
    colorClass = "bg-red-50 text-red-700 border-red-200";
  }

  return (
    <span className={`inline-flex items-center justify-center border font-mono uppercase tracking-widest rounded-[2px] px-2 py-0.5 text-[9px] ${colorClass}`}>
      {label}
    </span>
  );
}

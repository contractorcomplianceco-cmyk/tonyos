import { useState } from "react";
import { useGetDecisions, useGetDecisionSummary } from "@workspace/api-client-react";
import type { GetDecisionsParams } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { AlertCircle, Calendar, ChevronRight } from "lucide-react";
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
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-serif text-foreground font-medium tracking-tight">Major Decisions</h1>
        <p className="text-muted-foreground mt-1 text-sm">Recommend-Only Governance / Written Approval Required</p>
      </div>

      <div className="bg-secondary/30 border border-border rounded-md px-4 py-3 flex gap-3 items-start text-sm">
        <AlertCircle className="h-5 w-5 text-primary shrink-0" />
        <p className="font-medium text-foreground">
          Authority Guardrail: <span className="font-normal text-muted-foreground">No commitment or action is taken until explicit written approval is provided. Review recommendations carefully.</span>
        </p>
      </div>

      {summary && filter === "all" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-border rounded-md p-3 bg-card shadow-sm">
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Pending</div>
            <div className="text-2xl font-serif text-primary mt-1">{summary.pendingApproval}</div>
          </div>
          <div className="border border-border rounded-md p-3 bg-card shadow-sm">
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Impact</div>
            <div className="text-2xl font-serif text-foreground mt-1">{summary.totalImpact}</div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 text-xs font-medium uppercase tracking-wider rounded-md border transition-colors ${
              filter === f.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full rounded-md" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {decisions?.length === 0 ? (
            <div className="text-center p-8 border border-border rounded-md text-muted-foreground text-sm italic">
              No decisions found for this filter.
            </div>
          ) : decisions?.map((decision) => (
            <Link key={decision.id} href={`/decisions/${decision.id}`} className="block group">
              <div className="bg-card border border-border rounded-md p-4 shadow-sm hover:border-primary/50 transition-colors flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusChip status={decision.status} />
                    {decision.founderApprovalRequired && (
                      <span className="text-[9px] font-mono text-primary uppercase tracking-widest border border-primary/20 bg-primary/5 px-1.5 py-0.5 rounded-sm">
                        Approval Required
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-medium text-foreground truncate">{decision.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1.5">
                    <span className="font-medium text-foreground/80">{decision.approvalType.replace(/_/g, ' ')}</span>
                    {decision.estimatedImpact && (
                      <>
                        <span className="text-border">&bull;</span>
                        <span className="font-mono">{decision.estimatedImpact}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="text-right shrink-0 flex items-center gap-4">
                  <div className="text-xs text-muted-foreground font-medium hidden sm:block">
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
    <span className={`inline-flex items-center justify-center border font-medium uppercase tracking-wider rounded-sm px-1.5 py-0.5 text-[9px] ${colorClass}`}>
      {label}
    </span>
  );
}

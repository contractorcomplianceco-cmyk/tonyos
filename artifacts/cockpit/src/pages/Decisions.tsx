import { useState } from "react";
import { useGetDecisions, useGetDecisionSummary } from "@workspace/api-client-react";
import type { GetDecisionsParams } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { ChevronRight, Lock, GanttChartSquare } from "lucide-react";
import { format } from "date-fns";
import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { AuthorityBadge } from "@/components/common/AuthorityBadge";
import { useAuthorityMode, AuthorityModeToggle } from "@/context/AuthorityMode";
import { matchesMode } from "@/lib/authority";

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
  const { data: decisions, isLoading, isError, refetch } = useGetDecisions(params);
  const { data: summary } = useGetDecisionSummary();
  const { mode, caption } = useAuthorityMode();

  const visible = (decisions ?? []).filter((d) => matchesMode(mode, d.authorityLabel));

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Major Decisions"
        subtitle="Recommend-Only Governance / Written Approval Required"
        actions={
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Authority Mode</span>
              <AuthorityModeToggle />
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">{caption}</div>
          </div>
        }
      />

      <div className="bg-card border border-card-border rounded px-5 py-4 flex gap-3 items-start text-sm shadow-sm text-card-foreground">
        <Lock className="h-5 w-5 text-primary shrink-0" />
        <p className="font-semibold tracking-tight">
          Authority Guardrail: <span className="font-medium text-muted-foreground">No commitment or action is taken until explicit written approval is provided. Review recommendations carefully.</span>
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

      <Panel title="Governance Review Queue" bodyClassName="p-0">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full rounded" />)}
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={GanttChartSquare}
            title="No decisions found"
            description={`No decisions match this filter under the ${mode} authority lens.`}
          />
        ) : (
          <div className="divide-y divide-card-border">
            {visible.map((decision) => (
              <Link key={decision.id} href={`/decisions/${decision.id}`} className="block group hover:bg-secondary transition-colors p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <StatusBadge status={decision.status} />
                      {decision.brandCode && (
                        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest border border-card-border px-1.5 py-0.5 rounded-[2px]">
                          {decision.brandCode}
                        </span>
                      )}
                      <AuthorityBadge label={decision.authorityLabel} />
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
      </Panel>
    </div>
  );
}

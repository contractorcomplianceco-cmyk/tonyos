import { useGetSourceRecords, useGetGuardrails } from "@workspace/api-client-react";
import { useSearch } from "wouter";
import { useEffect, useMemo, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, Lock, CheckCircle2, ShieldAlert } from "lucide-react";
import { format } from "date-fns";
import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { GuardrailNote } from "@/components/common/GuardrailNote";

export default function Brain() {
  const { data: records, isLoading: loadingRecords, isError: recordsError, refetch: refetchRecords } = useGetSourceRecords();
  const { data: guardrails, isLoading: loadingGuardrails, isError: guardrailsError, refetch: refetchGuardrails } = useGetGuardrails();

  const search = useSearch();
  const highlight = useMemo(() => new URLSearchParams(search).get("record"), [search]);
  const highlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (highlight && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlight, records]);

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Company Brain"
        subtitle="Source record integrity and authority guardrails across the CAG portfolio."
      />

      <GuardrailNote text="Company Brain is read-only intelligence. Source records and authority guardrails are for visibility — no system of record is changed without written founder approval." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Records */}
        <div className="space-y-6">
          <Panel icon={Database} title="Source Records" bodyClassName="p-6 space-y-4">
            <div className="bg-emerald-500/10 text-emerald-200 border border-emerald-500/30 rounded p-4 mb-2 text-sm flex gap-3 shadow-sm">
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-400" />
              <p className="font-medium leading-relaxed">CLP Separation Guardrail: All listed systems are cleared. Non-cleared systems are firewalled.</p>
            </div>

            {loadingRecords ? (
              <Skeleton className="h-64 rounded border-border" />
            ) : recordsError ? (
              <ErrorState onRetry={() => refetchRecords()} />
            ) : records?.length === 0 ? (
              <EmptyState icon={Database} title="No source records" description="No source records are currently connected." />
            ) : records?.map((rec) => {
              const isHighlighted = !!highlight && rec.title === highlight;
              return (
              <div
                key={rec.id}
                ref={isHighlighted ? highlightRef : undefined}
                className={`border rounded p-4 flex justify-between items-center transition-colors ${isHighlighted ? "border-primary ring-1 ring-primary/40 bg-primary/5" : "border-card-border bg-secondary hover:border-primary/50"}`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-sm font-semibold text-card-foreground">{rec.title}</h3>
                    {rec.clpCleared && (
                      <span className="bg-emerald-500/15 text-emerald-300 px-1.5 py-0.5 rounded-[2px] text-[9px] font-mono uppercase tracking-widest border border-emerald-500/30 font-bold">
                        Cleared
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground flex gap-2">
                    <span>{rec.source}</span>
                    <span className="text-card-border">&bull;</span>
                    <span>{rec.type}</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <StatusBadge status={rec.status} />
                  <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground mt-3 font-bold">
                    Updated {format(new Date(rec.lastUpdated), 'MMM d')}
                  </div>
                </div>
              </div>
              );
            })}
          </Panel>
        </div>

        {/* Guardrails */}
        <div className="space-y-6">
          <div className="border border-sidebar-border bg-sidebar rounded shadow-sm overflow-hidden text-sidebar-foreground">
            <div className="px-6 py-4 border-b border-sidebar-border flex items-center gap-3">
              <Lock className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold tracking-tight">Authority Guardrails</h2>
            </div>
            <div className="p-6 space-y-4">
              {loadingGuardrails ? (
                <Skeleton className="h-64 rounded bg-sidebar-border" />
              ) : guardrailsError ? (
                <ErrorState onRetry={() => refetchGuardrails()} />
              ) : guardrails?.length === 0 ? (
                <EmptyState icon={Lock} title="No guardrails" description="No authority guardrails have been configured." />
              ) : guardrails?.map((g) => (
                <div key={g.id} className="border border-sidebar-border rounded p-5 bg-sidebar-accent/30 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      {g.status.toLowerCase() === 'active' || g.status.toLowerCase() === 'enforced' ? <Lock className="h-4 w-4 text-primary" /> : <ShieldAlert className="h-4 w-4 text-amber-500" />}
                      <h3 className="text-sm font-bold tracking-tight">{g.title}</h3>
                    </div>
                    <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-[2px] border font-bold ${
                      g.status.toLowerCase() === 'active' || g.status.toLowerCase() === 'enforced' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}>
                      {g.status}
                    </span>
                  </div>
                  <p className="text-xs text-sidebar-foreground/70 mt-3 leading-relaxed ml-7 font-medium">{g.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

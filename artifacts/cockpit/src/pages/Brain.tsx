import { useGetSourceRecords, useGetGuardrails } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, Lock, CheckCircle2, ShieldAlert } from "lucide-react";
import { format } from "date-fns";

export default function Brain() {
  const { data: records, isLoading: loadingRecords } = useGetSourceRecords();
  const { data: guardrails, isLoading: loadingGuardrails } = useGetGuardrails();

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-sans text-foreground font-bold tracking-tight">Company Brain</h1>
        <p className="text-foreground/70 mt-1 text-sm font-medium">Source record integrity and authority guardrails.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Records */}
        <div className="space-y-6">
          <div className="border border-card-border bg-card rounded shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-card-border flex items-center gap-3">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold tracking-tight text-card-foreground">Source Records</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded p-4 mb-2 text-sm flex gap-3 shadow-sm">
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
                <p className="font-medium leading-relaxed">CLP Separation Guardrail: All listed systems are cleared. Non-cleared systems are firewalled.</p>
              </div>

              {loadingRecords ? <Skeleton className="h-64 rounded border-border" /> : records?.map((rec) => (
                <div key={rec.id} className="border border-card-border rounded p-4 flex justify-between items-center bg-secondary hover:border-primary/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-sm font-semibold text-card-foreground">{rec.title}</h3>
                      {rec.clpCleared && (
                        <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-[2px] text-[9px] font-mono uppercase tracking-widest border border-emerald-200 font-bold">
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
                    <StatusChip status={rec.status} />
                    <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground mt-3 font-bold">
                      Updated {format(new Date(rec.lastUpdated), 'MMM d')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Guardrails */}
        <div className="space-y-6">
          <div className="border border-sidebar-border bg-sidebar rounded shadow-sm overflow-hidden text-sidebar-foreground">
            <div className="px-6 py-4 border-b border-sidebar-border flex items-center gap-3">
              <Lock className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold tracking-tight">Authority Guardrails</h2>
            </div>
            <div className="p-6 space-y-4">
              {loadingGuardrails ? <Skeleton className="h-64 rounded bg-sidebar-border" /> : guardrails?.map((g) => (
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

function StatusChip({ status }: { status: string }) {
  let colorClass = "bg-secondary text-secondary-foreground border-border";
  let label = status.replace(/_/g, ' ');

  if (status === 'connected' || status === 'active') {
    colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (status === 'syncing') {
    colorClass = "bg-primary/10 text-primary border-primary/20";
  } else if (status === 'disconnected' || status === 'error') {
    colorClass = "bg-red-50 text-red-700 border-red-200";
  }

  return (
    <span className={`inline-flex items-center justify-center border font-mono font-bold uppercase tracking-widest rounded-[2px] px-2 py-0.5 text-[9px] ${colorClass}`}>
      {label}
    </span>
  );
}

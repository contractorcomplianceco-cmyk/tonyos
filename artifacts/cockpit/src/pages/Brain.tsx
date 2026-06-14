import { useGetSourceRecords, useGetGuardrails } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, Lock, CheckCircle2, ShieldAlert } from "lucide-react";
import { format } from "date-fns";

export default function Brain() {
  const { data: records, isLoading: loadingRecords } = useGetSourceRecords();
  const { data: guardrails, isLoading: loadingGuardrails } = useGetGuardrails();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-serif text-foreground font-medium tracking-tight">Company Brain</h1>
        <p className="text-muted-foreground mt-1 text-sm">Source record integrity and authority guardrails.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Records */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" /> Source Records
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md p-3 mb-4 text-sm flex gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                <p>CLP Separation Guardrail: All listed systems are cleared. Non-cleared systems are firewalled.</p>
              </div>

              {loadingRecords ? <Skeleton className="h-64" /> : records?.map((rec) => (
                <div key={rec.id} className="border border-border rounded-md p-3 flex justify-between items-center bg-card shadow-sm hover:border-primary/30 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-foreground">{rec.title}</h3>
                      {rec.clpCleared && (
                        <span className="bg-emerald-100 text-emerald-700 px-1 rounded text-[9px] font-mono uppercase tracking-widest border border-emerald-200">
                          Cleared
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex gap-2">
                      <span>{rec.source}</span>
                      <span>&bull;</span>
                      <span className="capitalize">{rec.type}</span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <StatusChip status={rec.status} />
                    <div className="text-[10px] font-mono text-muted-foreground mt-2">
                      Updated {format(new Date(rec.lastUpdated), 'MMM d')}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Guardrails */}
        <div className="space-y-6">
          <Card className="shadow-sm border-border bg-secondary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" /> Authority Guardrails
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingGuardrails ? <Skeleton className="h-64" /> : guardrails?.map((g) => (
                <div key={g.id} className="border border-border rounded-md p-4 bg-card shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      {g.status === 'enforced' ? <Lock className="h-4 w-4 text-primary" /> : <ShieldAlert className="h-4 w-4 text-amber-500" />}
                      <h3 className="text-sm font-medium text-foreground">{g.title}</h3>
                    </div>
                    <span className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                      g.status === 'enforced' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {g.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed ml-6">{g.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
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
    <span className={`inline-flex items-center justify-center border font-medium uppercase tracking-wider rounded-sm px-1.5 py-0.5 text-[9px] ${colorClass}`}>
      {label}
    </span>
  );
}

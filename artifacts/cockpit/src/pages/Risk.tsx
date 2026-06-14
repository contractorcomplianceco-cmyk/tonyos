import { useGetRiskItems, useGetRoadmapPhases } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldAlert, Cpu } from "lucide-react";

export default function Risk() {
  const { data: risks, isLoading: loadingRisks } = useGetRiskItems();
  const { data: roadmap, isLoading: loadingRoadmap } = useGetRoadmapPhases();

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-sans text-foreground font-bold tracking-tight">Risk & Platform Strategy</h1>
        <p className="text-foreground/70 mt-1 text-sm font-medium">Strategic risk oversight and AI/Platform roadmap visibility.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risks */}
        <div className="space-y-6">
          <div className="border border-card-border bg-card rounded shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-card-border flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold tracking-tight text-card-foreground">Compliance & Risk Audit</h2>
            </div>
            <div className="p-6 space-y-4">
              {loadingRisks ? <Skeleton className="h-64 rounded border-border" /> : risks?.map((risk) => (
                <div key={risk.id} className="border border-card-border rounded p-5 bg-secondary hover:border-primary/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-card-foreground">{risk.name}</h3>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">{risk.category}</p>
                    </div>
                    <StatusChip severity={risk.severity} />
                  </div>
                  {risk.summary && <p className="text-xs text-card-foreground/70 mt-3 leading-relaxed">{risk.summary}</p>}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-card-border text-[10px] font-mono uppercase tracking-widest font-semibold">
                    <span className="text-muted-foreground">Status: <span className="text-card-foreground">{risk.status}</span></span>
                    {risk.openFindings !== undefined && (
                      <span className="text-primary">{risk.openFindings} findings</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Roadmap */}
        <div className="space-y-6">
          <div className="border border-card-border bg-card rounded shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-card-border flex items-center gap-3">
              <Cpu className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold tracking-tight text-card-foreground">AI / Platform Roadmap</h2>
            </div>
            <div className="p-6 space-y-4">
              {loadingRoadmap ? <Skeleton className="h-64 rounded border-border" /> : roadmap?.map(phase => (
                <div key={phase.id} className="border border-card-border rounded p-5 bg-secondary hover:border-primary/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-[10px] font-mono text-primary uppercase tracking-widest mb-1.5 font-bold">{phase.phase}</div>
                      <h3 className="text-sm font-semibold text-card-foreground">{phase.title}</h3>
                    </div>
                    <PhaseStatus status={phase.status} />
                  </div>
                  {phase.description && <p className="text-xs text-card-foreground/70 mt-2 leading-relaxed">{phase.description}</p>}
                  
                  <div className="mt-5 space-y-2">
                    <div className="flex justify-between text-[10px] uppercase font-mono tracking-widest text-muted-foreground font-bold">
                      <span>Progress</span>
                      <span>{phase.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${phase.progress}%` }} />
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-[10px] uppercase font-mono tracking-widest text-muted-foreground mt-5 pt-4 border-t border-card-border font-bold">
                    <span>{phase.vendor || 'Internal'}</span>
                    <span>{phase.timeline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusChip({ severity }: { severity: string }) {
  let colorClass = "bg-secondary text-secondary-foreground border-border";
  
  if (severity === 'high') {
    colorClass = "bg-red-50 text-red-700 border-red-200";
  } else if (severity === 'medium') {
    colorClass = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (severity === 'low') {
    colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  return (
    <span className={`inline-flex items-center justify-center border font-mono uppercase tracking-widest font-bold rounded-[2px] px-2 py-0.5 text-[9px] ${colorClass}`}>
      {severity} Risk
    </span>
  );
}

function PhaseStatus({ status }: { status: string }) {
  let colorClass = "bg-secondary text-secondary-foreground border-border";
  let label = status.replace(/_/g, ' ');

  if (status === 'completed') {
    colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (status === 'in_progress') {
    colorClass = "bg-primary/10 text-primary border-primary/20";
  } else if (status === 'upcoming') {
    colorClass = "bg-secondary text-muted-foreground border-border";
  }

  return (
    <span className={`inline-flex items-center justify-center border font-mono uppercase tracking-widest font-bold rounded-[2px] px-2 py-0.5 text-[9px] ${colorClass}`}>
      {label}
    </span>
  );
}

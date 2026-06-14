import { useGetRiskItems, useGetRoadmapPhases } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldAlert, Cpu } from "lucide-react";

export default function Risk() {
  const { data: risks, isLoading: loadingRisks } = useGetRiskItems();
  const { data: roadmap, isLoading: loadingRoadmap } = useGetRoadmapPhases();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-serif text-foreground font-medium tracking-tight">Risk & Platform Strategy</h1>
        <p className="text-muted-foreground mt-1 text-sm">Strategic risk oversight and AI/Platform roadmap visibility.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risks */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-primary" /> Compliance & Risk Audit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingRisks ? <Skeleton className="h-64" /> : risks?.map((risk) => (
                <div key={risk.id} className="border border-border rounded-md p-4 bg-card shadow-sm hover:border-primary/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-sm font-medium text-foreground">{risk.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{risk.category}</p>
                    </div>
                    <StatusChip severity={risk.severity} />
                  </div>
                  {risk.summary && <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{risk.summary}</p>}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-border text-xs font-medium">
                    <span className="text-muted-foreground">Status: <span className="text-foreground">{risk.status}</span></span>
                    {risk.openFindings !== undefined && (
                      <span className="text-primary">{risk.openFindings} findings</span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Roadmap */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary" /> AI / Platform Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingRoadmap ? <Skeleton className="h-64" /> : roadmap?.map(phase => (
                <div key={phase.id} className="border border-border rounded-md p-4 bg-card shadow-sm hover:border-primary/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-[10px] font-mono text-primary uppercase tracking-widest mb-1">{phase.phase}</div>
                      <h3 className="text-sm font-medium text-foreground">{phase.title}</h3>
                    </div>
                    <PhaseStatus status={phase.status} />
                  </div>
                  {phase.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{phase.description}</p>}
                  
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-[10px] uppercase font-mono text-muted-foreground">
                      <span>Progress</span>
                      <span>{phase.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${phase.progress}%` }} />
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground mt-4 pt-3 border-t border-border">
                    <span>{phase.vendor || 'Internal'}</span>
                    <span>{phase.timeline}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
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
    <span className={`inline-flex items-center justify-center border font-medium uppercase tracking-wider rounded-sm px-1.5 py-0.5 text-[9px] ${colorClass}`}>
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
    <span className={`inline-flex items-center justify-center border font-medium uppercase tracking-wider rounded-sm px-1.5 py-0.5 text-[9px] ${colorClass}`}>
      {label}
    </span>
  );
}

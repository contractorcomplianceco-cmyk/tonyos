import { useGetRiskItems, useGetRoadmapPhases } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldAlert, Cpu } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { StatusBadge, normalizeStatus } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { GuardrailNote } from "@/components/common/GuardrailNote";

export default function Risk() {
  const { data: risks, isLoading: loadingRisks, isError: risksError, refetch: refetchRisks } = useGetRiskItems();
  const { data: roadmap, isLoading: loadingRoadmap, isError: roadmapError, refetch: refetchRoadmap } = useGetRoadmapPhases();

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Risk & Platform Strategy"
        subtitle="Parent-level strategic risk oversight and AI/Platform roadmap visibility across the CAG portfolio."
      />

      <GuardrailNote text="Risk and platform intelligence only. Audit findings and roadmap phases are recommendations — no remediation, vendor commitment, or platform investment proceeds without written founder approval." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risks */}
        <div className="space-y-6">
          <Panel icon={ShieldAlert} title="Compliance & Risk Audit" bodyClassName="p-6 space-y-4">
            {loadingRisks ? (
              <Skeleton className="h-64 rounded border-border" />
            ) : risksError ? (
              <ErrorState onRetry={() => refetchRisks()} />
            ) : risks?.length === 0 ? (
              <EmptyState icon={ShieldAlert} title="No risk items" description="No risk items are currently being tracked." />
            ) : risks?.map((risk) => (
              <div key={risk.id} className="border border-card-border rounded p-5 bg-secondary hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-card-foreground">{risk.name}</h3>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">{risk.category}</p>
                  </div>
                  <StatusBadge severity={risk.severity} />
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
          </Panel>
        </div>

        {/* Roadmap */}
        <div className="space-y-6">
          <Panel icon={Cpu} title="AI / Platform Roadmap" bodyClassName="p-6 space-y-4">
            {loadingRoadmap ? (
              <Skeleton className="h-64 rounded border-border" />
            ) : roadmapError ? (
              <ErrorState onRetry={() => refetchRoadmap()} />
            ) : roadmap?.length === 0 ? (
              <EmptyState icon={Cpu} title="No roadmap phases" description="No platform roadmap phases have been defined." />
            ) : roadmap?.map(phase => (
              <div key={phase.id} className="border border-card-border rounded p-5 bg-secondary hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-[10px] font-mono text-primary uppercase tracking-widest mb-1.5 font-bold">{phase.phase}</div>
                    <h3 className="text-sm font-semibold text-card-foreground">{phase.title}</h3>
                  </div>
                  <StatusBadge status={phase.status} tone={normalizeStatus(phase.status) === "in_progress" ? "blue" : undefined} />
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
          </Panel>
        </div>
      </div>
    </div>
  );
}

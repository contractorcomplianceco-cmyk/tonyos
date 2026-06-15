import { useGetStrategyObjectives, useGetMilestones, useGetPartnerships } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, Flag, Handshake } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";

export default function Pulse() {
  const { data: objectives, isLoading: loadingObjectives, isError: objectivesError, refetch: refetchObjectives } = useGetStrategyObjectives();
  const { data: milestones, isLoading: loadingMilestones, isError: milestonesError, refetch: refetchMilestones } = useGetMilestones();
  const { data: partnerships, isLoading: loadingPartnerships, isError: partnershipsError, refetch: refetchPartnerships } = useGetPartnerships();

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Strategic Pulse"
        subtitle="Company strategy objectives, founder milestones, and strategic partnerships."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Objectives */}
        <div className="space-y-6">
          <Panel icon={Target} title="Strategy Objectives" bodyClassName="p-6 space-y-4">
            {loadingObjectives ? (
              <Skeleton className="h-64 rounded border-border" />
            ) : objectivesError ? (
              <ErrorState onRetry={() => refetchObjectives()} />
            ) : objectives?.length === 0 ? (
              <EmptyState icon={Target} title="No objectives" description="No strategy objectives have been defined." />
            ) : objectives?.map(obj => (
              <div key={obj.id} className="border border-card-border rounded p-5 bg-secondary relative overflow-hidden group">
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors" />
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold text-card-foreground">{obj.title}</div>
                    <div className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground mt-1.5">{obj.pillar} &bull; {obj.horizon}</div>
                  </div>
                  <StatusBadge status={obj.status} />
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5 mt-4">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: `${obj.progress}%` }} />
                </div>
                <div className="flex justify-between mt-2 text-[10px] uppercase font-mono text-muted-foreground tracking-widest">
                  <span>Progress</span>
                  <span className="font-bold text-card-foreground">{obj.progress}%</span>
                </div>
              </div>
            ))}
          </Panel>
        </div>

        <div className="space-y-6">
          {/* Milestones */}
          <Panel icon={Flag} title="Founder Milestones" bodyClassName="p-0">
            <div className="divide-y divide-card-border">
              {loadingMilestones ? (
                <div className="p-6"><Skeleton className="h-48 rounded border-border" /></div>
              ) : milestonesError ? (
                <ErrorState onRetry={() => refetchMilestones()} />
              ) : milestones?.length === 0 ? (
                <EmptyState icon={Flag} title="No milestones" description="No founder milestones have been recorded." />
              ) : milestones?.map(mile => (
                <div key={mile.id} className="flex gap-4 items-start p-6 hover:bg-secondary transition-colors">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground pt-0.5 w-20 shrink-0">
                    {mile.date}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-card-foreground">{mile.title}</div>
                    {mile.description && <div className="text-xs text-card-foreground/70 mt-1.5 leading-relaxed">{mile.description}</div>}
                  </div>
                  <div className="ml-auto pl-4">
                    <StatusBadge status={mile.status} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Partnerships */}
          <Panel icon={Handshake} title="Strategic Partnerships" bodyClassName="p-6 space-y-3">
            {loadingPartnerships ? (
              <Skeleton className="h-48 rounded border-border" />
            ) : partnershipsError ? (
              <ErrorState onRetry={() => refetchPartnerships()} />
            ) : partnerships?.length === 0 ? (
              <EmptyState icon={Handshake} title="No partnerships" description="No strategic partnerships are being tracked." />
            ) : partnerships?.map(partner => (
              <div key={partner.id} className="border border-card-border rounded p-4 flex justify-between items-center hover:border-primary/50 transition-colors bg-secondary">
                <div>
                  <div className="font-semibold text-sm text-card-foreground">{partner.name}</div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">{partner.type}</div>
                </div>
                <div className="text-right">
                  <StatusBadge status={partner.stage} />
                  {partner.value && <div className="text-[10px] font-mono mt-2 font-bold text-card-foreground tabular-nums tracking-widest">{partner.value}</div>}
                </div>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </div>
  );
}

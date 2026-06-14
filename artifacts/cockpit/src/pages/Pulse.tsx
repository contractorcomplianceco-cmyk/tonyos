import { useGetStrategyObjectives, useGetMilestones, useGetPartnerships } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, Flag, Handshake } from "lucide-react";

export default function Pulse() {
  const { data: objectives, isLoading: loadingObjectives } = useGetStrategyObjectives();
  const { data: milestones, isLoading: loadingMilestones } = useGetMilestones();
  const { data: partnerships, isLoading: loadingPartnerships } = useGetPartnerships();

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-sans text-foreground font-bold tracking-tight">Strategic Pulse</h1>
        <p className="text-foreground/70 mt-1 text-sm font-medium">Company strategy objectives, founder milestones, and strategic partnerships.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Objectives */}
        <div className="space-y-6">
          <div className="border border-card-border bg-card rounded shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-card-border flex items-center gap-3">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold tracking-tight text-card-foreground">Strategy Objectives</h2>
            </div>
            <div className="p-6 space-y-4">
              {loadingObjectives ? <Skeleton className="h-64 rounded border-border" /> : objectives?.map(obj => (
                <div key={obj.id} className="border border-card-border rounded p-5 bg-secondary relative overflow-hidden group">
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors" />
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-card-foreground">{obj.title}</div>
                      <div className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground mt-1.5">{obj.pillar} &bull; {obj.horizon}</div>
                    </div>
                    <StatusChip status={obj.status} />
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
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Milestones */}
          <div className="border border-card-border bg-card rounded shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-card-border flex items-center gap-3">
              <Flag className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold tracking-tight text-card-foreground">Founder Milestones</h2>
            </div>
            <div className="p-0">
              <div className="divide-y divide-card-border">
                {loadingMilestones ? (
                  <div className="p-6"><Skeleton className="h-48 rounded border-border" /></div>
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
                      <StatusChip status={mile.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Partnerships */}
          <div className="border border-card-border bg-card rounded shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-card-border flex items-center gap-3">
              <Handshake className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold tracking-tight text-card-foreground">Strategic Partnerships</h2>
            </div>
            <div className="p-6 space-y-3">
              {loadingPartnerships ? <Skeleton className="h-48 rounded border-border" /> : partnerships?.map(partner => (
                <div key={partner.id} className="border border-card-border rounded p-4 flex justify-between items-center hover:border-primary/50 transition-colors bg-secondary">
                  <div>
                    <div className="font-semibold text-sm text-card-foreground">{partner.name}</div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">{partner.type}</div>
                  </div>
                  <div className="text-right">
                    <StatusChip status={partner.stage} />
                    {partner.value && <div className="text-[10px] font-mono mt-2 font-bold text-card-foreground tabular-nums tracking-widest">{partner.value}</div>}
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

function StatusChip({ status }: { status: string }) {
  let colorClass = "bg-secondary text-secondary-foreground border-border";
  let label = status.replace(/_/g, ' ');

  if (status === 'on_track' || status === 'completed' || status === 'active' || status === 'signed') {
    colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (status === 'watch' || status === 'in_progress' || status === 'negotiation') {
    colorClass = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (status === 'action_needed' || status === 'at_risk' || status === 'blocked') {
    colorClass = "bg-red-50 text-red-700 border-red-200";
  }

  return (
    <span className={`inline-flex items-center justify-center border font-mono uppercase tracking-widest font-bold rounded-[2px] px-2 py-0.5 text-[9px] ${colorClass}`}>
      {label}
    </span>
  );
}

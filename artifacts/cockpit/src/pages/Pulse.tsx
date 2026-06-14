import { useGetStrategyObjectives, useGetMilestones, useGetPartnerships } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Flag, Handshake, Target } from "lucide-react";

export default function Pulse() {
  const { data: objectives, isLoading: loadingObjectives } = useGetStrategyObjectives();
  const { data: milestones, isLoading: loadingMilestones } = useGetMilestones();
  const { data: partnerships, isLoading: loadingPartnerships } = useGetPartnerships();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-serif text-foreground font-medium tracking-tight">Strategic Pulse</h1>
        <p className="text-muted-foreground mt-1 text-sm">Company strategy objectives, founder milestones, and strategic partnerships.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Objectives */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" /> Strategy Objectives
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingObjectives ? <Skeleton className="h-64" /> : objectives?.map(obj => (
                <div key={obj.id} className="border border-border rounded-md p-4 bg-secondary/10">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-foreground">{obj.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{obj.pillar} &bull; {obj.horizon}</div>
                    </div>
                    <StatusChip status={obj.status} />
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5 mt-3">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${obj.progress}%` }} />
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] uppercase font-mono text-muted-foreground">
                    <span>Progress</span>
                    <span>{obj.progress}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Milestones */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <Flag className="h-5 w-5 text-primary" /> Founder Milestones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingMilestones ? <Skeleton className="h-48" /> : milestones?.map(mile => (
                <div key={mile.id} className="flex gap-4 items-start border-b border-border/50 pb-3 last:border-0 last:pb-0">
                  <div className="text-xs font-mono text-muted-foreground pt-0.5 w-24 shrink-0">
                    {new Date(mile.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-foreground">{mile.title}</div>
                    {mile.description && <div className="text-xs text-muted-foreground mt-1">{mile.description}</div>}
                  </div>
                  <div className="ml-auto pl-4">
                    <StatusChip status={mile.status} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Partnerships */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <Handshake className="h-5 w-5 text-primary" /> Strategic Partnerships
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingPartnerships ? <Skeleton className="h-48" /> : partnerships?.map(partner => (
                <div key={partner.id} className="border border-border rounded-md p-3 flex justify-between items-center hover:border-primary/30 transition-colors">
                  <div>
                    <div className="font-medium text-sm text-foreground">{partner.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{partner.type}</div>
                  </div>
                  <div className="text-right">
                    <StatusChip status={partner.stage} />
                    {partner.value && <div className="text-xs font-mono mt-1 text-foreground">{partner.value}</div>}
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
    <span className={`inline-flex items-center justify-center border font-medium uppercase tracking-wider rounded-sm px-2 py-0.5 text-[10px] ${colorClass}`}>
      {label}
    </span>
  );
}

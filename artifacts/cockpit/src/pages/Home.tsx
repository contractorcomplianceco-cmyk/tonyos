import { useGetExecutiveSummary, useGetBriefingItems, useGetDecisionSummary } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { ArrowUpRight, Activity, ShieldAlert, FileText, CheckCircle2 } from "lucide-react";

export default function Home() {
  const { data: summary, isLoading: loadingSummary } = useGetExecutiveSummary();
  const { data: briefings, isLoading: loadingBriefings } = useGetBriefingItems();
  const { data: decisions, isLoading: loadingDecisions } = useGetDecisionSummary();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-serif text-primary">Executive Cockpit</h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm tracking-tight uppercase">Rose OS // Strategy & Risk</p>
      </div>

      {loadingSummary ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      ) : summary ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard title={summary.companyPulse.label} value={summary.companyPulse.value} trend={summary.companyPulse.trend} helper={summary.companyPulse.helper} icon={Activity} />
          <MetricCard title={summary.collectedRetainedRevenue.label} value={summary.collectedRetainedRevenue.value} trend={summary.collectedRetainedRevenue.trend} helper={summary.collectedRetainedRevenue.helper} icon={FileText} />
          <MetricCard title={summary.operatingReserve.label} value={summary.operatingReserve.value} trend={summary.operatingReserve.trend} helper={summary.operatingReserve.helper} icon={ShieldAlert} />
          <MetricCard title={summary.majorDecisionsPending.label} value={summary.majorDecisionsPending.value} trend={summary.majorDecisionsPending.trend} helper={summary.majorDecisionsPending.helper} icon={CheckCircle2} />
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="text-xl font-serif text-foreground">Daily Briefing</h2>
          </div>
          
          <div className="space-y-4">
            {loadingBriefings ? (
              <Skeleton className="h-48 w-full" />
            ) : briefings?.map((item) => (
              <Card key={item.id} className="bg-card/50 border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader className="py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      {item.category && <CardDescription className="font-mono text-xs mt-1 uppercase text-primary/80">{item.category}</CardDescription>}
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                </CardHeader>
                {item.detail && (
                  <CardContent className="pt-0 pb-4 text-sm text-muted-foreground">
                    {item.detail}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="text-xl font-serif text-foreground">Decision Queue</h2>
            <Link href="/decisions" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 font-mono uppercase tracking-tight">
              View All <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          
          {loadingDecisions ? (
            <Skeleton className="h-64 w-full" />
          ) : decisions ? (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="text-4xl font-serif text-primary">{decisions.pendingApproval}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider mt-1">Pending Review</div>
                </div>
                <div className="space-y-3">
                  {decisions.byApprovalType.map((type, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm border-b border-border/30 pb-2 last:border-0 last:pb-0">
                      <span className="text-muted-foreground">{type.label}</span>
                      <span className="font-mono text-foreground">{type.count}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-border/30">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Total Impact</div>
                  <div className="text-lg font-mono text-foreground mt-1">{decisions.totalImpact}</div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, helper, icon: Icon }: { title: string, value: string, trend?: string | null, helper?: string | null, icon: any }) {
  return (
    <Card className="bg-card/50 border-border/50 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="h-16 w-16 text-primary" />
      </div>
      <CardContent className="p-6 relative z-10">
        <div className="text-sm font-mono tracking-tight uppercase text-muted-foreground mb-2">{title}</div>
        <div className="text-3xl font-serif text-foreground">{value}</div>
        {helper && (
          <div className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
            {trend === 'up' && <ArrowUpRight className="h-3 w-3 text-emerald-500" />}
            {trend === 'down' && <ArrowUpRight className="h-3 w-3 text-rose-500 rotate-90" />}
            {helper}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getColors = () => {
    switch(status) {
      case 'on_track': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'watch': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'action_needed': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };
  
  return (
    <span className={`px-2.5 py-1 text-xs font-mono uppercase tracking-wider rounded border ${getColors()}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

import { useGetExecutiveSummary, useGetBriefingItems, useGetDecisions, useGetDecisionSummary, useGetRiskItems, useGetRoadmapPhases, useGetFinancialOverview, useGetFinancialMonthly, useGetGuardrails } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { ChevronRight, AlertTriangle, Shield, CheckCircle2, Lock, Activity, FileText } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";

export default function Home() {
  const { data: summary, isLoading: loadingSummary } = useGetExecutiveSummary();
  const { data: briefings, isLoading: loadingBriefings } = useGetBriefingItems();
  const { data: decisionsPending, isLoading: loadingDecisions } = useGetDecisions({ status: "pending" });
  const { data: decisionSummary } = useGetDecisionSummary();
  const { data: risks, isLoading: loadingRisks } = useGetRiskItems();
  const { data: roadmap, isLoading: loadingRoadmap } = useGetRoadmapPhases();
  const { data: financialOverview, isLoading: loadingFinancial } = useGetFinancialOverview();
  const { data: financialMonthly, isLoading: loadingMonthly } = useGetFinancialMonthly();
  const { data: guardrails, isLoading: loadingGuardrails } = useGetGuardrails();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-foreground font-medium tracking-tight">TonyOS Command Center</h1>
          <p className="text-muted-foreground mt-1 text-sm">Founder-level strategy, financial visibility, and major decision oversight.</p>
        </div>
        <div className="text-xs text-muted-foreground font-mono">Data as of {new Date().toLocaleDateString()}</div>
      </div>

      {/* CLP Strip */}
      <div className="bg-secondary/30 border border-border rounded-md px-4 py-2 flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">CLP separation guardrail:</span>
          <span className="text-muted-foreground">approved company systems and cleared source records only.</span>
        </div>
        <Link href="/brain" className="text-primary font-medium hover:underline flex items-center gap-1">
          View CLP Guardrails <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loadingSummary ? (
          [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 w-full" />)
        ) : summary ? (
          <>
            <KpiCard label={summary.companyPulse.label} value={summary.companyPulse.value} trend={summary.companyPulse.trend} helper={summary.companyPulse.helper} icon={Activity} />
            <KpiCard label={summary.collectedRetainedRevenue.label} value={summary.collectedRetainedRevenue.value} trend={summary.collectedRetainedRevenue.trend} helper={summary.collectedRetainedRevenue.helper} icon={FileText} />
            <KpiCard label={summary.operatingReserve.label} value={summary.operatingReserve.value} trend={summary.operatingReserve.trend} helper={summary.operatingReserve.helper} icon={Shield} />
            <KpiCard label={summary.majorDecisionsPending.label} value={summary.majorDecisionsPending.value} trend={summary.majorDecisionsPending.trend} helper={summary.majorDecisionsPending.helper} icon={CheckCircle2} />
          </>
        ) : null}
      </div>

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Col */}
        <div className="space-y-6">
          {/* Briefing */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-serif">Executive Brief</CardTitle>
                <CardDescription>Top 5 Things Tony Should Know</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingBriefings ? <Skeleton className="h-48" /> : briefings?.slice(0, 5).map((item, i) => (
                <div key={item.id} className="flex gap-4 items-start group">
                  <div className="font-mono text-xs text-muted-foreground pt-1 w-4 shrink-0">{i + 1}.</div>
                  <div className="flex-1 border-b border-border/50 pb-3 group-last:border-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="font-medium text-foreground text-sm leading-tight">{item.title}</div>
                      <StatusChip status={item.status} />
                    </div>
                    {item.detail && <div className="text-sm text-muted-foreground mt-1 line-clamp-1">{item.detail}</div>}
                  </div>
                  <Link href={`/decisions`} className="pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="h-4 w-4 text-primary" />
                  </Link>
                </div>
              ))}
              <Link href="/pulse" className="text-xs font-medium text-primary hover:underline flex items-center justify-center pt-2">
                View Full Executive Brief
              </Link>
            </CardContent>
          </Card>

          {/* Decisions */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-serif">Major Decision Queue</CardTitle>
                <CardDescription>Requiring Founder Written Approval</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingDecisions ? <Skeleton className="h-48" /> : decisionsPending?.map((dec) => (
                <Link key={dec.id} href={`/decisions/${dec.id}`} className="block group">
                  <div className="border border-border rounded-md p-3 hover:border-primary/50 transition-colors flex justify-between items-center bg-secondary/10">
                    <div>
                      <div className="text-xs text-primary font-mono font-medium mb-1">{dec.approvalType.replace(/_/g, ' ')}</div>
                      <div className="text-sm font-medium text-foreground">{dec.title}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusChip status={dec.status} />
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
              {!loadingDecisions && decisionsPending?.length === 0 && (
                <div className="text-sm text-muted-foreground italic p-4 text-center border border-border rounded-md">No pending decisions.</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Col */}
        <div className="space-y-6">
          {/* Financials */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-serif">Monthly Founder Financial Review</CardTitle>
                <CardDescription>Visibility only - No signing authority</CardDescription>
              </div>
              <Link href="/financial" className="text-xs text-primary hover:underline">View All</Link>
            </CardHeader>
            <CardContent>
              {loadingFinancial || loadingMonthly ? <Skeleton className="h-48" /> : (
                <div className="space-y-6">
                  {/* Chart */}
                  <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={financialMonthly?.slice(-6) || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${(val/1000)}k`} />
                        <Tooltip contentStyle={{ fontSize: '12px' }} formatter={(val) => `$${Number(val).toLocaleString()}`} />
                        <Bar dataKey="actual" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} barSize={16} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Minis */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Reserve Target</div>
                      <div className="text-sm font-medium">{financialOverview?.reserveTarget} Months</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Revenue Trigger</div>
                      <div className="text-sm font-medium">{financialOverview?.revenueTriggerProgress}%</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Risk & Roadmap */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif">Risk & Platform Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {loadingRisks || loadingRoadmap ? <Skeleton className="h-32 col-span-2" /> : (
                  <>
                    {risks?.slice(0, 3).map(risk => (
                      <div key={risk.id} className="border border-border rounded-md p-3 text-sm flex flex-col justify-between group">
                        <div>
                          <div className="font-medium text-foreground">{risk.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{risk.category}</div>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <StatusChip status={risk.status} />
                          <Link href="/risk" className="text-primary text-[10px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity">View</Link>
                        </div>
                      </div>
                    ))}
                    {roadmap?.slice(0, 1).map(phase => (
                      <div key={phase.id} className="border border-border rounded-md p-3 text-sm flex flex-col justify-between bg-secondary/20 group">
                        <div>
                          <div className="font-medium text-foreground">{phase.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Platform Roadmap</div>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <StatusChip status={phase.status} />
                          <Link href="/risk" className="text-primary text-[10px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity">View</Link>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Guardrails */}
          <Card className="bg-secondary/10 border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" /> Governance Guardrails
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {loadingGuardrails ? <Skeleton className="h-16 col-span-2" /> : guardrails?.filter(g => g.status === 'enforced').slice(0, 4).map(g => (
                  <div key={g.id} className="bg-background border border-border rounded p-2 text-xs font-medium text-foreground flex items-center gap-2">
                    <Lock className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate">{g.title}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, trend, helper, icon: Icon }: { label: string, value: string, trend?: string | null, helper?: string | null, icon: any }) {
  return (
    <div className="border border-border rounded-lg bg-card p-4 shadow-sm relative overflow-hidden group">
      <div className="text-xs font-medium text-muted-foreground mb-1 pr-8">{label}</div>
      <div className="text-2xl font-serif text-foreground font-medium">{value}</div>
      <div className="flex items-center gap-2 mt-2">
        <StatusChip status={trend === 'up' ? 'on_track' : trend === 'down' ? 'watch' : 'info'} small text={helper || trend || ''} />
      </div>
      <Icon className="absolute top-4 right-4 h-6 w-6 text-muted-foreground/20 group-hover:text-primary/10 transition-colors" />
    </div>
  );
}

function StatusChip({ status, small = false, text }: { status: string, small?: boolean, text?: string }) {
  let colorClass = "bg-secondary text-secondary-foreground border-border";
  let label = text || status.replace(/_/g, ' ');

  if (status === 'on_track' || status === 'completed' || status === 'approved') {
    colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (status === 'watch' || status === 'attention' || status === 'pending' || status === 'in_progress') {
    colorClass = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (status === 'action_needed' || status === 'high' || status === 'declined') {
    colorClass = "bg-red-50 text-red-700 border-red-200";
  } else if (status === 'info') {
    colorClass = "bg-blue-50 text-blue-700 border-blue-200";
  }

  return (
    <span className={`inline-flex items-center justify-center border font-medium uppercase tracking-wider rounded-sm ${small ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]'} ${colorClass}`}>
      {label}
    </span>
  );
}

import { useGetExecutiveSummary, useGetBriefingItems, useGetDecisions, useGetDecisionSummary, useGetRiskItems, useGetRoadmapPhases, useGetFinancialOverview, useGetFinancialMonthly, useGetGuardrails } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { ChevronRight, AlertTriangle, Shield, CheckCircle2, Lock, Activity, FileText, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
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
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-sans text-foreground font-bold tracking-tight">TonyOS Command Center</h1>
          <p className="text-foreground/70 mt-1 text-sm font-medium">Founder-level strategy, financial visibility, and major decision oversight.</p>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-primary font-mono border border-primary/20 bg-primary/5 px-2 py-1 rounded-sm">
          Data as of {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* CLP Strip */}
      <div className="bg-background border border-sidebar-border rounded px-4 py-2.5 flex justify-between items-center text-sm shadow-sm">
        <div className="flex items-center gap-3">
          <Shield className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground tracking-tight">CLP Separation Guardrail:</span>
          <span className="text-foreground/70">Approved company systems and cleared source records only.</span>
        </div>
        <Link href="/brain" className="text-primary font-medium text-xs hover:underline flex items-center gap-1 uppercase tracking-wider">
          View Guardrails <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loadingSummary ? (
          [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded border-border" />)
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
          <div className="border border-card-border bg-card rounded-md shadow-sm overflow-hidden flex flex-col">
            <div className="bg-sidebar border-b border-sidebar-border px-5 py-4">
              <div className="text-[10px] text-primary uppercase font-mono tracking-widest mb-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Central Command Briefing
              </div>
              <h2 className="text-xl font-bold tracking-tight text-sidebar-foreground">Executive Brief</h2>
              <p className="text-xs text-sidebar-foreground/60 mt-0.5">Top 5 Things Tony Should Know</p>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="space-y-4">
                {loadingBriefings ? <Skeleton className="h-48" /> : briefings?.slice(0, 5).map((item, i) => (
                  <div key={item.id} className="flex gap-4 items-start group">
                    <div className="font-mono text-xs text-muted-foreground pt-0.5 w-4 shrink-0">{i + 1}.</div>
                    <div className="flex-1 border-b border-card-border pb-4 group-last:border-0">
                      <div className="flex justify-between items-start gap-3">
                        <div className="font-semibold text-card-foreground text-sm leading-tight">{item.title}</div>
                        <StatusChip status={item.status} />
                      </div>
                      {item.detail && <div className="text-sm text-card-foreground/70 mt-1.5 leading-relaxed">{item.detail}</div>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-4 flex justify-center">
                <Link href="/pulse" className="text-xs font-mono uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                  View Full Brief <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Decisions */}
          <div className="border border-card-border bg-card rounded-md shadow-sm overflow-hidden">
            <div className="bg-card border-b border-card-border px-5 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold tracking-tight text-card-foreground">Governance Review: Major Decisions</h2>
                <p className="text-xs text-card-foreground/60 mt-0.5">Requiring Founder Written Approval</p>
              </div>
              <Lock className="h-4 w-4 text-primary" />
            </div>
            <div className="p-5 space-y-3">
              {loadingDecisions ? <Skeleton className="h-48" /> : decisionsPending?.map((dec) => (
                <Link key={dec.id} href={`/decisions/${dec.id}`} className="block group">
                  <div className="border border-card-border rounded p-3 hover:border-primary/50 transition-colors flex justify-between items-center bg-card shadow-sm group-hover:shadow relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/0 group-hover:bg-primary transition-colors" />
                    <div>
                      <div className="text-[10px] text-primary font-mono uppercase tracking-widest mb-1">{dec.approvalType.replace(/_/g, ' ')}</div>
                      <div className="text-sm font-semibold text-card-foreground">{dec.title}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusChip status={dec.status} />
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
              {!loadingDecisions && decisionsPending?.length === 0 && (
                <div className="text-sm text-muted-foreground italic p-4 text-center border border-card-border rounded">No pending decisions.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col */}
        <div className="space-y-6">
          {/* Financials */}
          <div className="border border-card-border bg-card rounded-md shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-card-border flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold tracking-tight text-card-foreground">Executive Finance</h2>
                <p className="text-xs text-card-foreground/60 mt-0.5">Visibility only - No signing authority</p>
              </div>
              <Link href="/financial" className="text-[10px] font-mono uppercase tracking-widest text-primary hover:underline">View All</Link>
            </div>
            <div className="p-5">
              {loadingFinancial || loadingMonthly ? <Skeleton className="h-48" /> : (
                <div className="space-y-6">
                  {/* Chart */}
                  <div className="h-36 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={financialMonthly?.slice(-6) || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--card-border))" />
                        <XAxis dataKey="month" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${(val/1000)}k`} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip 
                          contentStyle={{ fontSize: '12px', backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--card-border))' }} 
                          formatter={(val) => `$${Number(val).toLocaleString()}`} 
                        />
                        <Bar dataKey="actual" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} barSize={16} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Minis */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-card-border">
                    <div className="space-y-1">
                      <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest">Reserve Target</div>
                      <div className="text-sm font-semibold text-card-foreground">{financialOverview?.reserveTarget} Months</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest">Revenue Trigger</div>
                      <div className="text-sm font-semibold text-card-foreground">{financialOverview?.revenueTriggerProgress}%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Risk & Roadmap */}
          <div className="border border-card-border bg-card rounded-md shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-card-border">
              <h2 className="text-base font-bold tracking-tight text-card-foreground">Strategic Command: Risk & Platform</h2>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {loadingRisks || loadingRoadmap ? <Skeleton className="h-32 col-span-2" /> : (
                  <>
                    {risks?.slice(0, 3).map(risk => (
                      <div key={risk.id} className="border border-card-border rounded p-3 text-sm flex flex-col justify-between group bg-secondary">
                        <div>
                          <div className="font-semibold text-card-foreground tracking-tight">{risk.name}</div>
                          <div className="text-[10px] font-mono text-muted-foreground mt-1 uppercase tracking-widest">{risk.category}</div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <StatusChip status={risk.status} severity={risk.severity} />
                          <Link href="/risk" className="text-primary text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">View</Link>
                        </div>
                      </div>
                    ))}
                    {roadmap?.slice(0, 1).map(phase => (
                      <div key={phase.id} className="border border-primary/20 rounded p-3 text-sm flex flex-col justify-between bg-primary/5 group">
                        <div>
                          <div className="font-semibold text-card-foreground tracking-tight">{phase.title}</div>
                          <div className="text-[10px] font-mono text-primary mt-1 uppercase tracking-widest">Platform Roadmap</div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <StatusChip status={phase.status} />
                          <Link href="/risk" className="text-primary text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">View</Link>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Guardrails */}
          <div className="border border-sidebar-border bg-sidebar rounded-md shadow-sm overflow-hidden text-sidebar-foreground">
            <div className="px-5 py-3 border-b border-sidebar-border flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" /> 
              <h2 className="text-sm font-bold tracking-tight">Governance Guardrails</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                {loadingGuardrails ? <Skeleton className="h-16 col-span-2 bg-sidebar-border" /> : guardrails?.filter(g => ['active', 'enforced'].includes(g.status.toLowerCase())).slice(0, 4).map(g => (
                  <div key={g.id} className="bg-sidebar-accent border border-sidebar-border rounded p-2 text-[11px] font-semibold flex items-center gap-2">
                    <Lock className="h-3 w-3 text-primary shrink-0" />
                    <span className="truncate">{g.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, trend, helper, icon: Icon }: { label: string, value: string, trend?: string | null, helper?: string | null, icon: any }) {
  return (
    <div className="border border-card-border rounded bg-card p-5 shadow-sm relative overflow-hidden group flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20" />
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3 pr-8">{label}</div>
      <div className="text-3xl font-sans font-bold text-card-foreground tracking-tighter tabular-nums mb-3">{value}</div>
      <div className="mt-auto">
        <StatusChip status={trend === 'up' ? 'on_track' : trend === 'down' ? 'watch' : 'info'} text={helper || trend || ''} />
      </div>
      <Icon className="absolute top-4 right-4 h-5 w-5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
    </div>
  );
}

function StatusChip({ status, severity, text }: { status: string, severity?: string, text?: string }) {
  let colorClass = "bg-secondary text-secondary-foreground border-border";
  let label = text || status.replace(/_/g, ' ');

  if (status === 'on_track' || status === 'completed' || status === 'approved' || severity === 'low') {
    colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (status === 'watch' || status === 'attention' || status === 'pending' || status === 'in_progress' || severity === 'medium') {
    colorClass = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (status === 'action_needed' || status === 'high' || status === 'declined' || severity === 'high') {
    colorClass = "bg-red-50 text-red-700 border-red-200";
  } else if (status === 'info') {
    colorClass = "bg-primary/10 text-primary border-primary/20";
  }

  return (
    <span className={`inline-flex items-center justify-center border font-mono uppercase tracking-widest rounded-[2px] px-1.5 py-0.5 text-[9px] ${colorClass}`}>
      {label}
    </span>
  );
}

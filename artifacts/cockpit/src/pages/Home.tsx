import { useGetExecutiveSummary, useGetBriefingItems, useGetDecisions, useGetDecisionSummary, useGetRiskItems, useGetRoadmapPhases, useGetFinancialOverview, useGetFinancialMonthly, useGetGuardrails } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { ChevronRight, Shield, CheckCircle2, Lock, Activity, FileText, AlertTriangle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge, normalizeStatus } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";

export default function Home() {
  const { data: summary, isLoading: loadingSummary, isError: summaryError, refetch: refetchSummary } = useGetExecutiveSummary();
  const { data: briefings, isLoading: loadingBriefings, isError: briefingsError, refetch: refetchBriefings } = useGetBriefingItems();
  const { data: decisionsPending, isLoading: loadingDecisions, isError: decisionsError, refetch: refetchDecisions } = useGetDecisions({ status: "pending" });
  useGetDecisionSummary();
  const { data: risks, isLoading: loadingRisks, isError: risksError, refetch: refetchRisks } = useGetRiskItems();
  const { data: roadmap, isLoading: loadingRoadmap, isError: roadmapError, refetch: refetchRoadmap } = useGetRoadmapPhases();
  const { data: financialOverview, isLoading: loadingFinancial, isError: financialError, refetch: refetchFinancial } = useGetFinancialOverview();
  const { data: financialMonthly, isLoading: loadingMonthly, isError: monthlyError, refetch: refetchMonthly } = useGetFinancialMonthly();
  const { data: guardrails, isLoading: loadingGuardrails, isError: guardrailsError } = useGetGuardrails();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <PageHeader
        title="TonyOS Command Center"
        subtitle="Founder-level strategy, financial visibility, and major decision oversight."
        actions={
          <div className="text-[10px] uppercase tracking-widest text-primary font-mono border border-primary/20 bg-primary/5 px-2 py-1 rounded-sm">
            Data as of {new Date().toLocaleDateString()}
          </div>
        }
      />

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
      {loadingSummary ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded border-border" />)}
        </div>
      ) : summaryError ? (
        <div className="border border-card-border bg-card rounded shadow-sm">
          <ErrorState onRetry={() => refetchSummary()} />
        </div>
      ) : summary ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard label={summary.companyPulse.label} value={summary.companyPulse.value} trend={summary.companyPulse.trend} helper={summary.companyPulse.helper} icon={Activity} />
          <KpiCard label={summary.collectedRetainedRevenue.label} value={summary.collectedRetainedRevenue.value} trend={summary.collectedRetainedRevenue.trend} helper={summary.collectedRetainedRevenue.helper} icon={FileText} />
          <KpiCard label={summary.operatingReserve.label} value={summary.operatingReserve.value} trend={summary.operatingReserve.trend} helper={summary.operatingReserve.helper} icon={Shield} />
          <KpiCard label={summary.majorDecisionsPending.label} value={summary.majorDecisionsPending.value} trend={summary.majorDecisionsPending.trend} helper={summary.majorDecisionsPending.helper} icon={CheckCircle2} />
        </div>
      ) : null}

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Col */}
        <div className="space-y-6">
          {/* Briefing */}
          <div className="border border-card-border bg-card rounded-md shadow-sm overflow-hidden flex flex-col">
            <div className="relative bg-sidebar border-b border-sidebar-border px-5 py-4 overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
              <div className="text-[10px] text-primary uppercase font-mono tracking-widest mb-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Central Command Briefing
              </div>
              <h2 className="text-xl font-bold tracking-tight text-sidebar-foreground">Executive Brief</h2>
              <p className="text-xs text-sidebar-foreground/60 mt-0.5">Top 5 Things Tony Should Know</p>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="space-y-4">
                {loadingBriefings ? <Skeleton className="h-48" /> : briefingsError ? (
                  <ErrorState onRetry={() => refetchBriefings()} />
                ) : briefings?.length === 0 ? (
                  <EmptyState icon={FileText} title="No briefing items" description="No executive briefing items are available." />
                ) : briefings?.slice(0, 5).map((item, i) => (
                  <div key={item.id} className="flex gap-4 items-start group">
                    <div className="font-mono text-xs text-muted-foreground pt-0.5 w-4 shrink-0">{i + 1}.</div>
                    <div className="flex-1 border-b border-card-border pb-4 group-last:border-0">
                      <div className="flex justify-between items-start gap-3">
                        <div className="font-semibold text-card-foreground text-sm leading-tight">{item.title}</div>
                        <StatusBadge status={item.status} />
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
              {loadingDecisions ? <Skeleton className="h-48" /> : decisionsError ? (
                <ErrorState onRetry={() => refetchDecisions()} />
              ) : decisionsPending?.length === 0 ? (
                <EmptyState icon={CheckCircle2} title="No pending decisions" description="There are no decisions awaiting founder review." />
              ) : decisionsPending?.map((dec) => (
                <Link key={dec.id} href={`/decisions/${dec.id}`} className="block group">
                  <div className="border border-card-border rounded p-3 hover:border-primary/50 transition-colors flex justify-between items-center bg-card shadow-sm group-hover:shadow relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/0 group-hover:bg-primary transition-colors" />
                    <div>
                      <div className="text-[10px] text-primary font-mono uppercase tracking-widest mb-1">{dec.approvalType.replace(/_/g, ' ')}</div>
                      <div className="text-sm font-semibold text-card-foreground">{dec.title}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={dec.status} />
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
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
              {loadingFinancial || loadingMonthly ? <Skeleton className="h-48" /> : (financialError || monthlyError) ? (
                <ErrorState onRetry={() => { refetchFinancial(); refetchMonthly(); }} />
              ) : (
                <div className="space-y-6">
                  {/* Chart */}
                  <div className="h-36 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={financialMonthly?.slice(-6) || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="kpiBarBlue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.95} />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--card-border))" />
                        <XAxis dataKey="month" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${(val/1000)}k`} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip
                          cursor={{ fill: 'hsl(var(--primary) / 0.06)' }}
                          contentStyle={{ fontSize: '12px', backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--card-border))' }}
                          formatter={(val) => `$${Number(val).toLocaleString()}`}
                        />
                        <Bar dataKey="actual" fill="url(#kpiBarBlue)" radius={[3, 3, 0, 0]} barSize={18} />
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
                {loadingRisks || loadingRoadmap ? <Skeleton className="h-32 col-span-2" /> : (risksError || roadmapError) ? (
                  <div className="col-span-2">
                    <ErrorState onRetry={() => { refetchRisks(); refetchRoadmap(); }} />
                  </div>
                ) : (
                  <>
                    {risks?.slice(0, 3).map(risk => (
                      <div key={risk.id} className="border border-card-border rounded p-3 text-sm flex flex-col justify-between group bg-secondary">
                        <div>
                          <div className="font-semibold text-card-foreground tracking-tight">{risk.name}</div>
                          <div className="text-[10px] font-mono text-muted-foreground mt-1 uppercase tracking-widest">{risk.category}</div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <StatusBadge status={risk.status} tone={normalizeStatus(risk.severity) === 'high' ? 'red' : normalizeStatus(risk.severity) === 'medium' ? 'amber' : normalizeStatus(risk.severity) === 'low' ? 'green' : undefined} />
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
                          <StatusBadge status={phase.status} />
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
                {loadingGuardrails ? <Skeleton className="h-16 col-span-2 bg-sidebar-border" /> : guardrailsError ? (
                  <div className="col-span-2 flex items-center gap-2 text-xs text-sidebar-foreground/70">
                    <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                    Unable to load guardrails.
                  </div>
                ) : guardrails?.filter(g => ['active', 'enforced'].includes(g.status.toLowerCase())).slice(0, 4).map(g => (
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

const KPI_TONE: Record<string, { bar: string; chip: string; border: string }> = {
  green: { bar: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-600 ring-emerald-200", border: "hover:border-emerald-300" },
  amber: { bar: "bg-amber-500", chip: "bg-amber-50 text-amber-600 ring-amber-200", border: "hover:border-amber-300" },
  red: { bar: "bg-red-500", chip: "bg-red-50 text-red-600 ring-red-200", border: "hover:border-red-300" },
  blue: { bar: "bg-primary", chip: "bg-primary/10 text-primary ring-primary/20", border: "hover:border-primary/40" },
};

function KpiCard({ label, value, trend, helper, icon: Icon }: { label: string, value: string, trend?: string | null, helper?: string | null, icon: any }) {
  const tone = trend === 'up' ? 'green' : trend === 'down' ? 'amber' : 'blue';
  const t = KPI_TONE[tone];
  return (
    <div className={`border border-card-border rounded bg-card p-5 shadow-sm relative overflow-hidden group flex flex-col transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${t.border}`}>
      <div className={`absolute top-0 left-0 right-0 h-1 ${t.bar}`} />
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground pt-1">{label}</div>
        <span className={`shrink-0 inline-flex h-8 w-8 items-center justify-center rounded ring-1 ${t.chip}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="text-3xl font-sans font-bold text-card-foreground tracking-tighter tabular-nums mb-3">{value}</div>
      <div className="mt-auto">
        <StatusBadge status={trend === 'up' ? 'on_track' : trend === 'down' ? 'watch' : 'info'} label={helper || trend || ''} />
      </div>
    </div>
  );
}

import {
  useGetExecutiveSummary,
  useGetDecisions,
  useGetDecisionSummary,
  useGetBrands,
  useGetPredictors,
  useGetGuardrails,
  useGetDepartments,
  useGetFinancialOverview,
} from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import {
  ChevronRight,
  Shield,
  CheckCircle2,
  Lock,
  Activity,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Network,
  Radar as RadarIcon,
  Layers,
  Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/components/common/KpiCard";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Panel } from "@/components/common/Panel";
import { OrgTree } from "@/components/common/OrgTree";
import { IntelRadar } from "@/components/common/IntelRadar";
import { DepartmentTable } from "@/components/common/DepartmentTable";
import { DecisionTable } from "@/components/common/DecisionTable";
import { useAuthorityMode, AuthorityModeToggle } from "@/context/AuthorityMode";
import { matchesMode } from "@/lib/authority";

export default function Home() {
  const { mode, caption } = useAuthorityMode();
  const { data: summary, isLoading: loadingSummary, isError: summaryError, refetch: refetchSummary } = useGetExecutiveSummary();
  const { data: decisionsPending, isLoading: loadingDecisions, isError: decisionsError, refetch: refetchDecisions } = useGetDecisions({ status: "pending" });
  const { data: decisionSummary } = useGetDecisionSummary();
  const { data: brands, isLoading: loadingBrands, isError: brandsError, refetch: refetchBrands } = useGetBrands();
  const { data: predictors, isLoading: loadingPredictors, isError: predictorsError, refetch: refetchPredictors } = useGetPredictors();
  const { data: guardrails, isLoading: loadingGuardrails, isError: guardrailsError } = useGetGuardrails();
  const { data: ccaDepartments, isLoading: loadingCcaDept, isError: ccaDeptError, refetch: refetchCcaDept } = useGetDepartments({ brand: "CCA" });
  const { data: financial, isLoading: loadingFinancial, isError: financialError, refetch: refetchFinancial } = useGetFinancialOverview();

  const radarData = (predictors ?? [])
    .filter((p) => p.onRadar)
    .slice(0, 8)
    .map((p) => ({ label: p.name.split(" ")[0], score: p.score, level: p.level }));

  const filteredDecisions = (decisionsPending ?? []).filter((d) => matchesMode(mode, d.authorityLabel));

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="CAG Parent Command"
        subtitle="Compliance Authority Group — founder-level portfolio intelligence across all brands. Visibility &amp; recommendation only."
        actions={
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Founder Authority Mode</span>
              <AuthorityModeToggle />
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">{caption}</div>
          </div>
        }
      />

      {/* CLP Strip */}
      <div className="bg-background border border-sidebar-border rounded px-4 py-2.5 flex flex-wrap gap-3 justify-between items-center text-sm shadow-sm">
        <div className="flex items-center gap-3">
          <Shield className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground tracking-tight">CLP Separation Guardrail:</span>
          <span className="text-foreground/70">Approved company systems and cleared source records only. Nothing approved or signed without written founder approval.</span>
        </div>
        <Link href="/brain" className="text-primary font-medium text-xs hover:underline flex items-center gap-1 uppercase tracking-wider">
          View Guardrails <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {/* KPIs */}
      {loadingSummary ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-32 w-full rounded border-border" />)}
        </div>
      ) : summaryError ? (
        <div className="border border-card-border bg-card rounded shadow-sm">
          <ErrorState onRetry={() => refetchSummary()} />
        </div>
      ) : summary ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          <KpiCard label={summary.companyPulse.label} value={summary.companyPulse.value} trend={summary.companyPulse.trend} change={summary.companyPulse.change} unit={summary.companyPulse.unit} helper={summary.companyPulse.helper} icon={Activity} spark={summary.pulseTrend} />
          <KpiCard label={summary.collectedRetainedRevenue.label} value={summary.collectedRetainedRevenue.value} trend={summary.collectedRetainedRevenue.trend} change={summary.collectedRetainedRevenue.change} unit={summary.collectedRetainedRevenue.unit} helper={summary.collectedRetainedRevenue.helper} icon={FileText} />
          <KpiCard label={summary.operatingReserve.label} value={summary.operatingReserve.value} trend={summary.operatingReserve.trend} change={summary.operatingReserve.change} unit={summary.operatingReserve.unit} helper={summary.operatingReserve.helper} icon={Shield} />
          <KpiCard label={summary.majorDecisionsPending.label} value={summary.majorDecisionsPending.value} trend={summary.majorDecisionsPending.trend} change={summary.majorDecisionsPending.change} unit={summary.majorDecisionsPending.unit} helper={summary.majorDecisionsPending.helper} icon={CheckCircle2} />
          {summary.predictiveAlerts && (
            <KpiCard label={summary.predictiveAlerts.label} value={summary.predictiveAlerts.value} trend={summary.predictiveAlerts.trend} change={summary.predictiveAlerts.change} unit={summary.predictiveAlerts.unit} helper={summary.predictiveAlerts.helper} icon={AlertTriangle} />
          )}
        </div>
      ) : null}

      {/* Org Tree */}
      <Panel icon={Network} title="Brand Portfolio Hierarchy" action={<Link href="/brands" className="text-[10px] font-mono uppercase tracking-widest text-primary hover:underline">View Portfolio</Link>}>
        {loadingBrands ? <Skeleton className="h-48" /> : brandsError ? (
          <ErrorState onRetry={() => refetchBrands()} />
        ) : brands && brands.length > 0 ? (
          <OrgTree brands={brands} />
        ) : (
          <EmptyState icon={Network} title="No brands configured" />
        )}
      </Panel>

      {/* Major Decision Control */}
      <Panel
        icon={Lock}
        title="Major Decision Control"
        action={<Link href="/decisions" className="text-[10px] font-mono uppercase tracking-widest text-primary hover:underline">View All</Link>}
        bodyClassName="p-0"
      >
        {decisionSummary && (
          <div className="grid grid-cols-2 divide-x divide-card-border border-b border-card-border bg-secondary/40">
            <div className="px-5 py-3">
              <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest">Capital Impact Under Review</div>
              <div className="text-lg font-bold text-card-foreground tracking-tight tabular-nums mt-1">{decisionSummary.totalImpact}</div>
            </div>
            <div className="px-5 py-3">
              <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest">Pending Founder Approval</div>
              <div className="text-lg font-bold text-card-foreground tracking-tight tabular-nums mt-1">{decisionSummary.pendingApproval} <span className="text-xs font-medium text-muted-foreground">of {decisionSummary.total}</span></div>
            </div>
          </div>
        )}
        {loadingDecisions ? <div className="p-5"><Skeleton className="h-48" /></div> : decisionsError ? (
          <div className="p-5"><ErrorState onRetry={() => refetchDecisions()} /></div>
        ) : filteredDecisions.length === 0 ? (
          <div className="p-5"><EmptyState icon={CheckCircle2} title="No decisions in this lens" description={`No pending decisions match the ${mode} authority lens.`} /></div>
        ) : (
          <DecisionTable decisions={filteredDecisions} />
        )}
      </Panel>

      {/* CCA Operating Pulse snapshot */}
      <Panel
        icon={Layers}
        title="CCA Operating Pulse"
        action={<Link href="/operating" className="text-[10px] font-mono uppercase tracking-widest text-primary hover:underline">Open Operating Pulse</Link>}
        bodyClassName="p-0"
      >
        {loadingCcaDept ? <div className="p-6"><Skeleton className="h-40" /></div> : ccaDeptError ? (
          <div className="p-6"><ErrorState onRetry={() => refetchCcaDept()} /></div>
        ) : ccaDepartments && ccaDepartments.length > 0 ? (
          <DepartmentTable departments={ccaDepartments} />
        ) : (
          <div className="p-6"><EmptyState icon={Layers} title="No departments" description="No CCA departments are configured yet." /></div>
        )}
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Intelligence */}
        <Panel
          icon={Wallet}
          title="Financial Intelligence"
          action={<Link href="/financial" className="text-[10px] font-mono uppercase tracking-widest text-primary hover:underline">Financial Review</Link>}
        >
          {loadingFinancial ? <Skeleton className="h-64" /> : financialError ? (
            <ErrorState onRetry={() => refetchFinancial()} />
          ) : financial ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-card-border rounded p-4 bg-secondary/40">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Operating Reserve</div>
                  <div className="text-2xl font-bold text-card-foreground tabular-nums tracking-tight">{financial.reserveMonths}<span className="text-sm text-muted-foreground font-semibold ml-1">mo</span></div>
                  <div className="text-[10px] font-mono text-muted-foreground mt-1">Target {financial.reserveTarget}mo</div>
                </div>
                <div className="border border-card-border rounded p-4 bg-secondary/40">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Revenue Trigger</div>
                  <div className="text-2xl font-bold text-card-foreground tabular-nums tracking-tight">{financial.revenueTriggerProgress}<span className="text-sm text-muted-foreground font-semibold ml-1">%</span></div>
                  <div className="w-full bg-secondary rounded-full h-1.5 mt-2.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min(100, Math.max(0, financial.revenueTriggerProgress))}%` }} />
                  </div>
                </div>
              </div>
              <div className="divide-y divide-card-border border-t border-card-border">
                {financial.metrics.slice(0, 4).map((metric, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5">
                    <span className="text-xs text-card-foreground/80 font-medium">{metric.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-card-foreground tabular-nums">{metric.value}{metric.unit ?? ""}</span>
                      {metric.change && (
                        <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold tabular-nums ${metric.trend === "up" ? "text-emerald-400" : metric.trend === "down" ? "text-amber-400" : "text-muted-foreground"}`}>
                          {metric.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : metric.trend === "down" ? <ArrowDownRight className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                          {metric.change}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState icon={Wallet} title="No financial data" />
          )}
        </Panel>

        {/* Predictors Radar */}
        <Panel
          icon={RadarIcon}
          title="Predictive Intelligence Radar"
          action={<Link href="/predictors" className="text-[10px] font-mono uppercase tracking-widest text-primary hover:underline">All 18 Modules</Link>}
        >
          {loadingPredictors ? <Skeleton className="h-64" /> : predictorsError ? (
            <ErrorState onRetry={() => refetchPredictors()} />
          ) : radarData.length > 0 ? (
            <>
              <IntelRadar data={radarData} />
              <p className="text-[11px] text-muted-foreground text-center mt-2">Composite health across the top monitored intelligence modules (higher is healthier).</p>
            </>
          ) : (
            <EmptyState icon={RadarIcon} title="No predictors on radar" />
          )}
        </Panel>
      </div>

      {/* Guardrails */}
      <div className="border border-sidebar-border bg-sidebar rounded-md shadow-sm overflow-hidden text-sidebar-foreground">
        <div className="px-5 py-3 border-b border-sidebar-border flex items-center gap-2">
          <Lock className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold tracking-tight">Governance Guardrails</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {loadingGuardrails ? <Skeleton className="h-16 col-span-2 bg-sidebar-border" /> : guardrailsError ? (
              <div className="col-span-2 flex items-center gap-2 text-xs text-sidebar-foreground/70">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" /> Unable to load guardrails.
              </div>
            ) : guardrails?.filter((g) => ["active", "enforced"].includes(g.status.toLowerCase())).slice(0, 4).map((g) => (
              <div key={g.id} className="bg-sidebar-accent border border-sidebar-border rounded p-2 text-[11px] font-semibold flex items-center gap-2">
                <Lock className="h-3 w-3 text-primary shrink-0" />
                <span className="truncate">{g.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

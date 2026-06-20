import {
  useGetExecutiveSummary,
  useGetDecisions,
  useGetDecisionSummary,
  useGetBrands,
  useGetPredictors,
  useGetGuardrails,
  useGetDepartments,
  useGetFinancialOverview,
  useGetSourceRecords,
} from "@workspace/api-client-react";
import { Link } from "wouter";
import { format } from "date-fns";
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
  Database,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/components/common/KpiCard";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Panel } from "@/components/common/Panel";
import { OrgTree } from "@/components/common/OrgTree";
import { BrandCard } from "@/components/common/BrandCard";
import { IntelRadar } from "@/components/common/IntelRadar";
import { PredictorCard } from "@/components/common/PredictorCard";
import { DepartmentTable } from "@/components/common/DepartmentTable";
import { DecisionTable } from "@/components/common/DecisionTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useAuthorityMode, AuthorityModeToggle } from "@/context/AuthorityMode";
import { matchesMode } from "@/lib/authority";
import { useAccess } from "@/context/Access";

const viewLink = (href: string, label: string) => (
  <Link href={href} className="text-[10px] font-mono uppercase tracking-widest text-primary hover:underline flex items-center gap-1">
    {label} <ChevronRight className="h-3 w-3" />
  </Link>
);

export default function TonyOS() {
  const { isLeadership } = useAccess();

  if (!isLeadership) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md text-center border border-card-border bg-card rounded-md shadow-sm p-10">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded bg-primary/10 text-primary ring-1 ring-primary/20 mx-auto">
            <Lock className="h-6 w-6" />
          </span>
          <h2 className="text-xl font-bold tracking-tight text-card-foreground mt-5">Restricted Access</h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            TonyOS executive intelligence is limited to approved founder-level leadership. Switch to a Leadership access role to view this screen.
          </p>
          <Link href="/" className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-primary hover:underline mt-6">
            Return to Command Center <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    );
  }

  return <TonyOSExecutive />;
}

function TonyOSExecutive() {
  const { mode, caption } = useAuthorityMode();

  const { data: summary, isLoading: loadingSummary, isError: summaryError, refetch: refetchSummary } = useGetExecutiveSummary();
  const { data: decisionsPending, isLoading: loadingDecisions, isError: decisionsError, refetch: refetchDecisions } = useGetDecisions({ status: "pending" });
  const { data: decisionSummary } = useGetDecisionSummary();
  const { data: brands, isLoading: loadingBrands, isError: brandsError, refetch: refetchBrands } = useGetBrands();
  const { data: predictors, isLoading: loadingPredictors, isError: predictorsError, refetch: refetchPredictors } = useGetPredictors();
  const { data: guardrails, isLoading: loadingGuardrails, isError: guardrailsError } = useGetGuardrails();
  const { data: ccaDepartments, isLoading: loadingCcaDept, isError: ccaDeptError, refetch: refetchCcaDept } = useGetDepartments({ brand: "CCA" });
  const { data: financial, isLoading: loadingFinancial, isError: financialError, refetch: refetchFinancial } = useGetFinancialOverview();
  const { data: records, isLoading: loadingRecords, isError: recordsError, refetch: refetchRecords } = useGetSourceRecords();

  const radarData = (predictors ?? [])
    .filter((p) => p.onRadar)
    .slice(0, 8)
    .map((p) => ({ label: p.name.split(" ")[0], score: p.score, level: p.level }));

  const topPredictors = (predictors ?? [])
    .filter((p) => p.level.toLowerCase() !== "stable" && p.level.toLowerCase() !== "low")
    .slice(0, 3);
  const predictorsToShow = topPredictors.length > 0 ? topPredictors : (predictors ?? []).slice(0, 3);

  const filteredDecisions = (decisionsPending ?? []).filter((d) => matchesMode(mode, d.authorityLabel));
  const activeGuardrails = (guardrails ?? []).filter((g) => ["active", "enforced"].includes(g.status.toLowerCase()));

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="TonyOS Executive Intelligence"
        subtitle="Compliance Authority Group — founder-level strategic oversight across parent company, brands, operations, financials, risk, and predictive intelligence. Visibility & recommendation only."
        actions={
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-sm bg-primary/10 border border-primary/20 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-primary">
                <ShieldCheck className="h-3 w-3" /> Founder-Level Oversight
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Founder Authority Mode</span>
              <AuthorityModeToggle />
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">{caption}</div>
          </div>
        }
      />

      {/* CLP Separation Guardrail */}
      <div className="bg-background border border-sidebar-border rounded px-4 py-2.5 flex flex-wrap gap-3 justify-between items-center text-sm shadow-sm">
        <div className="flex items-center gap-3">
          <Shield className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground tracking-tight">CLP Separation Guardrail:</span>
          <span className="text-foreground/70">Approved company systems and cleared source records only.</span>
        </div>
        {viewLink("/brain", "Source Records")}
      </div>

      {/* 1. Parent Company Overview */}
      <section className="space-y-4">
        <SectionLabel icon={Activity} title="Parent Company Overview" href="/" cta="Full Dashboard" />
        {loadingSummary ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-32 w-full rounded border-border" />)}
          </div>
        ) : summaryError ? (
          <div className="border border-card-border bg-card rounded shadow-sm"><ErrorState onRetry={() => refetchSummary()} /></div>
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
      </section>

      {/* 2. Brand Portfolio */}
      <Panel icon={Network} title="Brand Portfolio" action={viewLink("/brands", "View Portfolio")}>
        {loadingBrands ? <Skeleton className="h-48" /> : brandsError ? (
          <ErrorState onRetry={() => refetchBrands()} />
        ) : brands && brands.length > 0 ? (
          <div className="space-y-6">
            <OrgTree brands={brands} />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {brands.map((b) => <BrandCard key={b.code} brand={b} />)}
            </div>
          </div>
        ) : (
          <EmptyState icon={Network} title="No brands configured" />
        )}
      </Panel>

      {/* 3. CCA Operating Pulse */}
      <Panel icon={Layers} title="CCA Operating Pulse" action={viewLink("/operating", "Open Operating Pulse")} bodyClassName="p-0">
        {loadingCcaDept ? <div className="p-6"><Skeleton className="h-40" /></div> : ccaDeptError ? (
          <div className="p-6"><ErrorState onRetry={() => refetchCcaDept()} /></div>
        ) : ccaDepartments && ccaDepartments.length > 0 ? (
          <DepartmentTable departments={ccaDepartments} />
        ) : (
          <div className="p-6"><EmptyState icon={Layers} title="No departments" description="No CCA departments are configured yet." /></div>
        )}
      </Panel>

      {/* 4 + 5. Predictive Intelligence + Financial Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel icon={RadarIcon} title="Predictive Intelligence Radar" action={viewLink("/predictors", "All 18 Modules")}>
          {loadingPredictors ? <Skeleton className="h-64" /> : predictorsError ? (
            <ErrorState onRetry={() => refetchPredictors()} />
          ) : radarData.length > 0 ? (
            <div className="space-y-4">
              <IntelRadar data={radarData} />
              <div className="grid grid-cols-1 gap-3">
                {predictorsToShow.map((p) => <PredictorCard key={p.id} predictor={p} />)}
              </div>
            </div>
          ) : (
            <EmptyState icon={RadarIcon} title="No predictors on radar" />
          )}
        </Panel>

        <Panel icon={Wallet} title="Financial Intelligence" action={viewLink("/financial", "Financial Review")}>
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
                {financial.metrics.slice(0, 6).map((metric, i) => (
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
      </div>

      {/* 6. Major Decision Control */}
      <Panel icon={Lock} title="Major Decision Control" action={viewLink("/decisions", "View All")} bodyClassName="p-0">
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

      {/* 7 + 8. Governance Guardrails + Company Brain */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Governance Guardrails */}
        <div className="border border-sidebar-border bg-sidebar rounded shadow-sm overflow-hidden text-sidebar-foreground">
          <div className="px-6 py-4 border-b border-sidebar-border flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold tracking-tight">Governance Guardrails</h2>
            </div>
            {viewLink("/brain", "View All")}
          </div>
          <div className="p-6 space-y-3">
            {loadingGuardrails ? (
              <Skeleton className="h-48 rounded bg-sidebar-border" />
            ) : guardrailsError ? (
              <div className="flex items-center gap-2 text-xs text-sidebar-foreground/70">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" /> Unable to load guardrails.
              </div>
            ) : activeGuardrails.length === 0 ? (
              <EmptyState icon={Lock} title="No guardrails" description="No authority guardrails have been configured." />
            ) : activeGuardrails.map((g) => (
              <div key={g.id} className="border border-sidebar-border rounded p-4 bg-sidebar-accent/30 shadow-sm">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3">
                    {g.status.toLowerCase() === "active" || g.status.toLowerCase() === "enforced" ? <Lock className="h-4 w-4 text-primary" /> : <ShieldAlert className="h-4 w-4 text-amber-500" />}
                    <h3 className="text-sm font-bold tracking-tight">{g.title}</h3>
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-[2px] border font-bold bg-primary/20 text-primary border-primary/30">{g.status}</span>
                </div>
                {g.description && <p className="text-xs text-sidebar-foreground/70 mt-2.5 leading-relaxed ml-7 font-medium">{g.description}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Company Brain / Source Records */}
        <Panel icon={Database} title="Company Brain / Source Records" action={viewLink("/brain", "Open Company Brain")} bodyClassName="p-6 space-y-3">
          {loadingRecords ? (
            <Skeleton className="h-48 rounded border-border" />
          ) : recordsError ? (
            <ErrorState onRetry={() => refetchRecords()} />
          ) : records?.length === 0 ? (
            <EmptyState icon={Database} title="No source records" description="No source records are currently connected." />
          ) : records?.slice(0, 5).map((rec) => (
            <Link
              key={rec.id}
              href={`/brain?record=${encodeURIComponent(rec.title)}`}
              className="block border border-card-border bg-secondary rounded p-4 hover:border-primary/50 transition-colors group"
            >
              <div className="flex justify-between items-center gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-sm font-semibold text-card-foreground truncate">{rec.title}</h3>
                    {rec.clpCleared && (
                      <span className="bg-emerald-500/15 text-emerald-300 px-1.5 py-0.5 rounded-[2px] text-[9px] font-mono uppercase tracking-widest border border-emerald-500/30 font-bold shrink-0">Cleared</span>
                    )}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground flex gap-2">
                    <span>{rec.source}</span>
                    <span className="text-card-border">&bull;</span>
                    <span>{rec.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <StatusBadge status={rec.status} />
                    <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground mt-2 font-bold">Updated {format(new Date(rec.lastUpdated), "MMM d")}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </Panel>
      </div>
    </div>
  );
}

function SectionLabel({ icon: Icon, title, href, cta }: { icon: any; title: string; href: string; cta: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-card-border pb-2">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-primary/10 text-primary ring-1 ring-primary/15 shrink-0">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <h2 className="text-base font-bold tracking-tight text-foreground">{title}</h2>
      </div>
      {viewLink(href, cta)}
    </div>
  );
}

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
  Map as MapIcon,
  Radar as RadarIcon,
  Layers,
  Wallet,
  Database,
  ShieldAlert,
  ShieldCheck,
  Compass,
  Target,
  Waves,
  Plane,
  Trophy,
  Dumbbell,
  NotebookPen,
  Anchor,
  Network,
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
  const sortedPending = [...filteredDecisions].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  );
  const weekHorizon = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const dueThisWeek = sortedPending.filter((d) => new Date(d.dueDate).getTime() <= weekHorizon);
  // Prefer items due this week; fall back to the soonest upcoming so the panel is never uselessly empty.
  const onDeck = (dueThisWeek.length > 0 ? dueThisWeek : sortedPending).slice(0, 4);
  const onDeckThisWeek = dueThisWeek.length > 0;
  const activeGuardrails = (guardrails ?? []).filter((g) => ["active", "enforced"].includes(g.status.toLowerCase()));

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="TonyOS Command Center"
        subtitle="CAG oversight, founder strategy, and forward signals — strategic visibility and recommendation only, never automatic operational control."
        actions={
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-sm bg-command/10 border border-command/30 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-command">
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

      {/* On Deck — top items that need Tony's review this week */}
      <Panel icon={Anchor} title="On Deck" action={viewLink("/decisions", "Open Game Plan")} bodyClassName="p-0">
        {loadingDecisions ? (
          <div className="p-5"><Skeleton className="h-28" /></div>
        ) : onDeck.length === 0 ? (
          <div className="p-5"><EmptyState icon={CheckCircle2} title="Nothing on deck" description={`No items need review in the ${mode} authority lens.`} /></div>
        ) : (
          <>
          <div className="px-5 py-2.5 border-b border-card-border text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            {onDeckThisWeek ? "Needs Tony's review this week" : "No items due this week — next up for founder review"}
          </div>
          <ul className="divide-y divide-card-border">
            {onDeck.map((d) => (
              <li key={d.id}>
                <Link href={`/decisions/${d.id}`} className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-secondary/40 transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-primary/10 text-primary ring-1 ring-primary/15 shrink-0">
                      <Target className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-card-foreground truncate">{d.title}</div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground flex flex-wrap gap-x-2 mt-0.5">
                        {d.authorityLabel && <span className="text-primary">{d.authorityLabel}</span>}
                        {d.estimatedImpact && <><span className="text-card-border">&bull;</span><span>{d.estimatedImpact}</span></>}
                        <span className="text-card-border">&bull;</span>
                        <span>Due {format(new Date(d.dueDate), "MMM d")}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
          </>
        )}
      </Panel>

      {/* 1. Strategic Compass — parent-company direction */}
      <section className="space-y-4">
        <SectionLabel icon={Compass} title="Strategic Compass" href="/" cta="Full Dashboard" />
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

      {/* 2. Expansion Map */}
      <Panel icon={MapIcon} title="Expansion Map" action={viewLink("/brands", "View Expansion Map")}>
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
      <Panel icon={Layers} title="CCA Operating Pulse" action={viewLink("/operating", "Open Strategic Compass")} bodyClassName="p-0">
        {loadingCcaDept ? <div className="p-6"><Skeleton className="h-40" /></div> : ccaDeptError ? (
          <div className="p-6"><ErrorState onRetry={() => refetchCcaDept()} /></div>
        ) : ccaDepartments && ccaDepartments.length > 0 ? (
          <DepartmentTable departments={ccaDepartments} />
        ) : (
          <div className="p-6"><EmptyState icon={Layers} title="No departments" description="No CCA departments are configured yet." /></div>
        )}
      </Panel>

      {/* 4 + 5. Forward Signals + Founder Financials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel icon={RadarIcon} title="Forward Signals" action={viewLink("/predictors", "All 18 Modules")}>
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

        <Panel icon={Wallet} title="Founder Financials" action={viewLink("/financial", "Founder Financials")}>
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

      {/* 6. Game Plan */}
      <Panel icon={Target} title="Game Plan" action={viewLink("/decisions", "View All")} bodyClassName="p-0">
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

        {/* Company Intelligence / Source Records */}
        <Panel icon={Database} title="Company Intelligence" action={viewLink("/brain", "Open Company Intelligence")} bodyClassName="p-6 space-y-3">
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

      {/* Deep Dive — drill-down access across the command center */}
      <section className="space-y-4">
        <SectionLabel icon={Network} title="Deep Dive" href="/brain" cta="Company Intelligence" />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {deepDiveLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex flex-col gap-3 rounded border border-card-border bg-card p-4 hover:border-primary/50 transition-colors"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary ring-1 ring-primary/15">
                <l.icon className="h-4 w-4" />
              </span>
              <div>
                <div className="text-sm font-semibold text-card-foreground">{l.title}</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-0.5 flex items-center gap-1 group-hover:text-primary transition-colors">
                  Drill in <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tony Mode — founder's personal lens */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-card-border pb-2">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-primary/10 text-primary ring-1 ring-primary/15 shrink-0">
              <Anchor className="h-3.5 w-3.5" />
            </span>
            <h2 className="text-base font-bold tracking-tight text-foreground">Tony Mode</h2>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Founder's Personal Lens</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          {tonyMode.map((t) => (
            <div key={t.title} className="rounded border border-card-border bg-card p-4">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-secondary text-primary ring-1 ring-card-border shrink-0">
                  <t.icon className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm font-semibold text-card-foreground">{t.title}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed">{t.note}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const deepDiveLinks: { href: string; title: string; icon: any }[] = [
  { href: "/operating", title: "CCA Operations", icon: Layers },
  { href: "/brands", title: "Expansion Map", icon: MapIcon },
  { href: "/decisions", title: "Game Plan", icon: Target },
  { href: "/predictors", title: "Forward Signals", icon: RadarIcon },
  { href: "/financial", title: "Founder Financials", icon: Wallet },
  { href: "/brain", title: "Company Intelligence", icon: Database },
];

const tonyMode: { title: string; icon: any; note: string }[] = [
  { title: "Ocean", icon: Waves, note: "Time on the water keeps the long view. Protected, off the operating clock." },
  { title: "Travel", icon: Plane, note: "Scouting trips and expansion travel logged against the brand map." },
  { title: "Game Day", icon: Trophy, note: "Founder rhythm — competitive cadence carried into the week ahead." },
  { title: "Strength", icon: Dumbbell, note: "Training discipline. Energy budget that funds the executive load." },
  { title: "Field Notes", icon: NotebookPen, note: "Off-the-record observations to revisit before the next major call." },
];

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

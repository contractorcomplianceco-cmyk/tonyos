import { useGetFinancialOverview, useGetFinancialMonthly, useGetFinancialCommitments, useGetMonthlyReviews } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, ShieldAlert, ArrowUpRight, ArrowDownRight, Minus, FileText } from "lucide-react";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Link } from "wouter";
import { PageHeader } from "@/components/common/PageHeader";
import { Panel } from "@/components/common/Panel";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";

export default function Financial() {
  const { data: overview, isLoading: loadingOverview, isError: overviewError, refetch: refetchOverview } = useGetFinancialOverview();
  const { data: monthly, isLoading: loadingMonthly, isError: monthlyError, refetch: refetchMonthly } = useGetFinancialMonthly();
  const { data: commitments, isLoading: loadingCommitments, isError: commitmentsError, refetch: refetchCommitments } = useGetFinancialCommitments();
  const { data: reviews, isLoading: loadingReviews, isError: reviewsError, refetch: refetchReviews } = useGetMonthlyReviews();

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Financial Review"
        subtitle={
          <span className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" /> Visibility Only — No Signing or Transfer Authority
          </span>
        }
      />

      {loadingOverview ? (
        <Skeleton className="h-32 w-full rounded border-border" />
      ) : overviewError ? (
        <div className="border border-card-border bg-card rounded shadow-sm">
          <ErrorState onRetry={() => refetchOverview()} />
        </div>
      ) : overview ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 border border-card-border bg-card rounded shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
            <div className="p-6 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Operating Reserve</div>
                <div className="text-4xl font-sans font-bold text-card-foreground tracking-tighter tabular-nums">
                  {overview.reserveMonths} <span className="text-sm text-muted-foreground font-semibold tracking-normal">months</span>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="text-[9px] font-mono uppercase tracking-widest bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-[2px]">Target: {overview.reserveTarget}mo</div>
                  <div className="text-[10px] uppercase font-mono text-muted-foreground flex items-center gap-1"><ShieldAlert className="h-3 w-3" /> Guardrail active</div>
                </div>
              </div>
              <div className="w-1/2 max-w-[160px]">
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1.5 uppercase tracking-widest">
                  <span>Current</span>
                  <span>Target</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min((overview.reserveMonths / overview.reserveTarget) * 100, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          {overview.metrics.slice(0, 2).map((metric, i) => (
            <div key={i} className="border border-card-border bg-card rounded shadow-sm p-6 flex flex-col justify-center">
              <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">{metric.label}</div>
              <div className="text-3xl font-sans font-bold text-card-foreground tracking-tighter tabular-nums">{metric.value}</div>
              {metric.change && (
                <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-muted-foreground">
                  {metric.trend === 'up' ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" /> :
                   metric.trend === 'down' ? <ArrowDownRight className="h-3.5 w-3.5 text-red-400" /> :
                   <Minus className="h-3.5 w-3.5" />}
                  {metric.change}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Monthly Actual vs Plan">
            {loadingMonthly ? (
              <Skeleton className="h-64 w-full" />
            ) : monthlyError ? (
              <ErrorState onRetry={() => refetchMonthly()} />
            ) : monthly?.length === 0 ? (
              <EmptyState title="No monthly data" description="No monthly actuals have been recorded yet." />
            ) : (
              <div className="h-[300px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthly || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--card-border))" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "var(--app-font-mono)" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "var(--app-font-mono)" }} tickFormatter={(val) => `$${(val/1000)}k`} />
                    <Tooltip cursor={{ fill: "hsl(var(--primary)/0.10)" }} contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--card-border))", borderRadius: "4px", fontSize: '12px', color: "hsl(var(--card-foreground))" }} itemStyle={{ color: "hsl(var(--card-foreground))" }} labelStyle={{ color: "hsl(var(--muted-foreground))" }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontFamily: "var(--app-font-mono)", textTransform: 'uppercase' }} />
                    <Bar dataKey="actual" name="Actual" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} maxBarSize={32} />
                    <Bar dataKey="plan" name="Plan" fill="hsl(var(--muted-foreground)/0.3)" radius={[2, 2, 0, 0]} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Panel>

          <Panel title="Monthly Founder Reviews" bodyClassName="p-6 space-y-3">
            {loadingReviews ? (
              <Skeleton className="h-32" />
            ) : reviewsError ? (
              <ErrorState onRetry={() => refetchReviews()} />
            ) : reviews?.length === 0 ? (
              <EmptyState icon={FileText} title="No reviews" description="No monthly founder reviews are available yet." />
            ) : reviews?.map(rev => (
              <Link key={rev.id} href={`/reviews/${rev.id}`} className="flex items-center justify-between p-4 border border-card-border rounded hover:border-primary/50 transition-colors bg-secondary group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-semibold text-sm text-card-foreground">{rev.period} Financial Review</span>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={rev.status} />
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Bank Accounts" action={<Eye className="h-4 w-4 text-muted-foreground" />} bodyClassName="p-6 space-y-4">
            {loadingOverview ? (
              <Skeleton className="h-32" />
            ) : overviewError ? (
              <ErrorState onRetry={() => refetchOverview()} />
            ) : overview?.bankSummaries?.length === 0 ? (
              <EmptyState title="No bank accounts" description="No bank summaries are available." />
            ) : overview?.bankSummaries?.map((bank, i) => (
              <div key={i} className="p-4 border border-card-border rounded bg-secondary">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">{bank.name}</div>
                <div className="text-2xl font-sans font-bold text-card-foreground tracking-tighter tabular-nums">{bank.balance}</div>
                <div className="text-[9px] text-muted-foreground mt-2 uppercase font-mono tracking-widest border-t border-card-border pt-2">{bank.note}</div>
              </div>
            ))}
          </Panel>

          <Panel title="Upcoming Commitments" bodyClassName="p-6 space-y-1">
            {loadingCommitments ? (
              <Skeleton className="h-48" />
            ) : commitmentsError ? (
              <ErrorState onRetry={() => refetchCommitments()} />
            ) : commitments?.length === 0 ? (
              <EmptyState title="No commitments" description="No upcoming commitments are scheduled." />
            ) : commitments?.map(comm => (
              <div key={comm.id} className="flex justify-between items-center py-3 border-b border-card-border last:border-0 last:pb-0">
                <div>
                  <div className="font-semibold text-sm text-card-foreground">{comm.label}</div>
                  <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mt-1">Due {format(new Date(comm.dueDate), 'MMM d')}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm text-card-foreground tabular-nums">{comm.amount}</div>
                  {comm.approvalRequired && <div className="text-[9px] font-mono text-primary uppercase tracking-widest mt-1">Approval Req</div>}
                </div>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </div>
  );
}

import { useGetFinancialOverview, useGetFinancialMonthly, useGetFinancialCommitments, useGetMonthlyReviews } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, ShieldAlert, ArrowUpRight, ArrowDownRight, Minus, FileText } from "lucide-react";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Link } from "wouter";

export default function Financial() {
  const { data: overview, isLoading: loadingOverview } = useGetFinancialOverview();
  const { data: monthly, isLoading: loadingMonthly } = useGetFinancialMonthly();
  const { data: commitments, isLoading: loadingCommitments } = useGetFinancialCommitments();
  const { data: reviews, isLoading: loadingReviews } = useGetMonthlyReviews();

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-sans text-foreground font-bold tracking-tight">Financial Review</h1>
          <div className="flex items-center gap-2 text-foreground/70 mt-1 text-sm font-medium">
            <Eye className="h-4 w-4 text-primary" /> Visibility Only — No Signing or Transfer Authority
          </div>
        </div>
      </div>

      {loadingOverview ? (
        <Skeleton className="h-32 w-full rounded border-border" />
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
                  <div className="text-[9px] font-mono uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-[2px]">Target: {overview.reserveTarget}mo</div>
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
                  {metric.trend === 'up' ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" /> : 
                   metric.trend === 'down' ? <ArrowDownRight className="h-3.5 w-3.5 text-red-600" /> :
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
          <div className="border border-card-border bg-card rounded shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-card-border">
              <h2 className="text-base font-bold tracking-tight text-card-foreground">Monthly Actual vs Plan</h2>
            </div>
            <div className="p-6">
              {loadingMonthly ? <Skeleton className="h-64 w-full" /> : (
                <div className="h-[300px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthly || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--card-border))" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "var(--app-font-mono)" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "var(--app-font-mono)" }} tickFormatter={(val) => `$${(val/1000)}k`} />
                      <Tooltip cursor={{ fill: "hsl(var(--secondary)/0.5)" }} contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--card-border))", borderRadius: "4px", fontSize: '12px' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontFamily: "var(--app-font-mono)", textTransform: 'uppercase' }} />
                      <Bar dataKey="actual" name="Actual" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} maxBarSize={32} />
                      <Bar dataKey="plan" name="Plan" fill="hsl(var(--muted-foreground)/0.3)" radius={[2, 2, 0, 0]} maxBarSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          <div className="border border-card-border bg-card rounded shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-card-border">
              <h2 className="text-base font-bold tracking-tight text-card-foreground">Monthly Founder Reviews</h2>
            </div>
            <div className="p-6 space-y-3">
              {loadingReviews ? <Skeleton className="h-32" /> : reviews?.map(rev => (
                <Link key={rev.id} href={`/reviews/${rev.id}`} className="flex items-center justify-between p-4 border border-card-border rounded hover:border-primary/50 transition-colors bg-secondary group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-semibold text-sm text-card-foreground">{rev.period} Financial Review</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-[2px] border ${rev.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {rev.status}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-card-border bg-card rounded shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-card-border flex flex-row items-center justify-between">
              <h2 className="text-base font-bold tracking-tight text-card-foreground">Bank Accounts</h2>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-6 space-y-4">
              {loadingOverview ? <Skeleton className="h-32" /> : overview?.bankSummaries?.map((bank, i) => (
                <div key={i} className="p-4 border border-card-border rounded bg-secondary">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">{bank.name}</div>
                  <div className="text-2xl font-sans font-bold text-card-foreground tracking-tighter tabular-nums">{bank.balance}</div>
                  <div className="text-[9px] text-muted-foreground mt-2 uppercase font-mono tracking-widest border-t border-card-border pt-2">{bank.note}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-card-border bg-card rounded shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-card-border">
              <h2 className="text-base font-bold tracking-tight text-card-foreground">Upcoming Commitments</h2>
            </div>
            <div className="p-6 space-y-1">
              {loadingCommitments ? <Skeleton className="h-48" /> : commitments?.map(comm => (
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

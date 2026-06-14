import { useGetFinancialOverview, useGetFinancialMonthly, useGetFinancialCommitments, useGetMonthlyReviews } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-serif text-foreground font-medium tracking-tight">Financial Review</h1>
        <div className="flex items-center gap-2 text-muted-foreground mt-1 text-sm font-medium">
          <Eye className="h-4 w-4 text-primary" /> Visibility Only — No Signing or Transfer Authority
        </div>
      </div>

      {loadingOverview ? (
        <Skeleton className="h-32 w-full" />
      ) : overview ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-sm md:col-span-2 bg-secondary/10 border-border">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Operating Reserve</div>
                <div className="text-3xl font-serif text-foreground">{overview.reserveMonths} <span className="text-sm text-muted-foreground font-sans">months</span></div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-sm">Target: {overview.reserveTarget}mo</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><ShieldAlert className="h-3 w-3" /> Guardrail active</div>
                </div>
              </div>
              <div className="w-1/2 max-w-[150px]">
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1 uppercase">
                  <span>Current</span>
                  <span>Target</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min((overview.reserveMonths / overview.reserveTarget) * 100, 100)}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {overview.metrics.slice(0, 2).map((metric, i) => (
            <Card key={i} className="shadow-sm">
              <CardContent className="p-5">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{metric.label}</div>
                <div className="text-2xl font-serif text-foreground">{metric.value}</div>
                {metric.change && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    {metric.trend === 'up' ? <ArrowUpRight className="h-3 w-3 text-emerald-600" /> : 
                     metric.trend === 'down' ? <ArrowDownRight className="h-3 w-3 text-red-600" /> :
                     <Minus className="h-3 w-3" />}
                    {metric.change}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif">Monthly Actual vs Plan</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingMonthly ? <Skeleton className="h-64 w-full" /> : (
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthly || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(val) => `$${(val/1000)}k`} />
                      <Tooltip cursor={{ fill: "hsl(var(--secondary)/0.5)" }} contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "4px" }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                      <Bar dataKey="actual" name="Actual" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} maxBarSize={32} />
                      <Bar dataKey="plan" name="Plan" fill="hsl(var(--muted-foreground)/0.3)" radius={[2, 2, 0, 0]} maxBarSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif">Monthly Founder Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {loadingReviews ? <Skeleton className="h-32" /> : reviews?.map(rev => (
                <Link key={rev.id} href={`/reviews/${rev.id}`} className="flex items-center justify-between p-3 border border-border rounded-md hover:border-primary/50 transition-colors bg-secondary/5 group">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm text-foreground">{rev.period} Financial Review</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm border ${rev.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {rev.status}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-serif">Bank Accounts</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingOverview ? <Skeleton className="h-32" /> : overview?.bankSummaries?.map((bank, i) => (
                <div key={i} className="p-3 border border-border rounded-md bg-secondary/10">
                  <div className="text-xs font-medium text-muted-foreground mb-1">{bank.name}</div>
                  <div className="text-xl font-serif text-foreground">{bank.balance}</div>
                  <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">{bank.note}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif">Upcoming Commitments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingCommitments ? <Skeleton className="h-48" /> : commitments?.map(comm => (
                <div key={comm.id} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium text-sm text-foreground">{comm.label}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">Due {format(new Date(comm.dueDate), 'MMM d')}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm text-foreground">{comm.amount}</div>
                    {comm.approvalRequired && <div className="text-[9px] font-mono text-primary uppercase tracking-widest mt-0.5">Approval Req</div>}
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

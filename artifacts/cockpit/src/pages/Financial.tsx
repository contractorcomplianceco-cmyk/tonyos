import { useGetFinancialOverview, useGetFinancialMonthly, useGetFinancialCommitments } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Eye, ShieldAlert, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export default function Financial() {
  const { data: overview, isLoading: loadingOverview } = useGetFinancialOverview();
  const { data: monthly, isLoading: loadingMonthly } = useGetFinancialMonthly();
  const { data: commitments, isLoading: loadingCommitments } = useGetFinancialCommitments();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-serif text-primary">Financial Visibility</h1>
        <div className="flex items-center gap-2 text-muted-foreground font-mono text-sm tracking-tight uppercase">
          <Eye className="h-4 w-4" /> Visibility Only — No Signing or Transfer Authority
        </div>
      </div>

      {loadingOverview ? (
        <Skeleton className="h-48 w-full" />
      ) : overview ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card/30 border-border/50 md:col-span-2">
            <CardContent className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-sm font-mono uppercase tracking-tight text-muted-foreground">Operating Reserve</div>
                  <div className="text-4xl font-serif text-foreground">{overview.reserveMonths} <span className="text-lg text-muted-foreground">months</span></div>
                </div>
                <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 text-xs font-mono uppercase tracking-wider rounded border border-emerald-500/20">
                  Target: {overview.reserveTarget}mo
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-muted-foreground">
                  <span>Current</span>
                  <span>Target</span>
                </div>
                <Progress value={(overview.reserveMonths / overview.reserveTarget) * 100} className="h-2 bg-muted/50" />
              </div>
              <div className="flex gap-2 items-center text-xs text-muted-foreground pt-2 border-t border-border/30">
                <ShieldAlert className="h-3.5 w-3.5 text-primary/60" /> Guardrail active: Reserve protection required before distributions.
              </div>
            </CardContent>
          </Card>
          
          {overview.metrics.slice(0, 2).map((metric, i) => (
            <Card key={i} className="bg-card/30 border-border/50">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="text-sm font-mono tracking-tight uppercase text-muted-foreground mb-4">{metric.label}</div>
                <div className="space-y-2">
                  <div className="text-2xl font-serif text-foreground">{metric.value}</div>
                  {metric.change && (
                    <div className="text-xs font-mono flex items-center gap-1 text-muted-foreground">
                      {metric.trend === 'up' ? <ArrowUpRight className="h-3 w-3 text-emerald-500" /> : 
                       metric.trend === 'down' ? <ArrowDownRight className="h-3 w-3 text-rose-500" /> :
                       <Minus className="h-3 w-3" />}
                      {metric.change}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-6">
            <h2 className="text-xl font-serif text-foreground border-b border-border/50 pb-2">Monthly Actual vs Plan Trend</h2>
            {loadingMonthly ? <Skeleton className="h-64 w-full" /> : monthly ? (
              <Card className="bg-card/20 border-border/40 p-6 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(val) => `$${(val/1000)}k`} />
                    <Tooltip cursor={{ fill: "hsl(var(--muted)/0.2)" }} contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="actual" name="Actual" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="plan" name="Plan" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            ) : null}
          </div>

          <h2 className="text-xl font-serif text-foreground border-b border-border/50 pb-2 pt-4">Upcoming Commitments</h2>
          {loadingCommitments ? <Skeleton className="h-64 w-full" /> : (
            <div className="space-y-3">
              {commitments?.map(comm => (
                <div key={comm.id} className="flex justify-between items-center p-4 rounded-lg bg-card/20 border border-border/40 hover:bg-card/40 transition-colors">
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{comm.label}</div>
                    <div className="text-xs text-muted-foreground font-mono">Due {format(new Date(comm.dueDate), 'MMM d, yyyy')}</div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-mono text-primary">{comm.amount}</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{comm.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-serif text-foreground border-b border-border/50 pb-2">Accounts</h2>
          {loadingOverview ? <Skeleton className="h-48 w-full" /> : (
            <div className="space-y-4">
              {overview?.bankSummaries?.map((bank, i) => (
                <div key={i} className="p-4 rounded-lg bg-card/20 border border-border/40 space-y-2">
                  <div className="flex justify-between items-center text-sm font-mono uppercase tracking-tight text-muted-foreground">
                    <span>{bank.name}</span>
                    <Eye className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-xl font-serif text-foreground">{bank.balance}</div>
                  <div className="text-xs text-muted-foreground">{bank.note}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

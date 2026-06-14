import { useGetRiskItems, useGetRoadmapPhases, useGetPartnerships, useGetMilestones, useGetMonthlyReviews, useGetSourceRecords, useGetGuardrails } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function Risk() {
  const { data: risks, isLoading } = useGetRiskItems();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-serif text-primary">Risk & Platform Strategy</h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm tracking-tight uppercase">Strategic Risk Oversight</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {risks?.map((risk) => (
            <Card key={risk.id} className="bg-card/30 border-border/50 hover:border-primary/40 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{risk.name}</h3>
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-1">{risk.category}</p>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded border ${
                    risk.severity === 'high' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                    risk.severity === 'medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  }`}>
                    {risk.severity} risk
                  </span>
                </div>
                {risk.summary && <p className="text-sm text-foreground/80 leading-relaxed">{risk.summary}</p>}
                
                <div className="flex items-center gap-4 pt-4 border-t border-border/30 text-xs font-mono uppercase tracking-tight">
                  <div className="flex gap-1.5 text-muted-foreground">
                    Status: <span className="text-foreground">{risk.status}</span>
                  </div>
                  {risk.openFindings !== undefined && (
                    <div className="flex gap-1.5 text-muted-foreground">
                      Findings: <span className="text-primary">{risk.openFindings}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

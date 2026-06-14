import { useGetGuardrails } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldAlert, Shield } from "lucide-react";

export default function Guardrails() {
  const { data: guardrails, isLoading } = useGetGuardrails();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-serif text-primary">Authority Guardrails</h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm tracking-tight uppercase">CLP Separation & Founder Protections</p>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 flex gap-4 items-start text-sm text-primary/90">
        <ShieldAlert className="h-6 w-6 shrink-0 mt-0.5 text-primary" />
        <div className="space-y-2">
          <h3 className="font-serif text-lg text-primary leading-none">Standing Operating Policy</h3>
          <p className="leading-relaxed text-foreground/80">
            This cockpit operates on a STRICT recommend-only basis. The CSO has complete visibility but explicitly no unilateral signing authority, transfer authority, or operational expenditure approval. All platform IP belongs to the Company. Guardrails below are hard-coded into operations.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {guardrails?.map((rail) => (
            <Card key={rail.id} className="bg-card/20 border-border/50">
              <CardContent className="p-5 flex gap-4">
                <div className="mt-1">
                  {rail.status === 'enforced' ? (
                    <Shield className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <ShieldAlert className="h-5 w-5 text-amber-500" />
                  )}
                </div>
                <div className="space-y-1 w-full">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-base">{rail.title}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest rounded ${
                      rail.status === 'enforced' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      {rail.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{rail.description}</p>
                  <div className="pt-2 text-[10px] font-mono uppercase tracking-widest text-primary/60">
                    Category: {rail.category}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

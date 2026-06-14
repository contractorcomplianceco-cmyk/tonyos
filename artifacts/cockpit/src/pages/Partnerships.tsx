import { useGetPartnerships } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Partnerships() {
  const { data: partnerships, isLoading } = useGetPartnerships();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-serif text-primary">Strategic Partnerships</h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm tracking-tight uppercase">External Value Creation</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partnerships?.map((partner) => (
            <Card key={partner.id} className="bg-card/30 border-border/50 hover:border-primary/40 transition-colors">
              <CardContent className="p-6 space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium">{partner.name}</h3>
                    {partner.value && <span className="font-mono text-sm text-emerald-500">{partner.value}</span>}
                  </div>
                  {partner.description && <p className="text-sm text-muted-foreground line-clamp-2">{partner.description}</p>}
                </div>
                
                <div className="flex flex-wrap gap-2 pt-4 border-t border-border/30">
                  <span className="px-2 py-0.5 bg-muted text-foreground text-[10px] font-mono uppercase tracking-widest rounded">
                    {partner.type}
                  </span>
                  <span className="px-2 py-0.5 border border-primary/20 text-primary text-[10px] font-mono uppercase tracking-widest rounded">
                    {partner.stage}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

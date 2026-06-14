import { useGetSourceRecords } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ShieldCheck } from "lucide-react";

export default function Sources() {
  const { data: sources, isLoading } = useGetSourceRecords();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-serif text-primary">Company Brain & Source Records</h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm tracking-tight uppercase">Validated Single-Source-of-Truth Repository</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      ) : (
        <div className="rounded-lg border border-border/50 overflow-hidden bg-card/20">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border/50 text-xs font-mono uppercase tracking-widest text-muted-foreground bg-muted/20">
            <div className="col-span-5">Record Title</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Source</div>
            <div className="col-span-3 text-right">Verification</div>
          </div>
          <div className="divide-y divide-border/30">
            {sources?.map((source) => (
              <div key={source.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-card/40 transition-colors">
                <div className="col-span-5 font-medium text-sm text-foreground truncate">{source.title}</div>
                <div className="col-span-2 text-xs font-mono text-muted-foreground uppercase">{source.type}</div>
                <div className="col-span-2 text-xs text-muted-foreground truncate">{source.source}</div>
                <div className="col-span-3 flex justify-end items-center gap-3">
                  <div className="text-[10px] text-muted-foreground font-mono uppercase text-right">
                    {format(new Date(source.lastUpdated), 'MMM d, yyyy')}
                  </div>
                  {source.clpCleared && (
                    <div className="text-emerald-500 flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                      <ShieldCheck className="h-3 w-3" /> CLP Cleared
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

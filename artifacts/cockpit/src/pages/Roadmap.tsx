import { useGetRoadmapPhases } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

export default function Roadmap() {
  const { data: phases, isLoading } = useGetRoadmapPhases();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-serif text-primary">AI / Platform Roadmap</h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm tracking-tight uppercase">Strategic Phasing & Implementation</p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      ) : (
        <div className="relative border-l border-border/50 ml-4 md:ml-6 pl-6 space-y-12 py-4">
          {phases?.map((phase) => (
            <div key={phase.id} className="relative">
              <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-background bg-primary" />
              <Card className="bg-card/30 border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="text-xs font-mono uppercase text-primary mb-1">{phase.phase}</div>
                      <CardTitle className="text-xl">{phase.title}</CardTitle>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-2 py-1 bg-muted rounded">
                      {phase.status.replace('_', ' ')}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {phase.description && <p className="text-sm text-foreground/80">{phase.description}</p>}
                  
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs font-mono text-muted-foreground uppercase">
                      <span>Progress</span>
                      <span>{phase.progress}%</span>
                    </div>
                    <Progress value={phase.progress} className="h-1.5" />
                  </div>
                  
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-border/30 text-xs font-mono uppercase text-muted-foreground">
                    {phase.vendor && <div>Partner: <span className="text-foreground">{phase.vendor}</span></div>}
                    {phase.timeline && <div>Timeline: <span className="text-foreground">{phase.timeline}</span></div>}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

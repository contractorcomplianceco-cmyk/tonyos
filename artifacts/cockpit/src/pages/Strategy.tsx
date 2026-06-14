import { useGetStrategyObjectives } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

export default function Strategy() {
  const { data: objectives, isLoading } = useGetStrategyObjectives();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-serif text-primary">Strategy Overview</h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm tracking-tight uppercase">Company Objectives & Pillars</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {objectives?.map((obj) => (
            <Card key={obj.id} className="bg-card/30 border-border/50 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xs font-mono tracking-wider uppercase text-primary/70">{obj.pillar}</div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase">
                    {obj.status.replace('_', ' ')}
                  </span>
                </div>
                <CardTitle className="text-xl leading-tight">{obj.title}</CardTitle>
                {obj.description && (
                  <CardDescription className="pt-2 text-sm leading-relaxed">{obj.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono text-muted-foreground uppercase">
                    <span>Progress</span>
                    <span>{obj.progress}%</span>
                  </div>
                  <Progress value={obj.progress} className="h-1 bg-muted" />
                </div>
                
                <div className="flex gap-4 pt-4 border-t border-border/30 text-sm">
                  {obj.owner && (
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">Owner</span>
                      <span className="font-medium text-foreground mt-1">{obj.owner}</span>
                    </div>
                  )}
                  {obj.horizon && (
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">Horizon</span>
                      <span className="font-medium text-foreground mt-1">{obj.horizon}</span>
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

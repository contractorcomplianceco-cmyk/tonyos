import { useGetMilestones } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function Milestones() {
  const { data: milestones, isLoading } = useGetMilestones();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-serif text-primary">Founder Involvement & Milestones</h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm tracking-tight uppercase">Timeline of Major Events</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : (
        <div className="relative border-l border-primary/20 ml-4 md:ml-6 pl-6 space-y-8 py-4">
          {milestones?.map((milestone) => (
            <div key={milestone.id} className="relative">
              <div className={`absolute -left-[30px] top-4 h-3 w-3 rounded-full border-2 border-background ${
                milestone.status === 'completed' ? 'bg-emerald-500' :
                milestone.status === 'in_progress' ? 'bg-primary animate-pulse' :
                'bg-muted-foreground'
              }`} />
              <Card className="bg-card/20 border-border/40 hover:bg-card/40 transition-colors">
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex gap-3 items-center text-xs font-mono uppercase tracking-tight text-muted-foreground">
                      <span className="text-primary">{format(new Date(milestone.date), 'MMM d, yyyy')}</span>
                      {milestone.category && <span>&bull; {milestone.category}</span>}
                    </div>
                    <h3 className="text-base font-medium">{milestone.title}</h3>
                    {milestone.description && <p className="text-sm text-foreground/70">{milestone.description}</p>}
                  </div>
                  <span className={`shrink-0 px-2 py-1 text-[10px] font-mono uppercase tracking-wider rounded border ${
                    milestone.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                    milestone.status === 'in_progress' ? 'bg-primary/10 text-primary border-primary/20' :
                    'bg-muted text-muted-foreground border-border'
                  }`}>
                    {milestone.status.replace('_', ' ')}
                  </span>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

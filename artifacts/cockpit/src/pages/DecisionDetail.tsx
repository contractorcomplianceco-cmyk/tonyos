import { useGetDecision, useGetDecisionNotes, useCreateDecisionNote, getGetDecisionNotesQueryKey } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Check, Shield, FileText } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function DecisionDetail() {
  const params = useParams();
  const id = Number(params.id);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: decision, isLoading } = useGetDecision(id);
  const { data: notes, isLoading: loadingNotes } = useGetDecisionNotes(id);
  const createNote = useCreateDecisionNote();
  
  const [noteBody, setNoteBody] = useState("");

  const handleAddNote = () => {
    if (!noteBody.trim()) return;
    
    createNote.mutate(
      { id, data: { body: noteBody } },
      {
        onSuccess: () => {
          setNoteBody("");
          toast({ title: "Note added successfully" });
          queryClient.invalidateQueries({ queryKey: getGetDecisionNotesQueryKey(id) });
        },
        onError: () => {
          toast({ title: "Failed to add note", variant: "destructive" });
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!decision) return <div className="p-8">Not found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href="/decisions" className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-tight text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Queue
      </Link>

      <div className="space-y-4">
        <div className="flex gap-3 items-center">
          <span className={`px-2.5 py-1 text-xs font-mono uppercase tracking-wider rounded border ${
            decision.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
            decision.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
            'bg-muted text-muted-foreground border-border'
          }`}>
            {decision.status}
          </span>
          <span className="text-xs font-mono uppercase text-muted-foreground">Due {format(new Date(decision.dueDate), 'MMM d, yyyy')}</span>
        </div>
        
        <h1 className="text-3xl font-serif text-foreground leading-tight">{decision.title}</h1>
        
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-mono text-muted-foreground uppercase tracking-tight">
          <div className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary/60" /> {decision.category}</div>
          <div className="flex items-center gap-1.5"><FileText className="h-4 w-4 text-primary/60" /> {decision.approvalType.replace(/_/g, ' ')}</div>
          {decision.estimatedImpact && <div>Impact: <span className="text-foreground">{decision.estimatedImpact}</span></div>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        <div className="md:col-span-2 space-y-8">
          {decision.description && (
            <div className="prose prose-invert prose-p:text-muted-foreground max-w-none">
              <h3 className="font-serif text-foreground font-normal text-xl border-b border-border/50 pb-2 mb-4">Context</h3>
              <p>{decision.description}</p>
            </div>
          )}

          {decision.recommendation && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 space-y-3">
              <h3 className="font-mono text-xs uppercase tracking-wider text-primary flex items-center gap-2">
                <Check className="h-4 w-4" /> Rose OS Recommendation
              </h3>
              <p className="text-sm leading-relaxed text-foreground/90">{decision.recommendation}</p>
            </div>
          )}

          <div className="space-y-4 pt-4">
            <h3 className="font-serif text-xl border-b border-border/50 pb-2">Participation & Notes</h3>
            
            <div className="space-y-4">
              {loadingNotes ? <Skeleton className="h-32 w-full" /> : notes?.map(note => (
                <Card key={note.id} className="bg-card/30 border-border/50">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono uppercase tracking-tight">
                      <span className="text-primary">{note.author}</span>
                      <span className="text-muted-foreground">{format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}</span>
                    </div>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap">{note.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-card/40 border border-border/50 p-4 rounded-lg space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Add Note (Not an approval)</label>
                <Textarea 
                  value={noteBody}
                  onChange={e => setNoteBody(e.target.value)}
                  placeholder="Record your thoughts..."
                  className="bg-background/50 border-border/50 focus-visible:ring-primary/50 min-h-[100px]"
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleAddNote}
                  disabled={!noteBody.trim() || createNote.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs uppercase tracking-widest"
                >
                  {createNote.isPending ? "Saving..." : "Record Note"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/20 border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono uppercase tracking-tight text-muted-foreground">Source Records</CardTitle>
            </CardHeader>
            <CardContent>
              {decision.sourceRecord ? (
                <div className="text-sm font-mono text-primary flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {decision.sourceRecord}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic">No linked records</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

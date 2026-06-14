import { useGetDecision, useGetDecisionNotes, useCreateDecisionNote, getGetDecisionNotesQueryKey } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Check, Shield, FileText, CheckCircle2 } from "lucide-react";
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
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!decision) return <div>Not found</div>;

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      <Link href="/decisions" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Queue
      </Link>

      <div className="space-y-4">
        <div className="flex gap-3 items-center">
          <StatusChip status={decision.status} />
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Due {format(new Date(decision.dueDate), 'MMM d, yyyy')}</span>
        </div>
        
        <h1 className="text-3xl font-serif text-foreground font-medium leading-tight">{decision.title}</h1>
        
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
          <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> {decision.category}</div>
          <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> {decision.approvalType.replace(/_/g, ' ')}</div>
          {decision.estimatedImpact && <div>Impact: <span className="text-foreground font-mono">{decision.estimatedImpact}</span></div>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        <div className="md:col-span-2 space-y-8">
          {decision.description && (
            <div className="space-y-3">
              <h3 className="font-serif text-lg font-medium border-b border-border pb-2">Context</h3>
              <p className="text-foreground/80 leading-relaxed text-sm">{decision.description}</p>
            </div>
          )}

          {decision.recommendation && (
            <div className="bg-primary/5 border border-primary/20 rounded-md p-5 space-y-2">
              <h3 className="font-medium text-sm text-primary flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Rose OS Recommendation
              </h3>
              <p className="text-sm leading-relaxed text-foreground/90">{decision.recommendation}</p>
            </div>
          )}

          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="font-serif text-lg font-medium">Participation & Notes</h3>
            <p className="text-xs text-muted-foreground italic mb-4">Adding a note is a participation record. It is NOT an approval.</p>
            
            <div className="space-y-4">
              {loadingNotes ? <Skeleton className="h-32 w-full" /> : notes?.map(note => (
                <div key={note.id} className="bg-secondary/10 border border-border rounded-md p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-foreground">{note.author}</span>
                    <span className="text-muted-foreground">{format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}</span>
                  </div>
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap">{note.body}</p>
                </div>
              ))}
            </div>

            <div className="bg-card shadow-sm border border-border p-4 rounded-md space-y-3 mt-6">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Record a Note</label>
                <Textarea 
                  value={noteBody}
                  onChange={e => setNoteBody(e.target.value)}
                  placeholder="Type your thoughts here..."
                  className="bg-background focus-visible:ring-primary min-h-[100px] text-sm"
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleAddNote}
                  disabled={!noteBody.trim() || createNote.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium h-8"
                >
                  {createNote.isPending ? "Saving..." : "Add Note"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-border rounded-md shadow-sm bg-card overflow-hidden">
            <div className="bg-secondary/30 px-4 py-3 border-b border-border">
              <h3 className="text-xs font-medium text-foreground uppercase tracking-wider">Source Records</h3>
            </div>
            <div className="p-4">
              {decision.sourceRecord ? (
                <Link href="/brain" className="text-sm font-medium text-primary flex items-center gap-2 hover:underline">
                  <FileText className="h-4 w-4" />
                  {decision.sourceRecord}
                </Link>
              ) : (
                <div className="text-sm text-muted-foreground italic">No linked records</div>
              )}
            </div>
          </div>
          
          <div className="bg-secondary/30 rounded-md p-4 border border-border text-xs text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground block mb-1">Guardrail Enforcement:</span>
            Decisions falling under the founder threshold require explicit written authorization via an approved channel. System recommendations are advisory only.
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  let colorClass = "bg-secondary text-secondary-foreground border-border";
  let label = status.replace(/_/g, ' ');

  if (status === 'approved') {
    colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (status === 'pending') {
    colorClass = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (status === 'declined') {
    colorClass = "bg-red-50 text-red-700 border-red-200";
  }

  return (
    <span className={`inline-flex items-center justify-center border font-medium uppercase tracking-wider rounded-sm px-2 py-0.5 text-[10px] ${colorClass}`}>
      {label}
    </span>
  );
}

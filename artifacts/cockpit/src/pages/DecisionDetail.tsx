import { useGetDecision, useGetDecisionNotes, useCreateDecisionNote, useUpdateDecisionNote, useDeleteDecisionNote, getGetDecisionNotesQueryKey } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Shield, FileText, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ErrorState } from "@/components/common/ErrorState";
import { ParticipationNotes } from "@/components/common/ParticipationNotes";

export default function DecisionDetail() {
  const params = useParams();
  const id = Number(params.id);

  const { data: decision, isLoading, isError, refetch } = useGetDecision(id);
  const { data: notes, isLoading: loadingNotes } = useGetDecisionNotes(id);
  const createNote = useCreateDecisionNote();
  const updateNote = useUpdateDecisionNote();
  const deleteNote = useDeleteDecisionNote();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32 rounded border-border" />
        <Skeleton className="h-64 w-full rounded border-border" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-5xl">
        <Link href="/decisions" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-mono text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Queue
        </Link>
        <div className="border border-card-border bg-card rounded shadow-sm mt-6">
          <ErrorState onRetry={() => refetch()} />
        </div>
      </div>
    );
  }

  if (!decision) {
    return (
      <div className="max-w-5xl">
        <Link href="/decisions" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-mono text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Queue
        </Link>
        <div className="border border-card-border bg-card rounded shadow-sm mt-6">
          <ErrorState title="Decision not found" description="This decision may have been removed or the link is invalid." />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-5xl">
      <Link href="/decisions" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest font-mono text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Queue
      </Link>

      <div className="space-y-4">
        <div className="flex gap-4 items-center">
          <StatusBadge status={decision.status} size="md" />
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Due {format(new Date(decision.dueDate), 'MMM d, yyyy')}</span>
        </div>
        
        <h1 className="text-4xl font-sans font-bold text-foreground tracking-tight leading-tight">{decision.title}</h1>
        
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-foreground/80 mt-4">
          <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> {decision.category}</div>
          <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> {decision.approvalType.replace(/_/g, ' ')}</div>
          {decision.estimatedImpact && <div className="flex items-center gap-2">Impact: <span className="font-mono tracking-tight text-foreground">{decision.estimatedImpact}</span></div>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
        <div className="md:col-span-2 space-y-8">
          {decision.description && (
            <div className="space-y-4">
              <h3 className="font-sans font-bold text-lg text-foreground tracking-tight border-b border-border pb-2">Context</h3>
              <p className="text-foreground/80 leading-relaxed text-sm">{decision.description}</p>
            </div>
          )}

          {decision.recommendation && (
            <div className="bg-primary/5 border border-primary/20 rounded p-6 space-y-3">
              <h3 className="font-semibold text-sm text-primary flex items-center gap-2 uppercase tracking-wide">
                <CheckCircle2 className="h-4 w-4" /> Rose OS Recommendation
              </h3>
              <p className="text-sm leading-relaxed text-foreground/90 font-medium">{decision.recommendation}</p>
            </div>
          )}

          <div className="space-y-6 pt-6 border-t border-border">
            <div>
              <h3 className="font-sans font-bold text-lg tracking-tight">Participation & Notes</h3>
            </div>

            <ParticipationNotes
              notes={notes}
              isLoading={loadingNotes}
              isPending={createNote.isPending}
              invalidateKey={getGetDecisionNotesQueryKey(id)}
              isUpdating={updateNote.isPending}
              isDeleting={deleteNote.isPending}
              onSubmit={(body, author, callbacks) =>
                createNote.mutate({ id, data: { body, author } }, callbacks)
              }
              onUpdate={(noteId, body, callbacks) =>
                updateNote.mutate({ id, noteId, data: { body } }, callbacks)
              }
              onDelete={(noteId, callbacks) =>
                deleteNote.mutate({ id, noteId }, callbacks)
              }
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-card-border rounded shadow-sm bg-card overflow-hidden">
            <div className="bg-card px-5 py-4 border-b border-card-border">
              <h3 className="text-[11px] font-bold text-card-foreground uppercase tracking-widest">Source Records</h3>
            </div>
            <div className="p-5">
              {decision.sourceRecord ? (
                <Link href={`/brain?record=${encodeURIComponent(decision.sourceRecord)}`} className="text-sm font-semibold text-primary flex items-center gap-2 hover:underline">
                  <FileText className="h-4 w-4" />
                  {decision.sourceRecord}
                </Link>
              ) : (
                <div className="text-sm text-muted-foreground italic">No linked records</div>
              )}
            </div>
          </div>
          
          <div className="bg-secondary/60 rounded p-5 border border-card-border text-xs text-muted-foreground leading-relaxed shadow-sm">
            <span className="font-semibold text-card-foreground block mb-2 tracking-tight text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> Guardrail Enforcement
            </span>
            Decisions falling under the founder threshold require explicit written authorization via an approved channel. System recommendations are advisory only.
          </div>
        </div>
      </div>
    </div>
  );
}

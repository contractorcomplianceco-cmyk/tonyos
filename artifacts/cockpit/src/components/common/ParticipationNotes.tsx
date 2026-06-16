import { useState } from "react";
import { format } from "date-fns";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type Note = {
  id: number;
  author: string;
  body: string;
  createdAt: string;
};

export function ParticipationNotes({
  notes,
  isLoading,
  isPending,
  onSubmit,
  queryClient: externalQueryClient,
  invalidateKey,
}: {
  notes: Note[] | undefined;
  isLoading: boolean;
  isPending: boolean;
  onSubmit: (body: string, callbacks: { onSuccess: () => void; onError: () => void }) => void;
  queryClient?: ReturnType<typeof useQueryClient>;
  invalidateKey?: QueryKey;
}) {
  const { toast } = useToast();
  const internalQueryClient = useQueryClient();
  const queryClient = externalQueryClient ?? internalQueryClient;
  const [noteBody, setNoteBody] = useState("");

  const handleAddNote = () => {
    const trimmed = noteBody.trim();
    if (!trimmed) return;
    onSubmit(trimmed, {
      onSuccess: () => {
        setNoteBody("");
        toast({ title: "Note added successfully" });
        if (invalidateKey) queryClient.invalidateQueries({ queryKey: invalidateKey });
      },
      onError: () => {
        toast({ title: "Failed to add note", variant: "destructive" });
      },
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-xs text-muted-foreground">Adding a note is a participation record. It is NOT an approval.</p>

      <div className="space-y-4">
        {isLoading ? (
          <Skeleton className="h-32 w-full rounded border-border" />
        ) : notes && notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="bg-card border border-card-border rounded p-5 space-y-3 shadow-sm">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                <span className="font-bold text-card-foreground">{note.author}</span>
                <span className="text-muted-foreground">{format(new Date(note.createdAt), "MMM d, yyyy h:mm a")}</span>
              </div>
              <p className="text-sm text-card-foreground/80 whitespace-pre-wrap">{note.body}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground italic">No participation notes yet.</p>
        )}
      </div>

      <div className="bg-card shadow-sm border border-card-border p-5 rounded space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Record a Note</label>
          <Textarea
            value={noteBody}
            onChange={(e) => setNoteBody(e.target.value)}
            placeholder="Type your thoughts here..."
            className="bg-background focus-visible:ring-primary min-h-[120px] text-sm resize-none rounded-sm border-border"
          />
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleAddNote}
            disabled={!noteBody.trim() || isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-[11px] font-mono uppercase tracking-widest h-9 px-6 rounded-sm"
          >
            {isPending ? "Saving..." : "Add Note"}
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { format } from "date-fns";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useReviewer } from "@/context/Reviewer";

type NoteRevision = {
  body: string;
  replacedAt: string;
};

type Note = {
  id: number;
  author: string;
  body: string;
  createdAt: string;
  updatedAt?: string | null;
  revisions?: NoteRevision[];
};

export function ParticipationNotes({
  notes,
  isLoading,
  isPending,
  onSubmit,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
  queryClient: externalQueryClient,
  invalidateKey,
}: {
  notes: Note[] | undefined;
  isLoading: boolean;
  isPending: boolean;
  onSubmit: (body: string, author: string, callbacks: { onSuccess: () => void; onError: () => void }) => void;
  onUpdate?: (noteId: number, body: string, callbacks: { onSuccess: () => void; onError: () => void }) => void;
  onDelete?: (noteId: number, callbacks: { onSuccess: () => void; onError: () => void }) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
  queryClient?: ReturnType<typeof useQueryClient>;
  invalidateKey?: QueryKey;
}) {
  const { toast } = useToast();
  const { reviewer } = useReviewer();
  const internalQueryClient = useQueryClient();
  const queryClient = externalQueryClient ?? internalQueryClient;
  const [noteBody, setNoteBody] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editBody, setEditBody] = useState("");
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);
  const [expandedHistoryId, setExpandedHistoryId] = useState<number | null>(null);

  const invalidate = () => {
    if (invalidateKey) queryClient.invalidateQueries({ queryKey: invalidateKey });
  };

  const handleAddNote = () => {
    const trimmed = noteBody.trim();
    if (!trimmed) return;
    onSubmit(trimmed, reviewer, {
      onSuccess: () => {
        setNoteBody("");
        toast({ title: "Note added successfully" });
        invalidate();
      },
      onError: () => {
        toast({ title: "Failed to add note", variant: "destructive" });
      },
    });
  };

  const startEdit = (note: Note) => {
    setConfirmingDeleteId(null);
    setEditingId(note.id);
    setEditBody(note.body);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditBody("");
  };

  const handleSaveEdit = (noteId: number) => {
    if (!onUpdate) return;
    const trimmed = editBody.trim();
    if (!trimmed) return;
    onUpdate(noteId, trimmed, {
      onSuccess: () => {
        cancelEdit();
        toast({ title: "Note updated" });
        invalidate();
      },
      onError: () => {
        toast({ title: "Failed to update note", variant: "destructive" });
      },
    });
  };

  const handleDelete = (noteId: number) => {
    if (!onDelete) return;
    onDelete(noteId, {
      onSuccess: () => {
        setConfirmingDeleteId(null);
        toast({ title: "Note removed" });
        invalidate();
      },
      onError: () => {
        toast({ title: "Failed to remove note", variant: "destructive" });
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
                <span className="flex items-center gap-2 text-muted-foreground">
                  {note.updatedAt && (
                    <span
                      className="text-muted-foreground/70"
                      title={`Edited ${format(new Date(note.updatedAt), "MMM d, yyyy h:mm a")}`}
                    >
                      Edited {format(new Date(note.updatedAt), "MMM d, yyyy h:mm a")}
                    </span>
                  )}
                  <span>{format(new Date(note.createdAt), "MMM d, yyyy h:mm a")}</span>
                </span>
              </div>

              {editingId === note.id ? (
                <div className="space-y-3">
                  <Textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    className="bg-background focus-visible:ring-primary min-h-[100px] text-sm resize-none rounded-sm border-border"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={cancelEdit}
                      variant="ghost"
                      className="text-[10px] font-mono uppercase tracking-widest h-8 px-4 rounded-sm text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleSaveEdit(note.id)}
                      disabled={!editBody.trim() || isUpdating}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 text-[10px] font-mono uppercase tracking-widest h-8 px-4 rounded-sm"
                    >
                      {isUpdating ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-card-foreground/80 whitespace-pre-wrap">{note.body}</p>
                  {note.revisions && note.revisions.length > 0 && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedHistoryId((prev) => (prev === note.id ? null : note.id))
                        }
                        className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                      >
                        {expandedHistoryId === note.id
                          ? "Hide history"
                          : `View history (${note.revisions.length})`}
                      </button>
                      {expandedHistoryId === note.id && (
                        <ol className="mt-3 space-y-3 border-l border-border pl-4">
                          {[...note.revisions]
                            .slice()
                            .reverse()
                            .map((rev, idx) => (
                              <li key={`${note.id}-rev-${idx}`} className="space-y-1">
                                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70">
                                  Replaced {format(new Date(rev.replacedAt), "MMM d, yyyy h:mm a")}
                                </div>
                                <p className="text-sm text-muted-foreground line-through whitespace-pre-wrap">
                                  {rev.body}
                                </p>
                              </li>
                            ))}
                        </ol>
                      )}
                    </div>
                  )}
                  {(onUpdate || onDelete) && (
                    <div className="flex justify-end gap-2 pt-1">
                      {confirmingDeleteId === note.id ? (
                        <>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground self-center mr-1">
                            Remove this note?
                          </span>
                          <Button
                            onClick={() => setConfirmingDeleteId(null)}
                            variant="ghost"
                            className="text-[10px] font-mono uppercase tracking-widest h-7 px-3 rounded-sm text-muted-foreground hover:text-foreground"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleDelete(note.id)}
                            disabled={isDeleting}
                            variant="ghost"
                            className="text-[10px] font-mono uppercase tracking-widest h-7 px-3 rounded-sm text-red-600 hover:text-red-700 hover:bg-red-500/10"
                          >
                            {isDeleting ? "Removing..." : "Confirm"}
                          </Button>
                        </>
                      ) : (
                        <>
                          {onUpdate && (
                            <Button
                              onClick={() => startEdit(note)}
                              variant="ghost"
                              className="text-[10px] font-mono uppercase tracking-widest h-7 px-3 rounded-sm text-muted-foreground hover:text-primary"
                            >
                              Edit
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              onClick={() => {
                                cancelEdit();
                                setConfirmingDeleteId(note.id);
                              }}
                              variant="ghost"
                              className="text-[10px] font-mono uppercase tracking-widest h-7 px-3 rounded-sm text-muted-foreground hover:text-red-600"
                            >
                              Delete
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
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

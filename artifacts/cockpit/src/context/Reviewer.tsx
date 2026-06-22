import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetReviewers,
  useCreateReviewer,
  getGetReviewersQueryKey,
} from "@workspace/api-client-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserCircle2, ChevronsUpDown, Check, Plus } from "lucide-react";

const STORAGE_KEY = "tonyos.reviewer";
const DEFAULT_REVIEWER = "Tony Casella";

type Ctx = {
  reviewer: string;
  setReviewer: (name: string) => void;
};

const ReviewerContext = createContext<Ctx | null>(null);

export function ReviewerProvider({ children }: { children: ReactNode }) {
  const [reviewer, setReviewerState] = useState<string>(() => {
    if (typeof window === "undefined") return DEFAULT_REVIEWER;
    const stored = window.localStorage.getItem(STORAGE_KEY)?.trim();
    return stored ? stored : DEFAULT_REVIEWER;
  });

  const setReviewer = (name: string) => {
    const trimmed = name.trim();
    const next = trimmed ? trimmed : DEFAULT_REVIEWER;
    setReviewerState(next);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, reviewer);
  }, [reviewer]);

  return (
    <ReviewerContext.Provider value={{ reviewer, setReviewer }}>
      {children}
    </ReviewerContext.Provider>
  );
}

export function useReviewer(): Ctx {
  const ctx = useContext(ReviewerContext);
  if (!ctx) {
    throw new Error("useReviewer must be used within ReviewerProvider");
  }
  return ctx;
}

export function ReviewerIdentity() {
  const { reviewer, setReviewer } = useReviewer();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const { data: roster, isLoading } = useGetReviewers();
  const createReviewer = useCreateReviewer();

  const names = useMemo(() => {
    const fromRoster = (roster ?? []).map((r) => r.name);
    // Ensure the currently active reviewer is always selectable, even if it
    // predates the roster (e.g. a legacy localStorage value).
    return fromRoster.includes(reviewer) ? fromRoster : [reviewer, ...fromRoster];
  }, [roster, reviewer]);

  useEffect(() => {
    if (!open) {
      setAdding(false);
      setDraft("");
    }
  }, [open]);

  const select = (name: string) => {
    setReviewer(name);
    setOpen(false);
  };

  const saveNew = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    createReviewer.mutate(
      { data: { name: trimmed } },
      {
        onSuccess: (created) => {
          queryClient.invalidateQueries({ queryKey: getGetReviewersQueryKey() });
          setReviewer(created.name);
          setAdding(false);
          setDraft("");
          setOpen(false);
        },
        onError: () => {
          toast({ title: "Failed to add reviewer", variant: "destructive" });
        },
      },
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="group flex items-center gap-2 px-3 py-1.5 rounded-sm bg-primary/10 border border-primary/20 shadow-[0_0_18px_-6px_hsl(var(--primary)/0.7)] transition-colors hover:bg-primary/15"
          aria-label="Select the active reviewer identity"
        >
          <UserCircle2 className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] font-mono tracking-wide text-foreground">
            {reviewer} &bull; Active Reviewer
          </span>
          <ChevronsUpDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 bg-card border-card-border rounded-sm shadow-lg p-0">
        <div className="p-3 space-y-1 border-b border-card-border">
          <div className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
            Active Reviewer
          </div>
          <p className="text-[11px] leading-tight text-muted-foreground">
            Notes you record are attributed to this reviewer across decisions, brands, and projects.
          </p>
        </div>

        {adding ? (
          <div className="p-3 space-y-3">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveNew();
                if (e.key === "Escape") setAdding(false);
              }}
              placeholder="New reviewer name"
              autoFocus
              className="bg-background border-border rounded-sm text-sm h-9 focus-visible:ring-primary"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setAdding(false);
                  setDraft("");
                }}
                className="text-[11px] font-mono uppercase tracking-widest h-8 px-3 rounded-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={saveNew}
                disabled={!draft.trim() || createReviewer.isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-[11px] font-mono uppercase tracking-widest h-8 px-4 rounded-sm"
              >
                {createReviewer.isPending ? "Adding..." : "Add"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="max-h-60 overflow-y-auto py-1">
              {isLoading ? (
                <div className="px-3 py-2 text-[11px] text-muted-foreground">Loading roster...</div>
              ) : (
                names.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => select(name)}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left text-card-foreground hover:bg-primary/10 transition-colors"
                  >
                    <span className="truncate">{name}</span>
                    {name === reviewer && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                  </button>
                ))
              )}
            </div>
            <div className="p-2 border-t border-card-border">
              <Button
                variant="ghost"
                onClick={() => {
                  setDraft("");
                  setAdding(true);
                }}
                className="w-full justify-start gap-2 text-[11px] font-mono uppercase tracking-widest h-8 px-2 rounded-sm text-muted-foreground hover:text-primary"
              >
                <Plus className="h-3.5 w-3.5" /> Add Reviewer
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

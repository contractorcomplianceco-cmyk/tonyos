import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserCircle2, Pencil } from "lucide-react";

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
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(reviewer);

  useEffect(() => {
    if (open) setDraft(reviewer);
  }, [open, reviewer]);

  const save = () => {
    setReviewer(draft);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="group flex items-center gap-2 px-3 py-1.5 rounded-sm bg-primary/10 border border-primary/20 shadow-[0_0_18px_-6px_hsl(var(--primary)/0.7)] transition-colors hover:bg-primary/15"
          aria-label="Set the active reviewer identity"
        >
          <UserCircle2 className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] font-mono tracking-wide text-sidebar-foreground">
            {reviewer} &bull; Active Reviewer
          </span>
          <Pencil className="h-3 w-3 text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70 transition-colors" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 bg-card border-card-border rounded-sm shadow-lg">
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
              Active Reviewer
            </label>
            <p className="text-[11px] leading-tight text-muted-foreground">
              Notes you record are attributed to this name across decisions, brands, and projects.
            </p>
          </div>
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
            }}
            placeholder="Your name"
            className="bg-background border-border rounded-sm text-sm h-9 focus-visible:ring-primary"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-[11px] font-mono uppercase tracking-widest h-8 px-3 rounded-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={save}
              disabled={!draft.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-[11px] font-mono uppercase tracking-widest h-8 px-4 rounded-sm"
            >
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

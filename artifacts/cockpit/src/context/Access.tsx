import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ShieldCheck, ChevronDown, Lock, Users } from "lucide-react";

const STORAGE_KEY = "tonyos.role";

export type AccessRole = "leadership" | "team";
const DEFAULT_ROLE: AccessRole = "leadership";

type Ctx = {
  role: AccessRole;
  isLeadership: boolean;
  setRole: (role: AccessRole) => void;
};

const AccessContext = createContext<Ctx | null>(null);

export function AccessProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<AccessRole>(() => {
    if (typeof window === "undefined") return DEFAULT_ROLE;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "team" || stored === "leadership" ? stored : DEFAULT_ROLE;
  });

  const setRole = (next: AccessRole) => setRoleState(next);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, role);
  }, [role]);

  return (
    <AccessContext.Provider value={{ role, isLeadership: role === "leadership", setRole }}>
      {children}
    </AccessContext.Provider>
  );
}

export function useAccess(): Ctx {
  const ctx = useContext(AccessContext);
  if (!ctx) {
    throw new Error("useAccess must be used within AccessProvider");
  }
  return ctx;
}

const ROLE_META: Record<AccessRole, { label: string; icon: typeof ShieldCheck; hint: string }> = {
  leadership: { label: "Leadership", icon: ShieldCheck, hint: "Founder-level strategic oversight. Sees the private TonyOS executive intelligence screen." },
  team: { label: "Team Member", icon: Users, hint: "Standard access. The private TonyOS executive screen is hidden." },
};

export function AccessRoleControl() {
  const { role, setRole } = useAccess();
  const [open, setOpen] = useState(false);
  const meta = ROLE_META[role];
  const Icon = meta.icon;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="group flex items-center gap-2 px-3 py-1.5 rounded-sm bg-secondary/60 border border-border transition-colors hover:bg-secondary"
          aria-label="Set the active access role"
        >
          <Icon className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] font-mono tracking-wide text-foreground">{meta.label} Access</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 bg-card border-card-border rounded-sm shadow-lg">
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Access Role</label>
            <p className="text-[11px] leading-tight text-muted-foreground">
              TonyOS executive intelligence is restricted to founder-level leadership.
            </p>
          </div>
          <div className="space-y-1.5">
            {(Object.keys(ROLE_META) as AccessRole[]).map((r) => {
              const m = ROLE_META[r];
              const RIcon = m.icon;
              const active = r === role;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    setOpen(false);
                  }}
                  className={`w-full text-left rounded-sm border px-3 py-2 transition-colors ${
                    active ? "border-primary/40 bg-primary/10" : "border-border bg-background hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <RIcon className={`h-3.5 w-3.5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-xs font-semibold tracking-tight ${active ? "text-primary" : "text-card-foreground"}`}>{m.label}</span>
                    {active && <Lock className="h-3 w-3 text-primary ml-auto" />}
                  </div>
                  <p className="text-[10px] leading-tight text-muted-foreground mt-1">{m.hint}</p>
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

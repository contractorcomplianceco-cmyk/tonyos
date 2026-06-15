import { createContext, useContext, useState, type ReactNode } from "react";
import { AUTHORITY_MODES, type AuthorityMode } from "@/lib/authority";

type Ctx = {
  mode: AuthorityMode;
  setMode: (m: AuthorityMode) => void;
  caption: string;
};

const AuthorityModeContext = createContext<Ctx | null>(null);

export function AuthorityModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AuthorityMode>("view");
  const caption = AUTHORITY_MODES.find((m) => m.id === mode)?.caption ?? "";
  return (
    <AuthorityModeContext.Provider value={{ mode, setMode, caption }}>
      {children}
    </AuthorityModeContext.Provider>
  );
}

export function useAuthorityMode(): Ctx {
  const ctx = useContext(AuthorityModeContext);
  if (!ctx) {
    throw new Error("useAuthorityMode must be used within AuthorityModeProvider");
  }
  return ctx;
}

export function AuthorityModeToggle() {
  const { mode, setMode } = useAuthorityMode();
  return (
    <div className="inline-flex items-center rounded-sm border border-sidebar-border bg-sidebar p-0.5">
      {AUTHORITY_MODES.map((m) => {
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-2.5 py-1 rounded-[3px] text-[10px] font-mono uppercase tracking-wider transition-colors ${
              active
                ? "bg-primary/15 text-primary"
                : "text-sidebar-foreground/60 hover:text-sidebar-foreground"
            }`}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}

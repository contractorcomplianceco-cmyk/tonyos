import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Compass,
  GanttChartSquare,
  Wallet,
  ShieldAlert,
  Cpu,
  Handshake,
  Flag,
  CalendarCheck,
  Database,
  Lock,
  Menu,
  X,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  section: string;
  icon: typeof LayoutDashboard;
};

const NAV: NavItem[] = [
  { href: "/", label: "Executive Home", section: "01", icon: LayoutDashboard },
  { href: "/strategy", label: "Company Strategy", section: "02", icon: Compass },
  { href: "/decisions", label: "Major Decision Queue", section: "03", icon: GanttChartSquare },
  { href: "/financial", label: "Financial Visibility", section: "04", icon: Wallet },
  { href: "/risk", label: "Risk & Platform Strategy", section: "05", icon: ShieldAlert },
  { href: "/roadmap", label: "AI / Platform Roadmap", section: "06", icon: Cpu },
  { href: "/partnerships", label: "Strategic Partnerships", section: "07", icon: Handshake },
  { href: "/milestones", label: "Founder Milestones", section: "08", icon: Flag },
  { href: "/reviews", label: "Monthly Founder Review", section: "09", icon: CalendarCheck },
  { href: "/sources", label: "Company Brain Records", section: "10", icon: Database },
  { href: "/guardrails", label: "Authority Guardrails", section: "11", icon: Lock },
];

function isActive(current: string, href: string): boolean {
  if (href === "/") return current === "/";
  return current === href || current.startsWith(href + "/");
}

export function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-72 flex-col border-r border-sidebar-border bg-sidebar">
        <SidebarContent location={location} />
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-50 w-72 flex flex-col border-r border-sidebar-border bg-sidebar animate-in slide-in-from-left duration-200">
            <SidebarContent
              location={location}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="lg:pl-72">
        <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/90 backdrop-blur px-4 py-3">
          <div>
            <div className="font-serif text-lg text-primary leading-none">Rose OS</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
              Command Center
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  location,
  onNavigate,
}: {
  location: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between px-6 py-6 border-b border-sidebar-border">
        <div>
          <div className="font-serif text-xl text-primary leading-none">Rose OS</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1.5">
            Command Center
          </div>
        </div>
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV.map((item) => {
          const active = isActive(location, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60"
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-md border transition-colors ${
                  active
                    ? "border-primary/40 bg-primary/15 text-primary"
                    : "border-sidebar-border text-muted-foreground group-hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="flex-1 leading-tight">{item.label}</span>
              <span className="font-mono text-[10px] text-muted-foreground/60">
                {item.section}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-6 py-5 space-y-3">
        <div className="flex items-start gap-2">
          <Lock className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Recommend-only. Nothing is approved, committed, or signed until human
            written approval.
          </p>
        </div>
        <div className="pt-3 border-t border-sidebar-border/60">
          <div className="text-sm font-medium text-foreground leading-tight">
            Tony Casella
          </div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
            Chief Strategy Officer
          </div>
        </div>
      </div>
    </>
  );
}

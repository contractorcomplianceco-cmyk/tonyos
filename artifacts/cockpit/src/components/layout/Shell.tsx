import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Activity,
  Wallet,
  GanttChartSquare,
  ShieldAlert,
  Database,
  Menu,
  X,
  Lock,
  ExternalLink
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: any;
};

const NAV: NavItem[] = [
  { href: "/", label: "Executive Home", icon: LayoutDashboard },
  { href: "/pulse", label: "Strategic Pulse", icon: Activity },
  { href: "/financial", label: "Financial Review", icon: Wallet },
  { href: "/decisions", label: "Major Decisions", icon: GanttChartSquare },
  { href: "/risk", label: "Risk Platform", icon: ShieldAlert },
  { href: "/brain", label: "Company Brain", icon: Database },
];

function isActive(current: string, href: string): boolean {
  if (href === "/") return current === "/";
  return current === href || current.startsWith(href + "/");
}

export function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Top Bar for Mobile */}
      <header className="md:hidden sticky top-0 z-20 flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-3 text-sidebar-foreground">
        <div>
          <div className="font-serif text-lg font-semibold tracking-tight text-sidebar-primary">TonyOS</div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-sidebar-foreground/70 mt-0.5">
            Command Center
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-md border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-30 w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <SidebarContent location={location} />
      </aside>

      {/* Sidebar Mobile */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-50 w-64 flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground animate-in slide-in-from-left duration-200">
            <SidebarContent
              location={location}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Breadcrumb Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-border bg-card">
          <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            Rose OS <span className="text-border">/</span> <span className="text-foreground">TonyOS Command Center</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-xs font-medium">Tony Casella - Founder-Level Strategic Oversight</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
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
      <div className="flex items-center justify-between px-6 py-6">
        <div>
          <div className="font-serif text-2xl font-bold tracking-tight text-sidebar-primary">TonyOS</div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-sidebar-foreground/60 mt-1">
            Command Center
          </div>
        </div>
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="p-1.5 rounded-md text-sidebar-foreground/70 hover:text-sidebar-foreground"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {NAV.map((item) => {
          const active = isActive(location, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-primary-foreground" : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground"}`} />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4 pb-6 space-y-6">
        <div className="bg-sidebar-accent/50 rounded-md p-3 border border-sidebar-border space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-sidebar-foreground">
            <Lock className="h-3 w-3 text-sidebar-foreground/70" /> Source Record Integrity
          </div>
          <p className="text-[11px] leading-tight text-sidebar-foreground/70">
            All critical systems connected, cleared source records only.
          </p>
          <Link href="/brain" className="text-[11px] text-primary hover:underline flex items-center gap-1">
            View Source Record Status <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="px-2 pt-4 border-t border-sidebar-border">
          <div className="font-serif text-sm font-medium text-sidebar-foreground leading-none">
            Rose OS
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-sidebar-foreground/50 mt-1">
            Operating System
          </div>
        </div>
      </div>
    </>
  );
}

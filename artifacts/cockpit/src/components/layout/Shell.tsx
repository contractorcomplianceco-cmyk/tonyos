import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";

import {
  LayoutDashboard,
  Map,
  Compass,
  Radar as RadarIcon,
  Wallet,
  Target,
  Waves,
  Database,
  Menu,
  X,
  Lock,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import crest from "@assets/cca-crest-inset_1781490765434.png";
import { ReviewerIdentity } from "@/context/Reviewer";
import { useAccess, AccessRoleControl } from "@/context/Access";
import { RoseReviewModeBanner } from "@/components/RoseReviewModeBanner";

type NavItem = {
  href: string;
  label: string;
  icon: any;
  leadershipOnly?: boolean;
};

const NAV: NavItem[] = [
  { href: "/", label: "TonyOS Home", icon: LayoutDashboard },
  { href: "/tonyos", label: "Command Center", icon: ShieldCheck, leadershipOnly: true },
  { href: "/brands", label: "Expansion Map", icon: Map },
  { href: "/operating", label: "Strategic Compass", icon: Compass },
  { href: "/predictors", label: "Forward Signals", icon: RadarIcon },
  { href: "/decisions", label: "Game Plan", icon: Target },
  { href: "/financial", label: "Founder Financials", icon: Wallet },
  { href: "/risk", label: "Risk Tide", icon: Waves },
  { href: "/brain", label: "Company Intelligence", icon: Database },
];

function isActive(current: string, href: string): boolean {
  if (href === "/") return current === "/";
  return current === href || current.startsWith(href + "/");
}

export function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLeadership } = useAccess();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <RoseReviewModeBanner />
      {/* Top Bar for Mobile */}
      <header className="md:hidden sticky top-0 z-20 flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-3 text-sidebar-foreground shadow-sm">
        <div className="flex items-center gap-2">
          <img src={crest} alt="CCA crest" className="h-7 w-auto object-contain shrink-0" />
          <div>
            <div className="font-sans text-sm font-semibold tracking-tight text-primary">TonyOS</div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-sidebar-foreground/70 mt-0.5">
              Command Center
            </div>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>
      </header>

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-30 w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <SidebarContent location={location} isLeadership={isLeadership} />
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
              isLeadership={isLeadership}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Breadcrumb Bar */}
        <header className="hidden md:flex sticky top-0 z-20 items-center justify-between px-8 py-3 border-b border-border bg-card/80 backdrop-blur-md">
          <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
            Rose OS <span className="text-border">/</span> <span className="text-muted-foreground">Compliance Authority Group</span> <span className="text-border">/</span> <span className="text-foreground font-semibold">TonyOS Command Center</span>
          </div>
          <div className="flex items-center gap-2">
            <AccessRoleControl />
            <ReviewerIdentity />
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
  isLeadership,
  onNavigate,
}: {
  location: string;
  isLeadership: boolean;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <img src={crest} alt="CCA crest" className="h-11 w-auto object-contain shrink-0 drop-shadow-[0_0_14px_hsl(var(--primary)/0.35)]" />
          <div>
            <div className="font-sans text-xl font-bold tracking-tight text-primary">TonyOS</div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-sidebar-foreground/60 mt-1">
              Command Center
            </div>
          </div>
        </div>
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="p-1.5 rounded text-sidebar-foreground/70 hover:text-sidebar-foreground"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="px-6 mb-4">
        <div className="h-px bg-sidebar-border/80 w-full" />
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {NAV.filter((item) => !item.leadershipOnly || isLeadership).map((item) => {
          const active = isActive(location, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`group relative flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-all ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              {active && <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r-sm" />}
              <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground"}`} />
              <span className="flex-1 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4 pb-6 space-y-6">
        <div className="bg-sidebar-accent/30 rounded p-3 border border-sidebar-border space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-sidebar-foreground">
            <Lock className="h-3 w-3 text-sidebar-foreground/70" /> Source Record Integrity
          </div>
          <p className="text-[11px] leading-tight text-sidebar-foreground/60">
            All critical systems connected, cleared source records only.
          </p>
          <Link href="/brain" className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium mt-1">
            View Source Record Status <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="px-2 pt-4 border-t border-sidebar-border">
          <div className="font-sans text-sm font-semibold text-sidebar-foreground tracking-tight leading-none">
            Rose OS
          </div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-sidebar-foreground/50 mt-1.5">
            Operating System
          </div>
        </div>
      </div>
    </>
  );
}

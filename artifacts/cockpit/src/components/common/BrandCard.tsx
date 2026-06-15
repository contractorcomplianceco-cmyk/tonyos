import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import type { Brand } from "@workspace/api-client-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AuthorityBadge } from "@/components/common/AuthorityBadge";
import { HealthBar } from "@/components/common/HealthBar";

function stageTone(stage: string) {
  const s = stage.toLowerCase();
  if (s === "active") return "green" as const;
  if (s === "build concept") return "blue" as const;
  if (s === "planned") return "amber" as const;
  return "neutral" as const;
}

function riskTone(risk: string) {
  const r = risk.toLowerCase();
  if (r === "high") return "red" as const;
  if (r === "medium") return "amber" as const;
  return "green" as const;
}

export function BrandCard({ brand }: { brand: Brand }) {
  const active = brand.stage.toLowerCase() === "active";
  return (
    <Link href={`/brands/${brand.code}`} className="block group">
      <div
        className={`relative h-full rounded-md border bg-card p-5 shadow-sm overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
          active ? "border-primary/40 hover:border-primary/60" : "border-card-border hover:border-primary/40"
        }`}
      >
        <div className={`absolute top-0 left-0 right-0 h-1 ${active ? "bg-primary" : "bg-card-border"}`} />
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-bold tracking-tight text-card-foreground">{brand.name}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{brand.fullName}</div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          <StatusBadge tone={stageTone(brand.stage)} label={brand.stage} />
          <StatusBadge tone={riskTone(brand.risk)} label={`${brand.risk} Risk`} />
        </div>

        {brand.summary && (
          <p className="text-xs text-card-foreground/70 leading-relaxed mt-3 line-clamp-3">{brand.summary}</p>
        )}

        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            <span>Brand Health</span>
          </div>
          <HealthBar value={brand.health} />
        </div>

        {brand.authorityLabel && (
          <div className="mt-4 pt-3 border-t border-card-border">
            <AuthorityBadge label={brand.authorityLabel} />
          </div>
        )}
      </div>
    </Link>
  );
}

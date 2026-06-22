import { Link } from "wouter";
import type { Brand } from "@workspace/api-client-react";
import { StatusBadge } from "@/components/common/StatusBadge";

function stageTone(stage: string) {
  const s = stage.toLowerCase();
  if (s === "active") return "green" as const;
  if (s === "build concept") return "blue" as const;
  if (s === "planned") return "amber" as const;
  return "neutral" as const;
}

function riskClass(risk: string) {
  const r = risk.toLowerCase();
  if (r === "high") return "text-red-600 font-semibold";
  if (r === "medium" || r === "moderate" || r === "elevated") return "text-amber-700 font-semibold";
  return "text-emerald-700 font-semibold";
}

export function OrgTree({ brands }: { brands: Brand[] }) {
  const parent = brands.find((b) => b.kind === "parent");
  const children = brands.filter((b) => b.kind !== "parent");

  return (
    <div className="flex flex-col items-center">
      {parent && (
        <Link href={`/brands/${parent.code}`} className="block group w-full max-w-xs">
          <div className="rounded-md border border-primary/50 bg-primary/5 px-5 py-4 text-center shadow-sm group-hover:border-primary transition-colors">
            <div className="text-base font-bold tracking-tight text-card-foreground">{parent.name}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{parent.fullName}</div>
            <div className="mt-2 flex justify-center">
              <StatusBadge tone="green" label={`Health ${parent.health}`} />
            </div>
          </div>
        </Link>
      )}

      {children.length > 0 && (
        <>
          <div className="h-6 w-px bg-card-border" />
          <div className="h-px w-full max-w-3xl bg-card-border" />
          <div className="flex w-full max-w-3xl justify-between px-[12.5%]">
            <div className="h-6 w-px bg-card-border" />
            <div className="h-6 w-px bg-card-border" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
            {children.map((b) => {
              const active = b.stage.toLowerCase() === "active";
              return (
                <Link key={b.code} href={`/brands/${b.code}`} className="block group">
                  <div
                    className={`h-full rounded border px-3 py-3 text-center transition-colors ${
                      active
                        ? "border-primary/40 bg-primary/5 group-hover:border-primary/70"
                        : "border-card-border bg-card group-hover:border-primary/40"
                    }`}
                  >
                    <div className="text-sm font-bold tracking-tight text-card-foreground">{b.name}</div>
                    <div className="text-[9px] text-muted-foreground mt-0.5 leading-tight line-clamp-2">{b.fullName}</div>
                    <div className="mt-2 flex justify-center">
                      <StatusBadge tone={stageTone(b.stage)} label={b.stage} />
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-3 text-[9px] font-mono uppercase tracking-widest">
                      <span className="text-muted-foreground">
                        Health <span className="tabular-nums font-semibold text-card-foreground">{b.health}</span>
                      </span>
                      <span className="text-card-border">|</span>
                      <span className={riskClass(b.risk)}>Risk {b.risk}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

import type { Department } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AuthorityBadge } from "@/components/common/AuthorityBadge";
import { HealthBar } from "@/components/common/HealthBar";

export function DepartmentTable({ departments }: { departments: Department[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-card-border text-left">
            <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">Department</th>
            <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">Status</th>
            <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold w-44">Health</th>
            <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold text-center">Blockers</th>
            <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">Next Action</th>
            <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">Authority</th>
            <th className="px-4 py-3 w-8" />
          </tr>
        </thead>
        <tbody>
          {departments.map((d) => (
            <tr key={d.id} className="border-b border-card-border/60 last:border-0 group hover:bg-secondary/40 transition-colors align-top">
              <td className="px-4 py-3">
                <Link href={`/departments/${d.id}`} className="block">
                  <div className="font-semibold text-card-foreground tracking-tight group-hover:text-primary transition-colors">{d.name}</div>
                  {d.owner && <div className="text-[10px] text-muted-foreground mt-0.5">{d.owner}</div>}
                </Link>
              </td>
              <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
              <td className="px-4 py-3"><HealthBar value={d.health} /></td>
              <td className="px-4 py-3 text-center">
                <span className={`font-mono tabular-nums text-sm ${d.blockers > 0 ? "text-red-300" : "text-card-foreground/50"}`}>
                  {d.blockers}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-card-foreground/70 max-w-[220px]">{d.nextAction ?? "—"}</td>
              <td className="px-4 py-3"><AuthorityBadge label={d.authorityLabel} /></td>
              <td className="px-4 py-3">
                <Link href={`/departments/${d.id}`} className="block">
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

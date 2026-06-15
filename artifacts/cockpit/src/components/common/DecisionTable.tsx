import type { Decision } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AuthorityBadge } from "@/components/common/AuthorityBadge";

function fmtDue(due: string) {
  const d = new Date(due);
  return isNaN(d.getTime()) ? due : format(d, "MMM d, yyyy");
}

export function DecisionTable({ decisions }: { decisions: Decision[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-card-border text-left">
            <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">Decision</th>
            <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">Impact</th>
            <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">Required Authority</th>
            <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">Status</th>
            <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">Due</th>
            <th className="px-4 py-3 w-8" />
          </tr>
        </thead>
        <tbody>
          {decisions.map((d) => (
            <tr key={d.id} className="border-b border-card-border/60 last:border-0 group hover:bg-secondary/40 transition-colors align-middle">
              <td className="px-4 py-3">
                <Link href={`/decisions/${d.id}`} className="block">
                  <div className="flex items-center gap-2 mb-1">
                    {d.brandCode && <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground border border-card-border rounded-[2px] px-1.5 py-0.5">{d.brandCode}</span>}
                    <span className="text-[10px] text-primary font-mono uppercase tracking-widest">{d.category}</span>
                  </div>
                  <div className="font-semibold text-card-foreground tracking-tight group-hover:text-primary transition-colors">{d.title}</div>
                </Link>
              </td>
              <td className="px-4 py-3 font-mono tabular-nums text-card-foreground/90 whitespace-nowrap">{d.estimatedImpact ?? "—"}</td>
              <td className="px-4 py-3"><AuthorityBadge label={d.authorityLabel} /></td>
              <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
              <td className="px-4 py-3 text-[11px] font-mono uppercase tracking-widest text-muted-foreground whitespace-nowrap">{fmtDue(d.dueDate)}</td>
              <td className="px-4 py-3">
                <Link href={`/decisions/${d.id}`} className="block">
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

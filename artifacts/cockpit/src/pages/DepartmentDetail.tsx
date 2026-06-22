import { useParams, Link } from "wouter";
import { useGetDepartments, useGetProjects } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Layers, GanttChartSquare, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Panel } from "@/components/common/Panel";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AuthorityBadge } from "@/components/common/AuthorityBadge";
import { HealthBar } from "@/components/common/HealthBar";
import { GuardrailNote } from "@/components/common/GuardrailNote";

export default function DepartmentDetail() {
  const params = useParams();
  const id = Number(params.id);
  const { data: departments, isLoading, isError, refetch } = useGetDepartments();
  const dept = (departments ?? []).find((d) => d.id === id);
  const { data: projects } = useGetProjects(dept ? { brand: dept.brandCode } : undefined);

  const deptProjects = (projects ?? []).filter((p) => p.department === dept?.name);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !dept) {
    return (
      <div className="space-y-6">
        <Link href="/operating" className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-primary hover:underline">
          <ArrowLeft className="h-3 w-3" /> Operating Pulse
        </Link>
        <div className="border border-card-border bg-card rounded shadow-sm">
          <ErrorState title="Department not found" description="This department could not be loaded." onRetry={() => refetch()} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <Link href={dept.brandCode === "CCA" ? "/operating" : `/brands/${dept.brandCode}`} className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-primary hover:underline">
        <ArrowLeft className="h-3 w-3" /> {dept.brandCode === "CCA" ? "Operating Pulse" : `${dept.brandCode} Brand`}
      </Link>

      <PageHeader
        title={dept.name}
        subtitle={`${dept.brandCode} department${dept.owner ? ` — ${dept.owner}` : ""}`}
        actions={<AuthorityBadge label={dept.authorityLabel} size="md" />}
      />

      <GuardrailNote text="Department drill-down is visibility only. Next actions and project recommendations require written founder approval before any commitment." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel icon={Layers} title="Department Status" className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <StatusBadge status={dept.status} size="md" />
            <span className={`text-sm font-mono tabular-nums ${dept.blockers > 0 ? "text-red-600" : "text-card-foreground/60"}`}>
              {dept.blockers} open blocker{dept.blockers === 1 ? "" : "s"}
            </span>
          </div>
          {dept.summary && <p className="text-sm text-card-foreground/80 leading-relaxed">{dept.summary}</p>}
          {dept.nextAction && (
            <div className="mt-4 border-t border-card-border pt-4">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Next Action</div>
              <div className="text-sm text-card-foreground">{dept.nextAction}</div>
            </div>
          )}
        </Panel>
        <Panel title="Health">
          <div className="space-y-3">
            <div className="text-4xl font-bold text-card-foreground tabular-nums tracking-tight">{dept.health}<span className="text-base text-muted-foreground">/100</span></div>
            <HealthBar value={dept.health} showValue={false} />
          </div>
        </Panel>
      </div>

      <Panel icon={GanttChartSquare} title="Department Projects" bodyClassName="p-0">
        {deptProjects.length > 0 ? (
          <div className="divide-y divide-card-border">
            {deptProjects.map((p) => (
              <Link key={p.id} href={`/projects/${p.id}`} className="block group">
                <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-3 hover:bg-secondary/40 transition-colors">
                  <div className="min-w-0">
                    <div className="font-semibold text-card-foreground tracking-tight group-hover:text-primary transition-colors">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{p.owner ? p.owner : ""}{p.dueDate ? `${p.owner ? " • " : ""}Due ${p.dueDate}` : ""}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={p.status} />
                    <AuthorityBadge label={p.authorityLabel} />
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-6"><EmptyState icon={GanttChartSquare} title="No projects" description="This department has no tracked projects yet." /></div>
        )}
      </Panel>
    </div>
  );
}

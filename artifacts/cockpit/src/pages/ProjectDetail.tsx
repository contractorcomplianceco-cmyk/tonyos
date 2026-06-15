import { useParams, Link } from "wouter";
import { useGetProject, useGetDecisions } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, GanttChartSquare, FileText, Gavel, ChevronRight, Database } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Panel } from "@/components/common/Panel";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AuthorityBadge } from "@/components/common/AuthorityBadge";
import { HealthBar } from "@/components/common/HealthBar";
import { GuardrailNote } from "@/components/common/GuardrailNote";

export default function ProjectDetail() {
  const params = useParams();
  const id = Number(params.id);
  const { data: project, isLoading, isError, refetch } = useGetProject(id);
  const { data: decisions } = useGetDecisions();

  const related = (decisions ?? []).filter(
    (d) =>
      project &&
      (d.brandCode === project.brandCode &&
        (d.sourceRecord && project.sourceRecord
          ? d.sourceRecord === project.sourceRecord
          : true)),
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="space-y-6">
        <Link href="/operating" className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-primary hover:underline">
          <ArrowLeft className="h-3 w-3" /> Operating Pulse
        </Link>
        <div className="border border-card-border bg-card rounded shadow-sm">
          <ErrorState title="Project not found" description="This project could not be loaded." onRetry={() => refetch()} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <Link href="/operating" className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-primary hover:underline">
        <ArrowLeft className="h-3 w-3" /> Operating Pulse
      </Link>

      <PageHeader
        title={project.name}
        subtitle={`${project.brandCode}${project.department ? ` — ${project.department}` : ""}${project.owner ? ` • ${project.owner}` : ""}`}
        actions={<AuthorityBadge label={project.authorityLabel} size="md" />}
      />

      <GuardrailNote text="Project drill-down is visibility only. Linked decisions surface where founder authority is required — none are approved here." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel icon={GanttChartSquare} title="Project Status" className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <StatusBadge status={project.status} size="md" />
            {project.dueDate && <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">Due {project.dueDate}</span>}
          </div>
          {project.summary && <p className="text-sm text-card-foreground/80 leading-relaxed">{project.summary}</p>}
        </Panel>
        <Panel title="Health">
          <div className="space-y-3">
            <div className="text-4xl font-bold text-card-foreground tabular-nums tracking-tight">{project.health}<span className="text-base text-muted-foreground">/100</span></div>
            <HealthBar value={project.health} showValue={false} />
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel icon={Gavel} title="Linked Major Decisions" className="lg:col-span-2" bodyClassName="p-0">
          {related.length > 0 ? (
            <div className="divide-y divide-card-border">
              {related.map((d) => (
                <Link key={d.id} href={`/decisions/${d.id}`} className="block group">
                  <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-3 hover:bg-secondary/40 transition-colors">
                    <div className="min-w-0">
                      <div className="font-semibold text-card-foreground tracking-tight group-hover:text-primary transition-colors">{d.title}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{d.estimatedImpact ? `Impact ${d.estimatedImpact}` : ""}{d.dueDate ? `${d.estimatedImpact ? " • " : ""}Due ${d.dueDate}` : ""}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={d.status} />
                      <AuthorityBadge label={d.authorityLabel} />
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6"><EmptyState icon={Gavel} title="No linked decisions" description="No major decisions are currently linked to this project." /></div>
          )}
        </Panel>

        <Panel icon={Database} title="Source Record">
          {project.sourceRecord ? (
            <Link href={`/brain?record=${encodeURIComponent(project.sourceRecord)}`} className="text-sm font-semibold text-primary flex items-center gap-2 hover:underline">
              <FileText className="h-4 w-4 shrink-0" />
              {project.sourceRecord}
            </Link>
          ) : (
            <div className="text-sm text-muted-foreground italic">No linked source record</div>
          )}
        </Panel>
      </div>
    </div>
  );
}

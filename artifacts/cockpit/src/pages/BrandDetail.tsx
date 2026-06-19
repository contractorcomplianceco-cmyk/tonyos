import { useParams, Link } from "wouter";
import {
  useGetBrand,
  useGetDepartments,
  useGetProjects,
  useGetPredictors,
  useGetBrandNotes,
  useCreateBrandNote,
  useUpdateBrandNote,
  useDeleteBrandNote,
  getGetBrandNotesQueryKey,
} from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Building2, GanttChartSquare, RadarIcon, Layers, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Panel } from "@/components/common/Panel";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AuthorityBadge } from "@/components/common/AuthorityBadge";
import { HealthBar } from "@/components/common/HealthBar";
import { DepartmentTable } from "@/components/common/DepartmentTable";
import { PredictorCard } from "@/components/common/PredictorCard";
import { GuardrailNote } from "@/components/common/GuardrailNote";
import { ParticipationNotes } from "@/components/common/ParticipationNotes";

function riskTone(risk: string) {
  const r = risk.toLowerCase();
  if (r === "high") return "red" as const;
  if (r === "medium") return "amber" as const;
  return "green" as const;
}

export default function BrandDetail() {
  const params = useParams();
  const code = params.code ?? "";
  const { data: brand, isLoading, isError, refetch } = useGetBrand(code);
  const { data: departments } = useGetDepartments({ brand: code });
  const { data: projects } = useGetProjects({ brand: code });
  const { data: predictors } = useGetPredictors();
  const { data: notes, isLoading: loadingNotes } = useGetBrandNotes(code);
  const createNote = useCreateBrandNote();
  const updateNote = useUpdateBrandNote();
  const deleteNote = useDeleteBrandNote();

  const brandPredictors = (predictors ?? []).filter((p) => p.brandCode === code);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !brand) {
    return (
      <div className="space-y-6">
        <Link href="/brands" className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-primary hover:underline">
          <ArrowLeft className="h-3 w-3" /> Brand Portfolio
        </Link>
        <div className="border border-card-border bg-card rounded shadow-sm">
          <ErrorState title="Brand not found" description="This brand could not be loaded." onRetry={() => refetch()} />
        </div>
      </div>
    );
  }

  const active = brand.stage.toLowerCase() === "active";

  return (
    <div className="space-y-8 pb-12">
      <Link href="/brands" className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-primary hover:underline">
        <ArrowLeft className="h-3 w-3" /> Brand Portfolio
      </Link>

      <PageHeader
        title={brand.name}
        subtitle={brand.fullName}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge tone={active ? "green" : "neutral"} label={brand.stage} size="md" />
            <StatusBadge tone={riskTone(brand.risk)} label={`${brand.risk} Risk`} size="md" />
          </div>
        }
      />

      <GuardrailNote text="Brand drill-down is visibility only. Department health, projects, and signals are recommendations — no action is committed without written founder approval." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel icon={Building2} title="Brand Profile" className="lg:col-span-2">
          {brand.summary && <p className="text-sm text-card-foreground/80 leading-relaxed">{brand.summary}</p>}
          {brand.authorityLabel && (
            <div className="mt-4">
              <AuthorityBadge label={brand.authorityLabel} size="md" />
            </div>
          )}
        </Panel>
        <Panel title="Brand Health">
          <div className="space-y-3">
            <div className="text-4xl font-bold text-card-foreground tabular-nums tracking-tight">{brand.health}<span className="text-base text-muted-foreground">/100</span></div>
            <HealthBar value={brand.health} showValue={false} />
            {brand.tagline && <p className="text-xs text-muted-foreground">{brand.tagline}</p>}
          </div>
        </Panel>
      </div>

      {active && (
        <Panel icon={Layers} title="Department Health" bodyClassName="p-0">
          {departments && departments.length > 0 ? (
            <DepartmentTable departments={departments} />
          ) : (
            <div className="p-6"><EmptyState icon={Layers} title="No departments" description="This brand has no operating departments yet." /></div>
          )}
        </Panel>
      )}

      <Panel icon={GanttChartSquare} title="Projects" bodyClassName="p-0">
        {projects && projects.length > 0 ? (
          <div className="divide-y divide-card-border">
            {projects.map((p) => (
              <div key={p.id} className="px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-card-foreground tracking-tight">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{p.department ?? "—"}{p.owner ? ` • ${p.owner}` : ""}{p.dueDate ? ` • Due ${p.dueDate}` : ""}</div>
                  {p.summary && <p className="text-xs text-card-foreground/70 mt-1.5 max-w-2xl">{p.summary}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={p.status} />
                  <AuthorityBadge label={p.authorityLabel} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6"><EmptyState icon={GanttChartSquare} title="No projects" description="This brand has no tracked projects yet." /></div>
        )}
      </Panel>

      {brandPredictors.length > 0 && (
        <Panel icon={RadarIcon} title="Brand Predictive Signals">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {brandPredictors.map((p) => <PredictorCard key={p.id} predictor={p} />)}
          </div>
        </Panel>
      )}

      <Panel icon={MessageSquare} title="Participation & Notes">
        <ParticipationNotes
          notes={notes}
          isLoading={loadingNotes}
          isPending={createNote.isPending}
          invalidateKey={getGetBrandNotesQueryKey(code)}
          isUpdating={updateNote.isPending}
          isDeleting={deleteNote.isPending}
          onSubmit={(body, author, callbacks) =>
            createNote.mutate({ code, data: { body, author } }, callbacks)
          }
          onUpdate={(noteId, body, callbacks) =>
            updateNote.mutate({ code, noteId, data: { body } }, callbacks)
          }
          onDelete={(noteId, callbacks) =>
            deleteNote.mutate({ code, noteId }, callbacks)
          }
        />
      </Panel>
    </div>
  );
}

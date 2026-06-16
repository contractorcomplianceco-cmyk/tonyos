import {
  useGetDepartments,
  useGetProjects,
  useGetProjectNotes,
  useCreateProjectNote,
  useUpdateProjectNote,
  useDeleteProjectNote,
  getGetProjectNotesQueryKey,
  type Project,
} from "@workspace/api-client-react";
import { Link } from "wouter";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Layers, GanttChartSquare, Activity, ChevronRight, MessageSquare, ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Panel } from "@/components/common/Panel";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AuthorityBadge } from "@/components/common/AuthorityBadge";
import { DepartmentTable } from "@/components/common/DepartmentTable";
import { GuardrailNote } from "@/components/common/GuardrailNote";
import { ParticipationNotes } from "@/components/common/ParticipationNotes";
import { healthTone, matchesMode } from "@/lib/authority";
import { useAuthorityMode, AuthorityModeToggle } from "@/context/AuthorityMode";

const CCA = "CCA";

export default function Operating() {
  const { mode, caption } = useAuthorityMode();
  const { data: departments, isLoading: loadingDept, isError: deptError, refetch: refetchDept } = useGetDepartments({ brand: CCA });
  const { data: projects, isLoading: loadingProj, isError: projError, refetch: refetchProj } = useGetProjects({ brand: CCA });

  const filteredProjects = (projects ?? []).filter((p) => matchesMode(mode, p.authorityLabel));

  const avgHealth = departments && departments.length > 0
    ? Math.round(departments.reduce((s, d) => s + d.health, 0) / departments.length)
    : 0;
  const blockers = (departments ?? []).reduce((s, d) => s + d.blockers, 0);
  const onTrack = (departments ?? []).filter((d) => d.status.toLowerCase().replace(/[\s-]+/g, "_") === "on_track").length;

  const healthLabel = healthTone(avgHealth) === "green" ? "On Track" : healthTone(avgHealth) === "amber" ? "Watch" : "At Risk";

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="CCA Operating Pulse"
        subtitle="Contractor Compliance Authority — the active operating brand. Department health, blockers, and live projects."
        actions={
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Founder Authority Mode</span>
              <AuthorityModeToggle />
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">{caption}</div>
          </div>
        }
      />

      <GuardrailNote text="Operating visibility only. Department actions and project recommendations require written founder approval before any commitment." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatBlock icon={Activity} label="Composite Health" value={`${avgHealth}`} unit="/100" tone={healthTone(avgHealth)} chip={healthLabel} />
        <StatBlock icon={Layers} label="Departments On Track" value={`${onTrack}`} unit={`/${departments?.length ?? 0}`} tone="blue" chip="Operating" />
        <StatBlock icon={GanttChartSquare} label="Open Blockers" value={`${blockers}`} tone={blockers > 0 ? "red" : "green"} chip={blockers > 0 ? "Attention" : "Clear"} />
      </div>

      <Panel icon={Layers} title="Department Health" bodyClassName="p-0">
        {loadingDept ? <div className="p-6"><Skeleton className="h-48" /></div> : deptError ? (
          <div className="p-6"><ErrorState onRetry={() => refetchDept()} /></div>
        ) : departments && departments.length > 0 ? (
          <DepartmentTable departments={departments} />
        ) : (
          <div className="p-6"><EmptyState icon={Layers} title="No departments" /></div>
        )}
      </Panel>

      <Panel icon={GanttChartSquare} title="Active Projects" bodyClassName="p-0">
        {loadingProj ? <div className="p-6"><Skeleton className="h-48" /></div> : projError ? (
          <div className="p-6"><ErrorState onRetry={() => refetchProj()} /></div>
        ) : filteredProjects.length > 0 ? (
          <div className="divide-y divide-card-border">
            {filteredProjects.map((p) => (
              <ProjectPulseRow key={p.id} project={p} />
            ))}
          </div>
        ) : (projects && projects.length > 0) ? (
          <div className="p-6"><EmptyState icon={GanttChartSquare} title="No projects in this lens" description={`No projects match the ${mode} authority lens.`} /></div>
        ) : (
          <div className="p-6"><EmptyState icon={GanttChartSquare} title="No projects" /></div>
        )}
      </Panel>
    </div>
  );
}

const TONE_CLASS: Record<string, { bar: string; chip: string }> = {
  green: { bar: "bg-emerald-500", chip: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  amber: { bar: "bg-amber-500", chip: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  red: { bar: "bg-red-500", chip: "bg-red-500/15 text-red-300 border-red-500/30" },
  blue: { bar: "bg-primary", chip: "bg-primary/15 text-primary border-primary/30" },
  neutral: { bar: "bg-card-border", chip: "bg-secondary text-secondary-foreground border-border" },
};

function ProjectPulseRow({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const { data: notes, isLoading: loadingNotes } = useGetProjectNotes(project.id, {
    query: { queryKey: getGetProjectNotesQueryKey(project.id), enabled: open },
  });
  const createNote = useCreateProjectNote();
  const updateNote = useUpdateProjectNote();
  const deleteNote = useDeleteProjectNote();
  const noteCount = notes?.length ?? 0;

  return (
    <div>
      <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-3 hover:bg-secondary/40 transition-colors">
        <div className="min-w-0">
          <Link href={`/projects/${project.id}`} className="group inline-block">
            <span className="font-semibold text-card-foreground tracking-tight group-hover:text-primary transition-colors">{project.name}</span>
          </Link>
          <div className="text-[11px] text-muted-foreground mt-0.5">{project.department ?? "—"}{project.owner ? ` • ${project.owner}` : ""}{project.dueDate ? ` • Due ${project.dueDate}` : ""}</div>
          {project.summary && <p className="text-xs text-card-foreground/70 mt-1.5 max-w-2xl">{project.summary}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={project.status} />
          <AuthorityBadge label={project.authorityLabel} />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className={`inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest transition-colors ${open ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground hover:border-card-border"}`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Notes{open && noteCount > 0 ? ` (${noteCount})` : ""}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          <Link href={`/projects/${project.id}`} className="text-muted-foreground hover:text-primary transition-colors" aria-label="Open project detail">
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      {open && (
        <div className="px-6 pb-6 pt-1 bg-secondary/20 border-t border-card-border">
          <ParticipationNotes
            notes={notes}
            isLoading={loadingNotes}
            isPending={createNote.isPending}
            invalidateKey={getGetProjectNotesQueryKey(project.id)}
            isUpdating={updateNote.isPending}
            isDeleting={deleteNote.isPending}
            onSubmit={(body, callbacks) =>
              createNote.mutate({ id: project.id, data: { body } }, callbacks)
            }
            onUpdate={(noteId, body, callbacks) =>
              updateNote.mutate({ id: project.id, noteId, data: { body } }, callbacks)
            }
            onDelete={(noteId, callbacks) =>
              deleteNote.mutate({ id: project.id, noteId }, callbacks)
            }
          />
        </div>
      )}
    </div>
  );
}

function StatBlock({ icon: Icon, label, value, unit, tone, chip }: { icon: any; label: string; value: string; unit?: string; tone: string; chip: string }) {
  const t = TONE_CLASS[tone] ?? TONE_CLASS.neutral;
  return (
    <div className="border border-card-border rounded bg-card p-5 shadow-sm relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1 ${t.bar}`} />
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground pt-1">{label}</div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="text-3xl font-bold text-card-foreground tracking-tight tabular-nums leading-none">
        {value}{unit && <span className="text-base font-semibold text-muted-foreground ml-0.5">{unit}</span>}
      </div>
      <div className="mt-3">
        <span className={`inline-flex items-center border font-mono font-bold uppercase tracking-widest rounded-[2px] px-2 py-0.5 text-[9px] ${t.chip}`}>{chip}</span>
      </div>
    </div>
  );
}

import { useGetMonthlyReview } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";

export default function ReviewDetail() {
  const params = useParams();
  const id = Number(params.id);
  const { data: review, isLoading } = useGetMonthlyReview(id);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-8 w-32 rounded border-border" />
        <Skeleton className="h-64 w-full rounded border-border" />
      </div>
    );
  }

  if (!review) return <div>Not found</div>;

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <Link href="/financial" className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Financial Review
      </Link>

      <div className="border-b border-border pb-6">
        <h1 className="text-4xl font-sans font-bold text-foreground tracking-tight mb-4">{review.period} Review</h1>
        <div className="flex items-center gap-4 text-sm font-semibold">
          <span className="text-muted-foreground uppercase tracking-widest text-[11px] font-mono">Founder Review Package</span>
          <span className="text-border">&bull;</span>
          <span className={`px-2.5 py-1 rounded-[2px] border uppercase tracking-widest text-[10px] font-mono font-bold ${review.status === 'published' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'}`}>
            {review.status}
          </span>
        </div>
      </div>

      <div className="text-base text-foreground/80 leading-relaxed font-medium">
        <p>{review.summary}</p>
      </div>

      {review.metrics && review.metrics.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {review.metrics.map((m, i) => (
            <div key={i} className="bg-card border border-card-border rounded p-6 shadow-sm">
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground mb-2">{m.label}</div>
              <div className="text-3xl font-sans font-bold text-card-foreground tracking-tighter tabular-nums">{m.value}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {review.highlights && review.highlights.length > 0 && (
          <div className="bg-card border border-card-border rounded shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-card-border flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <h3 className="text-base font-bold text-card-foreground tracking-tight">Key Highlights</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {review.highlights.map((h, i) => (
                  <li key={i} className="text-sm text-card-foreground/80 pl-4 border-l-[3px] border-emerald-500 font-medium leading-relaxed">{h}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {review.watchItems && review.watchItems.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-amber-500/30 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <h3 className="text-base font-bold text-amber-200 tracking-tight">Watch Items</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {review.watchItems.map((w, i) => (
                  <li key={i} className="text-sm text-amber-100/90 pl-4 border-l-[3px] border-amber-500 font-medium leading-relaxed">{w}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

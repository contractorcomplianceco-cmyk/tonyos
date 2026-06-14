import { useGetMonthlyReview } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";

export default function ReviewDetail() {
  const params = useParams();
  const id = Number(params.id);
  const { data: review, isLoading } = useGetMonthlyReview(id);

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!review) return <div className="p-8">Not found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href="/reviews" className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-tight text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Reviews
      </Link>

      <div>
        <h1 className="text-4xl font-serif text-primary mb-2">{review.period} Review</h1>
        <div className="flex items-center gap-3 font-mono text-sm uppercase tracking-tight">
          <span className="text-muted-foreground">Founder Review Package</span>
          <span className="text-primary">&bull;</span>
          <span className={review.status === 'published' ? 'text-emerald-500' : 'text-amber-500'}>Status: {review.status}</span>
        </div>
      </div>

      <div className="prose prose-invert prose-p:text-foreground/90 max-w-none text-lg leading-relaxed">
        <p>{review.summary}</p>
      </div>

      {review.metrics && review.metrics.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
          {review.metrics.map((m, i) => (
            <Card key={i} className="bg-card/20 border-border/40">
              <CardContent className="p-4">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">{m.label}</div>
                <div className="text-2xl font-serif text-foreground">{m.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {review.highlights && review.highlights.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-serif text-foreground border-b border-border/50 pb-2 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Key Highlights
            </h3>
            <ul className="space-y-3">
              {review.highlights.map((h, i) => (
                <li key={i} className="text-sm text-foreground/80 pl-2 border-l-2 border-emerald-500/30">{h}</li>
              ))}
            </ul>
          </div>
        )}

        {review.watchItems && review.watchItems.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-serif text-foreground border-b border-border/50 pb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> Watch Items
            </h3>
            <ul className="space-y-3">
              {review.watchItems.map((w, i) => (
                <li key={i} className="text-sm text-foreground/80 pl-2 border-l-2 border-amber-500/30">{w}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

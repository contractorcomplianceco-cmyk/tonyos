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
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!review) return <div>Not found</div>;

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <Link href="/financial" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Financial Review
      </Link>

      <div>
        <h1 className="text-4xl font-serif text-foreground font-medium mb-3">{review.period} Review</h1>
        <div className="flex items-center gap-3 text-sm font-medium">
          <span className="text-muted-foreground uppercase tracking-wider">Founder Review Package</span>
          <span className="text-border">&bull;</span>
          <span className={`px-2 py-0.5 rounded-sm border uppercase tracking-wider text-[10px] ${review.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
            {review.status}
          </span>
        </div>
      </div>

      <div className="text-base text-foreground/80 leading-relaxed max-w-none">
        <p>{review.summary}</p>
      </div>

      {review.metrics && review.metrics.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {review.metrics.map((m, i) => (
            <Card key={i} className="shadow-sm border-border">
              <CardContent className="p-4">
                <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1">{m.label}</div>
                <div className="text-2xl font-serif text-foreground">{m.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {review.highlights && review.highlights.length > 0 && (
          <Card className="shadow-sm">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-lg font-serif text-foreground flex items-center gap-2 border-b border-border pb-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Key Highlights
              </h3>
              <ul className="space-y-3">
                {review.highlights.map((h, i) => (
                  <li key={i} className="text-sm text-foreground/80 pl-3 border-l-2 border-emerald-500">{h}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {review.watchItems && review.watchItems.length > 0 && (
          <Card className="shadow-sm bg-amber-50/30 border-amber-100">
            <CardContent className="p-5 space-y-4">
              <h3 className="text-lg font-serif text-foreground flex items-center gap-2 border-b border-amber-200 pb-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" /> Watch Items
              </h3>
              <ul className="space-y-3">
                {review.watchItems.map((w, i) => (
                  <li key={i} className="text-sm text-foreground/80 pl-3 border-l-2 border-amber-500">{w}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

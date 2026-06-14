import { useGetMonthlyReviews } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function Reviews() {
  const { data: reviews, isLoading } = useGetMonthlyReviews();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-serif text-primary">Monthly Founder Reviews</h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm tracking-tight uppercase">Retrospective & Forward Outlook</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews?.map((review) => (
            <Link key={review.id} href={`/reviews/${review.id}`}>
              <Card className="bg-card/30 border-border/50 hover:border-primary/50 hover:bg-card/60 transition-all cursor-pointer h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-serif text-foreground">{review.period}</h2>
                    <span className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded border ${
                      review.status === 'published' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {review.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {review.summary}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

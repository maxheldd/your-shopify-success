import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { sleepMaskReviews, sleepMaskReviewStats } from "@/data/sleepMaskReviews";
import { sleepMaskReviewImages } from "@/data/sleepMaskReviewImages";

export function getReviewStats(_handle?: string) {
  return {
    distribution: [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: sleepMaskReviewStats.distribution[String(stars) as keyof typeof sleepMaskReviewStats.distribution],
    })),
    total: sleepMaskReviewStats.total,
    average: sleepMaskReviewStats.average,
  };
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "lg" ? "h-5 w-5" : size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fillPercent = Math.max(0, Math.min(1, rating - (star - 1))) * 100;
        return (
          <span key={star} className={cn("relative inline-block", sizeClass)}>
            <Star className={cn(sizeClass, "absolute inset-0 fill-muted text-muted-foreground")} />
            {fillPercent > 0 && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercent}%` }}
              >
                <Star className={cn(sizeClass, "fill-amber-400 text-amber-400")} />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

export function ProductReviews({ handle }: { handle?: string }) {
  const stats = getReviewStats(handle);
  const [showAll, setShowAll] = useState(false);
  const visibleReviews = showAll ? sleepMaskReviews : sleepMaskReviews.slice(0, 8);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 rounded-lg border bg-card p-5 sm:grid-cols-[180px_1fr] sm:p-6">
        <div className="flex flex-col items-center justify-center text-center sm:border-r sm:border-border sm:pr-8">
          <p className="text-5xl font-semibold">{stats.average.toFixed(1)}</p>
          <div className="mt-2"><StarRating rating={stats.average} size="md" /></div>
          <p className="mt-2 text-sm text-muted-foreground">Based on {stats.total} ratings</p>
        </div>
        <div className="space-y-2.5">
          {stats.distribution.map(({ stars, count }) => (
            <div key={stars} className="grid grid-cols-[28px_1fr_34px] items-center gap-3 text-sm">
              <span>{stars}★</span>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(count / stats.total) * 100}%` }}
                />
              </div>
              <span className="text-right text-muted-foreground">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {visibleReviews.map((review) => (
          <article key={review.id} className="rounded-lg border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <StarRating rating={review.rating} size="sm" />
                <p className="mt-2 text-sm font-semibold">Verified buyer · {review.country}</p>
              </div>
              <time className="text-xs text-muted-foreground">{review.date}</time>
            </div>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-foreground">{review.text}</p>
            <p className="mt-3 text-xs text-muted-foreground">Color: {review.color}</p>
            {review.imageKeys.length > 0 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {review.imageKeys.map((key, index) => {
                  const imageUrl = sleepMaskReviewImages[key];
                  if (!imageUrl) return null;
                  return (
                    <img
                      key={key}
                      src={imageUrl}
                      alt={`Customer photo ${index + 1} for the ${review.color} sleep mask`}
                      loading="lazy"
                      className="h-24 w-24 shrink-0 rounded-md border object-cover"
                    />
                  );
                })}
              </div>
            )}
          </article>
        ))}
      </div>

      {sleepMaskReviews.length > 8 && (
        <div className="flex justify-center">
          <Button type="button" variant="outline" onClick={() => setShowAll((current) => !current)}>
            {showAll ? "Show fewer reviews" : `Show all ${sleepMaskReviews.length} written reviews`}
          </Button>
        </div>
      )}
    </div>
  );
}

export { StarRating };

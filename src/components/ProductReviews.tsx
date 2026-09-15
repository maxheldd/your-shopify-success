import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
export function getReviewStats(_handle?: string) {
  return { distribution: [], total: 0, average: 0 };
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
  getReviewStats(handle);

  return (
    <div className="rounded-lg border bg-card px-6 py-12 text-center">
      <StarRating rating={0} size="md" />
      <h3 className="mt-4 text-lg font-semibold">No reviews yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">Be the first to review this product.</p>
    </div>
  );
}

export { StarRating };

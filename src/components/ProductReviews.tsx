import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  name: string;
  rating: number;
  date: string;
  body: string;
  verified: boolean;
}

const REVIEWS: Review[] = [
  {
    "name": "Verified Buyer",
    "date": "14 Feb 2026",
    "rating": 5,
    "body": "Very soft but supportive memory foam . If you have a very large neck say over 18\" will be a little small. Compares very well to the very expensive octopus neck pillow, not quite the same quality but 10x cheaper so good value .",
    "verified": true
  },
  {
    "name": "t***r",
    "date": "22 Apr 2026",
    "rating": 5,
    "body": "Great product, seems well made, works well on different neck sizes, just a note have to remove the protective layer over one of the velcro sides, initially thought they had sewn in the wrong side up!",
    "verified": true
  },
  {
    "name": "i***t",
    "date": "26 Feb 2026",
    "rating": 4,
    "body": "Great pillow for flights or long trips Matches the image",
    "verified": true
  },
  {
    "name": "Verified Buyer",
    "date": "26 Apr 2026",
    "rating": 5,
    "body": "It's really comfortable for travel! I highly recommend it!",
    "verified": true
  },
  {
    "name": "Verified Buyer",
    "date": "22 Jan 2026",
    "rating": 5,
    "body": "A quality travel neck pillow.",
    "verified": true
  },
  {
    "name": "J***e",
    "date": "26 Dec 2025",
    "rating": 5,
    "body": "Very comfortable and firm. Almost a collar. High-quality velcro closure",
    "verified": true
  },
  {
    "name": "Verified Buyer",
    "date": "09 Feb 2026",
    "rating": 5,
    "body": "It's beautiful, I recommend it, fast shipping.",
    "verified": true
  },
  {
    "name": "2***r",
    "date": "13 Feb 2026",
    "rating": 5,
    "body": "Very good product, matches the description, ultra-fast delivery.",
    "verified": true
  },
  {
    "name": "c***j",
    "date": "26 Dec 2025",
    "rating": 5,
    "body": "Good product, fast delivery+++++",
    "verified": true
  },
  {
    "name": "É***n",
    "date": "05 Mar 2026",
    "rating": 5,
    "body": "Comfortable, true to the description",
    "verified": true
  },
  {
    "name": "Verified Buyer",
    "date": "16 Feb 2026",
    "rating": 5,
    "body": "They seem very comfortable, they fit perfectly.",
    "verified": true
  },
  {
    "name": "Verified Buyer",
    "date": "03 Feb 2026",
    "rating": 5,
    "body": "Excellent! Very satisfied.",
    "verified": true
  },
  {
    "name": "Verified Buyer",
    "date": "24 Feb 2026",
    "rating": 5,
    "body": "comfortable top",
    "verified": true
  },
  {
    "name": "N***V",
    "date": "13 Feb 2026",
    "rating": 5,
    "body": "It fits well",
    "verified": true
  },
  {
    "name": "c***y",
    "date": "28 Apr 2026",
    "rating": 5,
    "body": "That's great 👍🏻",
    "verified": true
  },
  {
    "name": "Verified Buyer",
    "date": "12 Apr 2026",
    "rating": 5,
    "body": "Good",
    "verified": true
  },
  {
    "name": "Verified Buyer",
    "date": "26 Mar 2026",
    "rating": 4,
    "body": "superb product",
    "verified": true
  },
  {
    "name": "Verified Buyer",
    "date": "24 Feb 2026",
    "rating": 5,
    "body": "Seems really comfy, but not used on a long journey yet",
    "verified": true
  },
  {
    "name": "R***f",
    "date": "03 Apr 2026",
    "rating": 5,
    "body": "Super",
    "verified": true
  },
  {
    "name": "Verified Buyer",
    "date": "20 Mar 2026",
    "rating": 5,
    "body": "👍🏻",
    "verified": true
  },
  {
    "name": "Verified Buyer",
    "date": "20 Feb 2026",
    "rating": 4,
    "body": "The price-quality ratio is okay. I don't know yet if it will really work. The inflatable version takes up less space when traveling.",
    "verified": true
  },
  {
    "name": "t***t",
    "date": "12 Feb 2026",
    "rating": 3,
    "body": "The image shows that one side of the neck pillow is higher to provide more support, but the product I received has both sides low and does not provide enough support. It's a shame, you get what you pay for!",
    "verified": true
  },
  {
    "name": "Verified Buyer",
    "date": "29 Mar 2026",
    "rating": 3,
    "body": "The velcrow closing is not very strong every time i mive my nek a bit it breaks open. But it is soft",
    "verified": true
  },
  {
    "name": "Verified Buyer",
    "date": "02 Feb 2026",
    "rating": 1,
    "body": "Wrong colour and also same 12cm height on left and right sides - not 16cm as stated in the description!",
    "verified": true
  },
  {
    "name": "Verified Buyer",
    "date": "19 Feb 2026",
    "rating": 1,
    "body": "The description is incorrect; it says that one side is higher than the other, but both sides are the same, about 12cm each. It does not have the 16cm side as advertised.",
    "verified": true
  },
  {
    "name": "E***l",
    "date": "26 Jul 2026",
    "rating": 5,
    "body": "Perfected as described can’t wait to use",
    "verified": true
  },
  {
    "name": "Verified Buyer",
    "date": "21 Jul 2026",
    "rating": 5,
    "body": "Looks fine",
    "verified": true
  },
  {
    "name": "F***i",
    "date": "25 Aug 2026",
    "rating": 5,
    "body": "Comfortable, very good, I recommend it.",
    "verified": true
  },
  {
    "name": "L***o",
    "date": "22 Aug 2026",
    "rating": 5,
    "body": "Nice product.",
    "verified": true
  },
  {
    "name": "Verified Buyer",
    "date": "19 Aug 2026",
    "rating": 5,
    "body": "Excellent",
    "verified": true
  },
  {
    "name": "Verified Buyer",
    "date": "11 Apr 2026",
    "rating": 2,
    "body": "Ordered and received stuff color and look is different.",
    "verified": true
  },
  {
    "name": "c***r",
    "date": "25 Aug 2026",
    "rating": 2,
    "body": "The pillow itself is fine, but the zipper doesn't stay closed at all. I have not yet found a solution to resolve this issue before my departure. AND my mailbox was forced open to hold the package. Now it won't close anymore! ! ! While I had specifically stayed home to receive the package... What a disappointment!",
    "verified": true
  },
  {
    "name": "Verified Buyer",
    "date": "16 Feb 2026",
    "rating": 2,
    "body": "No good support, welcro not ok",
    "verified": true
  },
  {
    "name": "A***z",
    "date": "02 Aug 2026",
    "rating": 2,
    "body": "Comfortable but bulky",
    "verified": true
  },
  {
    "name": "R***o",
    "date": "16 Jun 2026",
    "rating": 1,
    "body": "Uncomfortable",
    "verified": true
  }
];

const DISTRIBUTION = [
  { stars: 5, count: 87 },
  { stars: 4, count: 12 },
  { stars: 3, count: 4 },
  { stars: 2, count: 4 },
  { stars: 1, count: 3 },
];

const TOTAL = DISTRIBUTION.reduce((sum, row) => sum + row.count, 0);
const AVERAGE =
  DISTRIBUTION.reduce((sum, row) => sum + row.stars * row.count, 0) / TOTAL;

/** Real review totals pulled from the product's collected reviews. */
export function getReviewStats(_handle?: string) {
  return { distribution: DISTRIBUTION, total: TOTAL, average: Math.round(AVERAGE * 10) / 10 };
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
  const { distribution: DISTRIBUTION, total: TOTAL, average: AVERAGE } = getReviewStats(handle);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 rounded-2xl border bg-card p-6 sm:grid-cols-2 sm:items-center">
        <div className="space-y-2">
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-bold tracking-tight">{AVERAGE.toFixed(1)}</span>
            <StarRating rating={AVERAGE} size="md" />
          </div>
          <p className="text-sm text-muted-foreground">Based on {TOTAL} reviews</p>
        </div>

        <div className="space-y-2">
          {DISTRIBUTION.map((row) => {
            const percentage = (row.count / TOTAL) * 100;
            return (
              <div key={row.stars} className="flex items-center gap-3 text-sm">
                <span className="w-3 shrink-0 font-medium">{row.stars}</span>
                <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-foreground transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-muted-foreground">{row.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {REVIEWS.map((review, index) => (
          <div
            key={index}
            className="rounded-2xl border bg-card p-5 transition-shadow duration-200 hover:shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
                  {review.name.charAt(0)}
                </div>
                <span className="text-sm font-medium">{review.name}</span>
              </div>
              {review.verified && (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                  Verified purchase
                </span>
              )}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <StarRating rating={review.rating} />
              <span className="text-xs text-muted-foreground">{review.date}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export { StarRating };

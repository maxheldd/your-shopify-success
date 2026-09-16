import { StarRating } from "@/components/ProductReviews";

const highlightReviews = [
  {
    text: "Feels good, blocks out all light and the strap on the back is very useful! Because the front part is very soft it doesn't dig into your face like smaller eye masks do.",
    country: "GB",
    color: "Black",
  },
  {
    text: "Very nice mulberry sleeping mask! Luckily I ordered two so I get to keep one for myself. Very comfortable.",
    country: "US",
    color: "Beige",
  },
  {
    text: "Adjustable band fits all head sizes. Comfortable and breathable, doesn't get hot.",
    country: "AU",
    color: "Navy Blue",
  },
  {
    text: "The mask is really nice, feels nice and soft. It fits well also — I'm very happy with it.",
    country: "IE",
    color: "Pink",
  },
  {
    text: "Love the soft touch and calming cool effect of the silky fabric. I love them.",
    country: "CA",
    color: "Light Gray",
  },
];

export function ReviewMarquee() {
  const loop = [...highlightReviews, ...highlightReviews];

  return (
    <div className="relative w-full overflow-hidden border-y border-border bg-muted/30 py-6">
      <div
        className="flex w-max gap-4"
        style={{ animation: "banner-scroll 55s linear infinite" }}
      >
        {loop.map((review, index) => (
          <figure
            key={`${review.text}-${index}`}
            className="w-72 shrink-0 rounded-lg border bg-card p-4 md:w-80"
          >
            <StarRating rating={5} size="sm" />
            <blockquote className="mt-3 text-sm leading-relaxed text-foreground">
              “{review.text}”
            </blockquote>
            <figcaption className="mt-3 text-xs text-muted-foreground">
              Verified buyer · {review.country} · {review.color}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

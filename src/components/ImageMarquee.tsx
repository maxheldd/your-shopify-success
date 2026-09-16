interface MarqueeImage {
  url: string;
  altText?: string | null;
}

export function ImageMarquee({ images, alt }: { images: MarqueeImage[]; alt: string }) {
  if (images.length === 0) return null;
  const loop = [...images, ...images];

  return (
    <div className="relative w-full overflow-hidden border-b border-border bg-muted/30">
      <div
        className="flex w-max gap-3 py-3"
        style={{ animation: "banner-scroll 45s linear infinite" }}
      >
        {loop.map((image, index) => (
          <img
            key={`${image.url}-${index}`}
            src={image.url}
            alt={image.altText ?? alt}
            loading="lazy"
            className="h-28 w-40 shrink-0 rounded-lg object-cover opacity-70 md:h-36 md:w-52"
          />
        ))}
      </div>
    </div>
  );
}

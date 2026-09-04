import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ShopifyProductImage } from "@/lib/shopify";

interface ProductGalleryProps {
  images: ShopifyProductImage[];
  alt: string;
  selectedImageUrl?: string | null;
}

export function ProductGallery({ images, alt, selectedImageUrl }: ProductGalleryProps) {
  const [mainIndex, setMainIndex] = useState(() => {
    if (!selectedImageUrl || images.length === 0) return 0;
    const index = images.findIndex((img) => img.url === selectedImageUrl);
    return index >= 0 ? index : 0;
  });

  const mainImage = images[mainIndex];

  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
        {mainImage ? (
          <img
            src={mainImage.url}
            alt={mainImage.altText ?? alt}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setMainIndex(index)}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-muted transition-all hover:opacity-80",
                mainIndex === index ? "ring-2 ring-primary ring-offset-2" : "border-border",
              )}
              aria-label={`View ${image.altText ?? alt}`}
            >
              <img
                src={image.url}
                alt={image.altText ?? alt}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

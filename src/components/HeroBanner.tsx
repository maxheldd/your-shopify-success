import banner1 from "@/assets/banner-1.png.asset.json";
import banner2 from "@/assets/banner-2.png.asset.json";
import banner3 from "@/assets/banner-3.png.asset.json";

const SLIDES = [
  { url: banner1.url, alt: "Cordless heated massage wraps in grey fabric" },
  { url: banner2.url, alt: "Person relaxing with a heated ankle wrap in the evening" },
  { url: banner3.url, alt: "Athlete wearing a heated ankle brace after training" },
];

export function HeroBanner() {
  const loop = [...SLIDES, ...SLIDES];

  return (
    <div className="relative w-full overflow-hidden border-b border-border bg-muted">
      <div className="flex w-max animate-[banner-scroll_40s_linear_infinite] motion-reduce:animate-none">
        {loop.map((slide, i) => (
          <img
            key={i}
            src={slide.url}
            alt={slide.alt}
            loading={i < 2 ? "eager" : "lazy"}
            className="h-40 w-auto max-w-none object-cover opacity-70 md:h-56 lg:h-64"
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-background/25" />
    </div>
  );
}

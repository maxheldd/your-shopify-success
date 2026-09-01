import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Loader2,
  Minus,
  Package,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Zap,
} from "lucide-react";
import { getProductByHandle } from "@/lib/shopify.functions";
import { useCartStore } from "@/stores/cartStore";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductAccordions } from "@/components/ProductAccordions";
import { ProductReviews, StarRating } from "@/components/ProductReviews";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import type { ShopifyProductVariant } from "@/lib/shopify";

export const Route = createFileRoute("/product/$handle")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.handle} | Caesar Products` },
      { name: "description", content: "Shop products at Caesar Products" },
      { property: "og:title", content: `${params.handle} | Caesar Products` },
      { property: "og:description", content: "Shop products at Caesar Products" },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async ({ params, context }) => {
    const product = await context.queryClient.ensureQueryData({
      queryKey: ["product", params.handle],
      queryFn: () => getProductByHandle({ data: { handle: params.handle } }),
    });
    if (!product) throw notFound();
    return { product };
  },
  component: ProductDetailPage,
  errorComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/" className="mt-4 inline-block text-primary hover:underline">
          Back to shop
        </Link>
      </div>
    </div>
  ),
});

const HEAT_LEVEL_ORDER = ["3 Level", "4 Level", "5 Level", "Red Light", "6 Level (3-in-1)", "Airbag"];

function normalizeHeatLevel(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("3 level") || lower.includes("3-level")) return "3 Level";
  if (lower.includes("4 level") || lower.includes("4-level")) return "4 Level";
  if (lower.includes("5 level") || lower.includes("5-level")) return "5 Level";
  if (lower.includes("6 level") || lower.includes("6-level") || lower.includes("3-in-1")) return "6 Level (3-in-1)";
  if (lower.includes("red led") || lower.includes("660nm") || lower.includes("red light")) return "Red Light";
  if (lower.includes("airbag")) return "Airbag";
  return "Other";
}

function deriveStyle(title: string, heatLevel: string): string {
  const lower = title.toLowerCase();
  let style = title;

  // Remove heat-level markers
  style = style.replace(/[-\s]?(3|4|5|6)\s?level/gi, "");
  style = style.replace(/[-\s]?660nm\s?red\s?led/gi, "");
  style = style.replace(/[-\s]?red\s?led/gi, "");
  style = style.replace(/[-\s]?3-in-1\s?type/gi, "");
  style = style.replace(/[-\s]?3-in-1/gi, "");
  style = style.trim();

  // Normalize casing
  style = style
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  if (heatLevel === "Red Light") {
    if (lower.includes("ankle")) return "Ankle (40 beads)";
    if (lower.includes("wrist")) return "Wrist (24 beads)";
  }

  if (heatLevel === "6 Level (3-in-1)") {
    if (lower.includes("black")) return "3-in-1 black";
    if (lower.includes("grey") || lower.includes("gray")) return "3-in-1 grey";
    return "3-in-1";
  }

  if (!style) return "Standard";
  return style;
}

interface VariantGroup {
  heatLevels: string[];
  stylesByHeatLevel: Record<string, string[]>;
  variantByHeatAndStyle: Record<string, Record<string, ShopifyProductVariant>>;
}

function groupVariants(variants: ShopifyProductVariant[]): VariantGroup {
  const groups: Record<string, Set<string>> = {};
  const variantMap: Record<string, Record<string, ShopifyProductVariant>> = {};

  for (const variant of variants) {
    const heatLevel = normalizeHeatLevel(variant.title);
    const style = deriveStyle(variant.title, heatLevel);

    if (!groups[heatLevel]) groups[heatLevel] = new Set();
    groups[heatLevel].add(style);

    if (!variantMap[heatLevel]) variantMap[heatLevel] = {};
    variantMap[heatLevel][style] = variant;
  }

  const heatLevels = HEAT_LEVEL_ORDER.filter((h) => groups[h]).concat(
    Object.keys(groups).filter((h) => !HEAT_LEVEL_ORDER.includes(h)),
  );

  const stylesByHeatLevel: Record<string, string[]> = {};
  for (const heatLevel of heatLevels) {
    const styles = Array.from(groups[heatLevel] ?? new Set());
    // Try to put ankle variants first, then wrist, then neck for readability
    stylesByHeatLevel[heatLevel] = styles.sort((a, b) => {
      const order = ["ankle", "wrist", "neck", "3-in-1"];
      const indexA = order.findIndex((k) => a.toLowerCase().includes(k));
      const indexB = order.findIndex((k) => b.toLowerCase().includes(k));
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });
  }

  return { heatLevels, stylesByHeatLevel, variantByHeatAndStyle: variantMap };
}

function getSpecsForHeatLevel(heatLevel: string) {
  const base = {
    "3 Level": {
      battery: "2000 mAh lithium-ion",
      chargeTime: "2.5 hours",
      sessions: "4–6 sessions",
      autoShutoff: "20 minutes",
    },
    "4 Level": {
      battery: "2200 mAh lithium-ion",
      chargeTime: "2.5 hours",
      sessions: "5–7 sessions",
      autoShutoff: "20 minutes",
    },
    "5 Level": {
      battery: "2500 mAh lithium-ion",
      chargeTime: "3 hours",
      sessions: "5–7 sessions",
      autoShutoff: "25 minutes",
    },
    "Red Light": {
      battery: "3000 mAh lithium-ion",
      chargeTime: "3.5 hours",
      sessions: "6–8 sessions",
      autoShutoff: "30 minutes",
    },
    "6 Level (3-in-1)": {
      battery: "3000 mAh lithium-ion",
      chargeTime: "3.5 hours",
      sessions: "6–8 sessions",
      autoShutoff: "30 minutes",
    },
    Airbag: {
      battery: "2500 mAh lithium-ion",
      chargeTime: "3 hours",
      sessions: "5–7 sessions",
      autoShutoff: "25 minutes",
    },
  };

  const specs = base[heatLevel as keyof typeof base] ?? base["3 Level"];
  return [
    { label: "Battery", value: specs.battery },
    { label: "Charge time", value: specs.chargeTime },
    { label: "Sessions per charge", value: specs.sessions },
    { label: "Auto shut-off", value: specs.autoShutoff },
  ];
}

function formatPrice(amount: string, currencyCode: string) {
  return `${currencyCode} ${parseFloat(amount).toFixed(2)}`;
}

function FadeIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isInView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function QuantityStepper({ quantity, onChange }: { quantity: number; onChange: (value: number) => void }) {
  return (
    <div className="flex items-center rounded-md border">
      <button
        type="button"
        aria-label="Decrease quantity"
        className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
      >
        <Minus className="h-4 w-4" />
      </button>
      <Input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => onChange(Math.max(1, parseInt(e.target.value, 10) || 1))}
        className="h-10 w-14 rounded-none border-0 border-x text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label="Increase quantity"
        className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
        onClick={() => onChange(quantity + 1)}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function TrustRow() {
  const items = [
    { icon: Truck, label: "Free shipping" },
    { icon: RefreshCw, label: "30-day returns" },
    { icon: ShieldCheck, label: "CE / FCC / RoHS" },
    { icon: Package, label: "1-year warranty" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs text-muted-foreground">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <item.icon className="h-3.5 w-3.5" />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function FeatureStrip() {
  const features = [
    { icon: Zap, title: "Adjustable heat", description: "Three to six warmth levels to match your comfort." },
    { icon: RefreshCw, title: "Three vibration modes", description: "Pulse, wave, and constant settings." },
    { icon: ShieldCheck, title: "Auto shut-off", description: "Timed safety shut-off after every session." },
    { icon: Package, title: "Overheat protection", description: "Built-in sensor keeps heat within a safe range." },
  ];

  return (
    <FadeIn>
      <section className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border bg-card p-5 transition-shadow duration-200 hover:shadow-sm"
          >
            <feature.icon className="h-5 w-5 text-primary" />
            <h3 className="mt-3 text-sm font-semibold">{feature.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </section>
    </FadeIn>
  );
}

function ProductDetailPage() {
  const { handle } = Route.useParams();
  const { data: product } = useSuspenseQuery({
    queryKey: ["product", handle],
    queryFn: () => getProductByHandle({ data: { handle } }),
  });

  if (!product) return null;

  const variants = useMemo(
    () => product.variants.edges.map((edge) => edge.node),
    [product.variants.edges],
  );
  const images = useMemo(
    () => product.images.edges.map((edge) => edge.node),
    [product.images.edges],
  );

  const { heatLevels, stylesByHeatLevel, variantByHeatAndStyle } = useMemo(
    () => groupVariants(variants),
    [variants],
  );

  const [heatLevel, setHeatLevel] = useState(heatLevels[0] ?? "");
  const [style, setStyle] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  // Reset style when heat level changes and pick first available style
  useEffect(() => {
    const availableStyles = stylesByHeatLevel[heatLevel] ?? [];
    setStyle(availableStyles[0] ?? "");
  }, [heatLevel, stylesByHeatLevel]);

  const selectedVariant = useMemo(() => {
    if (!heatLevel || !style) return null;
    return variantByHeatAndStyle[heatLevel]?.[style] ?? null;
  }, [heatLevel, style, variantByHeatAndStyle]);

  // Jump gallery to variant image when selection changes
  useEffect(() => {
    if (selectedVariant?.image?.url) {
      setSelectedImageUrl(selectedVariant.image.url);
    }
  }, [selectedVariant?.image?.url]);

  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);
  const checkoutUrl = useCartStore((state) => state.checkoutUrl);

  const handleAddToCart = async (goToCheckout = false) => {
    if (!selectedVariant) return;
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions,
    });
    if (goToCheckout && checkoutUrl) {
      window.open(checkoutUrl, "_blank");
    }
  };

  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice;
  const compareAtAmount = selectedVariant?.compareAtPrice
    ? parseFloat(selectedVariant.compareAtPrice.amount)
    : parseFloat(price.amount) * 2;
  const savings = compareAtAmount - parseFloat(price.amount);
  const savingsPercent = compareAtAmount > 0 ? Math.round((savings / compareAtAmount) * 100) : 0;

  const selectedVariantName = selectedVariant ? `${heatLevel} — ${style}` : "Select options";

  return (
    <main className="min-h-screen px-4 py-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to shop
        </Link>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          <FadeIn>
            <ProductGallery
              images={images}
              alt={product.title}
              selectedImageUrl={selectedImageUrl}
            />
          </FadeIn>

          <div className="flex flex-col">
            <Badge variant="secondary" className="w-fit mb-4">
              {product.vendor}
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{product.title}</h1>

            <a
              href="#reviews"
              className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <StarRating rating={4.5} />
              <span className="underline-offset-2 hover:underline">161 reviews</span>
            </a>

            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <p className="text-2xl font-semibold">{formatPrice(price.amount, price.currencyCode)}</p>
              {savings > 0 && (
                <>
                  <p className="text-lg text-muted-foreground line-through">
                    {formatPrice(compareAtAmount.toFixed(2), price.currencyCode)}
                  </p>
                  <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">
                    Save {savingsPercent}%
                  </Badge>
                </>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="heat-level" className="text-sm font-medium">
                  Heat level
                </label>
                <Select value={heatLevel} onValueChange={setHeatLevel}>
                  <SelectTrigger id="heat-level" className="w-full md:w-72">
                    <SelectValue placeholder="Choose a heat level" />
                  </SelectTrigger>
                  <SelectContent>
                    {heatLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="style" className="text-sm font-medium">
                  Style
                </label>
                <Select value={style} onValueChange={setStyle} disabled={!heatLevel}>
                  <SelectTrigger id="style" className="w-full md:w-72">
                    <SelectValue placeholder={heatLevel ? "Choose a style" : "Pick a heat level first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(stylesByHeatLevel[heatLevel] ?? []).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <QuantityStepper quantity={quantity} onChange={setQuantity} />
              <Button
                size="lg"
                className="w-full sm:w-auto"
                disabled={!selectedVariant?.availableForSale || isLoading}
                onClick={() => handleAddToCart(false)}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ShoppingCart className="mr-2 h-4 w-4" />
                )}
                {selectedVariant?.availableForSale ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="mt-3 w-full sm:w-auto"
              disabled={!selectedVariant?.availableForSale || isLoading}
              onClick={() => handleAddToCart(true)}
            >
              Buy it now
            </Button>

            <TrustRow />

            <FadeIn delay={100} className="mt-10">
              <ProductAccordions specs={getSpecsForHeatLevel(heatLevel)} />
            </FadeIn>
          </div>
        </div>

        <FeatureStrip />

        <FadeIn>
          <section id="reviews" className="mt-20 scroll-mt-20">
            <h2 className="text-2xl font-bold tracking-tight">Customer reviews</h2>
            <div className="mt-6">
              <ProductReviews />
            </div>
          </section>
        </FadeIn>
      </div>

      {/* Sticky mobile bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-xs text-muted-foreground">{selectedVariantName}</p>
            <p className="text-lg font-semibold">{formatPrice(price.amount, price.currencyCode)}</p>
          </div>
          <Button
            size="lg"
            className="shrink-0"
            disabled={!selectedVariant?.availableForSale || isLoading}
            onClick={() => handleAddToCart(false)}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
            <span className="ml-2">Add</span>
          </Button>
        </div>
      </div>

      {/* Spacer for sticky mobile bar */}
      <div className="h-20 md:hidden" />
    </main>
  );
}

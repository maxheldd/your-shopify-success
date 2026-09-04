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
import { parseDescription } from "@/lib/sanitizeDescription";
import { ProductReviews, StarRating, getReviewStats } from "@/components/ProductReviews";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import { buildVariantModel, findVariant, valuesForAxis } from "@/lib/variantOptions";
import { fbqTrack } from "@/lib/fbq";

export const Route = createFileRoute("/product/$handle")({
  loader: async ({ params, context }) => {
    const product = await context.queryClient.ensureQueryData({
      queryKey: ["product", params.handle],
      queryFn: () => getProductByHandle({ data: { handle: params.handle } }),
    });
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const product = loaderData?.product;
    if (!product) {
      return {
        meta: [
          { title: "Product unavailable | Caesar Goods" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${product.title} | Caesar Goods`;
    const description =
      product.description?.replace(/\s+/g, " ").trim().slice(0, 155) ||
      "Shop premium wellness and recovery gear at Caesar Goods.";
    const image = product.images?.edges?.[0]?.node?.url;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
    };
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

  const specs = base[heatLevel as keyof typeof base];
  if (!specs) return [];
  return [
    { label: "Battery", value: specs.battery },
    { label: "Charge time", value: specs.chargeTime },
    { label: "Sessions per charge", value: specs.sessions },
    { label: "Auto shut-off", value: specs.autoShutoff },
  ];
}

/** Generic, product-agnostic selling points when Shopify has no prose copy. */
function genericBullets(title: string): string[] {
  const name = (title.split(/[,|\u2014]/)[0] ?? "")
    .replace(/^\d+\s*(pair|pcs?|pack)s?\b/i, "")
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .join(" ")
    .toLowerCase();
  return [
    `Everyday comfort and support from our ${name || "wellness"} range.`,
    "Lightweight, breathable build designed for all-day wear.",
    "Unisex fit with easy sizing — see the size guide in the options above.",
    "Backed by free shipping, 30-day returns, and a 1-year warranty.",
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

  const model = useMemo(
    () => buildVariantModel(variants, product.options ?? []),
    [variants, product.options],
  );

  const [selection, setSelection] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  // Initialise / repair the selection so every axis always holds a valid value
  useEffect(() => {
    setSelection((current) => {
      const next: string[] = [];
      for (let index = 0; index < model.axisNames.length; index += 1) {
        const options = valuesForAxis(model, index, next);
        const existing = current[index];
        next.push(existing && options.includes(existing) ? existing : (options[0] ?? ""));
      }
      return next;
    });
  }, [model]);

  const handleAxisChange = (axisIndex: number, value: string) => {
    setSelection((current) => {
      const next = current.slice(0, axisIndex);
      next[axisIndex] = value;
      // Reset every downstream axis to its first available value
      for (let index = axisIndex + 1; index < model.axisNames.length; index += 1) {
        next.push(valuesForAxis(model, index, next)[0] ?? "");
      }
      return next;
    });
  };

  const selectedVariant = useMemo(
    () => findVariant(model, selection),
    [model, selection],
  );

  // Jump gallery to variant image when selection changes
  useEffect(() => {
    if (selectedVariant?.image?.url) {
      setSelectedImageUrl(selectedVariant.image.url);
    }
  }, [selectedVariant?.image?.url]);

  useEffect(() => {
    fbqTrack("ViewContent", {
      content_ids: [product.id],
      content_name: product.title,
      content_type: "product",
      value: parseFloat(product.priceRange.minVariantPrice.amount),
      currency: product.priceRange.minVariantPrice.currencyCode,
    });
  }, [product.id, product.title, product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode]);

  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);
  const checkoutUrl = useCartStore((state) => state.checkoutUrl);

  const handleAddToCart = async (goToCheckout = false) => {
    if (!selectedVariant) return;
    fbqTrack("AddToCart", {
      content_ids: [selectedVariant.id],
      content_name: product.title,
      content_type: "product",
      value: parseFloat(selectedVariant.price.amount) * quantity,
      currency: selectedVariant.price.currencyCode,
    });
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions,
    });
    if (goToCheckout) {
      fbqTrack("InitiateCheckout", {
        content_ids: [selectedVariant.id],
        content_name: product.title,
        num_items: quantity,
        value: parseFloat(selectedVariant.price.amount) * quantity,
        currency: selectedVariant.price.currencyCode,
      });
      const url = useCartStore.getState().checkoutUrl ?? checkoutUrl;
      if (url) window.open(url, "_blank");
    }
  };

  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice;
  const listedCompareAt = selectedVariant?.compareAtPrice
    ? parseFloat(selectedVariant.compareAtPrice.amount)
    : 0;
  const compareAtAmount =
    listedCompareAt > parseFloat(price.amount) ? listedCompareAt : parseFloat(price.amount) * 2;
  const savings = compareAtAmount - parseFloat(price.amount);
  const savingsPercent = compareAtAmount > 0 ? Math.round((savings / compareAtAmount) * 100) : 0;

  const heatLevel = model.axisNames[0] === "Heat level" ? (selection[0] ?? "") : "";
  const reviewStats = useMemo(() => getReviewStats(handle), [handle]);
  const parsed = useMemo(() => parseDescription(product.description ?? ""), [product.description]);
  const bullets = useMemo(
    () => (parsed.bullets.length ? parsed.bullets : genericBullets(product.title)),
    [parsed.bullets, product.title],
  );
  const specs = useMemo(() => {
    const heatSpecs = getSpecsForHeatLevel(heatLevel);
    if (heatSpecs.length) return heatSpecs;
    return parsed.specs;
  }, [heatLevel, parsed.specs]);
  const selectedVariantName = selectedVariant
    ? selection.filter(Boolean).join(" — ") || selectedVariant.title
    : "Select options";


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

        <div className="grid min-w-0 gap-8 md:grid-cols-2 lg:gap-12">
          <FadeIn className="min-w-0">
            <ProductGallery
              images={images}
              alt={product.title}
              selectedImageUrl={selectedImageUrl}
            />
          </FadeIn>

          <div className="flex min-w-0 flex-col">
            <Badge variant="secondary" className="w-fit mb-4">
              {product.vendor}
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{product.title}</h1>

            <a
              href="#reviews"
              className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <StarRating rating={reviewStats.average} />
              <span className="underline-offset-2 hover:underline">{reviewStats.total} reviews</span>
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

            {model.axisNames.length > 0 && (
              <div className="mt-6 space-y-4">
                {model.axisNames.map((axisName, axisIndex) => {
                  const options = valuesForAxis(model, axisIndex, selection);
                  const disabled =
                    axisIndex > 0 && !selection[axisIndex - 1];
                  return (
                    <div key={axisName} className="space-y-2">
                      <label htmlFor={`axis-${axisIndex}`} className="text-sm font-medium">
                        {axisName}
                      </label>
                      <Select
                        value={selection[axisIndex] ?? ""}
                        onValueChange={(value) => handleAxisChange(axisIndex, value)}
                        disabled={disabled}
                      >
                        <SelectTrigger id={`axis-${axisIndex}`} className="w-full md:w-72">
                          <SelectValue
                            placeholder={
                              disabled
                                ? `Pick a ${model.axisNames[axisIndex - 1]?.toLowerCase()} first`
                                : `Choose a ${axisName.toLowerCase()}`
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </div>
            )}


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
              <ProductAccordions specs={specs} bullets={bullets} />
            </FadeIn>
          </div>
        </div>

        <FeatureStrip />

        <FadeIn>
          <section id="reviews" className="mt-20 scroll-mt-20">
            <h2 className="text-2xl font-bold tracking-tight">Customer reviews</h2>
            <div className="mt-6">
              <ProductReviews handle={handle} />
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

import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/ProductCard";
import { HeroBanner } from "@/components/HeroBanner";
import { getProducts, getProductByHandle } from "@/lib/shopify.functions";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, ShieldCheck, RefreshCcw, Lock } from "lucide-react";
import { StarRating, getReviewStats } from "@/components/ProductReviews";
import type { ShopifyProduct } from "@/lib/shopify";

const HERO_HANDLE = "electric-cordless-heated-ankle-guard-massager-for-right-left-foot-vibration-massage-wristband-ankle-joint-brace-relax-muscles";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Caesar Goods" },
      { name: "description", content: "Shop premium wellness products at Caesar Goods" },
      { property: "og:title", content: "Caesar Goods" },
      { property: "og:description", content: "Shop premium wellness products at Caesar Goods" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async ({ context }) => {
    const [products, heroProduct] = await Promise.all([
      context.queryClient.ensureQueryData({
        queryKey: ["products"],
        queryFn: () => getProducts({ data: { first: 20 } }),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["product", HERO_HANDLE],
        queryFn: () => getProductByHandle({ data: { handle: HERO_HANDLE } }),
      }),
    ]);
    return { products, heroProduct };
  },
  component: Index,
});

import { parseDescription } from "@/lib/sanitizeDescription";

function formatPrice(amount: string, currencyCode: string) {
  return `${currencyCode} ${parseFloat(amount).toFixed(2)}`;
}

function getHeroBullets(description: string) {
  return parseDescription(description).bullets.slice(0, 3);
}

const trustItems = [
  { icon: Truck, label: "Free shipping" },
  { icon: RefreshCcw, label: "30-day returns" },
  { icon: ShieldCheck, label: "1-year warranty" },
  { icon: Lock, label: "Secure checkout" },
];

function HeroProduct({ node }: { node: ShopifyProduct["node"] }) {
  const image = node.images.edges[0]?.node;
  const variant = node.variants.edges[0]?.node;
  const price = variant?.price ?? node.priceRange.minVariantPrice;
  const compareAt = variant?.compareAtPrice;
  const compareAmount = compareAt?.amount ? parseFloat(compareAt.amount) : 0;
  const saleAmount = parseFloat(price.amount);
  const showCompare = compareAmount > saleAmount;
  const savings = showCompare ? Math.round((1 - saleAmount / compareAmount) * 100) : 0;

  const bullets = getHeroBullets(node.description);

  return (
    <section className="px-4 py-8 md:py-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
          <Link
            to="/product/$handle"
            params={{ handle: node.handle }}
            className="group relative order-1 overflow-hidden rounded-2xl border border-border bg-muted/50 lg:order-1"
          >
            {image ? (
              <img
                src={image.url}
                alt={image.altText ?? node.title}
                className="aspect-[4/5] max-h-[320px] w-full object-cover transition-transform duration-500 group-hover:scale-105 md:max-h-[420px] lg:max-h-[460px]"
              />
            ) : (
              <div className="flex aspect-[4/5] max-h-[320px] w-full items-center justify-center text-muted-foreground md:max-h-[420px] lg:max-h-[460px]">
                No image
              </div>
            )}
          </Link>

          <div className="order-2 flex flex-col justify-center lg:order-2">
            <span className="inline-flex w-fit items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
              Featured
            </span>
            <h1 className="mt-3 text-2xl font-semibold leading-[1.15] tracking-tight md:text-4xl lg:text-[2.5rem]">
              {node.title}
            </h1>

            <div className="mt-3 flex items-center gap-2">
              <StarRating rating={getReviewStats(node.handle).average} size="md" />
              <span className="text-sm text-muted-foreground">
                {getReviewStats(node.handle).average.toFixed(1)} ({getReviewStats(node.handle).total} reviews)
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold md:text-3xl">
                  {formatPrice(price.amount, price.currencyCode)}
                </span>
                {showCompare && compareAt && (
                  <span className="text-base text-muted-foreground line-through">
                    {formatPrice(compareAt.amount, compareAt.currencyCode)}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Save {savings}%
                </span>
              )}
            </div>

            {bullets.length > 0 && (
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground md:text-base">
                {bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/product/$handle" params={{ handle: node.handle }}>
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/" hash="products">
                  View All Products
                </Link>
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5 sm:grid-cols-4">
              {trustItems.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon className="h-4 w-4 shrink-0 text-primary" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Index() {
  const { data: products } = useSuspenseQuery({
    queryKey: ["products"],
    queryFn: () => getProducts({ data: { first: 20 } }),
  });
  const { data: heroProduct } = useSuspenseQuery({
    queryKey: ["product", HERO_HANDLE],
    queryFn: () => getProductByHandle({ data: { handle: HERO_HANDLE } }),
  });

  const gridProducts = products?.filter(
    (product) => product.node.handle !== HERO_HANDLE,
  );

  return (
    <main className="min-h-screen">
      <HeroBanner />
      {heroProduct && <HeroProduct node={heroProduct} />}


      <section id="products" className="px-4 pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Featured Products</h2>
          {gridProducts && gridProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {gridProducts.map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground">No products found.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Tell me what product you want to add and I’ll create it in your Shopify store.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

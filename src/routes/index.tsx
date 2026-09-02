import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/ProductCard";
import { getProducts, getProductByHandle } from "@/lib/shopify.functions";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify";

const HERO_HANDLE = "electric-cordless-heated-ankle-guard-massager-for-right-left-foot-vibration-massage-wristband-ankle-joint-brace-relax-muscles";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Caesar Products" },
      { name: "description", content: "Shop premium wellness products at Caesar Products" },
      { property: "og:title", content: "Caesar Products" },
      { property: "og:description", content: "Shop premium wellness products at Caesar Products" },
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

function formatPrice(amount: string, currencyCode: string) {
  return `${currencyCode} ${parseFloat(amount).toFixed(2)}`;
}

function HeroProduct({ product }: { product: ShopifyProduct }) {
  const { node } = product;

  const image = node.images.edges[0]?.node;
  const variant = node.variants.edges[0]?.node;
  const price = variant?.price ?? node.priceRange.minVariantPrice;
  const compareAt = variant?.compareAtPrice;
  const compareAmount = compareAt?.amount ? parseFloat(compareAt.amount) : 0;
  const saleAmount = parseFloat(price.amount);
  const showCompare = compareAmount > saleAmount;


  const bullets = node.description
    .split(/\r?\n|(?<=\.)\s+(?=[A-Z0-9])/)
    .map((line) => line.replace(/^[•\-*\u2022]\s*/, "").trim())
    .filter((line) => line.length > 15 && line.length < 220)
    .slice(0, 4);

  return (
    <section className="px-4 py-12 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <Link
            to="/product/$handle"
            params={{ handle: node.handle }}
            className="group relative order-1 overflow-hidden rounded-2xl bg-muted lg:order-1"
          >
            {image ? (
              <img
                src={image.url}
                alt={image.altText ?? node.title}
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex aspect-[4/3] w-full items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
          </Link>

          <div className="order-2 flex flex-col justify-center lg:order-2">
            <span className="text-sm font-medium text-primary">Featured</span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {node.title}
            </h1>
            <div className="mt-4 flex items-baseline gap-3">
              <p className="text-2xl font-semibold md:text-3xl">
                {formatPrice(price.amount, price.currencyCode)}
              </p>
            {showCompare && compareAt && (
                <p className="text-lg text-muted-foreground line-through">
                  {formatPrice(compareAt.amount, compareAt.currencyCode)}
                </p>
              )}

            </div>

            {bullets.length > 0 && (
              <ul className="mt-6 space-y-2 text-muted-foreground">
                {bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
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
      {heroProduct && <HeroProduct product={heroProduct} />}

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

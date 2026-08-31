import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/shopify.functions";

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
    const products = await context.queryClient.ensureQueryData({
      queryKey: ["products"],
      queryFn: () => getProducts({ data: { first: 20 } }),
    });
    return { products };
  },
  component: Index,
});

function Index() {
  const { data: products } = useSuspenseQuery({
    queryKey: ["products"],
    queryFn: () => getProducts({ data: { first: 20 } }),
  });

  return (
    <main className="min-h-screen">
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Caesar Products
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            Premium wellness and recovery gear designed for everyday comfort.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Featured Products</h2>
          {products && products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
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

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingCart, ArrowLeft } from "lucide-react";
import { getProductByHandle } from "@/lib/shopify.functions";
import { useCartStore } from "@/stores/cartStore";
import type { ShopifyProduct } from "@/lib/shopify";

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

function ProductDetailPage() {
  const { handle } = Route.useParams();
  const { data: product } = useSuspenseQuery({
    queryKey: ["product", handle],
    queryFn: () => getProductByHandle({ data: { handle } }),
  });

  if (!product) return null;

  const variants = product.variants.edges;
  const [selectedVariant, setSelectedVariant] = useState(variants[0]?.node);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.options.forEach((option) => {
      initial[option.name] = option.values[0] ?? "";
    });
    return initial;
  });

  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);

  const updateOption = (name: string, value: string) => {
    const next = { ...selectedOptions, [name]: value };
    setSelectedOptions(next);

    const matched = variants.find((v) =>
      product.options.every((option) => {
        const selected = next[option.name];
        const variantValue = v.node.selectedOptions.find((o) => o.name === option.name)?.value;
        return selected === variantValue;
      }),
    );
    if (matched) setSelectedVariant(matched.node);
  };

  const image = product.images.edges[0]?.node;
  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
    });
  };

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
          <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
            {image ? (
              <img
                src={image.url}
                alt={image.altText ?? product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <Badge variant="secondary" className="w-fit mb-4">
              {product.vendor}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{product.title}</h1>
            <p className="mt-4 text-2xl font-semibold">
              {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
            </p>
            <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

            {product.options.map((option) => (
              <div key={option.name} className="mt-6">
                <h3 className="text-sm font-medium mb-3">{option.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant={selectedOptions[option.name] === value ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateOption(option.name, value)}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>
            ))}

            <Button
              size="lg"
              className="mt-8 w-full md:w-auto"
              disabled={!selectedVariant?.availableForSale || isLoading}
              onClick={handleAddToCart}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ShoppingCart className="mr-2 h-4 w-4" />
              )}
              {selectedVariant?.availableForSale ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

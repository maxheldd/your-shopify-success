import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getProductByHandle } from "@/lib/shopify.functions";
import { Button } from "@/components/ui/button";
import { ArrowRight, Feather, Moon, RefreshCcw, ShieldCheck } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify";

const HERO_HANDLE = "100-mulberry-silk-sleeping-mask-eyepatch-blocking-light-eyemask-eyeshade-for-travel-nap-soft-padded-sleep-mask-slaapmasker";
const HERO_IMAGE = "https://cdn.shopify.com/s/files/1/1017/3969/2349/files/S4d17e9883fd2413d9c94cef9176e54a5T.webp?v=1789490897";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mulberry Silk Sleep Mask | Caesar Goods" },
      { name: "description", content: "A breathable mulberry silk sleep mask with contoured eye cups, full blackout coverage, and an adjustable soft strap." },
      { property: "og:title", content: "Mulberry Silk Sleep Mask | Caesar Goods" },
      { property: "og:description", content: "Gentle on skin and lashes, with pressure-free eye cups and full blackout comfort." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: HERO_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: HERO_IMAGE },
    ],
  }),
  loader: async ({ context }) => {
    const heroProduct = await context.queryClient.ensureQueryData({
      queryKey: ["product", HERO_HANDLE],
      queryFn: () => getProductByHandle({ data: { handle: HERO_HANDLE } }),
    });
    return { heroProduct };
  },
  component: Index,
});

function formatPrice(amount: string, currencyCode: string) {
  return `${currencyCode} ${parseFloat(amount).toFixed(2)}`;
}

const trustItems = [
  { icon: Feather, label: "Mulberry silk" },
  { icon: Moon, label: "Full blackout" },
  { icon: RefreshCcw, label: "30-day returns" },
  { icon: ShieldCheck, label: "Secure checkout" },
];

const heroBullets = [
  "Smooth silk helps reduce friction against delicate facial skin.",
  "Contoured eye cups leave room for your lashes and eyelids.",
  "A soft adjustable strap creates comfortable, full blackout coverage.",
];

function HeroProduct({ node }: { node: ShopifyProduct["node"] }) {
  const image = node.images.edges[0]?.node;
  const variant = node.variants.edges[0]?.node;
  const price = variant?.price ?? node.priceRange.minVariantPrice;

  return (
    <section className="px-4 py-7 md:py-12 lg:py-14">
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
              Nightly skin comfort
            </span>
            <h1 className="mt-3 text-2xl font-semibold leading-[1.15] tracking-tight md:text-4xl lg:text-[2.5rem]">
              Mulberry Silk Anti-Acne Sleep Mask
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              A breathable, pressure-free sleep mask designed to protect your skincare routine while blocking unwanted light.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold md:text-3xl">
                  {formatPrice(price.amount, price.currencyCode)}
                </span>
              </div>
            </div>

              <ul className="mt-5 space-y-2 text-sm text-muted-foreground md:text-base">
                {heroBullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/product/$handle" params={{ handle: node.handle }}>
                  Choose your color
                  <ArrowRight className="h-4 w-4" />
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
  const { data: heroProduct } = useSuspenseQuery({
    queryKey: ["product", HERO_HANDLE],
    queryFn: () => getProductByHandle({ data: { handle: HERO_HANDLE } }),
  });

  return (
    <main className="min-h-screen">
      {heroProduct && <HeroProduct node={heroProduct} />}
    </main>
  );
}

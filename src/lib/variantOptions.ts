import type { ShopifyProductVariant } from "@/lib/shopify";

export interface VariantEntry {
  variant: ShopifyProductVariant;
  key: string[];
}

export interface VariantModel {
  axisNames: string[];
  entries: VariantEntry[];
}

const HEAT_LEVEL_ORDER = [
  "3 Level",
  "4 Level",
  "5 Level",
  "Red Light",
  "6 Level (3-in-1)",
  "Airbag",
];

export function normalizeHeatLevel(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("6 level") || lower.includes("6-level") || lower.includes("3-in-1"))
    return "6 Level (3-in-1)";
  if (lower.includes("red led") || lower.includes("660nm") || lower.includes("red light"))
    return "Red Light";
  if (lower.includes("3 level") || lower.includes("3-level")) return "3 Level";
  if (lower.includes("4 level") || lower.includes("4-level")) return "4 Level";
  if (lower.includes("5 level") || lower.includes("5-level")) return "5 Level";
  if (lower.includes("airbag")) return "Airbag";
  return "Standard";
}

export function deriveStyle(title: string, heatLevel: string): string {
  const lower = title.toLowerCase();

  if (heatLevel === "Red Light") {
    if (lower.includes("ankle")) return "Ankle (40 beads)";
    if (lower.includes("wrist")) return "Wrist (24 beads)";
  }

  if (heatLevel === "6 Level (3-in-1)") {
    if (lower.includes("black")) return "3-in-1 black";
    if (lower.includes("grey") || lower.includes("gray")) return "3-in-1 grey";
    return "3-in-1";
  }

  let style = title
    .replace(/[-\s]?(3|4|5|6)\s?level/gi, "")
    .replace(/[-\s]?660nm\s?red\s?led/gi, "")
    .replace(/[-\s]?red\s?led/gi, "")
    .replace(/[-\s]?3-in-1\s?type/gi, "")
    .replace(/[-\s]?3-in-1/gi, "")
    .replace(/^[\s\-–—]+|[\s\-–—]+$/g, "")
    .trim();

  if (!style) return "Standard";

  return style
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function looksLikeHeatCatalog(values: string[]): boolean {
  const matches = values.filter((value) => normalizeHeatLevel(value) !== "Standard");
  return values.length > 3 && matches.length >= Math.ceil(values.length / 2);
}

function sortStyles(a: string, b: string): number {
  const order = ["ankle", "wrist", "neck", "3-in-1"];
  const indexA = order.findIndex((k) => a.toLowerCase().includes(k));
  const indexB = order.findIndex((k) => b.toLowerCase().includes(k));
  if (indexA !== -1 && indexB !== -1) return indexA - indexB;
  if (indexA !== -1) return -1;
  if (indexB !== -1) return 1;
  return a.localeCompare(b);
}

/**
 * Builds a cascading option model for any Shopify product.
 * - Multi-option products use their real Shopify options as axes.
 * - Single-option products whose values encode a heat level (e.g. "Grey Ankle-5 level")
 *   are split into "Heat level" + "Style" axes.
 * - Everything else falls back to a single dropdown using the option's own name.
 */
export function buildVariantModel(
  variants: ShopifyProductVariant[],
  options: Array<{ name: string; values: string[] }>,
): VariantModel {
  const usableOptions = options.filter(
    (option) => option.values.length > 1 || option.values[0]?.toLowerCase() !== "default title",
  );

  if (usableOptions.length >= 2) {
    return {
      axisNames: usableOptions.map((option) => option.name),
      entries: variants.map((variant) => ({
        variant,
        key: usableOptions.map(
          (option) =>
            variant.selectedOptions.find((selected) => selected.name === option.name)?.value ?? "",
        ),
      })),
    };
  }

  const single = usableOptions[0];

  if (single && looksLikeHeatCatalog(single.values)) {
    return {
      axisNames: ["Heat level", "Style"],
      entries: variants.map((variant) => {
        const heatLevel = normalizeHeatLevel(variant.title);
        return { variant, key: [heatLevel, deriveStyle(variant.title, heatLevel)] };
      }),
    };
  }

  if (single) {
    return {
      axisNames: [single.name],
      entries: variants.map((variant) => ({
        variant,
        key: [
          variant.selectedOptions.find((selected) => selected.name === single.name)?.value ??
            variant.title,
        ],
      })),
    };
  }

  return { axisNames: [], entries: variants.map((variant) => ({ variant, key: [] })) };
}

/** Values available on `axisIndex` given the already-selected values before it. */
export function valuesForAxis(
  model: VariantModel,
  axisIndex: number,
  selection: string[],
): string[] {
  const seen = new Set<string>();
  for (const entry of model.entries) {
    const matchesPrefix = selection
      .slice(0, axisIndex)
      .every((value, index) => !value || entry.key[index] === value);
    if (matchesPrefix && entry.key[axisIndex]) seen.add(entry.key[axisIndex]);
  }

  const values = Array.from(seen);

  if (model.axisNames[axisIndex] === "Heat level") {
    return HEAT_LEVEL_ORDER.filter((level) => values.includes(level)).concat(
      values.filter((value) => !HEAT_LEVEL_ORDER.includes(value)),
    );
  }
  if (model.axisNames[axisIndex] === "Style") return values.sort(sortStyles);
  return values;
}

export function findVariant(
  model: VariantModel,
  selection: string[],
): ShopifyProductVariant | null {
  if (model.axisNames.length === 0) return model.entries[0]?.variant ?? null;
  const match = model.entries.find((entry) =>
    entry.key.every((value, index) => value === selection[index]),
  );
  return match?.variant ?? null;
}

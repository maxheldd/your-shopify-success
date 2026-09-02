/**
 * Cleans raw Shopify product descriptions for display:
 *  - replaces any China / Mainland China origin mention with the United States
 *  - removes marketplace boilerplate and shop chatter
 *  - normalises spacing and run-together spec dumps so text is readable
 */

const BOILERPLATE = [
  /Welcome to our shop[.!]?/gi,
  /Dear (friends|customers?)\s*:?/gi,
  /When you place an order,? please note the following points!?/gi,
  /Transport\s*:\s*Sent within 24 hours\.?/gi,
];

/** Break run-together spec dumps and sentences into readable lines. */
function splitLines(text: string): string[] {
  return text
    // ALLCAPSHeading -> newline before the CamelCase word
    .replace(/([A-Z]{3,})(?=[A-Z][a-z])/g, "$1\n")
    // country-of-origin code label stuck to the previous word
    .replace(/([A-Za-z])(?=CN\s*:)/g, "$1\n")
    // "…valueNext Label:" -> newline before the next label
    .replace(/([a-z0-9)\]%°"\u2103\u00b0])(?=[A-Z][a-z][A-Za-z /&+-]{0,27}\s*:)/g, "$1\n")
    // numbered feature lists onto their own lines (incl. "…done.2. Next")
    .replace(/([.!?])\s*(\d{1,2}\.)\s*(?=[A-Z])/g, "$1\n$2 ")
    .replace(/\s(\d{1,2}\.)\s*(?=[A-Z])/g, "\n$1 ")
    // one sentence per line
    .replace(/([.!?])\s+(?=[A-Z])/g, "$1\n")
    // rejoin unit fragments split by the source data ("1800m" + "Ah")
    .replace(/\n(Ah|mAh|V|W|A)\b/g, "$1")
    .replace(/\r?\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]{2,}/g, " ").trim())
    .filter(Boolean);
}

/** Replace China wording in a short free-text value (option values, titles). */
export function sanitizeOriginText(value: string): string {
  if (!value) return value;
  return value
    .replace(/\b(mainland\s+china|china\s+mainland|chinese\s+mainland)\b/gi, "United States")
    .replace(/\bmade in china\b/gi, "Made in the USA")
    .replace(/\bchinese\b/gi, "American")
    .replace(/\bchina\b/gi, "United States");
}

function fixOrigin(line: string): string | null {
  if (/^CN\s*:/i.test(line)) return null;
  if (/^Origin\s*:/i.test(line)) return "Origin: United States";
  return sanitizeOriginText(line);
}

export function sanitizeDescription(description: string | null | undefined): string {
  if (!description) return "";

  let text = description;
  for (const pattern of BOILERPLATE) text = text.replace(pattern, " ");

  const lines = splitLines(text)
    .map(fixOrigin)
    .filter((line): line is string => Boolean(line))
    // drop stray marketplace item numbers
    .filter((line) => !/^\d{3,}$/.test(line))
    .map((line) => line.replace(/\s+\d{4,}$/, ""))
    // tidy "Label:value" -> "Label: value"
    .map((line) => line.replace(/^([A-Za-z][A-Za-z /&+-]{1,28}):\s*/, "$1: ").trim())
    .filter(Boolean);

  return lines.join("\n");
}

export function mentionsChina(text: string | null | undefined): boolean {
  return /\bchina\b|\bchinese\b/i.test(text ?? "");
}

export interface DescriptionSpec {
  label: string;
  value: string;
}

/** Spec labels that are marketplace noise rather than useful product info. */
const NOISE_LABELS = [
  "high-concerned chemical",
  "choice",
  "cn",
  "brand name",
  "model number",
  "item type",
  "is batteries included",
  "electronic",
  "hand instrument",
  "pattern type",
  "is it a soft shell",
  "age",
  "specifications",
  "packing list",
  "package list",
  "package",
  "note",
];

const LABEL_ALIASES: Record<string, string> = {
  origin: "Origin",
  material: "Material",
  color: "Color",
  colour: "Color",
  "product colour": "Color",
  size: "Size",
  gender: "Gender",
  certification: "Certification",
  voltage: "Voltage",
  "rated power": "Power",
  "battery capacity": "Battery",
  battery: "Battery",
  "charging time": "Charge time",
  "insole height": "Insole height",
  application: "Use",
  "power supply": "Power supply",
};

/**
 * Splits a cleaned description into readable prose bullets and a tidy spec list.
 */
export function parseDescription(description: string | null | undefined): {
  bullets: string[];
  specs: DescriptionSpec[];
} {
  const text = sanitizeDescription(description);
  if (!text) return { bullets: [], specs: [] };

  const bullets: string[] = [];
  const specs: DescriptionSpec[] = [];
  const seen = new Set<string>();

  for (const rawLine of text.split("\n")) {
    const line = rawLine.replace(/^[•\-*\u2022]\s*/, "").trim();
    if (!line) continue;

    const match = line.match(/^([A-Za-z][A-Za-z0-9 /&+-]{1,28}):\s*(.+)$/);
    if (match && (match[2] ?? "").length <= 80) {
      const label = (match[1] ?? "").trim();
      const value = (match[2] ?? "").trim().replace(/[,;]\s*$/, "");
      const key = label.toLowerCase();
      if (NOISE_LABELS.includes(key)) continue;
      if (!value || value.toLowerCase() === "none" || value.toLowerCase() === "no") continue;
      const pretty = LABEL_ALIASES[key] ?? label.charAt(0).toUpperCase() + label.slice(1);
      if (seen.has(pretty)) continue;
      seen.add(pretty);
      specs.push({ label: pretty, value });
      continue;
    }

    const prose = line.replace(/^\d{1,2}\.\s*/, "").trim();
    if (prose.length > 30 && prose.length < 260 && /\s/.test(prose) && !/^[A-Z\s]+$/.test(prose)) {
      bullets.push(prose);
    }
  }

  return { bullets: bullets.slice(0, 5), specs: specs.slice(0, 8) };
}

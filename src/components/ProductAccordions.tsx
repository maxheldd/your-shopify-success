import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Spec {
  label: string;
  value: string;
}

interface ProductAccordionsProps {
  specs: Spec[];
  bullets?: string[];
  included?: string[];
}

const DEFAULT_BULLETS = [
  "Combines targeted heat with gentle vibration to soothe stiff joints and tired muscles.",
  "Adjustable wrap fits ankles, wrists, or neck depending on the style you choose.",
  "Cordless, rechargeable design — use it on the couch, at your desk, or while traveling.",
  "Built-in auto shut-off and overheat protection for safe daily sessions.",
];

const DEFAULT_INCLUDED = [
  "1 × Product in the option you selected",
  "1 × Type-C charging cable",
  "1 × Instruction manual (English)",
  "1 × Retail box",
];

export function ProductAccordions({ specs, bullets, included }: ProductAccordionsProps) {
  const descriptionBullets = bullets?.length ? bullets : DEFAULT_BULLETS;
  const includedItems = included?.length ? included : DEFAULT_INCLUDED;

  return (
    <Accordion type="multiple" defaultValue={["description"]} className="w-full">
      <AccordionItem value="description">
        <AccordionTrigger>Description</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 pb-2">
            <ul className="list-disc space-y-1.5 pl-4 text-sm text-muted-foreground">
              {descriptionBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>

            {specs.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border bg-card p-4 text-sm">
                {specs.map((spec) => (
                  <div key={spec.label}>
                    <dt className="text-muted-foreground">{spec.label}</dt>
                    <dd className="mt-0.5 font-medium">{spec.value}</dd>
                  </div>
                ))}
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="included">
        <AccordionTrigger>What&apos;s included</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc space-y-1.5 pl-4 text-sm text-muted-foreground">
            {includedItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>


      <AccordionItem value="materials">
        <AccordionTrigger>Materials and care</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc space-y-1.5 pl-4 text-sm text-muted-foreground">
            <li>Outer layer: windproof neoprene and diving fabric</li>
            <li>Lining: breathable OK-cloth with non-slip inner surface</li>
            <li>Unisex and ambidextrous — fits left or right</li>
            <li>Wipe clean only; do not machine wash or submerge</li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="shipping">
        <AccordionTrigger>Shipping and returns</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc space-y-1.5 pl-4 text-sm text-muted-foreground">
            <li>Free standard shipping on every order</li>
            <li>Orders processed within 1–3 business days</li>
            <li>Delivery typically takes 10–20 business days</li>
            <li>Tracking updates emailed 5–7 days after shipment</li>
            <li>30-day hassle-free returns</li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="safety">
        <AccordionTrigger>Before you use it</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc space-y-1.5 pl-4 text-sm text-muted-foreground">
            <li>The device will not power on while charging.</li>
            <li>If plugged in during a session, it will shut off automatically.</li>
            <li>CE, FCC, and RoHS certified for safe home use.</li>
            <li>Consult a physician before use if you have a pacemaker, diabetes, or circulatory condition.</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

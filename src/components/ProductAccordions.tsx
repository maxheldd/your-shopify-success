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
  "360-degree U-shaped support keeps your head from tipping forward or sideways.",
  "Soft memory-style filling holds its shape through long flights, commutes, and desk naps.",
  "Removable, washable cover with a snap closure so it stays put around your neck.",
  "Light and packable — clip it to a bag or squeeze it into carry-on luggage.",
];

const DEFAULT_INCLUDED = [
  "1 × Travel neck pillow in the option you selected",
  "1 × Removable cover",
  "1 × Carry pouch",
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
            <li>Cover: soft skin-friendly fabric, removable</li>
            <li>Filling: resilient high-rebound fibre that bounces back after packing</li>
            <li>Unisex one-size fit with adjustable front closure</li>
            <li>Hand or gentle machine wash the cover; air dry only</li>
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
            <li>Fluff the pillow after unpacking — it may arrive compressed.</li>
            <li>Wear the opening at the front so the raised sides support your chin.</li>
            <li>Keep away from open flame and direct heat sources.</li>
            <li>Not a medical device; consult a physician for ongoing neck pain.</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

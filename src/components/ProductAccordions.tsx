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
  "Smooth mulberry silk creates less friction against delicate facial skin than ordinary cotton.",
  "Contoured eye cups sit away from your eyelids and lashes for pressure-free comfort.",
  "Full blackout coverage helps create a darker sleep environment at home or while travelling.",
  "The soft adjustable strap gives a secure fit without pinching behind your ears.",
];

const DEFAULT_INCLUDED = [
  "1 × Mulberry silk sleep mask in your selected color",
  "1 × Adjustable soft elastic strap",
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
            <li>Skin-facing surface: smooth, breathable mulberry silk</li>
            <li>Lightweight padded construction with contoured eye cups</li>
            <li>Hand wash gently in cool water with a silk-safe detergent</li>
            <li>Lay flat to air dry; do not bleach, tumble dry, or iron directly</li>
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
            <li>Adjust the strap until the mask sits securely without pressing on your eyes.</li>
            <li>Clean before first use and keep the skin-facing surface dry between washes.</li>
            <li>Stop using the mask if irritation occurs.</li>
            <li>This is a sleep accessory, not a treatment or medical device for acne.</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

import { createMetadata } from "@/lib/seo";
import { QuoteForm } from "@/components/quote/QuoteForm";
import { PageHero } from "@/components/templates/PageHero";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WHATSAPP_SURVEY_HREF } from "@/lib/constants";

export const metadata = createMetadata({
  title: "Get a Quote",
  description:
    "Request a fixed quotation for your South West London or Surrey move. Multi-step form or WhatsApp walkthrough video.",
  path: "/quote",
});

export default function QuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Fixed quotations"
        title="Request your quote"
        description="Prepare your move details below, then send your request through WhatsApp. You can also send a recorded walkthrough."
      />
      <Section className="!pt-0 -mt-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="!shadow-[var(--shadow-card)]">
              <QuoteForm />
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <h3 className="font-display text-lg font-semibold text-charcoal mb-3">
                Prefer WhatsApp?
              </h3>
              <p className="text-sm text-charcoal-light mb-4">
                Record a walkthrough of your rooms and access, then send it for
                assessment and a fixed quotation for the agreed work.
              </p>
              <Button
                href={WHATSAPP_SURVEY_HREF}
                variant="whatsapp"
                className="w-full"
                external
              >
                <MessageCircle className="w-5 h-5" />
                Send Walkthrough
              </Button>
            </Card>
            <Card>
              <h3 className="font-display text-lg font-semibold text-charcoal mb-3">
                What happens next
              </h3>
              <ol className="space-y-3 text-sm text-charcoal-light">
                <li className="flex gap-3">
                  <span className="font-semibold text-green-800">1.</span>
                  We review your details or video
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-green-800">2.</span>
                  You receive a fixed quotation
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-green-800">3.</span>
                  Confirm your date and we handle the rest
                </li>
              </ol>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}

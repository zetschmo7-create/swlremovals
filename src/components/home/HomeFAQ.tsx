import { HOME_FAQS } from "@/lib/constants";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FAQ } from "@/components/ui/FAQ";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { FadeIn } from "@/components/ui/FadeIn";

export function HomeFAQ() {
  return (
    <Section id="faq">
      <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
        <div className="lg:col-span-2">
          <SectionHeader
            eyebrow="FAQ"
            title="Common questions"
            description="Straight answers about quotations, insurance, packing and booking your move."
          />
          <FadeIn delay={0.1}>
            <p className="text-sm text-charcoal-light mb-6">
              Still unsure? Send a WhatsApp walkthrough or call our team. We
              respond quickly.
            </p>
            <QuoteButton>Get My Quote</QuoteButton>
          </FadeIn>
        </div>
        <div className="lg:col-span-3">
          <FAQ items={[...HOME_FAQS]} />
        </div>
      </div>
    </Section>
  );
}

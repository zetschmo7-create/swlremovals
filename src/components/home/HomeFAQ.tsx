import { HOME_FAQS } from "@/lib/constants";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FAQ } from "@/components/ui/FAQ";
import { JsonLd } from "@/components/seo/JsonLd";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { FadeIn } from "@/components/ui/FadeIn";

export function HomeFAQ() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <Section id="faq">
      <JsonLd data={faqSchema} />
      <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
        <div className="lg:col-span-2">
          <SectionHeader
            eyebrow="FAQ"
            title="Common questions"
            description="Straight answers about quotations, insurance, packing and booking your move."
          />
          <FadeIn delay={0.1}>
            <p className="text-sm text-charcoal-light mb-6">
              Still unsure? Send a WhatsApp walkthrough or call our team — we
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

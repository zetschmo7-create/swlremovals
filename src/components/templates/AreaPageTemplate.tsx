import Link from "next/link";
import { type AreaData } from "@/lib/areas";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FAQ } from "@/components/ui/FAQ";
import { Button } from "@/components/ui/Button";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";
import { CTABanner } from "@/components/home/CTABanner";
import {
  WHATSAPP_SURVEY_HREF,
  WHY_CHOOSE_US,
} from "@/lib/constants";
import { MapPin, MessageCircle, ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  createBreadcrumbSchema,
  createFaqSchema,
  createServiceSchema,
  organizationReference,
} from "@/lib/schema";

type Props = {
  area: AreaData;
};

export function AreaPageTemplate({ area }: Props) {
  const areaPath = `/areas/${area.slug}`;

  const serviceSchema = {
    ...createServiceSchema({
      name: area.title,
      description: area.description,
      path: areaPath,
      areaServed: area.name,
    }),
    provider: organizationReference(),
  };

  const faqSchema = createFaqSchema(area.faqs);

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Areas", path: "/areas" },
    { name: area.title, path: areaPath },
  ]);

  return (
    <>
      <JsonLd data={[serviceSchema, faqSchema, breadcrumbSchema]} />

      <section className="relative bg-green-900 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-green-950 to-green-800" />
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-green-500 text-sm font-medium tracking-widest uppercase mb-4">
              Local removals
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-tight max-w-3xl">
              {area.title}
            </h1>
            <p className="mt-6 text-lg text-white/70 max-w-2xl leading-relaxed">
              {area.description}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <QuoteButton size="lg" variant="secondary">
                Get Fixed Quote
              </QuoteButton>
              <Button
                href={WHATSAPP_SURVEY_HREF}
                variant="whatsapp"
                size="lg"
                external
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Survey
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <Section>
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <FadeIn>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-6">
                Premium removals in {area.name}
              </h2>
              <p className="text-lg text-charcoal-light leading-relaxed mb-8">
                {area.intro}
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h3 className="font-display text-xl font-semibold text-charcoal mb-4">
                Landmarks & areas we know well
              </h3>
              <div className="flex flex-wrap gap-2 mb-10">
                {area.landmarks.map((landmark) => (
                  <span
                    key={landmark}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-800/5 text-sm text-green-800"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {landmark}
                  </span>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <h3 className="font-display text-xl font-semibold text-charcoal mb-4">
                Neighbourhoods
              </h3>
              <ul className="grid sm:grid-cols-2 gap-3 mb-10">
                {area.neighbourhoods.map((n) => (
                  <li
                    key={n}
                    className="flex items-center gap-2 text-charcoal-light"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-700" />
                    {n}
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>

          <div>
            <FadeIn delay={0.1}>
              <Card className="sticky top-28">
                <h3 className="font-display text-lg font-semibold text-charcoal mb-4">
                  Quick quote
                </h3>
                <p className="text-sm text-charcoal-light mb-6">
                  Send a WhatsApp walkthrough for a fixed quotation, or complete
                  our online form.
                </p>
                <div className="space-y-3">
                  <QuoteButton className="w-full">
                    Online Quote Form
                  </QuoteButton>
                  <Button
                    href={WHATSAPP_SURVEY_HREF}
                    variant="whatsapp"
                    className="w-full"
                    external
                  >
                    WhatsApp Survey
                  </Button>
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs font-medium tracking-widest uppercase text-charcoal-muted mb-3">
                    Nearby areas
                  </p>
                  <div className="space-y-2">
                    {area.nearbyAreas.map((nearby) => (
                      <Link
                        key={nearby.slug}
                        href={`/areas/${nearby.slug}`}
                        className="flex items-center justify-between text-sm text-charcoal-light hover:text-green-800 transition-colors"
                      >
                        {nearby.name} removals
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/areas-covered"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-green-800 hover:text-green-900"
                  >
                    View all 100+ locations
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            </FadeIn>
          </div>
        </div>
      </Section>

      <Section className="gradient-premium">
        <SectionHeader
          eyebrow="Why choose us"
          title={`Trusted ${area.name} removals`}
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WHY_CHOOSE_US.slice(0, 3).map((item) => (
            <div key={item.title}>
              <h3 className="font-display text-lg font-semibold text-charcoal mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-charcoal-light leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="FAQ"
          title={`${area.name} removals — common questions`}
        />
        <div className="max-w-3xl">
          <FAQ items={area.faqs} />
        </div>
      </Section>

      <CTABanner />
    </>
  );
}

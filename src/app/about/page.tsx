import { createMetadata } from "@/lib/seo";
import { PageHero } from "@/components/templates/PageHero";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { CTABanner } from "@/components/home/CTABanner";
import { TRUST_STATS } from "@/lib/constants";
import { QuoteButton } from "@/components/quote/QuoteButton";

export const metadata = createMetadata({
  title: "About Us",
  description:
    "South West London Removals — premium home and office removals with fixed quotations, trained crews, and deep local expertise since 2009.",
  path: "/about",
});

const VALUES = [
  {
    title: "Operational excellence",
    description:
      "Every move is planned, inventoried, and executed with the same attention to detail — whether it is a studio flat or a five-bedroom family home.",
  },
  {
    title: "Honest pricing",
    description:
      "Fixed quotations with no hidden extras. You know the cost before moving day and we honour it.",
  },
  {
    title: "Local knowledge",
    description:
      "Our crews know South West London and Surrey intimately — parking, access, building management, and the expectations of local homeowners.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="A premium removals service built on trust and operational discipline."
        description={`Over ${TRUST_STATS.yearsExperience} years moving families and businesses across South West London, Surrey, and beyond.`}
      >
        <QuoteButton size="lg" variant="secondary">
          Get a Quote
        </QuoteButton>
      </PageHero>

      <Section>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <FadeIn>
            <h2 className="font-display text-3xl font-semibold text-charcoal mb-6">
              More than a van and two people.
            </h2>
            <div className="space-y-4 text-lg text-charcoal-light leading-relaxed">
              <p>
                South West London Removals was founded on a simple principle:
                moving a home is one of the most stressful experiences people
                face, and it deserves a service that treats it with the
                seriousness it requires.
              </p>
              <p>
                We are not the cheapest option. We are the option for
                homeowners who want their belongings handled properly, their
                quotation honoured, and their moving day managed calmly by
                experienced professionals.
              </p>
              <p>
                From Wimbledon to Richmond, Kingston to Surrey, our crews arrive
                prepared — floor protection laid, furniture wrapping ready, and
                a clear plan for the day ahead.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-green-900 to-green-700 flex items-end p-8">
              <div>
                <p className="font-display text-5xl font-semibold text-white">
                  {TRUST_STATS.yearsExperience}+
                </p>
                <p className="text-white/60 mt-2">Years serving South West London</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>

      <Section className="gradient-premium">
        <SectionHeader
          eyebrow="Our values"
          title="What drives every move we handle"
        />
        <div className="grid md:grid-cols-3 gap-8">
          {VALUES.map((value, i) => (
            <FadeIn key={value.title} delay={i * 0.1}>
              <h3 className="font-display text-xl font-semibold text-charcoal mb-3">
                {value.title}
              </h3>
              <p className="text-charcoal-light leading-relaxed">
                {value.description}
              </p>
            </FadeIn>
          ))}
        </div>
      </Section>

      <CTABanner />
    </>
  );
}

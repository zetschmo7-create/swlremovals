import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { PageHero } from "@/components/templates/PageHero";
import { Section } from "@/components/ui/Section";
import { SERVICE_LINKS } from "@/lib/constants";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";
import { CTABanner } from "@/components/home/CTABanner";
import { ArrowRight } from "lucide-react";
import { QuoteButton } from "@/components/quote/QuoteButton";

export const metadata = createMetadata({
  title: "Removals Services",
  description:
    "Premium house removals, office relocations, packing, and storage across South West London and Surrey.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Complete removals support for homes and businesses."
        description="From careful packing to secure storage — every service delivered with the same operational standards."
      >
        <QuoteButton size="lg" variant="secondary">
          Get a Quote
        </QuoteButton>
      </PageHero>

      <Section className="!pt-0 -mt-8">
        <div className="grid md:grid-cols-2 gap-6">
          {SERVICE_LINKS.map((service, i) => (
            <FadeIn key={service.title} delay={i * 0.08}>
              <Link href={service.href}>
                <Card className="h-full group">
                  <h2 className="font-display text-2xl font-semibold text-charcoal mb-3 group-hover:text-green-800 transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-charcoal-light leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-green-800">
                    View service
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Card>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Section>

      <CTABanner />
    </>
  );
}

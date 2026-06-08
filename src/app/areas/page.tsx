import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { PageHero } from "@/components/templates/PageHero";
import { Section } from "@/components/ui/Section";
import { AREAS } from "@/lib/areas";
import { FadeIn } from "@/components/ui/FadeIn";
import { CTABanner } from "@/components/home/CTABanner";
import { MapPin, ArrowRight } from "lucide-react";

export const metadata = createMetadata({
  title: "Areas We Cover",
  description:
    "Premium removals across Wimbledon, Richmond, Kingston, Clapham, Fulham, Wandsworth, Epsom, Surrey and surrounding areas.",
  path: "/areas",
  keywords: [
    "Wimbledon removals",
    "Richmond removals",
    "Kingston removals",
    "Surrey removals",
  ],
});

export default function AreasPage() {
  return (
    <>
      <PageHero
        eyebrow="Coverage"
        title="Areas we cover"
        description="Deep local knowledge across South West London, Surrey, and the surrounding affluent areas we serve daily."
      />

      <Section className="!pt-0 -mt-8">
        <div className="grid md:grid-cols-2 gap-6">
          {AREAS.map((area, i) => (
            <FadeIn key={area.slug} delay={i * 0.06}>
              <Link
                href={`/areas/${area.slug}`}
                className="group block p-8 rounded-2xl border border-border bg-white hover:border-green-700/30 hover:shadow-[var(--shadow-card)] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-green-700" />
                    <h2 className="font-display text-2xl font-semibold text-charcoal group-hover:text-green-800 transition-colors">
                      {area.name}
                    </h2>
                  </div>
                  <ArrowRight className="w-5 h-5 text-charcoal-muted group-hover:text-green-800 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-charcoal-light leading-relaxed mb-4">
                  {area.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {area.neighbourhoods.slice(0, 4).map((n) => (
                    <span
                      key={n}
                      className="text-xs px-2.5 py-1 rounded-full bg-cream text-charcoal-muted"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Section>

      <CTABanner />
    </>
  );
}

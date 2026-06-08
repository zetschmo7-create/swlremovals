import Link from "next/link";
import { getLocationPage } from "@/data/locationPages";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

const FEATURED_SLUGS = [
  "wimbledon-removals",
  "richmond-removals",
  "kingston-upon-thames-removals",
  "chelsea-removals",
  "clapham-removals",
  "guildford-removals",
  "epsom-removals",
  "woking-removals",
] as const;

const FEATURED_AREAS = FEATURED_SLUGS.map((slug) => getLocationPage(slug)).filter(
  (area): area is NonNullable<typeof area> => area !== undefined
);

export function AreasPreview() {
  return (
    <Section className="!py-16 md:!py-24 border-t border-border/60">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14 md:mb-16">
        <SectionHeader
          eyebrow="Local coverage"
          title="Areas we cover across South West London & Surrey."
          description="Local knowledge for parking, access and borough-specific moves."
          className="!mb-0 max-w-2xl"
        />
        <Button
          href="/areas-covered"
          variant="ghost"
          className="shrink-0 self-start border border-border"
        >
          View all locations
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {FEATURED_AREAS.map((area, i) => (
          <FadeIn key={area.slug} delay={i * 0.04}>
            <Link
              href={`/${area.slug}`}
              className="group flex flex-col justify-between min-h-[140px] p-7 md:p-8 rounded-2xl border border-border bg-white hover:border-green-700/25 hover:shadow-[var(--shadow-soft)] transition-all duration-300"
            >
              <div>
                <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-green-700 mb-3">
                  {area.postcodes[0]}
                </p>
                <h3 className="font-display text-2xl font-semibold text-charcoal tracking-tight group-hover:text-green-800 transition-colors">
                  {area.locationName}
                </h3>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-sm text-charcoal-muted group-hover:text-green-800 transition-colors">
                Area guide
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}

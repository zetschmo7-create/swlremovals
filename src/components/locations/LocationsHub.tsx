import Link from "next/link";
import Image from "next/image";
import {
  AREAS_COVERED_PATH,
  getGroupedLocations,
  getHubDescriptor,
} from "@/data/locationRegions";
import { locationPath } from "@/data/locationPages";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { CTABanner } from "@/components/home/CTABanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { IMAGES } from "@/lib/images";
import { ChevronRight, ArrowRight } from "lucide-react";

const groupedLocations = getGroupedLocations();
const allLocations = groupedLocations.flatMap((group) => group.locations);

export function LocationsHub() {
  const pageUrl = `${SITE_URL}${AREAS_COVERED_PATH}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Areas covered",
        item: pageUrl,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Areas we cover across South West London and Surrey",
    description:
      "Premium removals locations across South West London, Central London, Surrey and commuter towns.",
    url: pageUrl,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: allLocations.length,
      itemListElement: allLocations.map((location, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${location.locationName} removals`,
        url: `${SITE_URL}${locationPath(location.slug)}`,
      })),
    },
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema, collectionSchema]} />

      <section className="relative min-h-[52vh] md:min-h-[58vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={IMAGES.banner}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-950/95 via-green-950/70 to-green-900/40" />
        </div>

        <div className="relative z-10 w-full mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-32 md:pt-40 pb-16 md:pb-20">
          <FadeIn>
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/55">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <ChevronRight className="w-3.5 h-3.5" aria-hidden />
                <li className="text-white/90">Areas covered</li>
              </ol>
            </nav>

            <p className="text-green-400 text-sm font-medium tracking-[0.2em] uppercase mb-4">
              Service coverage
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.05] max-w-4xl">
              Areas we cover across South West London &amp; Surrey
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
              {allLocations.length} locations with local knowledge for parking,
              access and careful handling. Select your area for routes, property
              types and fixed-quote guidance.
            </p>
            <div className="mt-8">
              <QuoteButton size="lg" variant="secondary">
                Get My Quote
              </QuoteButton>
            </div>
          </FadeIn>
        </div>
      </section>

      <Section className="!py-16 md:!py-20 border-b border-border/60">
        <FadeIn>
          <p className="text-center text-base md:text-lg text-charcoal-light max-w-3xl mx-auto leading-relaxed">
            Every location below links to a dedicated removals guide with local
            roads, postcodes, nearby areas and move types we handle every week.
          </p>
        </FadeIn>
      </Section>

      {groupedLocations.map((group, groupIndex) => (
        <Section
          key={group.region.id}
          id={group.region.id}
          className={`!py-16 md:!py-24 ${groupIndex % 2 === 1 ? "bg-cream/50" : ""}`}
        >
          <FadeIn>
            <div className="max-w-3xl mb-12 md:mb-16">
              <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-green-700 mb-3">
                {group.locations.length} locations
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-charcoal tracking-tight">
                {group.region.title}
              </h2>
              <p className="mt-4 text-lg text-charcoal-light leading-relaxed">
                {group.region.intro}
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {group.locations.map((location, i) => (
              <FadeIn key={location.slug} delay={i * 0.02}>
                <Link
                  href={locationPath(location.slug)}
                  className="group flex h-full flex-col justify-between p-8 md:p-10 rounded-2xl border border-border bg-white hover:border-green-700/25 hover:shadow-[var(--shadow-soft)] transition-all duration-300"
                >
                  <div>
                    <p className="text-[11px] font-medium tracking-[0.16em] uppercase text-green-700 mb-3">
                      {location.postcodes.join(" · ")}
                    </p>
                    <h3 className="font-display text-2xl md:text-[1.65rem] font-semibold text-charcoal tracking-tight group-hover:text-green-800 transition-colors">
                      {location.locationName}
                    </h3>
                    <p className="mt-3 text-sm md:text-base text-charcoal-light leading-relaxed">
                      {getHubDescriptor(location)}
                    </p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-green-800">
                    View area guide
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </Section>
      ))}

      <Section className="!py-14 md:!py-16 border-t border-border/60">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 rounded-2xl border border-border bg-white px-8 py-8 md:px-10 md:py-10">
            <div>
              <p className="font-display text-xl md:text-2xl font-semibold text-charcoal tracking-tight">
                Need a move between two locations?
              </p>
              <p className="mt-2 text-charcoal-light">
                Cross-area routes are quoted fixed after a quick survey or
                WhatsApp walkthrough.
              </p>
            </div>
            <QuoteButton size="lg" className="shrink-0 self-start">
              Request a fixed quote
            </QuoteButton>
          </div>
        </FadeIn>
      </Section>

      <CTABanner />
    </>
  );
}

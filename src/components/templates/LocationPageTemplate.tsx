import Link from "next/link";
import {
  type LocationPageData,
  locationPath,
} from "@/data/locationPages";
import { AREAS_COVERED_PATH } from "@/data/locationRegions";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FAQ } from "@/components/ui/FAQ";
import { Button } from "@/components/ui/Button";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { QuoteAwareLink } from "@/components/quote/QuoteAwareLink";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";
import { CTABanner } from "@/components/home/CTABanner";
import { PageHero } from "@/components/templates/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  SITE_NAME,
  SITE_URL,
  PHONE,
  EMAIL,
  WHATSAPP_SURVEY_HREF,
  TRUST_STATS,
} from "@/lib/constants";
import {
  MapPin,
  MessageCircle,
  ArrowRight,
  Home,
  Truck,
  ParkingCircle,
  Route,
  Quote,
  ChevronRight,
} from "lucide-react";

type Props = {
  location: LocationPageData;
};

export function LocationPageTemplate({ location }: Props) {
  const pageUrl = `${SITE_URL}${locationPath(location.slug)}`;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    name: SITE_NAME,
    url: SITE_URL,
    telephone: PHONE,
    email: EMAIL,
    description: location.metaDescription,
    areaServed: {
      "@type": "Place",
      name: location.locationName,
      address: {
        "@type": "PostalAddress",
        addressLocality: location.locationName,
        addressRegion: location.postcodes.some((p) => p.startsWith("GU"))
          ? "Surrey"
          : "London",
        postalCode: location.postcodes[0],
        addressCountry: "GB",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: TRUST_STATS.googleRating,
      reviewCount: TRUST_STATS.reviewCount,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: location.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

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
        item: `${SITE_URL}${AREAS_COVERED_PATH}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${location.locationName} removals`,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={[localBusinessSchema, faqSchema, breadcrumbSchema]} />

      <PageHero
        eyebrow={`${location.locationName} · ${location.postcodes.join(", ")}`}
        title={location.h1}
        description={location.intro.slice(0, 200) + "…"}
      >
        <div className="flex flex-col sm:flex-row gap-3">
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
      </PageHero>

      <nav
        aria-label="Breadcrumb"
        className="border-b border-border bg-cream"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-3">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-charcoal-muted">
            <li>
              <Link href="/" className="hover:text-green-800 transition-colors">
                Home
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden />
            <li>
              <Link
                href={AREAS_COVERED_PATH}
                className="hover:text-green-800 transition-colors"
              >
                Areas covered
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden />
            <li className="text-charcoal font-medium">
              {location.locationName} removals
            </li>
          </ol>
        </div>
      </nav>

      <Section>
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
          <div className="lg:col-span-2 space-y-14">
            <FadeIn>
              <div>
                <SectionHeader
                  eyebrow="Local knowledge"
                  title={`Removals in ${location.locationName}`}
                  className="!mb-6"
                />
                <p className="text-lg text-charcoal-light leading-relaxed">
                  {location.intro}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {location.postcodes.map((code) => (
                    <span
                      key={code}
                      className="px-3 py-1 rounded-full bg-green-800/8 text-sm font-medium text-green-800"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.05}>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-800/8 flex items-center justify-center">
                    <Home className="w-5 h-5 text-green-800" />
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal">
                    Property types we move in {location.locationName}
                  </h2>
                </div>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {location.propertyTypes.map((type) => (
                    <li
                      key={type}
                      className="flex items-start gap-2.5 text-charcoal-light leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-green-700 mt-2 shrink-0" />
                      {type}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-800/8 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-green-800" />
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal">
                    Common moves we handle in {location.locationName}
                  </h2>
                </div>
                <ul className="space-y-3">
                  {location.commonMoveTypes.map((move) => (
                    <li
                      key={move}
                      className="p-4 rounded-xl border border-border bg-white text-charcoal-light leading-relaxed"
                    >
                      {move}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-800/8 flex items-center justify-center">
                    <ParkingCircle className="w-5 h-5 text-green-800" />
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal">
                    Parking, access and property considerations
                  </h2>
                </div>
                <p className="text-lg text-charcoal-light leading-relaxed mb-6">
                  {location.parkingAccessNotes}
                </p>
                <h3 className="font-medium text-charcoal mb-3">
                  Roads we know well
                </h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {location.localRoads.map((road) => (
                    <span
                      key={road}
                      className="px-3 py-1.5 rounded-lg bg-cream border border-border text-sm text-charcoal-light"
                    >
                      {road}
                    </span>
                  ))}
                </div>
                <h3 className="font-medium text-charcoal mb-3">
                  Local landmarks
                </h3>
                <div className="flex flex-wrap gap-2">
                  {location.localLandmarks.map((landmark) => (
                    <span
                      key={landmark}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-800/5 text-sm text-green-800"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      {landmark}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-800/8 flex items-center justify-center">
                    <Route className="w-5 h-5 text-green-800" />
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal">
                    Popular move routes from {location.locationName}
                  </h2>
                </div>
                <div className="space-y-4">
                  {location.popularMoveRoutes.map((route) => (
                    <div
                      key={`${route.from}-${route.to}`}
                      className="p-5 md:p-6 rounded-2xl border border-border bg-white"
                    >
                      <p className="font-display text-lg font-semibold text-charcoal mb-2">
                        {route.from}{" "}
                        <ArrowRight className="w-4 h-4 inline text-green-700" />{" "}
                        {route.to}
                      </p>
                      <p className="text-sm text-charcoal-light leading-relaxed">
                        {route.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.25}>
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-6">
                  Recent moves completed near {location.locationName}
                </h2>
                <p className="text-sm text-charcoal-muted mb-4">
                  Example move summaries from recent work in this area. Details
                  are illustrative and vary by property.
                </p>
                <div className="space-y-4">
                  {location.recentMoves.map((move) => (
                    <div
                      key={move.summary}
                      className="p-5 md:p-6 rounded-2xl bg-cream border border-border"
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-800/8 text-green-800">
                          {move.propertyType}
                        </span>
                        <span className="text-xs text-charcoal-muted">
                          {move.month}
                        </span>
                      </div>
                      <p className="text-charcoal-light leading-relaxed">
                        {move.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="space-y-6">
            <FadeIn delay={0.1}>
              <Card className="sticky top-28">
                <h3 className="font-display text-lg font-semibold text-charcoal mb-4">
                  Quick quote
                </h3>
                <p className="text-sm text-charcoal-light mb-6">
                  Fixed quotation for your {location.locationName} move. Send a
                  WhatsApp walkthrough or use our online form.
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

                <blockquote className="mt-6 pt-6 border-t border-border">
                  <Quote className="w-6 h-6 text-green-800/20 mb-3" />
                  <p className="text-sm text-charcoal-light leading-relaxed italic">
                    &ldquo;{location.testimonial.quote}&rdquo;
                  </p>
                  <footer className="mt-3 text-sm">
                    <p className="font-medium text-charcoal">
                      {location.testimonial.author}
                    </p>
                    <p className="text-charcoal-muted">
                      {location.testimonial.moveType}
                    </p>
                  </footer>
                </blockquote>
              </Card>
            </FadeIn>
          </div>
        </div>
      </Section>

      <Section className="gradient-premium">
        <SectionHeader
          eyebrow="Coverage"
          title={`Nearby areas we cover from ${location.locationName}`}
          description="We work across South West London and Surrey. Explore removals in neighbouring areas."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {location.nearbyAreas.map((area) => (
            <FadeIn key={`${location.slug}-${area.slug}`}>
              <Link
                href={locationPath(area.slug)}
                className="group flex items-center justify-between p-5 rounded-2xl bg-white border border-border hover:border-green-700/30 hover:shadow-[var(--shadow-card)] transition-all"
              >
                <span className="font-display font-semibold text-charcoal group-hover:text-green-800 transition-colors">
                  {area.name}
                </span>
                <ArrowRight className="w-4 h-4 text-green-700 group-hover:translate-x-1 transition-transform" />
              </Link>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="FAQ"
          title={`${location.locationName} removals: common questions`}
        />
        <div className="max-w-3xl">
          <FAQ items={location.faq} />
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="p-6 md:p-8 rounded-2xl border border-border bg-white">
          <h2 className="font-display text-xl font-semibold text-charcoal mb-4">
            Related services and pages
          </h2>
          <div className="flex flex-wrap gap-3">
            {location.internalLinks.map((link) => (
              <QuoteAwareLink
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-green-800 hover:text-green-900 underline-offset-2 hover:underline"
              >
                {link.label}
              </QuoteAwareLink>
            ))}
          </div>
        </div>
      </Section>

      <CTABanner />
    </>
  );
}

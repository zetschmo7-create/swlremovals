import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FAQ } from "@/components/ui/FAQ";
import { Button } from "@/components/ui/Button";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { FadeIn } from "@/components/ui/FadeIn";
import { CTABanner } from "@/components/home/CTABanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { WHATSAPP_SURVEY_HREF } from "@/lib/constants";
import {
  createBreadcrumbSchema,
  createFaqSchema,
  createServiceSchema,
} from "@/lib/schema";
import { MessageCircle, Check, ArrowRight } from "lucide-react";

const RELATED_SERVICES = [
  {
    label: "House removals across South West London",
    href: "/services/house-removals",
  },
  {
    label: "Office and commercial relocations",
    href: "/services/office-removals",
  },
  {
    label: "Professional packing for home moves",
    href: "/services/packing",
  },
  {
    label: "Secure short and long-term storage",
    href: "/services/storage",
  },
] as const;

type Props = {
  title: string;
  path: string;
  description: string;
  intro: string;
  features: string[];
  faqs: { question: string; answer: string }[];
};

export function ServicePageTemplate({
  title,
  path,
  description,
  intro,
  features,
  faqs,
}: Props) {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: title, path },
  ]);

  const serviceSchema = createServiceSchema({
    name: title,
    description,
    path,
  });

  const faqSchema = createFaqSchema(faqs);

  return (
    <>
      <JsonLd data={[breadcrumbSchema, serviceSchema, faqSchema]} />

      <section className="relative bg-green-900 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-green-950 to-green-800" />
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-green-500 text-sm font-medium tracking-widest uppercase mb-4">
              Our services
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-tight max-w-3xl">
              {title}
            </h1>
            <p className="mt-6 text-lg text-white/70 max-w-2xl leading-relaxed">
              {description}
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
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <FadeIn>
            <p className="text-lg text-charcoal-light leading-relaxed">{intro}</p>
            <p className="mt-6 text-base text-charcoal-light leading-relaxed">
              We cover{" "}
              <Link
                href="/areas-covered"
                className="font-medium text-green-800 hover:text-green-900 underline-offset-4 hover:underline"
              >
                100+ locations across South West London and Surrey
              </Link>
              , including Wimbledon, Richmond, Kingston and Chelsea.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-xl font-semibold text-charcoal mb-6">
              What&apos;s included
            </h2>
            <ul className="space-y-4">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
                  <span className="text-charcoal-light">{feature}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </Section>

      <Section className="gradient-premium">
        <SectionHeader
          eyebrow="Related services"
          title="Complete removals support"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {RELATED_SERVICES.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group p-5 rounded-2xl border border-border bg-white hover:border-green-700/30 hover:shadow-[var(--shadow-soft)] transition-all text-sm font-medium text-charcoal hover:text-green-800"
            >
              <span className="flex items-center justify-between gap-2">
                {link.label}
                <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-center">
          <Link
            href="/services"
            className="text-sm font-medium text-green-800 hover:text-green-900 underline-offset-4 hover:underline"
          >
            View all removals services
          </Link>
        </p>
      </Section>

      <Section>
        <SectionHeader eyebrow="FAQ" title="Common questions" />
        <div className="max-w-3xl">
          <FAQ items={faqs} />
        </div>
      </Section>

      <CTABanner />
    </>
  );
}

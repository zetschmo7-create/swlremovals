import { createMetadata } from "@/lib/seo";
import { PageHero } from "@/components/templates/PageHero";
import { Section } from "@/components/ui/Section";
import { SITE_NAME } from "@/lib/constants";

export const metadata = createMetadata({
  title: "Terms of Service",
  description: `Terms of service for ${SITE_NAME}. Conditions governing our removals services.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms of Service" />
      <Section className="!pt-0">
        <div className="max-w-3xl">
          <p className="text-charcoal-light leading-relaxed mb-8">
            Last updated: June 2026
          </p>

          {[
            {
              title: "Quotations",
              content:
                "All quotations are fixed and valid for 30 days from the date of issue, unless otherwise stated. The agreed quotation covers the scope of work surveyed or described at the time of booking.",
            },
            {
              title: "Bookings and deposits",
              content:
                "A deposit may be required to secure your moving date. Deposits are applied to your final invoice. Cancellation terms will be provided at the time of booking.",
            },
            {
              title: "Insurance",
              content:
                "We hold full public liability insurance. Details of coverage are available on request. We recommend customers maintain their own contents insurance for the duration of the move.",
            },
            {
              title: "Access and parking",
              content:
                "Customers are responsible for arranging parking permits or suspension bays where required, unless otherwise agreed. Accurate access information must be provided at the time of survey.",
            },
            {
              title: "Liability",
              content:
                "We take every care with your belongings. Any claims for damage must be reported within 7 days of the move. Our liability is limited to the terms set out in our insurance documentation.",
            },
            {
              title: "Governing law",
              content:
                "These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the English courts.",
            },
          ].map((section) => (
            <div key={section.title} className="mb-8">
              <h2 className="font-display text-xl font-semibold text-charcoal mb-3">
                {section.title}
              </h2>
              <p className="text-charcoal-light leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

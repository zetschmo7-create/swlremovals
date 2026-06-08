import { createMetadata } from "@/lib/seo";
import { PageHero } from "@/components/templates/PageHero";
import { Section } from "@/components/ui/Section";
import { SITE_NAME, EMAIL } from "@/lib/constants";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE_NAME}. How we collect, use, and protect your personal information.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" />
      <Section className="!pt-0">
        <div className="max-w-3xl prose prose-neutral">
          <p className="text-charcoal-light leading-relaxed mb-6">
            Last updated: June 2026
          </p>

          {[
            {
              title: "Information we collect",
              content:
                "When you request a quotation or contact us, we may collect your name, email address, phone number, property addresses, move details, and any video walkthroughs you submit. We collect this information solely to provide our removals services and respond to your enquiries.",
            },
            {
              title: "How we use your information",
              content:
                "Your information is used to provide quotations, coordinate your move, communicate with you about your booking, and improve our services. We do not sell your personal data to third parties.",
            },
            {
              title: "Data retention",
              content:
                "We retain your information for as long as necessary to fulfil our services and comply with legal obligations. Quote enquiries are typically retained for 24 months.",
            },
            {
              title: "Your rights",
              content:
                "Under UK GDPR, you have the right to access, correct, or delete your personal data. To exercise these rights, contact us at the email address below.",
            },
            {
              title: "Contact",
              content: `For privacy enquiries, contact us at ${EMAIL}.`,
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

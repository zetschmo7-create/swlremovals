import { createMetadata } from "@/lib/seo";
import { PageHero } from "@/components/templates/PageHero";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { FadeIn } from "@/components/ui/FadeIn";
import {
  PHONE,
  PHONE_HREF,
  EMAIL,
  WHATSAPP_HREF,
  WHATSAPP_SURVEY_HREF,
} from "@/lib/constants";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";

export const metadata = createMetadata({
  title: "Contact",
  description:
    "Contact South West London Removals. Call, email, or WhatsApp for fixed quotations and move enquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Speak with our team"
        description="We respond quickly — most enquiries receive a reply within a few hours during business hours."
      />

      <Section className="!pt-0 -mt-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Phone,
              title: "Phone",
              detail: PHONE,
              href: PHONE_HREF,
              cta: "Call now",
            },
            {
              icon: MessageCircle,
              title: "WhatsApp",
              detail: "Fastest response",
              href: WHATSAPP_HREF,
              cta: "Message us",
            },
            {
              icon: Mail,
              title: "Email",
              detail: EMAIL,
              href: `mailto:${EMAIL}`,
              cta: "Send email",
            },
            {
              icon: MapPin,
              title: "Coverage",
              detail: "South West London & Surrey",
              href: "/areas",
              cta: "View areas",
            },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08}>
              <Card className="h-full text-center">
                <item.icon className="w-6 h-6 text-green-800 mx-auto mb-4" />
                <h3 className="font-display font-semibold text-charcoal mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-charcoal-light mb-4">{item.detail}</p>
                <Button
                  href={item.href}
                  variant="ghost"
                  size="sm"
                  external={item.href.startsWith("http") || item.href.startsWith("tel") || item.href.startsWith("mailto")}
                >
                  {item.cta}
                </Button>
              </Card>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2}>
          <div className="mt-12 text-center max-w-xl mx-auto">
            <h2 className="font-display text-2xl font-semibold text-charcoal mb-4">
              Need a quote quickly?
            </h2>
            <p className="text-charcoal-light mb-6">
              Send a WhatsApp walkthrough video of your home for a fixed
              quotation without waiting for a survey appointment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button href={WHATSAPP_SURVEY_HREF} variant="whatsapp" external>
                <MessageCircle className="w-5 h-5" />
                WhatsApp Survey
              </Button>
              <QuoteButton>Online Quote Form</QuoteButton>
            </div>
          </div>
        </FadeIn>
      </Section>
    </>
  );
}

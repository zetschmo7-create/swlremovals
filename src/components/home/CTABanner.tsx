import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { WHATSAPP_HREF, PHONE_HREF } from "@/lib/constants";
import { IMAGES } from "@/lib/images";
import { MessageCircle, Phone } from "lucide-react";

export function CTABanner() {
  return (
    <Section className="!pb-20 md:!pb-28">
      <FadeIn>
        <div className="relative rounded-3xl overflow-hidden min-h-[320px] md:min-h-[380px] flex items-center">
          <Image
            src={IMAGES.banner}
            alt="South West London Removals — premium home moves"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 via-green-950/80 to-green-950/50" />
          <div className="relative z-10 w-full px-8 py-14 md:px-16 md:py-20">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
                Ready to move? Let us handle it properly.
              </h2>
              <p className="mt-5 text-lg text-white/70 leading-relaxed">
                Fixed quotations. Fast WhatsApp surveys. Experienced insured
                crews across Wimbledon, South West London and Surrey.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
                <QuoteButton size="lg" variant="secondary">
                  Get My Quote
                </QuoteButton>
                <Button
                  href={WHATSAPP_HREF}
                  variant="whatsapp"
                  size="lg"
                  external
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Us
                </Button>
                <Button href={PHONE_HREF} variant="outline" size="lg" external>
                  <Phone className="w-5 h-5" />
                  Call Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}

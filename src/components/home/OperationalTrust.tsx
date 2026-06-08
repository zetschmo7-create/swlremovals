import Image from "next/image";
import { IMAGES } from "@/lib/images";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { WHATSAPP_SURVEY_HREF } from "@/lib/constants";
import { MessageCircle } from "lucide-react";

const POINTS = [
  "Branded vehicles and uniformed crews",
  "Floor protection before loading",
  "Dedicated move coordinator",
];

export function OperationalTrust() {
  return (
    <Section className="!py-16 md:!py-24">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <FadeIn>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-[var(--shadow-elevated)]">
            <Image
              src={IMAGES.movingDay}
              alt="Professional moving day — South West London Removals"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-950/30 to-transparent" />
          </div>
        </FadeIn>

        <FadeIn delay={0.12}>
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-green-700 mb-4">
            Premium standards
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-charcoal tracking-tight leading-[1.1] mb-6">
            The detail that separates a premium move from a stressful one.
          </h2>
          <p className="text-lg text-charcoal-light leading-relaxed mb-8 max-w-lg">
            Every crew arrives prepared with protection materials, a clear plan
            and the calm professionalism affluent homeowners expect.
          </p>
          <ul className="space-y-4 mb-10">
            {POINTS.map((point) => (
              <li
                key={point}
                className="text-base text-charcoal-light border-l-2 border-green-700/30 pl-4"
              >
                {point}
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-3">
            <QuoteButton size="lg">
              Get My Quote
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
    </Section>
  );
}

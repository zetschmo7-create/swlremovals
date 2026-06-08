import Image from "next/image";
import { WHY_CHOOSE_US } from "@/lib/constants";
import { IMAGES } from "@/lib/images";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { QuoteButton } from "@/components/quote/QuoteButton";
import {
  Users,
  FileCheck,
  Shield,
  MessageCircle,
  Umbrella,
  Wrench,
  Layers,
  Shirt,
} from "lucide-react";

const ICONS = {
  users: Users,
  fileCheck: FileCheck,
  shield: Shield,
  message: MessageCircle,
  umbrella: Umbrella,
  wrench: Wrench,
  layers: Layers,
  shirt: Shirt,
} as const;

export function WhyChooseUs() {
  return (
    <Section>
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16">
        <SectionHeader
          eyebrow="Why customers choose us"
          title="The reassurance affluent homeowners expect from a premium removals company."
          description="We are not the cheapest option. We are the company you call when your home, furniture and timing matter."
          className="!mb-0 lg:max-w-xl"
        />
        <FadeIn delay={0.1}>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-[var(--shadow-elevated)] group">
            <Image
              src={IMAGES.mover}
              alt="Experienced South West London removals crew"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-950/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <p className="text-white font-display text-lg font-semibold">
                In-house trained crews
              </p>
              <p className="text-white/70 text-sm mt-1">
                Not agency staff. The same team standards on every move.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {WHY_CHOOSE_US.map((item, i) => {
          const Icon = ICONS[item.icon];
          return (
            <FadeIn key={item.title} delay={i * 0.05}>
              <div className="group h-full p-6 md:p-7 rounded-2xl bg-white border border-border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] hover:border-green-700/20 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-green-800/8 flex items-center justify-center mb-5 group-hover:bg-green-800/12 transition-colors">
                  <Icon className="w-5 h-5 text-green-800" />
                </div>
                <h3 className="font-display text-lg font-semibold text-charcoal mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-charcoal-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            </FadeIn>
          );
        })}
      </div>

      <FadeIn delay={0.3}>
        <div className="mt-12 text-center">
          <QuoteButton size="lg">
            Get My Fixed Quote
          </QuoteButton>
        </div>
      </FadeIn>
    </Section>
  );
}

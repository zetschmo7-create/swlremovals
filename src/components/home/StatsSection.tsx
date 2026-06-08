import { TRUST_STATS } from "@/lib/constants";
import { Section } from "@/components/ui/Section";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { FadeIn } from "@/components/ui/FadeIn";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { Shield, FileCheck, Users, Star } from "lucide-react";

const STATS = [
  {
    value: TRUST_STATS.movesCompleted,
    suffix: "+",
    label: "Moves completed",
    icon: Users,
  },
  {
    value: 100,
    suffix: "%",
    label: "Fixed quotations",
    icon: FileCheck,
  },
  {
    value: TRUST_STATS.googleRating,
    suffix: "★",
    label: "Google rating",
    decimals: 1,
    icon: Star,
  },
  {
    label: "Fully insured",
    display: "£2M",
    sub: "public liability",
    icon: Shield,
  },
] as const;

export function StatsSection() {
  return (
    <Section dark className="!py-16 md:!py-20 border-y border-white/5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-12">
        {STATS.map((stat, i) => (
          <FadeIn key={stat.label} delay={i * 0.08} className="text-center">
            <stat.icon className="w-5 h-5 text-green-500 mx-auto mb-3" />
            <p className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight">
              {"display" in stat ? (
                stat.display
              ) : (
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={"decimals" in stat ? stat.decimals : 0}
                />
              )}
            </p>
            <p className="text-sm text-white/55 mt-2">{stat.label}</p>
            {"sub" in stat && stat.sub && (
              <p className="text-xs text-white/35 mt-0.5">{stat.sub}</p>
            )}
          </FadeIn>
        ))}
      </div>
      <FadeIn delay={0.2}>
        <p className="text-center text-white/50 text-sm mb-6">
          Fast survey response · Experienced crews · Same-day WhatsApp quotations
        </p>
        <div className="text-center">
          <QuoteButton variant="secondary" size="lg">
            Get My Quote
          </QuoteButton>
        </div>
      </FadeIn>
    </Section>
  );
}

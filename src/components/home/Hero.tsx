"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { FadeIn } from "@/components/ui/FadeIn";
import { PHONE_HREF, WHATSAPP_SURVEY_HREF } from "@/lib/constants";
import { IMAGES } from "@/lib/images";
import { MessageCircle, Phone } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={IMAGES.hero}
          alt="Premium home removals across Wimbledon and South West London"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_38%] sm:object-[50%_40%] md:object-[center_42%] scale-105 animate-[hero-zoom_20s_ease-out_forwards] will-change-transform transform-gpu"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-950/95 via-green-950/60 to-green-900/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/70 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pb-24 md:pb-28 pt-28 md:pt-32">
        <FadeIn delay={0.1}>
          <h1 className="font-display text-[2.25rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] font-semibold text-white tracking-tight leading-[1.06] max-w-4xl">
            Premium removals across Wimbledon &amp; South West London
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mt-6 text-base sm:text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
            Fixed quotations, experienced insured crews and fast WhatsApp video
            surveys for home, office, packing and storage moves across South
            West London and Surrey.
          </p>
        </FadeIn>

        <FadeIn delay={0.25}>
          <p className="mt-4 text-sm text-green-400/90 font-medium tracking-wide">
            Handled properly from start to finish.
          </p>
        </FadeIn>

        <FadeIn delay={0.35}>
          <div className="mt-10 flex flex-col max-lg:gap-3.5 lg:flex-row lg:flex-wrap lg:gap-3">
            <QuoteButton
              size="lg"
              className="shadow-[var(--shadow-elevated)] max-lg:w-full max-lg:justify-center"
            >
              Get My Quote
            </QuoteButton>
            <Button
              href={WHATSAPP_SURVEY_HREF}
              variant="whatsapp"
              size="lg"
              external
              className="max-lg:w-full max-lg:justify-center"
            >
              <MessageCircle className="w-5 h-5" />
              Send WhatsApp Video
            </Button>
            <Button
              href={PHONE_HREF}
              variant="outline"
              size="lg"
              external
              className="hidden lg:inline-flex"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

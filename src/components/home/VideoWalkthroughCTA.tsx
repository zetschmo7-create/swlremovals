import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { WHATSAPP_SURVEY_HREF } from "@/lib/constants";
import { IMAGES } from "@/lib/images";
import {
  MessageCircle,
  Video,
  FileCheck,
  CalendarCheck,
  Truck,
} from "lucide-react";

const STEPS = [
  {
    icon: Video,
    step: "01",
    title: "Send walkthrough",
    description:
      "Record a quick video of your rooms and send via WhatsApp — no survey appointment needed.",
  },
  {
    icon: FileCheck,
    step: "02",
    title: "Receive quotation",
    description:
      "A fixed, detailed quote — typically within a few hours during business hours.",
  },
  {
    icon: CalendarCheck,
    step: "03",
    title: "Secure booking",
    description:
      "Confirm your date with a deposit. Your coordinator handles the rest.",
  },
  {
    icon: Truck,
    step: "04",
    title: "Move handled professionally",
    description:
      "Crews arrive on time, fully prepared. Floor protection, wrapping, loading — all to plan.",
  },
];

export function VideoWalkthroughCTA() {
  return (
    <Section dark className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <Image
          src={IMAGES.packing}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          aria-hidden
        />
        <div className="absolute inset-0 bg-green-950/80" />
      </div>

      <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <FadeIn>
          <p className="text-green-500 text-sm font-medium tracking-widest uppercase mb-4">
            WhatsApp video survey
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
            Send a walkthrough video. Receive a fixed quotation. Secure your
            move.
          </h2>
          <p className="mt-6 text-lg text-white/65 leading-relaxed">
            The fastest way to get a fixed price — no waiting for survey
            appointments. Record your rooms, send on WhatsApp, and we respond
            with a clear quotation you can trust.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              href={WHATSAPP_SURVEY_HREF}
              variant="whatsapp"
              size="lg"
              external
            >
              <MessageCircle className="w-5 h-5" />
              Send WhatsApp Video
            </Button>
            <QuoteButton size="lg" variant="secondary">
              Online Quote Form
            </QuoteButton>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 gap-4">
          {STEPS.map((step, i) => (
            <FadeIn key={step.step} delay={i * 0.1}>
              <div className="h-full flex flex-col gap-4 p-5 md:p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/8 transition-colors">
                <div className="w-11 h-11 rounded-full bg-green-800 flex items-center justify-center shrink-0">
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-green-500 font-medium tracking-widest uppercase mb-1">
                    Step {step.step}
                  </p>
                  <p className="font-display text-base font-semibold text-white">
                    {step.title}
                  </p>
                  <p className="text-sm text-white/55 mt-1.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  );
}

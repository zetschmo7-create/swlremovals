import Image from "next/image";
import { RECENT_MOVES } from "@/lib/constants";
import { IMAGES, type ImageKey } from "@/lib/images";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function RecentMoves() {
  return (
    <Section className="gradient-premium !pt-16">
      <SectionHeader
        eyebrow="Active operations"
        title="Recent completed moves"
        description="A live snapshot of relocations handled across South West London and Surrey — the same operational standards on every job."
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {RECENT_MOVES.map((move, i) => (
          <FadeIn key={`${move.from}-${move.to}`} delay={i * 0.08}>
            <article className="group bg-white rounded-2xl border border-border overflow-hidden shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={IMAGES[move.imageKey as ImageKey]}
                  alt={`${move.type} — ${move.from} to ${move.to}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-950/70 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 text-xs font-medium text-green-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {move.date}
                  </span>
                </div>
              </div>
              <div className="p-5 md:p-6">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="font-display text-lg font-semibold text-charcoal">
                    {move.from}
                  </span>
                  <ArrowRight className="w-4 h-4 text-green-700 shrink-0" />
                  <span className="font-display text-lg font-semibold text-charcoal">
                    {move.to}
                  </span>
                </div>
                <p className="text-sm text-charcoal-light">{move.type}</p>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}

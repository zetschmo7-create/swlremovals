import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { MoveFlowBadges } from "@/components/reviews/MoveFlowBadges";
import {
  MOVEFLOW_ACCREDITATION_BADGES,
  MOVEFLOW_BADGES_IFRAME_FALLBACK_HEIGHT,
  MOVEFLOW_REVIEWS_URL,
} from "@/lib/moveflow";

export function AccreditationSection() {
  return (
    <Section className="!py-14 md:!py-20 bg-cream border-t border-border/40">
      <SectionHeader
        eyebrow="Accreditation"
        title="Independently verified by MoveFlow."
        description="Gold Mover status, Mover of the Year recognition and platform verification — awarded against live performance and customer feedback."
        align="center"
        className="!mb-8 md:!mb-10 max-w-2xl mx-auto"
      />

      <FadeIn>
        <div className="max-w-4xl mx-auto">
          <MoveFlowBadges
            badges={MOVEFLOW_ACCREDITATION_BADGES}
            layout="row"
            fallbackHeight={MOVEFLOW_BADGES_IFRAME_FALLBACK_HEIGHT}
          />
        </div>
      </FadeIn>

      <p className="text-center mt-6 md:mt-8">
        <a
          href={MOVEFLOW_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-green-800 hover:text-green-900 underline-offset-4 hover:underline transition-colors"
        >
          View full verified profile
        </a>
      </p>
    </Section>
  );
}

import { FadeIn } from "@/components/ui/FadeIn";
import { MoveFlowReviewsBadge } from "@/components/reviews/MoveFlowReviews";
import { MoveFlowBadges } from "@/components/reviews/MoveFlowBadges";

export function TrustSection() {
  return (
    <section
      className="relative z-20 border-b border-border/50 bg-cream"
      aria-label="Verified reviews and accreditation"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-6 md:py-8">
        <FadeIn>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 md:gap-8">
            <div className="w-full lg:w-auto flex justify-center lg:justify-start shrink-0">
              <MoveFlowReviewsBadge />
            </div>
            <div className="w-full lg:flex-1 lg:max-w-3xl flex justify-center lg:justify-end min-w-0">
              <MoveFlowBadges />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

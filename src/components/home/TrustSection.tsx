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
          <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
            <div className="w-full lg:w-[38%] flex justify-center lg:justify-start">
              <MoveFlowReviewsBadge />
            </div>
            <div className="w-full lg:w-[62%] flex justify-center lg:justify-end">
              <MoveFlowBadges />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

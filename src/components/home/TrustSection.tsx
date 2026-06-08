import { FadeIn } from "@/components/ui/FadeIn";
import { MoveFlowReviewsBadge } from "@/components/reviews/MoveFlowReviews";
import { MoveFlowBadges } from "@/components/reviews/MoveFlowBadges";

export function TrustSection() {
  return (
    <section
      className="relative z-20 border-b border-border/50 bg-cream"
      aria-labelledby="trust-section-heading"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-10 md:py-14">
        <FadeIn>
          <div className="text-center lg:text-left mb-8 md:mb-10 max-w-3xl mx-auto lg:mx-0">
            <h2
              id="trust-section-heading"
              className="font-display text-2xl md:text-3xl font-semibold text-charcoal tracking-tight"
            >
              Accredited &amp; trusted by homeowners across South West London
            </h2>
            <p className="mt-3 text-base md:text-lg text-charcoal-light leading-relaxed">
              Verified reviews, insured crews and professionally managed moves.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-8 md:gap-10 lg:gap-14">
            <div className="w-full lg:flex-1 lg:max-w-[480px] flex justify-center lg:justify-start">
              <MoveFlowReviewsBadge />
            </div>
            <div className="w-full lg:flex-1 flex justify-center lg:justify-end">
              <MoveFlowBadges />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

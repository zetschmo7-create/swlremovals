import { FadeIn } from "@/components/ui/FadeIn";
import { MoveFlowReviewsBadge } from "@/components/reviews/MoveFlowReviews";
import { MOVEFLOW_REVIEWS_URL } from "@/lib/moveflow";

export function TrustSection() {
  return (
    <section
      className="relative z-20 border-b border-border/50 bg-cream"
      aria-label="Verified reviews"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-4 md:py-5 max-lg:overflow-x-hidden">
        <FadeIn>
          <div className="flex flex-col items-center justify-center gap-3 max-lg:gap-3.5">
            <div className="w-full max-w-xl mx-auto max-lg:max-w-full">
              <MoveFlowReviewsBadge />
            </div>
            <a
              href={MOVEFLOW_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-green-800 hover:text-green-900 underline-offset-4 hover:underline transition-colors text-center px-2"
            >
              View verified profile
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

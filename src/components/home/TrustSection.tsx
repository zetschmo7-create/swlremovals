import { FadeIn } from "@/components/ui/FadeIn";
import { MoveFlowReviewsBadge } from "@/components/reviews/MoveFlowReviews";
import { MOVEFLOW_REVIEWS_URL } from "@/lib/moveflow";

export function TrustSection() {
  return (
    <section
      className="relative z-20 border-b border-border/50 bg-cream max-lg:bg-[var(--cream)]"
      aria-label="Verified reviews"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 max-lg:py-2 max-lg:pt-3 lg:py-5 max-lg:bg-transparent">
        <FadeIn>
          <div className="flex flex-col items-center justify-center max-lg:gap-0 lg:gap-3.5">
            <div className="w-full max-w-xl mx-auto max-lg:max-w-full max-lg:overflow-x-clip max-lg:bg-transparent">
              <MoveFlowReviewsBadge />
            </div>
            {/* Desktop only — mobile-compact embed includes profile link */}
            <a
              href={MOVEFLOW_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-block text-sm font-medium text-green-800 hover:text-green-900 underline-offset-4 hover:underline transition-colors text-center"
            >
              View verified profile
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

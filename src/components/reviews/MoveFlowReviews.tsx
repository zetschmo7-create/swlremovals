import { MOVEFLOW_REVIEWS_IFRAME_SRC } from "@/lib/moveflow";

const REVIEW_IFRAME_HEIGHT = 150;

export function MoveFlowReviewsBadge() {
  return (
    <div className="trust-reviews-widget w-full lg:min-w-[420px]">
      <iframe
        src={MOVEFLOW_REVIEWS_IFRAME_SRC}
        style={{
          border: 0,
          width: "100%",
          height: REVIEW_IFRAME_HEIGHT,
          minHeight: REVIEW_IFRAME_HEIGHT,
        }}
        loading="lazy"
        scrolling="no"
        title="MoveFlow Reviews"
        className="block bg-transparent"
      />
    </div>
  );
}

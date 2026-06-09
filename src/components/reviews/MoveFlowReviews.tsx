import {
  MOVEFLOW_REVIEWS_IFRAME_HEIGHT_DESKTOP,
  MOVEFLOW_REVIEWS_IFRAME_HEIGHT_MOBILE,
  MOVEFLOW_REVIEWS_IFRAME_SRC,
  MOVEFLOW_REVIEWS_IFRAME_SRC_MOBILE,
} from "@/lib/moveflow";

const iframeStyle = {
  border: 0,
  width: "100%",
  background: "transparent",
} as const;

export function MoveFlowReviewsBadge() {
  return (
    <div className="trust-reviews-widget w-full">
      {/* Mobile & tablet — review-card layout with profile CTA inside widget */}
      <div className="trust-reviews-widget--mobile lg:hidden w-full">
        <iframe
          src={MOVEFLOW_REVIEWS_IFRAME_SRC_MOBILE}
          style={{
            ...iframeStyle,
            height: MOVEFLOW_REVIEWS_IFRAME_HEIGHT_MOBILE,
            minHeight: MOVEFLOW_REVIEWS_IFRAME_HEIGHT_MOBILE,
          }}
          loading="lazy"
          scrolling="no"
          title="MoveFlow Reviews"
          className="block w-full bg-transparent"
        />
      </div>

      {/* Desktop — unchanged badge embed */}
      <div className="trust-reviews-widget--desktop hidden lg:block w-full">
        <iframe
          src={MOVEFLOW_REVIEWS_IFRAME_SRC}
          style={{
            ...iframeStyle,
            height: MOVEFLOW_REVIEWS_IFRAME_HEIGHT_DESKTOP,
            minHeight: MOVEFLOW_REVIEWS_IFRAME_HEIGHT_DESKTOP,
          }}
          loading="lazy"
          scrolling="no"
          title="MoveFlow Reviews"
          className="block bg-transparent mx-auto"
        />
      </div>
    </div>
  );
}

import {
  MOVEFLOW_REVIEWS_IFRAME_HEIGHT_DESKTOP,
  MOVEFLOW_REVIEWS_IFRAME_HEIGHT_MOBILE,
  MOVEFLOW_REVIEWS_IFRAME_SRC,
  MOVEFLOW_REVIEWS_IFRAME_SRC_MOBILE,
} from "@/lib/moveflow";

const mobileIframeStyle = {
  border: 0,
  width: "100%",
  height: MOVEFLOW_REVIEWS_IFRAME_HEIGHT_MOBILE,
  background: "transparent",
  display: "block",
  overflow: "hidden",
} as const;

const desktopIframeStyle = {
  border: 0,
  width: "100%",
  height: MOVEFLOW_REVIEWS_IFRAME_HEIGHT_DESKTOP,
  minHeight: MOVEFLOW_REVIEWS_IFRAME_HEIGHT_DESKTOP,
  background: "transparent",
} as const;

export function MoveFlowReviewsBadge() {
  return (
    <div className="trust-reviews-widget w-full max-lg:min-h-0">
      {/* MOBILE MOVEFLOW REVIEWS IFRAME - mobile-compact */}
      <div className="reviews-mobile-wrap lg:hidden">
        <iframe
          key="moveflow-reviews-mobile-compact"
          src={MOVEFLOW_REVIEWS_IFRAME_SRC_MOBILE}
          width="100%"
          height={MOVEFLOW_REVIEWS_IFRAME_HEIGHT_MOBILE}
          loading="lazy"
          scrolling="no"
          title="MoveFlow verified reviews"
          style={mobileIframeStyle}
        />
      </div>

      {/* Desktop — unchanged badge embed */}
      <div className="trust-reviews-widget--desktop hidden lg:block w-full">
        <iframe
          src={MOVEFLOW_REVIEWS_IFRAME_SRC}
          style={desktopIframeStyle}
          loading="lazy"
          scrolling="no"
          title="MoveFlow Reviews"
          className="block bg-transparent mx-auto"
        />
      </div>
    </div>
  );
}

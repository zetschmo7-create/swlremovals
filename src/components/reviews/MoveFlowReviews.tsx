import { MOVEFLOW_REVIEWS_IFRAME_SRC } from "@/lib/moveflow";

export function MoveFlowReviewsBadge() {
  return (
    <div className="w-full max-w-[480px] mx-auto lg:mx-0 shrink-0">
      <iframe
        src={MOVEFLOW_REVIEWS_IFRAME_SRC}
        style={{ border: 0, width: "100%", height: 120 }}
        loading="lazy"
        title="MoveFlow Reviews"
        className="block bg-transparent"
      />
    </div>
  );
}

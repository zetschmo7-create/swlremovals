"use client";

import { useEffect, useRef, useState } from "react";
import {
  MOVEFLOW_BADGES_IFRAME_HEIGHT,
  MOVEFLOW_BADGES_IFRAME_SRC,
} from "@/lib/moveflow";

export function MoveFlowBadges() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px" }
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className="moveflow-badges-shell w-full"
      style={{ minHeight: MOVEFLOW_BADGES_IFRAME_HEIGHT }}
    >
      {shouldLoad && (
        <iframe
          src={MOVEFLOW_BADGES_IFRAME_SRC}
          width="100%"
          height={MOVEFLOW_BADGES_IFRAME_HEIGHT}
          loading="lazy"
          scrolling="no"
          title="MoveFlow accreditation badges"
          className="block w-full border-0 bg-transparent"
          style={{
            border: 0,
            background: "transparent",
            display: "block",
          }}
        />
      )}
    </div>
  );
}

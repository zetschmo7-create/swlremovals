"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildMoveFlowBadgesIframeSrc,
  MOVEFLOW_BADGES_IFRAME_FALLBACK_HEIGHT,
} from "@/lib/moveflow";

type Props = {
  badges?: string;
  layout?: "row" | "grid" | "strip";
  variant?: string;
  title?: string;
  fallbackHeight?: number;
  className?: string;
};

export function MoveFlowBadges({
  badges,
  layout = "row",
  variant = "shield-seal",
  title,
  fallbackHeight = MOVEFLOW_BADGES_IFRAME_FALLBACK_HEIGHT,
  className = "",
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [height, setHeight] = useState(fallbackHeight);

  const src = useMemo(
    () => buildMoveFlowBadgesIframeSrc({ badges, layout, variant, title }),
    [badges, layout, variant, title]
  );

  useEffect(() => {
    setHeight(fallbackHeight);
  }, [fallbackHeight, src]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.data?.type === "moveflow:badges:size" &&
        typeof event.data.height === "number" &&
        event.data.height > 0
      ) {
        setHeight(Math.ceil(event.data.height));
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

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
      className={`moveflow-badges-shell w-full ${className}`}
      style={{ minHeight: shouldLoad ? height : fallbackHeight }}
    >
      {shouldLoad && (
        <iframe
          src={src}
          width="100%"
          height={height}
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

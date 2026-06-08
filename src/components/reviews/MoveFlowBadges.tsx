"use client";

import { useEffect, useRef, useState } from "react";
import {
  MOVEFLOW_BADGES_IFRAME_SRC,
  MOVEFLOW_REVIEWS_URL,
} from "@/lib/moveflow";

const BADGE_HEIGHT_DESKTOP = 360;
const BADGE_HEIGHT_MOBILE = 400;

function getBadgeHeight() {
  if (typeof window === "undefined") return BADGE_HEIGHT_MOBILE;
  return window.matchMedia("(min-width: 1024px)").matches
    ? BADGE_HEIGHT_DESKTOP
    : BADGE_HEIGHT_MOBILE;
}

export function MoveFlowBadges() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [height, setHeight] = useState(BADGE_HEIGHT_MOBILE);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const updateHeight = () => setHeight(getBadgeHeight());
    updateHeight();
    mq.addEventListener("change", updateHeight);
    return () => mq.removeEventListener("change", updateHeight);
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
      className="moveflow-badges-shell w-full flex items-center justify-center"
      style={{ minHeight: shouldLoad ? height : BADGE_HEIGHT_MOBILE }}
    >
      {shouldLoad && (
        <a
          href={MOVEFLOW_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
          aria-label="View verified reviews and accreditation on MoveFlow"
        >
          <iframe
            src={MOVEFLOW_BADGES_IFRAME_SRC}
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
        </a>
      )}
    </div>
  );
}

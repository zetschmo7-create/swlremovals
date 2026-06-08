"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import {
  MOVEFLOW_BADGES_IFRAME_SRC,
  MOVEFLOW_BADGES_SCRIPT,
  MOVEFLOW_REVIEWS_URL,
  MOVEFLOW_SLUG,
} from "@/lib/moveflow";

export function MoveFlowBadges() {
  const rootRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

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

  useEffect(() => {
    if (!shouldLoad || useFallback) return;

    const timer = window.setTimeout(() => {
      const host = badgeRef.current;
      if (!host || host.childElementCount === 0) {
        setUseFallback(true);
      }
    }, 4500);

    return () => window.clearTimeout(timer);
  }, [shouldLoad, useFallback]);

  return (
    <div
      ref={rootRef}
      className="moveflow-badges-shell w-full min-h-[220px] md:min-h-[240px] lg:min-h-[260px] flex items-center justify-center"
    >
      {shouldLoad && !useFallback && (
        <>
          <Script
            id="moveflow-badges-loader"
            src={MOVEFLOW_BADGES_SCRIPT}
            strategy="afterInteractive"
          />
          <div
            ref={badgeRef}
            className="moveflow-badges w-full max-w-full"
            data-slug={MOVEFLOW_SLUG}
            data-variant="shield-seal"
            data-theme="light"
            data-layout="row"
            data-bg="0"
            data-title="Accredited & verified"
            suppressHydrationWarning
          />
        </>
      )}

      {shouldLoad && useFallback && (
        <a
          href={MOVEFLOW_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full max-w-full"
          aria-label="View verified reviews and accreditation on MoveFlow"
        >
          <iframe
            src={MOVEFLOW_BADGES_IFRAME_SRC}
            width="100%"
            height={280}
            loading="lazy"
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

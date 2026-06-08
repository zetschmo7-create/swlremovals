"use client";

import { useCallback, useEffect, useState } from "react";
import {
  MOVEFLOW_REVIEWS,
  MOVEFLOW_REVIEWS_URL,
  type MoveFlowReview,
} from "@/data/moveflowReviews";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const AUTOPLAY_MS = 5500;

function getItemsPerView(width: number) {
  if (width >= 1024) return 4;
  if (width >= 768) return 2;
  return 1;
}

function ReviewCard({ review }: { review: MoveFlowReview }) {
  return (
    <blockquote className="flex h-full min-h-[200px] flex-col rounded-2xl border border-border bg-white p-5 md:p-6 text-left shadow-[var(--shadow-soft)]">
      <div className="flex gap-1 mb-3">
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star
            key={i}
            className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
            aria-hidden
          />
        ))}
      </div>
      <p className="font-display text-[0.95rem] md:text-base text-charcoal leading-snug tracking-tight flex-1 line-clamp-5 lg:line-clamp-6">
        &ldquo;{review.quote}&rdquo;
      </p>
      <footer className="mt-4 pt-4 border-t border-border">
        <p className="text-sm font-medium text-charcoal">{review.name}</p>
        <p className="text-xs text-charcoal-muted mt-1 line-clamp-2">
          {review.locationRoute}
        </p>
        <p className="text-[11px] text-green-700/80 mt-1.5">{review.source}</p>
      </footer>
    </blockquote>
  );
}

export function TestimonialsCarousel() {
  const [itemsPerView, setItemsPerView] = useState(1);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const totalSlides = Math.ceil(MOVEFLOW_REVIEWS.length / itemsPerView);

  useEffect(() => {
    const update = () => setItemsPerView(getItemsPerView(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    setSlideIndex((current) =>
      totalSlides === 0 ? 0 : current % totalSlides
    );
  }, [totalSlides]);

  const goTo = useCallback(
    (index: number) => {
      if (totalSlides === 0) return;
      setIsVisible(false);
      window.setTimeout(() => {
        setSlideIndex(((index % totalSlides) + totalSlides) % totalSlides);
        setIsVisible(true);
      }, 180);
    },
    [totalSlides]
  );

  const goNext = useCallback(() => {
    goTo(slideIndex + 1);
  }, [goTo, slideIndex]);

  const goPrev = useCallback(() => {
    goTo(slideIndex - 1);
  }, [goTo, slideIndex]);

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const timer = window.setInterval(goNext, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [isPaused, totalSlides, goNext]);

  const visibleReviews = MOVEFLOW_REVIEWS.slice(
    slideIndex * itemsPerView,
    slideIndex * itemsPerView + itemsPerView
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsPaused(false);
          }
        }}
      >
        <div className="flex items-stretch gap-3 lg:gap-4">
          <button
            type="button"
            onClick={goPrev}
            className="hidden md:flex shrink-0 self-center items-center justify-center w-10 h-10 rounded-full border border-border bg-white text-charcoal hover:border-green-700/30 hover:text-green-800 transition-colors"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>

          <div
            className={`flex-1 min-h-[200px] transition-opacity duration-300 ease-out ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            aria-live="polite"
            aria-atomic="true"
          >
            <div
              className="grid gap-4 md:gap-5 lg:gap-6 items-stretch"
              style={{
                gridTemplateColumns: `repeat(${itemsPerView}, minmax(0, 1fr))`,
              }}
            >
              {visibleReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={goNext}
            className="hidden md:flex shrink-0 self-center items-center justify-center w-10 h-10 rounded-full border border-border bg-white text-charcoal hover:border-green-700/30 hover:text-green-800 transition-colors"
            aria-label="Next reviews"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex md:hidden justify-center gap-4 mt-5">
          <button
            type="button"
            onClick={goPrev}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-white text-charcoal"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-white text-charcoal"
            aria-label="Next reviews"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div
        className="flex justify-center gap-2 mt-6 md:mt-8"
        role="tablist"
        aria-label="Review slides"
      >
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === slideIndex}
            aria-label={`Go to review slide ${i + 1} of ${totalSlides}`}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === slideIndex
                ? "w-8 bg-green-800"
                : "w-1.5 bg-charcoal/20 hover:bg-charcoal/35"
            }`}
          />
        ))}
      </div>

      <p className="text-center mt-6 md:mt-8">
        <a
          href={MOVEFLOW_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-green-800 hover:text-green-900 underline-offset-4 hover:underline transition-colors"
        >
          View all verified reviews
        </a>
      </p>
    </div>
  );
}

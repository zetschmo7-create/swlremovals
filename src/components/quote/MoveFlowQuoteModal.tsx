"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { Check, X } from "lucide-react";
import {
  MOVEFLOW_EMBED_URL,
  MOVEFLOW_INTAKE_URL,
} from "@/lib/moveflow";

const TRUST_POINTS = [
  "Fixed quotations",
  "Fully insured crews",
  "Video surveys available",
] as const;

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function MoveFlowQuoteModal({ isOpen, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [hasActivated, setHasActivated] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setHasActivated(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], iframe, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-6 transition-all duration-300 ${
        isOpen
          ? "visible opacity-100"
          : "invisible opacity-0 pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-green-950/65 backdrop-blur-md transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleBackdropClick}
        aria-hidden
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="moveflow-quote-title"
        aria-describedby="moveflow-quote-description"
        className={`relative z-10 flex w-full flex-col bg-cream/98 backdrop-blur-xl shadow-[0_24px_80px_rgba(15,46,31,0.28)] border border-white/20 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] max-md:h-full max-md:max-h-full max-md:rounded-none max-md:safe-bottom md:max-w-[920px] md:h-[85vh] md:rounded-2xl ${
          isOpen
            ? "translate-y-0 md:scale-100 opacity-100"
            : "translate-y-full md:translate-y-4 md:scale-[0.97] opacity-0"
        }`}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-charcoal hover:bg-white hover:text-green-900 shadow-sm transition-colors"
          aria-label="Close quote form"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>

        <div className="shrink-0 border-b border-border/60 px-5 pt-6 pb-4 md:px-8 md:pt-8 md:pb-5 pr-16">
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-green-700 mb-2">
            Smart intake
          </p>
          <h2
            id="moveflow-quote-title"
            className="font-display text-2xl md:text-3xl font-semibold text-charcoal tracking-tight"
          >
            Start your moving quotation
          </h2>
          <p
            id="moveflow-quote-description"
            className="mt-2 text-sm md:text-base text-charcoal-light leading-relaxed max-w-2xl"
          >
            Upload your move details in minutes and receive a tailored
            quotation.
          </p>
          <ul className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2">
            {TRUST_POINTS.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2 text-sm text-charcoal-light"
              >
                <Check
                  className="h-4 w-4 shrink-0 text-green-700"
                  strokeWidth={2}
                  aria-hidden
                />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 min-h-0 bg-white">
          {hasActivated && (
            <iframe
              src={MOVEFLOW_EMBED_URL}
              title="Get your moving quote"
              width="100%"
              height="100%"
              className="block h-full min-h-[420px] md:min-h-0 w-full border-0 bg-transparent"
              style={{ border: 0, background: "transparent" }}
              allow="clipboard-write"
              loading="lazy"
            />
          )}
        </div>

        <div className="shrink-0 border-t border-border/60 px-5 py-3 md:px-8 text-center bg-cream/50">
          <a
            href={MOVEFLOW_INTAKE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-charcoal-muted hover:text-green-800 transition-colors underline-offset-2 hover:underline"
          >
            Open quote form in new tab
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}

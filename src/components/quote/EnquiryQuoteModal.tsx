"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";
import { EnquiryQuoteForm } from "@/components/quote/EnquiryQuoteForm";
import { IMAGES, LOGO_DISPLAY } from "@/lib/images";
import { SITE_NAME } from "@/lib/constants";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function EnquiryQuoteModal({ isOpen, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
        aria-labelledby="enquiry-quote-title"
        aria-describedby="enquiry-quote-description"
        className={`relative z-10 flex w-full flex-col bg-cream/98 backdrop-blur-xl shadow-[0_24px_80px_rgba(15,46,31,0.28)] border border-white/20 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] max-md:h-full max-md:max-h-full max-md:rounded-none max-md:safe-bottom md:max-w-[920px] md:max-h-[90vh] md:rounded-2xl ${
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
          aria-label="Close quotation form"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>

        <div className="shrink-0 border-b border-border/60 px-5 pt-6 pb-4 md:px-8 md:pt-8 md:pb-5 pr-16">
          <Image
            src={IMAGES.navLogo}
            alt={SITE_NAME}
            width={LOGO_DISPLAY.width}
            height={LOGO_DISPLAY.height}
            className="mb-4 h-auto w-[150px] object-contain object-left"
            priority
          />
          <h2
            id="enquiry-quote-title"
            className="font-display text-2xl md:text-3xl font-semibold text-charcoal tracking-tight"
          >
            Start your moving quotation
          </h2>
          <p
            id="enquiry-quote-description"
            className="mt-2 text-sm md:text-base text-charcoal-light leading-relaxed max-w-2xl"
          >
            Send your move details and request a tailored quotation.
          </p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto bg-white/80 px-5 py-5 md:px-8 md:py-6">
          {isOpen ? <EnquiryQuoteForm variant="modal" /> : null}
        </div>
      </div>
    </div>,
    document.body
  );
}

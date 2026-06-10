"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import { NavLogo } from "@/components/layout/NavLogo";
import { QuoteTrigger } from "@/components/quote/QuoteTrigger";
import {
  SITE_NAME,
  NAV_LINKS,
  PHONE,
  PHONE_HREF,
  WHATSAPP_SURVEY_HREF,
} from "@/lib/constants";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 overflow-visible transition-[background,backdrop-filter,box-shadow,border-color,z-index] duration-700 ease-out ${
          open ? "z-40 max-lg:pointer-events-none" : "z-50"
        } ${scrolled ? "nav-glass" : "nav-hero-float"}`}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex h-14 md:h-16 items-center justify-between gap-4 lg:gap-6">
            {/* Single header logo — hidden while mobile drawer is open (drawer has its own) */}
            {!open && (
              <Link
                href="/"
                className="nav-logo-link inline-flex shrink-0 -my-6 sm:-my-8 lg:-my-10"
                aria-label={`${SITE_NAME} — home`}
              >
                <NavLogo scrolled={scrolled} />
              </Link>
            )}

            <nav
              className="hidden lg:flex items-center gap-8 xl:gap-11"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${scrolled ? "nav-link--scrolled" : "nav-link--hero"}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-6">
              <a
                href={PHONE_HREF}
                className={`nav-phone ${scrolled ? "nav-phone--scrolled" : "nav-phone--hero"}`}
              >
                <Phone className="w-3.5 h-3.5 opacity-70" strokeWidth={1.75} />
                {PHONE}
              </a>
              <QuoteTrigger
                className={`nav-cta ${scrolled ? "nav-cta--scrolled" : "nav-cta--hero"}`}
              >
                Get My Quote
              </QuoteTrigger>
            </div>

            {/* Mobile menu toggle — only when drawer is closed */}
            {!open && (
              <button
                type="button"
                className={`lg:hidden relative z-10 p-2 -mr-1 rounded-full transition-colors duration-300 ${
                  scrolled
                    ? "text-charcoal hover:bg-green-900/5"
                    : "text-cream/90 hover:bg-white/8"
                }`}
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={false}
              >
                <Menu className="w-6 h-6" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile drawer — single logo + single close control */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-500 ease-out ${
          open ? "visible" : "invisible pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-green-950/50 backdrop-blur-[2px] transition-opacity duration-500 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMenu}
          aria-hidden
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className={`absolute inset-y-0 right-0 flex h-dvh w-full max-w-sm flex-col bg-cream shadow-[-16px_0_48px_rgba(15,46,31,0.12)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex shrink-0 items-center justify-between px-5 pt-5 pb-3">
            <Link
              href="/"
              className="nav-logo-link inline-flex"
              onClick={closeMenu}
              aria-label={`${SITE_NAME} — home`}
            >
              <NavLogo scrolled variant="drawer" />
            </Link>
            <button
              type="button"
              onClick={closeMenu}
              className="rounded-full p-2 text-charcoal/70 transition-colors hover:bg-cream-dark hover:text-charcoal active:bg-cream-dark/80"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="mx-5 shrink-0 border-b border-border/60" />

          <nav
            className="flex-1 overflow-y-auto px-5 pt-3 pb-4"
            aria-label="Mobile navigation"
          >
            <ul className="space-y-0">
              {NAV_LINKS.map((link, i) => (
                <li
                  key={link.href}
                  style={{ animationDelay: open ? `${i * 40}ms` : "0ms" }}
                  className={open ? "animate-[fade-in_0.35s_ease-out_both]" : ""}
                >
                  <Link
                    href={link.href}
                    className="group flex items-center justify-between border-b border-border/40 py-3.5 font-display text-xl font-medium tracking-tight text-charcoal transition-colors duration-200 active:bg-cream-dark/50 hover:text-green-800"
                    onClick={closeMenu}
                  >
                    {link.label}
                    <ArrowRight
                      className="h-4 w-4 -translate-x-1 text-green-700 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                      strokeWidth={1.5}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="shrink-0 space-y-3 border-t border-border/50 px-5 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]">
            <QuoteTrigger
              className="nav-cta nav-cta--scrolled w-full uppercase tracking-widest"
              onClick={closeMenu}
            >
              Get My Quote
            </QuoteTrigger>
            <a
              href={WHATSAPP_SURVEY_HREF}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-green-800/20 bg-white py-3.5 text-xs font-semibold uppercase tracking-widest text-green-800 transition-colors hover:border-green-800/35 hover:bg-green-800/[0.03] active:bg-green-800/[0.06]"
            >
              Send WhatsApp Video
            </a>
            <a
              href={PHONE_HREF}
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 py-2 text-sm text-charcoal-muted transition-colors hover:text-green-800 active:text-green-900"
            >
              <Phone className="h-4 w-4" strokeWidth={1.75} />
              {PHONE}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

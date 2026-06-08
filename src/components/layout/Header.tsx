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
        className={`fixed top-0 left-0 right-0 z-50 overflow-visible transition-[background,backdrop-filter,box-shadow,border-color] duration-700 ease-out ${
          scrolled
            ? "nav-glass"
            : "nav-hero-float"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex h-14 md:h-16 items-center justify-between gap-4 lg:gap-6">
            <Link
              href="/"
              className="nav-logo-link shrink-0 -my-6 sm:-my-8 lg:-my-10"
              aria-label={`${SITE_NAME} — home`}
            >
              <NavLogo scrolled={scrolled} />
            </Link>

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

            <button
              type="button"
              className={`lg:hidden relative z-10 p-2 -mr-1 rounded-full transition-colors duration-300 ${
                open
                  ? "text-charcoal"
                  : scrolled
                    ? "text-charcoal hover:bg-green-900/5"
                    : "text-cream/90 hover:bg-white/8"
              }`}
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-500 ease-out ${
          open ? "visible" : "invisible pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-green-950/45 backdrop-blur-sm transition-opacity duration-500 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
          aria-hidden
        />
        <div
          className={`absolute inset-y-0 right-0 w-full max-w-sm bg-cream/98 backdrop-blur-xl shadow-[-12px_0_48px_rgba(15,46,31,0.1)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 pt-7 pb-5">
            <Link
              href="/"
              className="nav-logo-link"
              onClick={() => setOpen(false)}
              aria-label={`${SITE_NAME} — home`}
            >
              <NavLogo scrolled={true} variant="drawer" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-2 rounded-full text-charcoal/70 hover:text-charcoal hover:bg-cream-dark transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-4" aria-label="Mobile navigation">
            <ul className="space-y-0.5">
              {NAV_LINKS.map((link, i) => (
                <li
                  key={link.href}
                  style={{ animationDelay: open ? `${i * 45}ms` : "0ms" }}
                  className={open ? "animate-[fade-in_0.35s_ease-out_both]" : ""}
                >
                  <Link
                    href={link.href}
                    className="group flex items-center justify-between py-4 border-b border-border/50 font-display text-[1.35rem] font-medium tracking-tight text-charcoal hover:text-green-800 transition-colors duration-300"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                    <ArrowRight className="w-4 h-4 text-charcoal-muted/0 group-hover:text-green-700 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" strokeWidth={1.5} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-6 py-8 space-y-3.5">
            <QuoteTrigger
              className="nav-cta nav-cta--scrolled w-full"
              onClick={() => setOpen(false)}
            >
              Get My Quote
            </QuoteTrigger>
            <a
              href={WHATSAPP_SURVEY_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 text-xs font-semibold uppercase tracking-widest text-green-800/90 hover:text-green-900 transition-colors"
            >
              Send WhatsApp Video
            </a>
            <a
              href={PHONE_HREF}
              className="flex items-center justify-center gap-2 py-2 text-sm text-charcoal-muted hover:text-green-800 transition-colors"
            >
              <Phone className="w-4 h-4" strokeWidth={1.75} />
              {PHONE}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

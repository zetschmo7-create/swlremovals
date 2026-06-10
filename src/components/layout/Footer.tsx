import Link from "next/link";
import Image from "next/image";
import {
  SITE_NAME,
  PHONE,
  PHONE_HREF,
  EMAIL,
  EMAIL_HREF,
  BUSINESS_ADDRESS_LINE,
  WHATSAPP_HREF,
  WHATSAPP_SURVEY_HREF,
} from "@/lib/constants";
import { IMAGES, LOGO_DISPLAY } from "@/lib/images";
import { Button } from "@/components/ui/Button";
import { QuoteButton } from "@/components/quote/QuoteButton";
import { QuoteAwareLink } from "@/components/quote/QuoteAwareLink";
import { MessageCircle } from "lucide-react";

const SERVICE_FOOTER = [
  { label: "House Removals", href: "/services/house-removals" },
  { label: "Office Removals", href: "/services/office-removals" },
  { label: "Packing Services", href: "/services/packing" },
  { label: "Storage", href: "/services/storage" },
];

const CORE_AREAS = [
  { label: "Wimbledon removals", href: "/wimbledon-removals" },
  { label: "Richmond removals", href: "/richmond-removals" },
  { label: "Kingston removals", href: "/kingston-upon-thames-removals" },
  { label: "Clapham removals", href: "/clapham-removals" },
] as const;

const MORE_AREAS = [
  { label: "Fulham removals", href: "/fulham-removals" },
  { label: "Wandsworth removals", href: "/wandsworth-removals" },
  { label: "Epsom removals", href: "/epsom-removals" },
  { label: "Surrey removals", href: "/areas/surrey" },
] as const;

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Get a Quote", href: "/quote" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
] as const;

const contactLinkClass =
  "inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors min-w-0";

function FooterLinkList({
  title,
  links,
  cta,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
  cta?: { label: string; href: string };
}) {
  return (
    <div>
      <p className="text-xs font-medium tracking-widest uppercase text-white/40 mb-3">
        {title}
      </p>
      <ul className="space-y-2.5">
        {links.map((item) => (
          <li key={item.href}>
            <QuoteAwareLink
              href={item.href}
              className="text-sm text-white/70 hover:text-white transition-colors text-left"
            >
              {item.label}
            </QuoteAwareLink>
          </li>
        ))}
        {cta && (
          <li>
            <Link
              href={cta.href}
              className="text-sm text-green-500 hover:text-green-400 transition-colors"
            >
              {cta.label}
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

function FooterNapBlock() {
  return (
    <address className="mt-6 not-italic space-y-1.5 text-sm text-white/70">
      <p className="font-medium text-white/90">{SITE_NAME}</p>
      <p>{BUSINESS_ADDRESS_LINE}</p>
      <p>
        <a href={PHONE_HREF} className="hover:text-white transition-colors">
          {PHONE}
        </a>
      </p>
      <p>
        <a href={EMAIL_HREF} className="hover:text-white transition-colors">
          {EMAIL}
        </a>
      </p>
    </address>
  );
}

function FooterContactRow() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-3">
      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className={contactLinkClass}
      >
        <MessageCircle className="w-4 h-4 shrink-0" aria-hidden />
        <span>WhatsApp us</span>
      </a>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-green-950 text-white">
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <p className="font-display text-2xl md:text-3xl font-semibold">
                Ready for a fixed quotation?
              </p>
              <p className="text-white/60 mt-2 text-sm md:text-base">
                WhatsApp video survey or online form — response typically same
                day.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <QuoteButton variant="secondary" size="lg">
                Get My Quote
              </QuoteButton>
              <Button
                href={WHATSAPP_SURVEY_HREF}
                variant="whatsapp"
                size="lg"
                external
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Video
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 xl:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="nav-logo-link inline-block"
              aria-label={`${SITE_NAME} — home`}
            >
              <Image
                src={IMAGES.navLogo}
                alt={SITE_NAME}
                width={LOGO_DISPLAY.width}
                height={LOGO_DISPLAY.height}
                sizes="200px"
                className="nav-logo--hero block w-[170px] sm:w-[200px] h-auto object-contain object-left"
              />
            </Link>
            <FooterNapBlock />
          </div>

          <FooterLinkList
            title="Services"
            links={SERVICE_FOOTER}
            cta={{ label: "All services →", href: "/services" }}
          />

          <FooterLinkList title="Core areas" links={CORE_AREAS} />

          <FooterLinkList
            title="More areas"
            links={MORE_AREAS}
            cta={{ label: "All locations →", href: "/areas-covered" }}
          />

          <FooterLinkList title="Company" links={COMPANY_LINKS} />
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <FooterContactRow />
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-white/40 text-center sm:text-right">
            Fully insured · Fixed quotations · Wimbledon & South West London
          </p>
        </div>
      </div>
    </footer>
  );
}

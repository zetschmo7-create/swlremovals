import type { Metadata } from "next";
import { DM_Sans, Sora } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/layout/SiteShell";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { SeoFlowTracking } from "@/components/analytics/SeoFlowTracking";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import { defaultMetadata } from "@/lib/seo";
import { IMAGES } from "@/lib/images";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  preload: true,
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  ...defaultMetadata,
  icons: {
    icon: IMAGES.favicon,
    apple: IMAGES.favicon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${dmSans.variable} ${sora.variable} h-full antialiased`}
    >
      <head>
        <GoogleAnalytics />
        <SeoFlowTracking />
      </head>
      <body
        className="min-h-full flex flex-col font-sans max-lg:pb-[var(--mobile-cta-inset)] lg:pb-0"
        data-analytics-ready="true"
      >
        <LocalBusinessSchema />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-charcoal focus:shadow-[var(--shadow-elevated)]"
        >
          Skip to main content
        </a>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}

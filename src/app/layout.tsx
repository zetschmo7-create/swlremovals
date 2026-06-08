import type { Metadata } from "next";
import { DM_Sans, Sora } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCTABar } from "@/components/layout/MobileCTABar";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { StickyQuoteCTA } from "@/components/layout/StickyQuoteCTA";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import { MoveFlowModalProvider } from "@/context/MoveFlowModalContext";
import { defaultMetadata } from "@/lib/seo";
import { IMAGES } from "@/lib/images";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      <body
        className="min-h-full flex flex-col font-sans pb-16 lg:pb-0"
        data-analytics-ready="true"
      >
        <LocalBusinessSchema />
        <MoveFlowModalProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <StickyQuoteCTA />
          <MobileCTABar />
          <WhatsAppFloat />
        </MoveFlowModalProvider>
      </body>
    </html>
  );
}

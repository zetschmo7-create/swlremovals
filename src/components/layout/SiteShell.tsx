"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCTABar } from "@/components/layout/MobileCTABar";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { StickyQuoteCTA } from "@/components/layout/StickyQuoteCTA";
import { MoveFlowModalProvider } from "@/context/MoveFlowModalContext";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <MoveFlowModalProvider>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <StickyQuoteCTA />
      <MobileCTABar />
      <WhatsAppFloat />
    </MoveFlowModalProvider>
  );
}

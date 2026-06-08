"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { QuoteTrigger } from "@/components/quote/QuoteTrigger";

export function StickyQuoteCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="hidden md:block fixed top-20 right-6 z-40 animate-[fade-in_0.3s_ease-out]">
      <QuoteTrigger className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-green-800 text-white text-sm font-medium shadow-[var(--shadow-elevated)] hover:bg-green-900 hover:scale-105 transition-all duration-300">
        <FileText className="w-4 h-4" />
        Get My Quote
      </QuoteTrigger>
    </div>
  );
}

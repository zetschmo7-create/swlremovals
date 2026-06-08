"use client";

import { MessageCircle } from "lucide-react";
import { WHATSAPP_HREF } from "@/lib/constants";

export function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden lg:flex fixed bottom-8 right-8 z-50 w-14 h-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[var(--shadow-elevated)] hover:bg-[#1fb855] hover:scale-105 transition-all duration-300"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}

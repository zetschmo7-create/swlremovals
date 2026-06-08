"use client";

import { MessageCircle, Phone, FileText } from "lucide-react";
import {
  WHATSAPP_HREF,
  PHONE_HREF,
} from "@/lib/constants";
import { QuoteTrigger } from "@/components/quote/QuoteTrigger";

export function MobileCTABar() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="glass-dark border-t border-white/10">
        <div className="grid grid-cols-3 divide-x divide-white/10">
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-3 px-2 text-white hover:bg-white/5 transition-colors"
          >
            <MessageCircle className="w-5 h-5 mb-1 text-[#25D366]" />
            <span className="text-[11px] font-medium">WhatsApp</span>
          </a>
          <a
            href={PHONE_HREF}
            className="flex flex-col items-center justify-center py-3 px-2 text-white hover:bg-white/5 transition-colors"
          >
            <Phone className="w-5 h-5 mb-1" />
            <span className="text-[11px] font-medium">Call</span>
          </a>
          <QuoteTrigger className="flex flex-col items-center justify-center py-3 px-2 text-white hover:bg-white/5 transition-colors">
            <FileText className="w-5 h-5 mb-1" />
            <span className="text-[11px] font-medium">Get My Quote</span>
          </QuoteTrigger>
        </div>
      </div>
    </div>
  );
}

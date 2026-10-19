"use client";

import { useEffect } from "react";
import { trackLeadInteraction } from "@/lib/lead-tracking";

export function LeadInteractionTracking() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.protocol === "tel:") {
        trackLeadInteraction("phone_click", "website_link");
      } else if (destination.hostname === "wa.me" || destination.hostname === "api.whatsapp.com") {
        trackLeadInteraction("whatsapp_click", "website_link");
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}

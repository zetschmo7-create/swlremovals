type LeadEvent = "phone_click" | "whatsapp_click" | "quote_form_open" | "quote_form_ready";

/** Interaction signals only. A click is not a confirmed enquiry or booking. */
export function trackLeadInteraction(event: LeadEvent, source: string) {
  if (typeof window === "undefined") return;
  try {
    if (window.localStorage.getItem("swl-analytics-consent-v1") !== "granted") return;
    const analyticsWindow = window as Window & {
      gtag?: (command: string, name: string, parameters: Record<string, string>) => void;
    };
    analyticsWindow.gtag?.("event", event, {
      event_category: "contact_intent",
      contact_source: source,
      page_path: window.location.pathname,
    });
  } catch {
    // Optional analytics must never interrupt contact links or an enquiry.
  }
}

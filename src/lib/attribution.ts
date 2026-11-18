/**
 * Capture first-touch attribution in sessionStorage (client only).
 * Kept small and privacy-light — no form field values.
 */

const STORAGE_KEY = "swl_attribution_v1";

export type StoredAttribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  landing_page?: string;
  referrer?: string;
  first_visit_at?: string;
};

function readStored(): StoredAttribution | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAttribution;
  } catch {
    return null;
  }
}

function writeStored(value: StoredAttribution): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Ignore quota / private mode failures
  }
}

/** Call once on landing pages to freeze first-touch params. */
export function captureAttributionOnLanding(): void {
  if (typeof window === "undefined") return;
  if (readStored()) return;

  const params = new URLSearchParams(window.location.search);
  const pick = (key: string) => {
    const value = params.get(key)?.trim();
    return value ? value.slice(0, 200) : undefined;
  };

  const attribution: StoredAttribution = {
    utm_source: pick("utm_source"),
    utm_medium: pick("utm_medium"),
    utm_campaign: pick("utm_campaign"),
    utm_term: pick("utm_term"),
    utm_content: pick("utm_content"),
    gclid: pick("gclid"),
    gbraid: pick("gbraid"),
    wbraid: pick("wbraid"),
    landing_page: window.location.href.slice(0, 500),
    referrer: document.referrer ? document.referrer.slice(0, 500) : undefined,
    first_visit_at: new Date().toISOString(),
  };

  writeStored(attribution);
}

export function getStoredAttribution(): StoredAttribution | undefined {
  if (typeof window === "undefined") return undefined;
  return readStored() ?? undefined;
}

"use client";

import Script from "next/script";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

export const GA_MEASUREMENT_ID = "G-5YWQH7FKBC";
const CONSENT_KEY = "swl-analytics-consent-v1";
const CONSENT_EVENT = "swl-analytics-consent";

function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(CONSENT_EVENT, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(CONSENT_EVENT, listener);
  };
}

function preference() {
  try { return window.localStorage.getItem(CONSENT_KEY) || "unknown"; }
  catch { return "unknown"; }
}

export function GoogleAnalytics() {
  const consent = useSyncExternalStore(subscribe, preference, () => "pending");
  const [editing, setEditing] = useState(false);
  const choose = (value: "granted" | "denied") => {
    const analyticsWindow = window as Window & { gtag?: (...args: unknown[]) => void };
    Reflect.set(window, `ga-disable-${GA_MEASUREMENT_ID}`, value === "denied");
    analyticsWindow.gtag?.("consent", "update", { analytics_storage: value, ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    if (value === "denied") {
      for (const cookie of document.cookie.split(";")) {
        const name = cookie.split("=")[0].trim();
        if (name === "_ga" || name.startsWith("_ga_")) {
          for (const domain of ["", "; domain=swlremovals.co.uk", "; domain=www.swlremovals.co.uk"]) {
            document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
          }
        }
      }
    }
    try { window.localStorage.setItem(CONSENT_KEY, value); } catch { /* Keep site usable when storage is unavailable. */ }
    window.dispatchEvent(new Event(CONSENT_EVENT));
    setEditing(false);
  };
  if (consent === "pending") return null;
  return (
    <>
      {consent === "unknown" || editing ? <section aria-label="Analytics preferences" className="fixed bottom-24 left-3 right-3 z-[250] max-w-md rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-elevated)] md:bottom-5 md:right-auto md:left-5">
        <p className="font-semibold text-charcoal">Optional analytics</p>
        <p className="mt-2 text-sm text-charcoal-light">Allow Google Analytics to help us understand visits and contact-button use? You can use the website with analytics off. <Link href="/privacy" className="underline">Privacy information</Link></p>
        <div className="mt-4 flex flex-wrap gap-3"><button type="button" className="rounded-lg border border-green-800 px-4 py-2 text-sm text-green-900" onClick={() => choose("denied")}>Keep analytics off</button><button type="button" className="rounded-lg bg-green-800 px-4 py-2 text-sm text-white" onClick={() => choose("granted")}>Allow analytics</button></div>
      </section> : <button type="button" onClick={() => setEditing(true)} className="fixed bottom-20 left-3 z-40 rounded border border-border bg-white/95 px-2 py-1 text-xs text-charcoal-light md:bottom-3">Analytics settings</button>}
      {consent === "granted" && <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'});
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {allow_google_signals: false, allow_ad_personalization_signals: false});
        `}
      </Script>
      </>}
    </>
  );
}

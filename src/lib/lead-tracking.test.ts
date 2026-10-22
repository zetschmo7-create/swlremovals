import assert from "node:assert/strict";
import test from "node:test";
import { trackLeadInteraction } from "./lead-tracking";

test("contact tracking honours consent and sends no form details", () => {
  const calls: unknown[][] = [];
  let consent: string | null = null;
  const previous = Object.getOwnPropertyDescriptor(globalThis, "window");
  const mockWindow = {
    localStorage: { getItem: () => consent },
    location: { pathname: "/quote", search: "?email=private@example.test" },
    gtag: (...args: unknown[]) => calls.push(args),
  };
  Object.defineProperty(globalThis, "window", { configurable: true, value: mockWindow });
  try {
    for (const value of [null, "unknown", "denied"]) {
      consent = value;
      trackLeadInteraction("quote_form_open", "native_enquiry_page");
    }
    assert.equal(calls.length, 0);
    consent = "granted";
    trackLeadInteraction("quote_form_ready", "native_enquiry_page_accepted");
    assert.deepEqual(calls, [["event", "quote_form_ready", {
      event_category: "contact_intent",
      contact_source: "native_enquiry_page_accepted",
      page_path: "/quote",
    }]]);
    consent = "denied";
    trackLeadInteraction("whatsapp_click", "website_link");
    assert.equal(calls.length, 1, "revoked consent must stop even an existing gtag");
    mockWindow.localStorage.getItem = () => { throw new Error("Storage unavailable"); };
    assert.doesNotThrow(() => trackLeadInteraction("quote_form_open", "native_enquiry_page"));
    assert.equal(calls.length, 1);
    mockWindow.localStorage.getItem = () => "granted";
    mockWindow.gtag = () => { throw new Error("Analytics unavailable"); };
    assert.doesNotThrow(() => trackLeadInteraction("quote_form_ready", "native_enquiry_page_accepted"));
  } finally {
    if (previous) Object.defineProperty(globalThis, "window", previous);
    else Reflect.deleteProperty(globalThis, "window");
  }
});

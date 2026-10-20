import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ENQUIRY_SURVEY_WHATSAPP_NUMBER,
  ENQUIRY_SURVEY_WHATSAPP_URL,
  buildCustomerAcknowledgementContent,
  buildEnquiryEmailContent,
  escapeHtml,
  firstNameFromFullName,
  validateEnquiryPayload,
} from "./enquiry";
import { buildIdempotencyKey } from "./enquiry-email";
import {
  isDuplicateEnquiry,
  markEnquirySubmitted,
} from "./enquiry-rate-limit";

describe("validateEnquiryPayload", () => {
  it("accepts a complete valid enquiry", () => {
    const result = validateEnquiryPayload({
      fullName: "Jane Smith",
      phone: "07700900123",
      email: "jane@example.com",
      propertyType: "House",
      collectionPostcode: "SW19 1AA",
      deliveryPostcode: "KT1 2AB",
      bedrooms: "3",
      timeframe: "This month",
      moveDate: "2026-11-01",
      collectionAddress: "",
      deliveryAddress: "",
      pageUrl: "https://www.swlremovals.co.uk/quote",
      companyWebsite: "",
    });
    assert.equal(result.ok, true);
  });

  it("rejects invalid email and marks optional blanks later in email", () => {
    const result = validateEnquiryPayload({
      fullName: "Jane Smith",
      phone: "",
      email: "not-an-email",
      propertyType: "Flat",
      collectionPostcode: "SW19 1AA",
      deliveryPostcode: "KT1 2AB",
      bedrooms: "2",
      timeframe: "Within 2 weeks",
      moveDate: "",
      collectionAddress: "",
      deliveryAddress: "",
      pageUrl: "/",
    });
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.ok(result.errors.email);
    }
  });
});

describe("buildEnquiryEmailContent", () => {
  it("includes submission reference and marks blank optional fields", () => {
    const { text, subject } = buildEnquiryEmailContent(
      {
        fullName: "Jane Smith",
        phone: "",
        email: "jane@example.com",
        propertyType: "House",
        collectionPostcode: "SW19 1AA",
        deliveryPostcode: "KT1 2AB",
        bedrooms: "3",
        timeframe: "This month",
        moveDate: "",
        collectionAddress: "",
        deliveryAddress: "",
        pageUrl: "https://www.swlremovals.co.uk/",
      },
      "2026-10-19T12:00:00.000Z",
      "SWL-TEST-REF-001"
    );
    assert.match(subject, /Jane Smith/);
    assert.match(text, /Submission reference: SWL-TEST-REF-001/);
    assert.match(text, /Phone: Not provided/);
    assert.match(text, /Exact moving date: Not provided/);
  });
});

describe("buildCustomerAcknowledgementContent", () => {
  it("uses required wording, WhatsApp number, and escapes the name", () => {
    const { subject, text, html } = buildCustomerAcknowledgementContent(
      `<script>alert(1)</script> Jones`
    );
    assert.equal(subject, "We’ve received your moving enquiry");
    assert.match(text, /^Hi <script>alert\(1\)<\/script>/);
    assert.match(
      text,
      /Thank you for contacting South West London Removals\./
    );
    assert.match(
      text,
      /Our team will be in touch shortly to discuss your move\./
    );
    assert.match(
      text,
      /Alternatively, WhatsApp us to arrange a free, no-obligation home survey:/
    );
    assert.match(text, new RegExp(ENQUIRY_SURVEY_WHATSAPP_URL));
    assert.match(text, /Kind regards,\nSouth West London Removals/);
    assert.equal(ENQUIRY_SURVEY_WHATSAPP_NUMBER, "447522908555");
    assert.match(html, /Message us on WhatsApp/);
    assert.match(html, /wa\.me\/447522908555/);
    assert.doesNotMatch(html, /<script>/);
    assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
    assert.doesNotMatch(text, /moveflow/i);
    assert.doesNotMatch(html, /moveflow/i);
    assert.doesNotMatch(text, /quote.?ready|already booked/i);
  });

  it("treats anti-autofill honeypot field as bot signal", () => {
    const result = validateEnquiryPayload({
      fullName: "Jane Smith",
      phone: "",
      email: "jane@example.com",
      propertyType: "House",
      collectionPostcode: "SW19 1AA",
      deliveryPostcode: "KT1 2AB",
      bedrooms: "3",
      timeframe: "This month",
      moveDate: "",
      collectionAddress: "",
      deliveryAddress: "",
      pageUrl: "/",
      swl_hp_token: "https://spam.example",
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.data.companyWebsite, "https://spam.example");
    }
  });


  it("falls back to a safe greeting when the name is blank after trim", () => {
    assert.equal(firstNameFromFullName("   "), "there");
    assert.equal(escapeHtml(`a&b<"c"`), "a&amp;b&lt;&quot;c&quot;");
  });
});

describe("enquiry duplicate protection", () => {
  it("does not mark a fingerprint until markEnquirySubmitted is called", () => {
    const fingerprint = `test-${Date.now()}-${Math.random()}`;
    assert.equal(isDuplicateEnquiry(fingerprint), false);
    assert.equal(isDuplicateEnquiry(fingerprint), false);
    markEnquirySubmitted(fingerprint);
    assert.equal(isDuplicateEnquiry(fingerprint), true);
  });
});

describe("buildIdempotencyKey", () => {
  it("keeps business and acknowledgement keys distinct and stable", () => {
    const businessA = buildIdempotencyKey(
      "SWL-REF",
      "business",
      "info@swlremovals.co.uk"
    );
    const businessB = buildIdempotencyKey(
      "SWL-REF",
      "business",
      "info@swlremovals.co.uk"
    );
    const ack = buildIdempotencyKey(
      "SWL-REF",
      "ack",
      "info@swlremovals.co.uk"
    );
    assert.equal(businessA, businessB);
    assert.notEqual(businessA, ack);
    assert.match(businessA, /^swl-business-/);
    assert.match(ack, /^swl-ack-/);
  });
});

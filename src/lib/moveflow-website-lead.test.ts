import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  MOVEFLOW_CONSENT_DISCLOSURE_TEXT,
  MOVEFLOW_CONSENT_DISCLOSURE_VERSION,
} from "./enquiry";
import {
  buildMoveFlowWebsiteLeadPayload,
  mapBedroomsToMoveFlow,
  shouldRetryMoveFlowStatus,
  signMoveFlowWebsiteLead,
  splitCustomerName,
} from "./moveflow-website-lead";
import type { EnquiryPayload } from "./enquiry";

const baseData = (): EnquiryPayload => ({
  fullName: "Jane Smith",
  phone: "07700900123",
  email: "jane@example.com",
  propertyType: "House",
  collectionPostcode: "SW19 1AA",
  deliveryPostcode: "KT1 2AB",
  collectionPostcodeAsTyped: "sw19 1aa",
  deliveryPostcodeAsTyped: "kt1 2ab",
  bedrooms: "3",
  timeframe: "This month",
  moveDate: "",
  collectionAddress: "",
  deliveryAddress: "",
  pageUrl: "https://www.swlremovals.co.uk/quote",
  consentAccepted: true,
});

describe("signMoveFlowWebsiteLead", () => {
  it("matches the official test vector", () => {
    const signature = signMoveFlowWebsiteLead(
      "test-secret-not-real",
      "1763393400",
      '{"hello":"world"}'
    );
    assert.equal(
      signature,
      "v1=632470d18a426262bd9d2e26c9e7ced37755b86a6f8e8903f1f781a6746b0d13"
    );
  });
});

describe("buildMoveFlowWebsiteLeadPayload", () => {
  it("omits missing bedrooms (not 0), keeps typed postcode and phone, stable submission_id", () => {
    const data = baseData();
    data.bedrooms = "";
    data.phone = " 07 700 900 123 ";
    const a = buildMoveFlowWebsiteLeadPayload({
      data,
      phoneAsTyped: " 07 700 900 123 ",
      collectionPostcodeAsTyped: "SW11",
      deliveryPostcodeAsTyped: "kt1",
      consentAccepted: true,
      consentAcceptedAt: "2026-11-17T15:30:00Z",
      submissionId: "11111111-1111-4111-8111-111111111111",
      submittedAt: "2026-11-17T15:30:00Z",
    });
    assert.ok(a);
    assert.equal(a!.submission_id, "11111111-1111-4111-8111-111111111111");
    const move = a!.move as Record<string, unknown>;
    assert.equal("bedrooms" in move, false);
    assert.equal(mapBedroomsToMoveFlow(""), undefined);
    assert.equal(mapBedroomsToMoveFlow("Studio"), 0);

    const from = move.from as Record<string, unknown>;
    assert.equal(from.postcode, "SW11");
    const customer = a!.customer as Record<string, unknown>;
    assert.equal(customer.phone, "07 700 900 123");

    const b = buildMoveFlowWebsiteLeadPayload({
      data,
      phoneAsTyped: " 07 700 900 123 ",
      collectionPostcodeAsTyped: "SW11",
      deliveryPostcodeAsTyped: "kt1",
      consentAccepted: true,
      submissionId: "11111111-1111-4111-8111-111111111111",
      submittedAt: "2026-11-17T15:30:00Z",
    });
    assert.equal(b!.submission_id, a!.submission_id);
  });

  it("uses exact consent wording and disclosure_shown false when unticked", () => {
    const accepted = buildMoveFlowWebsiteLeadPayload({
      data: baseData(),
      phoneAsTyped: "07700900123",
      collectionPostcodeAsTyped: "SW19 1AA",
      deliveryPostcodeAsTyped: "KT1 2AB",
      consentAccepted: true,
      consentAcceptedAt: "2026-11-17T15:30:00Z",
      submissionId: "22222222-2222-4222-8222-222222222222",
    });
    const consent = accepted!.consent as Record<string, unknown>;
    assert.equal(consent.disclosure_text, MOVEFLOW_CONSENT_DISCLOSURE_TEXT);
    assert.equal(
      consent.disclosure_version,
      MOVEFLOW_CONSENT_DISCLOSURE_VERSION
    );
    assert.equal(consent.disclosure_shown, true);
    assert.equal(consent.accepted_at, "2026-11-17T15:30:00Z");

    const declined = buildMoveFlowWebsiteLeadPayload({
      data: { ...baseData(), consentAccepted: false },
      phoneAsTyped: "07700900123",
      collectionPostcodeAsTyped: "SW19 1AA",
      deliveryPostcodeAsTyped: "KT1 2AB",
      consentAccepted: false,
      submissionId: "33333333-3333-4333-8333-333333333333",
    });
    const declinedConsent = declined!.consent as Record<string, unknown>;
    assert.equal(declinedConsent.disclosure_shown, false);
    assert.equal("accepted_at" in declinedConsent, false);
  });

  it("returns null when phone is too short rather than inventing one", () => {
    const payload = buildMoveFlowWebsiteLeadPayload({
      data: { ...baseData(), phone: "" },
      phoneAsTyped: "123",
      collectionPostcodeAsTyped: "SW19 1AA",
      deliveryPostcodeAsTyped: "KT1 2AB",
      consentAccepted: false,
    });
    assert.equal(payload, null);
  });
});

describe("retry policy helpers", () => {
  it("retries only 5xx statuses", () => {
    assert.equal(shouldRetryMoveFlowStatus(503), true);
    assert.equal(shouldRetryMoveFlowStatus(500), true);
    assert.equal(shouldRetryMoveFlowStatus(400), false);
    assert.equal(shouldRetryMoveFlowStatus(401), false);
    assert.equal(shouldRetryMoveFlowStatus(422), false);
    assert.equal(shouldRetryMoveFlowStatus(202), false);
  });

  it("splits names without inventing a last name", () => {
    assert.deepEqual(splitCustomerName("Jane"), { first_name: "Jane" });
    assert.deepEqual(splitCustomerName("Jane Smith"), {
      first_name: "Jane",
      last_name: "Smith",
    });
  });
});

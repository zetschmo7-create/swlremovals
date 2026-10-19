import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildEnquiryEmailContent,
  validateEnquiryPayload,
} from "./enquiry";

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
  it("marks blank optional fields as Not provided", () => {
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
      "2026-10-19T12:00:00.000Z"
    );
    assert.match(subject, /Jane Smith/);
    assert.match(text, /Phone: Not provided/);
    assert.match(text, /Exact moving date: Not provided/);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildCommercialIntelligence,
  computeJobCommercialValue,
  isCommerciallyWonJob,
  DEPOSIT_TO_FULL_VALUE_MULTIPLIER,
} from "./commercial-intelligence";
import type { ImveJobRecord } from "./imve-types";
import { DEFAULT_JARVIS_SETTINGS } from "./settings-store";

function baseJob(overrides: Partial<ImveJobRecord> = {}): ImveJobRecord {
  return {
    imve_id: "job-1",
    job_reference: "RR1001",
    customer_name: "Test Customer",
    customer_email: "test@example.com",
    customer_phone: null,
    job_creation_date: null,
    move_date: null,
    from_postcode: "GU1 1AA",
    to_postcode: null,
    from_area: "GU",
    lead_source: "Compare My Move",
    status: "Enquiry",
    quote_value: null,
    total_amount: null,
    invoice_amount: null,
    invoice_number: null,
    invoice_status: null,
    deposit_invoice_number: null,
    deposit_status: null,
    booked: false,
    deposit_paid: false,
    deposit_paid_at: null,
    deposit_amount: null,
    turnover: null,
    commission: null,
    source_file_hash: "hash",
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

describe("isCommerciallyWonJob", () => {
  it("detects won status keywords", () => {
    assert.equal(isCommerciallyWonJob(baseJob({ status: "Deposit Paid" })), true);
    assert.equal(isCommerciallyWonJob(baseJob({ status: "Accepted" })), true);
    assert.equal(isCommerciallyWonJob(baseJob({ status: "Enquiry" })), false);
  });

  it("detects deposit amount without status", () => {
    assert.equal(
      isCommerciallyWonJob(baseJob({ deposit_amount: 199.56 })),
      true
    );
  });

  it("detects deposit invoice number", () => {
    assert.equal(
      isCommerciallyWonJob(
        baseJob({ deposit_invoice_number: "DEP-123", status: "Quoted" })
      ),
      true
    );
  });
});

describe("computeJobCommercialValue", () => {
  it("estimates from deposit × 5 when no totals", () => {
    const value = computeJobCommercialValue(
      baseJob({ deposit_amount: 199.56, status: "Deposit Paid" })
    );
    assert.equal(value.confidence, "estimated");
    assert.equal(value.source, "deposit_estimate");
    assert.equal(
      Math.round(value.value * 100),
      Math.round(199.56 * DEPOSIT_TO_FULL_VALUE_MULTIPLIER * 100)
    );
    assert.equal(value.value, 997.8);
  });

  it("uses Total Amount as actual when present", () => {
    const value = computeJobCommercialValue(
      baseJob({
        total_amount: 997.82,
        deposit_amount: 199.56,
        status: "Booked",
      })
    );
    assert.equal(value.confidence, "actual");
    assert.equal(value.source, "total_amount");
    assert.equal(value.value, 997.82);
  });

  it("uses Invoice Amount when no total", () => {
    const value = computeJobCommercialValue(
      baseJob({
        invoice_amount: 850,
        status: "Invoice Sent",
      })
    );
    assert.equal(value.confidence, "actual");
    assert.equal(value.source, "invoice_amount");
    assert.equal(value.value, 850);
  });

  it("prefers total over invoice amount", () => {
    const value = computeJobCommercialValue(
      baseJob({
        total_amount: 1200,
        invoice_amount: 900,
      })
    );
    assert.equal(value.value, 1200);
    assert.equal(value.source, "total_amount");
  });
});

describe("buildCommercialIntelligence", () => {
  it("aggregates GU area won turnover without CMM matching", () => {
    const jobs = [
      baseJob({
        imve_id: "gu-1",
        from_area: "GU",
        status: "Booked",
        total_amount: 1000,
      }),
      baseJob({
        imve_id: "gu-2",
        from_area: "GU",
        status: "Enquiry",
      }),
    ];

    const report = buildCommercialIntelligence(jobs, [], DEFAULT_JARVIS_SETTINGS);
    const gu = report.byArea.find((a) => a.area === "GU");
    assert.ok(gu);
    assert.equal(gu.wonJobs, 1);
    assert.equal(gu.enquiries, 2);
    assert.equal(gu.wonTurnover, 1000);
    assert.equal(gu.forecastCommission, 100);
  });

  it("reports best area and total forecast commission", () => {
    const jobs = [
      baseJob({
        imve_id: "gu-1",
        from_area: "GU",
        lead_source: "Compare My Move",
        deposit_amount: 200,
        deposit_status: "Paid",
      }),
      baseJob({
        imve_id: "rh-1",
        from_area: "RH",
        lead_source: "Google",
        total_amount: 500,
        status: "Completed",
      }),
    ];

    const cmmLeads = [
      {
        lead_id: "l1",
        gmail_message_id: "m1",
        gmail_thread_id: "t1",
        received_at: "2026-01-01",
        received_date_key: "2026-01-01",
        customer_name: "A",
        customer_email: null,
        customer_phone: null,
        flexible: null,
        current_address: null,
        current_postcode: "GU1 1AA",
        current_area_prefix: "GU" as const,
        bedrooms: null,
        home_type: null,
        new_address: null,
        new_postcode: null,
        additional_services: null,
        additional_information: null,
        number_of_other_companies: null,
        cmm_internal_id: null,
        collection_address: null,
        collection_postcode: "GU1 1AA",
        collection_postcode_area: "GU" as const,
        delivery_address: null,
        delivery_postcode: null,
        move_date: null,
        property_size: null,
        external_lead_id: null,
        lead_source: "Compare My Move",
        lead_cost: 10.95,
        raw_subject: "",
        raw_snippet: "",
        confidence_score: 1,
        needs_review_reason: null,
      },
    ];

    const report = buildCommercialIntelligence(
      jobs,
      cmmLeads,
      DEFAULT_JARVIS_SETTINGS
    );

    assert.equal(report.summary.wonJobs, 2);
    assert.equal(report.summary.forecastCommission, 100 + 50);
    assert.ok(report.summary.bestAreaRoi);
    assert.ok(report.summary.bestSource);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { JarvisBriefing } from "./types";
import {
  answerCommercialIntelligenceQuestion,
  detectCommercialIntent,
  genericJarvisFallback,
} from "./ask-jarvis-commercial";
import { buildCommercialIntelligence } from "./commercial-intelligence";
import { DEFAULT_JARVIS_SETTINGS } from "./settings-store";
import type { ImveJobRecord } from "./imve-types";

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
    status: "Deposit Paid",
    quote_value: null,
    total_amount: 997.82,
    invoice_amount: null,
    invoice_number: null,
    invoice_status: null,
    deposit_invoice_number: "DEP-1",
    deposit_status: "Paid",
    booked: true,
    deposit_paid: true,
    deposit_paid_at: null,
    deposit_amount: 199.56,
    turnover: null,
    commission: null,
    source_file_hash: "hash",
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

function briefingWithJobs(jobs: ImveJobRecord[]): JarvisBriefing {
  const commercialIntelligence = buildCommercialIntelligence(
    jobs,
    [],
    DEFAULT_JARVIS_SETTINGS
  );
  return {
    commercialIntelligence,
  } as JarvisBriefing;
}

describe("detectCommercialIntent", () => {
  it("detects breakdown requests", () => {
    assert.equal(detectCommercialIntent("Jarvis give me a breakdown"), "overview");
    assert.equal(detectCommercialIntent("give me a business breakdown"), "overview");
    assert.equal(detectCommercialIntent("what's the situation?"), "overview");
  });

  it("detects area and source intents", () => {
    assert.equal(detectCommercialIntent("what areas are performing?"), "areas");
    assert.equal(detectCommercialIntent("where is the money coming from?"), "overview");
    assert.equal(detectCommercialIntent("show source performance"), "source");
  });

  it("detects actions and commission intents", () => {
    assert.equal(detectCommercialIntent("what should I focus on?"), "actions");
    assert.equal(detectCommercialIntent("highest ROI tasks"), "actions");
    assert.equal(detectCommercialIntent("forecast commission"), "commission");
  });
});

describe("answerCommercialIntelligenceQuestion", () => {
  it("returns commercial overview for breakdown question", () => {
    const answer = answerCommercialIntelligenceQuestion(
      briefingWithJobs([baseJob()]),
      "Jarvis give me a breakdown",
      { voice: true }
    );
    assert.ok(answer);
    assert.match(answer, /won or deposit-active jobs/i);
    assert.match(answer, /forecast commission/i);
    assert.match(answer, /GU/i);
    assert.doesNotMatch(answer, /I can answer questions about/i);
  });

  it("returns missing data message when i-MVE not loaded", () => {
    const answer = answerCommercialIntelligenceQuestion(
      { commercialIntelligence: buildCommercialIntelligence([], [], DEFAULT_JARVIS_SETTINGS) } as JarvisBriefing,
      "give me a breakdown"
    );
    assert.equal(
      answer,
      "Commercial Intelligence data is not loaded yet. Re-import i-MVE exports first."
    );
  });
});

describe("genericJarvisFallback", () => {
  it("only returns capability list for explicit help questions", () => {
    assert.match(genericJarvisFallback("what can you do?"), /I can answer questions/i);
    assert.doesNotMatch(genericJarvisFallback("random question"), /I can answer questions/i);
  });
});

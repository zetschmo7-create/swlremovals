import type { EmailEvent } from "./email-events";
import type { JobLedger, JobRecord, JobStage, PostcodeArea } from "./types";
import { extractPostcodeArea } from "./extractors";
import type { JarvisSettings } from "./settings-store";

const STAGE_RANK: Record<JobStage, number> = {
  lead_received: 1,
  survey_booked: 2,
  quote_sent: 3,
  quote_accepted: 4,
  deposit_invoice_sent: 5,
  deposit_paid: 6,
  move_invoice_sent: 7,
  move_completed: 8,
  lost_or_declined: 0,
  needs_review: 0,
};

function emptyJob(key: string): JobRecord {
  return {
    job_key: key,
    job_reference: null,
    customer_name: null,
    customer_email: null,
    lead_source: null,
    lead_received_at: null,
    moving_from_postcode: null,
    moving_from_postcode_area: "Unknown",
    moving_to_postcode: null,
    survey_booked_at: null,
    quote_sent_at: null,
    quote_accepted_at: null,
    deposit_invoice_sent_at: null,
    deposit_receipt_received_at: null,
    move_invoice_sent_at: null,
    move_date: null,
    quote_value: null,
    deposit_value: null,
    final_move_value: null,
    commission_payable: false,
    commission_value: null,
    current_stage: "needs_review",
    source_emails: [],
    source_pdfs: [],
    confidence_score: 0.5,
    needs_manual_review_reason: null,
    duplicate_ignored_events: [],
  };
}

function findJobIndex(jobs: JobRecord[], event: EmailEvent): number {
  if (event.jobReference) {
    const idx = jobs.findIndex((j) => j.job_reference === event.jobReference);
    if (idx >= 0) return idx;
  }
  if (event.customerEmail) {
    const idx = jobs.findIndex(
      (j) => j.customer_email?.toLowerCase() === event.customerEmail?.toLowerCase()
    );
    if (idx >= 0) return idx;
  }
  if (event.customerName && event.moveDate) {
    const idx = jobs.findIndex(
      (j) =>
        j.customer_name?.toLowerCase() === event.customerName?.toLowerCase() &&
        j.move_date === event.moveDate
    );
    if (idx >= 0) return idx;
  }
  if (event.threadId) {
    const idx = jobs.findIndex((j) => j.source_emails.includes(event.threadId));
    if (idx >= 0) return idx;
  }
  if (event.customerName) {
    const idx = jobs.findIndex(
      (j) => j.customer_name?.toLowerCase() === event.customerName?.toLowerCase()
    );
    if (idx >= 0) return idx;
  }
  return -1;
}

function eventToStage(eventType: EmailEvent["eventType"]): JobStage | null {
  switch (eventType) {
    case "cmm_lead":
      return "lead_received";
    case "survey_booking":
      return "survey_booked";
    case "quote_sent":
      return "quote_sent";
    case "quote_acceptance":
      return "quote_accepted";
    case "deposit_invoice":
      return "deposit_invoice_sent";
    case "deposit_receipt":
      return "deposit_paid";
    case "move_invoice":
      return "move_invoice_sent";
    case "move_completed":
      return "move_completed";
    default:
      return null;
  }
}

function applyEvent(job: JobRecord, event: EmailEvent, settings: JarvisSettings) {
  if (!job.source_emails.includes(event.emailId)) {
    job.source_emails.push(event.emailId);
  }
  if (event.pdfSource && !job.source_pdfs.includes(event.pdfSource)) {
    job.source_pdfs.push(event.pdfSource);
  }

  if (event.jobReference) job.job_reference = event.jobReference;
  if (event.customerName) job.customer_name = event.customerName;
  if (event.customerEmail) job.customer_email = event.customerEmail;
  if (event.movingFromPostcode) {
    job.moving_from_postcode = event.movingFromPostcode;
    job.moving_from_postcode_area = extractPostcodeArea(event.movingFromPostcode);
  }
  if (event.movingToPostcode) job.moving_to_postcode = event.movingToPostcode;
  if (event.moveDate) job.move_date = event.moveDate;

  const dateIso = event.date || null;

  switch (event.eventType) {
    case "cmm_lead":
      job.lead_source = settings.leadProviderName;
      if (!job.lead_received_at) job.lead_received_at = dateIso;
      break;
    case "survey_booking":
      if (!job.survey_booked_at) job.survey_booked_at = dateIso;
      break;
    case "quote_sent":
      if (!job.quote_sent_at) job.quote_sent_at = dateIso;
      break;
    case "quote_acceptance":
      if (!job.quote_accepted_at) job.quote_accepted_at = dateIso;
      if (event.totalValue != null) job.quote_value = event.totalValue;
      break;
    case "deposit_invoice":
      if (!job.deposit_invoice_sent_at) job.deposit_invoice_sent_at = dateIso;
      if (event.depositValue != null) job.deposit_value = event.depositValue;
      if (event.totalValue != null) job.final_move_value = event.totalValue;
      break;
    case "deposit_receipt":
      if (!job.deposit_receipt_received_at) {
        job.deposit_receipt_received_at = dateIso;
      }
      if (event.depositValue != null) job.deposit_value = event.depositValue;
      if (event.totalValue != null) job.final_move_value = event.totalValue;
      job.commission_payable = true;
      break;
    case "move_invoice":
      if (!job.move_invoice_sent_at) job.move_invoice_sent_at = dateIso;
      if (event.totalValue != null) job.final_move_value = event.totalValue;
      break;
    case "move_completed":
      break;
  }

  const stage = eventToStage(event.eventType);
  if (stage && STAGE_RANK[stage] > STAGE_RANK[job.current_stage]) {
    job.current_stage = stage;
  }

  if (job.moving_from_postcode_area === "Unknown" && job.lead_received_at) {
    job.needs_manual_review_reason = "Postcode unknown — needs review";
  }
  if (job.quote_accepted_at && job.quote_value == null) {
    job.needs_manual_review_reason = "Quote accepted but value needs confirmation";
  }
  if (job.deposit_invoice_sent_at && job.deposit_value == null && !job.deposit_receipt_received_at) {
    job.needs_manual_review_reason = "Deposit invoice found but PDF value needs review";
  }
  if (job.deposit_receipt_received_at && job.final_move_value == null) {
    job.needs_manual_review_reason = "Deposit received but full job value needs confirmation";
  }
}

function finalizeCommission(job: JobRecord, commissionRate: number) {
  if (!job.commission_payable) {
    job.commission_value = null;
    return;
  }
  const moveValue = job.final_move_value ?? job.quote_value;
  if (moveValue != null) {
    job.commission_value = moveValue * commissionRate;
    job.confidence_score = 0.9;
  } else {
    job.commission_value = null;
    job.confidence_score = 0.4;
  }
}

export function buildJobLedger(
  events: EmailEvent[],
  duplicateCount: number,
  settings: JarvisSettings,
  pdfAudit: {
    parsed: number;
    failed: number;
    missing: number;
    logs: string[];
  }
): JobLedger {
  const jobs: JobRecord[] = [];
  const commissionRate = settings.commissionPercent / 100;

  for (const event of events) {
    let idx = findJobIndex(jobs, event);
    if (idx < 0) {
      jobs.push(emptyJob(event.jobReference ?? event.emailId));
      idx = jobs.length - 1;
    }
    applyEvent(jobs[idx], event, settings);
  }

  for (const job of jobs) {
    finalizeCommission(job, commissionRate);
    if (!job.lead_received_at && job.current_stage === "needs_review") {
      job.current_stage = "lead_received";
    }
  }

  const unknownValues = jobs.filter(
    (j) =>
      j.quote_value == null &&
      j.final_move_value == null &&
      (j.quote_accepted_at != null || j.deposit_receipt_received_at != null)
  ).length;

  const jobsNeedingReview = jobs.filter((j) => j.needs_manual_review_reason != null).length;

  return {
    jobs,
    audit: {
      duplicateEventsIgnored: duplicateCount,
      pdfsParsed: pdfAudit.parsed,
      pdfsFailed: pdfAudit.failed,
      pdfsMissing: pdfAudit.missing,
      unknownValues,
      jobsNeedingReview,
      logs: pdfAudit.logs,
    },
  };
}

export function filterJobsByDays(jobs: JobRecord[], days: number, field: keyof JobRecord): JobRecord[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return jobs.filter((job) => {
    const raw = job[field];
    if (typeof raw !== "string" || !raw) return false;
    const when = new Date(raw);
    return !Number.isNaN(when.getTime()) && when.getTime() >= cutoff;
  });
}

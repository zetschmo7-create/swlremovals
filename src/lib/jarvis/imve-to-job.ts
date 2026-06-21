import type { JobRecord } from "./types";
import type { ImveJobRecord } from "./imve-types";
import { extractPostcodeArea } from "./extractors";

export function imveJobToJobRecord(job: ImveJobRecord): JobRecord {
  const key = job.job_reference
    ? `imve:${job.job_reference}`
    : `imve:id:${job.imve_id}`;

  return {
    job_key: key,
    job_reference: job.job_reference,
    customer_name: job.customer_name,
    customer_email: job.customer_email,
    lead_source: job.lead_source,
    lead_received_at: null,
    moving_from_postcode: job.from_postcode,
    moving_from_postcode_area: job.from_area ?? extractPostcodeArea(job.from_postcode),
    moving_to_postcode: job.to_postcode,
    survey_booked_at: null,
    quote_sent_at: null,
    quote_accepted_at: job.booked ? job.deposit_paid_at : null,
    deposit_invoice_sent_at: null,
    deposit_receipt_received_at: job.deposit_paid ? job.deposit_paid_at : null,
    move_invoice_sent_at: null,
    move_date: job.move_date,
    quote_value: job.quote_value,
    deposit_value: job.deposit_amount,
    final_move_value: job.turnover,
    commission_payable: (job.commission ?? 0) > 0,
    commission_value: job.commission,
    current_stage: job.deposit_paid
      ? "deposit_paid"
      : job.booked
        ? "quote_accepted"
        : "needs_review",
    source_emails: [],
    source_pdfs: [`imve:${job.source_file_hash}`],
    confidence_score: 0.95,
    needs_manual_review_reason: null,
    duplicate_ignored_events: [],
  };
}

export function mergeJobRecordsForMatching(
  gmailJobs: JobRecord[],
  imveJobs: ImveJobRecord[]
): JobRecord[] {
  const map = new Map<string, JobRecord>();

  for (const job of gmailJobs) {
    const key = job.job_reference ?? job.job_key;
    map.set(key, job);
  }

  for (const imve of imveJobs) {
    const converted = imveJobToJobRecord(imve);
    const key = imve.job_reference ?? converted.job_key;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, converted);
      continue;
    }
    map.set(key, {
      ...existing,
      ...converted,
      job_key: existing.job_key,
      customer_email: converted.customer_email ?? existing.customer_email,
      customer_name: converted.customer_name ?? existing.customer_name,
      deposit_receipt_received_at:
        converted.deposit_receipt_received_at ??
        existing.deposit_receipt_received_at,
      final_move_value: converted.final_move_value ?? existing.final_move_value,
      quote_value: converted.quote_value ?? existing.quote_value,
      commission_value: converted.commission_value ?? existing.commission_value,
      commission_payable:
        converted.commission_payable || existing.commission_payable,
      current_stage:
        converted.current_stage === "deposit_paid"
          ? "deposit_paid"
          : existing.current_stage,
      source_pdfs: [...new Set([...existing.source_pdfs, ...converted.source_pdfs])],
    });
  }

  return [...map.values()];
}

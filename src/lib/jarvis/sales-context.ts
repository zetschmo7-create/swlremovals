import type {
  CmmLeadRecord,
  JarvisBriefing,
  JobRecord,
  PostcodeArea,
  SalesContext,
} from "./types";
import { getCmmLeadLedger } from "./cmm-lead-store";
import { JARVIS_CONFIG } from "./config";

function stageLabel(job: JobRecord | null, lead: CmmLeadRecord | null): string {
  if (job) {
    if (job.deposit_receipt_received_at) return "deposit_paid";
    if (job.quote_accepted_at) return "quote_accepted";
    if (job.quote_sent_at) return "quote_sent";
    if (job.survey_booked_at) return "survey_booked";
    if (job.lead_received_at) return "lead_received";
    return job.current_stage;
  }
  if (lead) return "cmm_lead";
  return "unknown";
}

function surveySlotLines(briefing: JarvisBriefing): string[] {
  const lines: string[] = [];
  for (const zone of ["GU", "RH", "TN"] as const) {
    for (const slot of briefing.surveyIntelligence.slots[zone]) {
      lines.push(
        `${zone}: ${slot.dateLabel ?? slot.date} ${slot.time} (${slot.confidence} confidence)`
      );
    }
  }
  return lines;
}

function buildFromJob(
  job: JobRecord,
  briefing: JarvisBriefing,
  lead: CmmLeadRecord | null
): SalesContext {
  const missing: string[] = [];
  if (!job.customer_name) missing.push("customer_name");
  if (!job.moving_from_postcode) missing.push("collection_postcode");
  if (job.quote_value == null && job.quote_accepted_at) {
    missing.push("quote_value");
  }

  let confidence: SalesContext["dataConfidence"] = "high";
  if (missing.length > 2) confidence = "low";
  else if (missing.length > 0) confidence = "medium";

  return {
    customerName: job.customer_name ?? lead?.customer_name ?? null,
    customerEmail: job.customer_email ?? lead?.customer_email ?? null,
    customerPhone: lead?.customer_phone ?? null,
    collectionPostcode:
      job.moving_from_postcode ?? lead?.collection_postcode ?? null,
    collectionPostcodeArea:
      job.moving_from_postcode_area ??
      lead?.collection_postcode_area ??
      null,
    deliveryPostcode:
      job.moving_to_postcode ?? lead?.delivery_postcode ?? null,
    moveDate: job.move_date ?? lead?.move_date ?? null,
    propertySize: lead?.property_size ?? null,
    pipelineStage: stageLabel(job, lead),
    quoteValue: job.quote_value,
    depositPaid: Boolean(job.deposit_receipt_received_at),
    jobReference: job.job_reference,
    leadSource: job.lead_source ?? lead?.lead_source ?? "Compare My Move",
    surveySlots: surveySlotLines(briefing),
    dataConfidence: confidence,
    missingFields: missing,
    jobKey: job.job_key,
    leadId: lead?.lead_id ?? null,
    businessName: JARVIS_CONFIG.businessName,
  };
}

function buildFromLead(
  lead: CmmLeadRecord,
  briefing: JarvisBriefing,
  matchedJob: JobRecord | null
): SalesContext {
  if (matchedJob) return buildFromJob(matchedJob, briefing, lead);

  const missing: string[] = [];
  if (!lead.customer_name) missing.push("customer_name");
  if (!lead.collection_postcode) missing.push("collection_postcode");
  if (!lead.customer_phone) missing.push("customer_phone");

  let confidence: SalesContext["dataConfidence"] = "medium";
  if (lead.collection_postcode_area === "Unknown" || missing.length > 2) {
    confidence = "low";
  }

  return {
    customerName: lead.customer_name,
    customerEmail: lead.customer_email,
    customerPhone: lead.customer_phone,
    collectionPostcode: lead.collection_postcode,
    collectionPostcodeArea: lead.collection_postcode_area,
    deliveryPostcode: lead.delivery_postcode,
    moveDate: lead.move_date,
    propertySize: lead.property_size,
    pipelineStage: "cmm_lead",
    quoteValue: null,
    depositPaid: false,
    jobReference: null,
    leadSource: lead.lead_source,
    surveySlots: surveySlotLines(briefing),
    dataConfidence: confidence,
    missingFields: missing,
    jobKey: null,
    leadId: lead.lead_id,
    businessName: JARVIS_CONFIG.businessName,
  };
}

function matchLeadToJob(
  lead: CmmLeadRecord,
  jobs: JobRecord[]
): JobRecord | null {
  if (lead.customer_email) {
    const email = lead.customer_email.toLowerCase();
    const byEmail = jobs.find(
      (j) => j.customer_email?.toLowerCase() === email
    );
    if (byEmail) return byEmail;
  }
  if (lead.customer_name && lead.collection_postcode) {
    const name = lead.customer_name.toLowerCase();
    const pc = lead.collection_postcode.replace(/\s+/g, "").toUpperCase();
    const byNamePc = jobs.find(
      (j) =>
        j.customer_name?.toLowerCase() === name &&
        (j.moving_from_postcode ?? "")
          .replace(/\s+/g, "")
          .toUpperCase() === pc
    );
    if (byNamePc) return byNamePc;
  }
  return null;
}

export async function resolveSalesContext(
  briefing: JarvisBriefing,
  options: { jobKey?: string; leadId?: string }
): Promise<{ context: SalesContext; warnings: string[] }> {
  const warnings: string[] = [];
  const jobs = briefing.jobLedger.jobs;

  if (options.jobKey) {
    const job = jobs.find((j) => j.job_key === options.jobKey);
    if (!job) {
      warnings.push("Selected job not found in Job Ledger.");
      return { context: emptyContext(), warnings };
    }
    return { context: buildFromJob(job, briefing, null), warnings };
  }

  if (options.leadId) {
    const ledger = await getCmmLeadLedger();
    const lead = ledger?.leads.find(
      (l) => l.lead_id === options.leadId || l.gmail_message_id === options.leadId
    );
    if (!lead) {
      warnings.push("Selected CMM lead not found in lead ledger.");
      return { context: emptyContext(), warnings };
    }
    const matched = matchLeadToJob(lead, jobs);
    if (lead.collection_postcode_area === "Unknown") {
      warnings.push("Collection postcode is unknown — do not invent location details.");
    }
    if (!matched) {
      warnings.push("No Job Ledger match yet — treat as new CMM lead.");
    }
    return { context: buildFromLead(lead, briefing, matched), warnings };
  }

  warnings.push("No lead or job selected — draft uses general playbook guidance only.");
  return { context: emptyContext(), warnings };
}

function emptyContext(): SalesContext {
  return {
    customerName: null,
    customerEmail: null,
    customerPhone: null,
    collectionPostcode: null,
    collectionPostcodeArea: null,
    deliveryPostcode: null,
    moveDate: null,
    propertySize: null,
    pipelineStage: "unknown",
    quoteValue: null,
    depositPaid: false,
    jobReference: null,
    leadSource: null,
    surveySlots: [],
    dataConfidence: "low",
    missingFields: ["customer", "postcode", "pipeline"],
    jobKey: null,
    leadId: null,
    businessName: JARVIS_CONFIG.businessName,
  };
}

export type SalesLeadOption = {
  id: string;
  label: string;
  jobKey: string | null;
  leadId: string | null;
  area: PostcodeArea | null;
  stage: string;
};

export function buildSalesLeadOptions(
  briefing: JarvisBriefing
): SalesLeadOption[] {
  const options: SalesLeadOption[] = [];
  const seen = new Set<string>();

  for (const hot of briefing.hotLeads.leads) {
    const job = briefing.jobLedger.jobs.find((j) => j.job_key === hot.id);
    if (!job || seen.has(job.job_key)) continue;
    seen.add(job.job_key);
    options.push({
      id: job.job_key,
      label: `${job.customer_name ?? "Unknown"} — hot lead`,
      jobKey: job.job_key,
      leadId: null,
      area: job.moving_from_postcode_area,
      stage: stageLabel(job, null),
    });
  }

  for (const job of briefing.jobLedger.jobs) {
    if (!job.lead_received_at || job.deposit_receipt_received_at) continue;
    if (seen.has(job.job_key)) continue;
    seen.add(job.job_key);
    options.push({
      id: job.job_key,
      label: `${job.customer_name ?? "Unknown"} — ${job.moving_from_postcode_area}`,
      jobKey: job.job_key,
      leadId: null,
      area: job.moving_from_postcode_area,
      stage: stageLabel(job, null),
    });
  }

  return options.slice(0, 40);
}

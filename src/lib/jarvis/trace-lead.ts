import { CMM_PARSER_VERSION } from "./cmm-parser-version";
import {
  fetchGmailMessageById,
  searchCmmGmailMessages,
} from "./cmm-gmail";
import { parseCmmLeadEmailWithReason } from "./cmm-parser";
import {
  explainImveMatchDecision,
  scoreImveLeadMatch,
} from "./imve-cmm-match";
import { getImveCmmMatchLedger } from "./imve-cmm-match-store";
import { evaluateImveMatchForRoi } from "./imve-roi-debug";
import { getImveImportLedgerOrEmpty } from "./imve-store";
import {
  getCmmLastBackfillAt,
  getCmmLeadLedger,
  getCmmSyncMeta,
  saveCmmLeadLedger,
} from "./cmm-lead-store";
import { buildCmmLeadIntelligenceFromLeads } from "./cmm-analytics";
import { getJobsForCmmMatching } from "./jarvis-jobs";
import { getJarvisSettings } from "./settings-store";
import { isImveRoiActive } from "./imve-validate";
import type { CmmLeadRecord } from "./types";
import type { ImveCmmLeadMatch, ImveJobRecord } from "./imve-types";

const AUTO_MATCH = 85;
const REVIEW_MIN = 55;

export type LeadTraceFieldRow = {
  field: string;
  value: string | null;
};

export type LeadTraceStepGmail = {
  found: boolean;
  message_id: string | null;
  subject: string | null;
  body_length: number;
  body_preview: string | null;
  snippet: string | null;
  search_used: string | null;
  failure_reason: string | null;
};

export type LeadTraceStepBody = {
  extracted: boolean;
  body_chars: number;
  used_snippet_fallback: boolean;
  has_comparemymove_marker: boolean;
};

export type LeadTraceStepParsed = {
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  current_postcode: string | null;
  destination_postcode: string | null;
  move_date: string | null;
  cmm_internal_id: string | null;
  parse_failure: string | null;
};

export type LeadTraceStepStored = {
  found: boolean;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  current_postcode: string | null;
  destination_postcode: string | null;
  move_date: string | null;
  cmm_internal_id: string | null;
  gmail_message_id: string | null;
  has_full_name: boolean;
  has_email: boolean;
  has_phone: boolean;
  ledger_rebuilt_at: string | null;
  parser_version: string;
  field_mismatches: string[];
};

export type LeadTraceStepImveJob = {
  found: boolean;
  imve_id: string | null;
  job_reference: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  from_postcode: string | null;
  quote_value: number | null;
  turnover: number | null;
  deposit_paid: boolean;
  deposit_amount: number | null;
  lead_source: string | null;
};

export type LeadTraceStepMatch = {
  score: number;
  signals: string[];
  predicted_status: ImveCmmLeadMatch["match_status"];
  stored_match_status: ImveCmmLeadMatch["match_status"] | "none";
  stored_imve_job_id: string | null;
  reason_if_not_matched: string;
  thresholds: { auto_matched: number; needs_review: number };
  explanation: string | null;
};

export type LeadTraceStepRoi = {
  included: boolean;
  exclusion_reason: string | null;
  match_status: string;
  area: string;
  area_deposits_paid: number;
  area_turnover: number;
  area_commission: number;
  area_roi: number | null;
};

export type LeadTraceReport = {
  query: string;
  traced_at: string;
  cmm_parser_version: string;
  cmm_ledger_rebuilt_at: string | null;
  cmm_ledger_last_sync_at: string | null;
  diagnosis: string;
  step1_gmail: LeadTraceStepGmail;
  step2_body: LeadTraceStepBody;
  step3_parsed: LeadTraceStepParsed;
  step4_stored: LeadTraceStepStored;
  step5_imve_job: LeadTraceStepImveJob;
  step6_match: LeadTraceStepMatch;
  step7_roi: LeadTraceStepRoi;
};

function hasFullName(name: string | null): boolean {
  if (!name?.trim()) return false;
  return name.trim().split(/\s+/).length >= 2;
}

function normalizeQuery(q: string): string {
  return q.trim().toLowerCase();
}

function leadMatchesQuery(lead: CmmLeadRecord, q: string): boolean {
  const n = normalizeQuery(q);
  if (!n) return false;
  const hay = [
    lead.customer_name,
    lead.customer_email,
    lead.customer_phone,
    lead.cmm_internal_id,
    lead.gmail_message_id,
    lead.collection_postcode,
    lead.new_postcode,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(n) || n.split(/\s+/).every((tok) => hay.includes(tok));
}

function jobMatchesQuery(job: ImveJobRecord, q: string): boolean {
  const n = normalizeQuery(q);
  if (!n) return false;
  const hay = [
    job.job_reference,
    job.customer_name,
    job.customer_email,
    job.customer_phone,
    job.imve_id,
    job.from_postcode,
    job.lead_source,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(n);
}

function findCmmLead(leads: CmmLeadRecord[], query: string): CmmLeadRecord | null {
  const direct = leads.find((l) => leadMatchesQuery(l, query));
  if (direct) return direct;

  const carl = leads.find(
    (l) =>
      /carl/i.test(l.customer_name ?? "") ||
      /car-1781959748/i.test(l.cmm_internal_id ?? "")
  );
  return carl ?? null;
}

function findImveJob(jobs: ImveJobRecord[], query: string): ImveJobRecord | null {
  const direct = jobs.find((j) => jobMatchesQuery(j, query));
  if (direct) return direct;

  const job3655 = jobs.find(
    (j) =>
      j.job_reference === "3655" ||
      j.job_reference?.endsWith("3655") ||
      /3655/.test(j.job_reference ?? "")
  );
  return job3655 ?? null;
}

function classifyImveScore(score: number): ImveCmmLeadMatch["match_status"] {
  if (score >= AUTO_MATCH) return "auto_matched";
  if (score >= REVIEW_MIN) return "needs_review";
  return "unmatched";
}

function fieldMismatches(
  stored: CmmLeadRecord | null,
  parsed: LeadTraceStepParsed
): string[] {
  if (!stored) return [];
  const mismatches: string[] = [];
  const pairs: Array<[string, string | null, string | null]> = [
    ["customer_name", stored.customer_name, parsed.customer_name],
    ["customer_email", stored.customer_email, parsed.customer_email],
    ["customer_phone", stored.customer_phone, parsed.customer_phone],
    ["current_postcode", stored.collection_postcode, parsed.current_postcode],
    ["destination_postcode", stored.new_postcode, parsed.destination_postcode],
    ["move_date", stored.move_date, parsed.move_date],
    ["cmm_internal_id", stored.cmm_internal_id, parsed.cmm_internal_id],
  ];
  for (const [field, storedVal, parsedVal] of pairs) {
    if (parsedVal && parsedVal !== storedVal) {
      mismatches.push(
        `${field}: stored="${storedVal ?? "null"}" vs fresh parse="${parsedVal}"`
      );
    }
    if (!storedVal && parsedVal) {
      mismatches.push(`${field}: missing in stored ledger, present in fresh parse`);
    }
  }
  return [...new Set(mismatches)];
}

function buildDiagnosis(report: Omit<LeadTraceReport, "diagnosis">): string {
  const issues: string[] = [];

  if (!report.step1_gmail.found) {
    issues.push("Gmail message not found — check CMM label and search query.");
  } else if (!report.step2_body.extracted || report.step2_body.body_chars < 80) {
    issues.push("Gmail body empty or too short — rebuild may be parsing snippet only.");
  }

  if (report.step3_parsed.parse_failure) {
    issues.push(`Fresh parse failed: ${report.step3_parsed.parse_failure}`);
  } else if (
    report.step3_parsed.customer_email &&
    !report.step4_stored.has_email
  ) {
    issues.push(
      "Fresh parse has email but stored ledger does not — run Repair lead or Rebuild CMM ledger."
    );
  } else if (
    report.step3_parsed.customer_phone &&
    !report.step4_stored.has_phone
  ) {
    issues.push(
      "Fresh parse has phone but stored ledger does not — run Repair lead or Rebuild CMM ledger."
    );
  } else if (
    hasFullName(report.step3_parsed.customer_name) &&
    !report.step4_stored.has_full_name
  ) {
    issues.push(
      "Fresh parse has full name but stored ledger does not — run Repair lead or Rebuild CMM ledger."
    );
  }

  if (report.step4_stored.field_mismatches.length > 0) {
    issues.push(
      `${report.step4_stored.field_mismatches.length} field mismatch(es) between stored ledger and fresh parse.`
    );
  }

  if (!report.step5_imve_job.found) {
    issues.push("i-MVE job not found for query — check i-MVE import.");
  } else if (report.step6_match.predicted_status === "unmatched") {
    issues.push(
      `Match score ${report.step6_match.score} below review minimum (${REVIEW_MIN}) — ${report.step6_match.reason_if_not_matched}`
    );
  } else if (report.step6_match.stored_match_status === "none") {
    issues.push("Match score OK but no stored i-MVE match — run Rematch i-MVE → CMM.");
  } else if (
    report.step6_match.predicted_status !== report.step6_match.stored_match_status
  ) {
    issues.push(
      `Stored match status (${report.step6_match.stored_match_status}) differs from predicted (${report.step6_match.predicted_status}).`
    );
  }

  if (!report.step7_roi.included) {
    issues.push(
      `ROI excluded: ${report.step7_roi.exclusion_reason ?? "unknown"}`
    );
  } else if (report.step7_roi.area_turnover === 0) {
    issues.push("ROI includes match but area turnover is still zero — area table bug.");
  }

  if (issues.length === 0) {
    return "End-to-end trace looks healthy for this lead.";
  }
  return issues.join(" ");
}

export async function traceLead(query: string): Promise<LeadTraceReport> {
  const settings = await getJarvisSettings();
  const leadCost = settings.costPerLead;
  const ledger = await getCmmLeadLedger();
  const leads = ledger?.leads ?? [];
  const imveLedger = await getImveImportLedgerOrEmpty();
  const imveJobs = imveLedger.jobs;
  const matchLedger = await getImveCmmMatchLedger();
  const rebuiltAt = await getCmmLastBackfillAt();
  const syncMeta = await getCmmSyncMeta();

  const storedLead = findCmmLead(leads, query);
  const targetJob = findImveJob(imveJobs, query);

  let gmailEmail = storedLead
    ? await fetchGmailMessageById(storedLead.gmail_message_id)
    : null;
  let searchUsed: string | null = null;

  if (!gmailEmail) {
    searchUsed = query;
    const results = await searchCmmGmailMessages(query, 5);
    gmailEmail =
      results.find((e) =>
        /carl|yabasto|car-1781959748/i.test(
          `${e.subject}\n${e.body}\n${e.snippet}`
        )
      ) ?? results[0] ?? null;
  }

  const bodyText = gmailEmail?.body ?? "";
  const usedSnippetFallback = !bodyText.trim() && Boolean(gmailEmail?.snippet);
  const parseText = gmailEmail
    ? `${gmailEmail.subject}\n${bodyText || gmailEmail.snippet}`
    : "";

  const freshParse = gmailEmail
    ? parseCmmLeadEmailWithReason(gmailEmail, leadCost)
    : { lead: null, failureReason: "No Gmail message to parse" };

  const parsed: LeadTraceStepParsed = freshParse.lead
    ? {
        customer_name: freshParse.lead.customer_name,
        customer_email: freshParse.lead.customer_email,
        customer_phone: freshParse.lead.customer_phone,
        current_postcode: freshParse.lead.collection_postcode,
        destination_postcode: freshParse.lead.new_postcode,
        move_date: freshParse.lead.move_date,
        cmm_internal_id: freshParse.lead.cmm_internal_id,
        parse_failure: null,
      }
    : {
        customer_name: null,
        customer_email: null,
        customer_phone: null,
        current_postcode: null,
        destination_postcode: null,
        move_date: null,
        cmm_internal_id: null,
        parse_failure: freshParse.failureReason,
      };

  const resolvedLead =
    storedLead ??
    (freshParse.lead
      ? leads.find(
          (l) => l.gmail_message_id === freshParse.lead!.gmail_message_id
        ) ?? null
      : null);

  const stored: LeadTraceStepStored = resolvedLead
    ? {
        found: true,
        customer_name: resolvedLead.customer_name,
        customer_email: resolvedLead.customer_email,
        customer_phone: resolvedLead.customer_phone,
        current_postcode: resolvedLead.collection_postcode,
        destination_postcode: resolvedLead.new_postcode,
        move_date: resolvedLead.move_date,
        cmm_internal_id: resolvedLead.cmm_internal_id,
        gmail_message_id: resolvedLead.gmail_message_id,
        has_full_name: hasFullName(resolvedLead.customer_name),
        has_email: Boolean(resolvedLead.customer_email),
        has_phone: Boolean(resolvedLead.customer_phone),
        ledger_rebuilt_at: rebuiltAt,
        parser_version: CMM_PARSER_VERSION,
        field_mismatches: fieldMismatches(resolvedLead, parsed),
      }
    : {
        found: false,
        customer_name: null,
        customer_email: null,
        customer_phone: null,
        current_postcode: null,
        destination_postcode: null,
        move_date: null,
        cmm_internal_id: null,
        gmail_message_id: null,
        has_full_name: false,
        has_email: false,
        has_phone: false,
        ledger_rebuilt_at: rebuiltAt,
        parser_version: CMM_PARSER_VERSION,
        field_mismatches: [],
      };

  const job = targetJob;
  const imveStep: LeadTraceStepImveJob = job
    ? {
        found: true,
        imve_id: job.imve_id,
        job_reference: job.job_reference,
        customer_name: job.customer_name,
        customer_email: job.customer_email,
        customer_phone: job.customer_phone,
        from_postcode: job.from_postcode,
        quote_value: job.quote_value,
        turnover: job.turnover,
        deposit_paid: job.deposit_paid,
        deposit_amount: job.deposit_amount,
        lead_source: job.lead_source,
      }
    : {
        found: false,
        imve_id: null,
        job_reference: null,
        customer_name: null,
        customer_email: null,
        customer_phone: null,
        from_postcode: null,
        quote_value: null,
        turnover: null,
        deposit_paid: false,
        deposit_amount: null,
        lead_source: null,
      };

  const leadForMatch = resolvedLead ?? freshParse.lead;
  let matchStep: LeadTraceStepMatch = {
    score: 0,
    signals: [],
    predicted_status: "unmatched",
    stored_match_status: "none",
    stored_imve_job_id: null,
    reason_if_not_matched: "No CMM lead available for matching",
    thresholds: { auto_matched: AUTO_MATCH, needs_review: REVIEW_MIN },
    explanation: null,
  };

  if (leadForMatch && job) {
    const { score, reasons } = scoreImveLeadMatch(leadForMatch, job);
    const predicted = classifyImveScore(score);
    const storedMatch = matchLedger?.matches[leadForMatch.gmail_message_id];
    let reason = "";
    if (score < REVIEW_MIN) {
      const missing: string[] = [];
      if (!leadForMatch.customer_email && !leadForMatch.customer_phone) {
        missing.push("lead has no email or phone for strong match");
      }
      if (!reasons.includes("email_exact") && !reasons.includes("phone_exact")) {
        missing.push("no email/phone exact match");
      }
      if (!reasons.includes("name_exact") && !reasons.includes("name_fuzzy")) {
        missing.push("weak name match");
      }
      reason = missing.join("; ") || `score ${score} below ${REVIEW_MIN}`;
    }
    matchStep = {
      score,
      signals: reasons,
      predicted_status: predicted,
      stored_match_status: storedMatch?.match_status ?? "none",
      stored_imve_job_id: storedMatch?.imve_job_id ?? null,
      reason_if_not_matched: reason,
      thresholds: { auto_matched: AUTO_MATCH, needs_review: REVIEW_MIN },
      explanation: explainImveMatchDecision(leadForMatch, { job, score, reasons }),
    };
  }

  let roiStep: LeadTraceStepRoi = {
    included: false,
    exclusion_reason: "no_lead",
    match_status: "none",
    area: "Unknown",
    area_deposits_paid: 0,
    area_turnover: 0,
    area_commission: 0,
    area_roi: null,
  };

  if (leadForMatch) {
    const storedMatch = matchLedger?.matches[leadForMatch.gmail_message_id];
    const matchJob = job ?? imveJobs.find((j) => j.imve_id === storedMatch?.imve_job_id);
    const roiEval = evaluateImveMatchForRoi(leadForMatch, storedMatch, matchJob);
    const jobs = await getJobsForCmmMatching();
    const intel = buildCmmLeadIntelligenceFromLeads(
      leads,
      jobs,
      settings,
      syncMeta,
      null,
      matchLedger,
      imveJobs,
      imveLedger.roi_active && imveJobs.length > 0
      ? isImveRoiActive(imveLedger)
      : false
    );
    const area = leadForMatch.collection_postcode_area;
    const areaStats = intel.byArea[area];
    roiStep = {
      included: roiEval.included,
      exclusion_reason: roiEval.exclusion_reason,
      match_status: roiEval.match_status,
      area,
      area_deposits_paid: areaStats.depositsPaid,
      area_turnover: areaStats.turnover,
      area_commission: areaStats.commission,
      area_roi: areaStats.roi,
    };
  }

  const partial: Omit<LeadTraceReport, "diagnosis"> = {
    query,
    traced_at: new Date().toISOString(),
    cmm_parser_version: CMM_PARSER_VERSION,
    cmm_ledger_rebuilt_at: rebuiltAt,
    cmm_ledger_last_sync_at: syncMeta?.lastSyncAt ?? null,
    step1_gmail: {
      found: Boolean(gmailEmail),
      message_id: gmailEmail?.id ?? null,
      subject: gmailEmail?.subject ?? null,
      body_length: bodyText.length,
      body_preview: bodyText.slice(0, 400) || null,
      snippet: gmailEmail?.snippet ?? null,
      search_used: searchUsed,
      failure_reason: gmailEmail ? null : "Gmail message not found for query",
    },
    step2_body: {
      extracted: bodyText.length > 0,
      body_chars: bodyText.length,
      used_snippet_fallback: usedSnippetFallback,
      has_comparemymove_marker: /comparemymove|compare\s*my\s*move/i.test(parseText),
    },
    step3_parsed: parsed,
    step4_stored: stored,
    step5_imve_job: imveStep,
    step6_match: matchStep,
    step7_roi: roiStep,
  };

  return {
    ...partial,
    diagnosis: buildDiagnosis(partial),
  };
}

function coalesceField(
  fresh: string | null | undefined,
  stored: string | null | undefined
): string | null {
  const f = fresh?.trim();
  if (f) return f;
  const s = stored?.trim();
  return s || null;
}

export function mergeRepairedLead(
  stored: CmmLeadRecord,
  fresh: CmmLeadRecord
): CmmLeadRecord {
  return {
    ...stored,
    customer_name: coalesceField(fresh.customer_name, stored.customer_name),
    customer_email: coalesceField(fresh.customer_email, stored.customer_email),
    customer_phone: coalesceField(fresh.customer_phone, stored.customer_phone),
    current_address: coalesceField(fresh.current_address, stored.current_address),
    current_postcode: coalesceField(fresh.current_postcode, stored.current_postcode),
    current_area_prefix: fresh.current_area_prefix ?? stored.current_area_prefix,
    collection_address: coalesceField(fresh.collection_address, stored.collection_address),
    collection_postcode: coalesceField(fresh.collection_postcode, stored.collection_postcode),
    collection_postcode_area:
      fresh.collection_postcode_area !== "Unknown"
        ? fresh.collection_postcode_area
        : stored.collection_postcode_area,
    new_address: coalesceField(fresh.new_address, stored.new_address),
    new_postcode: coalesceField(fresh.new_postcode, stored.new_postcode),
    delivery_address: coalesceField(fresh.delivery_address, stored.delivery_address),
    delivery_postcode: coalesceField(fresh.delivery_postcode, stored.delivery_postcode),
    move_date: coalesceField(fresh.move_date, stored.move_date),
    cmm_internal_id: coalesceField(fresh.cmm_internal_id, stored.cmm_internal_id),
    external_lead_id: coalesceField(fresh.external_lead_id, stored.external_lead_id),
    bedrooms: fresh.bedrooms ?? stored.bedrooms,
    home_type: coalesceField(fresh.home_type, stored.home_type),
    property_size: coalesceField(fresh.property_size, stored.property_size),
    flexible: fresh.flexible ?? stored.flexible,
    confidence_score: Math.max(fresh.confidence_score, stored.confidence_score),
    needs_review_reason:
      fresh.customer_email && fresh.customer_name
        ? null
        : fresh.needs_review_reason ?? stored.needs_review_reason,
  };
}

export async function repairCmmLeadFromGmail(
  messageId: string
): Promise<{ repaired: CmmLeadRecord | null; error: string | null }> {
  const settings = await getJarvisSettings();
  const email = await fetchGmailMessageById(messageId);
  if (!email) {
    return { repaired: null, error: "Gmail message not found" };
  }

  const parsed = parseCmmLeadEmailWithReason(email, settings.costPerLead);
  if (!parsed.lead) {
    return {
      repaired: null,
      error: parsed.failureReason ?? "Parse failed",
    };
  }

  const ledger = await getCmmLeadLedger();
  const leads = ledger?.leads ?? [];
  const idx = leads.findIndex((l) => l.gmail_message_id === messageId);
  const merged =
    idx >= 0
      ? mergeRepairedLead(leads[idx], parsed.lead)
      : parsed.lead;

  const next =
    idx >= 0
      ? leads.map((l, i) => (i === idx ? merged : l))
      : [merged, ...leads];

  await saveCmmLeadLedger({ leads: next, version: ledger?.version ?? 1 });
  return { repaired: merged, error: null };
}

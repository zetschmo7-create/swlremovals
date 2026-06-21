import { CMM_PARSER_VERSION } from "./cmm-parser-version";
import {
  fetchGmailMessageById,
  searchCmmGmailMessages,
} from "./cmm-gmail";
import { parseCmmLeadEmailWithReason } from "./cmm-parser";
import {
  evaluateImveLeadMatch,
  explainImveMatchDecision,
  REVIEW_MIN,
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
import {
  resolveRoiCandidate,
  resolveTraceMode,
  type RoiTraceCandidate,
} from "./trace-lead-candidates";

const REVIEW_MIN_EXPORT = REVIEW_MIN;

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
  candidate_job_reference: string | null;
  linked_job_reference: string | null;
  reason_if_not_matched: string;
  thresholds: { auto_matched: number; needs_review: number };
  explanation: string | null;
};

export type LeadTraceStepApproval = {
  stored_match_status: ImveCmmLeadMatch["match_status"] | "none";
  is_manually_approved: boolean;
  is_auto_matched: boolean;
  is_needs_review: boolean;
  is_rejected: boolean;
  in_review_queue: boolean;
  candidate_job_reference: string | null;
  linked_job_reference: string | null;
};

export type LeadTraceStepDepositValue = {
  job_deposit_paid: boolean;
  job_deposit_amount: number | null;
  job_turnover: number | null;
  job_quote_value: number | null;
  match_deposit_paid: boolean;
  has_deposit_signal: boolean;
  has_value_signal: boolean;
  qualifies_for_roi_data: boolean;
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
  trace_mode: "parser" | "roi";
  roi_candidate_label: string | null;
  parser_test_note: string | null;
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
  step_approval: LeadTraceStepApproval;
  step_deposit_value: LeadTraceStepDepositValue;
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

function jobRefMatches(job: ImveJobRecord, ref: string): boolean {
  const digits = ref.replace(/\D/g, "");
  const jr = (job.job_reference ?? "").replace(/\D/g, "");
  return (
    job.job_reference === ref ||
    jr === digits ||
    (digits.length > 0 && jr.endsWith(digits))
  );
}

function findLeadByFirstName(
  leads: CmmLeadRecord[],
  firstName: string
): CmmLeadRecord | null {
  const n = firstName.toLowerCase().trim();
  const matches = leads.filter((l) => {
    const first = (l.customer_name ?? "").toLowerCase().trim().split(/\s+/)[0];
    return first === n;
  });
  if (matches.length === 0) return null;
  return matches.sort((a, b) => {
    const emailScore = (l: CmmLeadRecord) => (l.customer_email ? 1 : 0);
    if (emailScore(b) !== emailScore(a)) return emailScore(b) - emailScore(a);
    return new Date(b.received_at).getTime() - new Date(a.received_at).getTime();
  })[0];
}

function findCmmLead(
  leads: CmmLeadRecord[],
  query: string,
  candidate: RoiTraceCandidate | null
): CmmLeadRecord | null {
  if (candidate) {
    const byName = findLeadByFirstName(leads, candidate.leadQuery);
    if (byName) return byName;
  }
  return leads.find((l) => leadMatchesQuery(l, query)) ?? null;
}

function findImveJob(
  jobs: ImveJobRecord[],
  query: string,
  candidate: RoiTraceCandidate | null
): ImveJobRecord | null {
  if (candidate) {
    const paired = jobs.find((j) => jobRefMatches(j, candidate.jobRef));
    if (paired) return paired;
  }
  return jobs.find((j) => jobMatchesQuery(j, query)) ?? null;
}

function classifyImveScore(
  evaluation: ReturnType<typeof evaluateImveLeadMatch>
): ImveCmmLeadMatch["match_status"] {
  return evaluation.decision;
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

  if (report.trace_mode === "parser") {
    if (!report.step1_gmail.found) {
      issues.push("Gmail message not found — check CMM label and search query.");
    } else if (!report.step2_body.extracted || report.step2_body.body_chars < 80) {
      issues.push("Gmail body empty or too short — rebuild may be parsing snippet only.");
    }
    if (report.step3_parsed.parse_failure) {
      issues.push(`Fresh parse failed: ${report.step3_parsed.parse_failure}`);
    } else {
      if (!hasFullName(report.step3_parsed.customer_name)) {
        issues.push("Parser did not extract full name.");
      }
      if (!report.step3_parsed.customer_email) {
        issues.push("Parser did not extract email.");
      }
      if (!report.step3_parsed.customer_phone) {
        issues.push("Parser did not extract phone.");
      }
      if (!report.step3_parsed.current_postcode) {
        issues.push("Parser did not extract current postcode.");
      }
    }
    if (report.step4_stored.field_mismatches.length > 0) {
      issues.push(
        `${report.step4_stored.field_mismatches.length} field mismatch(es) — run Repair or Rebuild CMM ledger.`
      );
    }
    if (issues.length === 0) {
      return "CMM parser test passed. Carl is unquoted — use Will→3064 (or Jo/Kevin) for ROI trace.";
    }
    return issues.join(" ");
  }

  // ROI trace mode
  if (!report.step4_stored.found) {
    issues.push("CMM lead not found in stored ledger.");
  } else if (!report.step4_stored.has_email && !report.step4_stored.has_phone) {
    issues.push("Stored CMM lead missing email and phone — matching will be weak.");
  }

  if (!report.step5_imve_job.found) {
    issues.push(
      `i-MVE job not found${report.roi_candidate_label ? ` for ${report.roi_candidate_label}` : ""}.`
    );
  }

  if (report.step6_match.predicted_status === "unmatched") {
    issues.push(
      `Match unmatched — ${report.step6_match.reason_if_not_matched}`
    );
  } else if (report.step6_match.stored_match_status === "none") {
    issues.push("No stored i-MVE match — run Rematch i-MVE → CMM.");
  }

  if (report.step_approval.is_needs_review) {
    issues.push("Match is needs_review — approve in Data Imports to count toward ROI.");
  } else if (report.step_approval.is_rejected) {
    issues.push("Match was rejected — will not count toward ROI.");
  } else if (report.step_approval.is_manually_approved) {
    // expected after approval — no issue
  } else if (
    !report.step_approval.is_auto_matched &&
    report.step6_match.predicted_status === "needs_review"
  ) {
    issues.push("Match should be in review queue or approved but status is unclear.");
  }

  if (!report.step_deposit_value.qualifies_for_roi_data) {
    issues.push(
      "Job has no deposit paid and no turnover/quote value — cannot count toward ROI even if approved."
    );
  }

  if (
    (report.step_approval.is_manually_approved || report.step_approval.is_auto_matched) &&
    report.step_deposit_value.qualifies_for_roi_data &&
    !report.step7_roi.included
  ) {
    issues.push(
      `Approved/auto match with deposit/value but ROI excluded: ${report.step7_roi.exclusion_reason ?? "unknown"}`
    );
  }

  if (report.step7_roi.included && report.step7_roi.area_turnover === 0) {
    issues.push("ROI includes match but area turnover is zero — area table consumption bug.");
  }

  if (issues.length === 0) {
    if (report.step_approval.is_manually_approved && report.step7_roi.included) {
      return `ROI trace healthy: manually approved, included in ROI, area ${report.step7_roi.area} updated.`;
    }
    if (report.step_approval.is_auto_matched && report.step7_roi.included) {
      return `ROI trace healthy: auto-matched and included in ROI for area ${report.step7_roi.area}.`;
    }
    if (report.step_approval.is_needs_review) {
      return `Match ready for approval (${report.roi_candidate_label ?? report.query}). Approve then re-trace.`;
    }
    return "ROI trace looks healthy for this candidate.";
  }
  return issues.join(" ");
}

export async function traceLead(query: string): Promise<LeadTraceReport> {
  const settings = await getJarvisSettings();
  const leadCost = settings.costPerLead;
  const traceMode = resolveTraceMode(query);
  const roiCandidate = resolveRoiCandidate(query);
  const ledger = await getCmmLeadLedger();
  const leads = ledger?.leads ?? [];
  const imveLedger = await getImveImportLedgerOrEmpty();
  const imveJobs = imveLedger.jobs;
  const matchLedger = await getImveCmmMatchLedger();
  const rebuiltAt = await getCmmLastBackfillAt();
  const syncMeta = await getCmmSyncMeta();

  const storedLead = findCmmLead(leads, query, roiCandidate);
  const targetJob = findImveJob(imveJobs, query, roiCandidate);

  const runGmailParse = traceMode === "parser" || !storedLead;
  let gmailEmail = null as Awaited<ReturnType<typeof fetchGmailMessageById>>;
  let searchUsed: string | null = null;

  if (runGmailParse) {
    gmailEmail = storedLead
      ? await fetchGmailMessageById(storedLead.gmail_message_id)
      : null;

    if (!gmailEmail) {
      searchUsed = query;
      const results = await searchCmmGmailMessages(query, 8);
      gmailEmail =
        traceMode === "parser"
          ? results.find((e) =>
              /carl|yabasto|car-1781959748/i.test(
                `${e.subject}\n${e.body}\n${e.snippet}`
              )
            ) ?? results[0] ?? null
          : results[0] ?? null;
    }
  }

  const bodyText = gmailEmail?.body ?? "";
  const usedSnippetFallback = !bodyText.trim() && Boolean(gmailEmail?.snippet);
  const parseText = gmailEmail
    ? `${gmailEmail.subject}\n${bodyText || gmailEmail.snippet}`
    : "";

  const freshParse =
    runGmailParse && gmailEmail
      ? parseCmmLeadEmailWithReason(gmailEmail, leadCost)
      : {
          lead: null,
          failureReason: traceMode === "roi" ? null : "No Gmail message to parse",
        };

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

  const fieldMismatchesList =
    traceMode === "parser" && storedLead
      ? fieldMismatches(storedLead, parsed)
      : [];

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
        field_mismatches: fieldMismatchesList,
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
  const storedMatchRecord = leadForMatch
    ? matchLedger?.matches[leadForMatch.gmail_message_id]
    : undefined;
  const inReviewQueue = Boolean(
    leadForMatch &&
      matchLedger?.reviewQueue.some((r) => r.lead_id === leadForMatch.gmail_message_id)
  );

  let matchStep: LeadTraceStepMatch = {
    score: 0,
    signals: [],
    predicted_status: "unmatched",
    stored_match_status: "none",
    stored_imve_job_id: null,
    candidate_job_reference: storedMatchRecord?.candidate_job_reference ?? null,
    linked_job_reference: storedMatchRecord?.job_reference ?? null,
    reason_if_not_matched: "No CMM lead available for matching",
    thresholds: { auto_matched: 0, needs_review: REVIEW_MIN_EXPORT },
    explanation: null,
  };

  if (leadForMatch && job) {
    const evaluation = evaluateImveLeadMatch(leadForMatch, job);
    const { score, reasons } = evaluation;
    const predicted = classifyImveScore(evaluation);
    const storedMatch = storedMatchRecord;
    let reason = evaluation.decision_reason;
    if (evaluation.decision === "unmatched") {
      const missing: string[] = [];
      if (!leadForMatch.customer_email && !leadForMatch.customer_phone) {
        missing.push("lead has no email or phone for strong match");
      }
      if (!reasons.includes("email_exact") && !reasons.includes("phone_exact")) {
        missing.push("no email/phone exact match");
      }
      if (!evaluation.signals.name_strong && !evaluation.signals.name_fuzzy) {
        missing.push("weak name match");
      }
      reason = missing.join("; ") || evaluation.decision_reason;
    }
    matchStep = {
      score,
      signals: reasons,
      predicted_status: predicted,
      stored_match_status: storedMatch?.match_status ?? "none",
      stored_imve_job_id: storedMatch?.imve_job_id ?? null,
      candidate_job_reference:
        storedMatch?.candidate_job_reference ?? job.job_reference,
      linked_job_reference: storedMatch?.job_reference ?? job.job_reference,
      reason_if_not_matched: reason,
      thresholds: {
        auto_matched: 0,
        needs_review: REVIEW_MIN_EXPORT,
      },
      explanation: explainImveMatchDecision(leadForMatch, { job, score, reasons }),
    };
  }

  const matchStatus = storedMatchRecord?.match_status ?? "none";
  const approvalStep: LeadTraceStepApproval = {
    stored_match_status: matchStatus,
    is_manually_approved: matchStatus === "approved",
    is_auto_matched: matchStatus === "auto_matched",
    is_needs_review: matchStatus === "needs_review",
    is_rejected: matchStatus === "rejected",
    in_review_queue: inReviewQueue,
    candidate_job_reference: storedMatchRecord?.candidate_job_reference ?? job?.job_reference ?? null,
    linked_job_reference: storedMatchRecord?.job_reference ?? job?.job_reference ?? null,
  };

  const matchJobForSignals =
    job ?? imveJobs.find((j) => j.imve_id === storedMatchRecord?.imve_job_id);
  const hasDeposit =
    Boolean(storedMatchRecord?.deposit_paid) ||
    Boolean(matchJobForSignals?.deposit_paid) ||
    (matchJobForSignals?.deposit_amount ?? 0) > 0;
  const hasValue =
    (matchJobForSignals?.turnover ?? matchJobForSignals?.quote_value ?? 0) > 0;
  const depositValueStep: LeadTraceStepDepositValue = {
    job_deposit_paid: matchJobForSignals?.deposit_paid ?? false,
    job_deposit_amount: matchJobForSignals?.deposit_amount ?? null,
    job_turnover: matchJobForSignals?.turnover ?? null,
    job_quote_value: matchJobForSignals?.quote_value ?? null,
    match_deposit_paid: storedMatchRecord?.deposit_paid ?? false,
    has_deposit_signal: hasDeposit,
    has_value_signal: hasValue,
    qualifies_for_roi_data: hasDeposit || hasValue,
  };

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
    trace_mode: traceMode,
    roi_candidate_label: roiCandidate?.label ?? null,
    parser_test_note:
      traceMode === "parser"
        ? "Parser test only — Carl is a new unquoted lead; not used for ROI validation."
        : null,
    traced_at: new Date().toISOString(),
    cmm_parser_version: CMM_PARSER_VERSION,
    cmm_ledger_rebuilt_at: rebuiltAt,
    cmm_ledger_last_sync_at: syncMeta?.lastSyncAt ?? null,
    step1_gmail: {
      found: Boolean(gmailEmail),
      message_id: gmailEmail?.id ?? resolvedLead?.gmail_message_id ?? null,
      subject: gmailEmail?.subject ?? null,
      body_length: bodyText.length,
      body_preview:
        traceMode === "roi" && !runGmailParse
          ? "(skipped — ROI trace uses stored ledger; use Carl for parser test)"
          : bodyText.slice(0, 400) || null,
      snippet: gmailEmail?.snippet ?? null,
      search_used: searchUsed,
      failure_reason:
        traceMode === "roi" && storedLead
          ? null
          : gmailEmail
            ? null
            : "Gmail message not found for query",
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
    step_approval: approvalStep,
    step_deposit_value: depositValueStep,
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

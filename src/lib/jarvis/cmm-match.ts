import type {
  CmmBookedStatus,
  CmmLeadMatch,
  CmmLeadRecord,
  CmmMatchLedger,
  CmmMatchReviewItem,
  CmmMatchStats,
  JobRecord,
} from "./types";
import {
  buildPhoneJobIndex,
  classifyMatchScore,
  rankJobCandidates,
} from "./cmm-match-scoring";

function deriveBookedStatus(job: JobRecord | null): CmmBookedStatus {
  if (!job) return "unmatched";
  if (job.deposit_receipt_received_at) return "deposit_paid";
  if (job.quote_accepted_at) return "quote_accepted";
  if (job.quote_sent_at) return "quote_sent";
  if (job.survey_booked_at) return "survey_booked";
  if (job.lead_received_at) return "lead_only";
  return "lead_only";
}

function findDepositMessageId(job: JobRecord): string | null {
  if (!job.deposit_receipt_received_at) return null;
  return job.source_emails.at(-1) ?? null;
}

function buildMatchFromJob(
  lead: CmmLeadRecord,
  job: JobRecord,
  confidence: number,
  reason: string,
  status: CmmLeadMatch["match_status"]
): CmmLeadMatch {
  return {
    lead_id: lead.gmail_message_id,
    cmm_internal_id: lead.cmm_internal_id,
    matched_job_id: job.job_key,
    matched_quote_id: job.job_reference,
    matched_deposit_message_id: findDepositMessageId(job),
    match_confidence: confidence,
    match_reason: reason,
    match_status: status,
    quote_value: job.quote_value ?? job.final_move_value,
    deposit_paid_at: job.deposit_receipt_received_at,
    booked_status: deriveBookedStatus(job),
    candidate_job_id: null,
    candidate_job_name: null,
    candidate_confidence: null,
    updated_at: new Date().toISOString(),
  };
}

function emptyMatch(lead: CmmLeadRecord): CmmLeadMatch {
  return {
    lead_id: lead.gmail_message_id,
    cmm_internal_id: lead.cmm_internal_id,
    matched_job_id: null,
    matched_quote_id: null,
    matched_deposit_message_id: null,
    match_confidence: 0,
    match_reason: null,
    match_status: "unmatched",
    quote_value: null,
    deposit_paid_at: null,
    booked_status: "unmatched",
    candidate_job_id: null,
    candidate_job_name: null,
    candidate_confidence: null,
    updated_at: new Date().toISOString(),
  };
}

export function runCmmLeadMatching(
  leads: CmmLeadRecord[],
  jobs: JobRecord[],
  prior: CmmMatchLedger | null
): CmmMatchLedger {
  const phoneIndex = buildPhoneJobIndex(leads, jobs);
  const matches: Record<string, CmmLeadMatch> = {};
  const reviewQueue: CmmMatchReviewItem[] = [];
  const usedJobs = new Set<string>();

  const manualApproved = new Map<string, string>();
  const manualRejected = new Set<string>();
  for (const [leadId, match] of Object.entries(prior?.matches ?? {})) {
    if (match.match_status === "approved" && match.matched_job_id) {
      manualApproved.set(leadId, match.matched_job_id);
    }
    if (match.match_status === "rejected" && match.candidate_job_id) {
      manualRejected.add(`${leadId}|${match.candidate_job_id}`);
    }
  }

  for (const lead of leads) {
    const leadId = lead.gmail_message_id;
    const approvedJobId = manualApproved.get(leadId);
    if (approvedJobId) {
      const job = jobs.find((j) => j.job_key === approvedJobId);
      if (job) {
        matches[leadId] = {
          ...buildMatchFromJob(
            lead,
            job,
            1,
            "manual_approval",
            "approved"
          ),
        };
        usedJobs.add(job.job_key);
        continue;
      }
    }

    const candidates = rankJobCandidates(lead, jobs, phoneIndex).filter(
      (c) => !usedJobs.has(c.job.job_key)
    );

    const top = candidates[0];
    if (!top) {
      matches[leadId] = emptyMatch(lead);
      continue;
    }

    const rejectKey = `${leadId}|${top.job.job_key}`;
    if (manualRejected.has(rejectKey)) {
      const fallback = candidates.find(
        (c) => !manualRejected.has(`${leadId}|${c.job.job_key}`)
      );
      if (!fallback) {
        matches[leadId] = emptyMatch(lead);
        continue;
      }
      assignCandidate(lead, fallback, candidates, matches, reviewQueue, usedJobs);
      continue;
    }

    assignCandidate(lead, top, candidates, matches, reviewQueue, usedJobs);
  }

  const matchedLeadIds = new Set(
    Object.values(matches)
      .filter((m) => m.matched_job_id && m.match_status !== "unmatched")
      .map((m) => m.lead_id)
  );

  const unmatchedDepositJobs = jobs
    .filter((j) => j.deposit_receipt_received_at)
    .filter((j) => !usedJobs.has(j.job_key))
    .map((j) => ({
      job_key: j.job_key,
      customer_name: j.customer_name,
      deposit_paid_at: j.deposit_receipt_received_at,
    }));

  const stats: CmmMatchStats = {
    leadsMatchedConfidently: Object.values(matches).filter(
      (m) => m.match_status === "confident" || m.match_status === "approved"
    ).length,
    possibleMatchesNeedingReview: reviewQueue.length,
    unmatchedLeads: Object.values(matches).filter(
      (m) => m.match_status === "unmatched"
    ).length,
    unmatchedDepositJobs: unmatchedDepositJobs.length,
    totalLeads: leads.length,
    totalJobs: jobs.length,
    lastMatchedAt: new Date().toISOString(),
  };

  return {
    matches,
    reviewQueue: reviewQueue.slice(0, 50),
    unmatchedDepositJobs: unmatchedDepositJobs.slice(0, 20),
    stats,
    lastMatchedAt: stats.lastMatchedAt,
  };
}

function assignCandidate(
  lead: CmmLeadRecord,
  top: ReturnType<typeof rankJobCandidates>[number],
  candidates: ReturnType<typeof rankJobCandidates>,
  matches: Record<string, CmmLeadMatch>,
  reviewQueue: CmmMatchReviewItem[],
  usedJobs: Set<string>
) {
  const leadId = lead.gmail_message_id;
  const status = classifyMatchScore(top.score);
  const reason = top.reasons.join(", ");

  if (status === "confident") {
    matches[leadId] = buildMatchFromJob(
      lead,
      top.job,
      top.score,
      reason,
      "confident"
    );
    usedJobs.add(top.job.job_key);
    return;
  }

  const second = candidates[1];
  const ambiguous =
    second && second.score >= top.score - 0.08 && second.job.job_key !== top.job.job_key;

  matches[leadId] = {
    ...emptyMatch(lead),
    match_status: "needs_review",
    match_confidence: top.score,
    match_reason: reason,
    candidate_job_id: top.job.job_key,
    candidate_job_name: top.job.customer_name,
    candidate_confidence: top.score,
    booked_status: deriveBookedStatus(top.job),
    quote_value: top.job.quote_value,
    deposit_paid_at: top.job.deposit_receipt_received_at,
  };

  reviewQueue.push({
    lead_id: leadId,
    lead_name: lead.customer_name,
    lead_email: lead.customer_email,
    lead_postcode: lead.collection_postcode ?? lead.current_postcode,
    lead_received_at: lead.received_at,
    candidate_job_id: top.job.job_key,
    candidate_job_name: top.job.customer_name,
    candidate_job_reference: top.job.job_reference,
    candidate_deposit_at: top.job.deposit_receipt_received_at,
    confidence: top.score,
    match_reason: reason,
    ambiguous: Boolean(ambiguous),
  });
}

export function applyMatchReview(
  ledger: CmmMatchLedger,
  leadId: string,
  decision: "approve" | "reject",
  jobs: JobRecord[]
): CmmMatchLedger {
  const existing = ledger.matches[leadId];
  if (!existing) return ledger;

  if (decision === "approve" && existing.candidate_job_id) {
    const job = jobs.find((j) => j.job_key === existing.candidate_job_id);
    if (!job) return ledger;
    const leadStub = {
      gmail_message_id: leadId,
      cmm_internal_id: existing.cmm_internal_id,
    } as CmmLeadRecord;
    ledger.matches[leadId] = buildMatchFromJob(
      leadStub,
      job,
      Math.max(existing.match_confidence, 0.9),
      "manual_approval",
      "approved"
    );
  } else if (decision === "reject") {
    ledger.matches[leadId] = {
      ...existing,
      match_status: "rejected",
      matched_job_id: null,
      matched_quote_id: null,
      matched_deposit_message_id: null,
      booked_status: "unmatched",
      deposit_paid_at: null,
      updated_at: new Date().toISOString(),
    };
  }

  ledger.reviewQueue = ledger.reviewQueue.filter((r) => r.lead_id !== leadId);
  return ledger;
}

export function getJobForMatch(
  match: CmmLeadMatch | undefined,
  jobs: JobRecord[]
): JobRecord | null {
  if (!match?.matched_job_id) return null;
  return jobs.find((j) => j.job_key === match.matched_job_id) ?? null;
}

export function isMatchUsableForRoi(match: CmmLeadMatch | undefined): boolean {
  if (!match) return false;
  return (
    match.match_status === "confident" ||
    match.match_status === "approved"
  );
}

import type {
  ImveCmmLeadMatch,
  ImveCmmMatchLedger,
  ImveCmmMatchReviewItem,
  ImveCmmMatchStats,
  ImveJobRecord,
} from "./imve-types";
import type { CmmLeadRecord } from "./types";
import { normalizePhone } from "./cmm-match-scoring";
import { extractPostcodeArea, parseEmailDate } from "./extractors";

/** @deprecated Score thresholds replaced by rule-based classify; kept for debug display */
const AUTO_MATCH = 85;
const REVIEW_MIN = 55;
const AMBIGUITY_SCORE_GAP = 12;
const STRONG_NAME_SIM = 0.88;

function normalizePostcode(pc: string | null): string {
  return (pc ?? "").replace(/\s+/g, "").toUpperCase();
}

function normalizeName(name: string | null): string {
  return (name ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function nameParts(name: string | null): string[] {
  return normalizeName(name).split(" ").filter(Boolean);
}

function nameSimilarity(a: string | null, b: string | null): number {
  const na = normalizeName(a);
  const nb = normalizeName(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.88;

  const ta = new Set(na.split(" ").filter(Boolean));
  const tb = new Set(nb.split(" ").filter(Boolean));
  if (ta.size === 0 || tb.size === 0) return 0;
  let overlap = 0;
  for (const t of ta) if (tb.has(t)) overlap += 1;
  return overlap / Math.max(ta.size, tb.size);
}

function isStrongNameMatch(
  leadName: string | null,
  jobName: string | null,
  nameSim: number
): boolean {
  if (nameSim >= 0.95) return true;
  const lp = nameParts(leadName);
  const jp = nameParts(jobName);
  if (lp.length >= 2 && jp.length >= 2) {
    if (lp[0] === jp[0] && lp[lp.length - 1] === jp[jp.length - 1]) return true;
  }
  return nameSim >= STRONG_NAME_SIM;
}

function isFirstNameOnlyMatch(
  leadName: string | null,
  jobName: string | null,
  nameStrong: boolean
): boolean {
  if (nameStrong) return false;
  const lp = nameParts(leadName);
  const jp = nameParts(jobName);
  if (lp.length === 0 || jp.length === 0) return false;
  return lp[0] === jp[0];
}

export function hasImveDepositValueSignal(job: ImveJobRecord): boolean {
  return (
    job.deposit_paid ||
    (job.deposit_amount ?? 0) > 0 ||
    (job.turnover ?? 0) > 0 ||
    (job.quote_value ?? 0) > 0
  );
}

function hasCmmSourceSignal(lead: CmmLeadRecord, job: ImveJobRecord): boolean {
  const src = `${lead.lead_source} ${job.lead_source ?? ""}`.toLowerCase();
  return /cmm|compare\s*my\s*move|comparemymove/.test(src);
}

function moveDateScore(leadDate: string | null, jobDate: string | null): number {
  const a = leadDate ? parseEmailDate(leadDate)?.getTime() : null;
  const b = jobDate ? parseEmailDate(jobDate)?.getTime() : null;
  if (a == null || b == null) return 0;
  const days = Math.abs(a - b) / (24 * 60 * 60 * 1000);
  if (days <= 3) return 10;
  if (days <= 14) return 7;
  if (days <= 30) return 4;
  return 0;
}

export type ImveMatchSignals = {
  email_exact: boolean;
  phone_exact: boolean;
  name_strong: boolean;
  name_fuzzy: boolean;
  name_first_only: boolean;
  postcode_exact: boolean;
  postcode_area: boolean;
  cmm_source: boolean;
  has_deposit_value: boolean;
};

export type ImveMatchEvaluation = {
  score: number;
  reasons: string[];
  signals: ImveMatchSignals;
  decision: "auto_matched" | "needs_review" | "unmatched";
  decision_reason: string;
};

function decideImveMatch(
  signals: ImveMatchSignals,
  score: number
): Pick<ImveMatchEvaluation, "decision" | "decision_reason"> {
  if (signals.email_exact) {
    return { decision: "auto_matched", decision_reason: "auto_email_exact" };
  }
  if (signals.phone_exact) {
    return { decision: "auto_matched", decision_reason: "auto_phone_exact" };
  }
  if (signals.name_strong && signals.postcode_exact) {
    return { decision: "auto_matched", decision_reason: "auto_name_postcode_exact" };
  }
  if (
    signals.name_strong &&
    signals.postcode_area &&
    signals.has_deposit_value &&
    signals.cmm_source
  ) {
    return {
      decision: "auto_matched",
      decision_reason: "auto_name_area_deposit_cmm",
    };
  }

  if (
    signals.postcode_area &&
    !signals.name_strong &&
    !signals.name_fuzzy &&
    !signals.name_first_only &&
    !signals.email_exact &&
    !signals.phone_exact
  ) {
    return { decision: "unmatched", decision_reason: "postcode_area_only" };
  }

  if (
    signals.name_fuzzy &&
    !signals.postcode_exact &&
    !signals.email_exact &&
    !signals.phone_exact &&
    !signals.name_strong
  ) {
    return { decision: "unmatched", decision_reason: "fuzzy_name_only" };
  }

  if (
    !signals.email_exact &&
    !signals.phone_exact &&
    !signals.name_strong &&
    !signals.name_fuzzy &&
    !signals.name_first_only
  ) {
    return { decision: "unmatched", decision_reason: "no_name_match" };
  }

  if (signals.name_strong && signals.postcode_area) {
    return {
      decision: "needs_review",
      decision_reason: "name_area_missing_deposit_or_cmm",
    };
  }

  if (signals.name_fuzzy && (signals.postcode_exact || signals.postcode_area)) {
    return {
      decision: "needs_review",
      decision_reason: "fuzzy_name_with_postcode",
    };
  }

  if (signals.name_first_only && signals.postcode_area) {
    return {
      decision: "needs_review",
      decision_reason: "first_name_area_weak",
    };
  }

  if (
    signals.email_exact ||
    signals.phone_exact ||
    signals.name_strong ||
    score >= REVIEW_MIN
  ) {
    return { decision: "needs_review", decision_reason: "plausible_partial_match" };
  }

  return { decision: "unmatched", decision_reason: "below_review_threshold" };
}

export function scoreImveLeadMatch(
  lead: CmmLeadRecord,
  job: ImveJobRecord
): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  const leadEmail = lead.customer_email?.toLowerCase();
  const jobEmail = job.customer_email?.toLowerCase();
  if (leadEmail && jobEmail && leadEmail === jobEmail) {
    score += 40;
    reasons.push("email_exact");
  }

  const leadPhone = normalizePhone(lead.customer_phone);
  const jobPhone = normalizePhone(job.customer_phone);
  if (leadPhone && jobPhone && leadPhone === jobPhone) {
    score += 25;
    reasons.push("phone_exact");
  }

  const nameSim = nameSimilarity(lead.customer_name, job.customer_name);
  if (nameSim >= 0.95) {
    score += 20;
    reasons.push("name_exact");
  } else if (nameSim >= 0.65) {
    score += Math.round(nameSim * 15);
    reasons.push("name_fuzzy");
  }

  const leadPc = normalizePostcode(
    lead.collection_postcode ?? lead.current_postcode
  );
  const jobPc = normalizePostcode(job.from_postcode);
  if (leadPc && jobPc && leadPc === jobPc) {
    score += 12;
    reasons.push("postcode_match");
  } else {
    const leadArea = extractPostcodeArea(
      lead.collection_postcode ?? lead.current_postcode
    );
    const jobArea = job.from_area ?? extractPostcodeArea(job.from_postcode);
    if (
      leadArea &&
      jobArea &&
      leadArea !== "Unknown" &&
      jobArea !== "Unknown" &&
      leadArea === jobArea
    ) {
      score += 8;
      reasons.push("postcode_area_match");
    }
  }

  const dateScore = moveDateScore(lead.move_date, job.move_date);
  score += dateScore;
  if (dateScore > 0) {
    reasons.push("move_date_proximity");
  }

  if (hasCmmSourceSignal(lead, job)) {
    score += 8;
    reasons.push("lead_source_cmm");
  }

  if (job.deposit_paid) {
    score += 3;
    reasons.push("imve_deposit_paid");
  }

  if (hasImveDepositValueSignal(job)) {
    reasons.push("deposit_or_value_signal");
  }

  return { score: Math.min(score, 100), reasons };
}

export function evaluateImveLeadMatch(
  lead: CmmLeadRecord,
  job: ImveJobRecord
): ImveMatchEvaluation {
  const { score, reasons } = scoreImveLeadMatch(lead, job);

  const leadEmail = lead.customer_email?.toLowerCase();
  const jobEmail = job.customer_email?.toLowerCase();
  const email_exact = Boolean(leadEmail && jobEmail && leadEmail === jobEmail);

  const leadPhone = normalizePhone(lead.customer_phone);
  const jobPhone = normalizePhone(job.customer_phone);
  const phone_exact = Boolean(leadPhone && jobPhone && leadPhone === jobPhone);

  const nameSim = nameSimilarity(lead.customer_name, job.customer_name);
  const name_strong = isStrongNameMatch(
    lead.customer_name,
    job.customer_name,
    nameSim
  );
  const name_fuzzy = nameSim >= 0.65 && !name_strong;
  const name_first_only = isFirstNameOnlyMatch(
    lead.customer_name,
    job.customer_name,
    name_strong
  );

  const leadPc = normalizePostcode(
    lead.collection_postcode ?? lead.current_postcode
  );
  const jobPc = normalizePostcode(job.from_postcode);
  const postcode_exact = Boolean(leadPc && jobPc && leadPc === jobPc);

  const leadArea = extractPostcodeArea(
    lead.collection_postcode ?? lead.current_postcode
  );
  const jobArea = job.from_area ?? extractPostcodeArea(job.from_postcode);
  const postcode_area = Boolean(
    !postcode_exact &&
      leadArea &&
      jobArea &&
      leadArea !== "Unknown" &&
      jobArea !== "Unknown" &&
      leadArea === jobArea
  );

  const signals: ImveMatchSignals = {
    email_exact,
    phone_exact,
    name_strong,
    name_fuzzy,
    name_first_only,
    postcode_exact,
    postcode_area,
    cmm_source: hasCmmSourceSignal(lead, job),
    has_deposit_value: hasImveDepositValueSignal(job),
  };

  const { decision, decision_reason } = decideImveMatch(signals, score);

  return { score, reasons, signals, decision, decision_reason };
}

function resolveMatchStatus(
  ranked: Array<ImveMatchEvaluation & { job: ImveJobRecord }>
): { status: ImveMatchEvaluation["decision"]; reason: string } {
  const top = ranked[0];
  let status = top.decision;
  let reason = `${top.decision_reason}; ${top.reasons.join(", ")}`;

  if (ranked.length >= 2) {
    const second = ranked[1];
    if (second.decision !== "unmatched") {
      const gap = top.score - second.score;
      if (
        gap <= AMBIGUITY_SCORE_GAP &&
        (top.decision === "auto_matched" || second.decision === "auto_matched")
      ) {
        status = "needs_review";
        reason = `ambiguous_match; ${reason}`;
      }
    }
  }

  return { status, reason };
}

export function rankImveCandidatesForLead(
  lead: CmmLeadRecord,
  jobs: ImveJobRecord[],
  limit = 3
): Array<{
  job: ImveJobRecord;
  score: number;
  reasons: string[];
  decision: ImveMatchEvaluation["decision"];
  decision_reason: string;
}> {
  return jobs
    .map((job) => ({ job, ...evaluateImveLeadMatch(lead, job) }))
    .filter((c) => c.decision !== "unmatched")
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ job, score, reasons, decision, decision_reason }) => ({
      job,
      score,
      reasons,
      decision,
      decision_reason,
    }));
}

export function explainImveMatchDecision(
  lead: CmmLeadRecord,
  topCandidate: { job: ImveJobRecord; score: number; reasons: string[] }
): string {
  const evaluation = evaluateImveLeadMatch(lead, topCandidate.job);
  const parts = [
    `${evaluation.decision} (${evaluation.decision_reason})`,
    `Score ${evaluation.score}/100`,
    `Signals: ${evaluation.reasons.join(", ") || "none"}`,
    `Lead: ${lead.customer_name ?? "?"} (${lead.customer_email ?? "no email"})`,
    `Job: ${topCandidate.job.customer_name ?? "?"} (${topCandidate.job.job_reference ?? topCandidate.job.imve_id})`,
  ];
  return parts.join(" · ");
}

export function runImveCmmMatching(
  leads: CmmLeadRecord[],
  imveJobs: ImveJobRecord[],
  prior: ImveCmmMatchLedger | null
): ImveCmmMatchLedger {
  const matches: Record<string, ImveCmmLeadMatch> = {};
  const reviewQueue: ImveCmmMatchReviewItem[] = [];
  const usedJobs = new Set<string>();

  const approved = new Map<string, string>();
  for (const [leadId, match] of Object.entries(prior?.matches ?? {})) {
    if (match.match_status === "approved" && match.imve_job_id) {
      approved.set(leadId, match.imve_job_id);
    }
  }

  const approvedLeads = leads.filter((l) => approved.has(l.gmail_message_id));
  const otherLeads = leads.filter((l) => !approved.has(l.gmail_message_id));

  for (const lead of [...approvedLeads, ...otherLeads]) {
    const leadId = lead.gmail_message_id;
    const approvedJobId = approved.get(leadId);
    if (approvedJobId) {
      const job = imveJobs.find((j) => j.imve_id === approvedJobId);
      if (job) {
        matches[leadId] = buildMatch(lead, job, 100, "manual_approval", "approved");
        usedJobs.add(job.imve_id);
        continue;
      }
    }

    const ranked = imveJobs
      .filter((j) => !usedJobs.has(j.imve_id))
      .map((job) => ({ job, ...evaluateImveLeadMatch(lead, job) }))
      .filter((c) => c.decision !== "unmatched")
      .sort((a, b) => b.score - a.score);

    const top = ranked[0];
    if (!top) {
      matches[leadId] = emptyMatch(lead);
      continue;
    }

    const { status, reason } = resolveMatchStatus(ranked);

    if (status === "auto_matched") {
      matches[leadId] = buildMatch(lead, top.job, top.score, reason, "auto_matched");
      usedJobs.add(top.job.imve_id);
      continue;
    }

    matches[leadId] = {
      ...emptyMatch(lead),
      match_status: "needs_review",
      match_confidence: top.score,
      match_reason: reason,
      candidate_imve_job_id: top.job.imve_id,
      candidate_job_reference: top.job.job_reference,
      candidate_customer_name: top.job.customer_name,
      candidate_confidence: top.score,
      deposit_paid: top.job.deposit_paid,
      deposit_paid_at: top.job.deposit_paid_at,
      booked: top.job.booked,
      turnover: top.job.turnover,
      commission: top.job.commission,
    };

    reviewQueue.push({
      lead_id: leadId,
      lead_name: lead.customer_name,
      lead_email: lead.customer_email,
      lead_postcode: lead.collection_postcode ?? lead.current_postcode,
      lead_received_at: lead.received_at,
      candidate_imve_job_id: top.job.imve_id,
      candidate_job_reference: top.job.job_reference,
      candidate_customer_name: top.job.customer_name,
      candidate_deposit_paid: top.job.deposit_paid,
      confidence: top.score,
      match_reason: reason,
    });
  }

  const stats: ImveCmmMatchStats = {
    autoMatched: Object.values(matches).filter(
      (m) => m.match_status === "auto_matched" || m.match_status === "approved"
    ).length,
    needsReview: reviewQueue.length,
    unmatched: Object.values(matches).filter((m) => m.match_status === "unmatched")
      .length,
    totalLeads: leads.length,
    totalImveJobs: imveJobs.length,
    lastMatchedAt: new Date().toISOString(),
  };

  return {
    matches,
    reviewQueue: reviewQueue.slice(0, 50),
    stats,
    lastMatchedAt: stats.lastMatchedAt,
  };
}

function buildMatch(
  lead: CmmLeadRecord,
  job: ImveJobRecord,
  confidence: number,
  reason: string,
  status: ImveCmmLeadMatch["match_status"]
): ImveCmmLeadMatch {
  return {
    lead_id: lead.gmail_message_id,
    cmm_internal_id: lead.cmm_internal_id,
    imve_job_id: job.imve_id,
    job_reference: job.job_reference,
    match_confidence: confidence,
    match_reason: reason,
    match_status: status,
    deposit_paid: job.deposit_paid,
    deposit_paid_at: job.deposit_paid_at,
    booked: job.booked,
    turnover: job.turnover,
    commission: job.commission,
    candidate_imve_job_id: null,
    candidate_job_reference: null,
    candidate_customer_name: null,
    candidate_confidence: null,
    updated_at: new Date().toISOString(),
  };
}

function emptyMatch(lead: CmmLeadRecord): ImveCmmLeadMatch {
  return {
    lead_id: lead.gmail_message_id,
    cmm_internal_id: lead.cmm_internal_id,
    imve_job_id: null,
    job_reference: null,
    match_confidence: 0,
    match_reason: null,
    match_status: "unmatched",
    deposit_paid: false,
    deposit_paid_at: null,
    booked: false,
    turnover: null,
    commission: null,
    candidate_imve_job_id: null,
    candidate_job_reference: null,
    candidate_customer_name: null,
    candidate_confidence: null,
    updated_at: new Date().toISOString(),
  };
}

export function applyImveMatchReview(
  ledger: ImveCmmMatchLedger,
  leadId: string,
  decision: "approve" | "reject",
  imveJobs: ImveJobRecord[]
): ImveCmmMatchLedger {
  const existing = ledger.matches[leadId];
  if (!existing) return ledger;

  if (decision === "approve" && existing.candidate_imve_job_id) {
    const job = imveJobs.find((j) => j.imve_id === existing.candidate_imve_job_id);
    if (job) {
      ledger.matches[leadId] = buildMatch(
        { gmail_message_id: leadId, cmm_internal_id: existing.cmm_internal_id } as CmmLeadRecord,
        job,
        Math.max(existing.match_confidence, 95),
        "manual_approval",
        "approved"
      );
    }
  } else if (decision === "reject") {
    ledger.matches[leadId] = {
      ...existing,
      match_status: "rejected",
      imve_job_id: null,
      job_reference: null,
      deposit_paid: false,
      booked: false,
      turnover: null,
      commission: null,
      updated_at: new Date().toISOString(),
    };
  }

  ledger.reviewQueue = ledger.reviewQueue.filter((r) => r.lead_id !== leadId);
  return ledger;
}

export function isImveMatchUsableForRoi(
  match: ImveCmmLeadMatch | undefined
): boolean {
  if (!match) return false;
  return (
    match.match_status === "auto_matched" || match.match_status === "approved"
  );
}

export { AUTO_MATCH, REVIEW_MIN };

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

const AUTO_MATCH = 85;
const REVIEW_MIN = 55;

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

function leadSourceScore(lead: CmmLeadRecord, job: ImveJobRecord): number {
  const src = `${lead.lead_source} ${job.lead_source ?? ""}`.toLowerCase();
  if (/cmm|compare\s*my\s*move|comparemymove/.test(src)) return 8;
  return 0;
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

  const sourceScore = leadSourceScore(lead, job);
  score += sourceScore;
  if (sourceScore > 0) reasons.push("lead_source_cmm");

  if (job.deposit_paid) {
    score += 3;
    reasons.push("imve_deposit_paid");
  }

  return { score: Math.min(score, 100), reasons };
}

function classifyImveScore(score: number): ImveCmmLeadMatch["match_status"] {
  if (score >= AUTO_MATCH) return "auto_matched";
  if (score >= REVIEW_MIN) return "needs_review";
  return "unmatched";
}

export function rankImveCandidatesForLead(
  lead: CmmLeadRecord,
  jobs: ImveJobRecord[],
  limit = 3
): Array<{ job: ImveJobRecord; score: number; reasons: string[] }> {
  return jobs
    .map((job) => ({ job, ...scoreImveLeadMatch(lead, job) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function explainImveMatchDecision(
  lead: CmmLeadRecord,
  topCandidate: { job: ImveJobRecord; score: number; reasons: string[] }
): string {
  const status = classifyImveScore(topCandidate.score);
  const parts = [
    `Score ${topCandidate.score}/100 → ${status}`,
    `Signals: ${topCandidate.reasons.join(", ") || "none"}`,
    `Lead: ${lead.customer_name ?? "?"} (${lead.customer_email ?? "no email"})`,
    `Job: ${topCandidate.job.customer_name ?? "?"} (${topCandidate.job.job_reference ?? topCandidate.job.imve_id})`,
  ];
  if (status === "auto_matched") {
    parts.push(`Met auto-match threshold (${AUTO_MATCH}).`);
  } else if (status === "needs_review") {
    parts.push(
      `Below auto-match (${AUTO_MATCH}) but above review minimum (${REVIEW_MIN}).`
    );
  } else {
    parts.push(`Below review minimum (${REVIEW_MIN}).`);
  }
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

  for (const lead of leads) {
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
      .map((job) => ({ job, ...scoreImveLeadMatch(lead, job) }))
      .filter((c) => c.score >= REVIEW_MIN)
      .sort((a, b) => b.score - a.score);

    const top = ranked[0];
    if (!top) {
      matches[leadId] = emptyMatch(lead);
      continue;
    }

    const status = classifyImveScore(top.score);
    const reason = top.reasons.join(", ");

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

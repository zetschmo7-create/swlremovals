import type { CmmLeadRecord, JobRecord } from "./types";
import { parseEmailDate } from "./extractors";

const CONFIDENT_THRESHOLD = 0.72;
const REVIEW_THRESHOLD = 0.42;

export function normalizePhone(raw: string | null): string | null {
  if (!raw) return null;
  let digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+44")) digits = `0${digits.slice(3)}`;
  if (digits.startsWith("44") && digits.length >= 12) digits = `0${digits.slice(2)}`;
  return digits.length >= 10 ? digits : null;
}

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

function parseMoveDate(value: string | null): number | null {
  if (!value) return null;
  const iso = value.slice(0, 10);
  const d = parseEmailDate(iso) ?? new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.getTime();
}

function moveDateProximityScore(
  leadDate: string | null,
  jobDate: string | null
): number {
  const a = parseMoveDate(leadDate);
  const b = parseMoveDate(jobDate);
  if (a == null || b == null) return 0;
  const days = Math.abs(a - b) / (24 * 60 * 60 * 1000);
  if (days <= 3) return 0.2;
  if (days <= 14) return 0.12;
  if (days <= 30) return 0.06;
  return 0;
}

export type LeadJobMatchCandidate = {
  job: JobRecord;
  score: number;
  reasons: string[];
};

export function scoreLeadJobMatch(
  lead: CmmLeadRecord,
  job: JobRecord,
  phoneJobIndex: Map<string, string[]>
): LeadJobMatchCandidate {
  const reasons: string[] = [];
  let score = 0;

  const leadEmail = lead.customer_email?.toLowerCase() ?? null;
  const jobEmail = job.customer_email?.toLowerCase() ?? null;
  if (leadEmail && jobEmail && leadEmail === jobEmail) {
    score += 0.55;
    reasons.push("customer_email_exact");
  }

  const leadPhone = normalizePhone(lead.customer_phone);
  if (leadPhone) {
    const jobsForPhone = phoneJobIndex.get(leadPhone) ?? [];
    if (jobsForPhone.includes(job.job_key)) {
      score += 0.35;
      reasons.push("phone_normalised_match");
    }
  }

  const nameSim = nameSimilarity(lead.customer_name, job.customer_name);
  if (nameSim >= 0.95) {
    score += 0.22;
    reasons.push("customer_name_exact");
  } else if (nameSim >= 0.7) {
    score += 0.14;
    reasons.push("customer_name_fuzzy");
  }

  const leadPc = normalizePostcode(
    lead.collection_postcode ?? lead.current_postcode
  );
  const jobPc = normalizePostcode(job.moving_from_postcode);
  if (leadPc && jobPc && leadPc === jobPc) {
    score += 0.18;
    reasons.push("postcode_match");
  }

  const moveScore = moveDateProximityScore(lead.move_date, job.move_date);
  if (moveScore > 0) {
    score += moveScore;
    reasons.push("move_date_proximity");
  }

  if (job.deposit_receipt_received_at) {
    score += 0.05;
    reasons.push("job_has_deposit");
  }

  return { job, score: Math.min(score, 1), reasons };
}

export function buildPhoneJobIndex(
  leads: CmmLeadRecord[],
  jobs: JobRecord[]
): Map<string, string[]> {
  const emailToPhone = new Map<string, string>();
  for (const lead of leads) {
    const email = lead.customer_email?.toLowerCase();
    const phone = normalizePhone(lead.customer_phone);
    if (email && phone) emailToPhone.set(email, phone);
  }

  const index = new Map<string, string[]>();
  for (const job of jobs) {
    const email = job.customer_email?.toLowerCase();
    if (!email) continue;
    const phone = emailToPhone.get(email);
    if (!phone) continue;
    const list = index.get(phone) ?? [];
    if (!list.includes(job.job_key)) list.push(job.job_key);
    index.set(phone, list);
  }
  return index;
}

export function rankJobCandidates(
  lead: CmmLeadRecord,
  jobs: JobRecord[],
  phoneJobIndex: Map<string, string[]>
): LeadJobMatchCandidate[] {
  return jobs
    .map((job) => scoreLeadJobMatch(lead, job, phoneJobIndex))
    .filter((c) => c.score >= REVIEW_THRESHOLD)
    .sort((a, b) => b.score - a.score);
}

export function classifyMatchScore(score: number): "confident" | "needs_review" | "unmatched" {
  if (score >= CONFIDENT_THRESHOLD) return "confident";
  if (score >= REVIEW_THRESHOLD) return "needs_review";
  return "unmatched";
}

export { CONFIDENT_THRESHOLD, REVIEW_THRESHOLD };

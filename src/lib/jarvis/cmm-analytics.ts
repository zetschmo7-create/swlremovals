import type {
  CmmAreaAnalytics,
  CmmLeadIntelligence,
  CmmLeadMatch,
  CmmLeadRecord,
  CmmMatchLedger,
  CmmMatchStats,
  JobRecord,
  PostcodeArea,
} from "./types";
import type { JarvisSettings } from "./settings-store";
import { getCmmLeadLedger, getCmmSyncMeta } from "./cmm-lead-store";
import {
  getCmmMatchLedger,
  saveCmmMatchLedger,
} from "./cmm-match-store";
import {
  getJobForMatch,
  isMatchUsableForRoi,
  runCmmLeadMatching,
} from "./cmm-match";
import { getJobsForCmmMatching } from "./jarvis-jobs";
import { parseEmailDate } from "./extractors";
import { getImveImportLedgerOrEmpty } from "./imve-store";
import { isImveRoiActive } from "./imve-validate";
import { getImveCmmMatchLedger } from "./imve-cmm-match-store";
import { isImveMatchUsableForRoi } from "./imve-cmm-match";
import { imveJobToJobRecord } from "./imve-to-job";
import type {
  ImveCmmLeadMatch,
  ImveCmmMatchLedger,
  ImveJobRecord,
} from "./imve-types";
import { buildCmmCompletenessStats } from "./cmm-completeness";
import {
  evaluateImveMatchForRoi,
  imveRoiMetricsFromEvaluations,
} from "./imve-roi-debug";

const ALL_AREAS: PostcodeArea[] = ["GU", "RH", "TN", "SM", "CR", "Other", "Unknown"];

const EMPTY_MATCH_STATS: CmmMatchStats = {
  leadsMatchedConfidently: 0,
  possibleMatchesNeedingReview: 0,
  unmatchedLeads: 0,
  unmatchedDepositJobs: 0,
  totalLeads: 0,
  totalJobs: 0,
  lastMatchedAt: null,
};

function startOfWeek(d: Date): Date {
  const copy = new Date(d);
  const day = copy.getDay();
  const diff = day === 0 ? 6 : day - 1;
  copy.setDate(copy.getDate() - diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function leadDate(lead: CmmLeadRecord): Date | null {
  return parseEmailDate(lead.received_at);
}

function inToday(lead: CmmLeadRecord, now: Date): boolean {
  const d = leadDate(lead);
  if (!d) return false;
  return d.toISOString().slice(0, 10) === now.toISOString().slice(0, 10);
}

function inThisWeek(lead: CmmLeadRecord, now: Date): boolean {
  const d = leadDate(lead);
  if (!d) return false;
  return d >= startOfWeek(now);
}

function inThisMonth(lead: CmmLeadRecord, now: Date): boolean {
  const d = leadDate(lead);
  if (!d) return false;
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function inLastDays(lead: CmmLeadRecord, days: number, now: Date): boolean {
  const d = leadDate(lead);
  if (!d) return false;
  const cutoff = now.getTime() - days * 24 * 60 * 60 * 1000;
  return d.getTime() >= cutoff;
}

function buildTimeSeries(
  leads: CmmLeadRecord[],
  cost: number,
  mode: "daily" | "weekly" | "monthly",
  now: Date
): { labels: string[]; leads: number[]; spend: number[] } {
  const buckets = new Map<string, number>();

  for (const lead of leads) {
    const d = leadDate(lead);
    if (!d) continue;
    let key: string;
    if (mode === "daily") {
      key = d.toISOString().slice(0, 10);
    } else if (mode === "weekly") {
      key = startOfWeek(d).toISOString().slice(0, 10);
    } else {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    }
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  const sorted = [...buckets.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const limit = mode === "daily" ? 30 : 12;
  const slice = sorted.slice(-limit);

  return {
    labels: slice.map(([k]) => k),
    leads: slice.map(([, c]) => c),
    spend: slice.map(([, c]) => c * cost),
  };
}

function collectMatchedJobsForArea(
  areaLeads: CmmLeadRecord[],
  matches: Record<string, CmmLeadMatch>,
  jobs: JobRecord[]
): JobRecord[] {
  const seen = new Set<string>();
  const matched: JobRecord[] = [];

  for (const lead of areaLeads) {
    const match = matches[lead.gmail_message_id];
    if (!isMatchUsableForRoi(match)) continue;
    const job = getJobForMatch(match, jobs);
    if (!job || seen.has(job.job_key)) continue;
    seen.add(job.job_key);
    matched.push(job);
  }

  return matched;
}

function collectImveMatchedJobsForArea(
  areaLeads: CmmLeadRecord[],
  matches: Record<string, ImveCmmLeadMatch>,
  imveJobs: ImveJobRecord[]
): JobRecord[] {
  const seen = new Set<string>();
  const matched: JobRecord[] = [];
  const jobById = new Map(imveJobs.map((j) => [j.imve_id, j]));

  for (const lead of areaLeads) {
    const match = matches[lead.gmail_message_id];
    if (!isImveMatchUsableForRoi(match) || !match?.imve_job_id) continue;
    const imveJob = jobById.get(match.imve_job_id);
    if (!imveJob) continue;

    const hasDeposit =
      match.deposit_paid ||
      imveJob.deposit_paid ||
      (imveJob.deposit_amount ?? 0) > 0;
    const hasValue = (imveJob.turnover ?? imveJob.quote_value ?? 0) > 0;
    if (!hasDeposit && !hasValue) continue;

    const job = imveJobToJobRecord(imveJob);
    if (match.deposit_paid && !job.deposit_receipt_received_at) {
      job.deposit_receipt_received_at =
        match.deposit_paid_at ?? imveJob.deposit_paid_at ?? job.deposit_receipt_received_at;
    }
    if (seen.has(job.job_key)) continue;
    seen.add(job.job_key);
    matched.push(job);
  }

  return matched;
}

function buildAreaAnalytics(
  areaLeads: CmmLeadRecord[],
  matches: Record<string, CmmLeadMatch>,
  jobs: JobRecord[],
  imveMatches: Record<string, ImveCmmLeadMatch> | null,
  imveJobs: ImveJobRecord[],
  useImveRoi: boolean,
  cost: number,
  now: Date
): CmmAreaAnalytics {
  const countIn = (fn: (l: CmmLeadRecord) => boolean) =>
    areaLeads.filter(fn).length;

  const today = countIn((l) => inToday(l, now));
  const thisWeek = countIn((l) => inThisWeek(l, now));
  const thisMonth = countIn((l) => inThisMonth(l, now));
  const allTime = areaLeads.length;

  const spendAll = allTime * cost;

  let depositsPaid: number;
  let turnover: number;
  let commission: number;
  let conversionRate: number | null;
  let roi: number | null;

  if (useImveRoi && imveMatches) {
    const jobById = new Map(imveJobs.map((j) => [j.imve_id, j]));
    const evaluations = areaLeads.map((lead) =>
      evaluateImveMatchForRoi(
        lead,
        imveMatches[lead.gmail_message_id],
        jobById.get(imveMatches[lead.gmail_message_id]?.imve_job_id ?? "")
      )
    );
    const metrics = imveRoiMetricsFromEvaluations(evaluations);
    depositsPaid = metrics.depositsPaid;
    turnover = metrics.turnover;
    commission = metrics.commission;
    conversionRate =
      allTime > 0 && depositsPaid > 0 ? depositsPaid / allTime : null;
    roi =
      spendAll > 0 && turnover > 0 ? (turnover - spendAll) / spendAll : null;
  } else {
    const matchedJobs = collectMatchedJobsForArea(areaLeads, matches, jobs);
    depositsPaid = matchedJobs.filter((j) => j.deposit_receipt_received_at)
      .length;
    turnover = matchedJobs
      .filter((j) => j.deposit_receipt_received_at)
      .reduce((s, j) => s + (j.final_move_value ?? j.quote_value ?? 0), 0);
    commission = matchedJobs
      .filter((j) => j.commission_payable)
      .reduce((s, j) => s + (j.commission_value ?? 0), 0);
    conversionRate =
      allTime > 0 && depositsPaid > 0 ? depositsPaid / allTime : null;
    roi =
      conversionRate != null && spendAll > 0
        ? (turnover - spendAll) / spendAll
        : null;
  }

  const needsReviewLeads = areaLeads.filter((l) => {
    const leadId = l.gmail_message_id;
    if (useImveRoi && imveMatches) {
      return imveMatches[leadId]?.match_status === "needs_review";
    }
    return matches[leadId]?.match_status === "needs_review";
  }).length;

  const needsReview =
    areaLeads.some((l) => l.collection_postcode_area === "Unknown") ||
    needsReviewLeads > 0;

  return {
    today: { leads: today, spend: today * cost },
    thisWeek: { leads: thisWeek, spend: thisWeek * cost },
    thisMonth: { leads: thisMonth, spend: thisMonth * cost },
    allTime: { leads: allTime, spend: spendAll },
    depositsPaid,
    conversionRate,
    turnover,
    commission,
    roi,
    costPerPaidDeposit: depositsPaid > 0 ? spendAll / depositsPaid : null,
    needsReview,
  };
}

export async function rematchCmmLeads(
  leads: CmmLeadRecord[],
  jobs: JobRecord[]
): Promise<CmmMatchLedger> {
  const prior = await getCmmMatchLedger();
  const ledger = runCmmLeadMatching(leads, jobs, prior);
  await saveCmmMatchLedger(ledger);
  return ledger;
}

export function buildCmmLeadIntelligenceFromLeads(
  leads: CmmLeadRecord[],
  jobs: JobRecord[],
  settings: JarvisSettings,
  syncMeta: CmmLeadIntelligence["syncMeta"] | null,
  matchLedger: CmmMatchLedger | null,
  imveMatchLedger: Awaited<ReturnType<typeof getImveCmmMatchLedger>> | null,
  imveJobs: ImveJobRecord[],
  imveRoiActive: boolean
): CmmLeadIntelligence {
  const cost = settings.costPerLead;
  const now = new Date();
  const matches = matchLedger?.matches ?? {};
  const imveMatches = imveMatchLedger?.matches ?? null;
  const useImveRoi = imveRoiActive && imveJobs.length > 0;

  const leadsToday = leads.filter((l) => inToday(l, now)).length;
  const leadsThisWeek = leads.filter((l) => inThisWeek(l, now)).length;
  const leadsThisMonth = leads.filter((l) => inThisMonth(l, now)).length;
  const leadsLast30Days = leads.filter((l) => inLastDays(l, 30, now)).length;
  const leadsAllTime = leads.length;

  const unknownPostcodes = leads.filter(
    (l) => l.collection_postcode_area === "Unknown"
  ).length;

  const byArea = Object.fromEntries(
    ALL_AREAS.map((area) => {
      const areaLeads = leads.filter((l) => l.collection_postcode_area === area);
      return [
        area,
        buildAreaAnalytics(
          areaLeads,
          matches,
          jobs,
          imveMatches,
          imveJobs,
          useImveRoi,
          cost,
          now
        ),
      ];
    })
  ) as Record<PostcodeArea, CmmAreaAnalytics>;

  const topAreas = ALL_AREAS.map((area) => ({
    area,
    leads: byArea[area].allTime.leads,
    spend: byArea[area].allTime.spend,
  }))
    .filter((a) => a.leads > 0)
    .sort((a, b) => b.leads - a.leads)
    .slice(0, 7);

  const unknownPostcodeLeads = leads
    .filter((l) => l.collection_postcode_area === "Unknown")
    .slice(0, 20)
    .map((l) => ({
      customer_name: l.customer_name,
      received_at: l.received_at,
      reason: l.needs_review_reason,
    }));

  const defaultMeta: CmmLeadIntelligence["syncMeta"] = {
    messagesScanned: 0,
    leadsParsed: 0,
    duplicatesSkipped: 0,
    unknownPostcodes: 0,
    lastMessageDate: null,
    labelFound: false,
    lastSyncAt: null,
    error: null,
    debug: {
      labelName: null,
      labelId: null,
      messageIdsReturned: 0,
      messagesFetched: 0,
      parseSuccesses: 0,
      parseFailures: 0,
      duplicatesSkipped: 0,
      sampleParseFailure: null,
    },
  };

  const needsSetup = leads.length === 0;
  const setupMessage = needsSetup
    ? "Run Rebuild CMM Lead Ledger to scan the full Gmail label history."
    : null;

  return {
    leadsToday,
    leadsThisWeek,
    leadsThisMonth,
    leadsLast30Days,
    leadsAllTime,
    spendToday: leadsToday * cost,
    spendThisWeek: leadsThisWeek * cost,
    spendThisMonth: leadsThisMonth * cost,
    spendLast30Days: leadsLast30Days * cost,
    spendAllTime: leadsAllTime * cost,
    unknownPostcodes,
    byArea,
    dailyChart: buildTimeSeries(leads, cost, "daily", now),
    weeklyChart: buildTimeSeries(leads, cost, "weekly", now),
    monthlyChart: buildTimeSeries(leads, cost, "monthly", now),
    topAreas,
    unknownPostcodeLeads,
    syncMeta: syncMeta ?? defaultMeta,
    matchStats: matchLedger?.stats ?? EMPTY_MATCH_STATS,
    reviewQueue: matchLedger?.reviewQueue ?? [],
    unmatchedDepositJobs: matchLedger?.unmatchedDepositJobs ?? [],
    imveImportSummary:
      useImveRoi
        ? {
            jobCount: imveJobs.length,
            depositPaidCount: imveJobs.filter((j) => j.deposit_paid).length,
            matchStats: imveMatchLedger?.stats ?? {
              autoMatched: 0,
              needsReview: 0,
              unmatched: 0,
              totalLeads: 0,
              totalImveJobs: imveJobs.length,
              lastMatchedAt: null,
            },
            usingImveForRoi: true,
          }
        : null,
    needsSetup,
    setupMessage,
    completeness: buildCmmCompletenessStats(leads),
  };
}

export async function loadCmmLeadIntelligence(
  settings: JarvisSettings,
  options?: { rematch?: boolean; imveMatchLedger?: ImveCmmMatchLedger | null }
): Promise<CmmLeadIntelligence> {
  const ledger = await getCmmLeadLedger();
  const syncMeta = await getCmmSyncMeta();
  const leads = ledger?.leads ?? [];
  const jobs = await getJobsForCmmMatching();
  const imveLedger = await getImveImportLedgerOrEmpty();
  const imveJobs = imveLedger.jobs;
  const imveRoiActive = isImveRoiActive(imveLedger);

  let matchLedger = await getCmmMatchLedger();
  let imveMatchLedger =
    options?.imveMatchLedger !== undefined
      ? options.imveMatchLedger
      : await getImveCmmMatchLedger();
  const shouldRematch =
    options?.rematch ||
    !matchLedger ||
    matchLedger.stats.totalLeads !== leads.length ||
    matchLedger.stats.totalJobs !== jobs.length;

  if (shouldRematch && leads.length > 0) {
    matchLedger = await rematchCmmLeads(leads, jobs);
  }

  if (
    options?.imveMatchLedger === undefined &&
    (options?.rematch || !imveMatchLedger) &&
    leads.length > 0 &&
    imveRoiActive &&
    imveJobs.length > 0
  ) {
    const { runImveCmmMatching } = await import("./imve-cmm-match");
    const { saveImveCmmMatchLedger } = await import("./imve-cmm-match-store");
    imveMatchLedger = runImveCmmMatching(leads, imveJobs, imveMatchLedger);
    await saveImveCmmMatchLedger(imveMatchLedger);
  }

  return buildCmmLeadIntelligenceFromLeads(
    leads,
    jobs,
    settings,
    syncMeta,
    matchLedger,
    imveMatchLedger,
    imveJobs,
    imveRoiActive
  );
}

export function cmmSpendFromIntelligence(
  intel: CmmLeadIntelligence
): JarvisBriefingCmmSpend {
  const byArea = Object.fromEntries(
    ALL_AREAS.map((a) => [a, intel.byArea[a].allTime.spend])
  ) as Record<PostcodeArea, number>;

  return {
    today: intel.spendToday,
    thisWeek: intel.spendThisWeek,
    thisMonth: intel.spendThisMonth,
    last30Days: intel.spendLast30Days,
    allTime: intel.spendAllTime,
    byArea,
    label: "CMM company marketing spend",
  };
}

type JarvisBriefingCmmSpend = {
  today: number;
  thisWeek: number;
  thisMonth: number;
  last30Days: number;
  allTime: number;
  byArea: Record<PostcodeArea, number>;
  label: string;
};

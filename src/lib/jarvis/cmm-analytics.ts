import type {
  CmmAreaAnalytics,
  CmmLeadIntelligence,
  CmmLeadRecord,
  JobRecord,
  PostcodeArea,
} from "./types";
import type { JarvisSettings } from "./settings-store";
import { getCmmLeadLedger, getCmmSyncMeta } from "./cmm-lead-store";
import { parseEmailDate } from "./extractors";

const ALL_AREAS: PostcodeArea[] = ["GU", "RH", "TN", "SM", "CR", "Other", "Unknown"];

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

function normalizePostcode(pc: string | null): string {
  return (pc ?? "").replace(/\s+/g, "").toUpperCase();
}

function matchLeadToJob(lead: CmmLeadRecord, jobs: JobRecord[]): JobRecord | null {
  if (lead.customer_email) {
    const email = lead.customer_email.toLowerCase();
    const byEmail = jobs.find(
      (j) => j.customer_email?.toLowerCase() === email
    );
    if (byEmail) return byEmail;
  }

  if (lead.customer_name && lead.collection_postcode) {
    const name = lead.customer_name.toLowerCase();
    const pc = normalizePostcode(lead.collection_postcode);
    const byNamePc = jobs.find(
      (j) =>
        j.customer_name?.toLowerCase() === name &&
        normalizePostcode(j.moving_from_postcode) === pc
    );
    if (byNamePc) return byNamePc;
  }

  if (lead.customer_name && lead.move_date) {
    const name = lead.customer_name.toLowerCase();
    const moveKey = lead.move_date.slice(0, 10);
    const byNameDate = jobs.find(
      (j) =>
        j.customer_name?.toLowerCase() === name &&
        j.move_date &&
        j.move_date.includes(moveKey)
    );
    if (byNameDate) return byNameDate;
  }

  if (lead.customer_name && lead.collection_postcode_area !== "Unknown") {
    const name = lead.customer_name.toLowerCase();
    const area = lead.collection_postcode_area;
    const byNameArea = jobs.filter(
      (j) =>
        j.customer_name?.toLowerCase() === name &&
        j.moving_from_postcode_area === area
    );
    if (byNameArea.length === 1) return byNameArea[0];
  }

  return null;
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

function buildAreaAnalytics(
  areaLeads: CmmLeadRecord[],
  matchedJobs: JobRecord[],
  cost: number,
  now: Date
): CmmAreaAnalytics {
  const countIn = (fn: (l: CmmLeadRecord) => boolean) =>
    areaLeads.filter(fn).length;

  const today = countIn((l) => inToday(l, now));
  const thisWeek = countIn((l) => inThisWeek(l, now));
  const thisMonth = countIn((l) => inThisMonth(l, now));
  const allTime = areaLeads.length;

  const depositsPaid = matchedJobs.filter((j) => j.deposit_receipt_received_at).length;
  const turnover = matchedJobs
    .filter((j) => j.deposit_receipt_received_at)
    .reduce((s, j) => s + (j.final_move_value ?? j.quote_value ?? 0), 0);
  const commission = matchedJobs
    .filter((j) => j.commission_payable)
    .reduce((s, j) => s + (j.commission_value ?? 0), 0);

  const reliableMatches = matchedJobs.length;
  const conversionRate =
    reliableMatches > 0 && allTime > 0 && reliableMatches >= allTime * 0.3
      ? depositsPaid / allTime
      : null;

  const spendAll = allTime * cost;
  const roi =
    conversionRate != null && spendAll > 0
      ? (turnover - spendAll) / spendAll
      : null;

  const needsReview =
    areaLeads.some((l) => l.collection_postcode_area === "Unknown") ||
    (allTime > 0 && reliableMatches < allTime * 0.2);

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
    costPerPaidDeposit:
      depositsPaid > 0 ? spendAll / depositsPaid : null,
    needsReview,
  };
}

export function buildCmmLeadIntelligenceFromLeads(
  leads: CmmLeadRecord[],
  jobs: JobRecord[],
  settings: JarvisSettings,
  syncMeta: CmmLeadIntelligence["syncMeta"] | null
): CmmLeadIntelligence {
  const cost = settings.costPerLead;
  const now = new Date();

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
      const matchedJobs: JobRecord[] = [];
      for (const lead of areaLeads) {
        const job = matchLeadToJob(lead, jobs);
        if (job) matchedJobs.push(job);
      }
      return [area, buildAreaAnalytics(areaLeads, matchedJobs, cost, now)];
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
    needsSetup,
    setupMessage,
  };
}

export async function loadCmmLeadIntelligence(
  jobs: JobRecord[],
  settings: JarvisSettings
): Promise<CmmLeadIntelligence> {
  const ledger = await getCmmLeadLedger();
  const syncMeta = await getCmmSyncMeta();
  const leads = ledger?.leads ?? [];
  return buildCmmLeadIntelligenceFromLeads(
    leads,
    jobs,
    settings,
    syncMeta
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

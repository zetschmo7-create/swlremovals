import type { JarvisSettings } from "./settings-store";
import type { CmmLeadRecord, PostcodeArea } from "./types";
import type { ImveCmmLeadMatch, ImveJobRecord } from "./imve-types";
import type {
  CommercialAreaMetrics,
  CommercialCmmRoi,
  CommercialDataQualityWarning,
  CommercialIntelligence,
  CommercialIntelligenceSummary,
  CommercialSourceMetrics,
  JobCommercialValue,
} from "./commercial-intelligence-types";

const ALL_AREAS: PostcodeArea[] = ["GU", "RH", "TN", "SM", "CR", "Other", "Unknown"];

const WON_STATUS_RE =
  /accepted|booked|confirmed|completed|deposit|invoice|paid/i;
const DEPOSIT_STATUS_RE = /sent|paid|unpaid|issued/i;

export const DEPOSIT_TO_FULL_VALUE_MULTIPLIER = 5;

function safeRoi(numerator: number, spend: number): number | null {
  if (spend <= 0 || numerator <= 0) return null;
  return numerator / spend;
}

export function normalizeJobSource(source: string | null | undefined): string {
  const trimmed = source?.trim();
  if (!trimmed || /^unknown$/i.test(trimmed)) return "Unknown Source";
  return trimmed;
}

export function isCmmJobSource(source: string | null | undefined): boolean {
  if (!source) return false;
  return /cmm|compare\s*my\s*move|comparemymove/i.test(source);
}

export function isCommerciallyWonJob(job: ImveJobRecord): boolean {
  if (job.status && WON_STATUS_RE.test(job.status)) return true;
  if (job.deposit_invoice_number?.trim()) return true;
  if ((job.deposit_amount ?? 0) > 0) return true;
  if (job.deposit_status && DEPOSIT_STATUS_RE.test(job.deposit_status)) return true;
  if (job.invoice_number?.trim()) return true;
  if ((job.invoice_amount ?? 0) > 0) return true;
  if ((job.total_amount ?? 0) > 0) return true;
  if ((job.turnover ?? 0) > 0) return true;
  if (job.booked || job.deposit_paid) return true;
  return false;
}

function resolveTotalAmount(job: ImveJobRecord): number | null {
  const total = job.total_amount ?? job.quote_value;
  return total != null && total > 0 ? total : null;
}

function resolveInvoiceAmount(job: ImveJobRecord): number | null {
  const invoice = job.invoice_amount ?? job.turnover;
  if (invoice == null || invoice <= 0) return null;
  const total = resolveTotalAmount(job);
  if (total != null && Math.abs(invoice - total) < 0.01) return null;
  return invoice;
}

export function computeJobCommercialValue(job: ImveJobRecord): JobCommercialValue {
  const total = resolveTotalAmount(job);
  if (total != null) {
    return { value: total, confidence: "actual", source: "total_amount" };
  }

  const invoice = resolveInvoiceAmount(job);
  if (invoice != null) {
    return { value: invoice, confidence: "actual", source: "invoice_amount" };
  }

  const deposit = job.deposit_amount ?? 0;
  if (deposit > 0) {
    return {
      value: deposit * DEPOSIT_TO_FULL_VALUE_MULTIPLIER,
      confidence: "estimated",
      source: "deposit_estimate",
    };
  }

  return { value: 0, confidence: "none", source: "none" };
}

export function isDepositInvoiceSent(job: ImveJobRecord): boolean {
  if (job.deposit_invoice_number?.trim()) return true;
  if (job.deposit_status && DEPOSIT_STATUS_RE.test(job.deposit_status)) return true;
  return false;
}

export function isDepositPaid(job: ImveJobRecord): boolean {
  if (job.deposit_paid) return true;
  if (job.deposit_status && /paid/i.test(job.deposit_status)) return true;
  if (
    job.deposit_status &&
    DEPOSIT_STATUS_RE.test(job.deposit_status) &&
    (job.deposit_amount ?? 0) > 0
  ) {
    return true;
  }
  return false;
}

export function depositCashForJob(job: ImveJobRecord): number {
  if (!isDepositPaid(job)) return 0;
  return job.deposit_amount ?? 0;
}

function jobLabel(job: ImveJobRecord): string {
  return (
    job.customer_name ??
    job.job_reference ??
    job.customer_email ??
    job.imve_id
  );
}

function isCmmAttributedJob(
  job: ImveJobRecord,
  matchedCmmJobIds: Set<string>
): boolean {
  if (isCmmJobSource(job.lead_source)) return true;
  return matchedCmmJobIds.has(job.imve_id);
}

function buildMatchedCmmJobIds(
  imveMatches?: Record<string, ImveCmmLeadMatch>
): Set<string> {
  const ids = new Set<string>();
  if (!imveMatches) return ids;
  for (const match of Object.values(imveMatches)) {
    if (match.imve_job_id) ids.add(match.imve_job_id);
  }
  return ids;
}

type JobMetrics = {
  won: boolean;
  depositSent: boolean;
  depositPaid: boolean;
  depositCash: number;
  commercial: JobCommercialValue;
  forecastCommission: number;
};

function metricsForJob(
  job: ImveJobRecord,
  commissionRate: number
): JobMetrics {
  const won = isCommerciallyWonJob(job);
  const commercial = computeJobCommercialValue(job);
  const value = won ? commercial.value : 0;
  return {
    won,
    depositSent: isDepositInvoiceSent(job),
    depositPaid: isDepositPaid(job),
    depositCash: depositCashForJob(job),
    commercial,
    forecastCommission: value > 0 ? value * commissionRate : 0,
  };
}

function pickBestWorstArea(
  areas: CommercialAreaMetrics[]
): Pick<
  CommercialIntelligenceSummary,
  "bestAreaRoi" | "worstAreaRoi"
> {
  const withRoi = areas.filter(
    (a) => a.roiByCommission != null && a.cmmSpend > 0 && a.wonJobs > 0
  );
  if (withRoi.length === 0) {
    return { bestAreaRoi: null, worstAreaRoi: null };
  }
  const sorted = [...withRoi].sort(
    (a, b) => (b.roiByCommission ?? 0) - (a.roiByCommission ?? 0)
  );
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  return {
    bestAreaRoi: best
      ? { area: best.area, roiByCommission: best.roiByCommission ?? 0 }
      : null,
    worstAreaRoi: worst
      ? { area: worst.area, roiByCommission: worst.roiByCommission ?? 0 }
      : null,
  };
}

function pickBestWorstSource(
  sources: CommercialSourceMetrics[]
): Pick<CommercialIntelligenceSummary, "bestSource" | "worstSource"> {
  const withRoi = sources.filter(
    (s) => s.roiByCommission != null && (s.cmmSpend ?? 0) > 0 && s.wonJobs > 0
  );
  if (withRoi.length === 0) {
    return { bestSource: null, worstSource: null };
  }
  const sorted = [...withRoi].sort(
    (a, b) => (b.roiByCommission ?? 0) - (a.roiByCommission ?? 0)
  );
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  return {
    bestSource: best
      ? { source: best.source, roiByCommission: best.roiByCommission ?? 0 }
      : null,
    worstSource: worst
      ? { source: worst.source, roiByCommission: worst.roiByCommission ?? 0 }
      : null,
  };
}

function buildWarnings(
  jobs: ImveJobRecord[],
  cmmLeads: CmmLeadRecord[],
  matchedCmmJobIds: Set<string>,
  unlinkedDepositCount?: number
): CommercialDataQualityWarning[] {
  const warnings: CommercialDataQualityWarning[] = [];

  const missingSource = jobs.filter(
    (j) => normalizeJobSource(j.lead_source) === "Unknown Source"
  );
  if (missingSource.length > 0) {
    warnings.push({
      code: "missing_source",
      message: "Jobs missing Job Source in i-MVE export",
      count: missingSource.length,
      samples: missingSource.slice(0, 5).map((j) => ({
        label: jobLabel(j),
        detail: j.job_reference ?? undefined,
      })),
    });
  }

  const missingPostcode = jobs.filter(
    (j) => !j.from_postcode?.trim() || j.from_area === "Unknown"
  );
  if (missingPostcode.length > 0) {
    warnings.push({
      code: "missing_collection_postcode",
      message: "Jobs missing collection postcode (area grouping may be Unknown)",
      count: missingPostcode.length,
      samples: missingPostcode.slice(0, 5).map((j) => ({
        label: jobLabel(j),
        detail: j.from_postcode ?? "no postcode",
      })),
    });
  }

  const estimatedValue = jobs.filter((j) => {
    const m = computeJobCommercialValue(j);
    return isCommerciallyWonJob(j) && m.confidence === "estimated";
  });
  if (estimatedValue.length > 0) {
    warnings.push({
      code: "estimated_from_deposit",
      message: `Won job value estimated from deposit × ${DEPOSIT_TO_FULL_VALUE_MULTIPLIER} (20% deposit rule)`,
      count: estimatedValue.length,
      samples: estimatedValue.slice(0, 5).map((j) => ({
        label: jobLabel(j),
        detail: `Deposit ${j.deposit_amount ?? 0}`,
      })),
    });
  }

  const invalidInvoice = jobs.filter((j) => {
    const status = j.invoice_status?.toLowerCase() ?? "";
    const hasInvoiceRef = Boolean(j.invoice_number?.trim());
    const hasAmount = (j.invoice_amount ?? j.total_amount ?? 0) > 0;
    return (
      hasInvoiceRef &&
      !hasAmount &&
      /invalid|cancel|void|error/i.test(status)
    );
  });
  if (invalidInvoice.length > 0) {
    warnings.push({
      code: "invalid_invoice_total",
      message: "Jobs with invoice reference but missing or invalid invoice total",
      count: invalidInvoice.length,
      samples: invalidInvoice.slice(0, 5).map((j) => ({
        label: jobLabel(j),
        detail: j.invoice_status ?? "no status",
      })),
    });
  }

  const cmmSourceUnlinked = jobs.filter(
    (j) =>
      isCmmJobSource(j.lead_source) &&
      isDepositPaid(j) &&
      !matchedCmmJobIds.has(j.imve_id)
  );
  if (cmmSourceUnlinked.length > 0) {
    warnings.push({
      code: "cmm_deposits_not_linked",
      message: "CMM-source deposit jobs not linked to Gmail CMM leads (matching optional)",
      count: cmmSourceUnlinked.length,
      samples: cmmSourceUnlinked.slice(0, 5).map((j) => ({
        label: jobLabel(j),
        detail: normalizeJobSource(j.lead_source),
      })),
    });
  }

  const unknownSourceDeposits = jobs.filter(
    (j) =>
      normalizeJobSource(j.lead_source) === "Unknown Source" && isDepositPaid(j)
  );
  if (unknownSourceDeposits.length > 0) {
    warnings.push({
      code: "unknown_source_deposits",
      message: "Deposit-paid jobs with unknown Job Source",
      count: unknownSourceDeposits.length,
      samples: unknownSourceDeposits.slice(0, 5).map((j) => ({
        label: jobLabel(j),
      })),
    });
  }

  const nonCmmDeposits = jobs.filter(
    (j) =>
      isDepositPaid(j) &&
      !isCmmJobSource(j.lead_source) &&
      normalizeJobSource(j.lead_source) !== "Unknown Source"
  );
  if (nonCmmDeposits.length > 0) {
    warnings.push({
      code: "non_cmm_deposits_excluded",
      message: "Non-CMM deposit jobs excluded from CMM-specific ROI (still counted in area/source metrics)",
      count: nonCmmDeposits.length,
      samples: nonCmmDeposits.slice(0, 5).map((j) => ({
        label: jobLabel(j),
        detail: normalizeJobSource(j.lead_source),
      })),
    });
  }

  if ((unlinkedDepositCount ?? 0) > 0) {
    warnings.push({
      code: "split_deposit_unlinked",
      message: "Deposit invoice rows could not be linked to job records on import",
      count: unlinkedDepositCount ?? 0,
      samples: [],
    });
  }

  if (cmmLeads.length === 0 && jobs.length > 0) {
    warnings.push({
      code: "no_cmm_leads",
      message: "No CMM Gmail leads — area ROI uses i-MVE enquiries only; CMM spend unavailable",
      count: 0,
      samples: [],
    });
  }

  return warnings;
}

export function buildCommercialIntelligence(
  imveJobs: ImveJobRecord[],
  cmmLeads: CmmLeadRecord[],
  settings: JarvisSettings,
  imveMatches?: Record<string, ImveCmmLeadMatch>,
  options?: { unlinkedDepositCount?: number }
): CommercialIntelligence {
  const commissionRate = settings.commissionPercent / 100;
  const costPerLead = settings.costPerLead;
  const matchedCmmJobIds = buildMatchedCmmJobIds(imveMatches);

  const areaJobs = new Map<PostcodeArea, ImveJobRecord[]>();
  for (const area of ALL_AREAS) areaJobs.set(area, []);
  for (const job of imveJobs) {
    const area = job.from_area ?? "Unknown";
    areaJobs.get(area)?.push(job);
    if (!areaJobs.has(area)) areaJobs.set(area, [job]);
  }

  const cmmLeadsByArea = new Map<PostcodeArea, number>();
  for (const area of ALL_AREAS) cmmLeadsByArea.set(area, 0);
  for (const lead of cmmLeads) {
    const area = lead.collection_postcode_area;
    cmmLeadsByArea.set(area, (cmmLeadsByArea.get(area) ?? 0) + 1);
  }

  const byArea: CommercialAreaMetrics[] = ALL_AREAS.map((area) => {
    const jobsInArea = areaJobs.get(area) ?? [];
    const cmmLeadCount = cmmLeadsByArea.get(area) ?? 0;
    const cmmSpend = cmmLeadCount * costPerLead;

    let wonJobs = 0;
    let depositInvoicesSent = 0;
    let depositPaid = 0;
    let depositCash = 0;
    let wonTurnover = 0;
    let forecastCommission = 0;

    for (const job of jobsInArea) {
      const m = metricsForJob(job, commissionRate);
      if (m.won) wonJobs += 1;
      if (m.depositSent) depositInvoicesSent += 1;
      if (m.depositPaid) depositPaid += 1;
      depositCash += m.depositCash;
      wonTurnover += m.commercial.value > 0 && m.won ? m.commercial.value : 0;
      forecastCommission += m.forecastCommission;
    }

    const denominator = Math.max(jobsInArea.length, cmmLeadCount);
    const conversionRate =
      denominator > 0 && wonJobs > 0 ? wonJobs / denominator : null;

    return {
      area,
      enquiries: jobsInArea.length,
      cmmLeads: cmmLeadCount,
      wonJobs,
      depositInvoicesSent,
      depositPaid,
      depositCash,
      wonTurnover,
      forecastCommission,
      conversionRate,
      cmmSpend,
      roiByCommission: safeRoi(forecastCommission, cmmSpend),
      roiByTurnover: safeRoi(wonTurnover, cmmSpend),
    };
  });

  const sourceMap = new Map<string, ImveJobRecord[]>();
  for (const job of imveJobs) {
    const source = normalizeJobSource(job.lead_source);
    const list = sourceMap.get(source) ?? [];
    list.push(job);
    sourceMap.set(source, list);
  }

  const cmmSpendAllTime = cmmLeads.length * costPerLead;

  const bySource: CommercialSourceMetrics[] = [...sourceMap.entries()]
    .map(([source, jobsInSource]) => {
      let wonJobs = 0;
      let depositInvoicesSent = 0;
      let depositPaid = 0;
      let depositCash = 0;
      let wonTurnover = 0;
      let forecastCommission = 0;

      for (const job of jobsInSource) {
        const m = metricsForJob(job, commissionRate);
        if (m.won) wonJobs += 1;
        if (m.depositSent) depositInvoicesSent += 1;
        if (m.depositPaid) depositPaid += 1;
        depositCash += m.depositCash;
        wonTurnover += m.commercial.value > 0 && m.won ? m.commercial.value : 0;
        forecastCommission += m.forecastCommission;
      }

      const isCmm = isCmmJobSource(source);
      const cmmSpend = isCmm ? cmmSpendAllTime : null;
      const conversionRate =
        jobsInSource.length > 0 && wonJobs > 0
          ? wonJobs / jobsInSource.length
          : null;

      return {
        source,
        jobs: jobsInSource.length,
        wonJobs,
        depositInvoicesSent,
        depositPaid,
        depositCash,
        wonTurnover,
        forecastCommission,
        conversionRate,
        cmmSpend,
        roiByCommission:
          cmmSpend != null ? safeRoi(forecastCommission, cmmSpend) : null,
        roiByTurnover:
          cmmSpend != null ? safeRoi(wonTurnover, cmmSpend) : null,
      };
    })
    .sort((a, b) => b.wonTurnover - a.wonTurnover);

  let summaryWon = 0;
  let summaryDepositSent = 0;
  let summaryDepositPaid = 0;
  let summaryDepositCash = 0;
  let summaryTurnover = 0;
  let summaryCommission = 0;
  let actualValueJobs = 0;
  let estimatedValueJobs = 0;

  for (const job of imveJobs) {
    const m = metricsForJob(job, commissionRate);
    if (m.won) summaryWon += 1;
    if (m.depositSent) summaryDepositSent += 1;
    if (m.depositPaid) summaryDepositPaid += 1;
    summaryDepositCash += m.depositCash;
    if (m.won && m.commercial.value > 0) {
      summaryTurnover += m.commercial.value;
      summaryCommission += m.forecastCommission;
      if (m.commercial.confidence === "actual") actualValueJobs += 1;
      if (m.commercial.confidence === "estimated") estimatedValueJobs += 1;
    }
  }

  const { bestAreaRoi, worstAreaRoi } = pickBestWorstArea(byArea);
  const { bestSource, worstSource } = pickBestWorstSource(bySource);

  const summary: CommercialIntelligenceSummary = {
    totalJobs: imveJobs.length,
    wonJobs: summaryWon,
    depositInvoicesSent: summaryDepositSent,
    depositPaid: summaryDepositPaid,
    depositCash: summaryDepositCash,
    wonTurnover: summaryTurnover,
    forecastCommission: summaryCommission,
    actualValueJobs,
    estimatedValueJobs,
    bestAreaRoi,
    worstAreaRoi,
    bestSource,
    worstSource,
    hasImveData: imveJobs.length > 0,
    cmmSpendAllTime,
  };

  let cmmWonJobs = 0;
  let cmmWonTurnover = 0;
  let cmmForecastCommission = 0;

  for (const job of imveJobs) {
    if (!isCmmAttributedJob(job, matchedCmmJobIds)) continue;
    const m = metricsForJob(job, commissionRate);
    if (!m.won) continue;
    cmmWonJobs += 1;
    if (m.commercial.value > 0) {
      cmmWonTurnover += m.commercial.value;
      cmmForecastCommission += m.forecastCommission;
    }
  }

  const cmmRoi: CommercialCmmRoi = {
    cmmWonJobs,
    cmmWonTurnover,
    cmmForecastCommission,
    cmmSpend: cmmSpendAllTime,
    roiByCommission: safeRoi(cmmForecastCommission, cmmSpendAllTime),
    roiByTurnover: safeRoi(cmmWonTurnover, cmmSpendAllTime),
  };

  const warnings = buildWarnings(
    imveJobs,
    cmmLeads,
    matchedCmmJobIds,
    options?.unlinkedDepositCount
  );

  return {
    summary,
    byArea,
    bySource,
    warnings,
    cmmRoi,
  };
}

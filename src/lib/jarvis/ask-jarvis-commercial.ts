import type { JarvisBriefing } from "./types";
import type {
  CommercialAreaMetrics,
  CommercialIntelligence,
  CommercialSourceMetrics,
} from "./commercial-intelligence-types";

export type CommercialIntent =
  | "overview"
  | "areas"
  | "source"
  | "commission"
  | "actions";

const NO_DATA_MSG =
  "Commercial Intelligence data is not loaded yet. Re-import i-MVE exports first.";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPct(value: number | null): string {
  if (value == null) return "N/A";
  return `${Math.round(value * 100)}%`;
}

function normalizeQuestion(question: string): string {
  return question
    .toLowerCase()
    .trim()
    .replace(/^jarvis[,.\s]+/i, "")
    .trim();
}

export function isCapabilitiesQuestion(question: string): boolean {
  return /what can you do|what do you do|your capabilities|help me use jarvis/i.test(
    question.toLowerCase()
  );
}

export function detectCommercialIntent(question: string): CommercialIntent | null {
  const q = normalizeQuestion(question);
  if (!q || isCapabilitiesQuestion(question)) return null;

  if (
    /highest roi|what should i (do|focus)|what to focus|recommend|priorit(y|ies)|best action/i.test(
      q
    )
  ) {
    return "actions";
  }

  if (
    /commission forecast|forecast commission|how much commission|commission from/i.test(
      q
    ) &&
    !/friday|payday|due this/i.test(q)
  ) {
    return "commission";
  }

  if (
    /\b(source|sources|lead source|job source)\b/i.test(q) &&
    !/\b(area|areas|postcode)\b/i.test(q)
  ) {
    return "source";
  }

  if (/\b(area|areas|postcode|postcodes)\b/i.test(q)) {
    return "areas";
  }

  if (
    /breakdown|business summary|the situation|what'?s the situation|where is the money|money coming from|performing|how are we doing|commercial intelligence|give me an update|situation update|overview/i.test(
      q
    ) ||
    /give me a breakdown/i.test(q)
  ) {
    return "overview";
  }

  if (/tell me about the business|business update|summary/i.test(q)) {
    return "overview";
  }

  return null;
}

function bestAreaByCommission(
  areas: CommercialAreaMetrics[]
): CommercialAreaMetrics | null {
  const active = areas.filter((a) => a.forecastCommission > 0);
  if (active.length === 0) return null;
  return [...active].sort(
    (a, b) => b.forecastCommission - a.forecastCommission
  )[0];
}

function bestAreaByConversion(
  areas: CommercialAreaMetrics[]
): CommercialAreaMetrics | null {
  const active = areas.filter(
    (a) => a.conversionRate != null && (a.enquiries > 0 || a.cmmLeads > 0)
  );
  if (active.length === 0) return null;
  return [...active].sort(
    (a, b) => (b.conversionRate ?? 0) - (a.conversionRate ?? 0)
  )[0];
}

function weakestAreaLabel(intel: CommercialIntelligence): string | null {
  const { summary, byArea } = intel;
  if (summary.worstAreaRoi) {
    return summary.worstAreaRoi.area;
  }

  const spendNoWins = byArea
    .filter((a) => a.cmmSpend > 0 && a.wonJobs === 0)
    .sort((a, b) => b.cmmSpend - a.cmmSpend);
  if (spendNoWins.length > 0) return spendNoWins[0].area;

  const lowWins = byArea
    .filter((a) => a.wonJobs > 0)
    .sort((a, b) => a.forecastCommission - b.forecastCommission);
  return lowWins[0]?.area ?? null;
}

function buildRecommendedActions(
  intel: CommercialIntelligence,
  voice: boolean
): string[] {
  const actions: string[] = [];
  const { summary, byArea, warnings, cmmRoi } = intel;
  const bestCommission = bestAreaByCommission(byArea);
  const bestConversion = bestAreaByConversion(byArea);
  const weak = weakestAreaLabel(intel);

  if (bestCommission && bestCommission.forecastCommission > 0) {
    actions.push(
      `Prioritise ${bestCommission.area} — highest forecast commission at ${formatCurrency(bestCommission.forecastCommission)}.`
    );
  }

  if (
    bestConversion &&
    bestConversion.area !== bestCommission?.area &&
    bestConversion.conversionRate != null
  ) {
    actions.push(
      `Scale efficient conversion in ${bestConversion.area} (${formatPct(bestConversion.conversionRate)} won-job rate).`
    );
  }

  if (weak) {
    const weakStats = byArea.find((a) => a.area === weak);
    if (weakStats && weakStats.cmmSpend > 0 && weakStats.wonJobs === 0) {
      actions.push(
        `Review CMM spend in ${weak} — ${formatCurrency(weakStats.cmmSpend)} spent with no won jobs yet.`
      );
    } else if (summary.worstAreaRoi) {
      actions.push(
        `Tighten lead quality or follow-up in ${weak} — lowest commission ROI among active areas.`
      );
    }
  }

  const estimated = warnings.find((w) => w.code === "estimated_from_deposit");
  if (estimated && estimated.count > 0) {
    actions.push(
      `Confirm full invoice totals for ${estimated.count} deposit-estimated job${estimated.count === 1 ? "" : "s"} in i-MVE.`
    );
  }

  if (cmmRoi.cmmSpend > 0 && cmmRoi.roiByCommission != null) {
    actions.push(
      `CMM-specific ROI is ${formatPct(cmmRoi.roiByCommission)} on ${formatCurrency(cmmRoi.cmmForecastCommission)} forecast commission.`
    );
  }

  return actions.slice(0, voice ? 2 : 3);
}

function buildOverview(intel: CommercialIntelligence, voice: boolean): string {
  const { summary, byArea, bySource } = intel;
  const bestCommission = bestAreaByCommission(byArea);
  const bestConversion = bestAreaByConversion(byArea);
  const weak = weakestAreaLabel(intel);
  const actions = buildRecommendedActions(intel, voice);

  const parts: string[] = [
    `Commercial snapshot: ${summary.wonJobs} won or deposit-active jobs from ${summary.totalJobs} i-MVE enquiries.`,
    `Won turnover ${formatCurrency(summary.wonTurnover)}, forecast commission ${formatCurrency(summary.forecastCommission)}, deposit cash received ${formatCurrency(summary.depositCash)}.`,
  ];

  if (bestCommission) {
    parts.push(
      `Strongest area by commission: ${bestCommission.area} at ${formatCurrency(bestCommission.forecastCommission)}.`
    );
  }

  if (
    bestConversion &&
    bestConversion.conversionRate != null &&
    bestConversion.area !== bestCommission?.area
  ) {
    parts.push(
      `Best conversion efficiency: ${bestConversion.area} at ${formatPct(bestConversion.conversionRate)}.`
    );
  }

  if (weak) {
    parts.push(`Weakest area to watch: ${weak}.`);
  }

  const topSource = bySource.find((s) => s.wonJobs > 0);
  if (topSource) {
    parts.push(
      `Top source: ${topSource.source} with ${topSource.wonJobs} won jobs and ${formatCurrency(topSource.forecastCommission)} forecast commission.`
    );
  }

  if (actions.length > 0) {
    parts.push(
      voice
        ? `Focus next: ${actions.join(" ")}`
        : `Recommended actions:\n${actions.map((a) => `• ${a}`).join("\n")}`
    );
  }

  return parts.join(voice ? " " : "\n\n");
}

function buildAreasAnswer(intel: CommercialIntelligence, voice: boolean): string {
  const active = intel.byArea.filter(
    (a) => a.wonJobs > 0 || a.enquiries > 0 || a.cmmLeads > 0
  );
  if (active.length === 0) {
    return "No area performance data yet from i-MVE exports.";
  }

  const ranked = [...active].sort(
    (a, b) => b.forecastCommission - a.forecastCommission
  );
  const lines = ranked.slice(0, voice ? 4 : 6).map((a) => {
    const roi =
      a.roiByCommission != null
        ? `, ROI ${formatPct(a.roiByCommission)}`
        : "";
    return `${a.area}: ${a.wonJobs} won jobs, ${formatCurrency(a.wonTurnover)} turnover, ${formatCurrency(a.forecastCommission)} commission${roi}`;
  });

  return voice
    ? `Area performance. ${lines.join(". ")}.`
    : `Area performance from i-MVE:\n${lines.map((l) => `• ${l}`).join("\n")}`;
}

function buildSourceAnswer(intel: CommercialIntelligence, voice: boolean): string {
  const active = intel.bySource.filter((s) => s.wonJobs > 0 || s.jobs > 0);
  if (active.length === 0) {
    return "No source performance data yet from i-MVE exports.";
  }

  const ranked = [...active].sort(
    (a, b) => b.forecastCommission - a.forecastCommission
  );
  const lines = ranked.slice(0, voice ? 4 : 6).map((s) => {
    const spend =
      s.cmmSpend != null ? `, CMM spend ${formatCurrency(s.cmmSpend)}` : "";
    const roi =
      s.roiByCommission != null
        ? `, ROI ${formatPct(s.roiByCommission)}`
        : "";
    return `${s.source}: ${s.wonJobs} won / ${s.jobs} jobs, ${formatCurrency(s.forecastCommission)} commission${spend}${roi}`;
  });

  return voice
    ? `Source performance. ${lines.join(". ")}.`
    : `Source performance from i-MVE:\n${lines.map((l) => `• ${l}`).join("\n")}`;
}

function buildCommissionAnswer(
  intel: CommercialIntelligence,
  voice: boolean
): string {
  const { summary, cmmRoi } = intel;
  const parts = [
    `Forecast commission across all won i-MVE jobs: ${formatCurrency(summary.forecastCommission)} from ${formatCurrency(summary.wonTurnover)} won turnover.`,
    `${summary.actualValueJobs} jobs use actual invoice totals; ${summary.estimatedValueJobs} estimated from deposits.`,
  ];

  if (cmmRoi.cmmSpend > 0) {
    parts.push(
      `CMM-attributed forecast commission: ${formatCurrency(cmmRoi.cmmForecastCommission)} on ${formatCurrency(cmmRoi.cmmSpend)} CMM spend${
        cmmRoi.roiByCommission != null
          ? ` — ROI ${formatPct(cmmRoi.roiByCommission)}`
          : ""
      }.`
    );
  }

  return parts.join(voice ? " " : "\n\n");
}

function buildActionsAnswer(intel: CommercialIntelligence, voice: boolean): string {
  const actions = buildRecommendedActions(intel, voice);
  if (actions.length === 0) {
    return "No clear commercial actions yet — import i-MVE jobs with won or deposit status first.";
  }
  return voice
    ? `Recommended focus. ${actions.join(" ")}`
    : `Recommended actions:\n${actions.map((a) => `• ${a}`).join("\n")}`;
}

export function answerCommercialIntelligenceQuestion(
  briefing: JarvisBriefing,
  question: string,
  options?: { voice?: boolean }
): string | null {
  const intent = detectCommercialIntent(question);
  if (!intent) return null;

  const intel = briefing.commercialIntelligence;
  if (!intel?.summary?.hasImveData) {
    return NO_DATA_MSG;
  }

  const voice = options?.voice ?? false;

  switch (intent) {
    case "overview":
      return buildOverview(intel, voice);
    case "areas":
      return buildAreasAnswer(intel, voice);
    case "source":
      return buildSourceAnswer(intel, voice);
    case "commission":
      return buildCommissionAnswer(intel, voice);
    case "actions":
      return buildActionsAnswer(intel, voice);
    default:
      return null;
  }
}

export function genericJarvisFallback(question: string): string {
  if (isCapabilitiesQuestion(question)) {
    return "I can answer questions about commercial breakdowns, area and source performance, CMM spend, commission forecasts, deposit receipts, and pipeline.";
  }
  return "Try asking for a business breakdown, area performance, source performance, or commission forecast.";
}

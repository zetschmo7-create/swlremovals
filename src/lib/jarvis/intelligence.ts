import type {
  ClassifiedEmail,
  JarvisTask,
  PeriodMetrics,
  RevenuePeriods,
  TaskBucket,
} from "./types";
import type { JarvisSettings } from "./settings-store";
import {
  emailMatchesCustomer,
  extractCustomerName,
  extractPrimaryAmount,
  isCustomerReply,
  mentionsDepositPromised,
  mentionsQuoteNotAccepted,
  parseEmailDate,
} from "./extractors";
import { summariseByCategory } from "./parser";

export function filterEmailsByDays(
  emails: ClassifiedEmail[],
  days: number
): ClassifiedEmail[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return emails.filter((email) => {
    const when = parseEmailDate(email.date);
    return when ? when.getTime() >= cutoff : false;
  });
}

export function buildPeriodMetrics(
  emails: ClassifiedEmail[],
  commissionRate: number
): PeriodMetrics {
  const summary = summariseByCategory(emails);
  const turnoverClosed =
    summary.totalQuoteValue + summary.totalDepositValue;
  const commissionEarned = turnoverClosed * commissionRate;

  return {
    leads: summary.cmmLeads.length,
    surveys: summary.surveyBookings.length,
    quotesAccepted: summary.quoteAcceptances.length,
    depositsReceived: summary.depositPayments.length,
    turnoverClosed,
    commissionEarned,
    outstandingQuoteValue: estimateOutstandingQuotes(emails),
  };
}

function estimateOutstandingQuotes(emails: ClassifiedEmail[]): number {
  return emails
    .filter(
      (e) =>
        e.category === "operational" &&
        mentionsQuoteNotAccepted(e) &&
        extractPrimaryAmount(e) != null
    )
    .reduce((sum, e) => sum + (extractPrimaryAmount(e) ?? 0), 0);
}

export function buildRevenuePeriods(
  allEmails: ClassifiedEmail[],
  commissionRate: number
): RevenuePeriods {
  return {
    last24h: buildPeriodMetrics(filterEmailsByDays(allEmails, 1), commissionRate),
    last7d: buildPeriodMetrics(filterEmailsByDays(allEmails, 7), commissionRate),
    last30d: buildPeriodMetrics(filterEmailsByDays(allEmails, 30), commissionRate),
  };
}

export function buildRoiMetrics(
  periods: RevenuePeriods,
  settings: JarvisSettings
) {
  const period = periods.last30d;
  const leadSpend = period.leads * settings.costPerLead;
  const revenuePerLead = period.leads > 0 ? period.turnoverClosed / period.leads : null;
  const commissionPerLead =
    period.leads > 0 ? period.commissionEarned / period.leads : null;

  const roi =
    leadSpend > 0
      ? (period.turnoverClosed - leadSpend) / leadSpend
      : null;
  const commissionRoi =
    leadSpend > 0
      ? (period.commissionEarned - leadSpend) / leadSpend
      : null;

  return {
    leadSpend,
    revenuePerLead,
    commissionPerLead,
    roi,
    commissionRoi,
    needsSetup: settings.costPerLead <= 0 || period.leads === 0,
  };
}

export type HealthResult = {
  score: number | null;
  status: "green" | "amber" | "red" | "needs_setup";
  label: string;
  factors: string[];
};

export function calculateHealthScore(
  emails24h: ClassifiedEmail[],
  tasks: Record<TaskBucket, JarvisTask[]>,
  gmailConfigured: boolean
): HealthResult {
  if (!gmailConfigured) {
    return {
      score: null,
      status: "needs_setup",
      label: "Needs setup",
      factors: ["Connect Gmail to calculate health score."],
    };
  }

  const summary = summariseByCategory(emails24h);
  const leads = summary.cmmLeads.length;
  const surveys = summary.surveyBookings.length;
  const quotes = summary.quoteAcceptances.length;
  const deposits = summary.depositPayments.length;

  if (leads === 0 && surveys === 0 && quotes === 0) {
    return {
      score: null,
      status: "needs_setup",
      label: "Needs setup",
      factors: ["Insufficient activity in the last 24 hours."],
    };
  }

  let score = 100;
  const factors: string[] = [];

  const surveyConversion = leads > 0 ? surveys / leads : 0;
  score -= Math.max(0, (0.35 - surveyConversion) * 40);
  factors.push(
    `Survey conversion: ${leads > 0 ? Math.round(surveyConversion * 100) : 0}%`
  );

  const quoteConversion = surveys > 0 ? quotes / surveys : 0;
  score -= Math.max(0, (0.5 - quoteConversion) * 30);
  factors.push(
    `Quote conversion: ${surveys > 0 ? Math.round(quoteConversion * 100) : 0}%`
  );

  const depositRate = quotes > 0 ? deposits / quotes : 0;
  score -= Math.max(0, (0.8 - depositRate) * 20);
  factors.push(
    `Deposit verification: ${quotes > 0 ? Math.round(depositRate * 100) : 0}%`
  );

  const urgentActions =
    tasks.jake.filter((t) => t.priority === "high").length +
    tasks.jarvis.filter((t) => t.priority === "high").length;
  score -= Math.min(urgentActions * 5, 25);
  factors.push(`Outstanding high-priority actions: ${urgentActions}`);

  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const status =
    clamped >= 70 ? "green" : clamped >= 45 ? "amber" : "red";

  return {
    score: clamped,
    status,
    label: `${clamped} / 100`,
    factors,
  };
}

export type MissedOpportunity = {
  id: string;
  customer: string;
  reason: string;
  potentialTurnover: number | null;
  potentialCommission: number | null;
};

export function detectMissedRevenue(
  emails: ClassifiedEmail[],
  commissionRate: number
): {
  opportunities: MissedOpportunity[];
  totalMissedTurnover: number | null;
  totalMissedCommission: number | null;
  needsSetup: boolean;
} {
  const opportunities: MissedOpportunity[] = [];
  const leads = emails.filter((e) => e.category === "cmm_lead");

  if (leads.length === 0) {
    return {
      opportunities: [],
      totalMissedTurnover: null,
      totalMissedCommission: null,
      needsSetup: true,
    };
  }

  for (const lead of leads) {
    const customer = extractCustomerName(lead) ?? "Unknown lead";
    const amount = extractPrimaryAmount(lead);
    const related = emails.filter((e) => emailMatchesCustomer(e, customer));

    const hasSurvey = related.some((e) => e.category === "survey_booking");
    const hasQuote = related.some((e) => e.category === "quote_acceptance");
    const hasDeposit = related.some((e) => e.category === "deposit_payment");
    const customerReplied = related.some(isCustomerReply);

    if (hasSurvey && !hasQuote) {
      opportunities.push({
        id: `miss-quote-${lead.id}`,
        customer,
        reason: "Survey completed but quote not sent or accepted.",
        potentialTurnover: amount,
        potentialCommission: amount != null ? amount * commissionRate : null,
      });
    } else if (mentionsQuoteNotAccepted(lead) || related.some(mentionsQuoteNotAccepted)) {
      if (!hasQuote) {
        opportunities.push({
          id: `miss-followup-${lead.id}`,
          customer,
          reason: "Quote sent but no follow-up or acceptance detected.",
          potentialTurnover: amount,
          potentialCommission: amount != null ? amount * commissionRate : null,
        });
      }
    } else if (customerReplied && !related.some((e) => e.account === "appointments" && !isCustomerReply(e))) {
      opportunities.push({
        id: `miss-reply-${lead.id}`,
        customer,
        reason: "Customer replied but no outbound response detected.",
        potentialTurnover: amount,
        potentialCommission: amount != null ? amount * commissionRate : null,
      });
    } else if (mentionsDepositPromised(lead) && !hasDeposit) {
      opportunities.push({
        id: `miss-deposit-${lead.id}`,
        customer,
        reason: "Deposit promised but not received.",
        potentialTurnover: amount,
        potentialCommission: amount != null ? amount * commissionRate : null,
      });
    }
  }

  opportunities.sort(
    (a, b) => (b.potentialTurnover ?? 0) - (a.potentialTurnover ?? 0)
  );

  const withValues = opportunities.filter((o) => o.potentialTurnover != null);
  const totalMissedTurnover =
    withValues.length > 0
      ? withValues.reduce((s, o) => s + (o.potentialTurnover ?? 0), 0)
      : null;
  const totalMissedCommission =
    totalMissedTurnover != null ? totalMissedTurnover * commissionRate : null;

  return {
    opportunities: opportunities.slice(0, 10),
    totalMissedTurnover,
    totalMissedCommission,
    needsSetup: false,
  };
}

export type HotLead = {
  id: string;
  customer: string;
  potentialValue: number | null;
  reason: string;
  recommendedAction: string;
  conversionProbability: number | null;
};

export function detectHotLeads(
  emails: ClassifiedEmail[]
): { leads: HotLead[]; needsSetup: boolean } {
  const cmmLeads = filterEmailsByDays(
    emails.filter((e) => e.category === "cmm_lead"),
    3
  );

  if (cmmLeads.length === 0) {
    return { leads: [], needsSetup: true };
  }

  const hot: HotLead[] = [];

  for (const lead of cmmLeads) {
    const customer = extractCustomerName(lead) ?? "Unknown lead";
    const value = extractPrimaryAmount(lead);
    const related = emails.filter((e) => emailMatchesCustomer(e, customer));
    const reasons: string[] = [];
    let score = 0;

    if (filterEmailsByDays([lead], 1).length > 0) {
      reasons.push("Recent enquiry");
      score += 25;
    }
    if (value != null && value >= 2000) {
      reasons.push("High estimated move value");
      score += 25;
    }
    if (related.some(isCustomerReply)) {
      reasons.push("Customer actively replying");
      score += 20;
    }
    if (related.some((e) => e.category === "survey_booking")) {
      reasons.push("Survey completed");
      score += 15;
    }
    if (related.some(mentionsQuoteNotAccepted)) {
      reasons.push("Quote outstanding");
      score += 15;
    }
    if (!related.some((e) => e.category === "quote_acceptance")) {
      reasons.push("No follow-up completed");
      score += 10;
    }

    if (reasons.length >= 2) {
      hot.push({
        id: lead.id,
        customer,
        potentialValue: value,
        reason: reasons.join(" · "),
        recommendedAction:
          value != null && value >= 3000
            ? "Call within the hour — high-value opportunity."
            : "Send personalised follow-up and confirm survey slot.",
        conversionProbability: Math.min(95, score),
      });
    }
  }

  hot.sort((a, b) => (b.potentialValue ?? 0) - (a.potentialValue ?? 0));
  return { leads: hot.slice(0, 8), needsSetup: false };
}

export type TrackedLead = {
  id: string;
  customer: string;
  leadReceived: string;
  lastActivity: string;
  status: "red" | "amber" | "green";
  statusLabel: string;
};

export function trackUnansweredLeads(
  emails: ClassifiedEmail[]
): {
  leads: TrackedLead[];
  unanswered: number;
  awaiting: number;
  converted: number;
  needsSetup: boolean;
} {
  const cmmLeads = emails.filter((e) => e.category === "cmm_lead");

  if (cmmLeads.length === 0) {
    return {
      leads: [],
      unanswered: 0,
      awaiting: 0,
      converted: 0,
      needsSetup: true,
    };
  }

  const tracked: TrackedLead[] = [];

  for (const lead of cmmLeads) {
    const customer = extractCustomerName(lead) ?? "Unknown lead";
    const related = emails.filter((e) => emailMatchesCustomer(e, customer));
    const hasSurvey = related.some((e) => e.category === "survey_booking");
    const hasQuote = related.some((e) => e.category === "quote_acceptance");
    const hasDeposit = related.some((e) => e.category === "deposit_payment");
    const hasOutbound = related.some(
      (e) => e.account === "appointments" && !isCustomerReply(e)
    );

    let status: TrackedLead["status"] = "red";
    let statusLabel = "No response sent";

    if (hasSurvey || hasQuote || hasDeposit) {
      status = "green";
      statusLabel = hasDeposit
        ? "Deposit received"
        : hasQuote
          ? "Quote accepted"
          : "Survey booked";
    } else if (hasOutbound || related.some(isCustomerReply)) {
      status = "amber";
      statusLabel = "Waiting for customer";
    }

    const last = related.reduce((latest, e) => {
      const d = parseEmailDate(e.date);
      const l = parseEmailDate(latest.date);
      if (!d) return latest;
      if (!l) return e;
      return d > l ? e : latest;
    }, lead);

    tracked.push({
      id: lead.id,
      customer,
      leadReceived: lead.date || "Unknown",
      lastActivity: last.date || lead.date || "Unknown",
      status,
      statusLabel,
    });
  }

  return {
    leads: tracked.sort((a, b) => a.status.localeCompare(b.status)),
    unanswered: tracked.filter((l) => l.status === "red").length,
    awaiting: tracked.filter((l) => l.status === "amber").length,
    converted: tracked.filter((l) => l.status === "green").length,
    needsSetup: false,
  };
}

export function enrichTasks(
  tasks: Record<TaskBucket, JarvisTask[]>,
  emails: ClassifiedEmail[],
  commissionRate: number
): Record<TaskBucket, JarvisTask[]> {
  const enrich = (task: JarvisTask): JarvisTask => {
    const sourceEmail = emails.find((e) => task.id.startsWith(e.id));
    const customer = sourceEmail
      ? extractCustomerName(sourceEmail)
      : undefined;
    const revenueImpact = sourceEmail
      ? extractPrimaryAmount(sourceEmail)
      : null;
    const priorityScore =
      task.priority === "high" ? 90 : task.priority === "medium" ? 60 : 30;

    const suggestedAction =
      task.category === "cmm_lead"
        ? "Call the lead and confirm move details."
        : task.category === "survey_booking"
          ? "Draft survey confirmation email."
          : task.category === "quote_acceptance"
            ? "Confirm crew, date, and send booking paperwork."
            : task.category === "deposit_payment"
              ? "Verify payment and update job sheet."
              : "Review and triage.";

    return {
      ...task,
      customer: customer ?? undefined,
      revenueImpact,
      priorityScore,
      reason: task.detail,
      suggestedAction,
      potentialCommission:
        revenueImpact != null ? revenueImpact * commissionRate : null,
    };
  };

  return {
    jarvis: tasks.jarvis.map(enrich),
    jake: tasks.jake.map(enrich),
    wait: tasks.wait.map(enrich),
  };
}

export function buildChartSeries(
  emails: ClassifiedEmail[],
  commissionRate: number
) {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }

  const leads: number[] = [];
  const revenue: number[] = [];
  const commission: number[] = [];
  const pipeline: number[] = [];
  const healthTrend: number[] = [];

  for (const day of days) {
    const dayEmails = emails.filter((e) => {
      const when = parseEmailDate(e.date);
      return when ? dateKey(when) === day : false;
    });

    const metrics = buildPeriodMetrics(dayEmails, commissionRate);
    leads.push(metrics.leads);
    revenue.push(metrics.turnoverClosed);
    commission.push(metrics.commissionEarned);
    pipeline.push(metrics.outstandingQuoteValue);

    const dayHealth = calculateHealthScore(
      dayEmails,
      { jarvis: [], jake: [], wait: [] },
      dayEmails.length > 0
    );
    healthTrend.push(dayHealth.score ?? 0);
  }

  return {
    labels: days.map((d) =>
      new Date(d).toLocaleDateString("en-GB", { weekday: "short" })
    ),
    leads,
    revenue,
    commission,
    pipeline,
    healthTrend,
    needsSetup: emails.length === 0,
  };
}

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

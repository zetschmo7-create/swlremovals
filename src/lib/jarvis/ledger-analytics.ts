import type {
  JobLedger,
  JobRecord,
  JarvisBriefing,
  PeriodMetrics,
  PostcodeArea,
  RevenuePeriods,
} from "./types";
import type { JarvisSettings } from "./settings-store";
import { filterJobsByDays } from "./job-ledger";
import { getPaydayInfo } from "./payday";
import { parseEmailDate } from "./extractors";

const ALL_AREAS: PostcodeArea[] = ["GU", "RH", "TN", "SM", "CR", "Other", "Unknown"];

function jobInPeriod(job: JobRecord, days: number, field: keyof JobRecord): boolean {
  const raw = job[field];
  if (typeof raw !== "string" || !raw) return false;
  const when = parseEmailDate(raw);
  if (!when) return false;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return when.getTime() >= cutoff;
}

function countJobs(jobs: JobRecord[], days: number, field: keyof JobRecord): number {
  return jobs.filter((j) => jobInPeriod(j, days, field)).length;
}

function sumCommission(jobs: JobRecord[], days: number): number {
  return jobs
    .filter((j) => j.commission_payable && jobInPeriod(j, days, "deposit_receipt_received_at"))
    .reduce((s, j) => s + (j.commission_value ?? 0), 0);
}

function sumTurnover(jobs: JobRecord[], days: number): number {
  return jobs
    .filter((j) => j.deposit_receipt_received_at && jobInPeriod(j, days, "deposit_receipt_received_at"))
    .reduce((s, j) => s + (j.final_move_value ?? j.quote_value ?? 0), 0);
}

export function buildLedgerPeriodMetrics(
  jobs: JobRecord[],
  days: number,
  commissionRate: number
): PeriodMetrics {
  const leads = countJobs(jobs, days, "lead_received_at");
  const surveys = countJobs(jobs, days, "survey_booked_at");
  const quotesAccepted = countJobs(jobs, days, "quote_accepted_at");
  const depositsReceived = countJobs(jobs, days, "deposit_receipt_received_at");
  const turnoverClosed = sumTurnover(jobs, days);
  const commissionEarned = sumCommission(jobs, days);

  const outstandingQuoteValue = jobs
    .filter(
      (j) =>
        j.quote_accepted_at &&
        !j.deposit_receipt_received_at &&
        j.quote_value != null
    )
    .reduce((s, j) => s + (j.quote_value ?? 0), 0);

  return {
    leads,
    surveys,
    quotesAccepted,
    depositsReceived,
    turnoverClosed,
    commissionEarned,
    outstandingQuoteValue,
  };
}

export function buildLedgerRevenuePeriods(
  jobs: JobRecord[],
  commissionRate: number
): RevenuePeriods {
  return {
    last24h: buildLedgerPeriodMetrics(jobs, 1, commissionRate),
    last7d: buildLedgerPeriodMetrics(jobs, 7, commissionRate),
    last30d: buildLedgerPeriodMetrics(jobs, 30, commissionRate),
  };
}

export function buildLedgerRoi(
  periods: RevenuePeriods,
  settings: JarvisSettings
) {
  const period = periods.last30d;
  const leadSpend = period.leads * settings.costPerLead;
  const revenuePerLead = period.leads > 0 ? period.turnoverClosed / period.leads : null;
  const commissionPerLead =
    period.leads > 0 ? period.commissionEarned / period.leads : null;
  const roi =
    leadSpend > 0 ? (period.turnoverClosed - leadSpend) / leadSpend : null;
  const commissionRoi =
    leadSpend > 0 ? (period.commissionEarned - leadSpend) / leadSpend : null;

  return {
    leadSpend,
    revenuePerLead,
    commissionPerLead,
    roi,
    commissionRoi,
    needsSetup: settings.costPerLead <= 0 || period.leads === 0,
  };
}

export function buildLedgerFunnel(jobs: JobRecord[], days = 7) {
  const periodJobs = (field: keyof JobRecord) =>
    jobs.filter((j) => jobInPeriod(j, days, field));

  const leads = periodJobs("lead_received_at").length;
  const surveys = periodJobs("survey_booked_at").length;
  const quotesSent = periodJobs("quote_sent_at").length + periodJobs("quote_accepted_at").length;
  const quotesAccepted = periodJobs("quote_accepted_at").length;
  const depositsPaid = periodJobs("deposit_receipt_received_at").length;
  const movesCompleted = periodJobs("move_invoice_sent_at").length;

  let funnelWarning: string | null = null;
  if (depositsPaid > quotesAccepted) {
    const gap = depositsPaid - quotesAccepted;
    funnelWarning = `${gap} deposit(s) paid without quote acceptance email detected.`;
  }

  const stages = [
    { key: "leads", label: "Leads Received", count: leads, conversionFromPrevious: null as number | null },
    {
      key: "surveys",
      label: "Surveys Booked",
      count: surveys,
      conversionFromPrevious: leads > 0 ? Math.min(1, surveys / leads) : null,
    },
    {
      key: "quotes_sent",
      label: "Quotes Sent",
      count: quotesSent,
      conversionFromPrevious: surveys > 0 ? Math.min(1, quotesSent / surveys) : null,
    },
    {
      key: "quotes_accepted",
      label: "Quotes Accepted",
      count: quotesAccepted,
      conversionFromPrevious:
        quotesSent > 0 ? Math.min(1, quotesAccepted / quotesSent) : null,
    },
    {
      key: "deposits",
      label: "Deposits Paid",
      count: depositsPaid,
      conversionFromPrevious:
        quotesAccepted > 0 ? Math.min(1, depositsPaid / quotesAccepted) : null,
    },
    {
      key: "moves",
      label: "Moves Completed",
      count: movesCompleted,
      conversionFromPrevious:
        depositsPaid > 0 ? Math.min(1, movesCompleted / depositsPaid) : null,
    },
  ];

  return {
    stages,
    movesCompletedDetectable: movesCompleted > 0,
    needsSetup: leads === 0 && surveys === 0,
    funnelWarning,
  };
}

export function buildLedgerPayday(jobs: JobRecord[], commissionRate: number) {
  const payday = getPaydayInfo();
  const depositPaidJobs = jobs.filter((j) => j.deposit_receipt_received_at);

  const payPeriodBookings = depositPaidJobs
    .filter((j) => {
      const when = parseEmailDate(j.deposit_receipt_received_at ?? "");
      if (!when) return false;
      return when > payday.lastPayday && when <= new Date();
    })
    .map((j) => ({
      id: j.job_key,
      customer: j.customer_name ?? "Unknown customer",
      depositReceivedAt: j.deposit_receipt_received_at ?? "",
      moveValue: j.final_move_value ?? j.quote_value,
      valueNeedsConfirmation: j.final_move_value == null && j.quote_value == null,
      commission: j.commission_value,
    }));

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  weekStart.setHours(0, 0, 0, 0);

  const weekBookings = depositPaidJobs.filter((j) => {
    const when = parseEmailDate(j.deposit_receipt_received_at ?? "");
    return when ? when >= weekStart : false;
  });

  const dueConfirmed = payPeriodBookings.filter(
    (b) => !b.valueNeedsConfirmation && b.commission != null
  );
  const dueCommission = dueConfirmed.reduce((s, b) => s + (b.commission ?? 0), 0);
  const weekCommission = weekBookings.reduce((s, j) => s + (j.commission_value ?? 0), 0);
  const turnoverPayable = dueConfirmed.reduce((s, b) => s + (b.moveValue ?? 0), 0);
  const needsConfirmation = payPeriodBookings.filter((b) => b.valueNeedsConfirmation);

  const summaryLine =
    dueCommission > 0
      ? `£${Math.round(dueCommission).toLocaleString("en-GB")} due this Friday from ${dueConfirmed.length} deposit-paid booking${dueConfirmed.length === 1 ? "" : "s"}.`
      : needsConfirmation.length > 0
        ? "Deposit(s) detected — move values need confirmation before payday total is final."
        : "No commission due this Friday from detected deposit-paid bookings.";

  return {
    commissionEarnedThisWeek: weekCommission,
    commissionDueThisFriday: dueCommission,
    commissionPaidThisMonth: null as number | null,
    commissionPaidNeedsSetup: true,
    depositsReceivedThisWeek: weekBookings.length,
    jobsPayableThisWeek: weekBookings.length,
    turnoverMadePayableThisWeek: weekBookings.reduce(
      (s, j) => s + (j.final_move_value ?? j.quote_value ?? 0),
      0
    ),
    turnoverDueThisFriday: turnoverPayable,
    nextPayday: payday.nextPayday,
    nextPaydayLabel: payday.nextPaydayLabel,
    daysUntilPayday: payday.daysUntilPayday,
    payableBookings: payPeriodBookings,
    needsConfirmation,
    summaryLine,
    needsSetup: depositPaidJobs.length === 0,
  };
}

export function buildCmmSpend(jobs: JobRecord[], settings: JarvisSettings) {
  const cost = settings.costPerLead;
  const byArea = Object.fromEntries(
    ALL_AREAS.map((a) => [a, 0])
  ) as Record<PostcodeArea, number>;

  for (const job of jobs) {
    if (!job.lead_received_at) continue;
    const area = job.moving_from_postcode_area;
    byArea[area] = (byArea[area] ?? 0) + cost;
  }

  const todayLeads = countJobs(jobs, 1, "lead_received_at");
  const weekLeads = countJobs(jobs, 7, "lead_received_at");
  const monthLeads = countJobs(jobs, 30, "lead_received_at");

  return {
    today: todayLeads * cost,
    thisWeek: weekLeads * cost,
    thisMonth: monthLeads * cost,
    byArea,
    label: "Company lead spend (CMM)",
  };
}

export function buildPostcodeAnalytics(
  jobs: JobRecord[],
  settings: JarvisSettings,
  days = 30
) {
  const areas = Object.fromEntries(
    ALL_AREAS.map((area) => {
      const areaJobs = jobs.filter(
        (j) =>
          j.moving_from_postcode_area === area &&
          (jobInPeriod(j, days, "lead_received_at") ||
            jobInPeriod(j, days, "deposit_receipt_received_at"))
      );
      const leads = areaJobs.filter((j) => jobInPeriod(j, days, "lead_received_at")).length;
      const spend = leads * settings.costPerLead;
      const depositsPaid = areaJobs.filter((j) =>
        jobInPeriod(j, days, "deposit_receipt_received_at")
      ).length;
      const turnover = areaJobs
        .filter((j) => j.deposit_receipt_received_at)
        .reduce((s, j) => s + (j.final_move_value ?? j.quote_value ?? 0), 0);
      const commission = areaJobs
        .filter((j) => j.commission_payable)
        .reduce((s, j) => s + (j.commission_value ?? 0), 0);
      const conversionRate = leads > 0 ? depositsPaid / leads : null;
      const roi = spend > 0 ? (turnover - spend) / spend : null;

      return [
        area,
        { leads, spend, depositsPaid, turnover, commission, conversionRate, roi },
      ];
    })
  ) as JarvisBriefing["postcodeAnalytics"]["areas"];

  return {
    areas,
    needsSetup: jobs.filter((j) => j.lead_received_at).length === 0,
  };
}

export function buildDataQuality(
  ledger: JobLedger,
  gmailConnected: number,
  funnelWarning: string | null
) {
  const today = new Date().toISOString().slice(0, 10);
  const pdfsParsedToday = ledger.audit.logs.filter(
    (l) => l.includes("parsed successfully") && l.includes(today)
  ).length;

  return {
    gmailAccountsConnected: gmailConnected,
    pdfsParsedToday: pdfsParsedToday || ledger.audit.pdfsParsed,
    jobsRequiringReview: ledger.audit.jobsNeedingReview,
    duplicateEventsIgnored: ledger.audit.duplicateEventsIgnored,
    unknownValues: ledger.audit.unknownValues,
    funnelWarning,
  };
}

export function buildHotLeadsFromLedger(jobs: JobRecord[]) {
  const recent = filterJobsByDays(jobs, 3, "lead_received_at").filter(
    (j) => !j.deposit_receipt_received_at
  );

  return {
    leads: recent.slice(0, 8).map((j) => ({
      id: j.job_key,
      customer: j.customer_name ?? "Unknown",
      potentialValue: j.quote_value,
      reason: j.survey_booked_at
        ? "Survey booked — follow up for quote acceptance"
        : "New CMM lead — respond within 2 hours",
      recommendedAction: j.survey_booked_at
        ? "Send quote follow-up"
        : "Call within 2 hours",
      conversionProbability: j.survey_booked_at ? 0.6 : 0.4,
    })),
    needsSetup: recent.length === 0,
  };
}

export function buildMissedRevenueFromLedger(
  jobs: JobRecord[],
  commissionRate: number
) {
  const opportunities = jobs
    .filter(
      (j) =>
        j.lead_received_at &&
        !j.deposit_receipt_received_at &&
        (j.quote_accepted_at || j.survey_booked_at)
    )
    .map((j) => {
      let reason = "Quote accepted but deposit not paid";
      if (!j.quote_accepted_at && j.survey_booked_at) {
        reason = "Survey booked but quote not accepted";
      }
      const potentialTurnover = j.quote_value ?? j.final_move_value;
      return {
        id: j.job_key,
        customer: j.customer_name ?? "Unknown",
        reason,
        potentialTurnover,
        potentialCommission:
          potentialTurnover != null ? potentialTurnover * commissionRate : null,
      };
    });

  const totalMissedTurnover = opportunities.reduce(
    (s, o) => s + (o.potentialTurnover ?? 0),
    0
  );
  const totalMissedCommission = opportunities.reduce(
    (s, o) => s + (o.potentialCommission ?? 0),
    0
  );

  return {
    opportunities: opportunities.slice(0, 10),
    totalMissedTurnover: opportunities.length ? totalMissedTurnover : null,
    totalMissedCommission: opportunities.length ? totalMissedCommission : null,
    needsSetup: opportunities.length === 0,
  };
}

export function buildLeadTrackerFromLedger(jobs: JobRecord[]) {
  const leads = jobs
    .filter((j) => j.lead_received_at)
    .slice(0, 20)
    .map((j) => {
      let status: "red" | "amber" | "green" = "amber";
      let statusLabel = "Awaiting survey";
      if (j.deposit_receipt_received_at) {
        status = "green";
        statusLabel = "Deposit paid";
      } else if (j.quote_accepted_at) {
        status = "amber";
        statusLabel = "Quote accepted — awaiting deposit";
      } else if (j.survey_booked_at) {
        status = "amber";
        statusLabel = "Survey booked";
      } else {
        status = "red";
        statusLabel = "Unanswered lead";
      }
      return {
        id: j.job_key,
        customer: j.customer_name ?? "Unknown",
        leadReceived: j.lead_received_at ?? "",
        lastActivity:
          j.deposit_receipt_received_at ??
          j.quote_accepted_at ??
          j.survey_booked_at ??
          j.lead_received_at ??
          "",
        status,
        statusLabel,
      };
    });

  return {
    leads,
    unanswered: leads.filter((l) => l.status === "red").length,
    awaiting: leads.filter((l) => l.status === "amber").length,
    converted: leads.filter((l) => l.status === "green").length,
    needsSetup: leads.length === 0,
  };
}

export function buildLedgerCharts(jobs: JobRecord[], commissionRate: number) {
  const labels: string[] = [];
  const leads: number[] = [];
  const revenue: number[] = [];
  const commission: number[] = [];
  const pipeline: number[] = [];
  const healthTrend: number[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString("en-GB", { weekday: "short" }));
    const dayJobs = jobs.filter((j) => {
      const when = parseEmailDate(j.lead_received_at ?? "");
      return when?.toDateString() === d.toDateString();
    });
    leads.push(dayJobs.length);
    const dayDeposits = jobs.filter((j) => {
      const when = parseEmailDate(j.deposit_receipt_received_at ?? "");
      return when?.toDateString() === d.toDateString();
    });
    const dayRev = dayDeposits.reduce(
      (s, j) => s + (j.final_move_value ?? j.quote_value ?? 0),
      0
    );
    revenue.push(dayRev);
    commission.push(dayRev * commissionRate);
    pipeline.push(
      jobs.filter((j) => j.quote_accepted_at && !j.deposit_receipt_received_at).length
    );
    healthTrend.push(dayJobs.length > 0 ? 70 + dayDeposits.length * 5 : 50);
  }

  return {
    labels,
    leads,
    revenue,
    commission,
    pipeline,
    healthTrend,
    needsSetup: jobs.length === 0,
  };
}

export function buildCommissionForecastFromLedger(
  jobs: JobRecord[],
  commissionRate: number
) {
  const earned = jobs
    .filter((j) => j.commission_payable && j.commission_value != null)
    .reduce((s, j) => s + (j.commission_value ?? 0), 0);

  const likely = jobs
    .filter((j) => j.quote_accepted_at && !j.deposit_receipt_received_at && j.quote_value)
    .reduce((s, j) => s + (j.quote_value ?? 0) * commissionRate, 0);

  const possible = jobs
    .filter((j) => j.survey_booked_at && !j.quote_accepted_at)
    .length * 200 * commissionRate;

  return {
    earned,
    likely,
    possible,
    stretch: likely + possible,
    needsSetup: jobs.length === 0,
  };
}

export function buildMoveTrackerFromLedger(jobs: JobRecord[], commissionRate: number) {
  const today = new Date().toDateString();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const movesToday = jobs.filter(
    (j) => j.move_date && new Date(j.move_date).toDateString() === today
  ).length;
  const movesTomorrow = jobs.filter(
    (j) =>
      j.move_date &&
      new Date(j.move_date).toDateString() === tomorrow.toDateString()
  ).length;
  const weekJobs = filterJobsByDays(jobs, 7, "move_invoice_sent_at");
  const completed = weekJobs.length;

  return {
    movesToday,
    movesTomorrow,
    movesThisWeek: weekJobs.length,
    completedThisWeek: completed,
    turnoverDelivered: weekJobs.reduce(
      (s, j) => s + (j.final_move_value ?? 0),
      0
    ),
    commissionSecured: weekJobs.reduce((s, j) => s + (j.commission_value ?? 0), 0),
    needsSetup: jobs.length === 0,
  };
}

export function collectPdfAudit(emails: { parsedPdfs: { status: string; log: string }[] }[]) {
  let parsed = 0;
  let failed = 0;
  let missing = 0;
  const logs: string[] = [];

  for (const email of emails) {
    for (const pdf of email.parsedPdfs) {
      logs.push(pdf.log);
      if (pdf.status === "success") parsed += 1;
      else if (pdf.status === "failed" || pdf.status === "no_text") failed += 1;
      else if (pdf.status === "missing") missing += 1;
    }
  }

  return { parsed, failed, missing, logs };
}

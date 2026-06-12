import { fetchJarvisEmails, getGmailSetupStatus } from "./gmail";
import { isJarvisAuthConfigured } from "./auth";
import { buildTasks, classifyEmails, summariseByCategory } from "./parser";
import type { JarvisBriefing, JarvisEmail } from "./types";
import { JARVIS_CONFIG } from "./config";
import { getJarvisSettings } from "./settings-store";
import { calculateHealthScore, enrichTasks, filterEmailsByDays } from "./intelligence";
import { buildSurveyIntelligence } from "./survey-engine";
import { buildValueConfirmationTasks } from "./payday";
import { detectEmailEvents } from "./email-events";
import { buildJobLedger } from "./job-ledger";
import {
  buildCmmSpend,
  buildCommissionForecastFromLedger,
  buildDataQuality,
  buildHotLeadsFromLedger,
  buildLeadTrackerFromLedger,
  buildLedgerCharts,
  buildLedgerFunnel,
  buildLedgerPayday,
  buildLedgerRevenuePeriods,
  buildLedgerRoi,
  buildMissedRevenueFromLedger,
  buildMoveTrackerFromLedger,
  buildPostcodeAnalytics,
  collectPdfAudit,
} from "./ledger-analytics";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function buildExecutiveBriefing(
  briefing: Omit<JarvisBriefing, "morningScript" | "todaysFocus" | "generatedAt">
): { script: string; focus: string[] } {
  const {
    executive,
    settings,
    hotLeads,
    missedRevenue,
    surveyIntelligence,
    payday,
    commissionForecast,
    dataQuality,
  } = briefing;

  const today = executive.today;
  const leads = today.newLeads;
  const surveys = today.surveysBooked;
  const surveyRate =
    leads > 0 ? formatPercent(surveys / leads) : "Needs setup";

  const outstanding = missedRevenue.totalMissedTurnover;
  const outstandingCommission = missedRevenue.totalMissedCommission;
  const topHot = hotLeads.leads[0];
  const topMissed = missedRevenue.opportunities[0];

  const formatSlot = (zone: "GU" | "RH" | "TN") => {
    const slots = surveyIntelligence.slots[zone];
    if (slots.length === 0) return `${zone} currently has no clustered availability.`;
    return slots
      .map(
        (s) =>
          `${zone}: ${s.dateLabel} ${s.time} — ${s.confidence} confidence — ${s.reasoning}`
      )
      .join(" ");
  };

  const priorityLine = topHot
    ? `The highest priority today is following up ${topHot.customer}'s outstanding opportunity${topHot.potentialValue ? ` worth ${formatCurrency(topHot.potentialValue)}` : ""}.`
    : topMissed
      ? `The highest priority today is ${topMissed.reason.toLowerCase()} for ${topMissed.customer}.`
      : "Review the pipeline and confirm all open quotes have follow-ups scheduled.";

  const paydayLine = payday.needsSetup
    ? "Friday payday commission tracking needs deposit receipt emails from Gmail."
    : `${JARVIS_CONFIG.businessName} has ${formatCurrency(payday.commissionDueThisFriday)} commission currently due for this Friday based on deposit-paid bookings.`;

  const upliftLine =
    !payday.needsSetup && commissionForecast.likely > 0
      ? `Accepted quotes still awaiting deposit could add ${formatCurrency(commissionForecast.likely)} to commission if deposits are received before Friday.`
      : "";

  const dataNote = dataQuality.funnelWarning
    ? `\nNote: ${dataQuality.funnelWarning}`
    : "";

  const script = `Good morning Jake.

${paydayLine}
${upliftLine ? `${upliftLine}\n\n` : ""}${JARVIS_CONFIG.businessName} received ${leads} new ${settings.leadProviderName} ${
    leads === 1 ? "lead" : "leads"
  } in the last twenty-four hours (from Job Ledger — unique jobs, not email mentions).

${surveys} ${surveys === 1 ? "survey was" : "surveys were"} booked, generating an estimated survey conversion rate of ${surveyRate}.

${
  outstanding != null
    ? `Outstanding opportunities total approximately ${formatCurrency(outstanding)}, representing an estimated commission opportunity of ${formatCurrency(outstandingCommission ?? 0)}.`
    : "Outstanding opportunity value needs more email data to estimate confidently."
}

${priorityLine}

${formatSlot("GU")}
${formatSlot("RH")}
${formatSlot("TN")}

Commission forecast — Earned: ${formatCurrency(commissionForecast.earned)}, Likely: ${formatCurrency(commissionForecast.likely)}. Health score: ${executive.health.label}.${dataNote}`;

  const focus: string[] = [];
  if (payday.commissionDueThisFriday > 0) {
    focus.push(
      `Verify ${formatCurrency(payday.commissionDueThisFriday)} commission payable this Friday (${payday.nextPaydayLabel}).`
    );
  }
  if (payday.needsConfirmation?.length) {
    focus.push(
      `Confirm move values for ${payday.needsConfirmation.length} deposit-paid booking(s) before payday.`
    );
  }
  if (topHot) focus.push(`${topHot.recommendedAction} (${topHot.customer})`);
  if (executive.actions.jakeCount > 0) {
    focus.push(
      `Clear ${executive.actions.jakeCount} Jake Focus ${executive.actions.jakeCount === 1 ? "action" : "actions"} before midday.`
    );
  }
  if (today.newLeads > 0 && briefing.leadTracker.unanswered > 0) {
    focus.push(
      `Respond to ${briefing.leadTracker.unanswered} unanswered ${settings.leadProviderName} ${briefing.leadTracker.unanswered === 1 ? "lead" : "leads"}.`
    );
  }
  const guSlot = surveyIntelligence.slots.GU[0];
  if (guSlot) focus.push(`Offer GU survey slot ${guSlot.dateLabel} at ${guSlot.time}.`);
  while (focus.length < 3) {
    focus.push("Review pipeline and confirm deposit verifications.");
    if (focus.length >= 3) break;
  }

  return {
    script: `${script}\n\nToday's focus:\n1. ${focus[0]}\n2. ${focus[1]}\n3. ${focus[2]}`,
    focus: focus.slice(0, 3),
  };
}

export async function generateJarvisBriefing(): Promise<JarvisBriefing> {
  const gmailStatus = await getGmailSetupStatus();
  const settings = await getJarvisSettings();
  const commissionRate = settings.commissionPercent / 100;
  const notes: string[] = [];

  if (!isJarvisAuthConfigured()) {
    notes.push("Set JARVIS_ADMIN_PASSWORD and JARVIS_SESSION_SECRET in environment variables.");
  }
  if (!gmailStatus.googleOAuthConfigured) {
    notes.push("Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Vercel environment variables.");
  }
  if (!gmailStatus.storageReady) {
    notes.push("Link a Vercel KV database to persist Gmail connections across deployments.");
  }
  if (!gmailStatus.fullyConnected) {
    notes.push("Connect both Gmail accounts at /admin/jarvis/setup.");
  }

  let emails: JarvisEmail[] = [];
  let fetchFailed = false;

  if (gmailStatus.fullyConnected && gmailStatus.googleOAuthConfigured) {
    try {
      emails = await fetchJarvisEmails({ days: 30, parsePdfs: true });
    } catch (error) {
      fetchFailed = true;
      const message = error instanceof Error ? error.message : "Unknown Gmail error";
      notes.push(`Gmail fetch failed: ${message}`);
    }
  }

  const pdfAudit = collectPdfAudit(emails);
  const { events, duplicateCount } = detectEmailEvents(emails);
  const jobLedger = buildJobLedger(events, duplicateCount, settings, pdfAudit);
  const jobs = jobLedger.jobs;

  const classified = classifyEmails(emails);
  const emails24h = filterEmailsByDays(classified, 1);
  const summary24h = summariseByCategory(emails24h);
  const summary7d = summariseByCategory(filterEmailsByDays(classified, 7));

  const revenue = buildLedgerRevenuePeriods(jobs, commissionRate);
  const roi = buildLedgerRoi(revenue, settings);
  const pipelineFunnel = buildLedgerFunnel(jobs, 7);
  const payday = buildLedgerPayday(jobs, commissionRate);
  const hotLeads = buildHotLeadsFromLedger(jobs);
  const missedRevenue = buildMissedRevenueFromLedger(jobs, commissionRate);
  const leadTracker = buildLeadTrackerFromLedger(jobs);
  const charts = buildLedgerCharts(jobs, commissionRate);
  const moveTracker = buildMoveTrackerFromLedger(jobs, commissionRate);
  const commissionForecast = buildCommissionForecastFromLedger(jobs, commissionRate);
  const postcodeAnalytics = buildPostcodeAnalytics(jobs, settings, 30);
  const cmmSpend = buildCmmSpend(jobs, settings);
  const gmailConnected =
    (gmailStatus.main.connected ? 1 : 0) + (gmailStatus.appointments.connected ? 1 : 0);
  const dataQuality = buildDataQuality(
    jobLedger,
    gmailConnected,
    pipelineFunnel.funnelWarning ?? null
  );

  const rawTasks = buildTasks(classified);
  let tasks = enrichTasks(rawTasks, classified, commissionRate);
  const confirmationTasks = buildValueConfirmationTasks(payday);
  tasks = { ...tasks, jake: [...confirmationTasks, ...tasks.jake] };

  const health = calculateHealthScore(
    emails24h,
    tasks,
    gmailStatus.fullyConnected && !fetchFailed
  );

  const surveyIntelligence = buildSurveyIntelligence(classified);
  const hotOpportunityValue = hotLeads.leads.reduce(
    (s, l) => s + (l.potentialValue ?? 0),
    0
  );

  const metrics24h = revenue.last24h;
  const metrics7d = revenue.last7d;

  const scorecard = {
    periodLabel: `Last ${JARVIS_CONFIG.lookbackHours} hours`,
    newCmmLeads: metrics24h.leads,
    surveyBookings: metrics24h.surveys,
    quoteAcceptances: metrics24h.quotesAccepted,
    depositsReceived: metrics24h.depositsReceived,
    totalQuoteValue: jobs
      .filter((j) => j.quote_accepted_at)
      .reduce((s, j) => s + (j.quote_value ?? 0), 0),
    totalDepositValue: jobs
      .filter((j) => j.deposit_receipt_received_at)
      .reduce((s, j) => s + (j.deposit_value ?? 0), 0),
    commissionRate,
    commissionOnQuotes: metrics24h.commissionEarned,
    commissionOnDeposits: metrics24h.commissionEarned,
    totalCommission: metrics24h.commissionEarned,
  };

  const executive = {
    today: {
      newLeads: metrics24h.leads,
      surveysBooked: metrics24h.surveys,
      depositsReceived: metrics24h.depositsReceived,
      estimatedCommission: metrics24h.commissionEarned,
    },
    thisWeek: {
      newLeads: metrics7d.leads,
      surveysBooked: metrics7d.surveys,
      depositsReceived: metrics7d.depositsReceived,
      estimatedCommission: metrics7d.commissionEarned,
    },
    pipeline: {
      outstandingQuoteValue: revenue.last7d.outstandingQuoteValue,
      hotOpportunityValue,
    },
    actions: {
      jarvisCount: tasks.jarvis.length,
      jakeCount: tasks.jake.length,
    },
    health,
  };

  const briefingBase = {
    business: JARVIS_CONFIG.businessName,
    version: "v2" as const,
    scorecard,
    executive,
    revenue,
    roi,
    settings,
    missedRevenue,
    hotLeads,
    leadTracker,
    surveyIntelligence,
    payday,
    commissionForecast,
    pipelineFunnel: {
      stages: pipelineFunnel.stages,
      movesCompletedDetectable: pipelineFunnel.movesCompletedDetectable,
      needsSetup: pipelineFunnel.needsSetup,
    },
    moveTracker,
    charts,
    tasks,
    emails: {
      cmmLeads: summary24h.cmmLeads,
      surveyBookings: summary24h.surveyBookings,
      quoteAcceptances: summary24h.quoteAcceptances,
      depositPayments: summary24h.depositPayments,
    },
    setup: {
      gmailConfigured:
        gmailStatus.fullyConnected &&
        gmailStatus.googleOAuthConfigured &&
        !fetchFailed,
      connections: {
        main: {
          connected: gmailStatus.main.connected,
          email: gmailStatus.main.email,
        },
        appointments: {
          connected: gmailStatus.appointments.connected,
          email: gmailStatus.appointments.email,
        },
      },
      missing: gmailStatus.missing,
      notes,
    },
    jobLedger,
    dataQuality,
    postcodeAnalytics,
    cmmSpend,
  };

  const { script, focus } = buildExecutiveBriefing(briefingBase);

  return {
    ...briefingBase,
    generatedAt: new Date().toISOString(),
    morningScript: script,
    todaysFocus: focus,
  };
}

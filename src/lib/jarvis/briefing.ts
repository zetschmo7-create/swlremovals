import { fetchJarvisEmails, getGmailSetupStatus } from "./gmail";
import { isJarvisAuthConfigured } from "./auth";
import {
  buildTasks,
  classifyEmails,
  summariseByCategory,
} from "./parser";
import type { JarvisBriefing, JarvisEmail } from "./types";
import { JARVIS_CONFIG } from "./config";
import { getJarvisSettings } from "./settings-store";
import {
  buildChartSeries,
  buildRevenuePeriods,
  buildRoiMetrics,
  calculateHealthScore,
  detectHotLeads,
  detectMissedRevenue,
  enrichTasks,
  filterEmailsByDays,
  trackUnansweredLeads,
} from "./intelligence";
import { buildSurveyIntelligence } from "./survey-engine";
import {
  buildFridayPaydayTracker,
  buildValueConfirmationTasks,
} from "./payday";
import { buildCommissionForecast } from "./commission-forecast";
import { buildPipelineFunnel } from "./pipeline-funnel";
import { buildMoveCompletionTracker } from "./move-tracker";

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
  briefing: Omit<
    JarvisBriefing,
    "morningScript" | "todaysFocus" | "generatedAt"
  >
): { script: string; focus: string[] } {
  const {
    executive,
    settings,
    hotLeads,
    missedRevenue,
    surveyIntelligence,
    payday,
    commissionForecast,
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
    if (slots.length === 0) {
      return `${zone} currently has no clustered availability.`;
    }
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
    ? "Friday payday commission tracking needs deposit emails from Gmail."
    : `${JARVIS_CONFIG.businessName} has ${formatCurrency(payday.commissionDueThisFriday)} commission currently due for this Friday based on deposit-paid bookings.`;

  const upliftLine =
    !payday.needsSetup && commissionForecast.likely > 0
      ? `Accepted quotes still awaiting deposit could add ${formatCurrency(commissionForecast.likely)} to commission if deposits are received before Friday.`
      : "";

  const script = `Good morning Jake.

${paydayLine}
${upliftLine ? `${upliftLine}\n\n` : ""}${JARVIS_CONFIG.businessName} received ${leads} new ${settings.leadProviderName} ${
    leads === 1 ? "lead" : "leads"
  } in the last twenty-four hours.

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

Commission forecast — Earned: ${formatCurrency(commissionForecast.earned)}, Likely: ${formatCurrency(commissionForecast.likely)}. Health score: ${executive.health.label}.`;

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
  if (topHot) {
    focus.push(`${topHot.recommendedAction} (${topHot.customer})`);
  }
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
  if (guSlot) {
    focus.push(`Offer GU survey slot ${guSlot.dateLabel} at ${guSlot.time}.`);
  }
  while (focus.length < 3) {
    focus.push("Review pipeline and confirm deposit verifications.");
    if (focus.length >= 3) break;
  }

  const scriptWithFocus = `${script}

Today's focus:
1. ${focus[0]}
2. ${focus[1]}
3. ${focus[2]}`;

  return { script: scriptWithFocus, focus: focus.slice(0, 3) };
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
    notes.push(
      "Link a Vercel KV database to persist Gmail connections across deployments."
    );
  }

  if (!gmailStatus.fullyConnected) {
    notes.push("Connect both Gmail accounts at /admin/jarvis/setup.");
  }

  let emails: JarvisEmail[] = [];
  let fetchFailed = false;

  if (gmailStatus.fullyConnected && gmailStatus.googleOAuthConfigured) {
    try {
      emails = await fetchJarvisEmails({ days: 30 });
    } catch (error) {
      fetchFailed = true;
      const message = error instanceof Error ? error.message : "Unknown Gmail error";
      notes.push(`Gmail fetch failed: ${message}`);
    }
  }

  const classified = classifyEmails(emails);
  const emails24h = filterEmailsByDays(classified, 1);
  const emails7d = filterEmailsByDays(classified, 7);
  const summary24h = summariseByCategory(emails24h);
  const summary7d = summariseByCategory(emails7d);

  const rawTasks = buildTasks(classified);
  let tasks = enrichTasks(rawTasks, classified, commissionRate);

  const payday = buildFridayPaydayTracker(classified, commissionRate);
  const confirmationTasks = buildValueConfirmationTasks(payday);
  tasks = {
    ...tasks,
    jake: [...confirmationTasks, ...tasks.jake],
  };

  const health = calculateHealthScore(
    emails24h,
    tasks,
    gmailStatus.fullyConnected && !fetchFailed
  );

  const hotLeads = detectHotLeads(classified);
  const missedRevenue = detectMissedRevenue(classified, commissionRate);
  const leadTracker = trackUnansweredLeads(classified);
  const surveyIntelligence = buildSurveyIntelligence(classified);
  const revenue = buildRevenuePeriods(classified, commissionRate);
  const roi = buildRoiMetrics(revenue, settings);
  const charts = buildChartSeries(classified, commissionRate);
  const pipelineFunnel = buildPipelineFunnel(classified, 7);
  const moveTracker = buildMoveCompletionTracker(classified, commissionRate);

  const hotOpportunityValue = hotLeads.leads.reduce(
    (s, l) => s + (l.potentialValue ?? 0),
    0
  );
  const commissionForecast = buildCommissionForecast(
    classified,
    commissionRate,
    hotOpportunityValue,
    revenue.last7d.outstandingQuoteValue
  );

  const scorecard = {
    periodLabel: `Last ${JARVIS_CONFIG.lookbackHours} hours`,
    newCmmLeads: summary24h.cmmLeads.length,
    surveyBookings: summary24h.surveyBookings.length,
    quoteAcceptances: summary24h.quoteAcceptances.length,
    depositsReceived: summary24h.depositPayments.length,
    totalQuoteValue: summary24h.totalQuoteValue,
    totalDepositValue: summary24h.totalDepositValue,
    commissionRate,
    commissionOnQuotes: summary24h.totalQuoteValue * commissionRate,
    commissionOnDeposits: summary24h.totalDepositValue * commissionRate,
    totalCommission:
      (summary24h.totalQuoteValue + summary24h.totalDepositValue) * commissionRate,
  };

  const executive = {
    today: {
      newLeads: summary24h.cmmLeads.length,
      surveysBooked: summary24h.surveyBookings.length,
      depositsReceived: summary24h.depositPayments.length,
      estimatedCommission: scorecard.totalCommission,
    },
    thisWeek: {
      newLeads: summary7d.cmmLeads.length,
      surveysBooked: summary7d.surveyBookings.length,
      depositsReceived: summary7d.depositPayments.length,
      estimatedCommission:
        (summary7d.totalQuoteValue + summary7d.totalDepositValue) * commissionRate,
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
    pipelineFunnel,
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
  };

  const { script, focus } = buildExecutiveBriefing(briefingBase);

  return {
    ...briefingBase,
    generatedAt: new Date().toISOString(),
    morningScript: script,
    todaysFocus: focus,
  };
}

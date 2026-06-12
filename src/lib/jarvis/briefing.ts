import { fetchJarvisEmails, getGmailSetupStatus } from "./gmail";
import { isJarvisAuthConfigured } from "./auth";
import {
  buildTasks,
  classifyEmails,
  summariseByCategory,
} from "./parser";
import type { JarvisBriefing, JarvisEmail } from "./types";
import { JARVIS_CONFIG } from "./config";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function buildMorningScript(
  scorecard: JarvisBriefing["scorecard"],
  tasks: JarvisBriefing["tasks"]
): string {
  const dateLabel = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const jakeTasks = tasks.jake.slice(0, 3).map((t) => t.title);
  const jarvisTasks = tasks.jarvis.slice(0, 3).map((t) => t.title);

  return `Good morning, Jake. Here is your ${JARVIS_CONFIG.businessName} briefing for ${dateLabel}.

Over the last twenty-four hours, you received ${scorecard.newCmmLeads} new Compare My Move ${
    scorecard.newCmmLeads === 1 ? "lead" : "leads"
  }, ${scorecard.surveyBookings} survey ${
    scorecard.surveyBookings === 1 ? "booking" : "bookings"
  }, ${scorecard.quoteAcceptances} quote ${
    scorecard.quoteAcceptances === 1 ? "acceptance" : "acceptances"
  }, and ${scorecard.depositsReceived} deposit or payment ${
    scorecard.depositsReceived === 1 ? "receipt" : "receipts"
  }.

On revenue, accepted quotes total ${formatCurrency(scorecard.totalQuoteValue)} and deposits total ${formatCurrency(
    scorecard.totalDepositValue
  )}. At your ten percent commission rate, that is ${formatCurrency(
    scorecard.totalCommission
  )} in potential earnings for the period.

Your priority focus today${
    jakeTasks.length > 0
      ? `: ${jakeTasks.join("; ")}.`
      : ": no urgent items flagged — review the pipeline and follow up warm quotes."
  }

I can handle${
    jarvisTasks.length > 0
      ? `: ${jarvisTasks.join("; ")}.`
      : ": routine inbox triage and calendar checks."
  }

${tasks.wait.length > 0 ? `${tasks.wait.length} lower-priority items can wait until this afternoon.` : "Nothing is sitting in the wait queue."}

That is your three-minute briefing. Have a strong day.`;
}

export async function generateJarvisBriefing(): Promise<JarvisBriefing> {
  const gmailStatus = getGmailSetupStatus();
  const notes: string[] = [];

  if (!isJarvisAuthConfigured()) {
    notes.push("Set JARVIS_ADMIN_PASSWORD and JARVIS_SESSION_SECRET in environment variables.");
  }

  if (!gmailStatus.configured) {
    notes.push(
      "Gmail API credentials missing. Add Google OAuth client ID/secret and refresh tokens for both accounts."
    );
  }

  let emails: JarvisEmail[] = [];
  if (gmailStatus.configured) {
    try {
      emails = await fetchJarvisEmails();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown Gmail error";
      notes.push(`Gmail fetch failed: ${message}`);
    }
  }

  const classified = classifyEmails(emails);
  const summary = summariseByCategory(classified);
  const tasks = buildTasks(classified);
  const rate = JARVIS_CONFIG.commissionRate;

  const commissionOnQuotes = summary.totalQuoteValue * rate;
  const commissionOnDeposits = summary.totalDepositValue * rate;

  const scorecard = {
    periodLabel: `Last ${JARVIS_CONFIG.lookbackHours} hours`,
    newCmmLeads: summary.cmmLeads.length,
    surveyBookings: summary.surveyBookings.length,
    quoteAcceptances: summary.quoteAcceptances.length,
    depositsReceived: summary.depositPayments.length,
    totalQuoteValue: summary.totalQuoteValue,
    totalDepositValue: summary.totalDepositValue,
    commissionRate: rate,
    commissionOnQuotes,
    commissionOnDeposits,
    totalCommission: commissionOnQuotes + commissionOnDeposits,
  };

  const briefing: JarvisBriefing = {
    generatedAt: new Date().toISOString(),
    business: JARVIS_CONFIG.businessName,
    scorecard,
    tasks,
    morningScript: buildMorningScript(scorecard, tasks),
    emails: {
      cmmLeads: summary.cmmLeads,
      surveyBookings: summary.surveyBookings,
      quoteAcceptances: summary.quoteAcceptances,
      depositPayments: summary.depositPayments,
    },
    setup: {
      gmailConfigured: gmailStatus.configured && notes.every((n) => !n.startsWith("Gmail fetch failed")),
      missing: gmailStatus.missing,
      notes,
    },
  };

  return briefing;
}

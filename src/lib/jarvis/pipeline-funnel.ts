import type { ClassifiedEmail } from "./types";
import { mentionsQuoteNotAccepted } from "./extractors";
import { filterEmailsByDays } from "./intelligence";

export type FunnelStage = {
  key: string;
  label: string;
  count: number;
  conversionFromPrevious: number | null;
};

const MOVE_COMPLETED_PATTERNS =
  /move completed|completed your move|thank you for choosing|move successfully completed/i;

export function buildPipelineFunnel(
  emails: ClassifiedEmail[],
  days = 7
) {
  const period = filterEmailsByDays(emails, days);

  const leads = period.filter((e) => e.category === "cmm_lead").length;
  const surveys = period.filter((e) => e.category === "survey_booking").length;
  const quotesSent = period.filter(
    (e) =>
      e.category === "operational" &&
      mentionsQuoteNotAccepted(e)
  ).length + period.filter((e) => e.category === "quote_acceptance").length;
  const quotesAccepted = period.filter(
    (e) => e.category === "quote_acceptance"
  ).length;
  const depositsPaid = period.filter(
    (e) => e.category === "deposit_payment"
  ).length;
  const movesCompleted = period.filter((e) =>
    MOVE_COMPLETED_PATTERNS.test(`${e.subject} ${e.snippet} ${e.body}`)
  ).length;

  const stages: FunnelStage[] = [
    { key: "leads", label: "Leads Received", count: leads, conversionFromPrevious: null },
    {
      key: "surveys",
      label: "Surveys Booked",
      count: surveys,
      conversionFromPrevious: leads > 0 ? surveys / leads : null,
    },
    {
      key: "quotes_sent",
      label: "Quotes Sent",
      count: quotesSent,
      conversionFromPrevious: surveys > 0 ? quotesSent / surveys : null,
    },
    {
      key: "quotes_accepted",
      label: "Quotes Accepted",
      count: quotesAccepted,
      conversionFromPrevious:
        quotesSent > 0 ? quotesAccepted / quotesSent : null,
    },
    {
      key: "deposits",
      label: "Deposits Paid",
      count: depositsPaid,
      conversionFromPrevious:
        quotesAccepted > 0 ? depositsPaid / quotesAccepted : null,
    },
    {
      key: "moves",
      label: "Moves Completed",
      count: movesCompleted,
      conversionFromPrevious:
        depositsPaid > 0 ? movesCompleted / depositsPaid : null,
    },
  ];

  return {
    stages,
    movesCompletedDetectable: movesCompleted > 0,
    needsSetup: leads === 0 && surveys === 0,
  };
}

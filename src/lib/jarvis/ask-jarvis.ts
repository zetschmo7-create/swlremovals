import type { JarvisBriefing, PostcodeArea } from "./types";

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

export function answerJarvisQuestion(
  briefing: JarvisBriefing,
  question: string
): string {
  const q = question.toLowerCase().trim();
  if (!q) {
    return "Ask me about leads, commission, CMM spend, postcode ROI, pipeline, surveys, or follow-ups.";
  }

  const cmm = briefing.cmmLeadIntelligence;

  if (/cmm leads.*today|how many cmm.*today|leads today/i.test(q)) {
    return `CMM leads today: ${cmm.leadsToday}. Company marketing spend today: ${formatCurrency(cmm.spendToday)}.`;
  }

  if (/cmm leads.*week|how many cmm.*week|leads this week/i.test(q)) {
    return `CMM leads this week: ${cmm.leadsThisWeek}. Company marketing spend this week: ${formatCurrency(cmm.spendThisWeek)}.`;
  }

  if (/cmm leads.*month|how many cmm.*month/i.test(q)) {
    return `CMM leads this month: ${cmm.leadsThisMonth}. Company marketing spend this month: ${formatCurrency(cmm.spendThisMonth)}.`;
  }

  if (/cmm leads.*gu|gu.*cmm leads|leads.*gu.*week|how many rh/i.test(q)) {
    const areaMatch = q.match(/\b(gu|rh|tn|sm|cr)\b/i);
    const area = (areaMatch?.[1]?.toUpperCase() ?? "GU") as PostcodeArea;
    const stats = cmm.byArea[area];
    if (!stats) return `No CMM data for area ${area}.`;
    return `${area} area: ${stats.thisWeek.leads} CMM leads this week (${stats.allTime.leads} all time). Company spend this month: ${formatCurrency(stats.thisMonth.spend)}.`;
  }

  if (/most leads|which postcode.*most|which area.*most|sends the most/i.test(q)) {
    const top = cmm.topAreas[0];
    if (!top) return "No CMM lead data yet — run Rebuild CMM Lead Ledger.";
    return `Most CMM leads come from ${top.area}: ${top.leads} all time (${formatCurrency(top.spend)} company spend).`;
  }

  if (/unknown postcode/i.test(q)) {
    return `${cmm.unknownPostcodes} CMM leads have unknown postcodes and need review.`;
  }

  if (/most profitable|best postcode|which postcode|which area/i.test(q)) {
    const areas = Object.entries(briefing.postcodeAnalytics.areas) as [
      PostcodeArea,
      (typeof briefing.postcodeAnalytics.areas)[PostcodeArea],
    ][];
    const ranked = areas
      .filter(([, a]) => a.roi != null)
      .sort((a, b) => (b[1].roi ?? 0) - (a[1].roi ?? 0));
    if (ranked.length === 0) return "Not enough postcode data to rank profitability yet.";
    const [area, stats] = ranked[0];
    return `Most profitable area: ${area} — ROI ${formatPct(stats.roi)}, turnover ${formatCurrency(stats.turnover)}, company spend ${formatCurrency(stats.spend)}.`;
  }

  if (/cmm spend|lead spend|marketing spend|spent on cmm|how much.*cmm/i.test(q)) {
    return `CMM company marketing spend — Today: ${formatCurrency(cmm.spendToday)}, This week: ${formatCurrency(cmm.spendThisWeek)}, This month: ${formatCurrency(cmm.spendThisMonth)}, All time: ${formatCurrency(cmm.spendAllTime)}.`;
  }

  if (/commission due|friday|payday|due this/i.test(q)) {
    const p = briefing.payday;
    if (p.needsSetup) return "Payday data needs setup — connect Gmail and wait for deposit receipt emails.";
    return `${p.summaryLine} Next payday: ${p.nextPaydayLabel} (${p.daysUntilPayday} day${p.daysUntilPayday === 1 ? "" : "s"}).`;
  }

  if (/deposit receipt.*unknown|unknown.*value|value needs confirmation/i.test(q)) {
    const jobs = briefing.jobLedger.jobs.filter(
      (j) =>
        j.deposit_receipt_received_at &&
        j.final_move_value == null &&
        j.quote_value == null
    );
    if (jobs.length === 0) return "No deposit receipts with unknown values detected.";
    return jobs
      .slice(0, 5)
      .map((j) => `• ${j.customer_name ?? "Unknown"} — deposit paid, value needs confirmation`)
      .join("\n");
  }

  if (/accepted.*not deposit|quote.*not deposit|not deposit paid/i.test(q)) {
    const jobs = briefing.jobLedger.jobs.filter(
      (j) => j.quote_accepted_at && !j.deposit_receipt_received_at
    );
    if (jobs.length === 0) return "No accepted quotes awaiting deposit detected.";
    return jobs
      .slice(0, 5)
      .map((j) => `• ${j.customer_name ?? "Unknown"}${j.quote_value ? ` (${formatCurrency(j.quote_value)})` : ""}`)
      .join("\n");
  }

  if (/conversion rate|best conversion|area.*conversion|converts best/i.test(q)) {
    const areas = Object.entries(cmm.byArea) as [
      PostcodeArea,
      (typeof cmm.byArea)[PostcodeArea],
    ][];
    const ranked = areas
      .filter(([, a]) => a.conversionRate != null && a.allTime.leads > 0 && !a.needsReview)
      .sort((a, b) => (b[1].conversionRate ?? 0) - (a[1].conversionRate ?? 0));
    if (ranked.length === 0) {
      return "Not enough reliable CMM-to-job matches for area conversion rates yet.";
    }
    const [area, stats] = ranked[0];
    return `Best CMM conversion: ${area} at ${formatPct(stats.conversionRate)} (${stats.depositsPaid} deposits / ${stats.allTime.leads} leads).`;
  }

  if (/call first|priority lead|hot lead|which lead/i.test(q)) {
    const hot = briefing.hotLeads.leads.slice(0, 3);
    if (hot.length === 0) return "No hot leads flagged right now. Check Jake Focus for unanswered CMM leads.";
    return hot
      .map(
        (l, i) =>
          `${i + 1}. ${l.customer}${l.potentialValue ? ` (${formatCurrency(l.potentialValue)})` : ""} — ${l.recommendedAction}`
      )
      .join("\n");
  }

  if (/pipeline|outstanding quote/i.test(q)) {
    const v = briefing.executive.pipeline.outstandingQuoteValue;
    const hot = briefing.executive.pipeline.hotOpportunityValue;
    return `Outstanding quote pipeline: ${formatCurrency(v)}. Hot opportunities: ${hot > 0 ? formatCurrency(hot) : "none flagged"}.`;
  }

  if (/gu survey|rh survey|tn survey|survey slot|availability/i.test(q)) {
    const lines: string[] = [];
    for (const zone of ["GU", "RH", "TN"] as const) {
      const slots = briefing.surveyIntelligence.slots[zone];
      if (slots.length === 0) lines.push(`${zone}: No clustered availability.`);
      else {
        for (const s of slots) {
          lines.push(
            `${zone}: ${s.dateLabel ?? s.date} ${s.time} — ${s.confidence} confidence — ${s.reasoning}`
          );
        }
      }
    }
    return lines.join("\n") || "Survey availability needs setup.";
  }

  if (/follow.?up|quote need/i.test(q)) {
    const missed = briefing.missedRevenue.opportunities.filter((o) =>
      /quote|follow/i.test(o.reason)
    );
    if (missed.length === 0) return "No quote follow-up gaps detected in Job Ledger.";
    return missed.slice(0, 5).map((o) => `• ${o.customer}: ${o.reason}`).join("\n");
  }

  if (/left on the table|missed|leaking/i.test(q)) {
    const m = briefing.missedRevenue;
    if (m.needsSetup || m.totalMissedTurnover == null) {
      return "Missed revenue estimate needs more email data.";
    }
    return `Potential missed turnover: ${formatCurrency(m.totalMissedTurnover)} (${formatCurrency(m.totalMissedCommission ?? 0)} commission). Top gap: ${m.opportunities[0]?.reason ?? "none"}.`;
  }

  if (/forecast|earned|likely|stretch/i.test(q)) {
    const f = briefing.commissionForecast;
    return `Commission forecast — Earned: ${formatCurrency(f.earned)}, Likely: ${formatCurrency(f.likely)}, Possible: ${formatCurrency(f.possible)}, Stretch: ${formatCurrency(f.stretch)}.`;
  }

  if (/focus|today|jake/i.test(q)) {
    return briefing.todaysFocus.map((item, i) => `${i + 1}. ${item}`).join("\n");
  }

  return "I can answer questions about CMM spend, postcode ROI, Friday commission, deposit receipts, accepted quotes, conversion rates, survey slots, and pipeline.";
}

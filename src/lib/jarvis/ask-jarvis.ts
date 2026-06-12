import type { JarvisBriefing } from "./types";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function answerJarvisQuestion(
  briefing: JarvisBriefing,
  question: string
): string {
  const q = question.toLowerCase().trim();
  if (!q) return "Ask me about leads, commission, pipeline, surveys, or follow-ups.";

  if (/call first|priority lead|hot lead|which lead/.test(q)) {
    const hot = briefing.hotLeads.leads.slice(0, 3);
    if (hot.length === 0) {
      return "No hot leads flagged right now. Check Jake Focus for unanswered CMM leads.";
    }
    return hot
      .map(
        (l, i) =>
          `${i + 1}. ${l.customer}${l.potentialValue ? ` (${formatCurrency(l.potentialValue)})` : ""} — ${l.recommendedAction}`
      )
      .join("\n");
  }

  if (/friday|payday|commission due|due this/.test(q)) {
    const p = briefing.payday;
    if (p.needsSetup) return "Payday data needs setup — connect Gmail and wait for deposit emails.";
    return `${p.summaryLine} Next payday: ${p.nextPaydayLabel} (${p.daysUntilPayday} day${p.daysUntilPayday === 1 ? "" : "s"}).`;
  }

  if (/pipeline|outstanding quote/.test(q)) {
    const v = briefing.executive.pipeline.outstandingQuoteValue;
    const hot = briefing.executive.pipeline.hotOpportunityValue;
    return `Outstanding quote pipeline: ${formatCurrency(v)}. Hot opportunities: ${hot > 0 ? formatCurrency(hot) : "none flagged"}.`;
  }

  if (/gu survey|rh survey|tn survey|survey slot|availability/.test(q)) {
    const lines: string[] = [];
    for (const zone of ["GU", "RH", "TN"] as const) {
      const slots = briefing.surveyIntelligence.slots[zone];
      if (slots.length === 0) {
        lines.push(`${zone}: No clustered availability.`);
      } else {
        for (const s of slots) {
          lines.push(
            `${zone}: ${s.dateLabel ?? s.date} ${s.time} — ${s.confidence} confidence — ${s.reasoning}`
          );
        }
      }
    }
    return lines.join("\n") || "Survey availability needs setup.";
  }

  if (/follow.?up|quote need/.test(q)) {
    const missed = briefing.missedRevenue.opportunities.filter((o) =>
      /quote|follow/i.test(o.reason)
    );
    if (missed.length === 0) {
      return "No quote follow-up gaps detected in current email data.";
    }
    return missed
      .slice(0, 5)
      .map((o) => `• ${o.customer}: ${o.reason}`)
      .join("\n");
  }

  if (/left on the table|missed|leaking/.test(q)) {
    const m = briefing.missedRevenue;
    if (m.needsSetup || m.totalMissedTurnover == null) {
      return "Missed revenue estimate needs more email data.";
    }
    return `Potential missed turnover: ${formatCurrency(m.totalMissedTurnover)} (${formatCurrency(m.totalMissedCommission ?? 0)} commission). Top gap: ${m.opportunities[0]?.reason ?? "none"}.`;
  }

  if (/forecast|earned|likely|stretch/.test(q)) {
    const f = briefing.commissionForecast;
    return `Commission forecast — Earned: ${formatCurrency(f.earned)}, Likely: ${formatCurrency(f.likely)}, Possible: ${formatCurrency(f.possible)}, Stretch: ${formatCurrency(f.stretch)}.`;
  }

  if (/focus|today|jake/.test(q)) {
    return briefing.todaysFocus
      .map((item, i) => `${i + 1}. ${item}`)
      .join("\n");
  }

  return "I can answer questions about leads, Friday commission, pipeline, survey slots (GU/RH/TN), follow-ups, and money left on the table.";
}

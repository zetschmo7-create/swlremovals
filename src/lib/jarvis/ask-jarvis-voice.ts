import type { JarvisBriefing, PostcodeArea } from "./types";
import { answerJarvisQuestion } from "./ask-jarvis";
import { answerCommercialIntelligenceQuestion } from "./ask-jarvis-commercial";

const VOICE_ANSWER_MAX = 900;
const TTS_MAX = 1200;

/** Flatten bullet lists and newlines for spoken delivery. */
export function formatForVoice(text: string, maxLength = VOICE_ANSWER_MAX): string {
  let out = text
    .replace(/^[\s•\-–]+/gm, "")
    .replace(/\n+/g, ". ")
    .replace(/\s+/g, " ")
    .replace(/\.{2,}/g, ".")
    .trim();

  if (out.length > maxLength) {
    const cut = out.slice(0, maxLength - 3);
    const lastSentence = cut.lastIndexOf(". ");
    out =
      lastSentence > maxLength * 0.5
        ? cut.slice(0, lastSentence + 1)
        : cut.trim();
    if (!out.endsWith(".")) out += "...";
  }

  return out;
}

/** Trim text before sending to ElevenLabs (server also enforces this). */
export function trimForTts(text: string): string {
  return text.trim().slice(0, TTS_MAX);
}

/**
 * Voice answers reuse Ask Jarvis logic, then apply voice-friendly formatting.
 * Keep responses direct, action-oriented, and short enough to speak aloud.
 */
export function answerJarvisQuestionForVoice(
  briefing: JarvisBriefing,
  question: string
): string {
  const raw = answerJarvisQuestionVoiceAware(briefing, question);
  return formatForVoice(raw);
}

function answerJarvisQuestionVoiceAware(
  briefing: JarvisBriefing,
  question: string
): string {
  const q = question.toLowerCase().trim();
  if (!q) {
    return "Ask me for a business breakdown, area performance, commission forecast, or what to focus on today.";
  }

  const commercial = answerCommercialIntelligenceQuestion(briefing, question, {
    voice: true,
  });
  if (commercial) return commercial;

  if (/highest roi|roi task|best roi|highest return/i.test(q)) {
    const focus = briefing.todaysFocus.slice(0, 3);
    if (focus.length > 0) {
      return `Your highest ROI priorities today: ${focus.join(". ")}.`;
    }
    const jake = briefing.tasks.jake.slice(0, 3);
    if (jake.length > 0) {
      return `Top actions: ${jake.map((t) => t.title).join(". ")}.`;
    }
    return "No urgent ROI tasks flagged. Check Jake Focus for new CMM leads.";
  }

  if (/cmm.*urgent|urgent.*cmm|urgent.*lead/i.test(q)) {
    const review = briefing.cmmLeadIntelligence.reviewQueue?.slice(0, 2) ?? [];
    const hot = briefing.hotLeads.leads.slice(0, 2);
    const parts: string[] = [];
    if (hot.length > 0) {
      parts.push(
        `Hot leads: ${hot.map((l) => `${l.customer}, ${l.recommendedAction}`).join(". ")}`
      );
    }
    if (review.length > 0) {
      parts.push(
        `${review.length} CMM match${review.length === 1 ? "" : "es"} need review in the lead ledger.`
      );
    }
    if (briefing.leadTracker.unanswered > 0) {
      parts.push(`${briefing.leadTracker.unanswered} unanswered leads in the tracker.`);
    }
    if (parts.length > 0) return parts.join(" ");
    return "No urgent CMM leads flagged right now.";
  }

  if (/before.*uk|before.*wake|uk wake|wakes up/i.test(q)) {
    const focus = briefing.todaysFocus.slice(0, 3);
    if (focus.length > 0) {
      return `Before the UK wakes up, focus on: ${focus.join(". ")}.`;
    }
    return "Check deposit chases and unanswered CMM leads before peak calling hours.";
  }

  if (/payday risk|summarise.*payday|summarize.*payday|risk.*friday/i.test(q)) {
    const p = briefing.payday;
    if (p.needsSetup) {
      return "Payday data needs Gmail connected with deposit receipt emails.";
    }
    const atRisk = briefing.jobLedger.jobs.filter(
      (j) => j.quote_accepted_at && !j.deposit_receipt_received_at
    ).length;
    return `${p.summaryLine} ${atRisk > 0 ? `${atRisk} accepted quotes still need deposits before payday.` : "No major deposit gaps flagged."}`;
  }

  if (/wasting money|waste money|losing money|burning money|unprofitable/i.test(q)) {
    const areas = Object.entries(briefing.cmmLeadIntelligence.byArea) as [
      PostcodeArea,
      (typeof briefing.cmmLeadIntelligence.byArea)[PostcodeArea],
    ][];
    const wasteful = areas
      .filter(
        ([, a]) =>
          a.allTime.leads >= 5 &&
          (a.roi != null && a.roi < 0 || a.depositsPaid === 0)
      )
      .sort((a, b) => b[1].allTime.spend - a[1].allTime.spend)
      .slice(0, 3);
    if (wasteful.length === 0) {
      return "No postcode areas clearly wasting CMM spend yet. Check areas with zero deposit conversions.";
    }
    return `Areas to review: ${wasteful
      .map(
        ([area, a]) =>
          `${area}, ${a.allTime.leads} leads and ${a.depositsPaid} deposits`
      )
      .join(". ")}.`;
  }

  return answerJarvisQuestion(briefing, question);
}

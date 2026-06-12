import type { ClassifiedEmail } from "./types";
import { extractPrimaryAmount, parseEmailDate } from "./extractors";
import { buildPayableBookings } from "./payday";

const MOVE_SCHEDULED =
  /move (day|date|scheduled)|removal (day|date)|moving on/i;
const MOVE_COMPLETED =
  /move completed|completed your move|thank you for choosing|successfully completed/i;

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function isMoveEmail(email: ClassifiedEmail): boolean {
  const text = `${email.subject} ${email.snippet} ${email.body}`;
  return MOVE_SCHEDULED.test(text) || MOVE_COMPLETED.test(text);
}

function moveOnDate(email: ClassifiedEmail, target: string): boolean {
  const when = parseEmailDate(email.date);
  if (!when) return false;
  const text = `${email.subject} ${email.snippet} ${email.body}`;
  return dateKey(when) === target || text.includes(target);
}

export function buildMoveCompletionTracker(
  emails: ClassifiedEmail[],
  commissionRate: number
) {
  const today = dateKey(new Date());
  const tomorrow = dateKey(new Date(Date.now() + 86400000));

  const moveEmails = emails.filter(isMoveEmail);
  const completed = moveEmails.filter((e) =>
    MOVE_COMPLETED.test(`${e.subject} ${e.snippet} ${e.body}`)
  );

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  weekStart.setHours(0, 0, 0, 0);

  const completedThisWeek = completed.filter((e) => {
    const when = parseEmailDate(e.date);
    return when ? when >= weekStart : false;
  });

  const movesToday = moveEmails.filter((e) => moveOnDate(e, today)).length;
  const movesTomorrow = moveEmails.filter((e) => moveOnDate(e, tomorrow)).length;

  const weekMoves = moveEmails.filter((e) => {
    const when = parseEmailDate(e.date);
    return when ? when >= weekStart : false;
  }).length;

  const detectable = completed.length > 0 || moveEmails.length > 0;

  const turnoverDelivered = detectable
    ? completedThisWeek.reduce(
        (s, e) => s + (extractPrimaryAmount(e) ?? 0),
        0
      )
    : null;

  const payable = buildPayableBookings(completedThisWeek, commissionRate);
  const commissionSecured = detectable
    ? payable.reduce((s, b) => s + (b.commission ?? 0), 0)
    : null;

  return {
    movesToday: detectable ? movesToday : null,
    movesTomorrow: detectable ? movesTomorrow : null,
    movesThisWeek: detectable ? weekMoves : null,
    completedThisWeek: detectable ? completedThisWeek.length : null,
    turnoverDelivered,
    commissionSecured,
    needsSetup: !detectable,
  };
}

import type { ClassifiedEmail, JarvisTask } from "./types";
import {
  emailMatchesCustomer,
  extractCustomerName,
  extractPrimaryAmount,
  parseEmailDate,
} from "./extractors";

export type PayableBooking = {
  id: string;
  customer: string;
  depositReceivedAt: string;
  moveValue: number | null;
  valueNeedsConfirmation: boolean;
  commission: number | null;
};

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getPaydayInfo(ref = new Date()) {
  const today = startOfDay(ref);
  const day = today.getDay();
  const daysUntilPayday = (5 - day + 7) % 7;
  const nextPayday = new Date(today);
  nextPayday.setDate(today.getDate() + daysUntilPayday);
  const lastPayday = new Date(nextPayday);
  lastPayday.setDate(nextPayday.getDate() - 7);

  return {
    nextPayday: nextPayday.toISOString().slice(0, 10),
    nextPaydayLabel: nextPayday.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }),
    daysUntilPayday,
    lastPayday,
    nextPaydayDate: nextPayday,
  };
}

function startOfWeekMonday(ref: Date): Date {
  const d = startOfDay(ref);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  return d;
}

function resolveMoveValue(
  deposit: ClassifiedEmail,
  allEmails: ClassifiedEmail[]
): { value: number | null; needsConfirmation: boolean } {
  const customer = extractCustomerName(deposit);
  const related = customer
    ? allEmails.filter((e) => emailMatchesCustomer(e, customer))
    : [deposit];

  const quoteValues = related
    .filter((e) => e.category === "quote_acceptance")
    .map(extractPrimaryAmount)
    .filter((v): v is number => v != null);

  if (quoteValues.length > 0) {
    return { value: Math.max(...quoteValues), needsConfirmation: false };
  }

  const allAmounts = related
    .flatMap((e) => e.extractedAmounts)
    .filter((v) => v > 0);

  const depositText = `${deposit.subject} ${deposit.body}`.toLowerCase();
  const looksLikeDepositOnly =
    /deposit|part payment|balance/i.test(depositText) && allAmounts.length <= 1;

  if (allAmounts.length === 0) {
    return { value: null, needsConfirmation: true };
  }

  if (looksLikeDepositOnly) {
    return { value: null, needsConfirmation: true };
  }

  return { value: Math.max(...allAmounts), needsConfirmation: false };
}

function isInPayPeriod(date: Date | null, lastPayday: Date, nextPayday: Date): boolean {
  if (!date) return false;
  return date > lastPayday && date <= new Date();
}

function isThisCalendarWeek(date: Date | null, ref: Date): boolean {
  if (!date) return false;
  const weekStart = startOfWeekMonday(ref);
  return date >= weekStart;
}

export function buildPayableBookings(
  emails: ClassifiedEmail[],
  commissionRate: number
): PayableBooking[] {
  const deposits = emails.filter((e) => e.category === "deposit_payment");

  return deposits.map((deposit) => {
    const { value, needsConfirmation } = resolveMoveValue(deposit, emails);
    const commission =
      value != null && !needsConfirmation ? value * commissionRate : null;

    return {
      id: deposit.id,
      customer: extractCustomerName(deposit) ?? "Unknown customer",
      depositReceivedAt: deposit.date || "Unknown",
      moveValue: value,
      valueNeedsConfirmation: needsConfirmation,
      commission,
    };
  });
}

export function buildFridayPaydayTracker(
  emails: ClassifiedEmail[],
  commissionRate: number
) {
  const payday = getPaydayInfo();
  const bookings = buildPayableBookings(emails, commissionRate);

  const payPeriodBookings = bookings.filter((b) => {
    const when = parseEmailDate(b.depositReceivedAt);
    return isInPayPeriod(when, payday.lastPayday, payday.nextPaydayDate);
  });

  const weekBookings = bookings.filter((b) => {
    const when = parseEmailDate(b.depositReceivedAt);
    return isThisCalendarWeek(when, new Date());
  });

  const dueConfirmed = payPeriodBookings.filter(
    (b) => !b.valueNeedsConfirmation && b.commission != null
  );
  const dueCommission = dueConfirmed.reduce(
    (s, b) => s + (b.commission ?? 0),
    0
  );
  const weekCommission = weekBookings
    .filter((b) => b.commission != null)
    .reduce((s, b) => s + (b.commission ?? 0), 0);

  const turnoverPayable = dueConfirmed.reduce(
    (s, b) => s + (b.moveValue ?? 0),
    0
  );

  const needsConfirmation = payPeriodBookings.filter(
    (b) => b.valueNeedsConfirmation
  );

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
    turnoverMadePayableThisWeek: weekBookings
      .filter((b) => b.moveValue != null)
      .reduce((s, b) => s + (b.moveValue ?? 0), 0),
    turnoverDueThisFriday: turnoverPayable,
    nextPayday: payday.nextPayday,
    nextPaydayLabel: payday.nextPaydayLabel,
    daysUntilPayday: payday.daysUntilPayday,
    payableBookings: payPeriodBookings,
    needsConfirmation,
    summaryLine,
    needsSetup: bookings.length === 0,
  };
}

export function buildValueConfirmationTasks(
  tracker: ReturnType<typeof buildFridayPaydayTracker>
): JarvisTask[] {
  return tracker.needsConfirmation.map((b) => ({
    id: `confirm-value-${b.id}`,
    title: "Confirm move value for payday commission",
    detail: `Deposit received for ${b.customer} — total move value needs confirmation.`,
    source: `Payday tracker · ${b.depositReceivedAt}`,
    category: "deposit_payment" as const,
    priority: "high" as const,
    customer: b.customer,
    revenueImpact: null,
    priorityScore: 95,
    reason: "Value needs confirmation",
    suggestedAction: "Confirm full quote/move value with Ryan Removals before Friday payday.",
  }));
}

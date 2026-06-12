import type { ClassifiedEmail } from "./types";
import {
  emailMatchesCustomer,
  extractCustomerName,
  extractPrimaryAmount,
  mentionsQuoteNotAccepted,
} from "./extractors";
import { buildPayableBookings } from "./payday";
import { filterEmailsByDays } from "./intelligence";

export function buildCommissionForecast(
  emails: ClassifiedEmail[],
  commissionRate: number,
  hotOpportunityValue: number,
  outstandingQuoteValue: number
) {
  const bookings = buildPayableBookings(emails, commissionRate);
  const earned = bookings
    .filter((b) => !b.valueNeedsConfirmation && b.commission != null)
    .reduce((s, b) => s + (b.commission ?? 0), 0);

  const acceptedNoDeposit = emails.filter((e) => {
    if (e.category !== "quote_acceptance") return false;
    const customer = extractCustomerName(e);
    if (!customer) return true;
    const hasDeposit = emails.some(
      (d) =>
        d.category === "deposit_payment" && emailMatchesCustomer(d, customer)
    );
    return !hasDeposit;
  });

  const likelyValue = acceptedNoDeposit.reduce(
    (s, e) => s + (extractPrimaryAmount(e) ?? 0),
    0
  );
  const likely = likelyValue * commissionRate;

  const possibleQuotes = emails.filter(
    (e) =>
      e.category === "operational" &&
      mentionsQuoteNotAccepted(e) &&
      extractPrimaryAmount(e) != null
  );
  const possibleValue =
    outstandingQuoteValue > 0
      ? outstandingQuoteValue
      : possibleQuotes.reduce((s, e) => s + (extractPrimaryAmount(e) ?? 0), 0);
  const possible = possibleValue * commissionRate;

  const stretchBase = possibleValue + hotOpportunityValue;
  const stretch = stretchBase * commissionRate;

  const recent = filterEmailsByDays(emails, 7);

  return {
    earned,
    likely,
    possible,
    stretch,
    needsSetup: recent.length === 0 && earned === 0,
  };
}

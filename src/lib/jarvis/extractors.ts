import type { ClassifiedEmail } from "./types";

const AMOUNT_REGEX = /£\s*([\d,]+(?:\.\d{2})?)/g;
const POSTCODE_REGEX = /\b(GU|RH|TN)\d{1,2}\s?[0-9][A-Z]{2}\b/gi;
const TIME_REGEX =
  /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b|\b([01]?\d|2[0-3]):([0-5]\d)\b/gi;

export function parseEmailDate(dateHeader: string): Date | null {
  if (!dateHeader) return null;
  const parsed = new Date(dateHeader);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function extractCustomerName(email: ClassifiedEmail): string | null {
  const text = `${email.subject} ${email.snippet} ${email.body}`;

  const named =
    text.match(/(?:lead|customer|client|name)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i) ??
    text.match(/(?:from|for)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
  if (named?.[1]) return named[1].trim();

  const subjectLead = email.subject.match(
    /(?:lead|enquiry|quote|survey)[:\s-]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i
  );
  if (subjectLead?.[1]) return subjectLead[1].trim();

  const fromName = email.from.match(/^([^<@]+)/)?.[1]?.trim();
  if (fromName && !/compare|moveflow|ryan|removals|noreply/i.test(fromName)) {
    return fromName.replace(/"/g, "");
  }

  return null;
}

export function extractPrimaryAmount(email: ClassifiedEmail): number | null {
  if (email.primaryAmount != null) return email.primaryAmount;
  const text = `${email.subject} ${email.snippet} ${email.body}`;
  const match = text.match(AMOUNT_REGEX);
  if (!match) return null;
  const raw = match[0].replace(/£\s*/, "").replace(/,/g, "");
  const value = parseFloat(raw);
  return Number.isNaN(value) ? null : value;
}

export function extractPostcodeZone(
  email: ClassifiedEmail
): "GU" | "RH" | "TN" | null {
  const text = `${email.subject} ${email.snippet} ${email.body}`.toUpperCase();
  const match = text.match(POSTCODE_REGEX);
  if (!match) return null;
  const prefix = match[0].slice(0, 2).toUpperCase();
  if (prefix === "GU" || prefix === "RH" || prefix === "TN") return prefix;
  return null;
}

export function extractTimesFromText(text: string): number[] {
  const minutes: number[] = [];
  for (const match of text.matchAll(TIME_REGEX)) {
    if (match[3]) {
      let hour = parseInt(match[1] ?? "0", 10);
      const min = parseInt(match[2] ?? "0", 10);
      const meridiem = match[3].toLowerCase();
      if (meridiem === "pm" && hour < 12) hour += 12;
      if (meridiem === "am" && hour === 12) hour = 0;
      minutes.push(hour * 60 + min);
    } else if (match[4] != null) {
      minutes.push(parseInt(match[4], 10) * 60 + parseInt(match[5] ?? "0", 10));
    }
  }
  return [...new Set(minutes)].sort((a, b) => a - b);
}

export function formatMinutesAsTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const period = hours >= 12 ? "pm" : "am";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return mins === 0
    ? `${displayHour}${period}`
    : `${displayHour}:${String(mins).padStart(2, "0")}${period}`;
}

export function emailMatchesCustomer(
  email: ClassifiedEmail,
  customer: string
): boolean {
  const needle = customer.toLowerCase();
  const hay = `${email.subject} ${email.snippet} ${email.body} ${email.from}`.toLowerCase();
  return hay.includes(needle);
}

export function isCustomerReply(email: ClassifiedEmail): boolean {
  const text = `${email.subject} ${email.from}`.toLowerCase();
  return (
    /^re:/i.test(email.subject) &&
    !/ryan|removals|appointments|noreply|moveflow/i.test(text)
  );
}

export function mentionsQuoteNotAccepted(email: ClassifiedEmail): boolean {
  const text = `${email.subject} ${email.snippet} ${email.body}`.toLowerCase();
  return (
    /quote/.test(text) &&
    !/quote\s*accepted|accepted\s*quote|deposit\s*received/i.test(text)
  );
}

export function mentionsDepositPromised(email: ClassifiedEmail): boolean {
  const text = `${email.subject} ${email.snippet} ${email.body}`.toLowerCase();
  return /deposit|payment due|pay.*deposit|awaiting payment/i.test(text);
}

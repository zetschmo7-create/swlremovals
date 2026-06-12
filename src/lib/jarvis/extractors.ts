import type { ClassifiedEmail, JarvisEmail, PostcodeArea } from "./types";
import { JARVIS_CONFIG } from "./config";

const AMOUNT_REGEX = /£\s*([\d,]+(?:\.\d{2})?)/g;
const UK_POSTCODE_REGEX =
  /\b([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})\b/gi;
const JOB_REF_REGEX = /\bRR-\d{3,6}\b/i;
const TIME_REGEX =
  /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b|\b([01]?\d|2[0-3]):([0-5]\d)\b/gi;

const TRACKED_AREAS = ["GU", "RH", "TN", "SM", "CR"] as const;

export function parseEmailDate(dateHeader: string): Date | null {
  if (!dateHeader) return null;
  const parsed = new Date(dateHeader);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function normalizeSubject(subject: string): string {
  return subject
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/re:\s*/gi, "")
    .trim();
}

export function extractJobReference(text: string): string | null {
  const match = text.match(JOB_REF_REGEX);
  return match ? match[0].toUpperCase() : null;
}

export function extractCustomerEmail(text: string): string | null {
  const match = text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
  if (!match) return null;
  const email = match[0].toLowerCase();
  if (/ryan|removals|comparemymove|noreply|moveflow/i.test(email)) {
    return null;
  }
  return email;
}

export function extractPostcodeFromText(text: string): string | null {
  const match = text.match(UK_POSTCODE_REGEX);
  if (!match) return null;
  return match[0].replace(/\s+/g, " ").trim().toUpperCase();
}

export function extractPostcodeArea(postcode: string | null): PostcodeArea {
  if (!postcode) return "Unknown";
  const normalized = postcode.replace(/\s/g, "").toUpperCase();
  const prefix = normalized.match(/^(GU|RH|TN|SM|CR)/)?.[1];
  if (prefix && TRACKED_AREAS.includes(prefix as (typeof TRACKED_AREAS)[number])) {
    return prefix as PostcodeArea;
  }
  return "Other";
}

export function isCmmLeadEmail(email: JarvisEmail): boolean {
  const text = `${email.subject} ${email.snippet} ${email.body}`;
  const hasLabel = email.labels.some((l) =>
    l.toLowerCase().includes(JARVIS_CONFIG.cmmLeadLabel.toLowerCase())
  );
  if (hasLabel) return true;
  if (
    /removals lead from .+ \(comparemymove\.com\)/i.test(text) ||
    /new residential lead/i.test(text)
  ) {
    return true;
  }
  return (
    email.account === "main" &&
    /compare\s*my\s*move|cmm|new\s*lead/i.test(text)
  );
}

export function extractCmmLeadCustomer(email: JarvisEmail): string | null {
  const text = `${email.subject} ${email.snippet} ${email.body}`;
  const fromSubject = email.subject.match(
    /Removals lead from\s+(.+?)\s*\(comparemymove\.com\)/i
  );
  if (fromSubject?.[1]) return fromSubject[1].trim();

  const named = text.match(
    /(?:customer|client|name|contact)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i
  );
  if (named?.[1]) return named[1].trim();

  return null;
}

export function isDepositInvoiceEmail(email: JarvisEmail): boolean {
  const text = `${email.subject} ${email.snippet} ${email.body}`;
  return (
    /deposit invoice for your move/i.test(email.subject) ||
    (/deposit invoice/i.test(text) && !/receipt|received the deposit/i.test(text))
  );
}

export function isDepositReceiptEmail(email: JarvisEmail): boolean {
  const text = `${email.subject} ${email.snippet} ${email.body}`;
  if (isDepositInvoiceEmail(email)) return false;
  return (
    /ryan removals\s*[-–]\s*deposit receipt/i.test(email.subject) ||
    /^deposit receipt$/i.test(email.subject.trim()) ||
    /received the deposit for your removal/i.test(text) ||
    (/deposit receipt/i.test(text) && /received|payment received/i.test(text))
  );
}

export function isQuoteAcceptedEmail(email: JarvisEmail): boolean {
  const text = `${email.subject} ${email.snippet} ${email.body}`;
  return (
    /quotation accepted/i.test(email.subject) ||
    (/has accepted your quote/i.test(text) && /i-mve\.com/i.test(text))
  );
}

export function isMoveInvoiceEmail(email: JarvisEmail): boolean {
  const text = `${email.subject} ${email.snippet} ${email.body}`;
  return (
    /move invoice|removal invoice|final invoice/i.test(text) &&
    !/deposit invoice/i.test(text)
  );
}

export function isSurveyBookingEmail(email: JarvisEmail): boolean {
  const text = `${email.subject} ${email.snippet} ${email.body}`;
  return (
    /survey\s*(booked|booking|scheduled|confirmed|appointment)/i.test(text) ||
    /video\s*survey/i.test(text) ||
    /appointment\s*(booked|confirmed|scheduled)/i.test(text) ||
    /booking\s*confirmation/i.test(text)
  );
}

export function isPdfRelevantEmail(email: JarvisEmail): boolean {
  return (
    isDepositInvoiceEmail(email) ||
    isDepositReceiptEmail(email) ||
    isQuoteAcceptedEmail(email) ||
    isMoveInvoiceEmail(email) ||
    /quotation|removal quote|deposit|receipt|invoice/i.test(
      `${email.subject} ${email.snippet}`
    )
  );
}

export function extractCustomerName(email: ClassifiedEmail): string | null {
  const jarvisEmail: JarvisEmail = email;
  const cmm = extractCmmLeadCustomer(jarvisEmail);
  if (cmm) return cmm;

  const text = `${email.subject} ${email.snippet} ${email.body}`;
  const depositInvoice = email.subject.match(
    /Deposit Invoice for Your Move\s*\|\s*RR-\d+\s*\|\s*(.+)$/i
  );
  if (depositInvoice?.[1]) return depositInvoice[1].trim();

  const named =
    text.match(/(?:lead|customer|client|name)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i) ??
    text.match(/(?:from|for)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
  if (named?.[1]) return named[1].trim();

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
  const area = extractPostcodeArea(
    extractPostcodeFromText(`${email.subject} ${email.snippet} ${email.body}`)
  );
  if (area === "GU" || area === "RH" || area === "TN") return area;
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

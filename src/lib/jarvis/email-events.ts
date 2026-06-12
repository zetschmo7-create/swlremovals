import type { JarvisEmail } from "./types";
import type { PdfExtractedFields, PdfParseResult } from "./pdf-parser";
import { JARVIS_CONFIG } from "./config";
import {
  extractCmmLeadCustomer,
  extractCustomerEmail,
  extractJobReference,
  extractPostcodeArea,
  extractPostcodeFromText,
  isCmmLeadEmail,
  isDepositInvoiceEmail,
  isDepositReceiptEmail,
  isMoveInvoiceEmail,
  isQuoteAcceptedEmail,
  isSurveyBookingEmail,
  normalizeSubject,
  parseEmailDate,
} from "./extractors";

export type EmailEventType =
  | "cmm_lead"
  | "survey_booking"
  | "quote_sent"
  | "quote_acceptance"
  | "deposit_invoice"
  | "deposit_receipt"
  | "move_invoice"
  | "move_completed"
  | "customer_reply"
  | "other";

export type EmailEvent = {
  id: string;
  eventType: EmailEventType;
  emailId: string;
  account: JarvisEmail["account"];
  threadId: string;
  subject: string;
  from: string;
  date: string;
  parsedAt: Date | null;
  jobReference: string | null;
  customerName: string | null;
  customerEmail: string | null;
  movingFromPostcode: string | null;
  movingToPostcode: string | null;
  moveDate: string | null;
  quoteValue: number | null;
  depositValue: number | null;
  totalValue: number | null;
  pdfSource: string | null;
  duplicateIgnored: boolean;
  dedupKey: string;
};

function mergePdfFields(
  pdfs: PdfParseResult[]
): PdfExtractedFields | null {
  const successful = pdfs.filter((p) => p.status === "success");
  if (successful.length === 0) return null;

  const preferred = successful.sort((a, b) => {
    const score = (name: string) => {
      const n = name.toLowerCase();
      if (/receipt/.test(n)) return 5;
      if (/deposit/.test(n)) return 4;
      if (/invoice/.test(n)) return 3;
      if (/quotation|quote/.test(n)) return 2;
      return 1;
    };
    return score(b.filename) - score(a.filename);
  })[0];

  return preferred.fields;
}

function buildDedupKey(
  eventType: EmailEventType,
  jobReference: string | null,
  customerEmail: string | null,
  customerName: string | null,
  moveDate: string | null,
  threadId: string,
  subject: string,
  parsedAt: Date | null
): string {
  const dateBucket = parsedAt
    ? parsedAt.toISOString().slice(0, 10)
    : "unknown";
  if (jobReference) return `${eventType}:ref:${jobReference}`;
  if (customerEmail) return `${eventType}:email:${customerEmail.toLowerCase()}`;
  if (customerName && moveDate) {
    return `${eventType}:name:${customerName.toLowerCase()}:${moveDate}`;
  }
  if (threadId) return `${eventType}:thread:${threadId}`;
  return `${eventType}:subject:${normalizeSubject(subject)}:${dateBucket}`;
}

function detectEventType(email: JarvisEmail): EmailEventType {
  const text = `${email.subject} ${email.snippet} ${email.body}`;

  if (isCmmLeadEmail(email)) return "cmm_lead";
  if (isDepositReceiptEmail(email)) return "deposit_receipt";
  if (isDepositInvoiceEmail(email)) return "deposit_invoice";
  if (isQuoteAcceptedEmail(email)) return "quote_acceptance";
  if (isMoveInvoiceEmail(email)) return "move_invoice";
  if (isSurveyBookingEmail(email)) return "survey_booking";
  if (/move completed|completed your move|thank you for choosing/i.test(text)) {
    return "move_completed";
  }
  if (
    /quotation|quote for your move|removal quote/i.test(text) &&
    email.account === "appointments" &&
    !/accepted|receipt|invoice/i.test(text)
  ) {
    return "quote_sent";
  }
  if (
    /^re:/i.test(email.subject) &&
    !/ryan|removals|appointments|noreply|compare|moveflow/i.test(
      `${email.from} ${email.subject}`.toLowerCase()
    )
  ) {
    return "customer_reply";
  }
  return "other";
}

export function detectEmailEvents(
  emails: JarvisEmail[]
): { events: EmailEvent[]; duplicateCount: number } {
  const events: EmailEvent[] = [];
  const seenKeys = new Set<string>();
  let duplicateCount = 0;

  for (const email of emails) {
    const eventType = detectEventType(email);
    if (eventType === "other" || eventType === "customer_reply") continue;

    const text = `${email.subject} ${email.snippet} ${email.body}`;
    const pdfFields = mergePdfFields(email.parsedPdfs ?? []);
    const parsedAt = parseEmailDate(email.date);

    const jobReference =
      extractJobReference(text) ?? pdfFields?.jobReference ?? null;
    const customerName =
      extractCmmLeadCustomer(email) ??
      pdfFields?.customerName ??
      extractCustomerNameFromSubject(email.subject) ??
      null;
    const customerEmail =
      extractCustomerEmail(text) ?? pdfFields?.customerEmail ?? null;
    const movingFromPostcode =
      extractPostcodeFromText(text) ?? pdfFields?.movingFromPostcode ?? null;
    const movingToPostcode = pdfFields?.movingToPostcode ?? null;
    const moveDate = pdfFields?.moveDate ?? null;

    const dedupKey = buildDedupKey(
      eventType,
      jobReference,
      customerEmail,
      customerName,
      moveDate,
      email.threadId,
      email.subject,
      parsedAt
    );

    const duplicateIgnored = seenKeys.has(dedupKey);
    if (duplicateIgnored) {
      duplicateCount += 1;
      continue;
    }
    seenKeys.add(dedupKey);

    const pdfSource =
      email.parsedPdfs?.find((p) => p.status === "success")?.filename ?? null;

    events.push({
      id: `${email.id}-${eventType}`,
      eventType,
      emailId: email.id,
      account: email.account,
      threadId: email.threadId,
      subject: email.subject,
      from: email.from,
      date: email.date,
      parsedAt,
      jobReference,
      customerName,
      customerEmail,
      movingFromPostcode,
      movingToPostcode,
      moveDate,
      quoteValue: pdfFields?.quoteValue ?? pdfFields?.totalValue ?? null,
      depositValue: pdfFields?.depositValue ?? null,
      totalValue: pdfFields?.totalValue ?? pdfFields?.quoteValue ?? null,
      pdfSource,
      duplicateIgnored: false,
      dedupKey,
    });
  }

  return { events, duplicateCount };
}

function extractCustomerNameFromSubject(subject: string): string | null {
  const depositInvoice = subject.match(
    /Deposit Invoice for Your Move\s*\|\s*RR-\d+\s*\|\s*(.+)$/i
  );
  if (depositInvoice?.[1]) return depositInvoice[1].trim();

  const quoteAccepted = subject.match(/Quotation Accepted/i);
  if (quoteAccepted) {
    const bodyMatch = subject.match(
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s+has accepted/i
    );
    if (bodyMatch?.[1]) return bodyMatch[1].trim();
  }

  return null;
}

export { extractPostcodeArea };

import type { JarvisEmail, PostcodeArea, CmmLeadRecord } from "./types";
import { JARVIS_CONFIG } from "./config";
import {
  extractPostcodeArea,
  extractPostcodeFromText,
  parseEmailDate,
} from "./extractors";
import { normalizePostcode } from "./pdf-parser";

const CMM_SUBJECT =
  /Removals lead from\s+(.+?)\s*\(comparemymove\.com\)/i;

function normalizePhone(raw: string): string {
  return raw.replace(/\s+/g, "").replace(/^\+44/, "0");
}

function extractField(text: string, labels: RegExp[]): string | null {
  for (const label of labels) {
    const match = text.match(
      new RegExp(`${label.source}[:\\s]*([^\\n<]{3,120})`, "i")
    );
    if (match?.[1]) return match[1].trim();
  }
  return null;
}

function extractEmail(text: string): string | null {
  const match = text.match(
    /(?:email|e-mail)[:\s]*([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/i
  );
  if (match?.[1] && !/comparemymove|ryanremovals/i.test(match[1])) {
    return match[1].toLowerCase();
  }
  const generic = text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi);
  if (!generic) return null;
  for (const e of generic) {
    if (!/comparemymove|ryanremovals|noreply/i.test(e)) return e.toLowerCase();
  }
  return null;
}

function extractPhone(text: string): string | null {
  const labeled = extractField(text, [/phone|mobile|tel|telephone|contact number/]);
  if (labeled) {
    const digits = labeled.replace(/[^\d+]/g, "");
    if (digits.length >= 10) return normalizePhone(digits);
  }
  const uk = text.match(/\b(?:0\d{10}|\+44\s?\d{10,11})\b/);
  return uk ? normalizePhone(uk[0]) : null;
}

function extractExternalLeadId(text: string): string | null {
  const match =
    text.match(/lead\s*(?:id|ref|reference)[:\s#]*([A-Z0-9-]{4,})/i) ??
    text.match(/reference[:\s#]*([A-Z0-9-]{4,})/i);
  return match?.[1]?.trim() ?? null;
}

function extractCollectionPostcode(text: string): string | null {
  const fromSection = extractField(text, [
    /collection(?:\s*address)?/,
    /moving from/,
    /from address/,
    /pick-?up/,
  ]);
  if (fromSection) {
    const pc = extractPostcodeFromText(fromSection);
    if (pc) return normalizePostcode(pc);
  }
  const all = [...text.matchAll(/\b([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})\b/gi)];
  if (all[0]) return normalizePostcode(all[0][0]);
  return null;
}

function extractDeliveryPostcode(text: string): string | null {
  const toSection = extractField(text, [
    /delivery(?:\s*address)?/,
    /moving to/,
    /to address/,
    /destination/,
  ]);
  if (toSection) {
    const pc = extractPostcodeFromText(toSection);
    if (pc) return normalizePostcode(pc);
  }
  const all = [...text.matchAll(/\b([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})\b/gi)];
  if (all[1]) return normalizePostcode(all[1][0]);
  return null;
}

function isCmmLabelLead(email: JarvisEmail): boolean {
  return email.labels.some((l) =>
    l.toLowerCase().includes(JARVIS_CONFIG.cmmLeadLabel.toLowerCase())
  );
}

export function parseCmmLeadEmail(
  email: JarvisEmail,
  leadCost: number
): CmmLeadRecord | null {
  if (email.account !== "main") return null;
  if (!isCmmLabelLead(email)) return null;

  const text = `${email.subject} ${email.snippet} ${email.body}`;
  if (!/compare\s*my\s*move|comparemymove|new residential lead/i.test(text)) {
    return null;
  }

  const subjectMatch = email.subject.match(CMM_SUBJECT);
  const customerName = subjectMatch?.[1]?.trim() ?? null;
  const receivedAt = email.date || new Date().toISOString();
  const parsedDate = parseEmailDate(email.date);
  const receivedDateKey = parsedDate
    ? parsedDate.toISOString().slice(0, 10)
    : receivedAt.slice(0, 10);

  const collectionPostcode = extractCollectionPostcode(text);
  const collectionArea = extractPostcodeArea(collectionPostcode);
  const deliveryPostcode = extractDeliveryPostcode(text);

  let needsReview: string | null = null;
  if (!customerName) needsReview = "Customer name not found in subject";
  else if (!collectionPostcode) needsReview = "Collection postcode unknown";

  const confidence = needsReview ? 0.6 : collectionPostcode ? 0.9 : 0.75;

  return {
    lead_id: email.id,
    gmail_message_id: email.id,
    gmail_thread_id: email.threadId,
    received_at: receivedAt,
    received_date_key: receivedDateKey,
    customer_name: customerName,
    customer_email: extractEmail(text),
    customer_phone: extractPhone(text),
    collection_address: extractField(text, [/collection(?:\s*address)?/, /moving from/]),
    collection_postcode: collectionPostcode,
    collection_postcode_area: collectionArea,
    delivery_address: extractField(text, [/delivery(?:\s*address)?/, /moving to/]),
    delivery_postcode: deliveryPostcode,
    move_date: extractField(text, [/move date/, /moving date/, /removal date/]),
    property_size: extractField(text, [/property size/, /bedrooms/, /bedroom/]),
    external_lead_id: extractExternalLeadId(text),
    lead_source: "Compare My Move",
    lead_cost: leadCost,
    raw_subject: email.subject,
    raw_snippet: email.snippet,
    confidence_score: confidence,
    needs_review_reason: needsReview,
  };
}

export function dedupeCmmLeads(leads: CmmLeadRecord[]): {
  unique: CmmLeadRecord[];
  duplicatesSkipped: number;
} {
  const unique: CmmLeadRecord[] = [];
  const seenMessageIds = new Set<string>();
  const seenExternalIds = new Set<string>();
  const seenEmailDate = new Set<string>();
  const seenPhoneDate = new Set<string>();
  const seenNamePostcodeDate = new Set<string>();
  let duplicatesSkipped = 0;

  for (const lead of leads) {
    if (seenMessageIds.has(lead.gmail_message_id)) {
      duplicatesSkipped += 1;
      continue;
    }

    if (lead.external_lead_id) {
      const key = lead.external_lead_id.toLowerCase();
      if (seenExternalIds.has(key)) {
        duplicatesSkipped += 1;
        continue;
      }
      seenExternalIds.add(key);
    }

    if (lead.customer_email) {
      const key = `${lead.customer_email.toLowerCase()}|${lead.received_date_key}`;
      if (seenEmailDate.has(key)) {
        duplicatesSkipped += 1;
        continue;
      }
      seenEmailDate.add(key);
    }

    if (lead.customer_phone) {
      const key = `${lead.customer_phone}|${lead.received_date_key}`;
      if (seenPhoneDate.has(key)) {
        duplicatesSkipped += 1;
        continue;
      }
      seenPhoneDate.add(key);
    }

    if (lead.customer_name && lead.collection_postcode) {
      const key = `${lead.customer_name.toLowerCase()}|${lead.collection_postcode}|${lead.received_date_key}`;
      if (seenNamePostcodeDate.has(key)) {
        duplicatesSkipped += 1;
        continue;
      }
      seenNamePostcodeDate.add(key);
    }

    seenMessageIds.add(lead.gmail_message_id);
    unique.push(lead);
  }

  return { unique, duplicatesSkipped };
}

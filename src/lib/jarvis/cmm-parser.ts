import type { JarvisEmail, PostcodeArea, CmmLeadRecord } from "./types";
import { JARVIS_CONFIG } from "./config";
import { extractPostcodeArea, parseEmailDate } from "./extractors";
import { normalizePostcode } from "./pdf-parser";

const CMM_SUBJECT =
  /Removals lead from\s+(.+?)\s*\(comparemymove\.com\)/i;

const UK_POSTCODE =
  /\b([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})\b/i;

const SECTION_HEADERS = [
  "Contact Details",
  "Moving Date",
  "Current Address",
  "New Address",
  "Additional Services",
  "Additional information",
] as const;

function normalizePhone(raw: string): string {
  return raw.replace(/\s+/g, "").replace(/^\+44/, "0");
}

function isEmailLine(line: string): boolean {
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(line);
}

function isPhoneLine(line: string): boolean {
  const digits = line.replace(/[^\d+]/g, "");
  return digits.length >= 10;
}

function parsePostcodeFromLine(line: string): string | null {
  const compact = line.replace(/\s+/g, "").toUpperCase();
  const match = compact.match(/^([A-Z]{1,2}\d{1,2}[A-Z]?)(\d[A-Z]{2})$/);
  if (match) return normalizePostcode(`${match[1]} ${match[2]}`);
  const spaced = line.match(UK_POSTCODE);
  return spaced ? normalizePostcode(spaced[1]) : null;
}

function parseMovingDate(raw: string): string | null {
  const cleaned = raw
    .replace(/(\d+)(st|nd|rd|th)/gi, "$1")
    .replace(/\s+/g, " ")
    .trim();

  const ukMatch = cleaned.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (ukMatch) {
    const day = Number(ukMatch[1]);
    const monthName = ukMatch[2].toLowerCase();
    const year = Number(ukMatch[3]);
    const months: Record<string, number> = {
      january: 0,
      february: 1,
      march: 2,
      april: 3,
      may: 4,
      june: 5,
      july: 6,
      august: 7,
      september: 8,
      october: 9,
      november: 10,
      december: 11,
    };
    const month = months[monthName];
    if (month == null) return null;
    const y = String(year);
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  const parsed = new Date(cleaned);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

function parseFlexible(text: string): boolean | null {
  const match = text.match(/flexible:\s*(yes|no)/i);
  if (!match) return null;
  return match[1].toLowerCase() === "yes";
}

function splitSections(text: string): Map<string, string[]> {
  const sections = new Map<string, string[]>();
  let current: string | null = null;

  for (const rawLine of text.replace(/\r/g, "").split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    const cmmIdMatch = line.match(/^CMM internal ID:\s*(.+)$/i);
    if (cmmIdMatch) {
      sections.set("CMM internal ID", [cmmIdMatch[1].trim()]);
      current = null;
      continue;
    }

    const header = SECTION_HEADERS.find(
      (h) => line.toLowerCase() === h.toLowerCase()
    );
    if (header) {
      current = header;
      sections.set(current, []);
      continue;
    }

    if (current) {
      sections.get(current)!.push(line);
    }
  }

  return sections;
}

function parseAddressSection(lines: string[]): {
  address: string | null;
  postcode: string | null;
  bedrooms: number | null;
  homeType: string | null;
} {
  const addressLines: string[] = [];
  let bedrooms: number | null = null;
  let homeType: string | null = null;
  let postcode: string | null = null;

  for (const line of lines) {
    const bedroomMatch = line.match(/^Bedrooms:\s*(\d+)/i);
    if (bedroomMatch) {
      bedrooms = Number(bedroomMatch[1]);
      continue;
    }
    const homeMatch = line.match(/^Home Type:\s*(.+)$/i);
    if (homeMatch) {
      homeType = homeMatch[1].trim();
      continue;
    }
    const pc = parsePostcodeFromLine(line);
    if (pc) {
      postcode = pc;
      continue;
    }
    addressLines.push(line);
  }

  return {
    address: addressLines.length ? addressLines.join(", ") : null,
    postcode,
    bedrooms,
    homeType,
  };
}

function parseContactSection(lines: string[]): {
  name: string | null;
  phone: string | null;
  email: string | null;
} {
  let name: string | null = null;
  let phone: string | null = null;
  let email: string | null = null;

  for (const line of lines) {
    if (!email && isEmailLine(line)) {
      email = line.toLowerCase();
      continue;
    }
    if (!phone && isPhoneLine(line)) {
      phone = normalizePhone(line);
      continue;
    }
    if (!name && !isEmailLine(line) && !isPhoneLine(line)) {
      name = line;
    }
  }

  return { name, phone, email };
}

export type CmmParseResult = {
  lead: CmmLeadRecord | null;
  failureReason: string | null;
};

export function parseCmmLeadText(
  text: string,
  meta: {
    gmailMessageId: string;
    gmailThreadId: string;
    subject: string;
    snippet: string;
    receivedAt: string;
    leadCost: number;
  }
): CmmParseResult {
  if (!/comparemymove|compare\s*my\s*move|contact details/i.test(text)) {
    return { lead: null, failureReason: "Not a Compare My Move lead format" };
  }

  const sections = splitSections(text);
  const contact = parseContactSection(sections.get("Contact Details") ?? []);
  const movingLines = sections.get("Moving Date") ?? [];
  const movingDateRaw = movingLines.find((l) => !/^flexible:/i.test(l)) ?? null;
  const flexible = parseFlexible(movingLines.join(" ") + " " + text);

  const current = parseAddressSection(sections.get("Current Address") ?? []);
  const newAddr = parseAddressSection(sections.get("New Address") ?? []);

  const additionalServices =
    (sections.get("Additional Services") ?? []).join(", ") || null;
  const additionalInfo =
    (sections.get("Additional information") ?? []).join(", ") || null;

  const cmmInternalId =
    (sections.get("CMM internal ID") ?? [])[0]?.trim() ?? null;

  const otherCompaniesMatch = text.match(
    /gone to\s+(\d+)\s+other companies/i
  );
  const numberOfOtherCompanies = otherCompaniesMatch
    ? Number(otherCompaniesMatch[1])
    : null;

  const subjectMatch = meta.subject.match(CMM_SUBJECT);
  const customerName = contact.name ?? subjectMatch?.[1]?.trim() ?? null;
  const movingDate = movingDateRaw ? parseMovingDate(movingDateRaw) : null;

  const currentPostcode = current.postcode;
  const currentArea = extractPostcodeArea(currentPostcode);

  let needsReview: string | null = null;
  if (!customerName) needsReview = "Customer name not found";
  else if (!currentPostcode) needsReview = "Current/collection postcode unknown";

  const propertySize =
    current.bedrooms != null
      ? `${current.bedrooms} bed${current.bedrooms === 1 ? "" : "s"}${current.homeType ? ` ${current.homeType}` : ""}`
      : current.homeType;

  const parsedDate = parseEmailDate(meta.receivedAt);
  const receivedDateKey = parsedDate
    ? parsedDate.toISOString().slice(0, 10)
    : meta.receivedAt.slice(0, 10);

  const confidence = needsReview ? 0.65 : currentPostcode ? 0.92 : 0.75;

  return {
    lead: {
      lead_id: meta.gmailMessageId,
      gmail_message_id: meta.gmailMessageId,
      gmail_thread_id: meta.gmailThreadId,
      received_at: meta.receivedAt,
      received_date_key: receivedDateKey,
      customer_name: customerName,
      customer_email: contact.email,
      customer_phone: contact.phone,
      flexible,
      current_address: current.address,
      current_postcode: currentPostcode,
      current_area_prefix: currentArea,
      bedrooms: current.bedrooms,
      home_type: current.homeType,
      new_address: newAddr.address,
      new_postcode: newAddr.postcode,
      additional_services: additionalServices,
      additional_information: additionalInfo,
      number_of_other_companies: numberOfOtherCompanies,
      cmm_internal_id: cmmInternalId,
      collection_address: current.address,
      collection_postcode: currentPostcode,
      collection_postcode_area: currentArea,
      delivery_address: newAddr.address,
      delivery_postcode: newAddr.postcode,
      move_date: movingDate ?? movingDateRaw,
      property_size: propertySize,
      external_lead_id: cmmInternalId,
      lead_source: "Compare My Move",
      lead_cost: meta.leadCost,
      raw_subject: meta.subject,
      raw_snippet: meta.snippet,
      confidence_score: confidence,
      needs_review_reason: needsReview,
    },
    failureReason: null,
  };
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

  const text = `${email.subject}\n${email.body || email.snippet}`;
  const result = parseCmmLeadText(text, {
    gmailMessageId: email.id,
    gmailThreadId: email.threadId,
    subject: email.subject,
    snippet: email.snippet,
    receivedAt: email.date || new Date().toISOString(),
    leadCost,
  });

  if (result.lead) return result.lead;

  if (!isCmmLabelLead(email)) return null;
  if (!/compare\s*my\s*move|comparemymove/i.test(text)) return null;

  return null;
}

export function parseCmmLeadEmailWithReason(
  email: JarvisEmail,
  leadCost: number
): CmmParseResult {
  if (email.account !== "main") {
    return { lead: null, failureReason: "Not main Gmail account" };
  }

  const text = `${email.subject}\n${email.body || email.snippet}`;
  const result = parseCmmLeadText(text, {
    gmailMessageId: email.id,
    gmailThreadId: email.threadId,
    subject: email.subject,
    snippet: email.snippet,
    receivedAt: email.date || new Date().toISOString(),
    leadCost,
  });

  if (result.lead) return result;

  if (!isCmmLabelLead(email) && !/comparemymove/i.test(text)) {
    return { lead: null, failureReason: "Missing CMM label and comparemymove markers" };
  }

  return {
    lead: null,
    failureReason: result.failureReason ?? "Parser could not extract lead fields",
  };
}

export function dedupeCmmLeads(leads: CmmLeadRecord[]): {
  unique: CmmLeadRecord[];
  duplicatesSkipped: number;
} {
  const unique: CmmLeadRecord[] = [];
  const seenInternalIds = new Set<string>();
  const seenMessageIds = new Set<string>();
  let duplicatesSkipped = 0;

  for (const lead of leads) {
    const internalId = lead.cmm_internal_id?.toLowerCase();
    if (internalId) {
      if (seenInternalIds.has(internalId)) {
        duplicatesSkipped += 1;
        continue;
      }
      seenInternalIds.add(internalId);
    }

    if (seenMessageIds.has(lead.gmail_message_id)) {
      duplicatesSkipped += 1;
      continue;
    }

    seenMessageIds.add(lead.gmail_message_id);
    unique.push(lead);
  }

  return { unique, duplicatesSkipped };
}

/** Sample body test helper */
export function parseCmmSampleLead(leadCost = 10.95): CmmLeadRecord | null {
  const sample = `Removals lead from Carl (comparemymove.com)
Contact Details
Carl Hancock
07813648470
yabasto@yahoo.co.uk
Moving Date
27th July 2026
Flexible: Yes
Current Address
2 Downer Meadow
GODALMING
GU73SY
Bedrooms: 3
Home Type: House
New Address
Liscombe Farmhouse
DULVERTON
TA229QA
Additional Services
N/A
Additional information
N/A
This lead has gone to 4 other companies in your area.
CMM internal ID: CAR-1781959748`;

  return parseCmmLeadText(sample, {
    gmailMessageId: "sample-id",
    gmailThreadId: "sample-thread",
    subject: "Removals lead from Carl (comparemymove.com)",
    snippet: "",
    receivedAt: new Date().toISOString(),
    leadCost,
  }).lead;
}

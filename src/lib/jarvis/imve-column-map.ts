import { extractJobReference } from "./extractors";
import { normalizeColumnKey } from "./imve-parse";
import type { ImveFileType } from "./imve-types";

export type ImveMappedField =
  | "customer_name"
  | "customer_email"
  | "customer_phone"
  | "collection_postcode"
  | "delivery_postcode"
  | "move_date"
  | "job_creation_date"
  | "job_status"
  | "booking_status"
  | "quote_value"
  | "total_amount"
  | "invoice_amount"
  | "invoice_total"
  | "invoice_number"
  | "invoice_status"
  | "deposit_amount"
  | "deposit_invoice_number"
  | "deposit_status"
  | "deposit_paid_at"
  | "job_reference"
  | "quote_reference"
  | "invoice_reference"
  | "lead_source"
  | "imve_id";

/** User-facing labels for the import debug panel */
export const IMVE_DEBUG_FIELD_LABELS: Record<string, ImveMappedField | "status"> = {
  job_reference: "job_reference",
  customer_name: "customer_name",
  email: "customer_email",
  phone: "customer_phone",
  collection_postcode: "collection_postcode",
  delivery_postcode: "delivery_postcode",
  move_date: "move_date",
  status: "job_status",
  quote_value: "quote_value",
  deposit_amount: "deposit_amount",
  invoice_total: "invoice_total",
  deposit_paid_date: "deposit_paid_at",
};

const EXACT_BY_FILE_TYPE: Partial<
  Record<ImveFileType, Partial<Record<ImveMappedField, string[]>>>
> = {
  jobs: {
    job_reference: ["Job Number"],
    customer_name: ["Client Name"],
    customer_email: ["Email"],
    customer_phone: ["Phone"],
    lead_source: ["Job Source"],
    job_status: ["Job Status"],
    job_creation_date: ["Job Creation Date"],
    move_date: ["Job Move Start Date"],
    collection_postcode: ["Job Move From Postcode"],
    delivery_postcode: ["Job Move To Postcode"],
    deposit_invoice_number: ["Deposit Invoice Number"],
    deposit_amount: ["Deposit Amount"],
    deposit_status: ["Deposit Status"],
    invoice_number: ["Invoice Number"],
    invoice_amount: ["Invoice Amount"],
    total_amount: ["Total Amount"],
    invoice_status: ["Invoice Status"],
    invoice_total: ["Invoice Amount", "Total Amount"],
    quote_value: ["Total Amount"],
  },
  deposit_invoices: {
    invoice_total: ["Total"],
    deposit_amount: ["Deposit Amount", "Total"],
    job_status: ["Status"],
    deposit_paid_at: ["Created Date"],
    customer_name: ["Client Name"],
    customer_email: ["Email"],
    customer_phone: ["Phone"],
    job_reference: ["Job Number"],
    invoice_reference: ["Invoice Number", "Number"],
  },
  job_invoices: {
    invoice_total: ["Total"],
    quote_value: ["Total"],
    job_status: ["Status"],
    deposit_paid_at: ["Created Date"],
    customer_name: ["Client Name"],
    customer_email: ["Email"],
    customer_phone: ["Phone"],
    job_reference: ["Job Number"],
    invoice_reference: ["Invoice Number", "Number"],
  },
  custom_invoices: {
    invoice_total: ["Total"],
    quote_value: ["Total"],
    job_status: ["Status"],
    deposit_paid_at: ["Created Date"],
    customer_name: ["Client Name"],
    customer_email: ["Email"],
    customer_phone: ["Phone"],
    job_reference: ["Job Number"],
    invoice_reference: ["Invoice Number", "Number"],
  },
};

const BLOCKED_COLUMN_FOR_FIELD: Partial<
  Record<ImveMappedField, RegExp[]>
> = {
  quote_value: [/job\s*name/i, /vat/i],
  deposit_paid_at: [/job\s*move\s*start/i, /move\s*start/i],
  move_date: [/job\s*creation/i, /^created$/i],
  deposit_amount: [/deposit\s*value$/i],
};

function applyExactMappings(
  columns: string[],
  fileType: ImveFileType,
  used: Set<string>
): Record<ImveMappedField, string | null> {
  const mapping = {} as Record<ImveMappedField, string | null>;
  for (const field of Object.keys(FIELD_RULES) as ImveMappedField[]) {
    mapping[field] = null;
  }

  const exact = EXACT_BY_FILE_TYPE[fileType];
  if (!exact) return mapping;

  const columnLookup = new Map(
    columns.map((c) => [c.trim().toLowerCase(), c])
  );

  for (const [field, headers] of Object.entries(exact) as Array<
    [ImveMappedField, string[]]
  >) {
    if (mapping[field]) continue;
    for (const header of headers) {
      const col = columnLookup.get(header.toLowerCase());
      if (!col || used.has(col)) continue;
      const blocked = BLOCKED_COLUMN_FOR_FIELD[field];
      if (blocked?.some((re) => re.test(col))) continue;
      mapping[field] = col;
      used.add(col);
      break;
    }
  }

  if (fileType === "jobs") {
    const moveStart = columnLookup.get("job move start date");
    const jobCreation = columnLookup.get("job creation date");
    if (moveStart && !mapping.move_date) {
      mapping.move_date = moveStart;
      used.add(moveStart);
    } else if (!mapping.move_date && jobCreation && !moveStart) {
      mapping.move_date = jobCreation;
      used.add(jobCreation);
    }
  }

  return mapping;
}

export function validateColumnMapping(
  mapping: Record<ImveMappedField, string | null>,
  fileType: ImveFileType,
  columns: string[],
  sampleRows: Record<string, string>[] = []
): string[] {
  const warnings: string[] = [];
  const moveStartExists = columns.some(
    (c) => c.trim().toLowerCase() === "job move start date"
  );

  for (const [field, column] of Object.entries(mapping) as Array<
    [ImveMappedField, string | null]
  >) {
    if (!column) continue;
    const blocked = BLOCKED_COLUMN_FOR_FIELD[field];
    if (blocked?.some((re) => re.test(column))) {
      warnings.push(`${field} mapped to suspicious column "${column}"`);
    }
    if (field === "move_date" && /job\s*creation/i.test(column) && moveStartExists) {
      warnings.push(
        `move_date mapped to "${column}" but Job Move Start Date exists — check mapping`
      );
    }
    if (field === "quote_value" && /job\s*name/i.test(column)) {
      warnings.push(`quote_value mapped to Job Name — this is incorrect`);
    }
    if (field === "quote_value" && /vat/i.test(column)) {
      warnings.push(`quote_value mapped to VAT column — use Total instead`);
    }
    if (field === "deposit_amount" && /deposit\s*value$/i.test(column)) {
      warnings.push(
        `deposit_amount mapped to Deposit Value (percentage) — use Deposit Amount or Total`
      );
    }
  }

  const totalCol = mapping.invoice_total;
  if (totalCol && sampleRows.length > 0) {
    const bad = sampleRows
      .map((r) => r[totalCol]?.trim())
      .filter((v) => v && /^no$/i.test(v));
    if (bad.length > 0) {
      warnings.push(
        `invoice_total column "${totalCol}" contains non-numeric values like "No"`
      );
    }
  }

  if (fileType === "unknown") {
    warnings.push("file type unknown — exact i-MVE column map not applied");
  }

  return warnings;
}

const FIELD_RULES: Record<
  ImveMappedField,
  { keys: string[]; patterns: RegExp[] }
> = {
  customer_name: {
    keys: [
      "customer_name",
      "client_name",
      "contact_name",
      "customer",
      "client",
      "name",
      "full_name",
      "contact",
      "account_name",
    ],
    patterns: [
      /customer/i,
      /client/i,
      /contact.*name/i,
      /^name$/i,
      /full_name/i,
      /account.*name/i,
    ],
  },
  customer_email: {
    keys: [
      "customer_email",
      "email",
      "email_address",
      "contact_email",
      "e_mail",
      "client_email",
    ],
    patterns: [/e.?mail/i, /email/i],
  },
  customer_phone: {
    keys: [
      "customer_phone",
      "phone",
      "telephone",
      "mobile",
      "tel",
      "contact_phone",
      "phone_number",
      "mobile_number",
      "daytime_phone",
      "contact_number",
    ],
    patterns: [/phone/i, /mobile/i, /tel/i, /contact.*number/i],
  },
  collection_postcode: {
    keys: [
      "from_postcode",
      "collection_postcode",
      "origin_postcode",
      "moving_from_postcode",
      "pickup_postcode",
      "collection_post_code",
      "from_post_code",
      "moving_from",
      "from_address_postcode",
      "collection",
    ],
    patterns: [
      /from.*post/i,
      /collection.*post/i,
      /origin.*post/i,
      /pickup.*post/i,
      /moving.*from/i,
      /collect/i,
    ],
  },
  delivery_postcode: {
    keys: [
      "to_postcode",
      "delivery_postcode",
      "destination_postcode",
      "moving_to_postcode",
      "delivery_post_code",
      "moving_to",
      "to_address_postcode",
      "delivery",
    ],
    patterns: [/to.*post/i, /delivery.*post/i, /destination.*post/i, /moving.*to/i],
  },
  move_date: {
    keys: [
      "move_date",
      "moving_date",
      "job_move_date",
      "date_of_move",
      "move_day",
      "job_date",
      "removal_date",
      "date",
    ],
    patterns: [/move.*date/i, /moving.*date/i, /job.*date/i, /removal.*date/i],
  },
  job_creation_date: {
    keys: ["job_creation_date", "created_date", "creation_date", "date_created"],
    patterns: [/job.*creation/i, /creation.*date/i, /created.*date/i],
  },
  job_status: {
    keys: ["status", "job_status", "current_status", "state", "job_state"],
    patterns: [/job.*status/i, /^status$/i, /current_status/i, /job_state/i],
  },
  booking_status: {
    keys: ["booking_status", "booked", "booking_state", "confirmed"],
    patterns: [/booking/i, /booked/i, /confirmed/i],
  },
  quote_value: {
    keys: [
      "quote_value",
      "quote_total",
      "total_quote",
      "quote_amount",
      "quoted_amount",
      "job_total",
      "quoted_price",
      "estimate",
    ],
    patterns: [/quote/i, /quoted/i, /estimate/i],
  },
  total_amount: {
    keys: ["total_amount", "job_total", "grand_total", "move_total"],
    patterns: [/total\s*amount/i, /^total$/i, /grand.*total/i],
  },
  invoice_amount: {
    keys: ["invoice_amount", "invoice_value", "billed_amount"],
    patterns: [/invoice.*amount/i, /invoice.*value/i],
  },
  invoice_total: {
    keys: [
      "invoice_total",
      "total",
      "amount",
      "gross_total",
      "net_total",
      "invoice_amount",
      "total_amount",
      "value",
      "price",
      "job_value",
    ],
    patterns: [
      /invoice.*total/i,
      /gross/i,
      /net/i,
      /total/i,
      /amount/i,
      /value/i,
      /price/i,
    ],
  },
  invoice_number: {
    keys: ["invoice_number", "invoice_no", "invoice_id"],
    patterns: [/invoice.*number/i, /invoice.*no/i, /^invoice$/i],
  },
  invoice_status: {
    keys: ["invoice_status", "invoice_state"],
    patterns: [/invoice.*status/i],
  },
  deposit_amount: {
    keys: [
      "deposit_amount",
      "deposit",
      "deposit_total",
      "amount_paid",
      "deposit_value",
      "deposit_paid_amount",
    ],
    patterns: [/deposit/i, /amount_paid/i],
  },
  deposit_invoice_number: {
    keys: ["deposit_invoice_number", "deposit_invoice_no", "deposit_inv_number"],
    patterns: [/deposit.*invoice.*number/i, /deposit.*invoice.*no/i],
  },
  deposit_status: {
    keys: ["deposit_status", "deposit_state"],
    patterns: [/deposit.*status/i],
  },
  deposit_paid_at: {
    keys: [
      "deposit_paid_at",
      "paid_date",
      "payment_date",
      "date_paid",
      "paid_on",
      "payment_received_date",
      "invoice_date",
      "date",
      "created_at",
      "issued_date",
    ],
    patterns: [
      /paid.*date/i,
      /payment.*date/i,
      /date.*paid/i,
      /invoice.*date/i,
      /^date$/i,
      /created/i,
      /issued/i,
    ],
  },
  job_reference: {
    keys: [
      "job_reference",
      "reference",
      "job_ref",
      "rr_reference",
      "job_reference_number",
      "ref",
      "our_reference",
      "job_number",
      "job_no",
      "your_reference",
      "customer_reference",
    ],
    patterns: [/job.*ref/i, /^ref/i, /reference/i, /job.*no/i, /rr/i],
  },
  quote_reference: {
    keys: ["quote_reference", "quote_ref", "quotation_reference", "quote_number"],
    patterns: [/quote.*ref/i, /quotation/i],
  },
  invoice_reference: {
    keys: [
      "invoice_reference",
      "invoice_id",
      "invoice_number",
      "invoice_no",
      "number",
      "invoice",
    ],
    patterns: [/invoice.*ref/i, /invoice.*no/i, /invoice.*id/i, /invoice.*number/i],
  },
  lead_source: {
    keys: [
      "lead_source",
      "source",
      "job_source",
      "referral_source",
      "how_did_you_hear",
      "enquiry_source",
      "marketing_source",
    ],
    patterns: [/lead.*source/i, /^source$/i, /referral/i, /how.*hear/i, /enquiry/i],
  },
  imve_id: {
    keys: ["id", "job_id", "jobid", "record_id", "imve_id", "job"],
    patterns: [/^id$/i, /job_id/i, /record_id/i],
  },
};

const UK_POSTCODE = /\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/i;
const EMAIL = /@/;
const PHONE = /^\+?[\d\s().-]{10,}$/;
const MONEY = /£|^\d+(\.\d{2})?$/;
const RR_REF = /\bRR\d+/i;

function scoreColumn(column: string, field: ImveMappedField): number {
  const blocked = BLOCKED_COLUMN_FOR_FIELD[field];
  if (blocked?.some((re) => re.test(column))) return 0;

  const key = normalizeColumnKey(column);
  const rules = FIELD_RULES[field];
  if (rules.keys.includes(key)) return 100;
  for (const pattern of rules.patterns) {
    if (pattern.test(column) || pattern.test(key)) return 70;
  }
  const tokens = key.split("_").filter(Boolean);
  for (const token of tokens) {
    if (rules.keys.some((k) => k.includes(token) || token.includes(k))) return 55;
  }
  return 0;
}

function inferFieldFromValues(
  values: string[],
  column: string
): { field: ImveMappedField; score: number } | null {
  const sample = values.filter((v) => v?.trim()).slice(0, 25);
  if (sample.length === 0) return null;

  const ratio = (pred: (v: string) => boolean) =>
    sample.filter(pred).length / sample.length;

  if (ratio((v) => EMAIL.test(v)) >= 0.7) {
    return { field: "customer_email", score: 90 };
  }
  if (ratio((v) => PHONE.test(v.replace(/\s/g, ""))) >= 0.6) {
    return { field: "customer_phone", score: 85 };
  }
  if (ratio((v) => UK_POSTCODE.test(v)) >= 0.5) {
    const key = normalizeColumnKey(column);
    if (/to|deliver|dest/i.test(column) || /to|deliver|dest/.test(key)) {
      return { field: "delivery_postcode", score: 80 };
    }
    return { field: "collection_postcode", score: 80 };
  }
  if (ratio((v) => RR_REF.test(v) || extractJobReference(v) != null) >= 0.4) {
    return { field: "job_reference", score: 85 };
  }
  if (ratio((v) => MONEY.test(v) || /^\d+(\.\d{1,2})?$/.test(v.replace(/[£,\s]/g, ""))) >= 0.5) {
    if (/deposit/i.test(column)) return { field: "deposit_amount", score: 80 };
    if (/quote/i.test(column)) return { field: "quote_value", score: 75 };
    return { field: "invoice_total", score: 70 };
  }
  if (
    ratio((v) => {
      const d = new Date(v);
      return !Number.isNaN(d.getTime()) && v.length >= 8;
    }) >= 0.6
  ) {
    if (/paid|payment/i.test(column)) return { field: "deposit_paid_at", score: 80 };
    if (/move|removal/i.test(column)) return { field: "move_date", score: 80 };
    return { field: "move_date", score: 65 };
  }

  return null;
}

export function resolveColumnMapping(
  columns: string[],
  sampleRows: Record<string, string>[] = [],
  fileType: ImveFileType = "unknown"
): Record<ImveMappedField, string | null> {
  const mapping = {} as Record<ImveMappedField, string | null>;
  const scores = {} as Record<ImveMappedField, number>;
  const used = new Set<string>();

  for (const field of Object.keys(FIELD_RULES) as ImveMappedField[]) {
    mapping[field] = null;
    scores[field] = 0;
  }

  const exact = applyExactMappings(columns, fileType, used);
  for (const field of Object.keys(FIELD_RULES) as ImveMappedField[]) {
    if (exact[field]) {
      mapping[field] = exact[field];
      scores[field] = 100;
    }
  }

  // Pass 1: header alias / pattern match (exclusive)
  for (const field of Object.keys(FIELD_RULES) as ImveMappedField[]) {
    if (mapping[field]) continue;
    let best: { column: string; score: number } | null = null;
    for (const column of columns) {
      if (used.has(column)) continue;
      const score = scoreColumn(column, field);
      if (!best || score > best.score) best = { column, score };
    }
    if (best && best.score >= 70) {
      mapping[field] = best.column;
      scores[field] = best.score;
      used.add(best.column);
    }
  }

  // Pass 2: lower-confidence header match for still-unmapped fields
  for (const field of Object.keys(FIELD_RULES) as ImveMappedField[]) {
    if (mapping[field]) continue;
    let best: { column: string; score: number } | null = null;
    for (const column of columns) {
      if (used.has(column)) continue;
      const score = scoreColumn(column, field);
      if (!best || score > best.score) best = { column, score };
    }
    if (best && best.score >= 45) {
      mapping[field] = best.column;
      scores[field] = best.score;
      used.add(best.column);
    }
  }

  // Pass 3: content-based inference from sample rows
  if (sampleRows.length > 0) {
    for (const column of columns) {
      if (used.has(column)) continue;
      const values = sampleRows.map((r) => r[column] ?? "");
      const inferred = inferFieldFromValues(values, column);
      if (!inferred) continue;
      if (mapping[inferred.field]) continue;
      mapping[inferred.field] = column;
      scores[inferred.field] = inferred.score;
      used.add(column);
    }
  }

  return mapping;
}

export function getColumnMappingScores(
  columns: string[],
  mapping: Record<ImveMappedField, string | null>
): Record<ImveMappedField, { column: string | null; score: number }> {
  const out = {} as Record<ImveMappedField, { column: string | null; score: number }>;
  for (const field of Object.keys(FIELD_RULES) as ImveMappedField[]) {
    const column = mapping[field];
    out[field] = {
      column,
      score: column ? scoreColumn(column, field) : 0,
    };
  }
  return out;
}

export function pickMappedField(
  row: Record<string, string>,
  mapping: Record<ImveMappedField, string | null>,
  field: ImveMappedField
): string | null {
  const column = mapping[field];
  if (column) {
    const value = row[column]?.trim();
    if (value) return value;
  }
  return pickFieldFromRowFallback(row, field, mapping);
}

function pickFieldFromRowFallback(
  row: Record<string, string>,
  field: ImveMappedField,
  mapping: Record<ImveMappedField, string | null>
): string | null {
  const usedColumns = new Set(
    Object.values(mapping).filter((c): c is string => Boolean(c))
  );

  for (const [column, raw] of Object.entries(row)) {
    if (usedColumns.has(column)) continue;
    const value = raw?.trim();
    if (!value) continue;

    if (field === "customer_email" && EMAIL.test(value)) return value;
    if (field === "customer_phone" && PHONE.test(value.replace(/\s/g, ""))) {
      return value;
    }
    if (
      (field === "collection_postcode" || field === "delivery_postcode") &&
      UK_POSTCODE.test(value)
    ) {
      return value;
    }
    if (
      (field === "job_reference" || field === "quote_reference") &&
      (RR_REF.test(value) || extractJobReference(value))
    ) {
      return value;
    }
    if (
      (field === "invoice_total" ||
        field === "quote_value" ||
        field === "deposit_amount") &&
      (MONEY.test(value) || /^\d+(\.\d{1,2})?$/.test(value.replace(/[£,\s]/g, "")))
    ) {
      return value;
    }
    if (field === "move_date" || field === "deposit_paid_at") {
      const d = new Date(value);
      if (!Number.isNaN(d.getTime()) && value.length >= 8) return value;
    }
    if (field === "customer_name" && value.length > 2 && !EMAIL.test(value) && !UK_POSTCODE.test(value)) {
      const key = normalizeColumnKey(column);
      if (/name|customer|client|contact/i.test(key) || /name|customer|client/i.test(column)) {
        return value;
      }
    }
  }

  return null;
}

export function extractJobReferenceFromRow(
  row: Record<string, string>,
  mapping: Record<ImveMappedField, string | null>
): string | null {
  const direct =
    pickMappedField(row, mapping, "job_reference") ??
    pickMappedField(row, mapping, "quote_reference");
  const fromDirect = direct
    ? (extractJobReference(direct) ?? direct.toUpperCase())
    : null;
  if (fromDirect) return fromDirect;

  for (const value of Object.values(row)) {
    const ref = extractJobReference(value ?? "");
    if (ref) return ref;
  }
  return null;
}

export function mappingSummary(
  mapping: Record<ImveMappedField, string | null>
): Record<string, string | null> {
  const out: Record<string, string | null> = {};
  for (const [label, field] of Object.entries(IMVE_DEBUG_FIELD_LABELS)) {
    if (field === "job_status") {
      out[label] = mapping.job_status ?? mapping.booking_status;
    } else {
      out[label] = mapping[field as ImveMappedField];
    }
  }
  return out;
}

const JOBS_REQUIRED_FOR_MATCHING: ImveMappedField[] = [
  "customer_email",
  "customer_phone",
  "job_reference",
  "customer_name",
  "collection_postcode",
];

const INVOICE_REQUIRED_FOR_LINKING: ImveMappedField[] = [
  "job_reference",
  "customer_email",
  "customer_phone",
  "invoice_reference",
  "deposit_amount",
  "invoice_total",
];

export function missingRequiredFields(
  fileType: ImveFileType,
  mapping: Record<ImveMappedField, string | null>,
  normalizedCount: number,
  usableCount?: number
): string[] {
  const missing: string[] = [];

  if (fileType === "unknown") {
    missing.push(
      "file_type — could not detect jobs vs invoices from filename/headers"
    );
    return missing;
  }

  if (normalizedCount === 0) {
    missing.push("normalized rows — file type unknown or zero raw rows parsed");
    return missing;
  }

  const required =
    fileType === "jobs"
      ? JOBS_REQUIRED_FOR_MATCHING
      : INVOICE_REQUIRED_FOR_LINKING;

  const unmapped = required.filter((f) => !mapping[f]);
  for (const field of unmapped) {
    const label =
      Object.entries(IMVE_DEBUG_FIELD_LABELS).find(([, v]) => v === field)?.[0] ??
      field;
    missing.push(`${label} — no CSV header mapped`);
  }

  if (usableCount === 0) {
    missing.push(
      "usable rows — headers mapped but no email/phone/ref/name+postcode values found in data (check column alignment)"
    );
  }

  return missing;
}

export function countUsableRows(
  rows: Record<string, string>[],
  mapping: Record<ImveMappedField, string | null>,
  fileType: ImveFileType
): number {
  if (fileType === "unknown") return 0;

  return rows.filter((row) => {
    const email = pickMappedField(row, mapping, "customer_email");
    const phone = pickMappedField(row, mapping, "customer_phone");
    const ref = extractJobReferenceFromRow(row, mapping);
    const name = pickMappedField(row, mapping, "customer_name");
    const pc = pickMappedField(row, mapping, "collection_postcode");
    const invRef = pickMappedField(row, mapping, "invoice_reference");
    const amount =
      pickMappedField(row, mapping, "deposit_amount") ??
      pickMappedField(row, mapping, "invoice_total");

    if (fileType === "jobs") {
      return Boolean(email || phone || ref || (name && pc));
    }
    return Boolean(ref || email || phone || (invRef && amount));
  }).length;
}

export function unmappedHeaders(
  columns: string[],
  mapping: Record<ImveMappedField, string | null>
): string[] {
  const mapped = new Set(Object.values(mapping).filter(Boolean));
  return columns.filter((c) => !mapped.has(c));
}

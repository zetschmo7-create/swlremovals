import { createHash } from "crypto";
import * as XLSX from "xlsx";
import type { ImveFileType } from "./imve-types";

export function hashFileContent(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

export function parseSpreadsheetBuffer(
  buffer: Buffer,
  filename: string
): { columns: string[]; rows: Record<string, string>[] } {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".csv") || lower.endsWith(".txt")) {
    return parseCsvBuffer(buffer);
  }

  const workbook = XLSX.read(buffer, { type: "buffer", raw: false });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return { columns: [], rows: [] };

  const sheet = workbook.Sheets[sheetName];
  const matrix = XLSX.utils.sheet_to_json<string[]>(sheet, {
    header: 1,
    defval: "",
    raw: false,
  }) as string[][];

  if (matrix.length === 0) return { columns: [], rows: [] };

  const headerRow = matrix[0].map((cell) => String(cell ?? "").trim());
  const columns = headerRow.filter(Boolean);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < matrix.length; i += 1) {
    const line = matrix[i];
    if (!line || line.every((cell) => !String(cell ?? "").trim())) continue;
    const row: Record<string, string> = {};
    for (let c = 0; c < headerRow.length; c += 1) {
      const key = headerRow[c];
      if (!key) continue;
      row[key] = String(line[c] ?? "").trim();
    }
    if (Object.values(row).some(Boolean)) rows.push(row);
  }

  return { columns: columns.length > 0 ? columns : headerRow, rows };
}

function parseCsvBuffer(buffer: Buffer): {
  columns: string[];
  rows: Record<string, string>[];
} {
  const text = buffer.toString("utf8").replace(/^\uFEFF/, "");
  const lines = splitCsvLines(text);
  if (lines.length === 0) return { columns: [], rows: [] };

  const header = parseCsvLine(lines[0]);
  const columns = header.map((h) => h.trim()).filter(Boolean);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i += 1) {
    const cells = parseCsvLine(lines[i]);
    if (cells.every((c) => !c.trim())) continue;
    const row: Record<string, string> = {};
    for (let c = 0; c < header.length; c += 1) {
      const key = header[c]?.trim();
      if (!key) continue;
      row[key] = (cells[c] ?? "").trim();
    }
    if (Object.values(row).some(Boolean)) rows.push(row);
  }

  return { columns: columns.length > 0 ? columns : header, rows };
}

function splitCsvLines(text: string): string[] {
  const lines: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      if (current.trim()) lines.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.trim()) lines.push(current);
  return lines;
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      cells.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  cells.push(current);
  return cells;
}

export function normalizeColumnKey(column: string): string {
  return column
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export function detectImveFileType(
  filename: string,
  columns: string[]
): ImveFileType {
  const fn = filename.toLowerCase().replace(/\.(csv|xlsx|xls|txt)$/i, "");

  if (fn.includes("custom-invoice") || fn.includes("job-custom-invoice")) {
    return "custom_invoices";
  }
  if (fn.includes("deposit-invoice") || fn.includes("job-deposit-invoice")) {
    return "deposit_invoices";
  }
  if (
    fn.includes("job-invoice") ||
    (fn.includes("invoice") && !fn.includes("deposit") && !fn.includes("custom"))
  ) {
    return "job_invoices";
  }
  if (fn.startsWith("jobs_") || /^jobs[-_]/.test(fn) || fn === "jobs") {
    return "jobs";
  }

  const keys = new Set(columns.map(normalizeColumnKey));
  const has = (...names: string[]) => names.some((n) => keys.has(n));

  if (
    has("move_date", "moving_date", "job_move_date") &&
    (has("from_postcode", "collection_postcode", "origin_postcode") ||
      has("customer_email", "email"))
  ) {
    return "jobs";
  }
  if (has("deposit_amount", "deposit_paid") && has("invoice_number", "invoice_id")) {
    return "deposit_invoices";
  }
  if (has("custom_invoice", "custom_amount")) return "custom_invoices";
  if (has("invoice_number", "invoice_id", "invoice_total", "total")) {
    return "job_invoices";
  }

  return "unknown";
}

export function pickField(
  row: Record<string, string>,
  aliases: string[]
): string | null {
  const normalized = Object.fromEntries(
    Object.entries(row).map(([k, v]) => [normalizeColumnKey(k), v])
  );
  for (const alias of aliases) {
    const value = normalized[alias]?.trim();
    if (value) return value;
  }
  return null;
}

export const IMVE_FIELD_ALIASES = {
  imveId: ["id", "job_id", "jobid", "record_id"],
  jobReference: [
    "job_reference",
    "reference",
    "job_ref",
    "rr_reference",
    "job_reference_number",
    "ref",
  ],
  customerName: [
    "customer_name",
    "customer",
    "client_name",
    "name",
    "contact_name",
  ],
  email: ["customer_email", "email", "email_address", "contact_email"],
  phone: ["customer_phone", "phone", "telephone", "mobile", "contact_phone"],
  moveDate: ["move_date", "moving_date", "job_move_date", "date_of_move"],
  fromPostcode: [
    "from_postcode",
    "collection_postcode",
    "origin_postcode",
    "moving_from_postcode",
    "pickup_postcode",
  ],
  toPostcode: [
    "to_postcode",
    "delivery_postcode",
    "destination_postcode",
    "moving_to_postcode",
  ],
  leadSource: ["lead_source", "source", "job_source", "referral_source"],
  status: ["status", "job_status", "booking_status"],
  quoteValue: [
    "quote_value",
    "quote_total",
    "total_quote",
    "job_total",
    "total",
    "amount",
    "invoice_total",
  ],
  depositAmount: ["deposit_amount", "deposit", "deposit_total", "amount_paid"],
  depositPaid: ["deposit_paid", "paid", "is_paid", "payment_received"],
  depositPaidAt: [
    "deposit_paid_at",
    "paid_date",
    "payment_date",
    "date_paid",
    "invoice_date",
  ],
  invoiceId: ["invoice_id", "invoice_number", "invoice_no", "number"],
  invoiceDate: ["invoice_date", "date", "created_at", "issued_date"],
  paid: ["paid", "is_paid", "payment_received", "status"],
  turnover: ["turnover", "move_value", "final_value", "invoice_total", "total"],
} as const;

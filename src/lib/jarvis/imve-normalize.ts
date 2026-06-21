import { extractPostcodeArea } from "./extractors";
import { normalizePhone } from "./cmm-match-scoring";
import {
  extractJobReferenceFromRow,
  pickMappedField,
  resolveColumnMapping,
  type ImveMappedField,
} from "./imve-column-map";
import { applyInvoicesToJobsWithLinking } from "./imve-invoice-link";
import type {
  ImveFileType,
  ImveInvoiceRecord,
  ImveJobRecord,
  ImveRawFileAudit,
} from "./imve-types";

function parseMoney(value: string | null): number | null {
  if (!value) return null;
  const cleaned = value.replace(/[£,\s]/g, "");
  const num = Number.parseFloat(cleaned);
  return Number.isFinite(num) ? num : null;
}

function parseBool(value: string | null): boolean {
  if (!value) return false;
  const v = value.toLowerCase();
  return (
    v === "true" ||
    v === "yes" ||
    v === "y" ||
    v === "1" ||
    v === "paid" ||
    v === "complete" ||
    v === "completed" ||
    v === "received"
  );
}

function parseDate(value: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value.slice(0, 10);
  return d.toISOString();
}

function jobIdFromRow(
  row: Record<string, string>,
  mapping: Record<ImveMappedField, string | null>,
  index: number
): string {
  const id = pickMappedField(row, mapping, "imve_id");
  const ref = extractJobReferenceFromRow(row, mapping);
  if (id) return id;
  if (ref) return ref;
  const email = pickMappedField(row, mapping, "customer_email");
  const move = pickMappedField(row, mapping, "move_date");
  return `row-${index}-${email ?? "unknown"}-${move ?? "nodate"}`;
}

export function normalizeImveJobs(
  rows: Record<string, string>[],
  fileHash: string,
  mapping: Record<ImveMappedField, string | null>
): ImveJobRecord[] {
  const now = new Date().toISOString();
  return rows.map((row, index) => {
    const jobRef = extractJobReferenceFromRow(row, mapping);
    const fromPostcode = pickMappedField(row, mapping, "collection_postcode");
    const status =
      pickMappedField(row, mapping, "job_status") ??
      pickMappedField(row, mapping, "booking_status");
    const bookingStatus = pickMappedField(row, mapping, "booking_status");
    const depositPaidField =
      pickMappedField(row, mapping, "deposit_paid_at") ??
      bookingStatus ??
      status;
    const depositPaid =
      parseBool(depositPaidField) ||
      /deposit.*paid|booked|confirmed|paid/i.test(status ?? "") ||
      /booked|confirmed/i.test(bookingStatus ?? "");

    const email =
      pickMappedField(row, mapping, "customer_email")?.toLowerCase() ?? null;
    const phoneRaw = pickMappedField(row, mapping, "customer_phone");

    return {
      imve_id: jobIdFromRow(row, mapping, index),
      job_reference: jobRef,
      customer_name: pickMappedField(row, mapping, "customer_name"),
      customer_email: email,
      customer_phone: phoneRaw ? (normalizePhone(phoneRaw) ?? phoneRaw) : null,
      move_date: parseDate(pickMappedField(row, mapping, "move_date")),
      from_postcode: fromPostcode,
      to_postcode: pickMappedField(row, mapping, "delivery_postcode"),
      from_area: extractPostcodeArea(fromPostcode),
      lead_source: pickMappedField(row, mapping, "lead_source"),
      status,
      quote_value: parseMoney(
        pickMappedField(row, mapping, "quote_value") ??
          pickMappedField(row, mapping, "invoice_total")
      ),
      booked:
        /booked|confirmed|deposit|paid|complete/i.test(status ?? "") ||
        /booked|confirmed/i.test(bookingStatus ?? "") ||
        depositPaid,
      deposit_paid: depositPaid,
      deposit_paid_at: depositPaid
        ? parseDate(pickMappedField(row, mapping, "deposit_paid_at"))
        : null,
      deposit_amount: parseMoney(pickMappedField(row, mapping, "deposit_amount")),
      turnover: parseMoney(pickMappedField(row, mapping, "invoice_total")),
      commission: null,
      source_file_hash: fileHash,
      updated_at: now,
    };
  });
}

function normalizeInvoice(
  rows: Record<string, string>[],
  fileHash: string,
  invoiceType: ImveInvoiceRecord["invoice_type"],
  mapping: Record<ImveMappedField, string | null>
): ImveInvoiceRecord[] {
  return rows.map((row, index) => {
    const jobRef = extractJobReferenceFromRow(row, mapping);
    const paidField =
      pickMappedField(row, mapping, "job_status") ??
      pickMappedField(row, mapping, "booking_status");
    const status = paidField;
    const paid =
      parseBool(paidField) ||
      /paid|complete|received/i.test(status ?? "") ||
      (invoiceType === "deposit" &&
        !/unpaid|outstanding|pending/i.test(status ?? ""));

    const amount =
      parseMoney(
        pickMappedField(row, mapping, "invoice_total") ??
          pickMappedField(row, mapping, "deposit_amount") ??
          pickMappedField(row, mapping, "quote_value")
      ) ?? parseMoney(pickMappedField(row, mapping, "deposit_amount"));

    const email =
      pickMappedField(row, mapping, "customer_email")?.toLowerCase() ?? null;
    const phoneRaw = pickMappedField(row, mapping, "customer_phone");

    return {
      invoice_id:
        pickMappedField(row, mapping, "invoice_reference") ??
        `${invoiceType}-${index}`,
      job_reference: jobRef,
      customer_name: pickMappedField(row, mapping, "customer_name"),
      customer_email: email,
      customer_phone: phoneRaw ? (normalizePhone(phoneRaw) ?? phoneRaw) : null,
      invoice_date: parseDate(
        pickMappedField(row, mapping, "deposit_paid_at") ??
          pickMappedField(row, mapping, "move_date")
      ),
      amount,
      paid: invoiceType === "deposit" ? paid || amount != null : paid,
      paid_at: paid
        ? parseDate(pickMappedField(row, mapping, "deposit_paid_at"))
        : null,
      invoice_type: invoiceType,
      source_file_hash: fileHash,
      raw: row,
    };
  });
}

export function normalizeImveFile(
  fileType: ImveFileType,
  filename: string,
  fileHash: string,
  columns: string[],
  rows: Record<string, string>[]
): {
  jobs: ImveJobRecord[];
  invoices: ImveInvoiceRecord[];
  raw: ImveRawFileAudit;
  warnings: string[];
  column_mapping: Record<ImveMappedField, string | null>;
} {
  const warnings: string[] = [];
  const column_mapping = resolveColumnMapping(columns, rows);

  const mappedCount = Object.values(column_mapping).filter(Boolean).length;
  if (mappedCount < 3 && rows.length > 0) {
    warnings.push(
      `Only ${mappedCount} columns mapped from headers: ${columns.join(", ")}`
    );
  }

  const raw: ImveRawFileAudit = {
    file_hash: fileHash,
    filename,
    file_type: fileType,
    imported_at: new Date().toISOString(),
    row_count: rows.length,
    columns,
    rows,
    column_mapping,
  };

  if (fileType === "unknown") {
    warnings.push(
      `Could not detect file type for "${filename}" — headers: ${columns.join(", ")}`
    );
    return {
      jobs: [],
      invoices: [],
      raw,
      warnings,
      column_mapping,
    };
  }

  if (fileType === "jobs") {
    return {
      jobs: normalizeImveJobs(rows, fileHash, column_mapping),
      invoices: [],
      raw,
      warnings,
      column_mapping,
    };
  }

  const invoiceType =
    fileType === "deposit_invoices"
      ? "deposit"
      : fileType === "custom_invoices"
        ? "custom"
        : "job";

  return {
    jobs: [],
    invoices: normalizeInvoice(rows, fileHash, invoiceType, column_mapping),
    raw,
    warnings,
    column_mapping,
  };
}

export function mergeImveJobs(
  existing: ImveJobRecord[],
  incoming: ImveJobRecord[]
): ImveJobRecord[] {
  const map = new Map<string, ImveJobRecord>();
  for (const job of existing) {
    const key = job.job_reference ?? job.imve_id;
    map.set(key, job);
  }
  for (const job of incoming) {
    const key = job.job_reference ?? job.imve_id;
    const prev = map.get(key);
    if (prev) {
      map.set(key, {
        ...prev,
        ...job,
        customer_email: job.customer_email ?? prev.customer_email,
        customer_phone: job.customer_phone ?? prev.customer_phone,
        customer_name: job.customer_name ?? prev.customer_name,
        deposit_paid: job.deposit_paid || prev.deposit_paid,
        deposit_paid_at: job.deposit_paid_at ?? prev.deposit_paid_at,
        deposit_amount: job.deposit_amount ?? prev.deposit_amount,
        turnover: job.turnover ?? prev.turnover,
        quote_value: job.quote_value ?? prev.quote_value,
        updated_at: job.updated_at,
      });
    } else {
      map.set(key, job);
    }
  }
  return [...map.values()];
}

export function applyInvoicesToJobs(
  jobs: ImveJobRecord[],
  invoices: ImveInvoiceRecord[],
  commissionRate: number
): ImveJobRecord[] {
  return applyInvoicesToJobsWithLinking(jobs, invoices, commissionRate).jobs;
}

export { applyInvoicesToJobsWithLinking } from "./imve-invoice-link";

export function mergeImveInvoices(
  existing: ImveInvoiceRecord[],
  incoming: ImveInvoiceRecord[]
): ImveInvoiceRecord[] {
  const map = new Map<string, ImveInvoiceRecord>();
  for (const inv of existing) {
    map.set(`${inv.invoice_type}:${inv.invoice_id}`, inv);
  }
  for (const inv of incoming) {
    map.set(`${inv.invoice_type}:${inv.invoice_id}`, inv);
  }
  return [...map.values()];
}

export function renormalizeLedgerFromRaw(
  rawFiles: ImveRawFileAudit[],
  commissionRate: number
): {
  jobs: ImveJobRecord[];
  invoices: ImveInvoiceRecord[];
  warnings: string[];
} {
  const allJobs: ImveJobRecord[] = [];
  const allInvoices: ImveInvoiceRecord[] = [];
  const warnings: string[] = [];

  for (const raw of rawFiles) {
    const parsed = normalizeImveFile(
      raw.file_type,
      raw.filename,
      raw.file_hash,
      raw.columns,
      raw.rows
    );
    allJobs.push(...parsed.jobs);
    allInvoices.push(...parsed.invoices);
    warnings.push(...parsed.warnings);
  }

  const mergedJobs = mergeImveJobs([], allJobs);
  const mergedInvoices = mergeImveInvoices([], allInvoices);
  const { jobs } = applyInvoicesToJobsWithLinking(
    mergedJobs,
    mergedInvoices,
    commissionRate
  );

  return { jobs, invoices: mergedInvoices, warnings };
}

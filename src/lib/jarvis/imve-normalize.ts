import { extractJobReference, extractPostcodeArea } from "./extractors";
import {
  IMVE_FIELD_ALIASES,
  pickField,
} from "./imve-parse";
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
    v === "completed"
  );
}

function parseDate(value: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value.slice(0, 10);
  return d.toISOString();
}

function jobIdFromRow(row: Record<string, string>, index: number): string {
  const ref = pickField(row, [...IMVE_FIELD_ALIASES.jobReference]);
  const id = pickField(row, [...IMVE_FIELD_ALIASES.imveId]);
  if (id) return id;
  if (ref) return ref;
  const email = pickField(row, [...IMVE_FIELD_ALIASES.email]);
  const move = pickField(row, [...IMVE_FIELD_ALIASES.moveDate]);
  return `row-${index}-${email ?? "unknown"}-${move ?? "nodate"}`;
}

export function normalizeImveJobs(
  rows: Record<string, string>[],
  fileHash: string
): ImveJobRecord[] {
  const now = new Date().toISOString();
  return rows.map((row, index) => {
    const jobRefRaw = pickField(row, [...IMVE_FIELD_ALIASES.jobReference]);
    const jobRef =
      extractJobReference(jobRefRaw ?? "") ??
      (jobRefRaw ? jobRefRaw.toUpperCase() : null);
    const fromPostcode = pickField(row, [...IMVE_FIELD_ALIASES.fromPostcode]);
    const status = pickField(row, [...IMVE_FIELD_ALIASES.status]);
    const depositPaidField = pickField(row, [...IMVE_FIELD_ALIASES.depositPaid]);
    const depositPaid =
      parseBool(depositPaidField) ||
      /deposit.*paid|booked|confirmed/i.test(status ?? "");

    return {
      imve_id: jobIdFromRow(row, index),
      job_reference: jobRef,
      customer_name: pickField(row, [...IMVE_FIELD_ALIASES.customerName]),
      customer_email: pickField(row, [...IMVE_FIELD_ALIASES.email])?.toLowerCase() ?? null,
      customer_phone: pickField(row, [...IMVE_FIELD_ALIASES.phone]),
      move_date: parseDate(pickField(row, [...IMVE_FIELD_ALIASES.moveDate])),
      from_postcode: fromPostcode,
      to_postcode: pickField(row, [...IMVE_FIELD_ALIASES.toPostcode]),
      from_area: extractPostcodeArea(fromPostcode),
      lead_source: pickField(row, [...IMVE_FIELD_ALIASES.leadSource]),
      status,
      quote_value: parseMoney(pickField(row, [...IMVE_FIELD_ALIASES.quoteValue])),
      booked: /booked|confirmed|deposit|paid|complete/i.test(status ?? "") || depositPaid,
      deposit_paid: depositPaid,
      deposit_paid_at: depositPaid
        ? parseDate(pickField(row, [...IMVE_FIELD_ALIASES.depositPaidAt]))
        : null,
      deposit_amount: parseMoney(
        pickField(row, [...IMVE_FIELD_ALIASES.depositAmount])
      ),
      turnover: parseMoney(pickField(row, [...IMVE_FIELD_ALIASES.turnover])),
      commission: null,
      source_file_hash: fileHash,
      updated_at: now,
    };
  });
}

function normalizeInvoice(
  rows: Record<string, string>[],
  fileHash: string,
  invoiceType: ImveInvoiceRecord["invoice_type"]
): ImveInvoiceRecord[] {
  return rows.map((row, index) => {
    const refRaw = pickField(row, [...IMVE_FIELD_ALIASES.jobReference]);
    const jobRef =
      extractJobReference(refRaw ?? "") ??
      (refRaw ? refRaw.toUpperCase() : null);
    const paidField = pickField(row, [...IMVE_FIELD_ALIASES.paid]);
    const status = pickField(row, [...IMVE_FIELD_ALIASES.status]);
    const paid =
      parseBool(paidField) ||
      /paid|complete/i.test(status ?? "") ||
      invoiceType === "deposit";

    return {
      invoice_id:
        pickField(row, [...IMVE_FIELD_ALIASES.invoiceId]) ?? `${invoiceType}-${index}`,
      job_reference: jobRef,
      customer_name: pickField(row, [...IMVE_FIELD_ALIASES.customerName]),
      invoice_date: parseDate(pickField(row, [...IMVE_FIELD_ALIASES.invoiceDate])),
      amount: parseMoney(pickField(row, [...IMVE_FIELD_ALIASES.quoteValue])),
      paid,
      paid_at: paid
        ? parseDate(pickField(row, [...IMVE_FIELD_ALIASES.depositPaidAt]))
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
} {
  const warnings: string[] = [];
  const raw: ImveRawFileAudit = {
    file_hash: fileHash,
    filename,
    file_type: fileType,
    imported_at: new Date().toISOString(),
    row_count: rows.length,
    columns,
    rows,
  };

  if (fileType === "unknown") {
    warnings.push("Could not confidently detect file type from filename/columns.");
  }

  if (fileType === "jobs") {
    return {
      jobs: normalizeImveJobs(rows, fileHash),
      invoices: [],
      raw,
      warnings,
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
    invoices: normalizeInvoice(rows, fileHash, invoiceType),
    raw,
    warnings,
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
    map.set(key, prev ? { ...prev, ...job, updated_at: job.updated_at } : job);
  }
  return [...map.values()];
}

export function applyInvoicesToJobs(
  jobs: ImveJobRecord[],
  invoices: ImveInvoiceRecord[],
  commissionRate: number
): ImveJobRecord[] {
  const byRef = new Map(jobs.map((j) => [j.job_reference ?? j.imve_id, { ...j }]));

  for (const inv of invoices) {
    if (!inv.job_reference) continue;
    let job = byRef.get(inv.job_reference);
    if (!job) {
      job = {
        imve_id: inv.job_reference,
        job_reference: inv.job_reference,
        customer_name: inv.customer_name,
        customer_email: null,
        customer_phone: null,
        move_date: null,
        from_postcode: null,
        to_postcode: null,
        from_area: "Unknown",
        lead_source: null,
        status: null,
        quote_value: null,
        booked: false,
        deposit_paid: false,
        deposit_paid_at: null,
        deposit_amount: null,
        turnover: null,
        commission: null,
        source_file_hash: inv.source_file_hash,
        updated_at: new Date().toISOString(),
      };
      byRef.set(inv.job_reference, job);
    }

    if (inv.invoice_type === "deposit" && inv.paid) {
      job.deposit_paid = true;
      job.deposit_paid_at = inv.paid_at ?? inv.invoice_date ?? job.deposit_paid_at;
      job.deposit_amount = inv.amount ?? job.deposit_amount;
      job.booked = true;
    }

    if (inv.invoice_type === "job" && inv.amount != null) {
      job.turnover = inv.amount;
      if (inv.paid) job.booked = true;
    }

    if (inv.invoice_type === "custom" && inv.amount != null) {
      job.turnover = (job.turnover ?? 0) + inv.amount;
    }
  }

  return [...byRef.values()].map((job) => {
    const turnover = job.turnover ?? job.quote_value;
    const commission =
      turnover != null ? Math.round(turnover * commissionRate * 100) / 100 : null;
    return { ...job, turnover, commission };
  });
}

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

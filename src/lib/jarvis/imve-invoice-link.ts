import { extractJobReference } from "./extractors";
import { normalizePhone } from "./cmm-match-scoring";
import type { ImveInvoiceRecord, ImveJobRecord } from "./imve-types";
import type { ImveMappedField } from "./imve-column-map";
import { pickMappedField } from "./imve-column-map";

function normalizePostcode(pc: string | null): string {
  return (pc ?? "").replace(/\s+/g, "").toUpperCase();
}

function normalizeName(name: string | null): string {
  return (name ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

function nameSimilarity(a: string | null, b: string | null): number {
  const na = normalizeName(a);
  const nb = normalizeName(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  const ta = new Set(na.split(" "));
  const tb = new Set(nb.split(" "));
  let overlap = 0;
  for (const t of ta) if (tb.has(t)) overlap += 1;
  return overlap / Math.max(ta.size, tb.size);
}

export type InvoiceLinkResult = {
  job: ImveJobRecord;
  reason: string;
};

export function buildJobIndexes(jobs: ImveJobRecord[]) {
  const byRef = new Map<string, ImveJobRecord>();
  const byEmail = new Map<string, ImveJobRecord>();
  const byPhone = new Map<string, ImveJobRecord>();
  const byImveId = new Map<string, ImveJobRecord>();

  for (const job of jobs) {
    if (job.job_reference) byRef.set(job.job_reference, job);
    if (job.imve_id) byImveId.set(job.imve_id, job);
    const email = job.customer_email?.toLowerCase();
    if (email) byEmail.set(email, job);
    const phone = normalizePhone(job.customer_phone);
    if (phone) byPhone.set(phone, job);
  }

  return { byRef, byEmail, byPhone, byImveId };
}

export function linkInvoiceToJob(
  inv: ImveInvoiceRecord,
  indexes: ReturnType<typeof buildJobIndexes>,
  jobs: ImveJobRecord[],
  mapping?: Record<ImveMappedField, string | null>
): InvoiceLinkResult | null {
  if (inv.job_reference) {
    const job = indexes.byRef.get(inv.job_reference);
    if (job) return { job, reason: "job_reference_exact" };
  }

  const raw = inv.raw;
  const invoiceJobId =
    mapping && pickMappedField(raw, mapping, "imve_id")
      ? pickMappedField(raw, mapping, "imve_id")
      : null;
  if (invoiceJobId) {
    const job = indexes.byImveId.get(invoiceJobId);
    if (job) return { job, reason: "imve_id_exact" };
  }

  const email = (
    inv.customer_email?.toLowerCase() ??
    (mapping ? pickMappedField(raw, mapping, "customer_email") : null)?.toLowerCase()
  );
  if (email) {
    const job = indexes.byEmail.get(email);
    if (job) return { job, reason: "customer_email" };
  }

  const phone = normalizePhone(
    inv.customer_phone ??
      (mapping ? pickMappedField(raw, mapping, "customer_phone") : null)
  );
  if (phone) {
    const job = indexes.byPhone.get(phone);
    if (job) return { job, reason: "customer_phone" };
  }

  const name = inv.customer_name ?? (mapping ? pickMappedField(raw, mapping, "customer_name") : null);
  const moveDate = mapping ? pickMappedField(raw, mapping, "move_date") : null;
  if (name) {
    let best: { job: ImveJobRecord; score: number } | null = null;
    for (const job of jobs) {
      const sim = nameSimilarity(name, job.customer_name);
      let score = sim;
      if (moveDate && job.move_date && job.move_date.includes(moveDate.slice(0, 10))) {
        score += 0.3;
      }
      if (!best || score > best.score) best = { job, score };
    }
    if (best && best.score >= 0.65) {
      return { job: best.job, reason: "customer_name_move_date" };
    }
  }

  const postcode = normalizePostcode(
    mapping ? pickMappedField(raw, mapping, "collection_postcode") : null
  );
  if (postcode) {
    const job = jobs.find(
      (j) => normalizePostcode(j.from_postcode) === postcode
    );
    if (job) return { job, reason: "postcode" };
  }

  for (const value of Object.values(raw)) {
    const ref = extractJobReference(value ?? "");
    if (ref) {
      const job = indexes.byRef.get(ref);
      if (job) return { job, reason: "rr_ref_in_row" };
    }
  }

  return null;
}

export function applyInvoicesToJobsWithLinking(
  jobs: ImveJobRecord[],
  invoices: ImveInvoiceRecord[],
  commissionRate: number
): {
  jobs: ImveJobRecord[];
  linkedDepositCount: number;
  unlinkedDepositCount: number;
  linkReasons: Record<string, number>;
} {
  const byKey = new Map(
    jobs.map((j) => [j.job_reference ?? j.imve_id, { ...j }])
  );
  const jobList = [...byKey.values()];
  const indexes = buildJobIndexes(jobList);
  const linkReasons: Record<string, number> = {};
  let linkedDepositCount = 0;
  let unlinkedDepositCount = 0;

  for (const inv of invoices) {
    const linked = linkInvoiceToJob(inv, indexes, jobList);
    if (!linked) {
      if (inv.invoice_type === "deposit") unlinkedDepositCount += 1;
      continue;
    }

    const key = linked.job.job_reference ?? linked.job.imve_id;
    let job = byKey.get(key) ?? { ...linked.job };
    linkReasons[linked.reason] = (linkReasons[linked.reason] ?? 0) + 1;
    inv.link_reason = linked.reason;

    if (!job.job_reference && linked.job.job_reference) {
      job.job_reference = linked.job.job_reference;
    }
    if (!job.customer_email && linked.job.customer_email) {
      job.customer_email = linked.job.customer_email;
    }
    if (!job.customer_email) {
      job.customer_email = inv.customer_email?.toLowerCase() ?? null;
    }
    if (!job.customer_phone && linked.job.customer_phone) {
      job.customer_phone = linked.job.customer_phone;
    }
    if (!job.customer_phone) {
      job.customer_phone = inv.customer_phone ?? null;
    }
    if (!job.customer_name && inv.customer_name) {
      job.customer_name = inv.customer_name;
    }

    if (inv.invoice_type === "deposit") {
      const paid =
        inv.paid ||
        /paid|complete|received/i.test(
          (inv.raw.Status ?? inv.raw.status ?? "").toString()
        );
      const invNumber =
        inv.invoice_id ??
        (inv.raw["Invoice Number"] ?? inv.raw["Number"] ?? "").toString();
      if (invNumber && invNumber !== `deposit-${inv.invoice_id}`) {
        job.deposit_invoice_number = invNumber;
      }
      if (paid) {
        job.deposit_paid = true;
        job.deposit_paid_at =
          inv.paid_at ?? inv.invoice_date ?? job.deposit_paid_at;
        job.deposit_amount = inv.amount ?? job.deposit_amount;
        job.booked = true;
        linkedDepositCount += 1;
      }
    }

    if (inv.invoice_type === "job" && inv.amount != null) {
      job.invoice_amount = inv.amount;
      job.turnover = inv.amount;
      if (inv.paid) job.booked = true;
    }

    if (inv.invoice_type === "custom" && inv.amount != null) {
      job.turnover = (job.turnover ?? 0) + inv.amount;
    }

    byKey.set(key, job);
  }

  const result = [...byKey.values()].map((job) => {
    const turnover = job.turnover ?? job.quote_value;
    const commission =
      turnover != null ? Math.round(turnover * commissionRate * 100) / 100 : null;
    return { ...job, turnover, commission };
  });

  return {
    jobs: result,
    linkedDepositCount,
    unlinkedDepositCount,
    linkReasons,
  };
}

import type { JarvisSettings } from "./settings-store";
import type { CmmLeadRecord } from "./types";
import {
  explainImveMatchDecision,
  rankImveCandidatesForLead,
} from "./imve-cmm-match";
import type {
  ImveCmmMatchLedger,
  ImveFileMappingDebug,
  ImveImportDebug,
  ImveImportLedger,
} from "./imve-types";
import { applyInvoicesToJobsWithLinking } from "./imve-invoice-link";
import { renormalizeLedgerFromRaw } from "./imve-normalize";
import { buildFileMappingDebug } from "./imve-file-debug";

function mergeFieldMappings(
  ledger: ImveImportLedger
): Record<string, string> {
  const merged: Record<string, string> = {};
  for (const raw of ledger.raw_files) {
    const mapping = raw.column_mapping;
    if (!mapping) continue;
    for (const [field, column] of Object.entries(mapping)) {
      if (column) merged[field] = column;
    }
  }
  return merged;
}

function buildLedgerFileMappingDebug(
  ledger: ImveImportLedger
): ImveFileMappingDebug[] {
  return ledger.raw_files.map((raw) => {
    const jobCount =
      raw.file_type === "jobs" ? raw.row_count : 0;
    const invoiceCount =
      raw.file_type !== "jobs" && raw.file_type !== "unknown"
        ? raw.row_count
        : 0;
    return buildFileMappingDebug({
      filename: raw.filename,
      file_type: raw.file_type,
      columns: raw.columns,
      rows: raw.rows,
      normalized_job_count: jobCount,
      normalized_invoice_count: invoiceCount,
      column_mapping: raw.column_mapping,
    });
  });
}

function countInvoicesByType(ledger: ImveImportLedger) {
  const deposits = ledger.invoices.filter((i) => i.invoice_type === "deposit");
  const jobInvoices = ledger.invoices.filter((i) => i.invoice_type === "job");
  const customInvoices = ledger.invoices.filter(
    (i) => i.invoice_type === "custom"
  );
  return { deposits, jobInvoices, customInvoices };
}

function computeLinkStats(ledger: ImveImportLedger, commissionRate: number) {
  if (
    ledger.linked_deposit_count != null &&
    ledger.unlinked_deposit_count != null
  ) {
    return {
      linkedDepositCount: ledger.linked_deposit_count,
      unlinkedDepositCount: ledger.unlinked_deposit_count,
      linkReasons: ledger.link_reasons ?? {},
    };
  }

  const { jobs: _jobs, linkedDepositCount, unlinkedDepositCount, linkReasons } =
    applyInvoicesToJobsWithLinking(
      ledger.jobs,
      ledger.invoices,
      commissionRate
    );
  return { linkedDepositCount, unlinkedDepositCount, linkReasons };
}

export function buildImveImportDebug(
  ledger: ImveImportLedger,
  matchLedger: ImveCmmMatchLedger | null,
  cmmLeads: CmmLeadRecord[],
  settings: JarvisSettings
): ImveImportDebug {
  const commissionRate = settings.commissionPercent / 100;
  const { deposits, jobInvoices, customInvoices } = countInvoicesByType(ledger);
  const { linkedDepositCount, unlinkedDepositCount } = computeLinkStats(
    ledger,
    commissionRate
  );

  const byType: ImveImportDebug["import_counts"]["by_type"] = {};
  for (const raw of ledger.raw_files) {
    byType[raw.file_type] = (byType[raw.file_type] ?? 0) + 1;
  }

  const jobsWithValue = ledger.jobs.filter(
    (j) => (j.turnover ?? j.quote_value) != null
  ).length;
  const jobsMissingValue = ledger.jobs.length - jobsWithValue;

  const stats = matchLedger?.stats ?? {
    autoMatched: 0,
    needsReview: 0,
    unmatched: cmmLeads.length,
    totalLeads: cmmLeads.length,
    totalImveJobs: ledger.jobs.length,
    lastMatchedAt: null,
  };

  const hotLeads = [...cmmLeads]
    .sort(
      (a, b) =>
        new Date(b.received_at).getTime() - new Date(a.received_at).getTime()
    )
    .slice(0, 10);

  const sample_matches = hotLeads.map((lead) => {
    const candidates = rankImveCandidatesForLead(lead, ledger.jobs, 3);
    const match = matchLedger?.matches[lead.gmail_message_id];
    const top = candidates[0];
    return {
      lead_id: lead.gmail_message_id,
      lead_name: lead.customer_name,
      lead_email: lead.customer_email,
      lead_received_at: lead.received_at,
      candidates: candidates.map((c) => ({
        imve_job_id: c.job.imve_id,
        job_reference: c.job.job_reference,
        customer_name: c.job.customer_name,
        confidence: c.score,
        reasons: c.reasons,
      })),
      match_status: match?.match_status ?? "unmatched",
      explanation: top ? explainImveMatchDecision(lead, top) : "No i-MVE candidates scored.",
    };
  });

  const warnings: string[] = [];
  const totalRows = ledger.raw_files.reduce((s, f) => s + f.row_count, 0);
  if (totalRows > 0 && stats.autoMatched === 0) {
    warnings.push("i-MVE imported but no CMM matches found");
  }
  if (deposits.length > 0 && linkedDepositCount === 0) {
    warnings.push("Deposits imported but not linked");
  }

  const renormalizeWarnings: string[] = [];
  if (ledger.raw_files.length > 0) {
    const { warnings: w } = renormalizeLedgerFromRaw(
      ledger.raw_files,
      commissionRate
    );
    renormalizeWarnings.push(...w);
  }
  for (const w of renormalizeWarnings) {
    if (!warnings.includes(w)) warnings.push(w);
  }

  return {
    import_counts: {
      files_uploaded: ledger.raw_files.length,
      by_type: byType,
      raw_rows_per_file: ledger.raw_files.map((f) => ({
        filename: f.filename,
        file_type: f.file_type,
        row_count: f.row_count,
      })),
      normalized_jobs: ledger.jobs.length,
      normalized_deposits: deposits.length,
      normalized_job_invoices: jobInvoices.length,
      normalized_custom_invoices: customInvoices.length,
    },
    field_mapping: mergeFieldMappings(ledger),
    matching_counts: {
      total_cmm_leads: stats.totalLeads,
      total_imve_jobs: stats.totalImveJobs,
      deposits: deposits.length,
      auto_matched: stats.autoMatched,
      needs_review: stats.needsReview,
      unmatched: stats.unmatched,
      deposits_linked: linkedDepositCount,
      deposits_unlinked: unlinkedDepositCount,
      jobs_with_value: jobsWithValue,
      jobs_missing_value: jobsMissingValue,
    },
    sample_matches,
    warnings,
    file_mapping_debug: buildLedgerFileMappingDebug(ledger),
  };
}

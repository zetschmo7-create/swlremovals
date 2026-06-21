import { randomUUID } from "crypto";
import type { JarvisSettings } from "./settings-store";
import {
  applyInvoicesToJobsWithLinking,
  normalizeImveFile,
  renormalizeLedgerFromRaw,
} from "./imve-normalize";
import { maskRowsForPreview } from "./imve-mask";
import {
  detectImveFileType,
  hashFileContent,
  parseSpreadsheetBuffer,
} from "./imve-parse";
import type {
  ImveCmmMatchLedger,
  ImveFilePreview,
  ImveImportLedger,
  ImveImportPreviewSession,
} from "./imve-types";
import {
  getImveImportLedgerOrEmpty,
  getImvePreviewSession,
  saveImveImportLedger,
  saveImvePreviewSession,
} from "./imve-store";
import { assessImportPreview } from "./imve-validate";
import { runImveCmmMatching } from "./imve-cmm-match";
import { getImveCmmMatchLedger, saveImveCmmMatchLedger } from "./imve-cmm-match-store";
import { getCmmLeadLedger } from "./cmm-lead-store";
import { buildPreviewMappingDebug } from "./imve-file-debug";

export type ImveUploadedFile = {
  filename: string;
  buffer: Buffer;
};

function applyRenormalizedLedger(
  ledger: ImveImportLedger,
  commissionRate: number
): ImveImportLedger {
  const { jobs, invoices } = renormalizeLedgerFromRaw(
    ledger.raw_files,
    commissionRate
  );
  const {
    jobs: jobsWithInvoices,
    linkedDepositCount,
    unlinkedDepositCount,
    linkReasons,
  } = applyInvoicesToJobsWithLinking(jobs, invoices, commissionRate);

  return {
    ...ledger,
    jobs: jobsWithInvoices,
    invoices,
    linked_deposit_count: linkedDepositCount,
    unlinked_deposit_count: unlinkedDepositCount,
    link_reasons: linkReasons,
    roi_active: jobsWithInvoices.length > 0,
  };
}

export function buildFilePreview(
  file: ImveUploadedFile,
  alreadyImported: boolean
): ImveFilePreview & {
  parsed: ReturnType<typeof normalizeImveFile>;
} {
  const fileHash = hashFileContent(file.buffer);
  const { columns, rows } = parseSpreadsheetBuffer(file.buffer, file.filename);
  const fileType = detectImveFileType(file.filename, columns);
  const parsed = normalizeImveFile(
    fileType,
    file.filename,
    fileHash,
    columns,
    rows
  );

  return {
    filename: file.filename,
    file_hash: fileHash,
    file_type: fileType,
    row_count: rows.length,
    normalized_job_count: parsed.jobs.length,
    normalized_invoice_count: parsed.invoices.length,
    columns,
    sample_rows: maskRowsForPreview(rows, 3),
    already_imported: alreadyImported,
    parse_warnings: parsed.warnings,
    parsed,
  };
}

export async function createImveImportPreview(
  files: ImveUploadedFile[]
): Promise<ImveImportPreviewSession> {
  const ledger = await getImveImportLedgerOrEmpty();
  const importedHashes = new Set(ledger.imported_file_hashes);

  const previews = files.map((f) =>
    buildFilePreview(f, importedHashes.has(hashFileContent(f.buffer)))
  );

  const allJobs = previews.flatMap((p) => p.parsed.jobs);
  const allInvoices = previews.flatMap((p) => p.parsed.invoices);
  const allRaw = previews.flatMap((p) => p.parsed.raw);

  const filePreviews = previews.map(({ parsed: _parsed, ...rest }) => rest);
  const parsed = {
    jobs: allJobs,
    invoices: allInvoices,
    raw_files: allRaw,
  };

  const session: ImveImportPreviewSession = {
    session_id: randomUUID(),
    created_at: new Date().toISOString(),
    files: filePreviews,
    mapping_debug: buildPreviewMappingDebug(
      previews.map((p) => ({
        filename: p.filename,
        file_type: p.file_type,
        columns: p.columns,
        row_count: p.row_count,
        normalized_job_count: p.normalized_job_count,
        normalized_invoice_count: p.normalized_invoice_count,
        column_mapping: p.parsed.column_mapping,
        rows: p.parsed.raw.rows,
      }))
    ),
    parsed,
    summary: {
      normalized_jobs: 0,
      normalized_invoices: 0,
      unknown_file_count: 0,
      zero_row_file_count: 0,
      all_files_duplicate: false,
      can_confirm: false,
      warnings: [],
    },
  };
  session.summary = assessImportPreview(session, ledger);

  await saveImvePreviewSession(session);
  return session;
}

export async function confirmImveImport(
  sessionId: string,
  settings: JarvisSettings
): Promise<ImveImportLedger> {
  const session = await getImvePreviewSession(sessionId);
  if (!session) {
    throw new Error("Import preview session expired or not found. Please preview again.");
  }

  const ledger = await getImveImportLedgerOrEmpty();
  const importedHashes = new Set(ledger.imported_file_hashes);
  const commissionRate = settings.commissionPercent / 100;

  const previewSummary = assessImportPreview(session, ledger);
  if (!previewSummary.can_confirm) {
    throw new Error(
      previewSummary.warnings.join(" ") ||
        "Import cannot be confirmed: no valid normalized data."
    );
  }

  const hasNewFiles = session.files.some((f) => !f.already_imported);

  const newRawFiles = session.parsed.raw_files.filter(
    (f) => !importedHashes.has(f.file_hash)
  );
  const newHashes = newRawFiles.map((f) => f.file_hash);

  const rawFiles = [
    ...ledger.raw_files.filter((f) => !newHashes.includes(f.file_hash)),
    ...newRawFiles,
  ];

  let updated: ImveImportLedger = {
    version: 1,
    jobs: ledger.jobs,
    invoices: ledger.invoices,
    raw_files: rawFiles,
    imported_file_hashes: [
      ...new Set([...ledger.imported_file_hashes, ...newHashes]),
    ],
    last_import_at:
      newHashes.length > 0 ? new Date().toISOString() : ledger.last_import_at,
    roi_active: ledger.roi_active,
  };

  updated = applyRenormalizedLedger(updated, commissionRate);

  if (!updated.roi_active) {
    throw new Error(
      "Import produced no usable i-MVE jobs. ROI was not updated. Check file types and column headers."
    );
  }

  if (!hasNewFiles && newHashes.length === 0) {
    throw new Error("No new files to import.");
  }

  await saveImveImportLedger(updated);

  const cmmLeads = (await getCmmLeadLedger())?.leads ?? [];
  const priorMatches = await getImveCmmMatchLedger();
  const matchLedger = runImveCmmMatching(cmmLeads, updated.jobs, priorMatches);
  await saveImveCmmMatchLedger(matchLedger);

  return updated;
}

export async function rematchImveImport(
  settings: JarvisSettings
): Promise<{ ledger: ImveImportLedger; matchLedger: ImveCmmMatchLedger }> {
  const ledger = await getImveImportLedgerOrEmpty();
  const commissionRate = settings.commissionPercent / 100;

  const updated = applyRenormalizedLedger(ledger, commissionRate);
  await saveImveImportLedger(updated);

  const cmmLeads = (await getCmmLeadLedger())?.leads ?? [];
  const priorMatches = await getImveCmmMatchLedger();
  const matchLedger = runImveCmmMatching(cmmLeads, updated.jobs, priorMatches);
  await saveImveCmmMatchLedger(matchLedger);

  return { ledger: updated, matchLedger };
}

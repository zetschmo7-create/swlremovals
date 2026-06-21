import type {
  ImveImportLedger,
  ImveImportPreviewSession,
  ImveImportPreviewSummary,
} from "./imve-types";

export function isImveRoiActive(ledger: ImveImportLedger): boolean {
  if (!ledger.roi_active || ledger.jobs.length === 0) return false;
  return Boolean(ledger.last_import_at);
}

export function assessImportPreview(
  session: ImveImportPreviewSession,
  existingLedger: ImveImportLedger
): ImveImportPreviewSummary {
  const normalized_jobs = session.parsed.jobs.length;
  const normalized_invoices = session.parsed.invoices.length;
  const unknown_file_count = session.files.filter(
    (f) => f.file_type === "unknown"
  ).length;
  const zero_row_file_count = session.files.filter((f) => f.row_count === 0).length;
  const all_files_duplicate = session.files.every((f) => f.already_imported);
  const has_new_files = session.files.some((f) => !f.already_imported);
  const has_normalized = normalized_jobs > 0 || normalized_invoices > 0;

  const warnings: string[] = [];
  for (const file of session.files) {
    if (file.file_type === "unknown") {
      warnings.push(
        `${file.filename}: unknown file type — check filename/columns.`
      );
    }
    if (file.row_count === 0) {
      warnings.push(`${file.filename}: zero rows parsed.`);
    }
    if (
      file.file_type !== "unknown" &&
      file.row_count > 0 &&
      file.normalized_job_count === 0 &&
      file.normalized_invoice_count === 0
    ) {
      warnings.push(
        `${file.filename}: ${file.row_count} rows but 0 normalized records — column mapping may need review.`
      );
    }
    for (const w of file.parse_warnings) {
      if (!warnings.includes(w)) warnings.push(w);
    }
  }

  if (!has_normalized && has_new_files) {
    warnings.push(
      "No normalized jobs or invoices detected from new files. ROI will not be updated until valid data is imported."
    );
  }

  let can_confirm = false;
  if (all_files_duplicate) {
    can_confirm = isImveRoiActive(existingLedger) || existingLedger.jobs.length > 0;
    if (!can_confirm) {
      warnings.push("All files were already imported and no i-MVE data exists to rematch.");
    }
  } else if (has_new_files) {
    can_confirm = has_normalized;
  }

  return {
    normalized_jobs,
    normalized_invoices,
    unknown_file_count,
    zero_row_file_count,
    all_files_duplicate,
    can_confirm,
    warnings: [...new Set(warnings)],
  };
}

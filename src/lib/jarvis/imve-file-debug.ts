import {
  countUsableRows,
  getColumnMappingScores,
  mappingSummary,
  missingRequiredFields,
  resolveColumnMapping,
  unmappedHeaders,
  type ImveMappedField,
} from "./imve-column-map";
import { maskRowsForPreview } from "./imve-mask";
import type { ImveFileMappingDebug, ImveFileType } from "./imve-types";

export function buildFileMappingDebug(input: {
  filename: string;
  file_type: ImveFileType;
  columns: string[];
  rows: Record<string, string>[];
  normalized_job_count: number;
  normalized_invoice_count: number;
  column_mapping?: Record<ImveMappedField, string | null>;
}): ImveFileMappingDebug {
  const mapping =
    input.column_mapping ?? resolveColumnMapping(input.columns, input.rows);
  const normalizedCount =
    input.file_type === "jobs"
      ? input.normalized_job_count
      : input.normalized_invoice_count;

  const firstRow = input.rows[0] ?? {};
  const firstRowMapped: Record<string, string> = {};
  for (const [label, sourceColumn] of Object.entries(mappingSummary(mapping))) {
    if (!sourceColumn) {
      firstRowMapped[label] = "";
      continue;
    }
    firstRowMapped[label] = firstRow[sourceColumn] ?? "";
  }

  const maskedSample = maskRowsForPreview([firstRowMapped], 1)[0] ?? {};

  return {
    filename: input.filename,
    headers: input.columns,
    file_type: input.file_type,
    raw_row_count: input.rows.length,
    normalized_job_count: input.normalized_job_count,
    normalized_invoice_count: input.normalized_invoice_count,
    usable_row_count: countUsableRows(input.rows, mapping, input.file_type),
    field_mapping: mappingSummary(mapping),
    mapping_scores: getColumnMappingScores(input.columns, mapping),
    unmapped_headers: unmappedHeaders(input.columns, mapping),
    missing_required_fields: missingRequiredFields(
      input.file_type,
      mapping,
      normalizedCount,
      countUsableRows(input.rows, mapping, input.file_type)
    ),
    first_row_mapped: maskedSample,
  };
}

export function buildPreviewMappingDebug(
  files: Array<{
    filename: string;
    file_type: ImveFileType;
    columns: string[];
    row_count: number;
    normalized_job_count: number;
    normalized_invoice_count: number;
    column_mapping?: Record<ImveMappedField, string | null>;
    rows?: Record<string, string>[];
  }>
): ImveFileMappingDebug[] {
  return files.map((f) =>
    buildFileMappingDebug({
      filename: f.filename,
      file_type: f.file_type,
      columns: f.columns,
      rows: f.rows ?? [],
      normalized_job_count: f.normalized_job_count,
      normalized_invoice_count: f.normalized_invoice_count,
      column_mapping: f.column_mapping,
    })
  );
}

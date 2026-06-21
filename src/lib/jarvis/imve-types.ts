import type { ImveMappedField } from "./imve-column-map";
import type { PostcodeArea } from "./types";

export type ImveFileType =
  | "jobs"
  | "job_invoices"
  | "deposit_invoices"
  | "custom_invoices"
  | "unknown";

export type ImveRawFileAudit = {
  file_hash: string;
  filename: string;
  file_type: ImveFileType;
  imported_at: string;
  row_count: number;
  columns: string[];
  rows: Record<string, string>[];
  column_mapping?: Record<ImveMappedField, string | null>;
};

export type ImveJobRecord = {
  imve_id: string;
  job_reference: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  job_creation_date: string | null;
  move_date: string | null;
  from_postcode: string | null;
  to_postcode: string | null;
  from_area: PostcodeArea;
  lead_source: string | null;
  status: string | null;
  quote_value: number | null;
  total_amount: number | null;
  invoice_amount: number | null;
  invoice_number: string | null;
  invoice_status: string | null;
  deposit_invoice_number: string | null;
  deposit_status: string | null;
  booked: boolean;
  deposit_paid: boolean;
  deposit_paid_at: string | null;
  deposit_amount: number | null;
  turnover: number | null;
  commission: number | null;
  source_file_hash: string;
  updated_at: string;
};

export type ImveInvoiceRecord = {
  invoice_id: string;
  job_reference: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  invoice_date: string | null;
  amount: number | null;
  paid: boolean;
  paid_at: string | null;
  invoice_type: "job" | "deposit" | "custom";
  source_file_hash: string;
  link_reason?: string | null;
  raw: Record<string, string>;
};

export type ImveImportLedger = {
  version: number;
  jobs: ImveJobRecord[];
  invoices: ImveInvoiceRecord[];
  raw_files: ImveRawFileAudit[];
  imported_file_hashes: string[];
  last_import_at: string | null;
  /** Set true only after a confirmed import with normalized jobs/invoices. */
  roi_active: boolean;
  linked_deposit_count?: number;
  unlinked_deposit_count?: number;
  link_reasons?: Record<string, number>;
};

export type ImveFilePreview = {
  filename: string;
  file_hash: string;
  file_type: ImveFileType;
  row_count: number;
  normalized_job_count: number;
  normalized_invoice_count: number;
  columns: string[];
  sample_rows: Record<string, string>[];
  already_imported: boolean;
  parse_warnings: string[];
};

export type ImveFileMappingDebug = {
  filename: string;
  headers: string[];
  file_type: ImveFileType;
  raw_row_count: number;
  normalized_job_count: number;
  normalized_invoice_count: number;
  usable_row_count: number;
  /** Debug label → actual CSV header name */
  field_mapping: Record<string, string | null>;
  mapping_scores: Record<string, { column: string | null; score: number }>;
  unmapped_headers: string[];
  missing_required_fields: string[];
  first_row_mapped: Record<string, string>;
};

export type ImveImportPreviewSummary = {
  normalized_jobs: number;
  normalized_invoices: number;
  unknown_file_count: number;
  zero_row_file_count: number;
  all_files_duplicate: boolean;
  can_confirm: boolean;
  warnings: string[];
};

export type ImveImportPreviewSession = {
  session_id: string;
  created_at: string;
  files: ImveFilePreview[];
  summary: ImveImportPreviewSummary;
  mapping_debug: ImveFileMappingDebug[];
  parsed: {
    jobs: ImveJobRecord[];
    invoices: ImveInvoiceRecord[];
    raw_files: ImveRawFileAudit[];
  };
};

export type ImveCmmMatchStatus =
  | "auto_matched"
  | "needs_review"
  | "approved"
  | "rejected"
  | "unmatched";

export type ImveCmmLeadMatch = {
  lead_id: string;
  cmm_internal_id: string | null;
  imve_job_id: string | null;
  job_reference: string | null;
  match_confidence: number;
  match_reason: string | null;
  match_status: ImveCmmMatchStatus;
  deposit_paid: boolean;
  deposit_paid_at: string | null;
  booked: boolean;
  turnover: number | null;
  commission: number | null;
  candidate_imve_job_id: string | null;
  candidate_job_reference: string | null;
  candidate_customer_name: string | null;
  candidate_confidence: number | null;
  updated_at: string;
};

export type ImveCmmMatchReviewItem = {
  lead_id: string;
  lead_name: string | null;
  lead_email: string | null;
  lead_postcode: string | null;
  lead_received_at: string;
  candidate_imve_job_id: string;
  candidate_job_reference: string | null;
  candidate_customer_name: string | null;
  candidate_deposit_paid: boolean;
  confidence: number;
  match_reason: string;
};

export type ImveCmmMatchStats = {
  autoMatched: number;
  needsReview: number;
  unmatched: number;
  totalLeads: number;
  totalImveJobs: number;
  lastMatchedAt: string | null;
};

export type ImveCmmMatchLedger = {
  matches: Record<string, ImveCmmLeadMatch>;
  reviewQueue: ImveCmmMatchReviewItem[];
  stats: ImveCmmMatchStats;
  lastMatchedAt: string | null;
};

export type ImveImportSummary = {
  jobCount: number;
  invoiceCount: number;
  depositPaidCount: number;
  bookedCount: number;
  lastImportAt: string | null;
  importedFiles: number;
  matchStats: ImveCmmMatchStats;
  reviewQueue: ImveCmmMatchReviewItem[];
};

export type ImveImportDebugSampleCandidate = {
  imve_job_id: string;
  job_reference: string | null;
  customer_name: string | null;
  confidence: number;
  reasons: string[];
};

export type ImveImportDebugSampleMatch = {
  lead_id: string;
  lead_name: string | null;
  lead_email: string | null;
  lead_received_at: string;
  candidates: ImveImportDebugSampleCandidate[];
  match_status: ImveCmmMatchStatus;
  explanation: string | null;
};

export type ImveRoiExclusionReason =
  | "no_match"
  | "status_needs_review"
  | "status_rejected"
  | "status_unmatched"
  | "status_not_eligible"
  | "missing_imve_job_id"
  | "imve_job_not_found"
  | "no_deposit_or_value";

export type ImveRoiMatchEvaluation = {
  lead_id: string;
  lead_name: string | null;
  area: PostcodeArea;
  match_status: ImveCmmMatchStatus | "none";
  included: boolean;
  exclusion_reason: ImveRoiExclusionReason | null;
  deposit_paid: boolean;
  deposit_amount: number | null;
  turnover_value: number | null;
  quote_value: number | null;
  commission_value: number | null;
  booked: boolean;
  job_reference: string | null;
};

export type ImveRoiAreaBreakdown = {
  area: PostcodeArea;
  cmm_leads_in_area: number;
  matched_cmm_leads: number;
  usable_roi_matches: number;
  deposit_jobs_counted: number;
  booked_jobs_counted: number;
  turnover_summed: number;
  commission_summed: number;
  roi_formula: string;
  roi_value: number | null;
  spend_all_time: number;
};

export type ImveRoiEligibilityDebug = {
  using_imve_for_roi: boolean;
  totals: {
    total_matches: number;
    auto_matched: number;
    manually_approved: number;
    needs_review: number;
    rejected: number;
    unmatched: number;
    with_deposit_paid: number;
    with_deposit_amount: number;
    with_turnover_value: number;
    included_in_roi: number;
    excluded_from_roi: number;
  };
  excluded_samples: Array<{
    lead_name: string | null;
    match_status: string;
    reason: string;
  }>;
  match_evaluations: ImveRoiMatchEvaluation[];
  by_area: ImveRoiAreaBreakdown[];
};

export type ImveImportDebug = {
  import_counts: {
    files_uploaded: number;
    by_type: Partial<Record<ImveFileType, number>>;
    raw_rows_per_file: Array<{
      filename: string;
      file_type: ImveFileType;
      row_count: number;
    }>;
    normalized_jobs: number;
    normalized_deposits: number;
    normalized_job_invoices: number;
    normalized_custom_invoices: number;
  };
  field_mapping: Record<string, string>;
  matching_counts: {
    total_cmm_leads: number;
    total_imve_jobs: number;
    deposits: number;
    auto_matched: number;
    needs_review: number;
    unmatched: number;
    deposits_linked: number;
    deposits_unlinked: number;
    jobs_with_value: number;
    jobs_missing_value: number;
  };
  sample_matches: ImveImportDebugSampleMatch[];
  warnings: string[];
  /** Per-file header → field mapping from stored raw exports */
  file_mapping_debug: ImveFileMappingDebug[];
  /** ROI handoff: which matches count toward area deposit/turnover/commission */
  roi_eligibility: ImveRoiEligibilityDebug;
};

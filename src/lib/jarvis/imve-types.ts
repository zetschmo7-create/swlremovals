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
};

export type ImveJobRecord = {
  imve_id: string;
  job_reference: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  move_date: string | null;
  from_postcode: string | null;
  to_postcode: string | null;
  from_area: PostcodeArea;
  lead_source: string | null;
  status: string | null;
  quote_value: number | null;
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
  invoice_date: string | null;
  amount: number | null;
  paid: boolean;
  paid_at: string | null;
  invoice_type: "job" | "deposit" | "custom";
  source_file_hash: string;
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

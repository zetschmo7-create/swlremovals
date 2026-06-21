import type { PostcodeArea } from "./types";

export type CommercialValueConfidence = "actual" | "estimated" | "none";

export type CommercialValueSource =
  | "total_amount"
  | "invoice_amount"
  | "deposit_estimate"
  | "none";

export type JobCommercialValue = {
  value: number;
  confidence: CommercialValueConfidence;
  source: CommercialValueSource;
};

export type CommercialAreaMetrics = {
  area: PostcodeArea;
  enquiries: number;
  cmmLeads: number;
  wonJobs: number;
  depositInvoicesSent: number;
  depositPaid: number;
  depositCash: number;
  wonTurnover: number;
  forecastCommission: number;
  conversionRate: number | null;
  cmmSpend: number;
  roiByCommission: number | null;
  roiByTurnover: number | null;
};

export type CommercialSourceMetrics = {
  source: string;
  jobs: number;
  wonJobs: number;
  depositInvoicesSent: number;
  depositPaid: number;
  depositCash: number;
  wonTurnover: number;
  forecastCommission: number;
  conversionRate: number | null;
  cmmSpend: number | null;
  roiByCommission: number | null;
  roiByTurnover: number | null;
};

export type CommercialIntelligenceSummary = {
  totalJobs: number;
  wonJobs: number;
  depositInvoicesSent: number;
  depositPaid: number;
  depositCash: number;
  wonTurnover: number;
  forecastCommission: number;
  actualValueJobs: number;
  estimatedValueJobs: number;
  bestAreaRoi: { area: PostcodeArea; roiByCommission: number } | null;
  worstAreaRoi: { area: PostcodeArea; roiByCommission: number } | null;
  bestSource: { source: string; roiByCommission: number } | null;
  worstSource: { source: string; roiByCommission: number } | null;
  hasImveData: boolean;
  cmmSpendAllTime: number;
};

export type CommercialDataQualityWarning = {
  code: string;
  message: string;
  count: number;
  samples: Array<{ label: string; detail?: string }>;
};

export type CommercialCmmRoi = {
  cmmWonJobs: number;
  cmmWonTurnover: number;
  cmmForecastCommission: number;
  cmmSpend: number;
  roiByCommission: number | null;
  roiByTurnover: number | null;
};

export type CommercialIntelligence = {
  summary: CommercialIntelligenceSummary;
  byArea: CommercialAreaMetrics[];
  bySource: CommercialSourceMetrics[];
  warnings: CommercialDataQualityWarning[];
  cmmRoi: CommercialCmmRoi;
};

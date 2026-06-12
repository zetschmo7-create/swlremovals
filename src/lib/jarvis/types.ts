import type { PdfParseResult } from "./pdf-parser";

export type JarvisAccount = "main" | "appointments";

export type PostcodeArea = "GU" | "RH" | "TN" | "SM" | "CR" | "Other" | "Unknown";

export type JobStage =
  | "lead_received"
  | "survey_booked"
  | "quote_sent"
  | "quote_accepted"
  | "deposit_invoice_sent"
  | "deposit_paid"
  | "move_invoice_sent"
  | "move_completed"
  | "lost_or_declined"
  | "needs_review";

export type JobRecord = {
  job_key: string;
  job_reference: string | null;
  customer_name: string | null;
  customer_email: string | null;
  lead_source: string | null;
  lead_received_at: string | null;
  moving_from_postcode: string | null;
  moving_from_postcode_area: PostcodeArea;
  moving_to_postcode: string | null;
  survey_booked_at: string | null;
  quote_sent_at: string | null;
  quote_accepted_at: string | null;
  deposit_invoice_sent_at: string | null;
  deposit_receipt_received_at: string | null;
  move_invoice_sent_at: string | null;
  move_date: string | null;
  quote_value: number | null;
  deposit_value: number | null;
  final_move_value: number | null;
  commission_payable: boolean;
  commission_value: number | null;
  current_stage: JobStage;
  source_emails: string[];
  source_pdfs: string[];
  confidence_score: number;
  needs_manual_review_reason: string | null;
  duplicate_ignored_events: string[];
};

export type JobLedger = {
  jobs: JobRecord[];
  audit: {
    duplicateEventsIgnored: number;
    pdfsParsed: number;
    pdfsFailed: number;
    pdfsMissing: number;
    unknownValues: number;
    jobsNeedingReview: number;
    logs: string[];
  };
};

export type JarvisEmail = {
  id: string;
  account: JarvisAccount;
  threadId: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
  body: string;
  labels: string[];
  parsedPdfs: PdfParseResult[];
};

export type EmailCategory =
  | "cmm_lead"
  | "survey_booking"
  | "quote_acceptance"
  | "deposit_invoice"
  | "deposit_payment"
  | "operational"
  | "other";

export type ClassifiedEmail = JarvisEmail & {
  category: EmailCategory;
  extractedAmounts: number[];
  primaryAmount: number | null;
};

export type JarvisTask = {
  id: string;
  title: string;
  detail: string;
  source: string;
  category: EmailCategory | "system";
  priority: "high" | "medium" | "low";
  customer?: string;
  revenueImpact?: number | null;
  priorityScore?: number;
  reason?: string;
  suggestedAction?: string;
  potentialCommission?: number | null;
};

export type TaskBucket = "jarvis" | "jake" | "wait";

export type JarvisScorecard = {
  periodLabel: string;
  newCmmLeads: number;
  surveyBookings: number;
  quoteAcceptances: number;
  depositsReceived: number;
  totalQuoteValue: number;
  totalDepositValue: number;
  commissionRate: number;
  commissionOnQuotes: number;
  commissionOnDeposits: number;
  totalCommission: number;
};

export type PeriodMetrics = {
  leads: number;
  surveys: number;
  quotesAccepted: number;
  depositsReceived: number;
  turnoverClosed: number;
  commissionEarned: number;
  outstandingQuoteValue: number;
};

export type RevenuePeriods = {
  last24h: PeriodMetrics;
  last7d: PeriodMetrics;
  last30d: PeriodMetrics;
};

export type ExecutiveSnapshot = {
  today: {
    newLeads: number;
    surveysBooked: number;
    depositsReceived: number;
    estimatedCommission: number;
  };
  thisWeek: {
    newLeads: number;
    surveysBooked: number;
    depositsReceived: number;
    estimatedCommission: number;
  };
  pipeline: {
    outstandingQuoteValue: number;
    hotOpportunityValue: number;
  };
  actions: {
    jarvisCount: number;
    jakeCount: number;
  };
  health: {
    score: number | null;
    status: "green" | "amber" | "red" | "needs_setup";
    label: string;
    factors: string[];
  };
};

export type JarvisBriefing = {
  generatedAt: string;
  business: string;
  version: "v2";
  scorecard: JarvisScorecard;
  executive: ExecutiveSnapshot;
  revenue: RevenuePeriods;
  roi: {
    leadSpend: number;
    revenuePerLead: number | null;
    commissionPerLead: number | null;
    roi: number | null;
    commissionRoi: number | null;
    needsSetup: boolean;
  };
  settings: {
    commissionPercent: number;
    leadProviderName: string;
    costPerLead: number;
  };
  missedRevenue: {
    opportunities: Array<{
      id: string;
      customer: string;
      reason: string;
      potentialTurnover: number | null;
      potentialCommission: number | null;
    }>;
    totalMissedTurnover: number | null;
    totalMissedCommission: number | null;
    needsSetup: boolean;
  };
  hotLeads: {
    leads: Array<{
      id: string;
      customer: string;
      potentialValue: number | null;
      reason: string;
      recommendedAction: string;
      conversionProbability: number | null;
    }>;
    needsSetup: boolean;
  };
  leadTracker: {
    leads: Array<{
      id: string;
      customer: string;
      leadReceived: string;
      lastActivity: string;
      status: "red" | "amber" | "green";
      statusLabel: string;
    }>;
    unanswered: number;
    awaiting: number;
    converted: number;
    needsSetup: boolean;
  };
  surveyIntelligence: {
    slots: Record<
      "GU" | "RH" | "TN",
      Array<{
        zone: "GU" | "RH" | "TN";
        date: string;
        dateLabel: string;
        time: string;
        confidence: "high" | "medium" | "none";
        reasoning: string;
        existingBookings: string[];
      }>
    >;
    needsSetup: boolean;
  };
  payday: {
    commissionEarnedThisWeek: number;
    commissionDueThisFriday: number;
    commissionPaidThisMonth: number | null;
    commissionPaidNeedsSetup: boolean;
    depositsReceivedThisWeek: number;
    jobsPayableThisWeek: number;
    turnoverMadePayableThisWeek: number;
    turnoverDueThisFriday: number;
    nextPayday: string;
    nextPaydayLabel: string;
    daysUntilPayday: number;
    summaryLine: string;
    needsConfirmation: Array<{
      id: string;
      customer: string;
      depositReceivedAt: string;
      moveValue: number | null;
      valueNeedsConfirmation: boolean;
      commission: number | null;
    }>;
    payableBookings: Array<{
      id: string;
      customer: string;
      depositReceivedAt: string;
      moveValue: number | null;
      valueNeedsConfirmation: boolean;
      commission: number | null;
    }>;
    needsSetup: boolean;
  };
  commissionForecast: {
    earned: number;
    likely: number;
    possible: number;
    stretch: number;
    needsSetup: boolean;
  };
  pipelineFunnel: {
    stages: Array<{
      key: string;
      label: string;
      count: number;
      conversionFromPrevious: number | null;
    }>;
    movesCompletedDetectable: boolean;
    needsSetup: boolean;
  };
  moveTracker: {
    movesToday: number | null;
    movesTomorrow: number | null;
    movesThisWeek: number | null;
    completedThisWeek: number | null;
    turnoverDelivered: number | null;
    commissionSecured: number | null;
    needsSetup: boolean;
  };
  charts: {
    labels: string[];
    leads: number[];
    revenue: number[];
    commission: number[];
    pipeline: number[];
    healthTrend: number[];
    needsSetup: boolean;
  };
  tasks: Record<TaskBucket, JarvisTask[]>;
  morningScript: string;
  todaysFocus: string[];
  emails: {
    cmmLeads: ClassifiedEmail[];
    surveyBookings: ClassifiedEmail[];
    quoteAcceptances: ClassifiedEmail[];
    depositPayments: ClassifiedEmail[];
  };
  setup: {
    gmailConfigured: boolean;
    connections: {
      main: { connected: boolean; email?: string };
      appointments: { connected: boolean; email?: string };
    };
    missing: string[];
    notes: string[];
  };
  jobLedger: JobLedger;
  dataQuality: {
    gmailAccountsConnected: number;
    pdfsParsedToday: number;
    jobsRequiringReview: number;
    duplicateEventsIgnored: number;
    unknownValues: number;
    funnelWarning: string | null;
  };
  postcodeAnalytics: {
    areas: Record<
      PostcodeArea,
      {
        leads: number;
        spend: number;
        depositsPaid: number;
        turnover: number;
        commission: number;
        conversionRate: number | null;
        roi: number | null;
      }
    >;
    needsSetup: boolean;
  };
  cmmSpend: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    byArea: Record<PostcodeArea, number>;
    label: string;
  };
};

export type PdfDiagnosticEntry = {
  emailSubject: string;
  emailDate: string;
  account: JarvisAccount;
  filename: string;
  status: PdfParseResult["status"];
  fields: PdfParseResult["fields"];
  log: string;
};

export type GmailConnectionStatusResponse = {
  storageReady: boolean;
  googleOAuthConfigured: boolean;
  main: { connected: boolean; email?: string; connectedAt?: string };
  appointments: { connected: boolean; email?: string; connectedAt?: string };
  fullyConnected: boolean;
  missing: string[];
  redirectUri: string;
};

import type { PdfParseResult, PdfParseStatus } from "./pdf-parser";
import type { OperationalPdfCategory } from "./pdf-whitelist";

export type JarvisAccount = "main" | "appointments";

export type PostcodeArea = "GU" | "RH" | "TN" | "SM" | "CR" | "Other" | "Unknown";

export type CmmLeadRecord = {
  lead_id: string;
  gmail_message_id: string;
  gmail_thread_id: string;
  received_at: string;
  received_date_key: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  flexible: boolean | null;
  current_address: string | null;
  current_postcode: string | null;
  current_area_prefix: PostcodeArea;
  bedrooms: number | null;
  home_type: string | null;
  new_address: string | null;
  new_postcode: string | null;
  additional_services: string | null;
  additional_information: string | null;
  number_of_other_companies: number | null;
  cmm_internal_id: string | null;
  collection_address: string | null;
  collection_postcode: string | null;
  collection_postcode_area: PostcodeArea;
  delivery_address: string | null;
  delivery_postcode: string | null;
  move_date: string | null;
  property_size: string | null;
  external_lead_id: string | null;
  lead_source: string;
  lead_cost: number;
  raw_subject: string;
  raw_snippet: string;
  confidence_score: number;
  needs_review_reason: string | null;
};

export type CmmSyncDebug = {
  labelName: string | null;
  labelId: string | null;
  messageIdsReturned: number;
  messagesFetched: number;
  parseSuccesses: number;
  parseFailures: number;
  duplicatesSkipped: number;
  sampleParseFailure: string | null;
};

export type CmmSyncMeta = {
  messagesScanned: number;
  leadsParsed: number;
  duplicatesSkipped: number;
  unknownPostcodes: number;
  lastMessageDate: string | null;
  labelFound: boolean;
  lastSyncAt: string | null;
  error: string | null;
  debug: CmmSyncDebug;
};

export type CmmLeadLedger = {
  leads: CmmLeadRecord[];
  version: number;
};

export type CmmAreaPeriodStats = {
  leads: number;
  spend: number;
};

export type CmmAreaAnalytics = {
  today: CmmAreaPeriodStats;
  thisWeek: CmmAreaPeriodStats;
  thisMonth: CmmAreaPeriodStats;
  allTime: CmmAreaPeriodStats;
  depositsPaid: number;
  conversionRate: number | null;
  turnover: number;
  commission: number;
  roi: number | null;
  costPerPaidDeposit: number | null;
  needsReview: boolean;
};

export type CmmBookedStatus =
  | "unmatched"
  | "lead_only"
  | "survey_booked"
  | "quote_sent"
  | "quote_accepted"
  | "deposit_paid";

export type CmmLeadMatchStatus =
  | "confident"
  | "needs_review"
  | "approved"
  | "rejected"
  | "unmatched";

export type CmmLeadMatch = {
  lead_id: string;
  cmm_internal_id: string | null;
  matched_job_id: string | null;
  matched_quote_id: string | null;
  matched_deposit_message_id: string | null;
  match_confidence: number;
  match_reason: string | null;
  match_status: CmmLeadMatchStatus;
  quote_value: number | null;
  deposit_paid_at: string | null;
  booked_status: CmmBookedStatus;
  candidate_job_id: string | null;
  candidate_job_name: string | null;
  candidate_confidence: number | null;
  updated_at: string;
};

export type CmmMatchReviewItem = {
  lead_id: string;
  lead_name: string | null;
  lead_email: string | null;
  lead_postcode: string | null;
  lead_received_at: string;
  candidate_job_id: string;
  candidate_job_name: string | null;
  candidate_job_reference: string | null;
  candidate_deposit_at: string | null;
  confidence: number;
  match_reason: string;
  ambiguous: boolean;
};

export type CmmMatchStats = {
  leadsMatchedConfidently: number;
  possibleMatchesNeedingReview: number;
  unmatchedLeads: number;
  unmatchedDepositJobs: number;
  totalLeads: number;
  totalJobs: number;
  lastMatchedAt: string | null;
};

export type CmmUnmatchedDepositJob = {
  job_key: string;
  customer_name: string | null;
  deposit_paid_at: string | null;
};

export type CmmMatchLedger = {
  matches: Record<string, CmmLeadMatch>;
  reviewQueue: CmmMatchReviewItem[];
  unmatchedDepositJobs: CmmUnmatchedDepositJob[];
  stats: CmmMatchStats;
  lastMatchedAt: string | null;
};

export type CmmLeadIntelligence = {
  leadsToday: number;
  leadsThisWeek: number;
  leadsThisMonth: number;
  leadsLast30Days: number;
  leadsAllTime: number;
  spendToday: number;
  spendThisWeek: number;
  spendThisMonth: number;
  spendLast30Days: number;
  spendAllTime: number;
  unknownPostcodes: number;
  byArea: Record<PostcodeArea, CmmAreaAnalytics>;
  dailyChart: { labels: string[]; leads: number[]; spend: number[] };
  weeklyChart: { labels: string[]; leads: number[]; spend: number[] };
  monthlyChart: { labels: string[]; leads: number[]; spend: number[] };
  topAreas: Array<{ area: PostcodeArea; leads: number; spend: number }>;
  unknownPostcodeLeads: Array<{
    customer_name: string | null;
    received_at: string;
    reason: string | null;
  }>;
  syncMeta: CmmSyncMeta;
  matchStats: CmmMatchStats;
  reviewQueue: CmmMatchReviewItem[];
  unmatchedDepositJobs: CmmUnmatchedDepositJob[];
  imveImportSummary: {
    jobCount: number;
    depositPaidCount: number;
    matchStats: {
      autoMatched: number;
      needsReview: number;
      unmatched: number;
      totalLeads: number;
      totalImveJobs: number;
      lastMatchedAt: string | null;
    };
    usingImveForRoi: boolean;
  } | null;
  needsSetup: boolean;
  setupMessage: string | null;
};

export type SalesGptIntent =
  | "call_script"
  | "sms"
  | "email"
  | "objection"
  | "survey_pitch"
  | "deposit_chase"
  | "follow_up"
  | "freeform";

export type SalesContext = {
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  collectionPostcode: string | null;
  collectionPostcodeArea: PostcodeArea | null;
  deliveryPostcode: string | null;
  moveDate: string | null;
  propertySize: string | null;
  pipelineStage: string;
  quoteValue: number | null;
  depositPaid: boolean;
  jobReference: string | null;
  leadSource: string | null;
  surveySlots: string[];
  dataConfidence: "high" | "medium" | "low";
  missingFields: string[];
  jobKey: string | null;
  leadId: string | null;
  businessName: string;
};

export type SalesGptResponse = {
  reply: string;
  suggestedActions: string[];
  warnings: string[];
  contextUsed: {
    jobKey: string | null;
    leadId: string | null;
    pipelineStage: string;
    dataConfidence: string;
  };
};

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
  internalDateMs?: number;
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
    pdfValueExtractionNeedsSetup: boolean;
    pdfExtractionNote: string | null;
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
    last30Days: number;
    allTime: number;
    byArea: Record<PostcodeArea, number>;
    label: string;
  };
  cmmLeadIntelligence: CmmLeadIntelligence;
};

export type PdfDiagnosticEntry = {
  emailSubject: string;
  emailDate: string;
  emailFrom: string;
  account: JarvisAccount;
  filename: string;
  status: PdfParseStatus;
  category: OperationalPdfCategory | null;
  reason: string;
  textLength: number;
  textPreview: string | null;
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

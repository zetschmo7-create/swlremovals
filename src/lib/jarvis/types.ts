export type JarvisAccount = "main" | "appointments";

export type JarvisEmail = {
  id: string;
  account: JarvisAccount;
  subject: string;
  from: string;
  date: string;
  snippet: string;
  body: string;
  labels: string[];
};

export type EmailCategory =
  | "cmm_lead"
  | "survey_booking"
  | "quote_acceptance"
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

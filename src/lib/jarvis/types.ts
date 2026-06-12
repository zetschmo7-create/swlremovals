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

export type JarvisBriefing = {
  generatedAt: string;
  business: string;
  scorecard: JarvisScorecard;
  tasks: Record<TaskBucket, JarvisTask[]>;
  morningScript: string;
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

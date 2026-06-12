export const JARVIS_CONFIG = {
  businessName: "Ryan Removals",
  commissionRate: 0.1,
  lookbackHours: 24,
  cmmLeadLabel: "CMM - New Lead",
  accounts: {
    main: {
      id: "main" as const,
      label: "Ryan Removals (Main Gmail)",
      description: "Historical CMM lead emails",
    },
    appointments: {
      id: "appointments" as const,
      label: "appointments@ryanremovals-surveys.com",
      description: "Current operational survey & quote emails",
    },
  },
} as const;

export const SESSION_COOKIE = "jarvis_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

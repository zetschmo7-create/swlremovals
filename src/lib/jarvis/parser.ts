import type {
  ClassifiedEmail,
  EmailCategory,
  JarvisEmail,
  JarvisTask,
  TaskBucket,
} from "./types";
import { JARVIS_CONFIG } from "./config";

const SURVEY_PATTERNS = [
  /survey\s*(booked|booking|scheduled|confirmed|appointment)/i,
  /video\s*survey/i,
  /appointment\s*(booked|confirmed|scheduled)/i,
  /booking\s*confirmation/i,
  /survey\s*date/i,
];

const QUOTE_ACCEPT_PATTERNS = [
  /quote\s*accepted/i,
  /accepted\s*(your|the|our)\s*quote/i,
  /quote\s*confirmation/i,
  /confirmed\s*quote/i,
  /booking\s*confirmed/i,
  /move\s*confirmed/i,
];

const DEPOSIT_PATTERNS = [
  /deposit\s*(received|paid|payment)/i,
  /payment\s*received/i,
  /paid\s*deposit/i,
  /receipt/i,
  /stripe|paypal|bank\s*transfer/i,
  /£\s*[\d,]+(?:\.\d{2})?\s*(deposit|paid|received)/i,
];

const AMOUNT_REGEX = /£\s*([\d,]+(?:\.\d{2})?)/g;

function extractAmounts(text: string): number[] {
  const amounts: number[] = [];
  for (const match of text.matchAll(AMOUNT_REGEX)) {
    const raw = match[1]?.replace(/,/g, "");
    const value = parseFloat(raw ?? "");
    if (!Number.isNaN(value) && value > 0) amounts.push(value);
  }
  return amounts;
}

function matchesAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

function classifyEmail(email: JarvisEmail): ClassifiedEmail {
  const text = `${email.subject} ${email.snippet} ${email.body}`;
  const extractedAmounts = extractAmounts(text);
  const primaryAmount = extractedAmounts.length > 0 ? extractedAmounts[0] : null;

  let category: EmailCategory = "other";

  if (
    email.account === "main" ||
    email.labels.some((l) =>
      l.toLowerCase().includes(JARVIS_CONFIG.cmmLeadLabel.toLowerCase())
    ) ||
    /cmm|new\s*lead|compare\s*my\s*move/i.test(text)
  ) {
    if (email.account === "main" || /new\s*lead|cmm/i.test(text)) {
      category = "cmm_lead";
    }
  }

  if (category === "other" && matchesAny(text, DEPOSIT_PATTERNS)) {
    category = "deposit_payment";
  } else if (category === "other" && matchesAny(text, QUOTE_ACCEPT_PATTERNS)) {
    category = "quote_acceptance";
  } else if (category === "other" && matchesAny(text, SURVEY_PATTERNS)) {
    category = "survey_booking";
  } else if (email.account === "appointments" && category === "other") {
    category = "operational";
  }

  return { ...email, category, extractedAmounts, primaryAmount };
}

function assignBucket(task: Omit<JarvisTask, "id">): TaskBucket {
  if (task.category === "cmm_lead" || task.category === "quote_acceptance") {
    return "jake";
  }
  if (task.category === "deposit_payment") {
    return task.priority === "high" ? "jake" : "jarvis";
  }
  if (task.category === "survey_booking") {
    return "jarvis";
  }
  if (task.priority === "low") return "wait";
  return "wait";
}

function buildTask(
  email: ClassifiedEmail,
  title: string,
  detail: string,
  priority: JarvisTask["priority"]
): JarvisTask {
  const base = {
    title,
    detail,
    source: `${email.from} — ${email.subject}`,
    category: email.category,
    priority,
  };
  return { ...base, id: `${email.id}-${title.slice(0, 12)}` };
}

export function classifyEmails(emails: JarvisEmail[]): ClassifiedEmail[] {
  return emails.map(classifyEmail);
}

export function buildTasks(classified: ClassifiedEmail[]): Record<TaskBucket, JarvisTask[]> {
  const buckets: Record<TaskBucket, JarvisTask[]> = {
    jarvis: [],
    jake: [],
    wait: [],
  };

  for (const email of classified) {
    const pushTask = (task: JarvisTask) => {
      buckets[assignBucket(task)].push(task);
    };

    switch (email.category) {
      case "cmm_lead":
        pushTask(
          buildTask(
            email,
            "Call new CMM lead",
            "Respond to Compare My Move lead within 2 hours.",
            "high"
          )
        );
        break;
      case "survey_booking":
        pushTask(
          buildTask(
            email,
            "Confirm survey slot",
            "Verify calendar entry and send pre-survey checklist.",
            "medium"
          )
        );
        break;
      case "quote_acceptance":
        pushTask(
          buildTask(
            email,
            "Process accepted quote",
            "Confirm move date, crew size, and send booking confirmation.",
            "high"
          )
        );
        break;
      case "deposit_payment":
        pushTask(
          buildTask(
            email,
            "Verify deposit received",
            email.primaryAmount
              ? `Confirm £${email.primaryAmount.toFixed(2)} landed and update job sheet.`
              : "Confirm payment and update job sheet.",
            "high"
          )
        );
        break;
      case "operational":
        buckets.wait.push(
          buildTask(email, "Review operational email", "Scan for action items not auto-classified.", "low")
        );
        break;
      default:
        break;
    }
  }

  if (classified.filter((e) => e.category === "cmm_lead").length === 0) {
    buckets.wait.push({
      id: "system-no-leads",
      title: "No new CMM leads today",
      detail: "Monitor inbox — no Compare My Move leads in the last 24 hours.",
      source: "Jarvis system",
      category: "system",
      priority: "low",
    });
  }

  return buckets;
}

export function summariseByCategory(classified: ClassifiedEmail[]) {
  const cmmLeads = classified.filter((e) => e.category === "cmm_lead");
  const surveyBookings = classified.filter((e) => e.category === "survey_booking");
  const quoteAcceptances = classified.filter((e) => e.category === "quote_acceptance");
  const depositPayments = classified.filter((e) => e.category === "deposit_payment");

  const totalQuoteValue = quoteAcceptances.reduce(
    (sum, e) => sum + (e.primaryAmount ?? 0),
    0
  );
  const totalDepositValue = depositPayments.reduce(
    (sum, e) => sum + (e.primaryAmount ?? 0),
    0
  );

  return {
    cmmLeads,
    surveyBookings,
    quoteAcceptances,
    depositPayments,
    totalQuoteValue,
    totalDepositValue,
  };
}

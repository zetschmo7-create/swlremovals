import type {
  ClassifiedEmail,
  EmailCategory,
  JarvisEmail,
  JarvisTask,
  TaskBucket,
} from "./types";
import {
  isCmmLeadEmail,
  isDepositInvoiceEmail,
  isDepositReceiptEmail,
  isQuoteAcceptedEmail,
  isSurveyBookingEmail,
} from "./extractors";

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

function classifyEmail(email: JarvisEmail): ClassifiedEmail {
  const text = `${email.subject} ${email.snippet} ${email.body}`;
  const extractedAmounts = extractAmounts(text);
  const primaryAmount = extractedAmounts.length > 0 ? extractedAmounts[0] : null;

  let category: EmailCategory = "other";

  if (isCmmLeadEmail(email)) {
    category = "cmm_lead";
  } else if (isDepositReceiptEmail(email)) {
    category = "deposit_payment";
  } else if (isDepositInvoiceEmail(email)) {
    category = "deposit_invoice";
  } else if (isQuoteAcceptedEmail(email)) {
    category = "quote_acceptance";
  } else if (isSurveyBookingEmail(email)) {
    category = "survey_booking";
  } else if (email.account === "appointments") {
    category = "operational";
  }

  return { ...email, category, extractedAmounts, primaryAmount };
}

function assignBucket(task: Omit<JarvisTask, "id">): TaskBucket {
  if (task.category === "cmm_lead" || task.category === "quote_acceptance") {
    return "jake";
  }
  if (task.category === "deposit_payment" || task.category === "deposit_invoice") {
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
            "High-value phone call — new CMM lead",
            "Respond to Compare My Move lead within 2 hours.",
            "high"
          )
        );
        break;
      case "survey_booking":
        pushTask(
          buildTask(
            email,
            "Draft survey confirmation",
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
      case "deposit_invoice":
        pushTask(
          buildTask(
            email,
            "Deposit invoice sent — not yet paid",
            "Deposit invoice detected. Awaiting customer payment receipt.",
            "medium"
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
      case "operational": {
        const text = `${email.subject} ${email.snippet}`.toLowerCase();
        if (/quote|follow.?up|deposit/i.test(text)) {
          pushTask(
            buildTask(
              email,
              "Draft quote follow-up",
              "Customer may be waiting on quote or deposit reminder.",
              "medium"
            )
          );
        } else {
          buckets.wait.push(
            buildTask(
              email,
              "Low-priority admin review",
              "Non-urgent operational email.",
              "low"
            )
          );
        }
        break;
      }
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

import type { SalesContext, SalesGptIntent } from "./types";
import {
  formatPlaybookExcerpt,
  getPlaybookSectionsForIntent,
  loadSalesPlaybook,
} from "./sales-playbook";

const INTENT_INSTRUCTIONS: Record<SalesGptIntent, string> = {
  call_script:
    "Write a concise phone call script for Jake at Ryan Removals. Include: warm opener, 2–3 discovery questions, survey booking ask, and a confident close. Use short bullet points plus a natural spoken opener paragraph.",
  sms:
    "Write a single SMS draft under 320 characters. Friendly, professional, no fluff. Include a clear next step (call back, survey slot, or deposit).",
  email:
    "Write a customer email with Subject line and body. Professional Ryan Removals tone. Clear CTA. Keep it scannable.",
  objection:
    "Handle the customer's objection using playbook guidance. Acknowledge, reframe, and end with one clear next step. Do not be pushy.",
  survey_pitch:
    "Pitch booking a home survey. Reference available survey slots when provided. Explain why the survey helps accuracy.",
  deposit_chase:
    "Draft a polite deposit follow-up for an accepted quote. Confirm value if quote_value is known. Create urgency without pressure.",
  follow_up:
    "Draft a quote or pipeline follow-up message appropriate to the pipeline stage.",
  freeform:
    "Answer Jake's sales question using playbook guidance and the customer context provided.",
};

function formatContextBlock(context: SalesContext): string {
  const lines = [
    `Business: ${context.businessName}`,
    `Customer name: ${context.customerName ?? "Unknown"}`,
    `Phone: ${context.customerPhone ?? "Not on file"}`,
    `Email: ${context.customerEmail ?? "Not on file"}`,
    `Collection postcode: ${context.collectionPostcode ?? "Unknown"}`,
    `Collection area: ${context.collectionPostcodeArea ?? "Unknown"}`,
    `Delivery postcode: ${context.deliveryPostcode ?? "Unknown"}`,
    `Move date: ${context.moveDate ?? "Unknown"}`,
    `Property size: ${context.propertySize ?? "Unknown"}`,
    `Pipeline stage: ${context.pipelineStage}`,
    `Lead source: ${context.leadSource ?? "Unknown"}`,
    `Job reference: ${context.jobReference ?? "None"}`,
    `Deposit paid: ${context.depositPaid ? "Yes" : "No"}`,
    `Quote value (GBP): ${
      context.quoteValue != null ? context.quoteValue.toFixed(2) : "Not available — do NOT invent a price"
    }`,
    `Data confidence: ${context.dataConfidence}`,
    `Missing fields: ${context.missingFields.length ? context.missingFields.join(", ") : "None"}`,
  ];

  if (context.surveySlots.length > 0) {
    lines.push(`Available survey slots:\n- ${context.surveySlots.join("\n- ")}`);
  }

  return lines.join("\n");
}

export function buildSalesGptMessages(options: {
  intent: SalesGptIntent;
  context: SalesContext;
  userMessage?: string;
}): { system: string; user: string } {
  const { intent, context, userMessage } = options;
  const playbook = loadSalesPlaybook();
  const sections = getPlaybookSectionsForIntent(intent);
  const playbookExcerpt = formatPlaybookExcerpt(sections);

  const system = `You are Sales GPT for ${context.businessName} (Ryan Removals), helping Jake draft customer-facing sales messages.

RULES (mandatory):
- Draft-only output. Never claim an email/SMS was sent.
- NEVER invent postcodes, customer details, job references, or prices.
- Only mention quote_value if it is provided in context; otherwise say pricing will be confirmed after survey/assessment.
- If data confidence is low or fields are missing, keep the draft generic and note what Jake should confirm first.
- UK English. Warm, professional, local removals company tone.
- Service areas include RH, GU, TN, SM, CR and surrounding areas.
- Do not mention Jake paying for CMM leads personally — marketing spend is company-level.
- Output ready-to-copy text only. No meta commentary unless asked in freeform mode.

TASK: ${INTENT_INSTRUCTIONS[intent]}

${
  playbook.loaded && playbookExcerpt
    ? `PLAYBOOK EXCERPT:\n${playbookExcerpt}`
    : `PLAYBOOK: Use standard Ryan Removals sales best practices — respond fast to CMM leads, book surveys quickly, confirm move details, follow up accepted quotes for deposit.`
}

CUSTOMER CONTEXT:
${formatContextBlock(context)}`;

  const userParts = [`Generate a ${intent.replace(/_/g, " ")} draft.`];
  if (userMessage?.trim()) {
    userParts.push(`Jake's note: ${userMessage.trim()}`);
  }

  return {
    system,
    user: userParts.join("\n\n"),
  };
}

export function parseSalesGptReply(raw: string): {
  reply: string;
  suggestedActions: string[];
} {
  const actionMatch = raw.match(
    /(?:suggested actions?|next steps?):?\s*\n((?:[-*•]\s*.+\n?)+)/i
  );
  let reply = raw.trim();
  const suggestedActions: string[] = [];

  if (actionMatch) {
    reply = raw.slice(0, actionMatch.index).trim();
    const bullets = actionMatch[1].match(/[-*•]\s*(.+)/g) ?? [];
    for (const b of bullets) {
      suggestedActions.push(b.replace(/^[-*•]\s*/, "").trim());
    }
  }

  if (suggestedActions.length === 0) {
    suggestedActions.push("Review draft before sending.");
  }

  return { reply, suggestedActions };
}

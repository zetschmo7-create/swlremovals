import OpenAI from "openai";
import type { SalesGptIntent, SalesGptResponse } from "./types";
import type { SalesContext } from "./types";
import { buildSalesGptMessages, parseSalesGptReply } from "./sales-gpt-prompt";

const DEFAULT_MODEL = "gpt-4o-mini";

export function isSalesGptConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export function isSalesGptEnabled(): boolean {
  if (process.env.JARVIS_SALES_GPT_ENABLED === "false") return false;
  return isSalesGptConfigured();
}

function getModel(): string {
  return process.env.JARVIS_SALES_MODEL?.trim() || DEFAULT_MODEL;
}

export async function generateSalesGptDraft(options: {
  intent: SalesGptIntent;
  context: SalesContext;
  userMessage?: string;
  warnings?: string[];
}): Promise<SalesGptResponse> {
  if (!isSalesGptEnabled()) {
    throw new Error(
      "Sales GPT is not configured. Set OPENAI_API_KEY in environment variables."
    );
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const { system, user } = buildSalesGptMessages({
    intent: options.intent,
    context: options.context,
    userMessage: options.userMessage,
  });

  const completion = await client.chat.completions.create({
    model: getModel(),
    temperature: 0.6,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  const raw = completion.choices[0]?.message?.content?.trim();
  if (!raw) {
    throw new Error("OpenAI returned an empty response.");
  }

  const { reply, suggestedActions } = parseSalesGptReply(raw);
  const warnings = [...(options.warnings ?? [])];

  if (options.context.quoteValue == null && /£\s?\d/.test(reply)) {
    warnings.push(
      "Draft may contain a price but quote_value was not in ledger — review carefully."
    );
  }

  return {
    reply,
    suggestedActions,
    warnings,
    contextUsed: {
      jobKey: options.context.jobKey,
      leadId: options.context.leadId,
      pipelineStage: options.context.pipelineStage,
      dataConfidence: options.context.dataConfidence,
    },
  };
}

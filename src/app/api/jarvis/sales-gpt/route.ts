import { NextResponse } from "next/server";
import { getJarvisSession } from "@/lib/jarvis/auth";
import { generateJarvisBriefing } from "@/lib/jarvis/briefing";
import { resolveSalesContext } from "@/lib/jarvis/sales-context";
import {
  generateSalesGptDraft,
  isSalesGptEnabled,
} from "@/lib/jarvis/sales-gpt";
import type { SalesGptIntent } from "@/lib/jarvis/types";

const VALID_INTENTS: SalesGptIntent[] = [
  "call_script",
  "sms",
  "email",
  "objection",
  "survey_pitch",
  "deposit_chase",
  "follow_up",
  "freeform",
];

function parseIntent(value: unknown): SalesGptIntent {
  if (typeof value === "string" && VALID_INTENTS.includes(value as SalesGptIntent)) {
    return value as SalesGptIntent;
  }
  return "freeform";
}

export async function POST(request: Request) {
  const authed = await getJarvisSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSalesGptEnabled()) {
    return NextResponse.json(
      {
        error:
          "Sales GPT is not configured. Set OPENAI_API_KEY in Vercel environment variables.",
      },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as {
      intent?: string;
      jobKey?: string;
      leadId?: string;
      userMessage?: string;
    };

    const intent = parseIntent(body.intent);
    const briefing = await generateJarvisBriefing();
    const { context, warnings } = await resolveSalesContext(briefing, {
      jobKey: body.jobKey,
      leadId: body.leadId,
    });

    const result = await generateSalesGptDraft({
      intent,
      context,
      userMessage: body.userMessage,
      warnings,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Sales GPT request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

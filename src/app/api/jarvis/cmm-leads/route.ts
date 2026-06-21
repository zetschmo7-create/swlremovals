import { NextResponse } from "next/server";
import { getJarvisSession } from "@/lib/jarvis/auth";
import { rebuildCmmLeadLedger, syncNewCmmLeads } from "@/lib/jarvis/cmm-ingest";
import { CmmIngestLockedError } from "@/lib/jarvis/cmm-lead-store";
import { loadCmmLeadIntelligence } from "@/lib/jarvis/cmm-analytics";
import { getJarvisSettings } from "@/lib/jarvis/settings-store";

export async function GET() {
  const authed = await getJarvisSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getJarvisSettings();
    const intelligence = await loadCmmLeadIntelligence(settings);
    return NextResponse.json(intelligence);
  } catch (error) {
    const message = error instanceof Error ? error.message : "CMM analytics failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authed = await getJarvisSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let action: "rebuild" | "sync" = "sync";
  try {
    const body = (await request.json()) as { action?: string };
    if (body.action === "rebuild") action = "rebuild";
  } catch {
    /* default sync */
  }

  try {
    const result =
      action === "rebuild"
        ? await rebuildCmmLeadLedger()
        : await syncNewCmmLeads();

    const settings = await getJarvisSettings();
    const intelligence = await loadCmmLeadIntelligence(settings, { rematch: true });

    return NextResponse.json({ ingest: result, intelligence });
  } catch (error) {
    if (error instanceof CmmIngestLockedError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    const message = error instanceof Error ? error.message : "CMM ingest failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

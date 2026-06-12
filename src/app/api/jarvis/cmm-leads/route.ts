import { NextResponse } from "next/server";
import { getJarvisSession } from "@/lib/jarvis/auth";
import { rebuildCmmLeadLedger, syncNewCmmLeads } from "@/lib/jarvis/cmm-ingest";
import { loadCmmLeadIntelligence } from "@/lib/jarvis/cmm-analytics";
import { getJarvisSettings } from "@/lib/jarvis/settings-store";
import { fetchJarvisEmails } from "@/lib/jarvis/gmail";
import { detectEmailEvents } from "@/lib/jarvis/email-events";
import { buildJobLedger } from "@/lib/jarvis/job-ledger";
import { collectPdfAudit } from "@/lib/jarvis/ledger-analytics";

async function getJobsForMatching() {
  try {
    const emails = await fetchJarvisEmails({ days: 30, parsePdfs: false });
    const pdfAudit = collectPdfAudit(emails);
    const settings = await getJarvisSettings();
    const { events, duplicateCount } = detectEmailEvents(emails);
    return buildJobLedger(events, duplicateCount, settings, pdfAudit).jobs;
  } catch {
    return [];
  }
}

export async function GET() {
  const authed = await getJarvisSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getJarvisSettings();
    const jobs = await getJobsForMatching();
    const intelligence = await loadCmmLeadIntelligence(jobs, settings);
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
    const jobs = await getJobsForMatching();
    const intelligence = await loadCmmLeadIntelligence(jobs, settings);

    return NextResponse.json({ ingest: result, intelligence });
  } catch (error) {
    const message = error instanceof Error ? error.message : "CMM ingest failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

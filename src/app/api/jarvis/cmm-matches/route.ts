import { NextResponse } from "next/server";
import { getJarvisSession } from "@/lib/jarvis/auth";
import { getCmmLeadLedger } from "@/lib/jarvis/cmm-lead-store";
import {
  applyMatchReview,
  runCmmLeadMatching,
} from "@/lib/jarvis/cmm-match";
import {
  getCmmMatchLedger,
  saveCmmMatchLedger,
} from "@/lib/jarvis/cmm-match-store";
import { loadCmmLeadIntelligence } from "@/lib/jarvis/cmm-analytics";
import { getJarvisSettings } from "@/lib/jarvis/settings-store";
import { getJobsForCmmMatching } from "@/lib/jarvis/jarvis-jobs";

export async function GET() {
  const authed = await getJarvisSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const ledger = await getCmmMatchLedger();
    return NextResponse.json(ledger ?? { matches: {}, reviewQueue: [], stats: null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Match ledger load failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authed = await getJarvisSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    action?: string;
    leadId?: string;
    decision?: "approve" | "reject";
  } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const settings = await getJarvisSettings();
  const jobs = await getJobsForCmmMatching();
  const leadLedger = await getCmmLeadLedger();
  const leads = leadLedger?.leads ?? [];

  try {
    if (body.action === "rematch") {
      const prior = await getCmmMatchLedger();
      const matchLedger = runCmmLeadMatching(leads, jobs, prior);
      await saveCmmMatchLedger(matchLedger);
      const intelligence = await loadCmmLeadIntelligence(settings);
      return NextResponse.json({ matchLedger, intelligence });
    }

    if (
      (body.action === "approve" || body.action === "reject") &&
      body.leadId
    ) {
      const decision = body.action === "approve" ? "approve" : "reject";
      let ledger = await getCmmMatchLedger();
      if (!ledger) {
        return NextResponse.json({ error: "No match ledger" }, { status: 404 });
      }
      ledger = applyMatchReview(ledger, body.leadId, decision, jobs);
      ledger = runCmmLeadMatching(leads, jobs, ledger);
      await saveCmmMatchLedger(ledger);
      const intelligence = await loadCmmLeadIntelligence(settings);
      return NextResponse.json({ matchLedger: ledger, intelligence });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Match action failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

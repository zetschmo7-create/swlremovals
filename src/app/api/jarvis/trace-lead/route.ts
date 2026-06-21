import { NextResponse } from "next/server";
import { getJarvisSession } from "@/lib/jarvis/auth";
import { loadCmmLeadIntelligence } from "@/lib/jarvis/cmm-analytics";
import { runImveCmmMatching } from "@/lib/jarvis/imve-cmm-match";
import {
  getImveCmmMatchLedger,
  saveImveCmmMatchLedger,
} from "@/lib/jarvis/imve-cmm-match-store";
import { getImveImportLedgerOrEmpty } from "@/lib/jarvis/imve-store";
import { getCmmLeadLedger } from "@/lib/jarvis/cmm-lead-store";
import { getJarvisSettings } from "@/lib/jarvis/settings-store";
import { repairCmmLeadFromGmail, traceLead } from "@/lib/jarvis/trace-lead";

export async function GET(request: Request) {
  const authed = await getJarvisSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  if (!query) {
    return NextResponse.json({ error: "Missing query parameter q" }, { status: 400 });
  }

  try {
    const trace = await traceLead(query);
    return NextResponse.json({ trace });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Trace failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authed = await getJarvisSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      action?: string;
      messageId?: string;
      query?: string;
    };

    if (body.action === "repair" && body.messageId) {
      const repair = await repairCmmLeadFromGmail(body.messageId);
      if (!repair.repaired) {
        return NextResponse.json({ error: repair.error ?? "Repair failed" }, { status: 400 });
      }

      const settings = await getJarvisSettings();
      const cmmLeads = (await getCmmLeadLedger())?.leads ?? [];
      const imveLedger = await getImveImportLedgerOrEmpty();
      let matchLedger = await getImveCmmMatchLedger();
      if (cmmLeads.length > 0 && imveLedger.jobs.length > 0) {
        matchLedger = runImveCmmMatching(cmmLeads, imveLedger.jobs, matchLedger);
        await saveImveCmmMatchLedger(matchLedger);
      }

      const intelligence = await loadCmmLeadIntelligence(settings, {
        imveMatchLedger: matchLedger,
      });
      const trace = await traceLead(body.query ?? "Carl");

      return NextResponse.json({ repair, intelligence, matchLedger, trace });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Trace action failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

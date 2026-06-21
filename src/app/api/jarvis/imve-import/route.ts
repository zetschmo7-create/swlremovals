import { NextResponse } from "next/server";
import { getJarvisSession } from "@/lib/jarvis/auth";
import {
  applyImveMatchReview,
  runImveCmmMatching,
} from "@/lib/jarvis/imve-cmm-match";
import {
  getImveCmmMatchLedger,
  saveImveCmmMatchLedger,
} from "@/lib/jarvis/imve-cmm-match-store";
import {
  confirmImveImport,
  createImveImportPreview,
  rematchImveImport,
  type ImveUploadedFile,
} from "@/lib/jarvis/imve-import";
import { buildImveImportDebug } from "@/lib/jarvis/imve-debug";
import { getImveImportLedgerOrEmpty } from "@/lib/jarvis/imve-store";
import { isImveRoiActive } from "@/lib/jarvis/imve-validate";
import { getCmmLeadLedger } from "@/lib/jarvis/cmm-lead-store";
import { getJarvisSettings } from "@/lib/jarvis/settings-store";
import { loadCmmLeadIntelligence } from "@/lib/jarvis/cmm-analytics";

export const maxDuration = 60;

export async function GET() {
  const authed = await getJarvisSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getJarvisSettings();
    const ledger = await getImveImportLedgerOrEmpty();
    const matchLedger = await getImveCmmMatchLedger();
    const cmmLeads = (await getCmmLeadLedger())?.leads ?? [];
    const debug = buildImveImportDebug(ledger, matchLedger, cmmLeads, settings);

    return NextResponse.json({
      ledger: {
        jobCount: ledger.jobs.length,
        invoiceCount: ledger.invoices.length,
        depositPaidCount: ledger.jobs.filter((j) => j.deposit_paid).length,
        bookedCount: ledger.jobs.filter((j) => j.booked).length,
        importedFiles: ledger.raw_files.length,
        lastImportAt: ledger.last_import_at,
        roiActive: isImveRoiActive(ledger),
        filenames: ledger.raw_files.map((f) => ({
          filename: f.filename,
          file_type: f.file_type,
          row_count: f.row_count,
          imported_at: f.imported_at,
        })),
      },
      matchLedger,
      debug,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Import status failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authed = await getJarvisSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const action = String(form.get("action") ?? "preview");
      if (action !== "preview") {
        return NextResponse.json({ error: "Invalid multipart action" }, { status: 400 });
      }

      const uploads: ImveUploadedFile[] = [];
      for (const entry of form.getAll("files")) {
        if (!(entry instanceof File)) continue;
        const buffer = Buffer.from(await entry.arrayBuffer());
        uploads.push({ filename: entry.name, buffer });
      }

      if (uploads.length === 0) {
        return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
      }

      const session = await createImveImportPreview(uploads);
      return NextResponse.json({ preview: session });
    }

    const body = (await request.json()) as {
      action?: string;
      sessionId?: string;
      leadId?: string;
    };
    const settings = await getJarvisSettings();
    const cmmLeads = (await getCmmLeadLedger())?.leads ?? [];

    if (body.action === "confirm" && body.sessionId) {
      const ledger = await confirmImveImport(body.sessionId, settings);
      const matchLedger = await getImveCmmMatchLedger();
      const intelligence = await loadCmmLeadIntelligence(settings, {
        imveMatchLedger: matchLedger,
      });
      const debug = buildImveImportDebug(ledger, matchLedger, cmmLeads, settings);
      return NextResponse.json({
        ledger: {
          jobCount: ledger.jobs.length,
          invoiceCount: ledger.invoices.length,
          depositPaidCount: ledger.jobs.filter((j) => j.deposit_paid).length,
          roiActive: ledger.roi_active,
        },
        matchLedger,
        intelligence,
        debug,
      });
    }

    if (body.action === "rematch" || body.action === "rebuild") {
      const { ledger, matchLedger } = await rematchImveImport(settings);
      const intelligence = await loadCmmLeadIntelligence(settings, {
        imveMatchLedger: matchLedger,
      });
      const debug = buildImveImportDebug(ledger, matchLedger, cmmLeads, settings);
      return NextResponse.json({ ledger, matchLedger, intelligence, debug });
    }

    if (
      (body.action === "approve" || body.action === "reject") &&
      body.leadId
    ) {
      let matchLedger = await getImveCmmMatchLedger();
      if (!matchLedger) {
        return NextResponse.json({ error: "No match ledger" }, { status: 404 });
      }
      const imveLedger = await getImveImportLedgerOrEmpty();
      matchLedger = applyImveMatchReview(
        matchLedger,
        body.leadId,
        body.action === "approve" ? "approve" : "reject",
        imveLedger.jobs
      );
      matchLedger = runImveCmmMatching(cmmLeads, imveLedger.jobs, matchLedger);
      await saveImveCmmMatchLedger(matchLedger);
      const intelligence = await loadCmmLeadIntelligence(settings, {
        imveMatchLedger: matchLedger,
      });
      const debug = buildImveImportDebug(
        imveLedger,
        matchLedger,
        cmmLeads,
        settings
      );
      return NextResponse.json({ matchLedger, intelligence, debug });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Import failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getJarvisSession } from "@/lib/jarvis/auth";
import { fetchPdfDiagnostics, testPdfAttachment } from "@/lib/jarvis/gmail";
import type { JarvisAccount, PdfDiagnosticEntry } from "@/lib/jarvis/types";
import type { PdfParseStatus } from "@/lib/jarvis/pdf-parser";

function groupEntries(entries: PdfDiagnosticEntry[]) {
  const groups: Record<PdfParseStatus, PdfDiagnosticEntry[]> = {
    parsed: [],
    needs_review: [],
    ignored_not_relevant: [],
    failed_relevant_pdf: [],
    missing: [],
  };

  for (const entry of entries) {
    groups[entry.status].push(entry);
  }

  return {
    parsedSuccessfully: groups.parsed,
    needsReview: [
      ...groups.needs_review,
      ...groups.missing,
      ...groups.failed_relevant_pdf,
    ],
    ignoredNotRelevant: groups.ignored_not_relevant,
    failedParsing: [] as PdfDiagnosticEntry[],
  };
}

export async function GET() {
  const authed = await getJarvisSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const entries = await fetchPdfDiagnostics(40);
    const sections = groupEntries(entries);

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      count: entries.length,
      summary: {
        parsed: sections.parsedSuccessfully.length,
        needsReview: sections.needsReview.length,
        ignored: sections.ignoredNotRelevant.length,
        failed: 0,
      },
      sections,
      entries,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "PDF diagnostics failed";
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
      account: JarvisAccount;
      messageId: string;
      attachmentId: string;
      filename: string;
      subject: string;
      from: string;
    };

    const result = await testPdfAttachment(
      body.account,
      body.messageId,
      body.attachmentId,
      body.filename,
      body.subject,
      body.from
    );

    return NextResponse.json({ result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "PDF test harness failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

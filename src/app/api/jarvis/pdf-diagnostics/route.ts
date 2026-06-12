import { NextResponse } from "next/server";
import { getJarvisSession } from "@/lib/jarvis/auth";
import { fetchPdfDiagnostics } from "@/lib/jarvis/gmail";

export async function GET() {
  const authed = await getJarvisSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const entries = await fetchPdfDiagnostics(20);
    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      count: entries.length,
      entries,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "PDF diagnostics failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

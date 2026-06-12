import type { Metadata } from "next";
import { getJarvisSession } from "@/lib/jarvis/auth";
import { PdfDiagnosticsGate } from "@/components/admin/jarvis/PdfDiagnosticsGate";

export const metadata: Metadata = {
  title: "Jarvis PDF Diagnostics",
  robots: { index: false, follow: false },
};

export default async function PdfDiagnosticsPage() {
  const authed = await getJarvisSession();
  return <PdfDiagnosticsGate initialAuthed={authed} />;
}

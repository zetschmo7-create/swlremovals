"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, RefreshCw } from "lucide-react";
import { LoginForm } from "@/components/admin/jarvis/LoginForm";
import type { PdfDiagnosticEntry } from "@/lib/jarvis/types";
import "@/app/admin/jarvis/jarvis-command.css";

function StatusBadge({ status }: { status: PdfDiagnosticEntry["status"] }) {
  const styles: Record<PdfDiagnosticEntry["status"], string> = {
    success: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    no_text: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    failed: "bg-red-500/20 text-red-300 border-red-500/30",
    missing: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider ${styles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function FieldGrid({ fields }: { fields: PdfDiagnosticEntry["fields"] }) {
  const rows = [
    ["Job ref", fields.jobReference],
    ["Customer", fields.customerName],
    ["Email", fields.customerEmail],
    ["Quote value", fields.quoteValue != null ? `£${fields.quoteValue}` : null],
    ["Deposit", fields.depositValue != null ? `£${fields.depositValue}` : null],
    ["Total", fields.totalValue != null ? `£${fields.totalValue}` : null],
    ["From postcode", fields.movingFromPostcode],
    ["To postcode", fields.movingToPostcode],
    ["Move date", fields.moveDate],
  ];

  return (
    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
      {rows.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="text-slate-500">{label}</dt>
          <dd className="text-slate-200">{value ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

export function PdfDiagnosticsGate({ initialAuthed }: { initialAuthed: boolean }) {
  const [authed, setAuthed] = useState(initialAuthed);
  const [entries, setEntries] = useState<PdfDiagnosticEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/jarvis/pdf-diagnostics");
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to load diagnostics");
      }
      const data = (await res.json()) as {
        entries: PdfDiagnosticEntry[];
        generatedAt: string;
      };
      setEntries(data.entries);
      setGeneratedAt(data.generatedAt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) void load();
  }, [authed, load]);

  if (!authed) {
    return <LoginForm onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="jarvis-shell jarvis-grid-bg min-h-dvh text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/jarvis"
              className="mb-3 inline-flex items-center gap-2 text-sm text-cyan-400/80 hover:text-cyan-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Jarvis
            </Link>
            <h1 className="font-display text-2xl font-semibold text-white">
              PDF Diagnostics
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Hidden debug view — last 20 PDFs Jarvis would process
            </p>
          </div>
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="jarvis-glass mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-200">
            {error}
          </div>
        )}

        {generatedAt && (
          <p className="mb-4 text-xs text-slate-500">
            Generated {new Date(generatedAt).toLocaleString("en-GB")}
          </p>
        )}

        {loading && entries.length === 0 ? (
          <div className="jarvis-glass rounded-xl p-12 text-center text-slate-500">
            Loading PDF diagnostics…
          </div>
        ) : entries.length === 0 ? (
          <div className="jarvis-glass rounded-xl p-12 text-center text-slate-500">
            No PDF attachments found in recent Gmail messages.
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry, i) => (
              <div key={`${entry.filename}-${entry.emailDate}-${i}`} className="jarvis-glass rounded-xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-900/40">
                      <FileText className="h-5 w-5 text-cyan-300" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{entry.filename}</p>
                      <p className="mt-0.5 text-sm text-slate-400">{entry.emailSubject}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {entry.account} · {entry.emailDate || "Unknown date"}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={entry.status} />
                </div>
                <FieldGrid fields={entry.fields} />
                <p className="mt-3 rounded-lg bg-black/30 px-3 py-2 font-mono text-xs text-slate-400">
                  {entry.log}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

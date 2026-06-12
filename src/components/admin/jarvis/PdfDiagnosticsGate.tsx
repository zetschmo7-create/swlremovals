"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp, FileText, RefreshCw } from "lucide-react";
import { LoginForm } from "@/components/admin/jarvis/LoginForm";
import type { PdfDiagnosticEntry } from "@/lib/jarvis/types";
import type { PdfParseStatus } from "@/lib/jarvis/pdf-parser";
import "@/app/admin/jarvis/jarvis-command.css";

type DiagnosticSections = {
  parsedSuccessfully: PdfDiagnosticEntry[];
  needsReview: PdfDiagnosticEntry[];
  ignoredNotRelevant: PdfDiagnosticEntry[];
  failedParsing: PdfDiagnosticEntry[];
};

type DiagnosticSummary = {
  parsed: number;
  needsReview: number;
  ignored: number;
  failed: number;
};

function StatusBadge({ status }: { status: PdfParseStatus }) {
  const styles: Record<PdfParseStatus, string> = {
    parsed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    needs_review: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    ignored_not_relevant: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    failed_relevant_pdf: "bg-red-500/20 text-red-300 border-red-500/30",
    missing: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  };
  const labels: Record<PdfParseStatus, string> = {
    parsed: "parsed",
    needs_review: "needs review",
    ignored_not_relevant: "ignored",
    failed_relevant_pdf: "failed",
    missing: "missing",
  };
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider ${styles[status]}`}
    >
      {labels[status]}
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

function PdfCard({ entry }: { entry: PdfDiagnosticEntry }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="jarvis-glass rounded-xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-900/40">
            <FileText className="h-5 w-5 text-cyan-300" />
          </div>
          <div>
            <p className="font-medium text-white">{entry.filename}</p>
            <p className="mt-0.5 text-sm text-slate-400">{entry.emailSubject}</p>
            <p className="mt-1 text-xs text-slate-500">
              {entry.account} · {entry.emailFrom || "Unknown sender"} ·{" "}
              {entry.emailDate || "Unknown date"}
            </p>
            {entry.category && (
              <p className="mt-1 text-xs text-cyan-400/80">
                Category: {entry.category.replace(/_/g, " ")}
              </p>
            )}
          </div>
        </div>
        <StatusBadge status={entry.status} />
      </div>

      <p className="mt-3 text-sm text-slate-400">{entry.reason}</p>

      {entry.status !== "ignored_not_relevant" && (
        <>
          <p className="mt-2 text-xs text-slate-500">
            Extracted text: {entry.textLength} characters
          </p>
          <FieldGrid fields={entry.fields} />
        </>
      )}

      {entry.textPreview && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
          >
            {expanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
            {expanded ? "Hide" : "Show"} text preview (first 500 chars)
          </button>
          {expanded && (
            <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-black/40 p-3 font-mono text-xs text-slate-300 whitespace-pre-wrap">
              {entry.textPreview}
            </pre>
          )}
        </div>
      )}

      <p className="mt-3 rounded-lg bg-black/30 px-3 py-2 font-mono text-xs text-slate-500">
        {entry.log}
      </p>
    </div>
  );
}

function SectionBlock({
  title,
  subtitle,
  entries,
  emptyMessage,
}: {
  title: string;
  subtitle: string;
  entries: PdfDiagnosticEntry[];
  emptyMessage: string;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
        <p className="text-sm text-slate-500">
          {subtitle} ({entries.length})
        </p>
      </div>
      {entries.length === 0 ? (
        <div className="jarvis-glass rounded-xl p-6 text-center text-sm text-slate-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, i) => (
            <PdfCard key={`${entry.filename}-${entry.emailDate}-${i}`} entry={entry} />
          ))}
        </div>
      )}
    </section>
  );
}

export function PdfDiagnosticsGate({ initialAuthed }: { initialAuthed: boolean }) {
  const [authed, setAuthed] = useState(initialAuthed);
  const [sections, setSections] = useState<DiagnosticSections | null>(null);
  const [summary, setSummary] = useState<DiagnosticSummary | null>(null);
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
        sections: DiagnosticSections;
        summary: DiagnosticSummary;
        generatedAt: string;
      };
      setSections(data.sections);
      setSummary(data.summary);
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
              Ryan/I-MVE operational PDFs only — irrelevant attachments are ignored
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

        {summary && (
          <div className="mb-8 grid gap-4 sm:grid-cols-4">
            {[
              ["Parsed", summary.parsed, "text-emerald-300"],
              ["Needs review", summary.needsReview, "text-amber-300"],
              ["Ignored", summary.ignored, "text-slate-400"],
              ["Failed", summary.failed, "text-red-300"],
            ].map(([label, value, color]) => (
              <div key={label as string} className="jarvis-glass rounded-xl p-4">
                <p className="text-xs uppercase tracking-widest text-slate-500">
                  {label as string}
                </p>
                <p className={`mt-1 text-2xl font-semibold tabular-nums ${color as string}`}>
                  {value as number}
                </p>
              </div>
            ))}
          </div>
        )}

        {generatedAt && (
          <p className="mb-6 text-xs text-slate-500">
            Generated {new Date(generatedAt).toLocaleString("en-GB")}
          </p>
        )}

        {loading && !sections ? (
          <div className="jarvis-glass rounded-xl p-12 text-center text-slate-500">
            Loading PDF diagnostics…
          </div>
        ) : sections ? (
          <div className="space-y-10">
            <SectionBlock
              title="A. Parsed Successfully"
              subtitle="Whitelisted Ryan/I-MVE PDFs with readable text"
              entries={sections.parsedSuccessfully}
              emptyMessage="No successfully parsed operational PDFs in recent mail."
            />
            <SectionBlock
              title="B. Needs Review"
              subtitle="Relevant PDFs with short/missing text — OCR may be required"
              entries={sections.needsReview}
              emptyMessage="No operational PDFs needing review."
            />
            <SectionBlock
              title="C. Ignored as Not Relevant"
              subtitle="Google invoices, settlements, competitors, and other non-Ryan PDFs"
              entries={sections.ignoredNotRelevant}
              emptyMessage="No ignored PDFs in recent scan."
            />
            <SectionBlock
              title="D. Failed Parsing"
              subtitle="Whitelisted PDFs where text extraction failed"
              entries={sections.failedParsing}
              emptyMessage="No failed relevant PDFs — good."
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

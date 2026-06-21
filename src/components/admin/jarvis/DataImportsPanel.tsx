"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FileUp, Upload } from "lucide-react";
import type {
  CmmLeadIntelligence,
  JarvisBriefing,
} from "@/lib/jarvis/types";
import type {
  ImveCmmMatchLedger,
  ImveFilePreview,
  ImveImportPreviewSession,
} from "@/lib/jarvis/imve-types";
import { Section } from "./jarvis-ui";

const FILE_TYPE_LABELS: Record<string, string> = {
  jobs: "Jobs export",
  job_invoices: "Job invoices",
  deposit_invoices: "Deposit invoices",
  custom_invoices: "Custom invoices",
  unknown: "Unknown",
};

export function DataImportsPanel({
  briefing,
  onRefresh,
}: {
  briefing: JarvisBriefing;
  onRefresh?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<
    "preview" | "import" | "rematch" | "review" | null
  >(null);
  const [preview, setPreview] = useState<ImveImportPreviewSession | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [localIntel, setLocalIntel] = useState<CmmLeadIntelligence | null>(null);
  const [matchLedger, setMatchLedger] = useState<ImveCmmMatchLedger | null>(
    null
  );
  const [matchSamples, setMatchSamples] = useState<
    Array<{
      lead_id: string;
      job_reference: string | null;
      confidence: number;
      reason: string | null;
      status: string;
      deposit_paid: boolean;
    }>
  >([]);

  const intel = localIntel ?? briefing.cmmLeadIntelligence;
  const imveSummary = intel.imveImportSummary;

  useEffect(() => {
    void fetch("/api/jarvis/imve-import")
      .then((res) => (res.ok ? res.json() : null))
      .then(
        (
          json: {
            matchLedger?: ImveCmmMatchLedger;
            matchSamples?: typeof matchSamples;
          } | null
        ) => {
          if (json?.matchLedger) setMatchLedger(json.matchLedger);
          if (json?.matchSamples) setMatchSamples(json.matchSamples);
        }
      )
      .catch(() => {});
  }, [intel.imveImportSummary?.jobCount]);

  const onFilesSelected = useCallback((files: FileList | null) => {
    if (!files) return;
    setSelectedFiles([...files]);
    setPreview(null);
    setError(null);
  }, []);

  const runPreview = useCallback(async () => {
    if (selectedFiles.length === 0) return;
    setBusy("preview");
    setError(null);
    try {
      const form = new FormData();
      form.set("action", "preview");
      for (const file of selectedFiles) {
        form.append("files", file);
      }
      const res = await fetch("/api/jarvis/imve-import", {
        method: "POST",
        body: form,
      });
      const json = (await res.json()) as {
        preview?: ImveImportPreviewSession;
        error?: string;
      };
      if (!res.ok) throw new Error(json.error ?? "Preview failed");
      setPreview(json.preview ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Preview failed");
    } finally {
      setBusy(null);
    }
  }, [selectedFiles]);

  const confirmImport = useCallback(async () => {
    if (!preview?.session_id) return;
    setBusy("import");
    setError(null);
    try {
      const res = await fetch("/api/jarvis/imve-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "confirm",
          sessionId: preview.session_id,
        }),
      });
      const json = (await res.json()) as {
        intelligence?: CmmLeadIntelligence;
        matchLedger?: ImveCmmMatchLedger;
        error?: string;
      };
      if (!res.ok) throw new Error(json.error ?? "Import failed");
      setLocalIntel(json.intelligence ?? null);
      setMatchLedger(json.matchLedger ?? null);
      setPreview(null);
      setSelectedFiles([]);
      onRefresh?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setBusy(null);
    }
  }, [onRefresh, preview?.session_id]);

  const runRematch = useCallback(async () => {
    setBusy("rematch");
    setError(null);
    try {
      const res = await fetch("/api/jarvis/imve-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rematch" }),
      });
      const json = (await res.json()) as {
        intelligence?: CmmLeadIntelligence;
        matchLedger?: ImveCmmMatchLedger;
        error?: string;
      };
      if (!res.ok) throw new Error(json.error ?? "Rematch failed");
      setLocalIntel(json.intelligence ?? null);
      setMatchLedger(json.matchLedger ?? null);
      onRefresh?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Rematch failed");
    } finally {
      setBusy(null);
    }
  }, [onRefresh]);

  const runReview = useCallback(
    async (leadId: string, decision: "approve" | "reject") => {
      setBusy("review");
      setError(null);
      try {
        const res = await fetch("/api/jarvis/imve-import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: decision, leadId }),
        });
        const json = (await res.json()) as {
          intelligence?: CmmLeadIntelligence;
          matchLedger?: ImveCmmMatchLedger;
          error?: string;
        };
        if (!res.ok) throw new Error(json.error ?? "Review failed");
        setLocalIntel(json.intelligence ?? null);
        setMatchLedger(json.matchLedger ?? null);
        onRefresh?.();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Review failed");
      } finally {
        setBusy(null);
      }
    },
    [onRefresh]
  );

  const reviewQueue = matchLedger?.reviewQueue ?? [];

  return (
    <Section
      title="Data Imports"
      subtitle="Import i-MVE CSV/Excel exports for authoritative jobs, invoices, and ROI matching"
    >
      <div className="jarvis-glass rounded-xl p-5">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".csv,.xlsx,.xls,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="hidden"
            onChange={(e) => onFilesSelected(e.target.files)}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5"
          >
            <FileUp className="h-4 w-4" />
            Choose files
          </button>
          <button
            type="button"
            disabled={selectedFiles.length === 0 || busy !== null}
            onClick={() => void runPreview()}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-900/60 px-4 py-2.5 text-sm font-medium text-cyan-100 hover:bg-cyan-800/60 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {busy === "preview" ? "Parsing…" : "Preview import"}
          </button>
          {imveSummary && (
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => void runRematch()}
              className="rounded-lg border border-cyan-500/30 px-4 py-2.5 text-sm text-cyan-200 hover:bg-cyan-950/40 disabled:opacity-50"
            >
              {busy === "rematch" ? "Matching…" : "Rematch i-MVE → CMM"}
            </button>
          )}
        </div>

        {selectedFiles.length > 0 && (
          <p className="mb-3 text-sm text-slate-400">
            {selectedFiles.length} file(s) selected:{" "}
            {selectedFiles.map((f) => f.name).join(", ")}
          </p>
        )}

        {error && (
          <p className="mb-3 text-sm text-red-300/90">{error}</p>
        )}

        {imveSummary && (
          <div className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-4 text-sm">
            <p className="text-emerald-200">
              i-MVE data loaded: {imveSummary.jobCount} jobs,{" "}
              {imveSummary.depositPaidCount} with deposits paid.
              {imveSummary.usingImveForRoi && (
                <span className="block mt-1 text-emerald-300/80">
                  Area ROI is using matched i-MVE deposit data.
                </span>
              )}
            </p>
            <p className="mt-1 text-slate-400">
              Auto-matched: {imveSummary.matchStats.autoMatched} · Needs review:{" "}
              {imveSummary.matchStats.needsReview} · Unmatched leads:{" "}
              {imveSummary.matchStats.unmatched}
            </p>
          </div>
        )}

        {preview && (
          <div className="space-y-4">
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-4 text-sm">
              <p className="text-cyan-200">
                Normalized: {preview.summary.normalized_jobs} jobs,{" "}
                {preview.summary.normalized_invoices} invoices
              </p>
              {preview.summary.warnings.length > 0 && (
                <ul className="mt-2 space-y-1 text-xs text-amber-300/90">
                  {preview.summary.warnings.map((w) => (
                    <li key={w}>• {w}</li>
                  ))}
                </ul>
              )}
              {!preview.summary.can_confirm && (
                <p className="mt-2 text-xs text-red-300/90">
                  Confirm is blocked until valid normalized data is detected (or
                  use Rematch if files were already imported).
                </p>
              )}
            </div>
            {preview.files.map((file) => (
              <FilePreviewCard key={file.file_hash} file={file} />
            ))}
            <div className="flex gap-3">
              <button
                type="button"
                disabled={busy !== null || !preview.summary.can_confirm}
                onClick={() => void confirmImport()}
                className="rounded-lg bg-emerald-900/60 px-4 py-2.5 text-sm font-medium text-emerald-100 hover:bg-emerald-800/60 disabled:opacity-50"
              >
                {busy === "import" ? "Importing…" : "Confirm import"}
              </button>
              <button
                type="button"
                disabled={busy !== null}
                onClick={() => {
                  setPreview(null);
                  setError(null);
                }}
                className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-slate-400 hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {matchSamples.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-xs uppercase tracking-widest text-slate-500">
              Match debug (auto-matched sample)
            </p>
            <ul className="space-y-1 text-xs text-slate-400">
              {matchSamples.map((m) => (
                <li key={m.lead_id}>
                  <span className="text-slate-300">{m.job_reference ?? m.lead_id.slice(0, 8)}</span>
                  {" · "}
                  {m.confidence}% · {m.reason ?? "—"}
                  {m.deposit_paid && (
                    <span className="text-emerald-400"> · deposit</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {reviewQueue.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-xs uppercase tracking-widest text-amber-400/80">
              i-MVE match review queue ({reviewQueue.length})
            </p>
            <ul className="space-y-3">
              {reviewQueue.map((item) => (
                <li
                  key={item.lead_id}
                  className="rounded-lg border border-white/5 bg-black/20 p-3 text-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">
                        CMM lead: {item.lead_name ?? "Unknown"}
                      </p>
                      <p className="text-xs text-slate-500">
                        → i-MVE {item.candidate_job_reference ?? item.candidate_imve_job_id}
                        {item.candidate_deposit_paid && (
                          <span className="text-emerald-400"> · deposit paid</span>
                        )}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Confidence {item.confidence}% · {item.match_reason}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={busy !== null}
                        onClick={() => void runReview(item.lead_id, "approve")}
                        className="rounded-lg bg-emerald-900/50 px-3 py-1.5 text-xs text-emerald-200"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={busy !== null}
                        onClick={() => void runReview(item.lead_id, "reject")}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-4 text-xs text-slate-500">
          Upload your four i-MVE exports together: jobs, job invoices, deposit
          invoices, and custom invoices. Re-uploading the same file will not
          duplicate records. Raw rows are stored for audit in Jarvis KV only.
        </p>
      </div>
    </Section>
  );
}

function FilePreviewCard({ file }: { file: ImveFilePreview }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium text-white">{file.filename}</p>
        <span className="rounded-full border border-cyan-500/30 px-2 py-0.5 text-xs text-cyan-300">
          {FILE_TYPE_LABELS[file.file_type] ?? file.file_type}
        </span>
      </div>
      <dl className="grid gap-1 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-slate-500">Rows</dt>
          <dd className="text-white tabular-nums">{file.row_count}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Normalized</dt>
          <dd className="text-white tabular-nums">
            {file.normalized_job_count} jobs / {file.normalized_invoice_count}{" "}
            inv
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Status</dt>
          <dd className={file.already_imported ? "text-amber-300" : "text-emerald-300"}>
            {file.already_imported ? "Already imported (will skip)" : "New file"}
          </dd>
        </div>
        {file.file_type === "unknown" && (
          <div>
            <dt className="text-slate-500">Type</dt>
            <dd className="text-amber-300">Unknown — ROI won&apos;t update</dd>
          </div>
        )}
      </dl>
      <p className="mt-2 text-xs text-slate-500">
        Columns: {file.columns.slice(0, 12).join(", ")}
        {file.columns.length > 12 ? ` (+${file.columns.length - 12} more)` : ""}
      </p>
      {file.parse_warnings.length > 0 && (
        <p className="mt-2 text-xs text-amber-300/90">
          {file.parse_warnings.join(" ")}
        </p>
      )}
      {file.sample_rows.length > 0 && (
        <div className="mt-3 overflow-x-auto">
          <p className="mb-1 text-xs uppercase tracking-widest text-slate-500">
            Sample rows (masked)
          </p>
          <table className="min-w-full text-left text-xs">
            <thead>
              <tr className="text-slate-500">
                {file.columns.slice(0, 6).map((col) => (
                  <th key={col} className="pr-3 pb-1 font-normal">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {file.sample_rows.map((row, i) => (
                <tr key={i} className="border-t border-white/5 text-slate-300">
                  {file.columns.slice(0, 6).map((col) => (
                    <td key={col} className="pr-3 py-1">
                      {row[col] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

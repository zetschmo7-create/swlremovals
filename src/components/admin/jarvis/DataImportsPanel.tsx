"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FileUp, Upload } from "lucide-react";
import type {
  CmmLeadIntelligence,
  JarvisBriefing,
} from "@/lib/jarvis/types";
import type {
  ImveCmmMatchLedger,
  ImveFileMappingDebug,
  ImveFilePreview,
  ImveImportDebug,
  ImveImportPreviewSession,
  ImveRoiEligibilityDebug,
} from "@/lib/jarvis/imve-types";
import { formatCurrency, formatPct, Section } from "./jarvis-ui";

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
  const [debug, setDebug] = useState<ImveImportDebug | null>(null);

  const intel = localIntel ?? briefing.cmmLeadIntelligence;
  const imveSummary = intel.imveImportSummary;

  useEffect(() => {
    void fetch("/api/jarvis/imve-import")
      .then((res) => (res.ok ? res.json() : null))
      .then(
        (
          json: {
            matchLedger?: ImveCmmMatchLedger;
            debug?: ImveImportDebug;
          } | null
        ) => {
          if (json?.matchLedger) setMatchLedger(json.matchLedger);
          if (json?.debug) setDebug(json.debug);
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
        debug?: ImveImportDebug;
        error?: string;
      };
      if (!res.ok) throw new Error(json.error ?? "Import failed");
      setLocalIntel(json.intelligence ?? null);
      setMatchLedger(json.matchLedger ?? null);
      if (json.debug) setDebug(json.debug);
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
        debug?: ImveImportDebug;
        error?: string;
      };
      if (!res.ok) throw new Error(json.error ?? "Rematch failed");
      setLocalIntel(json.intelligence ?? null);
      setMatchLedger(json.matchLedger ?? null);
      if (json.debug) setDebug(json.debug);
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
          debug?: ImveImportDebug;
          error?: string;
        };
        if (!res.ok) throw new Error(json.error ?? "Review failed");
        setLocalIntel(json.intelligence ?? null);
        setMatchLedger(json.matchLedger ?? null);
        if (json.debug) setDebug(json.debug);
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
            {preview.mapping_debug.length > 0 && (
              <ImveMappingDebugSection
                title="i-MVE import preview — column mapping"
                files={preview.mapping_debug}
              />
            )}
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

        {debug && <ImveImportDebugPanel debug={debug} />}

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

function ImveMappingDebugSection({
  title,
  files,
  warnings,
  matchingCounts,
  sampleMatches,
}: {
  title: string;
  files: ImveFileMappingDebug[];
  warnings?: string[];
  matchingCounts?: ImveImportDebug["matching_counts"];
  sampleMatches?: ImveImportDebug["sample_matches"];
}) {
  return (
    <div className="mt-6 space-y-4">
      <p className="text-xs uppercase tracking-widest text-cyan-400/90">{title}</p>

      {warnings && warnings.length > 0 && (
        <ul className="space-y-1 rounded-lg border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-200">
          {warnings.map((w) => (
            <li key={w}>• {w}</li>
          ))}
        </ul>
      )}

      {matchingCounts && (
        <dl className="grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-slate-500">CMM leads</dt>
            <dd className="text-white tabular-nums">{matchingCounts.total_cmm_leads}</dd>
          </div>
          <div>
            <dt className="text-slate-500">i-MVE jobs</dt>
            <dd className="text-white tabular-nums">{matchingCounts.total_imve_jobs}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Auto-matched</dt>
            <dd className="text-emerald-300 tabular-nums">{matchingCounts.auto_matched}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Deposits linked</dt>
            <dd className="text-white tabular-nums">
              {matchingCounts.deposits_linked} / {matchingCounts.deposits}
            </dd>
          </div>
        </dl>
      )}

      {files.map((file) => (
        <FileMappingDebugCard key={file.filename} file={file} />
      ))}

      {sampleMatches && sampleMatches.length > 0 && (
        <div className="rounded-lg border border-white/10 bg-black/20 p-4">
          <p className="mb-3 text-xs uppercase tracking-widest text-slate-500">
            Sample CMM lead matching (newest 10)
          </p>
          <ul className="space-y-3 text-xs">
            {sampleMatches.map((s) => (
              <li key={s.lead_id} className="border-t border-white/5 pt-3 first:border-0 first:pt-0">
                <p className="text-slate-300">
                  {s.lead_name ?? "Unknown"} · {s.lead_email ?? "no email"} ·{" "}
                  <span className="text-slate-500">{s.match_status}</span>
                </p>
                {s.explanation && (
                  <p className="mt-1 text-amber-300/90">{s.explanation}</p>
                )}
                {s.candidates.length > 0 && (
                  <ul className="mt-1 space-y-1 text-slate-500">
                    {s.candidates.map((c) => (
                      <li key={c.imve_job_id}>
                        → {c.job_reference ?? c.imve_job_id} · {c.customer_name ?? "—"} ·{" "}
                        {c.confidence}% · {c.reasons.join(", ")}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const MAPPING_FIELDS = [
  "job_reference",
  "customer_name",
  "email",
  "phone",
  "collection_postcode",
  "delivery_postcode",
  "move_date",
  "status",
  "quote_value",
  "deposit_amount",
  "invoice_total",
  "deposit_paid_date",
] as const;

function FileMappingDebugCard({ file }: { file: ImveFileMappingDebug }) {
  const hasZeroNormalized =
    file.normalized_job_count === 0 && file.normalized_invoice_count === 0;

  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium text-white">{file.filename}</p>
        <span className="rounded-full border border-cyan-500/30 px-2 py-0.5 text-xs text-cyan-300">
          {FILE_TYPE_LABELS[file.file_type] ?? file.file_type}
        </span>
      </div>

      <dl className="mb-3 grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-slate-500">Raw rows</dt>
          <dd className="text-white tabular-nums">{file.raw_row_count}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Normalized jobs</dt>
          <dd className="text-white tabular-nums">{file.normalized_job_count}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Normalized invoices</dt>
          <dd className="text-white tabular-nums">{file.normalized_invoice_count}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Usable rows</dt>
          <dd
            className={
              file.usable_row_count === 0 ? "text-amber-300 tabular-nums" : "text-emerald-300 tabular-nums"
            }
          >
            {file.usable_row_count}
          </dd>
        </div>
      </dl>

      <p className="mb-2 text-xs text-slate-400">
        <span className="text-slate-500">Actual CSV headers: </span>
        {file.headers.join(" · ")}
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead>
            <tr className="text-slate-500">
              <th className="pr-4 pb-2 font-normal">Normalized field</th>
              <th className="pr-4 pb-2 font-normal">Mapped CSV column</th>
              <th className="pb-2 font-normal">First row value</th>
            </tr>
          </thead>
          <tbody>
            {MAPPING_FIELDS.map((field) => {
              const column = file.field_mapping[field];
              const value = file.first_row_mapped[field];
              return (
                <tr key={field} className="border-t border-white/5">
                  <td className="py-1.5 pr-4 text-slate-400">{field}</td>
                  <td
                    className={`py-1.5 pr-4 ${column ? "text-cyan-200" : "text-red-300/90"}`}
                  >
                    {column ?? "— not mapped"}
                  </td>
                  <td className="py-1.5 text-slate-300">{value || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {file.unmapped_headers.length > 0 && (
        <p className="mt-3 text-xs text-slate-500">
          Unmapped headers: {file.unmapped_headers.join(", ")}
        </p>
      )}

      {(hasZeroNormalized || file.usable_row_count === 0) &&
        file.missing_required_fields.length > 0 && (
          <div className="mt-3 rounded border border-red-500/30 bg-red-950/20 p-3 text-xs text-red-200">
            <p className="font-medium">Missing / blocking fields:</p>
            <ul className="mt-1 list-inside list-disc">
              {file.missing_required_fields.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
}

function ImveRoiEligibilitySection({ roi }: { roi: ImveRoiEligibilityDebug }) {
  const t = roi.totals;
  const reasonLabels: Record<string, string> = {
    no_match: "No CMM match record",
    status_needs_review: "Needs review — approve to include in ROI",
    status_rejected: "Rejected",
    status_unmatched: "Unmatched",
    status_not_eligible: "Match status not eligible (must be auto_matched or approved)",
    missing_imve_job_id: "No linked i-MVE job id",
    imve_job_not_found: "Linked i-MVE job not found in import ledger",
    no_deposit_or_value: "No deposit paid and no turnover/quote value on job",
  };

  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-widest text-slate-500">
        5. ROI eligibility (CMM area table handoff)
      </p>
      {!roi.using_imve_for_roi && (
        <p className="mb-2 text-xs text-amber-300">
          i-MVE ROI inactive — area table uses Gmail job matching until i-MVE import is confirmed.
        </p>
      )}
      <dl className="mb-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-slate-500">Total i-MVE matches</dt>
          <dd className="text-white tabular-nums">{t.total_matches}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Auto-matched</dt>
          <dd className="text-emerald-300 tabular-nums">{t.auto_matched}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Manually approved</dt>
          <dd className="text-cyan-300 tabular-nums">{t.manually_approved}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Needs review</dt>
          <dd className="text-amber-300 tabular-nums">{t.needs_review}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Rejected</dt>
          <dd className="text-rose-300 tabular-nums">{t.rejected}</dd>
        </div>
        <div>
          <dt className="text-slate-500">deposit_paid = true</dt>
          <dd className="text-white tabular-nums">{t.with_deposit_paid}</dd>
        </div>
        <div>
          <dt className="text-slate-500">deposit_amount &gt; 0</dt>
          <dd className="text-white tabular-nums">{t.with_deposit_amount}</dd>
        </div>
        <div>
          <dt className="text-slate-500">turnover_value &gt; 0</dt>
          <dd className="text-white tabular-nums">{t.with_turnover_value}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Included in ROI</dt>
          <dd className="text-emerald-300 tabular-nums">{t.included_in_roi}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Excluded from ROI</dt>
          <dd className="text-slate-400 tabular-nums">{t.excluded_from_roi}</dd>
        </div>
      </dl>

      {roi.excluded_samples.length > 0 && (
        <div className="mb-4">
          <p className="mb-1 text-xs text-slate-500">Exclusion samples</p>
          <ul className="space-y-1 text-xs text-slate-400">
            {roi.excluded_samples.map((e, i) => (
              <li key={`${e.lead_name}-${i}`}>
                {e.lead_name ?? "Unknown"} · {e.match_status} ·{" "}
                {reasonLabels[e.reason] ?? e.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4 overflow-x-auto">
        <p className="mb-2 text-xs text-slate-500">Per postcode area</p>
        <table className="min-w-full text-left text-xs">
          <thead>
            <tr className="text-slate-500">
              <th className="pr-3 pb-1 font-normal">Area</th>
              <th className="pr-3 pb-1 font-normal">Matched leads</th>
              <th className="pr-3 pb-1 font-normal">Usable ROI</th>
              <th className="pr-3 pb-1 font-normal">Deposits</th>
              <th className="pr-3 pb-1 font-normal">Booked</th>
              <th className="pr-3 pb-1 font-normal">Turnover</th>
              <th className="pr-3 pb-1 font-normal">Commission</th>
              <th className="pr-3 pb-1 font-normal">ROI</th>
            </tr>
          </thead>
          <tbody>
            {roi.by_area
              .filter(
                (a) =>
                  a.cmm_leads_in_area > 0 ||
                  a.usable_roi_matches > 0 ||
                  a.matched_cmm_leads > 0
              )
              .map((a) => (
                <tr key={a.area} className="border-t border-white/5 text-slate-300">
                  <td className="pr-3 py-1 font-medium text-cyan-300">{a.area}</td>
                  <td className="pr-3 py-1 tabular-nums">{a.matched_cmm_leads}</td>
                  <td className="pr-3 py-1 tabular-nums">{a.usable_roi_matches}</td>
                  <td className="pr-3 py-1 tabular-nums">{a.deposit_jobs_counted}</td>
                  <td className="pr-3 py-1 tabular-nums">{a.booked_jobs_counted}</td>
                  <td className="pr-3 py-1 tabular-nums">
                    {a.turnover_summed > 0
                      ? formatCurrency(a.turnover_summed)
                      : "—"}
                  </td>
                  <td className="pr-3 py-1 tabular-nums">
                    {a.commission_summed > 0
                      ? formatCurrency(a.commission_summed)
                      : "—"}
                  </td>
                  <td className="py-1">
                    {a.roi_value != null ? (
                      <span title={a.roi_formula}>{formatPct(a.roi_value)}</span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {roi.match_evaluations.length > 0 && (
        <div>
          <p className="mb-2 text-xs text-slate-500">Match include / exclude detail</p>
          <ul className="max-h-64 space-y-2 overflow-y-auto text-xs">
            {roi.match_evaluations.map((e) => (
              <li
                key={e.lead_id}
                className={`rounded border p-2 ${
                  e.included
                    ? "border-emerald-500/20 bg-emerald-950/20"
                    : "border-white/5 bg-black/20"
                }`}
              >
                <p className="font-medium text-white">
                  {e.lead_name ?? "Unknown"} · {e.area} · {e.match_status}
                  {e.job_reference ? ` · ${e.job_reference}` : ""}
                </p>
                <p className={e.included ? "text-emerald-300" : "text-amber-300"}>
                  {e.included
                    ? "Included in ROI"
                    : reasonLabels[e.exclusion_reason ?? ""] ??
                      e.exclusion_reason ??
                      "Excluded"}
                </p>
                {e.included && (
                  <p className="text-slate-500">
                    Deposit: {e.deposit_paid ? "yes" : "no"}
                    {e.deposit_amount != null
                      ? ` (${formatCurrency(e.deposit_amount)})`
                      : ""}
                    · Turnover:{" "}
                    {formatCurrency(e.turnover_value ?? e.quote_value ?? 0)}
                    · Commission: {formatCurrency(e.commission_value ?? 0)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ImveImportDebugPanel({ debug }: { debug: ImveImportDebug }) {
  const { import_counts: ic, matching_counts: mc } = debug;

  return (
    <div className="mt-6 space-y-5 rounded-lg border border-violet-500/20 bg-violet-950/10 p-4">
      <p className="text-xs uppercase tracking-widest text-violet-300/80">
        i-MVE Import + Matching Debug
      </p>

      {debug.warnings.length > 0 && (
        <ul className="space-y-1 text-sm text-amber-300/90">
          {debug.warnings.map((w) => (
            <li key={w}>⚠ {w}</li>
          ))}
        </ul>
      )}

      <div>
        <p className="mb-2 text-xs uppercase tracking-widest text-slate-500">
          1. Import counts
        </p>
        <dl className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-slate-500">Files</dt>
            <dd className="text-white tabular-nums">{ic.files_uploaded}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Jobs</dt>
            <dd className="text-white tabular-nums">{ic.normalized_jobs}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Deposits</dt>
            <dd className="text-white tabular-nums">{ic.normalized_deposits}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Job / custom invoices</dt>
            <dd className="text-white tabular-nums">
              {ic.normalized_job_invoices} / {ic.normalized_custom_invoices}
            </dd>
          </div>
        </dl>
        {ic.raw_rows_per_file.length > 0 && (
          <ul className="mt-2 space-y-1 text-xs text-slate-400">
            {ic.raw_rows_per_file.map((f) => (
              <li key={f.filename}>
                {f.filename} ({FILE_TYPE_LABELS[f.file_type] ?? f.file_type}):{" "}
                {f.row_count} rows
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <p className="mb-2 text-xs uppercase tracking-widest text-slate-500">
          2. Field mapping
        </p>
        {Object.keys(debug.field_mapping).length === 0 ? (
          <p className="text-xs text-slate-500">No column mappings stored yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead>
                <tr className="text-slate-500">
                  <th className="pr-4 pb-1 font-normal">Normalized field</th>
                  <th className="pb-1 font-normal">CSV header</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(debug.field_mapping).map(([field, header]) => (
                  <tr key={field} className="border-t border-white/5 text-slate-300">
                    <td className="pr-4 py-1">{field}</td>
                    <td className="py-1 text-cyan-300">{header}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <p className="mb-2 text-xs uppercase tracking-widest text-slate-500">
          3. Matching counts
        </p>
        <dl className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-slate-500">CMM leads</dt>
            <dd className="text-white tabular-nums">{mc.total_cmm_leads}</dd>
          </div>
          <div>
            <dt className="text-slate-500">i-MVE jobs</dt>
            <dd className="text-white tabular-nums">{mc.total_imve_jobs}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Auto-matched</dt>
            <dd className="text-emerald-300 tabular-nums">{mc.auto_matched}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Needs review</dt>
            <dd className="text-amber-300 tabular-nums">{mc.needs_review}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Unmatched</dt>
            <dd className="text-slate-300 tabular-nums">{mc.unmatched}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Deposits linked</dt>
            <dd className="text-white tabular-nums">
              {mc.deposits_linked} / {mc.deposits}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Jobs with value</dt>
            <dd className="text-white tabular-nums">{mc.jobs_with_value}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Jobs missing value</dt>
            <dd className="text-slate-400 tabular-nums">{mc.jobs_missing_value}</dd>
          </div>
        </dl>
      </div>

      <div>
        <p className="mb-2 text-xs uppercase tracking-widest text-slate-500">
          4. Sample match debugging (10 newest leads)
        </p>
        <ul className="space-y-3">
          {debug.sample_matches.map((sample) => (
            <li
              key={sample.lead_id}
              className="rounded-lg border border-white/5 bg-black/20 p-3 text-xs"
            >
              <p className="font-medium text-white">
                {sample.lead_name ?? "Unknown"}{" "}
                <span className="text-slate-500">
                  ({sample.lead_email ?? "no email"})
                </span>
              </p>
              <p className="mt-1 text-slate-500">
                Status: {sample.match_status} · {sample.explanation}
              </p>
              {sample.candidates.length > 0 && (
                <ul className="mt-2 space-y-1 text-slate-400">
                  {sample.candidates.map((c, i) => (
                    <li key={c.imve_job_id}>
                      #{i + 1}{" "}
                      {c.job_reference ?? c.imve_job_id} — {c.customer_name ?? "?"}{" "}
                      · {c.confidence}% · {c.reasons.join(", ") || "—"}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      <ImveRoiEligibilitySection roi={debug.roi_eligibility} />

      {debug.file_mapping_debug.length > 0 && (
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-slate-500">
            6. Per-file headers &amp; column mapping
          </p>
          <div className="space-y-4">
            {debug.file_mapping_debug.map((file) => (
              <FileMappingDebugCard key={file.filename} file={file} />
            ))}
          </div>
        </div>
      )}
    </div>
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
            {file.normalized_job_count} jobs / {file.normalized_invoice_count} inv
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
        Columns: {file.columns.join(", ")}
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

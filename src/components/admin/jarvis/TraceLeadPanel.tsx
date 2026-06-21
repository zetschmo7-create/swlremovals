"use client";

import { useCallback, useState, type ReactNode } from "react";
import type { LeadTraceReport } from "@/lib/jarvis/trace-lead";
import {
  PARSER_TEST_QUERIES,
  ROI_TRACE_CANDIDATES,
} from "@/lib/jarvis/trace-lead-candidates";
import type { CmmLeadIntelligence } from "@/lib/jarvis/types";
import { formatCurrency, formatPct } from "./jarvis-ui";

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-black/20 p-3">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-cyan-400/90">
        {n}. {title}
      </p>
      {children}
    </div>
  );
}

function FieldGrid({
  rows,
}: {
  rows: Array<{ label: string; value: string | null | boolean | number }>;
}) {
  return (
    <dl className="grid gap-1 text-xs sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label}>
          <dt className="text-slate-500">{row.label}</dt>
          <dd className="break-all text-slate-200">
            {typeof row.value === "boolean"
              ? row.value
                ? "yes"
                : "no"
              : (row.value ?? "—")}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ParserTraceSteps({ trace }: { trace: LeadTraceReport }) {
  return (
    <>
      <Step n={1} title="Raw Gmail message">
        <FieldGrid
          rows={[
            { label: "Found", value: trace.step1_gmail.found },
            { label: "Message ID", value: trace.step1_gmail.message_id },
            { label: "Subject", value: trace.step1_gmail.subject },
            { label: "Body length", value: trace.step1_gmail.body_length },
            { label: "Failure", value: trace.step1_gmail.failure_reason },
          ]}
        />
        {trace.step1_gmail.body_preview && (
          <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap text-xs text-slate-400">
            {trace.step1_gmail.body_preview}
          </pre>
        )}
      </Step>

      <Step n={2} title="Full Gmail body extracted">
        <FieldGrid
          rows={[
            { label: "Body extracted", value: trace.step2_body.extracted },
            { label: "Body chars", value: trace.step2_body.body_chars },
            { label: "Snippet fallback", value: trace.step2_body.used_snippet_fallback },
            { label: "CMM marker", value: trace.step2_body.has_comparemymove_marker },
          ]}
        />
      </Step>

      <Step n={3} title="Parsed CMM fields (fresh from Gmail)">
        <FieldGrid
          rows={[
            { label: "Name", value: trace.step3_parsed.customer_name },
            { label: "Email", value: trace.step3_parsed.customer_email },
            { label: "Phone", value: trace.step3_parsed.customer_phone },
            { label: "Current postcode", value: trace.step3_parsed.current_postcode },
            { label: "Destination postcode", value: trace.step3_parsed.destination_postcode },
            { label: "Moving date", value: trace.step3_parsed.move_date },
            { label: "CMM internal ID", value: trace.step3_parsed.cmm_internal_id },
            { label: "Parse failure", value: trace.step3_parsed.parse_failure },
          ]}
        />
      </Step>

      <Step n={4} title="Stored CMM ledger vs fresh parse">
        <FieldGrid
          rows={[
            { label: "Found in ledger", value: trace.step4_stored.found },
            { label: "Stored name", value: trace.step4_stored.customer_name },
            { label: "Stored email", value: trace.step4_stored.customer_email },
            { label: "Stored phone", value: trace.step4_stored.customer_phone },
            { label: "Parser version", value: trace.step4_stored.parser_version },
            { label: "Ledger rebuilt at", value: trace.step4_stored.ledger_rebuilt_at },
          ]}
        />
        {trace.step4_stored.field_mismatches.length > 0 && (
          <ul className="mt-2 space-y-1 text-xs text-amber-300">
            {trace.step4_stored.field_mismatches.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        )}
      </Step>
    </>
  );
}

function RoiTraceSteps({ trace }: { trace: LeadTraceReport }) {
  return (
    <>
      <Step n={1} title="Stored CMM lead">
        <FieldGrid
          rows={[
            { label: "Found", value: trace.step4_stored.found },
            { label: "Name", value: trace.step4_stored.customer_name },
            { label: "Email", value: trace.step4_stored.customer_email },
            { label: "Phone", value: trace.step4_stored.customer_phone },
            { label: "Current postcode", value: trace.step4_stored.current_postcode },
            { label: "Destination postcode", value: trace.step4_stored.destination_postcode },
            { label: "Moving date", value: trace.step4_stored.move_date },
            { label: "Gmail message ID", value: trace.step4_stored.gmail_message_id },
          ]}
        />
      </Step>

      <Step n={2} title="i-MVE normalized job">
        <FieldGrid
          rows={[
            { label: "Found", value: trace.step5_imve_job.found },
            { label: "Job ref", value: trace.step5_imve_job.job_reference },
            { label: "Name", value: trace.step5_imve_job.customer_name },
            { label: "Email", value: trace.step5_imve_job.customer_email },
            { label: "Phone", value: trace.step5_imve_job.customer_phone },
            { label: "Postcode", value: trace.step5_imve_job.from_postcode },
            { label: "Quote", value: trace.step5_imve_job.quote_value },
            { label: "Turnover", value: trace.step5_imve_job.turnover },
            { label: "Deposit paid", value: trace.step5_imve_job.deposit_paid },
            { label: "Lead source", value: trace.step5_imve_job.lead_source },
          ]}
        />
      </Step>

      <Step n={3} title="Match score & status">
        <FieldGrid
          rows={[
            { label: "Score", value: trace.step6_match.score },
            { label: "Signals", value: trace.step6_match.signals.join(", ") || "none" },
            { label: "Predicted status", value: trace.step6_match.predicted_status },
            { label: "Stored status", value: trace.step6_match.stored_match_status },
            { label: "Candidate job", value: trace.step6_match.candidate_job_reference },
            { label: "Linked job", value: trace.step6_match.linked_job_reference },
            { label: "If not matched", value: trace.step6_match.reason_if_not_matched || "—" },
          ]}
        />
        {trace.step6_match.explanation && (
          <p className="mt-2 text-xs text-slate-400">{trace.step6_match.explanation}</p>
        )}
      </Step>

      <Step n={4} title="Approval status">
        <FieldGrid
          rows={[
            { label: "Stored match status", value: trace.step_approval.stored_match_status },
            { label: "Manually approved", value: trace.step_approval.is_manually_approved },
            { label: "Auto-matched", value: trace.step_approval.is_auto_matched },
            { label: "Needs review", value: trace.step_approval.is_needs_review },
            { label: "Rejected", value: trace.step_approval.is_rejected },
            { label: "In review queue", value: trace.step_approval.in_review_queue },
            { label: "Candidate job", value: trace.step_approval.candidate_job_reference },
            { label: "Linked job", value: trace.step_approval.linked_job_reference },
          ]}
        />
      </Step>

      <Step n={5} title="Deposit / value signals">
        <FieldGrid
          rows={[
            { label: "Job deposit paid", value: trace.step_deposit_value.job_deposit_paid },
            { label: "Job deposit amount", value: trace.step_deposit_value.job_deposit_amount },
            { label: "Job turnover", value: trace.step_deposit_value.job_turnover },
            { label: "Job quote", value: trace.step_deposit_value.job_quote_value },
            { label: "Match deposit flag", value: trace.step_deposit_value.match_deposit_paid },
            { label: "Has deposit signal", value: trace.step_deposit_value.has_deposit_signal },
            { label: "Has value signal", value: trace.step_deposit_value.has_value_signal },
            { label: "Qualifies for ROI data", value: trace.step_deposit_value.qualifies_for_roi_data },
          ]}
        />
      </Step>

      <Step n={6} title="ROI eligibility">
        <FieldGrid
          rows={[
            { label: "Included in ROI", value: trace.step7_roi.included },
            { label: "Exclusion reason", value: trace.step7_roi.exclusion_reason },
            { label: "Match status used", value: trace.step7_roi.match_status },
          ]}
        />
      </Step>

      <Step n={7} title="Area table inclusion">
        <FieldGrid
          rows={[
            { label: "Postcode area", value: trace.step7_roi.area },
            { label: "Area deposit jobs", value: trace.step7_roi.area_deposits_paid },
            {
              label: "Area turnover",
              value:
                trace.step7_roi.area_turnover > 0
                  ? formatCurrency(trace.step7_roi.area_turnover)
                  : "0",
            },
            {
              label: "Area commission",
              value:
                trace.step7_roi.area_commission > 0
                  ? formatCurrency(trace.step7_roi.area_commission)
                  : "0",
            },
            {
              label: "Area ROI",
              value:
                trace.step7_roi.area_roi != null
                  ? formatPct(trace.step7_roi.area_roi)
                  : "—",
            },
          ]}
        />
      </Step>
    </>
  );
}

export function TraceLeadPanel({
  onIntelUpdated,
}: {
  onIntelUpdated?: (intel: CmmLeadIntelligence) => void;
}) {
  const [query, setQuery] = useState("Will");
  const [trace, setTrace] = useState<LeadTraceReport | null>(null);
  const [busy, setBusy] = useState<"trace" | "repair" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runTrace = useCallback(
    async (q?: string) => {
      const term = (q ?? query).trim();
      if (!term) return;
      setBusy("trace");
      setError(null);
      try {
        const res = await fetch(
          `/api/jarvis/trace-lead?q=${encodeURIComponent(term)}`
        );
        const json = (await res.json()) as {
          trace?: LeadTraceReport;
          error?: string;
        };
        if (!res.ok) throw new Error(json.error ?? "Trace failed");
        setTrace(json.trace ?? null);
        if (q) setQuery(q);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Trace failed");
      } finally {
        setBusy(null);
      }
    },
    [query]
  );

  const runRepair = useCallback(async () => {
    const messageId =
      trace?.step4_stored.gmail_message_id ?? trace?.step1_gmail.message_id;
    if (!messageId) return;
    setBusy("repair");
    setError(null);
    try {
      const res = await fetch("/api/jarvis/trace-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "repair",
          messageId,
          query,
        }),
      });
      const json = (await res.json()) as {
        trace?: LeadTraceReport;
        intelligence?: CmmLeadIntelligence;
        error?: string;
      };
      if (!res.ok) throw new Error(json.error ?? "Repair failed");
      if (json.trace) setTrace(json.trace);
      if (json.intelligence) onIntelUpdated?.(json.intelligence);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Repair failed");
    } finally {
      setBusy(null);
    }
  }, [trace, query, onIntelUpdated]);

  const canRepair =
    trace?.trace_mode === "parser" &&
    trace.step4_stored.field_mismatches.length > 0 &&
    Boolean(trace.step1_gmail.message_id ?? trace.step4_stored.gmail_message_id);

  return (
    <div className="mt-6 rounded-lg border border-amber-500/25 bg-amber-950/10 p-4">
      <p className="mb-1 text-xs uppercase tracking-widest text-amber-300/90">
        Trace Lead
      </p>
      <p className="mb-3 text-xs text-slate-500">
        <span className="text-slate-400">Parser test:</span> Carl Hancock (unquoted
        lead).{" "}
        <span className="text-slate-400">ROI test:</span> Will → job 3064, Jo → job
        3189, Kevin → job 2786 (approve then re-trace).
      </p>
      <p className="mb-3 text-xs text-slate-600">
        Acceptance: (1) Carl — parser trace only; confirm full
        name/email/phone/postcodes. (2) Will → job 3064 — ROI trace; after approve,
        confirm manually_approved, deposit/value signals, ROI inclusion, and area
        table for Will&apos;s postcode.
      </p>

      <div className="mb-3 flex flex-wrap gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void runTrace()}
          placeholder="Will / 3064 / Carl Hancock"
          className="min-w-[200px] flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
        />
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void runTrace()}
          className="rounded-lg bg-amber-900/50 px-4 py-2 text-sm text-amber-100 hover:bg-amber-800/50 disabled:opacity-50"
        >
          {busy === "trace" ? "Tracing…" : "Trace"}
        </button>
        {canRepair && (
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => void runRepair()}
            className="rounded-lg border border-emerald-500/30 px-4 py-2 text-sm text-emerald-200 hover:bg-emerald-950/40 disabled:opacity-50"
          >
            {busy === "repair" ? "Repairing…" : "Repair CMM lead"}
          </button>
        )}
      </div>

      <div className="mb-2">
        <p className="mb-1 text-[10px] uppercase tracking-widest text-slate-600">
          ROI candidates (deposit / review)
        </p>
        <div className="flex flex-wrap gap-2">
          {ROI_TRACE_CANDIDATES.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => void runTrace(c.leadQuery)}
              className="rounded-full border border-cyan-500/30 bg-cyan-950/30 px-2 py-0.5 text-xs text-cyan-200 hover:bg-cyan-900/40"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <p className="mb-1 text-[10px] uppercase tracking-widest text-slate-600">
          Parser test only (not for ROI)
        </p>
        <div className="flex flex-wrap gap-2">
          {PARSER_TEST_QUERIES.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => void runTrace(q)}
              className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-slate-400 hover:text-slate-200"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mb-3 text-sm text-red-300">{error}</p>}

      {trace && (
        <div className="space-y-3">
          <div className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-3 text-sm text-amber-100">
            <p className="font-medium">
              Diagnosis ·{" "}
              <span className="text-amber-300/80">
                {trace.trace_mode === "parser" ? "parser test" : "ROI trace"}
                {trace.roi_candidate_label ? ` · ${trace.roi_candidate_label}` : ""}
              </span>
            </p>
            <p className="mt-1 text-amber-200/90">{trace.diagnosis}</p>
            {trace.parser_test_note && (
              <p className="mt-2 text-xs text-slate-500">{trace.parser_test_note}</p>
            )}
            <p className="mt-2 text-xs text-slate-500">
              Parser {trace.cmm_parser_version} · Ledger rebuilt{" "}
              {trace.cmm_ledger_rebuilt_at ?? "never"} · Last sync{" "}
              {trace.cmm_ledger_last_sync_at ?? "never"}
            </p>
          </div>

          {trace.trace_mode === "parser" ? (
            <ParserTraceSteps trace={trace} />
          ) : (
            <RoiTraceSteps trace={trace} />
          )}
        </div>
      )}
    </div>
  );
}

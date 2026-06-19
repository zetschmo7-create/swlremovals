"use client";

import { useCallback, useState } from "react";
import { Copy, Loader2, Sparkles } from "lucide-react";
import type {
  JarvisBriefing,
  SalesGptIntent,
  SalesGptResponse,
} from "@/lib/jarvis/types";
import { buildSalesLeadOptions } from "@/lib/jarvis/sales-context";

const INTENTS: { id: SalesGptIntent; label: string }[] = [
  { id: "call_script", label: "Call script" },
  { id: "sms", label: "SMS" },
  { id: "email", label: "Email" },
  { id: "survey_pitch", label: "Survey pitch" },
  { id: "deposit_chase", label: "Deposit chase" },
  { id: "follow_up", label: "Follow-up" },
  { id: "objection", label: "Objection" },
  { id: "freeform", label: "Freeform" },
];

export function SalesGptPanel({ briefing }: { briefing: JarvisBriefing }) {
  const [intent, setIntent] = useState<SalesGptIntent>("call_script");
  const [selectedId, setSelectedId] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SalesGptResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const leadOptions = buildSalesLeadOptions(briefing);
  const selected = leadOptions.find((o) => o.id === selectedId);

  const generate = useCallback(async () => {
    setLoading(true);
    setError("");
    setCopied(false);
    try {
      const res = await fetch("/api/jarvis/sales-gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent,
          jobKey: selected?.jobKey ?? undefined,
          leadId: selected?.leadId ?? undefined,
          userMessage: userMessage.trim() || undefined,
        }),
      });
      const data = (await res.json()) as SalesGptResponse & { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Sales GPT request failed");
      }
      setResult(data);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Sales GPT request failed");
    } finally {
      setLoading(false);
    }
  }, [intent, selected, userMessage]);

  async function copyDraft() {
    if (!result?.reply) return;
    try {
      await navigator.clipboard.writeText(result.reply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy to clipboard.");
    }
  }

  return (
    <div className="jarvis-glass rounded-xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-emerald-400" strokeWidth={1.5} />
        <h3 className="font-display text-lg font-semibold text-white">
          Sales GPT
        </h3>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-emerald-300">
          Draft only
        </span>
      </div>

      <p className="mb-4 text-xs text-slate-500">
        Grounded in Job Ledger data. Uses quote_value when available — never
        invents pricing. Text-only v1.
      </p>

      <div className="mb-4">
        <p className="mb-2 text-xs uppercase tracking-widest text-slate-500">
          Intent
        </p>
        <div className="flex flex-wrap gap-2">
          {INTENTS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIntent(item.id)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                intent === item.id
                  ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-200"
                  : "border-white/10 text-slate-400 hover:border-emerald-500/20 hover:text-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-slate-500">Lead / job</span>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
          >
            <option value="">General (no customer selected)</option>
            {leadOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="text-slate-500">
            Notes for Jake {intent === "objection" || intent === "freeform" ? "(recommended)" : "(optional)"}
          </span>
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            rows={2}
            placeholder={
              intent === "objection"
                ? "Paste the customer's objection…"
                : "Any extra context for the draft…"
            }
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-slate-600"
          />
        </label>
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={() => void generate()}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-900/50 px-4 py-2.5 text-sm font-medium text-emerald-100 hover:bg-emerald-800/50 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating…
          </>
        ) : (
          "Generate draft"
        )}
      </button>

      {error && (
        <p className="mt-4 rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Draft
            </p>
            <button
              type="button"
              onClick={() => void copyDraft()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5"
            >
              <Copy className="h-3.5 w-3.5" />
              {copied ? "Copied" : "Copy draft"}
            </button>
          </div>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-4">
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">
              {result.reply}
            </p>
          </div>
          {result.warnings.length > 0 && (
            <ul className="space-y-1 text-xs text-amber-300/90">
              {result.warnings.map((w) => (
                <li key={w}>⚠ {w}</li>
              ))}
            </ul>
          )}
          {result.suggestedActions.length > 0 && (
            <div className="text-xs text-slate-500">
              <p className="mb-1 uppercase tracking-widest">Suggested actions</p>
              <ul className="list-inside list-disc space-y-0.5">
                {result.suggestedActions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-[0.65rem] text-slate-600">
            Stage: {result.contextUsed.pipelineStage} · Confidence:{" "}
            {result.contextUsed.dataConfidence}
          </p>
        </div>
      )}
    </div>
  );
}

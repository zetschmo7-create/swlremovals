"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  LogOut,
  Mic,
  RefreshCw,
  Settings,
  Clock,
  Shield,
} from "lucide-react";
import type { JarvisBriefing } from "@/lib/jarvis/types";
import { GmailConnectionWidget } from "@/components/admin/jarvis/GmailConnectionWidget";
import { JarvisCommandCentre } from "@/components/admin/jarvis/JarvisCommandCentre";
import "@/app/admin/jarvis/jarvis-command.css";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function JarvisDashboard({ onLogout }: { onLogout: () => void }) {
  const [briefing, setBriefing] = useState<JarvisBriefing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBriefing = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/jarvis/briefing");
      if (res.status === 401) {
        onLogout();
        return;
      }
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to load briefing");
      }
      const data = (await res.json()) as JarvisBriefing;
      setBriefing(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load briefing");
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    void loadBriefing();
  }, [loadBriefing]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    onLogout();
  }

  return (
    <div className="jarvis-shell jarvis-grid-bg min-h-dvh">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-400/70" strokeWidth={1.5} />
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-400/70">
                AI Operations Director · {briefing?.business ?? "Ryan Removals"}
              </p>
            </div>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-white">
              Jarvis
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Executive command centre · V2
            </p>
            {briefing && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                Generated {formatTime(briefing.generatedAt)} ·{" "}
                {briefing.scorecard.periodLabel}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/jarvis/setup"
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-950/30 px-4 py-2 text-sm text-cyan-200/90 transition-colors hover:bg-cyan-900/40"
            >
              <Settings className="h-4 w-4" strokeWidth={1.5} />
              Gmail Setup
            </Link>
            <button
              type="button"
              onClick={() => void loadBriefing()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-white/10 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                strokeWidth={1.5}
              />
              Refresh
            </button>
            <button
              type="button"
              disabled
              title="ElevenLabs integration coming soon"
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-950/20 px-4 py-2 text-sm text-emerald-300/50 opacity-60"
            >
              <Mic className="h-4 w-4" strokeWidth={1.5} />
              Generate Voice Briefing
            </button>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-500 transition-colors hover:text-white"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
              Sign out
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="mb-6">
          <GmailConnectionWidget />
        </section>

        {briefing && !briefing.setup.gmailConfigured && (
          <div className="mb-6 rounded-lg border border-amber-500/25 bg-amber-500/10 px-4 py-4 text-sm text-amber-200">
            <p className="font-medium">Gmail not fully connected</p>
            <p className="mt-1 text-amber-200/70">
              Connect both accounts to populate live metrics. Figures below may
              show &quot;Needs setup&quot; until Gmail is linked.
            </p>
            {briefing.setup.notes.map((note) => (
              <p key={note} className="mt-1 text-amber-200/50">
                {note}
              </p>
            ))}
            <Link
              href="/admin/jarvis/setup"
              className="mt-3 inline-block font-medium text-amber-100 underline hover:text-white"
            >
              Open Gmail setup →
            </Link>
          </div>
        )}

        {loading && !briefing ? (
          <div className="flex items-center justify-center py-24 text-slate-500">
            <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
            Initialising command centre…
          </div>
        ) : briefing ? (
          <JarvisCommandCentre
            briefing={briefing}
            onSettingsSaved={() => void loadBriefing()}
          />
        ) : null}
      </div>
    </div>
  );
}

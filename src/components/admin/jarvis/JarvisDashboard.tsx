"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Bot,
  Calendar,
  LogOut,
  Mail,
  Mic,
  PoundSterling,
  RefreshCw,
  User,
  Clock,
} from "lucide-react";
import type { JarvisBriefing, JarvisTask, TaskBucket } from "@/lib/jarvis/types";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ScorecardCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-white/40">{label}</p>
        <Icon className="h-4 w-4 text-green-400/70" strokeWidth={1.5} />
      </div>
      <p className="font-display text-3xl font-semibold text-white">{value}</p>
      {sub && <p className="mt-1 text-sm text-white/50">{sub}</p>}
    </div>
  );
}

function TaskList({
  title,
  tasks,
  accent,
}: {
  title: string;
  tasks: JarvisTask[];
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${accent}`}
        >
          {tasks.length}
        </span>
      </div>
      {tasks.length === 0 ? (
        <p className="text-sm text-white/40">Nothing in this queue.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="rounded-lg border border-white/5 bg-black/20 p-3"
            >
              <p className="font-medium text-white">{task.title}</p>
              <p className="mt-1 text-sm text-white/50">{task.detail}</p>
              <p className="mt-2 truncate text-xs text-white/30">{task.source}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const BUCKET_META: Record<
  TaskBucket,
  { title: string; accent: string }
> = {
  jarvis: {
    title: "Jarvis can handle",
    accent: "bg-blue-500/20 text-blue-300",
  },
  jake: {
    title: "Jake must handle",
    accent: "bg-amber-500/20 text-amber-300",
  },
  wait: {
    title: "Can wait",
    accent: "bg-white/10 text-white/60",
  },
};

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

  const scorecard = briefing?.scorecard;

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-green-400/80">
            Daily briefing · {briefing?.business ?? "Ryan Removals"}
          </p>
          <h1 className="font-display text-3xl font-semibold text-white">
            Jarvis
          </h1>
          {briefing && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-white/40">
              <Clock className="h-3.5 w-3.5" />
              Generated {formatTime(briefing.generatedAt)} ·{" "}
              {briefing.scorecard.periodLabel}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void loadBriefing()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 disabled:opacity-50"
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
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-green-800/30 px-4 py-2 text-sm text-green-200/80 opacity-60 cursor-not-allowed"
          >
            <Mic className="h-4 w-4" strokeWidth={1.5} />
            Generate Voice Briefing
          </button>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 transition-colors hover:text-white"
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

      {briefing && !briefing.setup.gmailConfigured && (
        <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-4 text-sm text-amber-200">
          <p className="font-medium">Gmail not fully connected</p>
          <p className="mt-1 text-amber-200/70">
            Missing: {briefing.setup.missing.join(", ") || "credentials"}
          </p>
          {briefing.setup.notes.map((note) => (
            <p key={note} className="mt-1 text-amber-200/60">
              {note}
            </p>
          ))}
        </div>
      )}

      {loading && !briefing ? (
        <div className="flex items-center justify-center py-24 text-white/40">
          <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
          Pulling Gmail data…
        </div>
      ) : scorecard ? (
        <>
          <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ScorecardCard
              label="CMM Leads"
              value={scorecard.newCmmLeads}
              sub="Label: CMM - New Lead"
              icon={Mail}
            />
            <ScorecardCard
              label="Survey Bookings"
              value={scorecard.surveyBookings}
              icon={Calendar}
            />
            <ScorecardCard
              label="Quote Acceptances"
              value={scorecard.quoteAcceptances}
              sub={formatCurrency(scorecard.totalQuoteValue)}
              icon={PoundSterling}
            />
            <ScorecardCard
              label="Deposits / Payments"
              value={scorecard.depositsReceived}
              sub={formatCurrency(scorecard.totalDepositValue)}
              icon={PoundSterling}
            />
          </section>

          <section className="mb-8 rounded-xl border border-green-700/30 bg-green-900/20 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-green-400/70">
                  Commission @ {(scorecard.commissionRate * 100).toFixed(0)}%
                </p>
                <p className="font-display text-4xl font-semibold text-white">
                  {formatCurrency(scorecard.totalCommission)}
                </p>
                <p className="mt-1 text-sm text-white/50">
                  Quotes: {formatCurrency(scorecard.commissionOnQuotes)} ·
                  Deposits: {formatCurrency(scorecard.commissionOnDeposits)}
                </p>
              </div>
              <div className="flex gap-6 text-sm text-white/50">
                <div>
                  <p className="text-white/30">Quote value</p>
                  <p className="text-white">
                    {formatCurrency(scorecard.totalQuoteValue)}
                  </p>
                </div>
                <div>
                  <p className="text-white/30">Deposit value</p>
                  <p className="text-white">
                    {formatCurrency(scorecard.totalDepositValue)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8 grid gap-4 lg:grid-cols-3">
            {(Object.keys(BUCKET_META) as TaskBucket[]).map((bucket) => (
              <TaskList
                key={bucket}
                title={BUCKET_META[bucket].title}
                tasks={briefing.tasks[bucket]}
                accent={BUCKET_META[bucket].accent}
              />
            ))}
          </section>

          <section className="mb-8 rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Bot className="h-5 w-5 text-green-400" strokeWidth={1.5} />
              <h2 className="font-display text-xl font-semibold text-white">
                3-Minute Morning Briefing Script
              </h2>
            </div>
            <p className="whitespace-pre-line text-sm leading-relaxed text-white/70">
              {briefing.morningScript}
            </p>
          </section>

          <section className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-white">
              Email sources (last 24h)
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "CMM Leads", emails: briefing.emails.cmmLeads },
                { label: "Survey Bookings", emails: briefing.emails.surveyBookings },
                { label: "Quote Acceptances", emails: briefing.emails.quoteAcceptances },
                { label: "Deposits / Payments", emails: briefing.emails.depositPayments },
              ].map((group) => (
                <div key={group.label}>
                  <p className="mb-2 text-xs uppercase tracking-widest text-white/40">
                    {group.label} ({group.emails.length})
                  </p>
                  {group.emails.length === 0 ? (
                    <p className="text-sm text-white/30">None detected</p>
                  ) : (
                    <ul className="space-y-2">
                      {group.emails.map((email) => (
                        <li
                          key={email.id}
                          className="rounded-lg border border-white/5 bg-black/20 p-3 text-sm"
                        >
                          <p className="font-medium text-white">{email.subject}</p>
                          <p className="mt-1 text-white/40">{email.from}</p>
                          {email.primaryAmount != null && (
                            <p className="mt-1 text-green-400">
                              {formatCurrency(email.primaryAmount)}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>

          <footer className="mt-8 flex items-center gap-2 text-xs text-white/25">
            <User className="h-3.5 w-3.5" />
            Connected accounts: Ryan main Gmail (CMM leads) ·
            appointments@ryanremovals-surveys.com
          </footer>
        </>
      ) : null}
    </div>
  );
}

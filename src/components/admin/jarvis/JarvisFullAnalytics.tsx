"use client";

import { useCallback, useEffect, useState } from "react";
import type { JarvisBriefing, JarvisTask, TaskBucket } from "@/lib/jarvis/types";
import {
  formatCurrency,
  formatPct,
  HealthBadge,
  KpiTile,
  MiniChart,
  NeedsSetup,
  Section,
  TrafficLight,
} from "./jarvis-ui";

const BUCKET_META: Record<TaskBucket, { title: string; accent: string }> = {
  jarvis: { title: "AutoPilot", accent: "text-cyan-300" },
  jake: { title: "Jake Focus", accent: "text-amber-300" },
  wait: { title: "Later", accent: "text-slate-400" },
};

function PeriodTable({
  label,
  metrics,
}: {
  label: string;
  metrics: JarvisBriefing["revenue"]["last24h"];
}) {
  const rows = [
    ["Leads", metrics.leads],
    ["Surveys", metrics.surveys],
    ["Quotes accepted", metrics.quotesAccepted],
    ["Deposits received", metrics.depositsReceived],
    ["Turnover closed", formatCurrency(metrics.turnoverClosed)],
    ["Commission earned", formatCurrency(metrics.commissionEarned)],
  ];

  return (
    <div className="jarvis-glass rounded-xl p-4">
      <p className="mb-3 text-xs uppercase tracking-widest text-cyan-400/80">
        {label}
      </p>
      <dl className="space-y-2 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="text-slate-500">{k}</dt>
            <dd className="font-medium text-white tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function TaskPanel({
  title,
  tasks,
  accent,
}: {
  title: string;
  tasks: JarvisTask[];
  accent: string;
}) {
  return (
    <div className="jarvis-glass rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className={`font-display text-lg font-semibold ${accent}`}>
          {title}
        </h3>
        <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-slate-400">
          {tasks.length}
        </span>
      </div>
      {tasks.length === 0 ? (
        <p className="text-sm text-slate-500">Nothing in this queue.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="rounded-lg border border-white/5 bg-black/25 p-3"
            >
              <p className="font-medium text-white">{task.title}</p>
              {task.customer && (
                <p className="mt-1 text-xs text-emerald-400/80">{task.customer}</p>
              )}
              <p className="mt-1 text-sm text-slate-400">{task.reason ?? task.detail}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function JarvisFullAnalytics({
  briefing,
  onSettingsSaved,
}: {
  briefing: JarvisBriefing;
  onSettingsSaved: () => void;
}) {
  const [settings, setSettings] = useState(briefing.settings);
  const [saving, setSaving] = useState(false);
  const { executive, charts } = briefing;

  useEffect(() => {
    setSettings(briefing.settings);
  }, [briefing.settings]);

  const saveSettings = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/jarvis/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) onSettingsSaved();
    } finally {
      setSaving(false);
    }
  }, [settings, onSettingsSaved]);

  return (
    <div className="mt-8 space-y-2 border-t border-white/10 pt-8">
      <Section title="Full Analytics" subtitle="30-day revenue · detailed operations">
        <div className="mb-6 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiTile label="Health" value={executive.health.label} />
            <KpiTile
              label="Outstanding quotes"
              value={formatCurrency(executive.pipeline.outstandingQuoteValue)}
            />
            <KpiTile label="AutoPilot" value={executive.actions.jarvisCount} />
            <KpiTile label="Jake Focus" value={executive.actions.jakeCount} accent="amber" />
          </div>
          <div className="lg:col-span-4">
            <HealthBadge health={executive.health} />
          </div>
        </div>

        <div className="mb-4 grid gap-4 lg:grid-cols-3">
          <PeriodTable label="Last 24 hours" metrics={briefing.revenue.last24h} />
          <PeriodTable label="Last 7 days" metrics={briefing.revenue.last7d} />
          <PeriodTable label="Last 30 days" metrics={briefing.revenue.last30d} />
        </div>

        <div className="jarvis-glass mb-4 rounded-xl p-5">
          <p className="mb-4 text-xs uppercase tracking-widest text-slate-500">
            Editable settings
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm">
              <span className="text-slate-500">Commission %</span>
              <input
                type="number"
                min={0}
                max={100}
                value={settings.commissionPercent}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    commissionPercent: Number(e.target.value),
                  }))
                }
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
              />
            </label>
            <label className="block text-sm">
              <span className="text-slate-500">Lead provider</span>
              <input
                type="text"
                value={settings.leadProviderName}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    leadProviderName: e.target.value,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
              />
            </label>
            <label className="block text-sm">
              <span className="text-slate-500">Cost per lead (£)</span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={settings.costPerLead}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    costPerLead: Number(e.target.value),
                  }))
                }
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={() => void saveSettings()}
            disabled={saving}
            className="mt-4 rounded-lg bg-cyan-900/50 px-4 py-2 text-sm text-cyan-200 hover:bg-cyan-800/50 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save settings & refresh metrics"}
          </button>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <KpiTile
            label="Lead spend (30d)"
            value={
              briefing.roi.needsSetup ? (
                <NeedsSetup />
              ) : (
                formatCurrency(briefing.roi.leadSpend)
              )
            }
          />
          <KpiTile label="ROI" value={formatPct(briefing.roi.roi)} />
          <KpiTile label="Commission ROI" value={formatPct(briefing.roi.commissionRoi)} />
        </div>
      </Section>

      <Section title="Money Left on the Table">
        {briefing.missedRevenue.needsSetup ? (
          <div className="jarvis-glass rounded-xl p-6">
            <NeedsSetup />
          </div>
        ) : (
          <ul className="space-y-2">
            {briefing.missedRevenue.opportunities.map((o) => (
              <li key={o.id} className="jarvis-glass rounded-lg p-4">
                <p className="font-medium text-white">{o.customer}</p>
                <p className="text-sm text-slate-400">{o.reason}</p>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Action Command Centre">
        <div className="grid gap-4 lg:grid-cols-3">
          {(Object.keys(BUCKET_META) as TaskBucket[]).map((bucket) => (
            <TaskPanel
              key={bucket}
              title={BUCKET_META[bucket].title}
              tasks={briefing.tasks[bucket]}
              accent={BUCKET_META[bucket].accent}
            />
          ))}
        </div>
      </Section>

      <Section title="Unanswered Lead Tracker">
        {briefing.leadTracker.needsSetup ? (
          <div className="jarvis-glass rounded-xl p-6">
            <NeedsSetup />
          </div>
        ) : (
          <div className="jarvis-glass overflow-x-auto rounded-xl">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-slate-500">
                  <th className="p-3">Status</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Stage</th>
                </tr>
              </thead>
              <tbody>
                {briefing.leadTracker.leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/5">
                    <td className="p-3">
                      <TrafficLight status={lead.status} />
                    </td>
                    <td className="p-3 text-white">{lead.customer}</td>
                    <td className="p-3 text-slate-400">{lead.statusLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section title="Performance Trends" subtitle="Last 7 days">
        {charts.needsSetup ? (
          <div className="jarvis-glass rounded-xl p-6">
            <NeedsSetup />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <MiniChart title="Leads" labels={charts.labels} values={charts.leads} color="#38bdf8" />
            <MiniChart title="Revenue" labels={charts.labels} values={charts.revenue} color="#34d399" formatValue={formatCurrency} />
            <MiniChart title="Commission" labels={charts.labels} values={charts.commission} color="#2dd4bf" formatValue={formatCurrency} />
            <MiniChart title="Pipeline" labels={charts.labels} values={charts.pipeline} color="#fbbf24" formatValue={formatCurrency} />
            <MiniChart title="Health trend" labels={charts.labels} values={charts.healthTrend} color="#a78bfa" />
          </div>
        )}
      </Section>
    </div>
  );
}

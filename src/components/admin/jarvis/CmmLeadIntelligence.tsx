"use client";

import { useCallback, useState } from "react";
import type { CmmLeadIntelligence, JarvisBriefing, PostcodeArea } from "@/lib/jarvis/types";
import {
  formatCurrency,
  formatPct,
  KpiTile,
  MiniChart,
  NeedsSetup,
  Section,
} from "./jarvis-ui";

const AREAS: PostcodeArea[] = ["GU", "RH", "TN", "SM", "CR", "Other", "Unknown"];

type ChartMode = "daily" | "weekly" | "monthly";

export function CmmLeadIntelligencePanel({
  briefing,
  onRefresh,
}: {
  briefing: JarvisBriefing;
  onRefresh?: () => void;
}) {
  const intel = briefing.cmmLeadIntelligence;
  const [chartMode, setChartMode] = useState<ChartMode>("daily");
  const [busy, setBusy] = useState<"rebuild" | "sync" | null>(null);
  const [localIntel, setLocalIntel] = useState<CmmLeadIntelligence | null>(null);
  const data = localIntel ?? intel;

  const runAction = useCallback(
    async (action: "rebuild" | "sync") => {
      setBusy(action);
      try {
        const res = await fetch("/api/jarvis/cmm-leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        });
        if (res.ok) {
          const json = (await res.json()) as { intelligence: CmmLeadIntelligence };
          setLocalIntel(json.intelligence);
          onRefresh?.();
        }
      } finally {
        setBusy(null);
      }
    },
    [onRefresh]
  );

  const areaLeads = AREAS.map((area) => {
    const stats = data.byArea[area];
    if (chartMode === "daily") return stats.today.leads;
    if (chartMode === "weekly") return stats.thisWeek.leads;
    return stats.thisMonth.leads;
  });
  const areaSpend = AREAS.map((area) => {
    const stats = data.byArea[area];
    if (chartMode === "daily") return stats.today.spend;
    if (chartMode === "weekly") return stats.thisWeek.spend;
    return stats.thisMonth.spend;
  });
  const trendChart =
    chartMode === "daily"
      ? data.dailyChart
      : chartMode === "weekly"
        ? data.weeklyChart
        : data.monthlyChart;

  const meta = data.syncMeta;
  const lastSync = meta.lastSyncAt
    ? new Date(meta.lastSyncAt).toLocaleString("en-GB")
    : "Never";

  return (
    <Section
      title="CMM Lead Intelligence"
      subtitle="Source: Gmail label “CMM - New Lead” on info@ryanremovals.com"
    >
      {data.needsSetup && (
        <div className="jarvis-glass mb-4 rounded-xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm text-amber-200">
          {data.setupMessage ?? "CMM lead ledger needs a full backfill."}
        </div>
      )}

      {!meta.labelFound && meta.error && (
        <div className="jarvis-glass mb-4 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-200">
          {meta.error}
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void runAction("rebuild")}
          className="rounded-lg bg-cyan-900/50 px-4 py-2 text-sm text-cyan-200 hover:bg-cyan-800/50 disabled:opacity-50"
        >
          {busy === "rebuild" ? "Rebuilding…" : "Rebuild CMM Lead Ledger"}
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void runAction("sync")}
          className="rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 disabled:opacity-50"
        >
          {busy === "sync" ? "Syncing…" : "Sync New CMM Leads"}
        </button>
        <span className="self-center text-xs text-slate-500">Last sync: {lastSync}</span>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <KpiTile label="Leads today" value={data.leadsToday} />
        <KpiTile label="Leads this week" value={data.leadsThisWeek} />
        <KpiTile label="Leads this month" value={data.leadsThisMonth} />
        <KpiTile label="All-time CMM leads" value={data.leadsAllTime} />
        <KpiTile
          label="CMM spend this week"
          value={formatCurrency(data.spendThisWeek)}
        />
        <KpiTile
          label="CMM spend this month"
          value={formatCurrency(data.spendThisMonth)}
        />
        <KpiTile label="Unknown postcodes" value={data.unknownPostcodes} accent="amber" />
      </div>

      <div className="jarvis-glass mb-6 rounded-xl p-4">
        <p className="mb-3 text-xs uppercase tracking-widest text-slate-500">
          Sync status
        </p>
        <dl className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-5">
          <StatusRow
            label="Gmail label"
            value={meta.labelFound ? "Found" : "Not found"}
          />
          <StatusRow label="Messages scanned" value={meta.messagesScanned} />
          <StatusRow label="Leads parsed" value={meta.leadsParsed} />
          <StatusRow label="Duplicates skipped" value={meta.duplicatesSkipped} />
          <StatusRow label="Unknown postcodes" value={meta.unknownPostcodes} />
        </dl>
      </div>

      <div className="jarvis-glass mb-6 overflow-x-auto rounded-xl">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-slate-500">
              <th className="p-3">Area</th>
              <th className="p-3">Leads</th>
              <th className="p-3">Spend</th>
              <th className="p-3">Deposit jobs</th>
              <th className="p-3">Conversion</th>
              <th className="p-3">Turnover</th>
              <th className="p-3">Commission</th>
              <th className="p-3">ROI</th>
            </tr>
          </thead>
          <tbody>
            {AREAS.map((area) => {
              const stats = data.byArea[area];
              return (
                <tr key={area} className="border-b border-white/5">
                  <td className="p-3 font-medium text-cyan-300">{area}</td>
                  <td className="p-3 tabular-nums text-white">
                    {stats.allTime.leads}
                    <span className="ml-1 text-xs text-slate-500">
                      ({stats.thisWeek.leads} wk)
                    </span>
                  </td>
                  <td className="p-3 tabular-nums text-white">
                    {formatCurrency(stats.allTime.spend)}
                  </td>
                  <td className="p-3 tabular-nums text-white">
                    {stats.depositsPaid}
                  </td>
                  <td className="p-3 text-white">
                    {stats.needsReview ? (
                      <span className="text-xs text-amber-300">Needs review</span>
                    ) : (
                      formatPct(stats.conversionRate)
                    )}
                  </td>
                  <td className="p-3 tabular-nums text-white">
                    {stats.turnover > 0 ? formatCurrency(stats.turnover) : "—"}
                  </td>
                  <td className="p-3 tabular-nums text-white">
                    {stats.commission > 0 ? formatCurrency(stats.commission) : "—"}
                  </td>
                  <td className="p-3 text-white">
                    {stats.roi != null ? formatPct(stats.roi) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mb-4 flex gap-2">
        {(["daily", "weekly", "monthly"] as ChartMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setChartMode(mode)}
            className={`rounded-lg px-3 py-1.5 text-xs capitalize ${
              chartMode === mode
                ? "bg-cyan-900/50 text-cyan-200"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MiniChart
          title={`Leads by postcode area (${chartMode})`}
          labels={[...AREAS]}
          values={areaLeads}
          color="#38bdf8"
        />
        <MiniChart
          title={`CMM spend by postcode area (${chartMode})`}
          labels={[...AREAS]}
          values={areaSpend}
          color="#34d399"
          formatValue={formatCurrency}
        />
        <MiniChart
          title={`Lead volume trend (${chartMode})`}
          labels={trendChart.labels}
          values={trendChart.leads}
          color="#a78bfa"
        />
      </div>

      {data.unknownPostcodeLeads.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 text-xs uppercase tracking-widest text-amber-400/80">
            Unknown postcode leads requiring review
          </p>
          <ul className="space-y-2">
            {data.unknownPostcodeLeads.map((l, i) => (
              <li key={i} className="jarvis-glass rounded-lg p-3 text-sm">
                <span className="text-white">{l.customer_name ?? "Unknown"}</span>
                <span className="mx-2 text-slate-600">·</span>
                <span className="text-slate-400">
                  {new Date(l.received_at).toLocaleDateString("en-GB")}
                </span>
                {l.reason && (
                  <span className="mt-1 block text-xs text-amber-300/80">
                    {l.reason}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}

function StatusRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-white tabular-nums">{value}</dd>
    </div>
  );
}

export function CmmHistoricalAnalytics({
  briefing,
}: {
  briefing: JarvisBriefing;
}) {
  const data = briefing.cmmLeadIntelligence;
  const [chartMode, setChartMode] = useState<ChartMode>("weekly");

  if (data.needsSetup) {
    return (
      <Section title="CMM Historical Analytics">
        <div className="jarvis-glass rounded-xl p-6">
          <NeedsSetup label={data.setupMessage ?? "Rebuild CMM Lead Ledger first."} />
        </div>
      </Section>
    );
  }

  const chart =
    chartMode === "daily"
      ? data.dailyChart
      : chartMode === "weekly"
        ? data.weeklyChart
        : data.monthlyChart;

  return (
    <Section title="CMM Historical Analytics" subtitle="From Gmail label ledger">
      <div className="mb-4 flex gap-2">
        {(["daily", "weekly", "monthly"] as ChartMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setChartMode(mode)}
            className={`rounded-lg px-3 py-1.5 text-xs capitalize ${
              chartMode === mode
                ? "bg-cyan-900/50 text-cyan-200"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile label="All-time leads" value={data.leadsAllTime} />
        <KpiTile label="All-time spend" value={formatCurrency(data.spendAllTime)} />
        <KpiTile label="Last 30 days" value={data.leadsLast30Days} />
        <KpiTile
          label="30-day spend"
          value={formatCurrency(data.spendLast30Days)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MiniChart
          title={`Daily / weekly / monthly leads (${chartMode})`}
          labels={chart.labels}
          values={chart.leads}
          color="#38bdf8"
        />
        <MiniChart
          title="CMM spend trends"
          labels={chart.labels}
          values={chart.spend}
          color="#34d399"
          formatValue={formatCurrency}
        />
        <MiniChart
          title="Top areas by volume"
          labels={data.topAreas.map((a) => a.area)}
          values={data.topAreas.map((a) => a.leads)}
          color="#a78bfa"
        />
      </div>

      {data.topAreas.length > 0 && (
        <div className="mt-6 jarvis-glass rounded-xl p-4">
          <p className="mb-3 text-xs uppercase tracking-widest text-slate-500">
            Top postcode areas by lead volume
          </p>
          <ul className="space-y-2 text-sm">
            {data.topAreas.map((a) => (
              <li key={a.area} className="flex justify-between">
                <span className="text-cyan-300">{a.area}</span>
                <span className="text-white tabular-nums">
                  {a.leads} leads · {formatCurrency(a.spend)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}

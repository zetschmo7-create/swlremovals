"use client";

import type { JarvisBriefing, PostcodeArea } from "@/lib/jarvis/types";
import {
  formatCurrency,
  formatPct,
  KpiTile,
  NeedsSetup,
  Section,
} from "./jarvis-ui";

const AREAS: PostcodeArea[] = ["GU", "RH", "TN", "SM", "CR", "Other", "Unknown"];

function roiCell(value: number | null, spend: number) {
  if (spend <= 0) {
    return <span className="text-xs text-slate-500">No CMM spend</span>;
  }
  if (value == null) return "—";
  return formatPct(value);
}

export function CommercialIntelligencePanel({
  briefing,
}: {
  briefing: JarvisBriefing;
}) {
  const intel = briefing.commercialIntelligence;
  const { summary, byArea, bySource, warnings, cmmRoi } = intel;

  if (!summary.hasImveData) {
    return (
      <Section
        title="Commercial Intelligence"
        subtitle="i-MVE export is the authority for won jobs, turnover, and commission"
      >
        <div className="jarvis-glass rounded-xl p-6">
          <NeedsSetup label="Import i-MVE job exports to unlock area and source performance — no CMM matching required." />
        </div>
      </Section>
    );
  }

  const activeAreas = byArea.filter(
    (a) => a.enquiries > 0 || a.wonJobs > 0 || a.cmmLeads > 0
  );

  return (
    <Section
      title="Commercial Intelligence"
      subtitle="Won jobs and forecast commission from i-MVE — CMM spend for ROI context only"
    >
      <div className="jarvis-glass mb-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-sm text-emerald-200">
        Commercial Intelligence uses i-MVE accepted/deposit/invoice data. CMM lead
        matching is diagnostic only.
      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <KpiTile label="Won / active jobs" value={summary.wonJobs} accent="green" />
        <KpiTile label="Deposit invoices sent" value={summary.depositInvoicesSent} />
        <KpiTile
          label="Deposit cash received"
          value={formatCurrency(summary.depositCash)}
        />
        <KpiTile
          label="Won turnover"
          value={formatCurrency(summary.wonTurnover)}
        />
        <KpiTile
          label="Forecast commission"
          value={formatCurrency(summary.forecastCommission)}
          accent="green"
        />
        <KpiTile
          label="CMM spend (all time)"
          value={formatCurrency(summary.cmmSpendAllTime)}
        />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.bestAreaRoi && (
          <KpiTile
            label="Best area ROI (commission)"
            value={summary.bestAreaRoi.area}
            sub={formatPct(summary.bestAreaRoi.roiByCommission)}
            accent="green"
          />
        )}
        {summary.worstAreaRoi && (
          <KpiTile
            label="Worst area ROI (commission)"
            value={summary.worstAreaRoi.area}
            sub={formatPct(summary.worstAreaRoi.roiByCommission)}
            accent="amber"
          />
        )}
        {summary.bestSource && (
          <KpiTile
            label="Best source ROI"
            value={summary.bestSource.source}
            sub={formatPct(summary.bestSource.roiByCommission)}
            accent="green"
          />
        )}
        {summary.worstSource && (
          <KpiTile
            label="Worst source ROI"
            value={summary.worstSource.source}
            sub={formatPct(summary.worstSource.roiByCommission)}
            accent="amber"
          />
        )}
      </div>

      <div className="jarvis-glass mb-6 rounded-xl p-4">
        <p className="mb-3 text-xs uppercase tracking-widest text-cyan-400/80">
          CMM-specific ROI (i-MVE CMM source + matched leads)
        </p>
        <dl className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <MetricRow label="CMM won jobs" value={cmmRoi.cmmWonJobs} />
          <MetricRow
            label="CMM won turnover"
            value={formatCurrency(cmmRoi.cmmWonTurnover)}
          />
          <MetricRow
            label="CMM forecast commission"
            value={formatCurrency(cmmRoi.cmmForecastCommission)}
          />
          <MetricRow
            label="ROI (commission ÷ spend)"
            value={
              cmmRoi.roiByCommission != null
                ? formatPct(cmmRoi.roiByCommission)
                : "—"
            }
          />
        </dl>
      </div>

      {/* Area Performance */}
      <div className="jarvis-glass mb-6 overflow-x-auto rounded-xl">
        <p className="border-b border-white/10 p-3 text-xs uppercase tracking-widest text-slate-500">
          Area performance
        </p>
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-slate-500">
              <th className="p-3">Area</th>
              <th className="p-3">Enquiries</th>
              <th className="p-3">CMM leads</th>
              <th className="p-3">Won jobs</th>
              <th className="p-3">Conversion</th>
              <th className="p-3">CMM spend</th>
              <th className="p-3">Deposit cash</th>
              <th className="p-3">Won turnover</th>
              <th className="p-3">Forecast comm.</th>
              <th className="p-3">ROI (comm.)</th>
            </tr>
          </thead>
          <tbody>
            {activeAreas.map((row) => (
              <tr key={row.area} className="border-b border-white/5">
                <td className="p-3 font-medium text-cyan-300">{row.area}</td>
                <td className="p-3 tabular-nums text-white">{row.enquiries}</td>
                <td className="p-3 tabular-nums text-white">{row.cmmLeads}</td>
                <td className="p-3 tabular-nums text-white">{row.wonJobs}</td>
                <td className="p-3 text-white">
                  {row.conversionRate != null
                    ? formatPct(row.conversionRate)
                    : "—"}
                </td>
                <td className="p-3 tabular-nums text-white">
                  {formatCurrency(row.cmmSpend)}
                </td>
                <td className="p-3 tabular-nums text-white">
                  {row.depositCash > 0 ? formatCurrency(row.depositCash) : "—"}
                </td>
                <td className="p-3 tabular-nums text-white">
                  {row.wonTurnover > 0 ? formatCurrency(row.wonTurnover) : "—"}
                </td>
                <td className="p-3 tabular-nums text-emerald-300">
                  {row.forecastCommission > 0
                    ? formatCurrency(row.forecastCommission)
                    : "—"}
                </td>
                <td className="p-3 text-white">
                  {roiCell(row.roiByCommission, row.cmmSpend)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Source Performance */}
      <div className="jarvis-glass mb-6 overflow-x-auto rounded-xl">
        <p className="border-b border-white/10 p-3 text-xs uppercase tracking-widest text-slate-500">
          Source performance
        </p>
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-slate-500">
              <th className="p-3">Source</th>
              <th className="p-3">Jobs</th>
              <th className="p-3">Won jobs</th>
              <th className="p-3">Deposit inv.</th>
              <th className="p-3">Won turnover</th>
              <th className="p-3">Forecast comm.</th>
              <th className="p-3">ROI (comm.)</th>
            </tr>
          </thead>
          <tbody>
            {bySource.map((row) => (
              <tr key={row.source} className="border-b border-white/5">
                <td className="p-3 font-medium text-white">{row.source}</td>
                <td className="p-3 tabular-nums text-white">{row.jobs}</td>
                <td className="p-3 tabular-nums text-white">{row.wonJobs}</td>
                <td className="p-3 tabular-nums text-white">
                  {row.depositInvoicesSent}
                </td>
                <td className="p-3 tabular-nums text-white">
                  {row.wonTurnover > 0 ? formatCurrency(row.wonTurnover) : "—"}
                </td>
                <td className="p-3 tabular-nums text-emerald-300">
                  {row.forecastCommission > 0
                    ? formatCurrency(row.forecastCommission)
                    : "—"}
                </td>
                <td className="p-3 text-white">
                  {roiCell(row.roiByCommission, row.cmmSpend ?? 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Data Quality Warnings */}
      {warnings.length > 0 && (
        <div className="jarvis-glass rounded-xl p-4">
          <p className="mb-3 text-xs uppercase tracking-widest text-amber-400/80">
            Data quality notes
          </p>
          <ul className="space-y-3">
            {warnings.map((w) => (
              <li
                key={w.code}
                className="rounded-lg border border-amber-500/15 bg-amber-500/5 p-3 text-sm"
              >
                <p className="text-amber-100">
                  {w.message}
                  {w.count > 0 && (
                    <span className="ml-2 text-amber-300/80">({w.count})</span>
                  )}
                </p>
                {w.samples.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs text-slate-400">
                    {w.samples.map((s, i) => (
                      <li key={`${w.code}-${i}`}>
                        {s.label}
                        {s.detail ? ` · ${s.detail}` : ""}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(summary.actualValueJobs > 0 || summary.estimatedValueJobs > 0) && (
        <p className="mt-4 text-xs text-slate-500">
          Value confidence: {summary.actualValueJobs} actual,{" "}
          {summary.estimatedValueJobs} estimated from deposit × 5.
        </p>
      )}
    </Section>
  );
}

function MetricRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-white tabular-nums">{value}</dd>
    </div>
  );
}

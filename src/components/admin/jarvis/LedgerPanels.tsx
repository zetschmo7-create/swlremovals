"use client";

import type { JarvisBriefing, JobRecord, PostcodeArea } from "@/lib/jarvis/types";
import { formatCurrency, formatPct, NeedsSetup, Section } from "./jarvis-ui";
import { getPaydayInfo } from "@/lib/jarvis/payday";

const AREAS: PostcodeArea[] = ["GU", "RH", "TN", "SM", "CR", "Other", "Unknown"];

export function DataQualityPanel({
  briefing,
}: {
  briefing: JarvisBriefing;
}) {
  const dq = briefing.dataQuality;
  return (
    <Section title="Data Quality" subtitle="Job Ledger audit">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Metric label="Gmail connected" value={dq.gmailAccountsConnected} />
        <Metric label="PDFs parsed" value={dq.pdfsParsedToday} />
        <Metric label="Needs review" value={dq.jobsRequiringReview} />
        <Metric label="Duplicates ignored" value={dq.duplicateEventsIgnored} />
        <Metric label="Unknown values" value={dq.unknownValues} />
      </div>
      {dq.pdfValueExtractionNeedsSetup && (
        <p className="mt-4 rounded-lg border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {dq.pdfExtractionNote ?? "PDF value extraction needs setup."}
        </p>
      )}
      {dq.funnelWarning && (
        <p className="mt-4 rounded-lg border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {dq.funnelWarning} Funnel metrics are based on detected Gmail/PDF events and may need review.
        </p>
      )}
    </Section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="jarvis-glass rounded-xl p-4">
      <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white tabular-nums">{value}</p>
    </div>
  );
}


export function JobLedgerTable({ jobs }: { jobs: JobRecord[] }) {
  const payday = getPaydayInfo();
  const rows = [...jobs]
    .sort((a, b) => {
      const da = a.lead_received_at ?? "";
      const db = b.lead_received_at ?? "";
      return db.localeCompare(da);
    })
    .slice(0, 30);

  return (
    <Section title="Job Ledger" subtitle="Canonical Ryan Removals jobs">
      {rows.length === 0 ? (
        <div className="jarvis-glass rounded-xl p-6">
          <NeedsSetup />
        </div>
      ) : (
        <div className="jarvis-glass overflow-x-auto rounded-xl">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-slate-500">
                <th className="p-3">Customer</th>
                <th className="p-3">Job Ref</th>
                <th className="p-3">Area</th>
                <th className="p-3">Stage</th>
                <th className="p-3">Quote</th>
                <th className="p-3">Deposit?</th>
                <th className="p-3">Commission?</th>
                <th className="p-3">Payday</th>
                <th className="p-3">Review</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((job) => (
                <tr key={job.job_key} className="border-b border-white/5">
                  <td className="p-3 text-white">{job.customer_name ?? "—"}</td>
                  <td className="p-3 text-slate-400">{job.job_reference ?? "—"}</td>
                  <td className="p-3 text-cyan-300/80">{job.moving_from_postcode_area}</td>
                  <td className="p-3 text-slate-300">{job.current_stage.replace(/_/g, " ")}</td>
                  <td className="p-3 tabular-nums">
                    {job.quote_value != null ? formatCurrency(job.quote_value) : "—"}
                  </td>
                  <td className="p-3">{job.deposit_receipt_received_at ? "Yes" : "No"}</td>
                  <td className="p-3">
                    {job.commission_payable
                      ? job.commission_value != null
                        ? formatCurrency(job.commission_value)
                        : "Needs value"
                      : "—"}
                  </td>
                  <td className="p-3 text-slate-400">
                    {job.commission_payable ? payday.nextPaydayLabel : "—"}
                  </td>
                  <td className="p-3 text-xs text-amber-300/80">
                    {job.needs_manual_review_reason ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}

export function PostcodePerformancePanel({
  briefing,
}: {
  briefing: JarvisBriefing;
}) {
  if (briefing.postcodeAnalytics.needsSetup) {
    return (
      <Section title="Postcode Area Performance">
        <div className="jarvis-glass rounded-xl p-6">
          <NeedsSetup />
        </div>
      </Section>
    );
  }

  return (
    <Section title="Postcode Area Performance" subtitle="30-day · company ROI by area">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {AREAS.map((area) => {
          const stats = briefing.postcodeAnalytics.areas[area];
          return (
            <div key={area} className="jarvis-glass rounded-xl p-4">
              <p className="mb-3 font-semibold text-cyan-300">{area}</p>
              <dl className="space-y-1.5 text-xs">
                <Row label="Leads" value={stats.leads} />
                <Row label="Company spend" value={formatCurrency(stats.spend)} />
                <Row label="Deposits paid" value={stats.depositsPaid} />
                <Row label="Turnover" value={formatCurrency(stats.turnover)} />
                <Row label="Commission" value={formatCurrency(stats.commission)} />
                <Row label="Conversion" value={formatPct(stats.conversionRate)} />
                <Row label="Company ROI" value={formatPct(stats.roi)} />
              </dl>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-white tabular-nums">{value}</dd>
    </div>
  );
}

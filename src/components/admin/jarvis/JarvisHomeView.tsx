"use client";

import type { JarvisBriefing, JarvisTask, TaskBucket } from "@/lib/jarvis/types";
import {
  formatCurrency,
  formatPct,
  KpiTile,
  NeedsSetup,
  Section,
  TrafficLight,
} from "./jarvis-ui";
import { JarvisAssistant } from "./JarvisAssistant";
import { DataQualityPanel } from "./LedgerPanels";
import { CmmLeadIntelligencePanel } from "./CmmLeadIntelligence";
import { DataImportsPanel } from "./DataImportsPanel";

const BUCKET_LABELS: Record<TaskBucket, string> = {
  jarvis: "AutoPilot",
  jake: "Jake Focus",
  wait: "Later",
};

function confidenceBadge(confidence: "high" | "medium" | "none") {
  if (confidence === "high") {
    return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
  }
  if (confidence === "medium") {
    return "bg-amber-500/20 text-amber-300 border-amber-500/30";
  }
  return "bg-slate-500/20 text-slate-400";
}

export function JarvisHomeView({
  briefing,
  onRefresh,
}: {
  briefing: JarvisBriefing;
  onRefresh?: () => void;
}) {
  const { executive, payday, commissionForecast } = briefing;
  const jakeTasks = briefing.tasks.jake.slice(0, 6);
  const hotLeads = briefing.hotLeads.leads.slice(0, 4);

  return (
    <div className="space-y-2">
      <DataQualityPanel briefing={briefing} />

      {/* Friday Payday */}
      <Section title="Friday Payday Tracker" subtitle={payday.nextPaydayLabel}>
        {payday.needsSetup ? (
          <div className="jarvis-glass rounded-xl p-6">
            <NeedsSetup />
          </div>
        ) : (
          <>
            <p className="jarvis-glass-accent jarvis-glass mb-4 rounded-xl px-5 py-4 text-lg text-emerald-200">
              {payday.summaryLine}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KpiTile
                label="Due this Friday"
                value={formatCurrency(payday.commissionDueThisFriday)}
                accent="green"
              />
              <KpiTile
                label="Earned this week"
                value={formatCurrency(payday.commissionEarnedThisWeek)}
              />
              <KpiTile
                label="Days until payday"
                value={payday.daysUntilPayday}
                sub={payday.nextPaydayLabel}
              />
              <KpiTile
                label="Deposits this week"
                value={payday.depositsReceivedThisWeek}
                sub={`${payday.jobsPayableThisWeek} payable job(s)`}
              />
              <KpiTile
                label="Turnover payable (Fri)"
                value={formatCurrency(payday.turnoverDueThisFriday)}
              />
              <KpiTile
                label="Paid this month"
                value={
                  payday.commissionPaidNeedsSetup ? (
                    <NeedsSetup />
                  ) : (
                    formatCurrency(payday.commissionPaidThisMonth ?? 0)
                  )
                }
              />
            </div>
            {payday.needsConfirmation.length > 0 && (
              <div className="mt-4 rounded-lg border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                {payday.needsConfirmation.length} booking(s) need move value
                confirmation — see Jake Focus.
              </div>
            )}
          </>
        )}
      </Section>

      {/* Commission Forecast */}
      <Section title="Commission Forecast">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiTile label="Earned" value={formatCurrency(commissionForecast.earned)} accent="green" />
          <KpiTile label="Likely" value={formatCurrency(commissionForecast.likely)} />
          <KpiTile label="Possible" value={formatCurrency(commissionForecast.possible)} />
          <KpiTile label="Stretch" value={formatCurrency(commissionForecast.stretch)} accent="amber" />
        </div>
      </Section>

      {/* Today / This week */}
      <Section title="Operations Pulse">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="jarvis-glass rounded-xl p-5">
            <p className="mb-3 text-xs uppercase tracking-widest text-cyan-400/80">
              Today
            </p>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-500">Leads</dt>
                <dd className="text-xl font-semibold text-white">{executive.today.newLeads}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Surveys</dt>
                <dd className="text-xl font-semibold text-white">{executive.today.surveysBooked}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Deposits</dt>
                <dd className="text-xl font-semibold text-white">{executive.today.depositsReceived}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Commission</dt>
                <dd className="text-xl font-semibold text-emerald-400">
                  {formatCurrency(executive.today.estimatedCommission)}
                </dd>
              </div>
            </dl>
          </div>
          <div className="jarvis-glass rounded-xl p-5">
            <p className="mb-3 text-xs uppercase tracking-widest text-cyan-400/80">
              This week
            </p>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-500">Leads</dt>
                <dd className="text-xl font-semibold text-white">{executive.thisWeek.newLeads}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Surveys</dt>
                <dd className="text-xl font-semibold text-white">{executive.thisWeek.surveysBooked}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Deposits</dt>
                <dd className="text-xl font-semibold text-white">{executive.thisWeek.depositsReceived}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Commission</dt>
                <dd className="text-xl font-semibold text-emerald-400">
                  {formatCurrency(executive.thisWeek.estimatedCommission)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

      {/* Pipeline funnel compact */}
      <Section title="Pipeline Funnel" subtitle="Last 7 days">
        {briefing.pipelineFunnel.needsSetup ? (
          <div className="jarvis-glass rounded-xl p-6">
            <NeedsSetup />
          </div>
        ) : (
          <>
          {briefing.dataQuality.funnelWarning && (
            <p className="mb-4 rounded-lg border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              {briefing.dataQuality.funnelWarning}
            </p>
          )}
          <div className="jarvis-glass flex flex-col items-center gap-1 rounded-xl p-6">
            {briefing.pipelineFunnel.stages.map((stage, i) => (
              <div key={stage.key} className="w-full max-w-md text-center">
                {i > 0 && <p className="py-1 text-slate-600">↓</p>}
                <div className="rounded-lg border border-white/5 bg-black/20 px-4 py-3">
                  <p className="text-sm text-slate-400">{stage.label}</p>
                  <p className="text-2xl font-semibold text-white">{stage.count}</p>
                  {stage.conversionFromPrevious != null && (
                    <p className="text-xs text-cyan-400/70">
                      {formatPct(stage.conversionFromPrevious)} from previous
                    </p>
                  )}
                  {stage.key === "moves" &&
                    !briefing.pipelineFunnel.movesCompletedDetectable && (
                      <p className="mt-1 text-xs italic text-slate-500">
                        Needs setup
                      </p>
                    )}
                </div>
              </div>
            ))}
          </div>
          </>
        )}
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Hot opportunities */}
        <Section title="Hot Opportunities">
          {hotLeads.length === 0 ? (
            <div className="jarvis-glass rounded-xl p-6">
              <NeedsSetup />
            </div>
          ) : (
            <ul className="space-y-3">
              {hotLeads.map((lead) => (
                <li key={lead.id} className="jarvis-glass-accent jarvis-glass rounded-xl p-4">
                  <p className="font-medium text-white">{lead.customer}</p>
                  {lead.potentialValue != null && (
                    <p className="text-emerald-400">{formatCurrency(lead.potentialValue)}</p>
                  )}
                  <p className="mt-1 text-xs text-slate-500">{lead.reason}</p>
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* Jake Focus */}
        <Section title={BUCKET_LABELS.jake}>
          <TaskListCompact tasks={jakeTasks} emptyLabel="No Jake Focus items." />
        </Section>
      </div>

      {/* Survey availability */}
      <Section title="Survey Availability" subtitle="GU · RH · TN clustered slots">
        <div className="grid gap-4 md:grid-cols-3">
          {(["GU", "RH", "TN"] as const).map((zone) => (
            <div key={zone} className="jarvis-glass rounded-xl p-5">
              <p className="mb-3 font-semibold text-cyan-300">{zone}</p>
              {briefing.surveyIntelligence.slots[zone].length === 0 ? (
                <p className="text-sm text-slate-500">No clustered availability.</p>
              ) : (
                <ul className="space-y-3">
                  {briefing.surveyIntelligence.slots[zone].map((slot, i) => (
                    <li
                      key={`${slot.date}-${slot.time}-${i}`}
                      className="rounded-lg border border-white/5 bg-black/20 p-3"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-white">
                          {slot.dateLabel} {slot.time}
                        </span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[0.65rem] uppercase ${confidenceBadge(slot.confidence)}`}
                        >
                          {slot.confidence}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{slot.reasoning}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Move tracker */}
      <Section title="Move Completion Tracker">
        {briefing.moveTracker.needsSetup ? (
          <div className="jarvis-glass rounded-xl p-6">
            <NeedsSetup label="Needs setup — move completion emails not yet detectable." />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <KpiTile label="Moves today" value={briefing.moveTracker.movesToday ?? 0} />
            <KpiTile label="Moves tomorrow" value={briefing.moveTracker.movesTomorrow ?? 0} />
            <KpiTile label="Moves this week" value={briefing.moveTracker.movesThisWeek ?? 0} />
            <KpiTile label="Completed this week" value={briefing.moveTracker.completedThisWeek ?? 0} />
            <KpiTile
              label="Turnover delivered"
              value={formatCurrency(briefing.moveTracker.turnoverDelivered ?? 0)}
            />
            <KpiTile
              label="Commission secured"
              value={formatCurrency(briefing.moveTracker.commissionSecured ?? 0)}
              accent="green"
            />
          </div>
        )}
      </Section>

      <DataImportsPanel briefing={briefing} onRefresh={onRefresh} />

      <CmmLeadIntelligencePanel briefing={briefing} onRefresh={onRefresh} />

      <JarvisAssistant briefing={briefing} />

      {/* Morning briefing */}
      <Section title="Morning Briefing">
        <div className="jarvis-glass-accent jarvis-glass rounded-xl p-6">
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">
            {briefing.morningScript}
          </p>
        </div>
      </Section>
    </div>
  );
}

function TaskListCompact({
  tasks,
  emptyLabel,
}: {
  tasks: JarvisTask[];
  emptyLabel: string;
}) {
  if (tasks.length === 0) {
    return (
      <div className="jarvis-glass rounded-xl p-6">
        <p className="text-sm text-slate-500">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="jarvis-glass rounded-lg border border-white/5 p-3"
        >
          <div className="flex items-start gap-2">
            {task.reason === "Value needs confirmation" && (
              <TrafficLight status="amber" />
            )}
            <div>
              <p className="font-medium text-white">{task.title}</p>
              {task.customer && (
                <p className="text-xs text-emerald-400/80">{task.customer}</p>
              )}
              <p className="mt-1 text-xs text-slate-500">{task.suggestedAction}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

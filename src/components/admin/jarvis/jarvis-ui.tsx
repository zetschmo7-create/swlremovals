"use client";

import type { JarvisBriefing } from "@/lib/jarvis/types";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPct(value: number | null): string {
  if (value == null) return "Needs setup";
  return `${Math.round(value * 100)}%`;
}

export function NeedsSetup({ label = "Needs setup" }: { label?: string }) {
  return (
    <span className="text-sm italic text-slate-500">{label}</span>
  );
}

export function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <div className="mb-4">
        <p className="jarvis-section-title">{title}</p>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        )}
        <div className="jarvis-neon-line mt-3" />
      </div>
      {children}
    </section>
  );
}

export function KpiTile({
  label,
  value,
  sub,
  accent = "blue",
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  accent?: "blue" | "green" | "amber";
}) {
  const accentClass =
    accent === "green"
      ? "jarvis-glass-accent"
      : accent === "amber"
        ? "border-amber-500/20"
        : "";

  return (
    <div className={`jarvis-glass rounded-xl p-5 ${accentClass}`}>
      <p className="text-[0.65rem] uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="jarvis-kpi-value mt-2 font-display text-3xl font-semibold text-white">
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

export function MiniChart({
  title,
  labels,
  values,
  color,
  formatValue,
}: {
  title: string;
  labels: string[];
  values: number[];
  color: string;
  formatValue?: (n: number) => string;
}) {
  const max = Math.max(...values, 1);
  const fmt = formatValue ?? ((n: number) => String(n));

  return (
    <div className="jarvis-glass rounded-xl p-5">
      <p className="mb-4 text-sm font-medium text-slate-300">{title}</p>
      <div className="flex h-28 items-end gap-1.5">
        {values.map((v, i) => (
          <div key={labels[i]} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-t transition-all"
              style={{
                height: `${Math.max(4, (v / max) * 100)}%`,
                background: `linear-gradient(180deg, ${color}, ${color}88)`,
                boxShadow: `0 0 12px ${color}44`,
              }}
              title={fmt(v)}
            />
            <span className="text-[0.6rem] text-slate-500">{labels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HealthBadge({
  health,
}: {
  health: JarvisBriefing["executive"]["health"];
}) {
  const cls =
    health.status === "green"
      ? "jarvis-health-green"
      : health.status === "amber"
        ? "jarvis-health-amber"
        : health.status === "red"
          ? "jarvis-health-red"
          : "text-slate-500 border-slate-600";

  return (
    <div
      className={`jarvis-glass flex flex-col items-center justify-center rounded-xl border p-5 ${cls}`}
    >
      <p className="text-[0.65rem] uppercase tracking-[0.16em] opacity-70">
        Health Score
      </p>
      <p className="jarvis-kpi-value mt-2 font-display text-4xl font-semibold">
        {health.score != null ? health.label : "—"}
      </p>
      {health.score == null ? (
        <NeedsSetup />
      ) : (
        <ul className="mt-3 space-y-1 text-center text-xs opacity-80">
          {health.factors.slice(0, 3).map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function TrafficLight({ status }: { status: "red" | "amber" | "green" }) {
  const colors = {
    red: "bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.6)]",
    amber: "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]",
    green: "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]",
  };
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${colors[status]}`}
    />
  );
}

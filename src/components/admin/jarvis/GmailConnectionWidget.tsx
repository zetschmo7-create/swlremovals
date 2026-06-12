"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Settings } from "lucide-react";
import type { GmailConnectionStatusResponse } from "@/lib/jarvis/types";

export function GmailConnectionWidget({
  compact = false,
  onStatusChange,
}: {
  compact?: boolean;
  onStatusChange?: (status: GmailConnectionStatusResponse) => void;
}) {
  const [status, setStatus] = useState<GmailConnectionStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/jarvis/oauth/status");
      if (!res.ok) return;
      const data = (await res.json()) as GmailConnectionStatusResponse;
      setStatus(data);
      onStatusChange?.(data);
    } finally {
      setLoading(false);
    }
  }, [onStatusChange]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !status) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/40">
        Checking Gmail connections…
      </div>
    );
  }

  if (!status) return null;

  const rows = [
    {
      label: "Main Gmail Connected",
      connected: status.main.connected,
      email: status.main.email,
    },
    {
      label: "Appointments Gmail Connected",
      connected: status.appointments.connected,
      email: status.appointments.email,
    },
  ];

  return (
    <div
      className={`rounded-xl border ${
        status.fullyConnected
          ? "border-green-700/30 bg-green-900/20"
          : "border-white/10 bg-white/5"
      } ${compact ? "p-4" : "p-5"}`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-widest text-white/40">
          Gmail status
        </p>
        <Link
          href="/admin/jarvis/setup"
          className="inline-flex items-center gap-1.5 text-xs text-green-300 hover:text-green-200"
        >
          <Settings className="h-3.5 w-3.5" />
          Setup
        </Link>
      </div>

      <ul className="space-y-2">
        {rows.map((row) => (
          <li key={row.label} className="flex items-start gap-2 text-sm">
            {row.connected ? (
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-green-400"
                strokeWidth={1.5}
              />
            ) : (
              <Circle
                className="mt-0.5 h-4 w-4 shrink-0 text-white/30"
                strokeWidth={1.5}
              />
            )}
            <div className="min-w-0">
              <p className={row.connected ? "text-white" : "text-white/60"}>
                {row.connected ? "✓ " : ""}
                {row.label.replace(" Connected", "")}
                {row.connected ? " Connected" : " not connected"}
              </p>
              {row.email && (
                <p className="truncate text-xs text-white/40">{row.email}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

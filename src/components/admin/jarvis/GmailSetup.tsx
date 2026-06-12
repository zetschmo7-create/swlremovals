"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Link2,
  LogOut,
  Unlink,
  RefreshCw,
} from "lucide-react";
import type { GmailConnectionStatusResponse } from "@/lib/jarvis/types";
import { JARVIS_CONFIG } from "@/lib/jarvis/config";

const ACCOUNT_CARDS = [
  {
    id: "main" as const,
    title: "Main Ryan Gmail",
    description: JARVIS_CONFIG.accounts.main.description,
    details: `Reads label "${JARVIS_CONFIG.cmmLeadLabel}" for historical CMM lead analysis.`,
    connectLabel: "Connect Main Ryan Gmail",
  },
  {
    id: "appointments" as const,
    title: "Appointments Gmail",
    description: JARVIS_CONFIG.accounts.appointments.description,
    details:
      "Survey bookings, customer replies, quote acceptances, and deposit/payment emails.",
    connectLabel: "Connect Appointments Gmail",
  },
];

export function GmailSetup({ onLogout }: { onLogout: () => void }) {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<GmailConnectionStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/jarvis/oauth/status");
      if (res.status === 401) {
        onLogout();
        return;
      }
      if (!res.ok) throw new Error("Failed to load Gmail status");
      const data = (await res.json()) as GmailConnectionStatusResponse;
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load status");
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  useEffect(() => {
    const connected = searchParams.get("connected");
    const err = searchParams.get("error");
    if (connected) {
      setMessage(
        `Successfully connected ${
          connected === "main" ? "Main Ryan Gmail" : "Appointments Gmail"
        }.`
      );
      void loadStatus();
    }
    if (err) {
      setError(decodeURIComponent(err));
    }
  }, [searchParams, loadStatus]);

  async function handleDisconnect(account: "main" | "appointments") {
    setDisconnecting(account);
    setError("");
    try {
      const res = await fetch("/api/jarvis/oauth/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Disconnect failed");
      }
      setMessage(
        `Disconnected ${
          account === "main" ? "Main Ryan Gmail" : "Appointments Gmail"
        }.`
      );
      await loadStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Disconnect failed");
    } finally {
      setDisconnecting(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    onLogout();
  }

  function accountStatus(account: "main" | "appointments") {
    if (!status) return null;
    return account === "main" ? status.main : status.appointments;
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/jarvis"
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to briefing
          </Link>
          <p className="text-xs uppercase tracking-widest text-green-400/80">
            Gmail integration
          </p>
          <h1 className="font-display text-3xl font-semibold text-white">
            Connect Gmail
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Authorise read-only access. Refresh tokens are encrypted and stored in
            Vercel KV — no manual token pasting required.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void loadStatus()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>

      {message && (
        <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {status && !status.googleOAuthConfigured && (
        <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-4 text-sm text-amber-200">
          <p className="font-medium">Google OAuth not configured</p>
          <p className="mt-1 text-amber-200/70">
            Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Vercel → Settings →
            Environment Variables.
          </p>
        </div>
      )}

      {status && !status.storageReady && (
        <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-4 text-sm text-amber-200">
          <p className="font-medium">Vercel KV required</p>
          <p className="mt-1 text-amber-200/70">
            In Vercel: Storage → Create Database → KV → link to this project. This
            stores encrypted refresh tokens across deployments.
          </p>
        </div>
      )}

      {status && (
        <p className="mb-6 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-xs text-white/40">
          OAuth redirect URI (add to Google Cloud Console):{" "}
          <code className="text-white/60">{status.redirectUri}</code>
        </p>
      )}

      <div className="space-y-4">
        {ACCOUNT_CARDS.map((card) => {
          const account = accountStatus(card.id);
          const connected = account?.connected ?? false;

          return (
            <div
              key={card.id}
              className="rounded-xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    {connected ? (
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    ) : (
                      <Link2 className="h-5 w-5 text-white/30" />
                    )}
                    <h2 className="font-display text-xl font-semibold text-white">
                      {card.title}
                    </h2>
                  </div>
                  <p className="text-sm text-white/50">{card.description}</p>
                  <p className="mt-2 text-sm text-white/40">{card.details}</p>
                  {account?.email && (
                    <p className="mt-3 text-sm text-green-300/80">
                      Connected as {account.email}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                  {connected ? (
                    <button
                      type="button"
                      onClick={() => void handleDisconnect(card.id)}
                      disabled={disconnecting === card.id}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                    >
                      <Unlink className="h-4 w-4" />
                      {disconnecting === card.id ? "Disconnecting…" : "Disconnect"}
                    </button>
                  ) : (
                    <a
                      href={`/api/jarvis/oauth/start?account=${card.id}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-green-800 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                    >
                      <Link2 className="h-4 w-4" />
                      {card.connectLabel}
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {status?.fullyConnected && (
        <div className="mt-8 rounded-xl border border-green-700/30 bg-green-900/20 p-5 text-center">
          <p className="font-medium text-green-200">
            Both accounts connected — Jarvis will pull live metrics automatically.
          </p>
          <Link
            href="/admin/jarvis"
            className="mt-3 inline-block text-sm text-green-300 hover:text-green-200"
          >
            Open daily briefing →
          </Link>
        </div>
      )}
    </div>
  );
}

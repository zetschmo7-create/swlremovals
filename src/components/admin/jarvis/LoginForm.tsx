"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Login failed.");
        return;
      }

      onSuccess();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-800/40">
            <Lock className="h-5 w-5 text-green-300" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/40">
              Private admin
            </p>
            <h1 className="font-display text-xl font-semibold text-white">
              Jarvis Briefing
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="jarvis-password"
              className="mb-1.5 block text-sm text-white/60"
            >
              Admin password
            </label>
            <input
              id="jarvis-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-800 px-4 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/30">
          Not indexed. Admin access only.
        </p>
      </div>
    </div>
  );
}

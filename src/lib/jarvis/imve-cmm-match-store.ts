import { kvGet, kvSet, isKvStorageReady } from "./kv-client";
import type { ImveCmmMatchLedger } from "./imve-types";

const MATCH_LEDGER_KEY = "jarvis:imve:cmm-matches";

const EMPTY: ImveCmmMatchLedger = {
  matches: {},
  reviewQueue: [],
  stats: {
    autoMatched: 0,
    needsReview: 0,
    unmatched: 0,
    totalLeads: 0,
    totalImveJobs: 0,
    lastMatchedAt: null,
  },
  lastMatchedAt: null,
};

export async function getImveCmmMatchLedger(): Promise<ImveCmmMatchLedger | null> {
  if (!isKvStorageReady()) return null;
  const stored = await kvGet<ImveCmmMatchLedger | string>(MATCH_LEDGER_KEY);
  if (!stored) return null;
  if (typeof stored === "string") {
    try {
      return JSON.parse(stored) as ImveCmmMatchLedger;
    } catch {
      return null;
    }
  }
  return stored;
}

export async function saveImveCmmMatchLedger(
  ledger: ImveCmmMatchLedger
): Promise<void> {
  if (!isKvStorageReady()) {
    throw new Error("Vercel KV is required to store i-MVE CMM matches.");
  }
  await kvSet(MATCH_LEDGER_KEY, ledger);
}

export async function getImveCmmMatchLedgerOrEmpty(): Promise<ImveCmmMatchLedger> {
  return (await getImveCmmMatchLedger()) ?? { ...EMPTY };
}

import { kvGet, kvSet, isKvStorageReady } from "./kv-client";
import type { CmmMatchLedger } from "./types";

const MATCH_LEDGER_KEY = "jarvis:cmm:lead-matches";

const EMPTY_LEDGER: CmmMatchLedger = {
  matches: {},
  reviewQueue: [],
  unmatchedDepositJobs: [],
  stats: {
    leadsMatchedConfidently: 0,
    possibleMatchesNeedingReview: 0,
    unmatchedLeads: 0,
    unmatchedDepositJobs: 0,
    totalLeads: 0,
    totalJobs: 0,
    lastMatchedAt: null,
  },
  lastMatchedAt: null,
};

export async function getCmmMatchLedger(): Promise<CmmMatchLedger | null> {
  if (!isKvStorageReady()) return null;
  const stored = await kvGet<CmmMatchLedger | string>(MATCH_LEDGER_KEY);
  if (!stored) return null;
  if (typeof stored === "string") {
    try {
      return JSON.parse(stored) as CmmMatchLedger;
    } catch {
      return null;
    }
  }
  return stored;
}

export async function saveCmmMatchLedger(ledger: CmmMatchLedger): Promise<void> {
  if (!isKvStorageReady()) {
    throw new Error("Vercel KV is required to store CMM lead matches.");
  }
  await kvSet(MATCH_LEDGER_KEY, ledger);
}

export async function getCmmMatchLedgerOrEmpty(): Promise<CmmMatchLedger> {
  return (await getCmmMatchLedger()) ?? { ...EMPTY_LEDGER };
}

export async function clearCmmMatchLedger(): Promise<void> {
  await saveCmmMatchLedger({ ...EMPTY_LEDGER });
}

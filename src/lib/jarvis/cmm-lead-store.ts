import { kvGet, kvSet, kvDel, isKvStorageReady } from "./kv-client";
import type { CmmLeadLedger, CmmLeadRecord, CmmSyncMeta } from "./types";

const LEDGER_KEY = "jarvis:cmm:lead-ledger";
const LAST_BACKFILL_KEY = "jarvis:cmm:last-backfill-at";
const LAST_MESSAGE_ID_KEY = "jarvis:cmm:last-message-id";
const SYNC_META_KEY = "jarvis:cmm:sync-meta";
const INGEST_LOCK_KEY = "jarvis:cmm:ingest-lock";
const INGEST_LOCK_TTL_MS = 20 * 60 * 1000;

type IngestLock = {
  mode: "rebuild" | "sync";
  startedAt: string;
};

export class CmmIngestLockedError extends Error {
  constructor(mode: string) {
    super(`CMM ingest already running (${mode}). Wait for it to finish before starting another.`);
    this.name = "CmmIngestLockedError";
  }
}

export async function acquireCmmIngestLock(
  mode: "rebuild" | "sync"
): Promise<void> {
  if (!isKvStorageReady()) return;

  const existing = await kvGet<IngestLock | string>(INGEST_LOCK_KEY);
  if (existing) {
    const lock: IngestLock =
      typeof existing === "string"
        ? (JSON.parse(existing) as IngestLock)
        : existing;
    const age = Date.now() - new Date(lock.startedAt).getTime();
    if (age < INGEST_LOCK_TTL_MS) {
      throw new CmmIngestLockedError(lock.mode);
    }
  }

  await kvSet(INGEST_LOCK_KEY, { mode, startedAt: new Date().toISOString() });
}

export async function releaseCmmIngestLock(): Promise<void> {
  if (!isKvStorageReady()) return;
  await kvDel(INGEST_LOCK_KEY);
}

export async function getCmmLeadLedger(): Promise<CmmLeadLedger | null> {
  if (!isKvStorageReady()) return null;
  const stored = await kvGet<CmmLeadLedger | string>(LEDGER_KEY);
  if (!stored) return null;
  if (typeof stored === "string") {
    try {
      return JSON.parse(stored) as CmmLeadLedger;
    } catch {
      return null;
    }
  }
  return stored;
}

export async function saveCmmLeadLedger(ledger: CmmLeadLedger): Promise<void> {
  if (!isKvStorageReady()) {
    throw new Error("Vercel KV is required to store CMM lead ledger.");
  }
  await kvSet(LEDGER_KEY, ledger);
}

export async function clearCmmLeadLedger(): Promise<void> {
  await saveCmmLeadLedger({ leads: [], version: 1 });
  await kvSet(LAST_MESSAGE_ID_KEY, "");
  await kvSet(SYNC_META_KEY, {
    messagesScanned: 0,
    leadsParsed: 0,
    duplicatesSkipped: 0,
    unknownPostcodes: 0,
    lastMessageDate: null,
    labelFound: false,
    lastSyncAt: null,
    error: null,
    debug: {
      labelName: null,
      labelId: null,
      messageIdsReturned: 0,
      messagesFetched: 0,
      parseSuccesses: 0,
      parseFailures: 0,
      duplicatesSkipped: 0,
      sampleParseFailure: null,
    },
  } satisfies CmmSyncMeta);
}

export async function getCmmLastBackfillAt(): Promise<string | null> {
  if (!isKvStorageReady()) return null;
  const v = await kvGet<string>(LAST_BACKFILL_KEY);
  return v ?? null;
}

export async function setCmmLastBackfillAt(iso: string): Promise<void> {
  await kvSet(LAST_BACKFILL_KEY, iso);
}

export async function getCmmLastMessageId(): Promise<string | null> {
  if (!isKvStorageReady()) return null;
  const v = await kvGet<string>(LAST_MESSAGE_ID_KEY);
  return v && v.length > 0 ? v : null;
}

export async function setCmmLastMessageId(id: string): Promise<void> {
  await kvSet(LAST_MESSAGE_ID_KEY, id);
}

export async function getCmmSyncMeta(): Promise<CmmSyncMeta | null> {
  if (!isKvStorageReady()) return null;
  const stored = await kvGet<CmmSyncMeta | string>(SYNC_META_KEY);
  if (!stored) return null;
  const parsed =
    typeof stored === "string"
      ? (JSON.parse(stored) as CmmSyncMeta)
      : stored;
  return {
    ...parsed,
    debug: parsed.debug ?? {
      labelName: null,
      labelId: null,
      messageIdsReturned: parsed.messagesScanned ?? 0,
      messagesFetched: parsed.messagesScanned ?? 0,
      parseSuccesses: parsed.leadsParsed ?? 0,
      parseFailures: 0,
      duplicatesSkipped: parsed.duplicatesSkipped ?? 0,
      sampleParseFailure: null,
    },
  };
}

export async function saveCmmSyncMeta(meta: CmmSyncMeta): Promise<void> {
  await kvSet(SYNC_META_KEY, meta);
}

export function mergeCmmLeads(
  existing: CmmLeadRecord[],
  incoming: CmmLeadRecord[]
): CmmLeadRecord[] {
  const byMessageId = new Map(existing.map((l) => [l.gmail_message_id, l]));
  const byInternalId = new Map(
    existing
      .filter((l) => l.cmm_internal_id)
      .map((l) => [l.cmm_internal_id!.toLowerCase(), l])
  );

  for (const lead of incoming) {
    if (lead.cmm_internal_id) {
      const key = lead.cmm_internal_id.toLowerCase();
      const prior = byInternalId.get(key);
      if (prior) {
        byMessageId.delete(prior.gmail_message_id);
      }
      byInternalId.set(key, lead);
    }
    byMessageId.set(lead.gmail_message_id, lead);
  }

  return [...byMessageId.values()].sort((a, b) => {
    const da = new Date(a.received_at).getTime();
    const db = new Date(b.received_at).getTime();
    return db - da;
  });
}

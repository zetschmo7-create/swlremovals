import { kvGet, kvSet, isKvStorageReady } from "./kv-client";
import type { CmmLeadLedger, CmmLeadRecord, CmmSyncMeta } from "./types";

const LEDGER_KEY = "jarvis:cmm:lead-ledger";
const LAST_BACKFILL_KEY = "jarvis:cmm:last-backfill-at";
const LAST_MESSAGE_ID_KEY = "jarvis:cmm:last-message-id";
const SYNC_META_KEY = "jarvis:cmm:sync-meta";

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
  if (typeof stored === "string") {
    try {
      return JSON.parse(stored) as CmmSyncMeta;
    } catch {
      return null;
    }
  }
  return stored;
}

export async function saveCmmSyncMeta(meta: CmmSyncMeta): Promise<void> {
  await kvSet(SYNC_META_KEY, meta);
}

export function mergeCmmLeads(
  existing: CmmLeadRecord[],
  incoming: CmmLeadRecord[]
): CmmLeadRecord[] {
  const byId = new Map(existing.map((l) => [l.gmail_message_id, l]));
  for (const lead of incoming) {
    byId.set(lead.gmail_message_id, lead);
  }
  return [...byId.values()].sort((a, b) => {
    const da = new Date(a.received_at).getTime();
    const db = new Date(b.received_at).getTime();
    return db - da;
  });
}

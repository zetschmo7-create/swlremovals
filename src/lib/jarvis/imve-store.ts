import { kvGet, kvSet, isKvStorageReady } from "./kv-client";
import type {
  ImveImportLedger,
  ImveImportPreviewSession,
} from "./imve-types";

const LEDGER_KEY = "jarvis:imve:import-ledger";
const PREVIEW_PREFIX = "jarvis:imve:preview:";

const EMPTY_LEDGER: ImveImportLedger = {
  version: 1,
  jobs: [],
  invoices: [],
  raw_files: [],
  imported_file_hashes: [],
  last_import_at: null,
  roi_active: false,
};

export async function getImveImportLedger(): Promise<ImveImportLedger | null> {
  if (!isKvStorageReady()) return null;
  const stored = await kvGet<ImveImportLedger | string>(LEDGER_KEY);
  if (!stored) return null;
  if (typeof stored === "string") {
    try {
      return JSON.parse(stored) as ImveImportLedger;
    } catch {
      return null;
    }
  }
  return stored;
}

export async function getImveImportLedgerOrEmpty(): Promise<ImveImportLedger> {
  return (await getImveImportLedger()) ?? { ...EMPTY_LEDGER };
}

export async function saveImveImportLedger(ledger: ImveImportLedger): Promise<void> {
  if (!isKvStorageReady()) {
    throw new Error("Vercel KV is required to store i-MVE imports.");
  }
  await kvSet(LEDGER_KEY, ledger);
}

export async function saveImvePreviewSession(
  session: ImveImportPreviewSession
): Promise<void> {
  if (!isKvStorageReady()) {
    throw new Error("Vercel KV is required for import preview sessions.");
  }
  await kvSet(`${PREVIEW_PREFIX}${session.session_id}`, session);
}

export async function getImvePreviewSession(
  sessionId: string
): Promise<ImveImportPreviewSession | null> {
  if (!isKvStorageReady()) return null;
  const stored = await kvGet<ImveImportPreviewSession | string>(
    `${PREVIEW_PREFIX}${sessionId}`
  );
  if (!stored) return null;
  if (typeof stored === "string") {
    try {
      return JSON.parse(stored) as ImveImportPreviewSession;
    } catch {
      return null;
    }
  }
  return stored;
}

export async function deleteImvePreviewSession(sessionId: string): Promise<void> {
  if (!isKvStorageReady()) return;
  await kvSet(`${PREVIEW_PREFIX}${sessionId}`, "");
}

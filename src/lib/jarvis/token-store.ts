import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { isKvStorageReady, kvDel, kvGet, kvSet } from "./kv-client";
import type { JarvisAccount } from "./types";

const KV_KEY = "jarvis:gmail-connections";

export type StoredGmailConnection = {
  email: string;
  connectedAt: string;
  encryptedRefreshToken: string;
};

export type GmailConnectionsRecord = Partial<
  Record<JarvisAccount, StoredGmailConnection>
>;

export type GmailAccountStatus = {
  connected: boolean;
  email?: string;
  connectedAt?: string;
};

export type GmailConnectionStatus = {
  storageReady: boolean;
  googleOAuthConfigured: boolean;
  main: GmailAccountStatus;
  appointments: GmailAccountStatus;
  fullyConnected: boolean;
  missing: string[];
};

function getEncryptionKey(): Buffer | null {
  const secret = process.env.JARVIS_SESSION_SECRET;
  if (!secret) return null;
  return createHash("sha256").update(`jarvis-gmail:${secret}`).digest();
}

function encryptValue(plaintext: string): string {
  const key = getEncryptionKey();
  if (!key) throw new Error("JARVIS_SESSION_SECRET is required for token encryption.");

  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

function decryptValue(payload: string): string {
  const key = getEncryptionKey();
  if (!key) throw new Error("JARVIS_SESSION_SECRET is required for token decryption.");

  const data = Buffer.from(payload, "base64url");
  const iv = data.subarray(0, 12);
  const tag = data.subarray(12, 28);
  const encrypted = data.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
    "utf8"
  );
}

async function readConnections(): Promise<GmailConnectionsRecord> {
  if (!isKvStorageReady()) return {};
  const record = await kvGet<GmailConnectionsRecord>(KV_KEY);
  if (!record) return {};
  if (typeof record === "string") {
    try {
      return JSON.parse(record) as GmailConnectionsRecord;
    } catch {
      return {};
    }
  }
  return record;
}

async function writeConnections(record: GmailConnectionsRecord): Promise<void> {
  if (!isKvStorageReady()) {
    throw new Error(
      "Vercel KV is not linked. Add a KV database to this Vercel project."
    );
  }
  await kvSet(KV_KEY, record);
}

function legacyEnvToken(account: JarvisAccount): string | null {
  if (account === "main") return process.env.GMAIL_MAIN_REFRESH_TOKEN ?? null;
  return process.env.GMAIL_APPOINTMENTS_REFRESH_TOKEN ?? null;
}

export async function storeGmailConnection(
  account: JarvisAccount,
  refreshToken: string,
  email: string
): Promise<void> {
  const record = await readConnections();
  record[account] = {
    email,
    connectedAt: new Date().toISOString(),
    encryptedRefreshToken: encryptValue(refreshToken),
  };
  await writeConnections(record);
}

export async function removeGmailConnection(
  account: JarvisAccount
): Promise<void> {
  if (!isKvStorageReady()) return;
  const record = await readConnections();
  delete record[account];
  if (Object.keys(record).length === 0) {
    await kvDel(KV_KEY);
  } else {
    await writeConnections(record);
  }
}

export async function getGmailRefreshToken(
  account: JarvisAccount
): Promise<string | null> {
  const record = await readConnections();
  const stored = record[account];
  if (stored?.encryptedRefreshToken) {
    try {
      return decryptValue(stored.encryptedRefreshToken);
    } catch {
      return null;
    }
  }

  return legacyEnvToken(account);
}

export async function getGmailConnectionStatus(): Promise<GmailConnectionStatus> {
  const missing: string[] = [];
  const googleOAuthConfigured = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );
  const storageReady = isKvStorageReady();

  if (!googleOAuthConfigured) {
    missing.push("GOOGLE_CLIENT_ID");
    missing.push("GOOGLE_CLIENT_SECRET");
  }
  if (!process.env.JARVIS_SESSION_SECRET) {
    missing.push("JARVIS_SESSION_SECRET");
  }
  if (!storageReady) {
    missing.push("Vercel KV (Storage → Create Database → KV → link to project)");
  }

  const record = await readConnections();

  const main: GmailAccountStatus = record.main
    ? {
        connected: true,
        email: record.main.email,
        connectedAt: record.main.connectedAt,
      }
    : legacyEnvToken("main")
      ? { connected: true, email: "Legacy env token" }
      : { connected: false };

  const appointments: GmailAccountStatus = record.appointments
    ? {
        connected: true,
        email: record.appointments.email,
        connectedAt: record.appointments.connectedAt,
      }
    : legacyEnvToken("appointments")
      ? { connected: true, email: "Legacy env token" }
      : { connected: false };

  return {
    storageReady,
    googleOAuthConfigured,
    main,
    appointments,
    fullyConnected: main.connected && appointments.connected,
    missing,
  };
}

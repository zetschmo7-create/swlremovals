import { google, gmail_v1 } from "googleapis";
import type { JarvisEmail } from "./types";
import { JARVIS_CONFIG } from "./config";
import { getGoogleOAuthCredentials } from "./oauth";
import { getGmailRefreshToken } from "./token-store";

function decodeBase64Url(data: string): string {
  const normalized = data.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64").toString("utf8");
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractBodies(
  payload: gmail_v1.Schema$MessagePart | undefined
): { plain: string; html: string } {
  if (!payload) return { plain: "", html: "" };

  let plain = "";
  let html = "";

  if (payload.mimeType === "text/plain" && payload.body?.data) {
    plain += decodeBase64Url(payload.body.data);
  } else if (payload.mimeType === "text/html" && payload.body?.data) {
    html += decodeBase64Url(payload.body.data);
  }

  for (const part of payload.parts ?? []) {
    const child = extractBodies(part);
    plain += child.plain;
    html += child.html;
  }

  return { plain, html };
}

function extractBody(payload: gmail_v1.Schema$MessagePart | undefined): string {
  const { plain, html } = extractBodies(payload);
  if (plain.trim()) return plain.trim();
  if (html.trim()) return stripHtml(html);
  return "";
}

function getHeader(
  headers: gmail_v1.Schema$MessagePartHeader[] | undefined,
  name: string
): string {
  return headers?.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value ?? "";
}

async function buildLabelMap(gmail: gmail_v1.Gmail): Promise<Map<string, string>> {
  const res = await gmail.users.labels.list({ userId: "me" });
  const map = new Map<string, string>();
  for (const label of res.data.labels ?? []) {
    if (label.id && label.name) map.set(label.id, label.name);
  }
  return map;
}

export type CmmLabelInfo = {
  id: string;
  name: string;
};

export async function resolveCmmLabel(
  gmail: gmail_v1.Gmail
): Promise<CmmLabelInfo | null> {
  const res = await gmail.users.labels.list({ userId: "me" });
  const exact = (res.data.labels ?? []).find(
    (label) => label.name === JARVIS_CONFIG.cmmLeadLabel && label.id
  );
  if (exact?.id && exact.name) {
    return { id: exact.id, name: exact.name };
  }
  return null;
}

function mapMessage(
  message: gmail_v1.Schema$Message,
  labelMap: Map<string, string>
): JarvisEmail {
  const headers = message.payload?.headers;
  const labels = (message.labelIds ?? []).map((id) => labelMap.get(id) ?? id);

  return {
    id: message.id ?? crypto.randomUUID(),
    account: "main",
    threadId: message.threadId ?? message.id ?? crypto.randomUUID(),
    subject: getHeader(headers, "Subject") || "(No subject)",
    from: getHeader(headers, "From"),
    date: getHeader(headers, "Date"),
    snippet: message.snippet ?? "",
    body: extractBody(message.payload),
    labels,
    parsedPdfs: [],
    internalDateMs: message.internalDate
      ? Number(message.internalDate)
      : undefined,
  };
}

export type CmmFetchProgress = {
  pagesFetched: number;
  messageIdsFound: number;
  messagesFetched: number;
};

export type CmmFetchResult = {
  emails: JarvisEmail[];
  labelFound: boolean;
  labelName: string | null;
  labelId: string | null;
  messageIdsReturned: number;
  messagesFetched: number;
};

async function getMainGmailClient(): Promise<gmail_v1.Gmail | null> {
  const creds = getGoogleOAuthCredentials();
  const token = await getGmailRefreshToken("main");
  if (!creds || !token) return null;
  const oauth2 = new google.auth.OAuth2(creds.clientId, creds.clientSecret);
  oauth2.setCredentials({ refresh_token: token });
  return google.gmail({ version: "v1", auth: oauth2 });
}

export async function verifyCmmLabelExists(): Promise<boolean> {
  const gmail = await getMainGmailClient();
  if (!gmail) return false;
  const label = await resolveCmmLabel(gmail);
  return label !== null;
}

export async function fetchCmmLabelEmails(options?: {
  mode?: "rebuild" | "sync";
  existingMessageIds?: Set<string>;
  afterInternalDateMs?: number | null;
  onProgress?: (progress: CmmFetchProgress) => void;
}): Promise<CmmFetchResult> {
  const empty: CmmFetchResult = {
    emails: [],
    labelFound: false,
    labelName: null,
    labelId: null,
    messageIdsReturned: 0,
    messagesFetched: 0,
  };

  const gmail = await getMainGmailClient();
  if (!gmail) return empty;

  const cmmLabel = await resolveCmmLabel(gmail);
  if (!cmmLabel) return empty;

  const labelMap = await buildLabelMap(gmail);
  const existingIds = options?.existingMessageIds ?? new Set<string>();
  const afterMs = options?.afterInternalDateMs ?? null;
  const isSync = options?.mode === "sync";

  const messageIds: string[] = [];
  let pageToken: string | undefined;
  let pagesFetched = 0;

  do {
    const list = await gmail.users.messages.list({
      userId: "me",
      labelIds: [cmmLabel.id],
      maxResults: 500,
      pageToken,
    });
    pagesFetched += 1;

    for (const m of list.data.messages ?? []) {
      if (m.id) messageIds.push(m.id);
    }

    pageToken = list.data.nextPageToken ?? undefined;
    options?.onProgress?.({
      pagesFetched,
      messageIdsFound: messageIds.length,
      messagesFetched: 0,
    });
  } while (pageToken);

  let idsToFetch = messageIds;
  if (isSync) {
    idsToFetch = messageIds.filter((id) => !existingIds.has(id));
  }

  const emails: JarvisEmail[] = [];
  const batchSize = 25;

  for (let i = 0; i < idsToFetch.length; i += batchSize) {
    const batch = idsToFetch.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (id) => {
        const full = await gmail.users.messages.get({
          userId: "me",
          id,
          format: "full",
        });
        return full.data;
      })
    );

    for (const message of results) {
      if (!message.id) continue;
      const internalDateMs = message.internalDate
        ? Number(message.internalDate)
        : 0;
      if (
        isSync &&
        afterMs != null &&
        internalDateMs > 0 &&
        internalDateMs <= afterMs
      ) {
        continue;
      }
      emails.push(mapMessage(message, labelMap));
    }

    options?.onProgress?.({
      pagesFetched,
      messageIdsFound: messageIds.length,
      messagesFetched: emails.length,
    });
  }

  emails.sort((a, b) => {
    const da = a.internalDateMs ?? new Date(a.date).getTime();
    const db = b.internalDateMs ?? new Date(b.date).getTime();
    return db - da;
  });

  return {
    emails,
    labelFound: true,
    labelName: cmmLabel.name,
    labelId: cmmLabel.id,
    messageIdsReturned: messageIds.length,
    messagesFetched: emails.length,
  };
}

/** @deprecated Use fetchCmmLabelEmails */
export async function fetchAllCmmLabelEmails(options?: {
  afterDate?: string | null;
  onProgress?: (progress: CmmFetchProgress) => void;
}): Promise<{ emails: JarvisEmail[]; labelFound: boolean }> {
  const result = await fetchCmmLabelEmails({
    mode: "rebuild",
    onProgress: options?.onProgress,
  });
  return { emails: result.emails, labelFound: result.labelFound };
}

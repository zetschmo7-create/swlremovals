import { google, gmail_v1 } from "googleapis";
import type { JarvisEmail } from "./types";
import { JARVIS_CONFIG } from "./config";
import { getGoogleOAuthCredentials } from "./oauth";
import { getGmailRefreshToken } from "./token-store";

function decodeBase64Url(data: string): string {
  const normalized = data.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64").toString("utf8");
}

function extractBody(payload: gmail_v1.Schema$MessagePart | undefined): string {
  if (!payload) return "";
  if (payload.body?.data) return decodeBase64Url(payload.body.data);
  const parts = payload.parts ?? [];
  const plain = parts.find((p) => p.mimeType === "text/plain");
  if (plain?.body?.data) return decodeBase64Url(plain.body.data);
  const html = parts.find((p) => p.mimeType === "text/html");
  if (html?.body?.data) {
    return decodeBase64Url(html.body.data)
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  return parts.map((part) => extractBody(part)).join("\n");
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
  };
}

export type CmmFetchProgress = {
  pagesFetched: number;
  messageIdsFound: number;
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
  const res = await gmail.users.labels.list({ userId: "me" });
  return (res.data.labels ?? []).some(
    (l) => l.name?.toLowerCase() === JARVIS_CONFIG.cmmLeadLabel.toLowerCase()
  );
}

function formatGmailAfterDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

export async function fetchAllCmmLabelEmails(options?: {
  afterDate?: string | null;
  onProgress?: (progress: CmmFetchProgress) => void;
}): Promise<{ emails: JarvisEmail[]; labelFound: boolean }> {
  const gmail = await getMainGmailClient();
  if (!gmail) {
    return { emails: [], labelFound: false };
  }

  const labelFound = await verifyCmmLabelExists();
  if (!labelFound) {
    return { emails: [], labelFound: false };
  }

  const labelMap = await buildLabelMap(gmail);
  const cmmLabel = JARVIS_CONFIG.cmmLeadLabel.replace(/"/g, '\\"');
  let query = `label:"${cmmLabel}"`;
  if (options?.afterDate) {
    query += ` after:${formatGmailAfterDate(options.afterDate)}`;
  }

  const messageIds: string[] = [];
  let pageToken: string | undefined;
  let pagesFetched = 0;

  do {
    const list = await gmail.users.messages.list({
      userId: "me",
      q: query,
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

  const emails: JarvisEmail[] = [];
  const batchSize = 25;

  for (let i = 0; i < messageIds.length; i += batchSize) {
    const batch = messageIds.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (id) => {
        const full = await gmail.users.messages.get({
          userId: "me",
          id,
          format: "full",
        });
        return mapMessage(full.data, labelMap);
      })
    );
    emails.push(...results);
    options?.onProgress?.({
      pagesFetched,
      messageIdsFound: messageIds.length,
      messagesFetched: emails.length,
    });
  }

  emails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return { emails, labelFound: true };
}

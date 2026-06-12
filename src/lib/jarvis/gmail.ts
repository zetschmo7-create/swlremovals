import { google, gmail_v1 } from "googleapis";
import type { JarvisAccount, JarvisEmail } from "./types";
import { JARVIS_CONFIG } from "./config";
import { getGoogleOAuthCredentials } from "./oauth";
import {
  getGmailConnectionStatus,
  getGmailRefreshToken,
  type GmailConnectionStatus,
} from "./token-store";

type GmailCredentials = {
  clientId: string;
  clientSecret: string;
};

async function getGmailCredentials(): Promise<GmailCredentials | null> {
  return getGoogleOAuthCredentials();
}

export async function getGmailSetupStatus(): Promise<GmailConnectionStatus> {
  return getGmailConnectionStatus();
}

function createGmailClient(refreshToken: string, creds: GmailCredentials) {
  const oauth2 = new google.auth.OAuth2(creds.clientId, creds.clientSecret);
  oauth2.setCredentials({ refresh_token: refreshToken });
  return google.gmail({ version: "v1", auth: oauth2 });
}

function decodeBase64Url(data: string): string {
  const normalized = data.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64").toString("utf8");
}

function extractBody(payload: gmail_v1.Schema$MessagePart | undefined): string {
  if (!payload) return "";

  if (payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }

  const parts = payload.parts ?? [];
  const plain = parts.find((p) => p.mimeType === "text/plain");
  if (plain?.body?.data) return decodeBase64Url(plain.body.data);

  const html = parts.find((p) => p.mimeType === "text/html");
  if (html?.body?.data) {
    const raw = decodeBase64Url(html.body.data);
    return raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }

  return parts.map((part) => extractBody(part)).join("\n");
}

function getHeader(
  headers: gmail_v1.Schema$MessagePartHeader[] | undefined,
  name: string
): string {
  return headers?.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value ?? "";
}

function mapMessage(
  message: gmail_v1.Schema$Message,
  account: JarvisAccount,
  labelMap: Map<string, string>
): JarvisEmail {
  const headers = message.payload?.headers;
  const labelIds = message.labelIds ?? [];
  const labels = labelIds.map((id) => labelMap.get(id) ?? id);

  return {
    id: message.id ?? crypto.randomUUID(),
    account,
    subject: getHeader(headers, "Subject") || "(No subject)",
    from: getHeader(headers, "From"),
    date: getHeader(headers, "Date"),
    snippet: message.snippet ?? "",
    body: extractBody(message.payload),
    labels,
  };
}

async function buildLabelMap(
  gmail: gmail_v1.Gmail
): Promise<Map<string, string>> {
  const res = await gmail.users.labels.list({ userId: "me" });
  const map = new Map<string, string>();
  for (const label of res.data.labels ?? []) {
    if (label.id && label.name) map.set(label.id, label.name);
  }
  return map;
}

async function fetchAccountEmails(
  gmail: gmail_v1.Gmail,
  account: JarvisAccount,
  query: string
): Promise<JarvisEmail[]> {
  const labelMap = await buildLabelMap(gmail);
  const list = await gmail.users.messages.list({
    userId: "me",
    q: query,
    maxResults: 100,
  });

  const ids = list.data.messages ?? [];
  if (ids.length === 0) return [];

  const messages = await Promise.all(
    ids.map(async (item) => {
      if (!item.id) return null;
      const full = await gmail.users.messages.get({
        userId: "me",
        id: item.id,
        format: "full",
      });
      return mapMessage(full.data, account, labelMap);
    })
  );

  return messages.filter((m): m is JarvisEmail => m !== null);
}

export async function fetchJarvisEmails(
  options?: { days?: number }
): Promise<JarvisEmail[]> {
  const creds = await getGmailCredentials();
  if (!creds) return [];

  const [mainToken, appointmentsToken] = await Promise.all([
    getGmailRefreshToken("main"),
    getGmailRefreshToken("appointments"),
  ]);

  if (!mainToken || !appointmentsToken) return [];

  const days = options?.days ?? 1;
  const lookbackQuery =
    days <= 1
      ? `newer_than:${JARVIS_CONFIG.lookbackHours}h`
      : `newer_than:${days}d`;

  const mainGmail = createGmailClient(mainToken, creds);
  const appointmentsGmail = createGmailClient(appointmentsToken, creds);

  const cmmLabel = JARVIS_CONFIG.cmmLeadLabel.replace(/"/g, '\\"');
  const mainQuery = `label:"${cmmLabel}" ${lookbackQuery}`;
  const appointmentsQuery = lookbackQuery;

  const [mainEmails, appointmentEmails] = await Promise.all([
    fetchAccountEmails(mainGmail, "main", mainQuery),
    fetchAccountEmails(appointmentsGmail, "appointments", appointmentsQuery),
  ]);

  return [...mainEmails, ...appointmentEmails];
}

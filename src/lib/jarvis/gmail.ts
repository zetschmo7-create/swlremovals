import { google, gmail_v1 } from "googleapis";
import type { JarvisAccount, JarvisEmail, PdfDiagnosticEntry } from "./types";
import { JARVIS_CONFIG } from "./config";
import { getGoogleOAuthCredentials } from "./oauth";
import {
  getGmailConnectionStatus,
  getGmailRefreshToken,
  type GmailConnectionStatus,
} from "./token-store";
import {
  evaluatePdfAttachment,
  ignoredPdfResult,
  isPdfRelevantEmail,
} from "./pdf-whitelist";
import { parsePdfBuffer, type PdfParseResult } from "./pdf-parser";

type GmailCredentials = {
  clientId: string;
  clientSecret: string;
};

type AttachmentPart = {
  filename: string;
  mimeType: string;
  attachmentId: string;
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

function decodeBase64UrlBuffer(data: string): Buffer {
  const normalized = data.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64");
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

function collectAttachmentParts(
  payload: gmail_v1.Schema$MessagePart | undefined,
  acc: AttachmentPart[] = []
): AttachmentPart[] {
  if (!payload) return acc;

  if (
    payload.filename &&
    payload.body?.attachmentId &&
    /pdf/i.test(payload.mimeType ?? payload.filename)
  ) {
    acc.push({
      filename: payload.filename,
      mimeType: payload.mimeType ?? "application/pdf",
      attachmentId: payload.body.attachmentId,
    });
  }

  for (const part of payload.parts ?? []) {
    collectAttachmentParts(part, acc);
  }
  return acc;
}

function getHeader(
  headers: gmail_v1.Schema$MessagePartHeader[] | undefined,
  name: string
): string {
  return headers?.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value ?? "";
}

async function downloadAttachment(
  gmail: gmail_v1.Gmail,
  messageId: string,
  attachmentId: string
): Promise<Buffer | null> {
  try {
    const res = await gmail.users.messages.attachments.get({
      userId: "me",
      id: attachmentId,
      messageId,
    });
    if (!res.data.data) return null;
    return decodeBase64UrlBuffer(res.data.data);
  } catch {
    return null;
  }
}

async function parseMessagePdfs(
  gmail: gmail_v1.Gmail,
  messageId: string,
  payload: gmail_v1.Schema$MessagePart | undefined,
  emailStub: Pick<JarvisEmail, "subject" | "from" | "account">,
  parsePdfs: boolean,
  includeIgnored: boolean
): Promise<PdfParseResult[]> {
  if (!parsePdfs) return [];

  const parts = collectAttachmentParts(payload);
  if (parts.length === 0) return [];

  const results: PdfParseResult[] = [];
  for (const part of parts) {
    const decision = evaluatePdfAttachment(emailStub, part.filename);

    if (!decision.shouldParse) {
      if (includeIgnored) {
        results.push(
          ignoredPdfResult(part.filename, decision.reason, decision.category)
        );
      }
      continue;
    }

    const buffer = await downloadAttachment(gmail, messageId, part.attachmentId);
    if (!buffer) {
      results.push({
        filename: part.filename,
        status: "missing",
        category: decision.category,
        reason: decision.reason,
        text: null,
        textLength: 0,
        fields: {
          jobReference: null,
          customerName: null,
          customerEmail: null,
          quoteValue: null,
          depositValue: null,
          balanceValue: null,
          totalValue: null,
          movingFromAddress: null,
          movingFromPostcode: null,
          movingToAddress: null,
          movingToPostcode: null,
          moveDate: null,
        },
        log: `PDF missing: ${part.filename}`,
      });
      continue;
    }

    results.push(
      await parsePdfBuffer(buffer, part.filename, {
        category: decision.category,
        reason: decision.reason,
        subjectFallback: emailStub.subject,
      })
    );
  }
  return results;
}

function mapMessage(
  message: gmail_v1.Schema$Message,
  account: JarvisAccount,
  labelMap: Map<string, string>,
  parsedPdfs: PdfParseResult[]
): JarvisEmail {
  const headers = message.payload?.headers;
  const labelIds = message.labelIds ?? [];
  const labels = labelIds.map((id) => labelMap.get(id) ?? id);

  return {
    id: message.id ?? crypto.randomUUID(),
    account,
    threadId: message.threadId ?? message.id ?? crypto.randomUUID(),
    subject: getHeader(headers, "Subject") || "(No subject)",
    from: getHeader(headers, "From"),
    date: getHeader(headers, "Date"),
    snippet: message.snippet ?? "",
    body: extractBody(message.payload),
    labels,
    parsedPdfs,
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
  query: string,
  options?: { parsePdfs?: boolean; includeIgnoredPdfs?: boolean }
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

      const subject = getHeader(full.data.payload?.headers, "Subject");
      const snippet = full.data.snippet ?? "";
      const body = extractBody(full.data.payload);
      const from = getHeader(full.data.payload?.headers, "From");
      const stub: JarvisEmail = {
        id: item.id,
        account,
        threadId: full.data.threadId ?? item.id,
        subject,
        from,
        date: getHeader(full.data.payload?.headers, "Date"),
        snippet,
        body,
        labels: [],
        parsedPdfs: [],
      };

      const hasPdfParts =
        collectAttachmentParts(full.data.payload).length > 0;
      const shouldParse =
        options?.parsePdfs !== false &&
        hasPdfParts &&
        isPdfRelevantEmail(stub);

      const parsedPdfs = shouldParse
        ? await parseMessagePdfs(
            gmail,
            item.id,
            full.data.payload,
            stub,
            true,
            options?.includeIgnoredPdfs ?? false
          )
        : [];

      return mapMessage(full.data, account, labelMap, parsedPdfs);
    })
  );

  return messages.filter((m): m is JarvisEmail => m !== null);
}

async function getGmailClients(): Promise<{
  main: gmail_v1.Gmail;
  appointments: gmail_v1.Gmail;
} | null> {
  const creds = await getGmailCredentials();
  if (!creds) return null;

  const [mainToken, appointmentsToken] = await Promise.all([
    getGmailRefreshToken("main"),
    getGmailRefreshToken("appointments"),
  ]);

  if (!mainToken || !appointmentsToken) return null;

  return {
    main: createGmailClient(mainToken, creds),
    appointments: createGmailClient(appointmentsToken, creds),
  };
}

export async function fetchJarvisEmails(
  options?: { days?: number; parsePdfs?: boolean }
): Promise<JarvisEmail[]> {
  const clients = await getGmailClients();
  if (!clients) return [];

  const days = options?.days ?? 1;
  const lookbackQuery =
    days <= 1
      ? `newer_than:${JARVIS_CONFIG.lookbackHours}h`
      : `newer_than:${days}d`;

  const cmmLabel = JARVIS_CONFIG.cmmLeadLabel.replace(/"/g, '\\"');
  const mainQuery = `label:"${cmmLabel}" ${lookbackQuery}`;
  const appointmentsQuery = lookbackQuery;

  const [mainEmails, appointmentEmails] = await Promise.all([
    fetchAccountEmails(clients.main, "main", mainQuery, {
      parsePdfs: options?.parsePdfs,
      includeIgnoredPdfs: false,
    }),
    fetchAccountEmails(clients.appointments, "appointments", appointmentsQuery, {
      parsePdfs: options?.parsePdfs,
      includeIgnoredPdfs: false,
    }),
  ]);

  return [...mainEmails, ...appointmentEmails];
}

function toDiagnosticEntry(
  email: Pick<JarvisEmail, "subject" | "date" | "account" | "from">,
  result: PdfParseResult
): PdfDiagnosticEntry {
  return {
    emailSubject: email.subject,
    emailDate: email.date,
    emailFrom: email.from,
    account: email.account,
    filename: result.filename,
    status: result.status,
    category: result.category,
    reason: result.reason,
    textLength: result.textLength,
    textPreview: result.text ? result.text.slice(0, 500) : null,
    fields: result.fields,
    log: result.log,
  };
}

export async function fetchPdfDiagnostics(
  limit = 40
): Promise<PdfDiagnosticEntry[]> {
  const clients = await getGmailClients();
  if (!clients) return [];

  const query = "newer_than:30d has:attachment filename:pdf";

  const accounts: Array<{ gmail: gmail_v1.Gmail; account: JarvisAccount }> = [
    { gmail: clients.appointments, account: "appointments" },
    { gmail: clients.main, account: "main" },
  ];

  const entries: PdfDiagnosticEntry[] = [];

  for (const { gmail, account } of accounts) {
    const list = await gmail.users.messages.list({
      userId: "me",
      q: query,
      maxResults: 80,
    });

    for (const item of list.data.messages ?? []) {
      if (!item.id || entries.length >= limit) break;

      const full = await gmail.users.messages.get({
        userId: "me",
        id: item.id,
        format: "full",
      });

      const subject = getHeader(full.data.payload?.headers, "Subject");
      const date = getHeader(full.data.payload?.headers, "Date");
      const from = getHeader(full.data.payload?.headers, "From");
      const parts = collectAttachmentParts(full.data.payload);

      const emailStub = { subject, from, account };

      for (const part of parts) {
        if (entries.length >= limit) break;

        const decision = evaluatePdfAttachment(emailStub, part.filename);

        if (!decision.shouldParse) {
          entries.push(
            toDiagnosticEntry(
              { subject, date, account, from },
              ignoredPdfResult(part.filename, decision.reason, decision.category)
            )
          );
          continue;
        }

        const buffer = await downloadAttachment(gmail, item.id, part.attachmentId);
        const result = buffer
          ? await parsePdfBuffer(buffer, part.filename, {
              category: decision.category,
              reason: decision.reason,
              subjectFallback: subject,
            })
          : {
              filename: part.filename,
              status: "missing" as const,
              category: decision.category,
              reason: decision.reason,
              text: null,
              textLength: 0,
              fields: {
                jobReference: null,
                customerName: null,
                customerEmail: null,
                quoteValue: null,
                depositValue: null,
                balanceValue: null,
                totalValue: null,
                movingFromAddress: null,
                movingFromPostcode: null,
                movingToAddress: null,
                movingToPostcode: null,
                moveDate: null,
              },
              log: `PDF missing: ${part.filename}`,
            };

        entries.push(
          toDiagnosticEntry({ subject, date, account, from }, result)
        );
      }
    }
  }

  return entries.slice(0, limit);
}

export async function testPdfAttachment(
  account: JarvisAccount,
  messageId: string,
  attachmentId: string,
  filename: string,
  subject: string,
  from: string
): Promise<PdfDiagnosticEntry> {
  const clients = await getGmailClients();
  if (!clients) {
    throw new Error("Gmail not connected");
  }

  const gmail = account === "main" ? clients.main : clients.appointments;
  const decision = evaluatePdfAttachment({ subject, from, account }, filename);

  if (!decision.shouldParse) {
    return toDiagnosticEntry(
      { subject, date: "", account, from },
      ignoredPdfResult(filename, decision.reason, decision.category)
    );
  }

  const buffer = await downloadAttachment(gmail, messageId, attachmentId);
  if (!buffer) {
    return toDiagnosticEntry(
      { subject, date: "", account, from },
      {
        filename,
        status: "missing",
        category: decision.category,
        reason: decision.reason,
        text: null,
        textLength: 0,
        fields: {
          jobReference: null,
          customerName: null,
          customerEmail: null,
          quoteValue: null,
          depositValue: null,
          balanceValue: null,
          totalValue: null,
          movingFromAddress: null,
          movingFromPostcode: null,
          movingToAddress: null,
          movingToPostcode: null,
          moveDate: null,
        },
        log: `PDF missing: ${filename}`,
      }
    );
  }

  const result = await parsePdfBuffer(buffer, filename, {
    category: decision.category,
    reason: decision.reason,
    subjectFallback: subject,
  });

  return toDiagnosticEntry({ subject, date: "", account, from }, result);
}

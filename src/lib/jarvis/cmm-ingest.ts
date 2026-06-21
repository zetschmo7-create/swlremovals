import {
  parseCmmLeadEmailWithReason,
  dedupeCmmLeads,
} from "./cmm-parser";
import { fetchCmmLabelEmails } from "./cmm-gmail";
import {
  clearCmmLeadLedger,
  getCmmLeadLedger,
  getCmmSyncMeta,
  mergeCmmLeads,
  saveCmmLeadLedger,
  saveCmmSyncMeta,
  setCmmLastBackfillAt,
  setCmmLastMessageId,
  acquireCmmIngestLock,
  releaseCmmIngestLock,
} from "./cmm-lead-store";
import { CMM_PARSER_VERSION } from "./cmm-parser-version";
import { getJarvisSettings } from "./settings-store";
import type { CmmLeadLedger, CmmSyncDebug, CmmSyncMeta } from "./types";

export type CmmIngestResult = {
  success: boolean;
  messagesScanned: number;
  leadsParsed: number;
  duplicatesSkipped: number;
  unknownPostcodes: number;
  totalLeads: number;
  lastMessageDate: string | null;
  labelFound: boolean;
  error: string | null;
  debug: CmmSyncDebug;
};

function emptyDebug(): CmmSyncDebug {
  return {
    labelName: null,
    labelId: null,
    messageIdsReturned: 0,
    messagesFetched: 0,
    parseSuccesses: 0,
    parseFailures: 0,
    duplicatesSkipped: 0,
    sampleParseFailure: null,
  };
}

async function ingestEmails(
  mode: "rebuild" | "sync"
): Promise<CmmIngestResult> {
  await acquireCmmIngestLock(mode);

  try {
    return await ingestEmailsUnlocked(mode);
  } finally {
    await releaseCmmIngestLock();
  }
}

async function ingestEmailsUnlocked(
  mode: "rebuild" | "sync"
): Promise<CmmIngestResult> {
  const settings = await getJarvisSettings();
  const leadCost = settings.costPerLead;

  let existingLedger: CmmLeadLedger | null = null;
  const existingMessageIds = new Set<string>();
  let afterInternalDateMs: number | null = null;

  if (mode === "sync") {
    existingLedger = await getCmmLeadLedger();
    for (const lead of existingLedger?.leads ?? []) {
      existingMessageIds.add(lead.gmail_message_id);
    }
    const priorMeta = await getCmmSyncMeta();
    if (priorMeta?.lastSyncAt) {
      afterInternalDateMs = new Date(priorMeta.lastSyncAt).getTime() - 86_400_000;
    }
  } else {
    await clearCmmLeadLedger();
  }

  const fetchResult = await fetchCmmLabelEmails({
    mode,
    existingMessageIds: mode === "sync" ? existingMessageIds : undefined,
    afterInternalDateMs: mode === "sync" ? afterInternalDateMs : null,
  });

  if (!fetchResult.labelFound) {
    const debug = emptyDebug();
    const meta: CmmSyncMeta = {
      messagesScanned: 0,
      leadsParsed: 0,
      duplicatesSkipped: 0,
      unknownPostcodes: 0,
      lastMessageDate: null,
      labelFound: false,
      lastSyncAt: new Date().toISOString(),
      error: "CMM label not found or Gmail access issue.",
      debug,
    };
    await saveCmmSyncMeta(meta);
    return {
      success: false,
      messagesScanned: 0,
      leadsParsed: 0,
      duplicatesSkipped: 0,
      unknownPostcodes: 0,
      totalLeads: existingLedger?.leads.length ?? 0,
      lastMessageDate: null,
      labelFound: false,
      error: meta.error,
      debug,
    };
  }

  let parseSuccesses = 0;
  let parseFailures = 0;
  let sampleParseFailure: string | null = null;
  const parsed = [];

  for (const email of fetchResult.emails) {
    const result = parseCmmLeadEmailWithReason(email, leadCost);
    if (result.lead) {
      parseSuccesses += 1;
      parsed.push(result.lead);
    } else {
      parseFailures += 1;
      if (!sampleParseFailure && result.failureReason) {
        sampleParseFailure = result.failureReason;
      }
    }
  }

  const combined =
    mode === "sync" && existingLedger
      ? mergeCmmLeads(existingLedger.leads, parsed)
      : parsed;

  const { unique, duplicatesSkipped } = dedupeCmmLeads(combined);
  const unknownPostcodes = unique.filter(
    (l) =>
      l.collection_postcode_area === "Unknown" ||
      l.current_area_prefix === "Unknown"
  ).length;

  const ledger: CmmLeadLedger = { leads: unique, version: 1 };
  await saveCmmLeadLedger(ledger);

  const newest = unique[0];
  if (newest) {
    await setCmmLastMessageId(newest.gmail_message_id);
  }

  const now = new Date().toISOString();
  if (mode === "rebuild") {
    await setCmmLastBackfillAt(now);
  }

  const debug: CmmSyncDebug = {
    labelName: fetchResult.labelName,
    labelId: fetchResult.labelId,
    messageIdsReturned: fetchResult.messageIdsReturned,
    messagesFetched: fetchResult.messagesFetched,
    parseSuccesses,
    parseFailures,
    duplicatesSkipped,
    sampleParseFailure,
  };

  const lastMessageDate = newest?.received_at ?? null;
  const priorMeta = mode === "sync" ? await getCmmSyncMeta() : null;
  const meta: CmmSyncMeta = {
    messagesScanned: fetchResult.messageIdsReturned,
    leadsParsed: parseSuccesses,
    duplicatesSkipped,
    unknownPostcodes,
    lastMessageDate,
    labelFound: true,
    lastSyncAt: now,
    error: null,
    debug,
    parserVersion: CMM_PARSER_VERSION,
    rebuiltAt: mode === "rebuild" ? now : priorMeta?.rebuiltAt ?? null,
  };
  await saveCmmSyncMeta(meta);

  return {
    success: true,
    messagesScanned: fetchResult.messageIdsReturned,
    leadsParsed: parseSuccesses,
    duplicatesSkipped,
    unknownPostcodes,
    totalLeads: unique.length,
    lastMessageDate,
    labelFound: true,
    error: null,
    debug,
  };
}

export async function rebuildCmmLeadLedger(): Promise<CmmIngestResult> {
  return ingestEmails("rebuild");
}

export async function syncNewCmmLeads(): Promise<CmmIngestResult> {
  const existing = await getCmmLeadLedger();
  if (!existing || existing.leads.length === 0) {
    return rebuildCmmLeadLedger();
  }
  return ingestEmails("sync");
}

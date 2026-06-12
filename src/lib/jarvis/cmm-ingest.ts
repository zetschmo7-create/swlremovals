import { parseCmmLeadEmail, dedupeCmmLeads } from "./cmm-parser";
import { fetchAllCmmLabelEmails } from "./cmm-gmail";
import {
  clearCmmLeadLedger,
  getCmmLeadLedger,
  mergeCmmLeads,
  saveCmmLeadLedger,
  saveCmmSyncMeta,
  setCmmLastBackfillAt,
  setCmmLastMessageId,
} from "./cmm-lead-store";
import { getJarvisSettings } from "./settings-store";
import type { CmmLeadLedger, CmmSyncMeta } from "./types";

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
};

async function ingestEmails(
  mode: "rebuild" | "sync"
): Promise<CmmIngestResult> {
  const settings = await getJarvisSettings();
  const leadCost = settings.costPerLead;

  let existingLedger: CmmLeadLedger | null = null;
  let afterDate: string | null = null;

  if (mode === "sync") {
    existingLedger = await getCmmLeadLedger();
    const newest = existingLedger?.leads[0]?.received_at;
    if (newest) {
      const d = new Date(newest);
      d.setUTCDate(d.getUTCDate() - 1);
      afterDate = d.toISOString();
    }
  } else {
    await clearCmmLeadLedger();
  }

  const { emails, labelFound } = await fetchAllCmmLabelEmails({
    afterDate: mode === "sync" ? afterDate : null,
  });

  if (!labelFound) {
    const meta: CmmSyncMeta = {
      messagesScanned: 0,
      leadsParsed: 0,
      duplicatesSkipped: 0,
      unknownPostcodes: 0,
      lastMessageDate: null,
      labelFound: false,
      lastSyncAt: new Date().toISOString(),
      error: "CMM label not found or Gmail access issue.",
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
    };
  }

  const parsed = emails
    .map((e) => parseCmmLeadEmail(e, leadCost))
    .filter((l): l is NonNullable<typeof l> => l !== null);

  const combined =
    mode === "sync" && existingLedger
      ? mergeCmmLeads(existingLedger.leads, parsed)
      : parsed;

  const { unique, duplicatesSkipped } = dedupeCmmLeads(combined);
  const unknownPostcodes = unique.filter(
    (l) => l.collection_postcode_area === "Unknown"
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

  const lastMessageDate = newest?.received_at ?? null;
  const meta: CmmSyncMeta = {
    messagesScanned: emails.length,
    leadsParsed: parsed.length,
    duplicatesSkipped,
    unknownPostcodes,
    lastMessageDate,
    labelFound: true,
    lastSyncAt: now,
    error: null,
  };
  await saveCmmSyncMeta(meta);

  return {
    success: true,
    messagesScanned: emails.length,
    leadsParsed: parsed.length,
    duplicatesSkipped,
    unknownPostcodes,
    totalLeads: unique.length,
    lastMessageDate,
    labelFound: true,
    error: null,
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

import { fetchJarvisEmails } from "./gmail";
import { detectEmailEvents } from "./email-events";
import { buildJobLedger } from "./job-ledger";
import { collectPdfAudit } from "./ledger-analytics";
import { getJarvisSettings } from "./settings-store";
import type { JobRecord } from "./types";

/** Build job ledger from a longer Gmail window for CMM lead-to-deposit matching. */
export async function getJobsForCmmMatching(): Promise<JobRecord[]> {
  try {
    const emails = await fetchJarvisEmails({ days: 365, parsePdfs: false });
    const pdfAudit = collectPdfAudit(emails);
    const settings = await getJarvisSettings();
    const { events, duplicateCount } = detectEmailEvents(emails);
    return buildJobLedger(events, duplicateCount, settings, pdfAudit).jobs;
  } catch {
    return [];
  }
}

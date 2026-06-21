import { fetchJarvisEmails } from "./gmail";
import { detectEmailEvents } from "./email-events";
import { buildJobLedger } from "./job-ledger";
import { collectPdfAudit } from "./ledger-analytics";
import { getJarvisSettings } from "./settings-store";
import { getImveImportLedgerOrEmpty } from "./imve-store";
import { mergeJobRecordsForMatching } from "./imve-to-job";
import type { JobRecord } from "./types";

/** Build job ledger from Gmail plus any imported i-MVE jobs. */
export async function getJobsForCmmMatching(): Promise<JobRecord[]> {
  try {
    const emails = await fetchJarvisEmails({ days: 365, parsePdfs: false });
    const pdfAudit = collectPdfAudit(emails);
    const settings = await getJarvisSettings();
    const { events, duplicateCount } = detectEmailEvents(emails);
    const gmailJobs = buildJobLedger(
      events,
      duplicateCount,
      settings,
      pdfAudit
    ).jobs;
    const imveLedger = await getImveImportLedgerOrEmpty();
    return mergeJobRecordsForMatching(gmailJobs, imveLedger.jobs);
  } catch {
    const imveLedger = await getImveImportLedgerOrEmpty();
    if (imveLedger.jobs.length === 0) return [];
    return mergeJobRecordsForMatching([], imveLedger.jobs);
  }
}

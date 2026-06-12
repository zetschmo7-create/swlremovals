import type { JarvisEmail } from "./types";

export type OperationalPdfCategory =
  | "quotation"
  | "deposit_invoice"
  | "deposit_receipt"
  | "move_invoice"
  | "removal_quote";

/** Hard-ignore if subject or filename matches any of these. */
const HARD_IGNORE_PATTERNS = [
  /\bstatement\b/i,
  /account\s*statement/i,
  /\binsurer\b/i,
  /\bvoidance\b/i,
  /\binsurance\b/i,
  /\bpolicy\b/i,
  /\bcertificate\b/i,
  /blue\s*sky/i,
  /google\s*workspace/i,
  /\bsettlement\b/i,
  /compare\s*my\s*move.*invoice|invoice.*compare\s*my\s*move/i,
  /\bcontabo\b/i,
  /\bbird\b/i,
  /\bgoogle\b/i,
  /workspace/i,
];

type OperationalMatch = {
  category: OperationalPdfCategory;
  pattern: string;
};

const OPERATIONAL_RULES: Array<{
  category: OperationalPdfCategory;
  subject: RegExp;
  filename: RegExp;
}> = [
  {
    category: "deposit_receipt",
    subject: /ryan removals\s*[-–]\s*deposit receipt|^deposit receipt$/i,
    filename: /deposit receipt/i,
  },
  {
    category: "deposit_invoice",
    subject: /deposit invoice for your move/i,
    filename: /deposit invoice/i,
  },
  {
    category: "quotation",
    subject: /\bquotation\b/i,
    filename: /\bquotation\b/i,
  },
  {
    category: "quotation",
    subject: /your moving quote/i,
    filename: /moving quote/i,
  },
  {
    category: "removal_quote",
    subject: /removal quote/i,
    filename: /removal quote/i,
  },
  {
    category: "move_invoice",
    subject: /move invoice/i,
    filename: /move invoice/i,
  },
];

const RR_PATTERN = /\bRR-\d{3,6}\b/i;

export type PdfProcessingDecision = {
  shouldParse: boolean;
  category: OperationalPdfCategory | null;
  reason: string;
};

export function shouldHardIgnorePdf(
  subject: string,
  filename: string
): string | null {
  const combined = `${subject} ${filename}`;
  for (const pattern of HARD_IGNORE_PATTERNS) {
    if (pattern.test(subject) || pattern.test(filename) || pattern.test(combined)) {
      return `Ignored: matches non-operational pattern (${pattern.source})`;
    }
  }
  return null;
}

export function matchOperationalPdf(
  subject: string,
  filename: string
): OperationalMatch | null {
  for (const rule of OPERATIONAL_RULES) {
    if (rule.subject.test(subject) || rule.filename.test(filename)) {
      return { category: rule.category, pattern: rule.category };
    }
  }

  if (RR_PATTERN.test(subject) || /RR-/i.test(filename)) {
    const text = `${subject} ${filename}`.toLowerCase();
    if (/deposit receipt/i.test(text)) return { category: "deposit_receipt", pattern: "RR-deposit_receipt" };
    if (/deposit invoice/i.test(text)) return { category: "deposit_invoice", pattern: "RR-deposit_invoice" };
    if (/move invoice/i.test(text)) return { category: "move_invoice", pattern: "RR-move_invoice" };
    if (/removal quote/i.test(text)) return { category: "removal_quote", pattern: "RR-removal_quote" };
    if (/quotation|moving quote/i.test(text)) {
      return { category: "quotation", pattern: "RR-quotation" };
    }
    return { category: "quotation", pattern: "RR-reference" };
  }

  return null;
}

export function detectOperationalPdfCategory(
  subject: string,
  filename: string
): OperationalPdfCategory | null {
  return matchOperationalPdf(subject, filename)?.category ?? null;
}

export function evaluatePdfAttachment(
  email: Pick<JarvisEmail, "subject" | "from" | "account">,
  filename: string
): PdfProcessingDecision {
  if (filename === "(no PDF attachment)") {
    return {
      shouldParse: false,
      category: null,
      reason: "Ignored: no PDF attachment",
    };
  }

  const hardIgnore = shouldHardIgnorePdf(email.subject, filename);
  if (hardIgnore) {
    return { shouldParse: false, category: null, reason: hardIgnore };
  }

  const operational = matchOperationalPdf(email.subject, filename);
  if (!operational) {
    return {
      shouldParse: false,
      category: null,
      reason:
        "Ignored: not a Ryan/I-MVE operational PDF (Deposit Receipt, Deposit Invoice, Quotation, Moving Quote, Move Invoice, Removal Quote, or RR-ref)",
    };
  }

  return {
    shouldParse: true,
    category: operational.category,
    reason: `Operational ${operational.category.replace(/_/g, " ")}`,
  };
}

export function isPdfRelevantEmail(email: JarvisEmail): boolean {
  if (shouldHardIgnorePdf(email.subject, "")) return false;
  return matchOperationalPdf(email.subject, "") !== null;
}

export function ignoredPdfResult(
  filename: string,
  reason: string,
  category: OperationalPdfCategory | null = null
) {
  return {
    filename,
    status: "ignored_not_relevant" as const,
    category,
    reason,
    text: null,
    textLength: 0,
    fields: emptyPdfFields(),
    log: reason,
  };
}

function emptyPdfFields() {
  return {
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
  };
}

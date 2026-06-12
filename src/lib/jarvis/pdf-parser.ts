import type { OperationalPdfCategory } from "./pdf-whitelist";

export type PdfExtractedFields = {
  jobReference: string | null;
  customerName: string | null;
  customerEmail: string | null;
  quoteValue: number | null;
  depositValue: number | null;
  balanceValue: number | null;
  totalValue: number | null;
  movingFromAddress: string | null;
  movingFromPostcode: string | null;
  movingToAddress: string | null;
  movingToPostcode: string | null;
  moveDate: string | null;
};

export type PdfParseStatus =
  | "parsed"
  | "needs_review"
  | "ignored_not_relevant"
  | "failed_relevant_pdf"
  | "missing";

export type PdfParseResult = {
  filename: string;
  status: PdfParseStatus;
  category: OperationalPdfCategory | null;
  reason: string;
  text: string | null;
  textLength: number;
  fields: PdfExtractedFields;
  log: string;
};

const JOB_REF_PATTERNS = [
  /\bRR-\d{3,6}\b/i,
  /\bRR\s+\d{3,6}\b/i,
  /(?:quote ref|job ref)[:\s]+(RR[-\s]?\d{3,6})/i,
];

const UK_POSTCODE_REGEX =
  /\b([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})\b/gi;

const MIN_TEXT_LENGTH = 50;

function emptyFields(): PdfExtractedFields {
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

function parseAmount(raw: string | undefined): number | null {
  if (!raw) return null;
  const value = parseFloat(raw.replace(/,/g, ""));
  return Number.isNaN(value) || value <= 0 ? null : value;
}

export function normalizePostcode(raw: string): string {
  const compact = raw.replace(/\s/g, "").toUpperCase();
  if (compact.length < 5) return compact;
  return `${compact.slice(0, -3)} ${compact.slice(-3)}`;
}

function extractJobReference(text: string): string | null {
  for (const pattern of JOB_REF_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const ref = (match[1] ?? match[0]).replace(/\s+/g, "-").toUpperCase();
      return ref.startsWith("RR") ? ref : `RR-${ref}`;
    }
  }
  return null;
}

function extractPostcodeNear(
  text: string,
  labels: RegExp[]
): string | null {
  for (const label of labels) {
    const section = text.match(
      new RegExp(`${label.source}[:\\s]*([^\\n]{5,120})`, "i")
    );
    if (section?.[1]) {
      const pc = section[1].match(UK_POSTCODE_REGEX);
      if (pc) return normalizePostcode(pc[0]);
    }
  }
  const all = [...text.matchAll(UK_POSTCODE_REGEX)].map((m) =>
    normalizePostcode(m[0])
  );
  return all[0] ?? null;
}

function extractMoveDate(text: string): string | null {
  const patterns = [
    /(?:move date|moving date|removal date|date of move)[:\s]*(\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4})/i,
    /(?:move date|moving date|removal date|date of move)[:\s]*(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})/i,
  ];
  for (const p of patterns) {
    const match = text.match(p);
    if (match?.[1]) return match[1].trim();
  }
  return null;
}

function extractCustomerName(
  text: string,
  filename: string,
  subjectFallback?: string
): string | null {
  const dear = text.match(/dear\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i);
  if (dear?.[1]) return dear[1].trim();

  const labeled = text.match(
    /(?:customer|client|name)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i
  );
  if (labeled?.[1]) return labeled[1].trim();

  const depositSubject = subjectFallback?.match(
    /Deposit Invoice for Your Move\s*\|\s*RR-\d+\s*\|\s*(.+)$/i
  );
  if (depositSubject?.[1]) return depositSubject[1].trim();

  if (/invoice|receipt|quote/i.test(filename)) {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    for (const line of lines.slice(0, 20)) {
      if (
        /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+$/.test(line) &&
        !/ryan|removals|invoice|receipt|quote/i.test(line)
      ) {
        return line;
      }
    }
  }

  return null;
}

function extractAmountNear(text: string, label: RegExp): number | null {
  const match = text.match(
    new RegExp(`${label.source}[^\\n]{0,40}£\\s*([\\d,]+(?:\\.\\d{2})?)`, "i")
  );
  return parseAmount(match?.[1]);
}

export function extractFieldsFromPdfText(
  text: string,
  filename: string,
  subjectFallback?: string
): PdfExtractedFields {
  const jobReference = extractJobReference(text);
  const customerEmail =
    text
      .match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i)?.[0]
      ?.toLowerCase() ?? null;

  const quoteValue =
    extractAmountNear(text, /total move cost|move total|quote total|removal quote|total/) ??
    extractAmountNear(text, /balance|amount due/) ??
    null;

  const depositValue =
    extractAmountNear(
      text,
      /deposit paid|deposit received|deposit invoice|deposit/
    ) ?? null;

  const balanceValue = extractAmountNear(text, /balance/);

  const totalValue = quoteValue ?? balanceValue;

  const movingFromPostcode = extractPostcodeNear(text, [
    /moving from/,
    /from address/,
    /collection address/,
    /collection/,
    /pick-?up/,
  ]);

  const movingToPostcode = extractPostcodeNear(text, [
    /moving to/,
    /to address/,
    /delivery address/,
    /delivery/,
    /destination/,
  ]);

  const fromMatch = text.match(
    /(?:moving from|from address|collection address)[:\s]*([^\n]{10,120})/i
  );
  const toMatch = text.match(
    /(?:moving to|to address|delivery address)[:\s]*([^\n]{10,120})/i
  );

  return {
    jobReference,
    customerName: extractCustomerName(text, filename, subjectFallback),
    customerEmail:
      customerEmail && !/ryan|removals|noreply/i.test(customerEmail)
        ? customerEmail
        : null,
    quoteValue,
    depositValue,
    balanceValue,
    totalValue,
    movingFromAddress: fromMatch?.[1]?.trim() ?? null,
    movingFromPostcode,
    movingToAddress: toMatch?.[1]?.trim() ?? null,
    movingToPostcode,
    moveDate: extractMoveDate(text),
  };
}

async function extractPdfText(buffer: Buffer): Promise<string | null> {
  try {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    const text = (result.text ?? "").trim();
    return text || null;
  } catch {
    return null;
  }
}

export async function parsePdfBuffer(
  buffer: Buffer,
  filename: string,
  options?: {
    category?: OperationalPdfCategory | null;
    reason?: string;
    subjectFallback?: string;
  }
): Promise<PdfParseResult> {
  const category = options?.category ?? null;
  const baseReason = options?.reason ?? "Relevant Ryan/I-MVE PDF";

  try {
    const text = await extractPdfText(buffer);

    if (!text) {
      return {
        filename,
        status: "needs_review",
        category,
        reason: "Needs review — PDF text extraction failed. OCR may be required later.",
        text: null,
        textLength: 0,
        fields: emptyFields(),
        log: `No extractable text: ${filename}`,
      };
    }

    const textLength = text.length;
    const fields = extractFieldsFromPdfText(text, filename, options?.subjectFallback);

    if (textLength < MIN_TEXT_LENGTH) {
      return {
        filename,
        status: "needs_review",
        category,
        reason: "PDF may be image-based or protected",
        text,
        textLength,
        fields,
        log: `Short text (${textLength} chars) — may need OCR: ${filename}`,
      };
    }

    return {
      filename,
      status: "parsed",
      category,
      reason: baseReason,
      text,
      textLength,
      fields,
      log: `PDF parsed successfully (${textLength} chars): ${filename}`,
    };
  } catch {
    return {
      filename,
      status: "needs_review",
      category,
      reason: "Needs review — PDF text extraction failed. OCR may be required later.",
      text: null,
      textLength: 0,
      fields: emptyFields(),
      log: `PDF parse failed: ${filename}`,
    };
  }
}

export type PdfParseHarnessResult = PdfParseResult & {
  textPreview: string | null;
  detectedCategory: OperationalPdfCategory | null;
};

/** Internal test harness — parse one buffer and return full diagnostic output. */
export async function runPdfParseHarness(
  buffer: Buffer,
  filename: string,
  context?: {
    category?: OperationalPdfCategory | null;
    reason?: string;
    subject?: string;
  }
): Promise<PdfParseHarnessResult> {
  const result = await parsePdfBuffer(buffer, filename, {
    category: context?.category,
    reason: context?.reason,
    subjectFallback: context?.subject,
  });

  return {
    ...result,
    textPreview: result.text ? result.text.slice(0, 500) : null,
    detectedCategory: result.category,
  };
}

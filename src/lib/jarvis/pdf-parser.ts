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

export type PdfParseResult = {
  filename: string;
  status: "success" | "no_text" | "failed" | "missing";
  text: string | null;
  fields: PdfExtractedFields;
  log: string;
};

const JOB_REF_REGEX = /\bRR-\d{3,6}\b/gi;
const EMAIL_REGEX = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
const AMOUNT_REGEX =
  /(?:total|quote|deposit|balance|amount|price)[:\s]*£\s*([\d,]+(?:\.\d{2})?)|£\s*([\d,]+(?:\.\d{2})?)/gi;
const UK_POSTCODE_REGEX =
  /\b([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})\b/gi;
const MOVE_DATE_REGEX =
  /(?:move date|moving date|removal date|date of move)[:\s]*(\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})/gi;

function parseAmount(raw: string | undefined): number | null {
  if (!raw) return null;
  const value = parseFloat(raw.replace(/,/g, ""));
  return Number.isNaN(value) || value <= 0 ? null : value;
}

function extractAmounts(text: string): number[] {
  const amounts: number[] = [];
  for (const match of text.matchAll(AMOUNT_REGEX)) {
    const raw = match[1] ?? match[2];
    const value = parseAmount(raw);
    if (value != null) amounts.push(value);
  }
  return amounts;
}

function extractPostcode(text: string): string | null {
  const match = text.match(UK_POSTCODE_REGEX);
  if (!match) return null;
  return match[0].replace(/\s+/g, " ").trim().toUpperCase();
}

function extractMoveDate(text: string): string | null {
  const match = text.match(MOVE_DATE_REGEX);
  return match?.[1]?.trim() ?? null;
}

export function extractFieldsFromPdfText(
  text: string,
  filename: string
): PdfExtractedFields {
  const upper = text.toUpperCase();
  const jobRef = text.match(JOB_REF_REGEX)?.[0]?.toUpperCase() ?? null;
  const email = text.match(EMAIL_REGEX)?.[0]?.toLowerCase() ?? null;

  const amounts = extractAmounts(text);
  const totalValue = amounts.length > 0 ? Math.max(...amounts) : null;

  let depositValue: number | null = null;
  let balanceValue: number | null = null;
  let quoteValue: number | null = null;

  const depositMatch = text.match(
    /deposit[:\s]*£\s*([\d,]+(?:\.\d{2})?)/i
  );
  if (depositMatch) depositValue = parseAmount(depositMatch[1]);

  const balanceMatch = text.match(
    /balance[:\s]*£\s*([\d,]+(?:\.\d{2})?)/i
  );
  if (balanceMatch) balanceValue = parseAmount(balanceMatch[1]);

  const quoteMatch = text.match(
    /(?:quote|total|removal)[:\s]*£\s*([\d,]+(?:\.\d{2})?)/i
  );
  if (quoteMatch) quoteValue = parseAmount(quoteMatch[1]);

  if (!quoteValue && /quotation|quote/i.test(filename)) {
    quoteValue = totalValue;
  }
  if (!depositValue && /deposit|receipt/i.test(filename)) {
    depositValue = amounts.length === 1 ? amounts[0] : depositValue;
  }

  const fromMatch = text.match(
    /(?:moving from|from address|collection address)[:\s]*([^\n]{10,120})/i
  );
  const toMatch = text.match(
    /(?:moving to|to address|delivery address)[:\s]*([^\n]{10,120})/i
  );

  const postcodes = [...text.matchAll(UK_POSTCODE_REGEX)].map((m) =>
    m[0].replace(/\s+/g, " ").trim().toUpperCase()
  );

  let customerName: string | null = null;
  const nameMatch = text.match(
    /(?:customer|client|name)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i
  );
  if (nameMatch) customerName = nameMatch[1].trim();

  if (!customerName && /invoice|receipt|quote/i.test(upper)) {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    for (const line of lines.slice(0, 15)) {
      if (/^[A-Z][a-z]+ [A-Z][a-z]+$/.test(line) && !/ryan|removals/i.test(line)) {
        customerName = line;
        break;
      }
    }
  }

  return {
    jobReference: jobRef,
    customerName,
    customerEmail: email,
    quoteValue,
    depositValue,
    balanceValue,
    totalValue: quoteValue ?? totalValue,
    movingFromAddress: fromMatch?.[1]?.trim() ?? null,
    movingFromPostcode: postcodes[0] ?? null,
    movingToAddress: toMatch?.[1]?.trim() ?? null,
    movingToPostcode: postcodes[1] ?? postcodes[0] ?? null,
    moveDate: extractMoveDate(text),
  };
}

export async function parsePdfBuffer(
  buffer: Buffer,
  filename: string
): Promise<PdfParseResult> {
  const emptyFields: PdfExtractedFields = {
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

  try {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    const text = (result.text ?? "").trim();

    if (!text) {
      return {
        filename,
        status: "no_text",
        text: null,
        fields: emptyFields,
        log: `PDF had no extractable text: ${filename}`,
      };
    }

    const fields = extractFieldsFromPdfText(text, filename);
    return {
      filename,
      status: "success",
      text,
      fields,
      log: `PDF parsed successfully: ${filename}`,
    };
  } catch {
    return {
      filename,
      status: "failed",
      text: null,
      fields: emptyFields,
      log: `PDF parse failed: ${filename}`,
    };
  }
}

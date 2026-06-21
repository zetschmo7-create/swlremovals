export function maskEmail(email: string | null): string | null {
  if (!email) return null;
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***";
  const visible = local.slice(0, 1);
  return `${visible}***@${domain}`;
}

export function maskPhone(phone: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.length < 4) return "***";
  return `***${digits.slice(-4)}`;
}

export function maskName(name: string | null): string | null {
  if (!name) return null;
  const parts = name.trim().split(/\s+/);
  return parts
    .map((part) => {
      if (part.length <= 1) return "*";
      return `${part[0]}${"*".repeat(Math.min(3, part.length - 1))}`;
    })
    .join(" ");
}

const PII_KEYS =
  /email|phone|mobile|telephone|name|customer|contact|address/i;

export function maskRowForPreview(
  row: Record<string, string>
): Record<string, string> {
  const masked: Record<string, string> = {};
  for (const [key, value] of Object.entries(row)) {
    if (!value) {
      masked[key] = value;
      continue;
    }
    const lower = key.toLowerCase();
    if (/email/.test(lower)) masked[key] = maskEmail(value) ?? "***";
    else if (/phone|mobile|telephone/.test(lower)) masked[key] = maskPhone(value) ?? "***";
    else if (/name|customer|contact/.test(lower) && !/postcode|reference|id/i.test(lower)) {
      masked[key] = maskName(value) ?? "***";
    } else if (/address/.test(lower)) masked[key] = "*** address hidden ***";
    else masked[key] = value;
  }
  return masked;
}

export function maskRowsForPreview(
  rows: Record<string, string>[],
  limit = 3
): Record<string, string>[] {
  return rows.slice(0, limit).map(maskRowForPreview);
}

export function rowLikelyContainsPii(row: Record<string, string>): boolean {
  return Object.keys(row).some((k) => PII_KEYS.test(k));
}

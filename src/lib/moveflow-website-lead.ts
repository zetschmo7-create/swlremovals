import { createHmac, randomUUID } from "crypto";
import type { EnquiryPayload } from "./enquiry";
import {
  MOVEFLOW_CONSENT_DISCLOSURE_TEXT,
  MOVEFLOW_CONSENT_DISCLOSURE_VERSION,
} from "./enquiry";

export const MOVEFLOW_WEBSITE_LEAD_KEY_ID_DEFAULT = "swl-web-1";
export const MOVEFLOW_WEBSITE_LEAD_URL_DEFAULT =
  "https://moveflow.cloud/api/public/webhooks/website-lead/v1";

export type EnquiryAttribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  landing_page?: string;
  referrer?: string;
  first_visit_at?: string;
};

export type MoveFlowForwardInput = {
  data: EnquiryPayload;
  /** Phone exactly as typed (trimmed only). */
  phoneAsTyped: string;
  collectionPostcodeAsTyped: string;
  deliveryPostcodeAsTyped: string;
  consentAccepted: boolean;
  consentAcceptedAt?: string;
  attribution?: EnquiryAttribution;
  userAgent?: string;
  ip?: string;
  /** Stable for this submission; reused across MoveFlow retries. */
  submissionId?: string;
  submittedAt?: string;
};

export type MoveFlowSendResult = {
  ok: boolean;
  status?: number;
  code?: string;
  submissionId: string;
  retried: number;
};

type MoveFlowConfig = {
  secret: string;
  keyId: string;
  url: string;
};

function readConfig(): MoveFlowConfig | null {
  const secret = process.env.MOVEFLOW_WEBSITE_LEAD_SECRET?.trim();
  if (!secret) return null;
  return {
    secret,
    keyId:
      process.env.MOVEFLOW_WEBSITE_LEAD_KEY_ID?.trim() ||
      MOVEFLOW_WEBSITE_LEAD_KEY_ID_DEFAULT,
    url:
      process.env.MOVEFLOW_WEBSITE_LEAD_URL?.trim() ||
      MOVEFLOW_WEBSITE_LEAD_URL_DEFAULT,
  };
}

export function isMoveFlowWebsiteLeadConfigured(): boolean {
  return readConfig() !== null;
}

/** HMAC-SHA256 signature for MoveFlow website-lead v1. */
export function signMoveFlowWebsiteLead(
  secret: string,
  timestamp: string,
  rawBody: string
): string {
  const mac = createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`, "utf8")
    .digest("hex");
  return `v1=${mac}`;
}

export function splitCustomerName(fullName: string): {
  first_name: string;
  last_name?: string;
} {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const first = (parts[0] ?? "").slice(0, 80);
  const last = parts.slice(1).join(" ").slice(0, 80);
  return last ? { first_name: first, last_name: last } : { first_name: first };
}

export function mapBedroomsToMoveFlow(
  bedrooms: string
): number | undefined {
  if (!bedrooms) return undefined;
  if (bedrooms === "Studio") return 0;
  if (bedrooms === "5+") return 5;
  const n = Number(bedrooms);
  if (!Number.isInteger(n) || n < 0 || n > 10) return undefined;
  return n;
}

export function mapPropertyTypeToMoveFlow(
  propertyType: string
): string | undefined {
  const key = propertyType.trim().toLowerCase();
  const allowed = new Set([
    "house",
    "flat",
    "bungalow",
    "maisonette",
    "office",
    "storage",
    "other",
  ]);
  return allowed.has(key) ? key : undefined;
}

export function mapDateFlexibility(
  timeframe: string,
  moveDate: string
): "exact" | "approximate" | "flexible" | "unknown" | undefined {
  if (moveDate) return "exact";
  switch (timeframe) {
    case "Not sure yet":
      return "unknown";
    case "Within 2 weeks":
    case "This month":
      return "approximate";
    case "1–2 months":
    case "3+ months":
      return "flexible";
    default:
      return undefined;
  }
}

function omitEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === "") continue;
    out[key] = value;
  }
  return out as Partial<T>;
}

/**
 * Build MoveFlow website-lead payload. Omits unknowns; never invents bedrooms/phone.
 * Returns null when required customer.phone cannot be satisfied from typed input.
 */
export function buildMoveFlowWebsiteLeadPayload(
  input: MoveFlowForwardInput
): Record<string, unknown> | null {
  const phone = input.phoneAsTyped.trim();
  if (phone.length < 7 || phone.length > 40) return null;

  const names = splitCustomerName(input.data.fullName);
  if (!names.first_name) return null;

  const submissionId = input.submissionId || randomUUID();
  const submittedAt =
    input.submittedAt || new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

  const bedrooms = mapBedroomsToMoveFlow(input.data.bedrooms);
  const propertyType = mapPropertyTypeToMoveFlow(input.data.propertyType);
  const dateFlexibility = mapDateFlexibility(
    input.data.timeframe,
    input.data.moveDate
  );

  const from = omitEmpty({
    postcode: input.collectionPostcodeAsTyped.trim() || undefined,
    address_text: input.data.collectionAddress
      ? input.data.collectionAddress.slice(0, 500)
      : undefined,
  });
  const to = omitEmpty({
    postcode: input.deliveryPostcodeAsTyped.trim() || undefined,
    address_text: input.data.deliveryAddress
      ? input.data.deliveryAddress.slice(0, 500)
      : undefined,
  });

  const notes = input.data.notes?.trim().slice(0, 2000) || undefined;

  const move = omitEmpty({
    from: Object.keys(from).length ? from : undefined,
    to: Object.keys(to).length ? to : undefined,
    property_type: propertyType,
    bedrooms,
    move_date: input.data.moveDate || undefined,
    date_flexibility: dateFlexibility,
    notes,
  });

  const attribution = input.attribution
    ? omitEmpty({ ...input.attribution })
    : undefined;

  const consentAccepted = input.consentAccepted === true;

  return {
    schema_version: "1",
    submission_id: submissionId,
    submitted_at: submittedAt,
    form: omitEmpty({
      id: "quote",
      page_url: input.data.pageUrl || undefined,
    }),
    customer: omitEmpty({
      first_name: names.first_name,
      last_name: names.last_name,
      email: input.data.email,
      phone,
    }),
    move: Object.keys(move).length ? move : undefined,
    consent: {
      method: "checkbox",
      disclosure_version: MOVEFLOW_CONSENT_DISCLOSURE_VERSION,
      disclosure_text: MOVEFLOW_CONSENT_DISCLOSURE_TEXT,
      disclosure_shown: consentAccepted,
      ...(consentAccepted
        ? {
            accepted_at:
              input.consentAcceptedAt ||
              new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
          }
        : {}),
      privacy_policy_url: "https://www.swlremovals.co.uk/privacy",
    },
    ...(attribution && Object.keys(attribution).length
      ? { attribution }
      : {}),
    client: omitEmpty({
      user_agent: input.userAgent,
      ip: input.ip,
    }),
  };
}

export function shouldRetryMoveFlowStatus(status: number): boolean {
  return status >= 500;
}

export function logMoveFlowWebsiteLeadDiagnostic(payload: {
  submissionId: string;
  stage: string;
  status?: number;
  code?: string;
  retried?: number;
}): void {
  console.info(
    JSON.stringify({
      type: "moveflow_website_lead",
      submissionId: payload.submissionId,
      stage: payload.stage,
      status: payload.status,
      code: payload.code,
      retried: payload.retried,
    })
  );
}

const BACKOFF_MS = [2000, 10000, 30000] as const;

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function postSigned(
  config: MoveFlowConfig,
  rawBody: string
): Promise<{ status: number; code?: string; issues?: unknown }> {
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = signMoveFlowWebsiteLead(
    config.secret,
    timestamp,
    rawBody
  );

  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-MoveFlow-Key-Id": config.keyId,
      "X-MoveFlow-Timestamp": timestamp,
      "X-MoveFlow-Signature": signature,
    },
    body: rawBody,
  });

  let code: string | undefined;
  let issues: unknown;
  try {
    const json = (await response.json()) as {
      code?: string;
      status?: string;
      issues?: unknown;
    };
    code = json.code || json.status;
    issues = json.issues;
  } catch {
    code = undefined;
  }

  return { status: response.status, code, issues };
}

/**
 * Forward a website lead to MoveFlow with retries on 5xx/network only.
 * Same raw body + submission_id; fresh timestamp/signature each attempt.
 */
export async function sendMoveFlowWebsiteLead(
  input: MoveFlowForwardInput
): Promise<MoveFlowSendResult> {
  const submissionId = input.submissionId || randomUUID();
  const config = readConfig();

  if (!config) {
    logMoveFlowWebsiteLeadDiagnostic({
      submissionId,
      stage: "skipped_not_configured",
      code: "not_configured",
    });
    return {
      ok: false,
      code: "not_configured",
      submissionId,
      retried: 0,
    };
  }

  const payload = buildMoveFlowWebsiteLeadPayload({
    ...input,
    submissionId,
  });

  if (!payload) {
    logMoveFlowWebsiteLeadDiagnostic({
      submissionId,
      stage: "skipped_incomplete_customer",
      code: "incomplete_customer",
    });
    return {
      ok: false,
      code: "incomplete_customer",
      submissionId,
      retried: 0,
    };
  }

  const rawBody = JSON.stringify(payload);
  let attempt = 0;
  let lastStatus: number | undefined;
  let lastCode: string | undefined;

  while (attempt <= BACKOFF_MS.length) {
    try {
      const result = await postSigned(config, rawBody);
      lastStatus = result.status;
      lastCode = result.code;

      if (
        result.status === 202 ||
        result.status === 201 ||
        result.status === 200
      ) {
        logMoveFlowWebsiteLeadDiagnostic({
          submissionId,
          stage: "accepted",
          status: result.status,
          code: result.code,
          retried: attempt,
        });
        return {
          ok: true,
          status: result.status,
          code: result.code,
          submissionId,
          retried: attempt,
        };
      }

      if (
        result.status === 400 ||
        result.status === 401 ||
        result.status === 403 ||
        result.status === 409 ||
        result.status === 413 ||
        result.status === 415 ||
        result.status === 422
      ) {
        logMoveFlowWebsiteLeadDiagnostic({
          submissionId,
          stage: "rejected",
          status: result.status,
          code: result.code,
          retried: attempt,
        });
        return {
          ok: false,
          status: result.status,
          code: result.code,
          submissionId,
          retried: attempt,
        };
      }

      if (!shouldRetryMoveFlowStatus(result.status)) {
        logMoveFlowWebsiteLeadDiagnostic({
          submissionId,
          stage: "failed_no_retry",
          status: result.status,
          code: result.code,
          retried: attempt,
        });
        return {
          ok: false,
          status: result.status,
          code: result.code,
          submissionId,
          retried: attempt,
        };
      }
    } catch {
      lastCode = "network_error";
      lastStatus = undefined;
    }

    if (attempt >= BACKOFF_MS.length) break;
    await sleep(BACKOFF_MS[attempt]);
    attempt += 1;
  }

  logMoveFlowWebsiteLeadDiagnostic({
    submissionId,
    stage: "failed_after_retries",
    status: lastStatus,
    code: lastCode,
    retried: attempt,
  });

  return {
    ok: false,
    status: lastStatus,
    code: lastCode,
    submissionId,
    retried: attempt,
  };
}

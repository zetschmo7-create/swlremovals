import { createHash, randomBytes } from "crypto";
import { Resend } from "resend";
import {
  ENQUIRY_RECIPIENTS,
  buildCustomerAcknowledgementContent,
  buildEnquiryEmailContent,
  type EnquiryPayload,
} from "./enquiry";

export type RecipientDelivery = {
  recipient: string;
  accepted: boolean;
  messageId?: string;
  errorCode?: string;
  errorMessage?: string;
};

export type EnquiryEmailResult =
  | {
      ok: true;
      submissionRef: string;
      business: RecipientDelivery[];
      customerAck: {
        attempted: boolean;
        accepted: boolean;
        messageId?: string;
        errorCode?: string;
        errorMessage?: string;
      };
      providerId: string;
    }
  | {
      ok: false;
      submissionRef: string;
      error: string;
      configMissing?: boolean;
      business?: RecipientDelivery[];
      customerAck?: {
        attempted: boolean;
        accepted: boolean;
        errorCode?: string;
        errorMessage?: string;
      };
      errorCode?: string;
    };

type ResendConfig = {
  apiKey: string;
  from: string;
};

function readResendConfig(): ResendConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.ENQUIRY_FROM_EMAIL?.trim();
  if (!apiKey || !from) return null;
  return { apiKey, from };
}

export function isEnquiryEmailConfigured(): boolean {
  return readResendConfig() !== null;
}

export function createSubmissionRef(): string {
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const nonce = randomBytes(3).toString("hex");
  return `SWL-${stamp}-${nonce}`;
}

/** Stable Resend Idempotency-Key (max practical length; hashed for safety). */
export function buildIdempotencyKey(
  submissionRef: string,
  purpose: "business" | "ack",
  recipient: string
): string {
  const digest = createHash("sha256")
    .update(`${submissionRef}|${purpose}|${recipient.toLowerCase()}`)
    .digest("hex")
    .slice(0, 32);
  return `swl-${purpose}-${digest}`;
}

function resendErrorMeta(error: unknown): {
  errorCode: string;
  errorMessage: string;
} {
  if (!error || typeof error !== "object") {
    return { errorCode: "RESEND_UNKNOWN", errorMessage: "Unknown Resend error" };
  }
  const err = error as {
    name?: string;
    message?: string;
    statusCode?: number;
  };
  const errorCode =
    (typeof err.name === "string" && err.name) ||
    (typeof err.statusCode === "number" ? `RESEND_${err.statusCode}` : "") ||
    "RESEND_ERROR";
  const errorMessage =
    (typeof err.message === "string" && err.message.slice(0, 160)) ||
    "Resend send failed";
  return { errorCode, errorMessage };
}

/** Safe server log — no credentials, no full customer payload. */
export function logEnquiryDeliveryDiagnostic(payload: {
  submissionRef: string;
  stage: string;
  business?: RecipientDelivery[];
  customerAckAccepted?: boolean;
  errorCode?: string;
  pageHost?: string;
  honeypot?: boolean;
}): void {
  console.info(
    JSON.stringify({
      type: "enquiry_delivery",
      provider: "resend",
      submissionRef: payload.submissionRef,
      stage: payload.stage,
      honeypot: payload.honeypot === true,
      business: payload.business?.map((entry) => ({
        recipient: entry.recipient,
        accepted: entry.accepted,
        errorCode: entry.errorCode,
        messageId: entry.messageId,
      })),
      customerAckAccepted: payload.customerAckAccepted,
      errorCode: payload.errorCode,
      pageHost: payload.pageHost,
    })
  );
}

async function sendViaResend(
  resend: Resend,
  config: ResendConfig,
  recipient: string,
  options: {
    subject: string;
    text: string;
    html: string;
    replyTo?: string;
    idempotencyKey: string;
  }
): Promise<RecipientDelivery> {
  try {
    const { data, error } = await resend.emails.send(
      {
        from: config.from,
        to: [recipient],
        replyTo: options.replyTo,
        subject: options.subject,
        text: options.text,
        html: options.html,
      },
      { idempotencyKey: options.idempotencyKey }
    );

    if (error) {
      const meta = resendErrorMeta(error);
      return {
        recipient,
        accepted: false,
        errorCode: meta.errorCode,
        errorMessage: meta.errorMessage,
      };
    }

    const messageId =
      data && typeof data.id === "string" ? data.id : undefined;
    if (!messageId) {
      return {
        recipient,
        accepted: false,
        errorCode: "RESEND_NO_ID",
        errorMessage: "Resend returned no message id.",
      };
    }

    return {
      recipient,
      accepted: true,
      messageId,
    };
  } catch (error) {
    const meta = resendErrorMeta(error);
    return {
      recipient,
      accepted: false,
      errorCode: meta.errorCode,
      errorMessage: meta.errorMessage,
    };
  }
}

/**
 * Sends business notifications per recipient via Resend, then customer ack.
 * Idempotency keys are separate for business vs acknowledgement per recipient.
 * Ack failure does not fail the enquiry or resend business mail.
 */
export async function sendEnquiryEmail(
  data: EnquiryPayload,
  submissionRef = createSubmissionRef()
): Promise<EnquiryEmailResult> {
  const config = readResendConfig();

  if (!config) {
    logEnquiryDeliveryDiagnostic({
      submissionRef,
      stage: "config_missing",
      errorCode: "RESEND_CONFIG_MISSING",
    });
    return {
      ok: false,
      submissionRef,
      configMissing: true,
      errorCode: "RESEND_CONFIG_MISSING",
      error:
        "Email delivery is not configured. Set RESEND_API_KEY and ENQUIRY_FROM_EMAIL.",
    };
  }

  const submittedAtIso = new Date().toISOString();
  const { subject, text, html } = buildEnquiryEmailContent(
    data,
    submittedAtIso,
    submissionRef
  );

  let pageHost: string | undefined;
  try {
    pageHost = data.pageUrl ? new URL(data.pageUrl).host : undefined;
  } catch {
    pageHost = undefined;
  }

  const resend = new Resend(config.apiKey);
  const business: RecipientDelivery[] = [];

  for (const recipient of ENQUIRY_RECIPIENTS) {
    business.push(
      await sendViaResend(resend, config, recipient, {
        subject,
        text,
        html,
        replyTo: data.email,
        idempotencyKey: buildIdempotencyKey(
          submissionRef,
          "business",
          recipient
        ),
      })
    );
  }

  // One retry for recipients that were not accepted — same idempotency key
  // so Resend will not create a duplicate if the first attempt actually landed.
  for (let index = 0; index < business.length; index += 1) {
    if (business[index].accepted) continue;
    business[index] = await sendViaResend(
      resend,
      config,
      business[index].recipient,
      {
        subject,
        text,
        html,
        replyTo: data.email,
        idempotencyKey: buildIdempotencyKey(
          submissionRef,
          "business",
          business[index].recipient
        ),
      }
    );
  }

  const allBusinessAccepted = business.every((entry) => entry.accepted);

  if (!allBusinessAccepted) {
    logEnquiryDeliveryDiagnostic({
      submissionRef,
      stage: "business_partial_or_failed",
      business,
      errorCode: "BUSINESS_RECIPIENTS_INCOMPLETE",
      pageHost,
    });
    return {
      ok: false,
      submissionRef,
      errorCode: "BUSINESS_RECIPIENTS_INCOMPLETE",
      error:
        "We could not notify the removals team. Please try again or contact us by phone.",
      business,
      customerAck: { attempted: false, accepted: false },
    };
  }

  logEnquiryDeliveryDiagnostic({
    submissionRef,
    stage: "business_accepted",
    business,
    pageHost,
  });

  const ack = buildCustomerAcknowledgementContent(data.fullName);
  let customerAck: {
    attempted: boolean;
    accepted: boolean;
    messageId?: string;
    errorCode?: string;
    errorMessage?: string;
  };

  try {
    const customerResult = await sendViaResend(resend, config, data.email, {
      subject: ack.subject,
      text: ack.text,
      html: ack.html,
      idempotencyKey: buildIdempotencyKey(submissionRef, "ack", data.email),
    });
    customerAck = {
      attempted: true,
      accepted: customerResult.accepted,
      messageId: customerResult.messageId,
      errorCode: customerResult.errorCode,
      errorMessage: customerResult.errorMessage,
    };
  } catch (error) {
    const meta = resendErrorMeta(error);
    customerAck = {
      attempted: true,
      accepted: false,
      errorCode: meta.errorCode,
      errorMessage: meta.errorMessage,
    };
  }

  logEnquiryDeliveryDiagnostic({
    submissionRef,
    stage: customerAck.accepted
      ? "customer_ack_accepted"
      : "customer_ack_failed",
    business,
    customerAckAccepted: customerAck.accepted,
    errorCode: customerAck.errorCode,
    pageHost,
  });

  const providerId =
    business
      .map((entry) => entry.messageId)
      .filter(Boolean)
      .join(",") || submissionRef;

  return {
    ok: true,
    submissionRef,
    business,
    customerAck,
    providerId,
  };
}

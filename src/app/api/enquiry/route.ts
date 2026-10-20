import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { validateEnquiryPayload } from "@/lib/enquiry";
import {
  createSubmissionRef,
  logEnquiryDeliveryDiagnostic,
  sendEnquiryEmail,
} from "@/lib/enquiry-email";
import {
  checkEnquiryRateLimit,
  isDuplicateEnquiry,
  markEnquirySubmitted,
} from "@/lib/enquiry-rate-limit";

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return ip;
}

export async function POST(request: Request) {
  const rate = checkEnquiryRateLimit(clientKey(request));
  if (!rate.allowed) {
    logEnquiryDeliveryDiagnostic({
      submissionRef: "n/a",
      stage: "rejected_rate_limited",
      errorCode: "RATE_LIMITED",
    });
    return NextResponse.json(
      {
        error: "Too many enquiry attempts. Please wait a few minutes and try again.",
        errorCode: "RATE_LIMITED",
        ok: false,
        accepted: false,
      },
      {
        status: 429,
        headers: rate.retryAfterSec
          ? { "Retry-After": String(rate.retryAfterSec) }
          : undefined,
      }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    logEnquiryDeliveryDiagnostic({
      submissionRef: "n/a",
      stage: "rejected_invalid_body",
      errorCode: "INVALID_BODY",
    });
    return NextResponse.json(
      {
        error: "Invalid request body.",
        errorCode: "INVALID_BODY",
        ok: false,
        accepted: false,
      },
      { status: 400 }
    );
  }

  const validated = validateEnquiryPayload(body);
  if (!validated.ok) {
    logEnquiryDeliveryDiagnostic({
      submissionRef: "n/a",
      stage: "rejected_validation",
      errorCode: "VALIDATION_FAILED",
    });
    return NextResponse.json(
      {
        error: "Please check the highlighted fields.",
        errors: validated.errors,
        errorCode: "VALIDATION_FAILED",
        ok: false,
        accepted: false,
      },
      { status: 400 }
    );
  }

  // Honeypot: bots get a soft 200 without delivery flags the UI requires.
  // Autofill that fills the honeypot must NOT look like a successful send.
  if (validated.data.companyWebsite) {
    const submissionRef = createSubmissionRef();
    logEnquiryDeliveryDiagnostic({
      submissionRef,
      stage: "rejected_honeypot",
      errorCode: "HONEYPOT",
      honeypot: true,
    });
    return NextResponse.json({
      ok: false,
      accepted: false,
      honeypot: true,
      error:
        "We could not send your enquiry. Please refresh the page and try again, or contact us by phone.",
      errorCode: "HONEYPOT",
      submissionRef,
    });
  }

  const fingerprint = createHash("sha256")
    .update(
      [
        validated.data.email,
        validated.data.collectionPostcode,
        validated.data.deliveryPostcode,
        validated.data.fullName,
      ].join("|")
    )
    .digest("hex");

  if (isDuplicateEnquiry(fingerprint)) {
    logEnquiryDeliveryDiagnostic({
      submissionRef: "n/a",
      stage: "rejected_duplicate",
      errorCode: "DUPLICATE_ENQUIRY",
    });
    return NextResponse.json(
      {
        error:
          "This enquiry was already submitted a moment ago. Please wait before trying again.",
        errorCode: "DUPLICATE_ENQUIRY",
        ok: false,
        accepted: false,
      },
      { status: 409 }
    );
  }

  const submissionRef = createSubmissionRef();
  const result = await sendEnquiryEmail(validated.data, submissionRef);

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        accepted: false,
        error: result.error,
        configMissing: result.configMissing === true,
        errorCode: result.errorCode,
        submissionRef: result.submissionRef,
        recipients: result.business?.map((entry) => ({
          recipient: entry.recipient,
          accepted: entry.accepted,
          errorCode: entry.errorCode,
        })),
      },
      { status: result.configMissing ? 503 : 502 }
    );
  }

  const allAccepted = result.business.every((entry) => entry.accepted);
  if (!allAccepted) {
    logEnquiryDeliveryDiagnostic({
      submissionRef: result.submissionRef,
      stage: "business_acceptance_incomplete",
      business: result.business,
      errorCode: "BUSINESS_RECIPIENTS_INCOMPLETE",
    });
    return NextResponse.json(
      {
        ok: false,
        accepted: false,
        error:
          "We could not notify the removals team. Please try again or contact us by phone.",
        errorCode: "BUSINESS_RECIPIENTS_INCOMPLETE",
        submissionRef: result.submissionRef,
        recipients: result.business.map((entry) => ({
          recipient: entry.recipient,
          accepted: entry.accepted,
          errorCode: entry.errorCode,
        })),
      },
      { status: 502 }
    );
  }

  markEnquirySubmitted(fingerprint);

  return NextResponse.json({
    ok: true,
    // Provider acceptance only — not proof of inbox delivery
    accepted: true,
    submissionRef: result.submissionRef,
    providerId: result.providerId,
    recipients: result.business.map((entry) => ({
      recipient: entry.recipient,
      accepted: entry.accepted,
    })),
    customerAck: {
      attempted: result.customerAck.attempted,
      accepted: result.customerAck.accepted,
      errorCode: result.customerAck.errorCode,
    },
  });
}

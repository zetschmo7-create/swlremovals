import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { validateEnquiryPayload } from "@/lib/enquiry";
import { sendEnquiryEmail } from "@/lib/enquiry-email";
import {
  checkEnquiryRateLimit,
  isDuplicateEnquiry,
} from "@/lib/enquiry-rate-limit";

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return ip;
}

export async function POST(request: Request) {
  const rate = checkEnquiryRateLimit(clientKey(request));
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error: "Too many enquiry attempts. Please wait a few minutes and try again.",
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
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validated = validateEnquiryPayload(body);
  if (!validated.ok) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", errors: validated.errors },
      { status: 400 }
    );
  }

  // Honeypot: pretend success so bots stop, but do not send email
  if (validated.data.companyWebsite) {
    return NextResponse.json({ ok: true });
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
    return NextResponse.json(
      {
        error:
          "This enquiry was already submitted a moment ago. Please wait before trying again.",
      },
      { status: 409 }
    );
  }

  const result = await sendEnquiryEmail(validated.data);
  if (!result.ok) {
    return NextResponse.json(
      {
        error: result.error,
        configMissing: result.configMissing === true,
      },
      { status: result.configMissing ? 503 : 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    // Provider acceptance only — not proof of inbox delivery
    accepted: true,
    providerId: result.providerId,
  });
}

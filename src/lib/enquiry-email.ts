import nodemailer from "nodemailer";
import {
  ENQUIRY_RECIPIENTS,
  buildEnquiryEmailContent,
  type EnquiryPayload,
} from "./enquiry";

export type EnquiryEmailResult =
  | { ok: true; providerId: string }
  | { ok: false; error: string; configMissing?: boolean };

type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
};

function readSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const portRaw = process.env.SMTP_PORT?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = process.env.SMTP_FROM?.trim();

  if (!host || !portRaw || !user || !pass || !from) return null;

  const port = Number(portRaw);
  if (!Number.isInteger(port) || port <= 0) return null;

  return { host, port, user, pass, from };
}

export function isEnquiryEmailConfigured(): boolean {
  return readSmtpConfig() !== null;
}

/**
 * Sends the enquiry via SMTP (Nodemailer). Recipients are server-only constants.
 * SMTP accept ≠ guaranteed inbox delivery.
 */
export async function sendEnquiryEmail(
  data: EnquiryPayload
): Promise<EnquiryEmailResult> {
  const smtp = readSmtpConfig();

  if (!smtp) {
    return {
      ok: false,
      configMissing: true,
      error:
        "Email delivery is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and SMTP_FROM.",
    };
  }

  const submittedAtIso = new Date().toISOString();
  const { subject, text, html } = buildEnquiryEmailContent(data, submittedAtIso);

  // Hostinger / implicit TLS: port 465 requires secure: true.
  // Port 587 uses STARTTLS (secure: false).
  const secure = smtp.port === 465;

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    });

    const info = await transporter.sendMail({
      from: smtp.from,
      to: [...ENQUIRY_RECIPIENTS],
      replyTo: data.email,
      subject,
      text,
      html,
    });

    const accepted = Array.isArray(info.accepted)
      ? info.accepted.map((entry) => String(entry).toLowerCase())
      : [];

    const bothAccepted = ENQUIRY_RECIPIENTS.every((recipient) =>
      accepted.some(
        (entry) =>
          entry === recipient.toLowerCase() ||
          entry.includes(`<${recipient.toLowerCase()}>`)
      )
    );

    if (!bothAccepted) {
      return {
        ok: false,
        error: "SMTP server did not accept both enquiry recipients.",
      };
    }

    const providerId =
      (typeof info.messageId === "string" && info.messageId) ||
      "smtp-accepted";

    return { ok: true, providerId };
  } catch {
    return {
      ok: false,
      error: "Could not send via SMTP. Please try again.",
    };
  }
}

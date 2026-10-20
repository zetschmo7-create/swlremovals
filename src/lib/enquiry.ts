export const PROPERTY_TYPES = [
  "House",
  "Flat",
  "Bungalow",
  "Maisonette",
  "Other",
] as const;

export const BEDROOM_OPTIONS = [
  "Studio",
  "1",
  "2",
  "3",
  "4",
  "5+",
] as const;

export const TIMEFRAME_OPTIONS = [
  "Within 2 weeks",
  "This month",
  "1–2 months",
  "3+ months",
  "Not sure yet",
] as const;

export type EnquiryPayload = {
  fullName: string;
  phone: string;
  email: string;
  propertyType: string;
  collectionPostcode: string;
  deliveryPostcode: string;
  bedrooms: string;
  timeframe: string;
  moveDate: string;
  collectionAddress: string;
  deliveryAddress: string;
  pageUrl: string;
  /** Honeypot — must stay empty */
  companyWebsite?: string;
};

export const ENQUIRY_RECIPIENTS = [
  "appointments@ryanremovals-surveys.com",
  "info@swlremovals.co.uk",
] as const;

/** Optional in-person survey WhatsApp (thank-you screen + customer acknowledgement). */
export const ENQUIRY_SURVEY_WHATSAPP_NUMBER = "447522908555";

export const ENQUIRY_SURVEY_WHATSAPP_HREF =
  `https://wa.me/${ENQUIRY_SURVEY_WHATSAPP_NUMBER}?text=` +
  encodeURIComponent(
    "Hi SW London Removals, I've submitted a moving enquiry through your website and would like to arrange a free, no-obligation in-person survey."
  );

export const ENQUIRY_SURVEY_WHATSAPP_URL = `https://wa.me/${ENQUIRY_SURVEY_WHATSAPP_NUMBER}`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

export type EnquiryValidationResult =
  | { ok: true; data: EnquiryPayload }
  | { ok: false; errors: Record<string, string> };

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateEnquiryPayload(
  raw: Record<string, unknown>
): EnquiryValidationResult {
  const errors: Record<string, string> = {};

  // Honeypot — accept legacy + anti-autofill field names; any value = bot
  const companyWebsite =
    clean(raw.companyWebsite) ||
    clean(raw.swl_hp_token) ||
    clean(raw.websiteUrlConfirm);

  const fullName = clean(raw.fullName);
  const phone = clean(raw.phone);
  const email = clean(raw.email);
  const propertyType = clean(raw.propertyType);
  const collectionPostcode = clean(raw.collectionPostcode).toUpperCase();
  const deliveryPostcode = clean(raw.deliveryPostcode).toUpperCase();
  const bedrooms = clean(raw.bedrooms);
  const timeframe = clean(raw.timeframe);
  const moveDate = clean(raw.moveDate);
  const collectionAddress = clean(raw.collectionAddress);
  const deliveryAddress = clean(raw.deliveryAddress);
  const pageUrl = clean(raw.pageUrl);

  if (!fullName) errors.fullName = "Please enter your full name.";
  else if (fullName.length > 120) errors.fullName = "Name is too long.";

  if (phone && phone.length > 40) errors.phone = "Phone number is too long.";

  if (!email) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(email) || email.length > 200) {
    errors.email = "Please enter a valid email address.";
  }

  if (!propertyType) errors.propertyType = "Please select a property type.";
  else if (
    !(PROPERTY_TYPES as readonly string[]).includes(propertyType)
  ) {
    errors.propertyType = "Please select a valid property type.";
  }

  if (!collectionPostcode) {
    errors.collectionPostcode = "Please enter the collection postcode.";
  } else if (!POSTCODE_RE.test(collectionPostcode)) {
    errors.collectionPostcode = "Please enter a valid UK postcode.";
  }

  if (!deliveryPostcode) {
    errors.deliveryPostcode = "Please enter the delivery postcode.";
  } else if (!POSTCODE_RE.test(deliveryPostcode)) {
    errors.deliveryPostcode = "Please enter a valid UK postcode.";
  }

  if (!bedrooms) errors.bedrooms = "Please select bedrooms.";
  else if (!(BEDROOM_OPTIONS as readonly string[]).includes(bedrooms)) {
    errors.bedrooms = "Please select a valid bedroom option.";
  }

  if (!timeframe) errors.timeframe = "Please select a moving timeframe.";
  else if (!(TIMEFRAME_OPTIONS as readonly string[]).includes(timeframe)) {
    errors.timeframe = "Please select a valid timeframe.";
  }

  if (moveDate && !/^\d{4}-\d{2}-\d{2}$/.test(moveDate)) {
    errors.moveDate = "Please enter a valid date.";
  }

  if (collectionAddress.length > 300) {
    errors.collectionAddress = "Address is too long.";
  }
  if (deliveryAddress.length > 300) {
    errors.deliveryAddress = "Address is too long.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      fullName,
      phone,
      email: email.toLowerCase(),
      propertyType,
      collectionPostcode,
      deliveryPostcode,
      bedrooms,
      timeframe,
      moveDate,
      collectionAddress,
      deliveryAddress,
      pageUrl: pageUrl.slice(0, 500),
      companyWebsite,
    },
  };
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function displayOrNotProvided(value: string): string {
  return value.trim() ? value.trim() : "Not provided";
}

export function firstNameFromFullName(fullName: string): string {
  const first = fullName.trim().split(/\s+/)[0] ?? "";
  return first || "there";
}

export function buildEnquiryEmailContent(
  data: EnquiryPayload,
  submittedAtIso: string,
  submissionRef: string
): { subject: string; text: string; html: string } {
  const subject = `New SWL moving enquiry – ${data.fullName}`;

  const rows: [string, string][] = [
    ["Submission reference", submissionRef],
    ["Full name", data.fullName],
    ["Phone", displayOrNotProvided(data.phone)],
    ["Email", data.email],
    ["Property type", data.propertyType],
    ["Collection postcode", data.collectionPostcode],
    ["Delivery postcode", data.deliveryPostcode],
    ["Bedrooms", data.bedrooms],
    ["Moving timeframe", data.timeframe],
    ["Exact moving date", displayOrNotProvided(data.moveDate)],
    ["Collection street address", displayOrNotProvided(data.collectionAddress)],
    ["Delivery street address", displayOrNotProvided(data.deliveryAddress)],
    ["Submitted at (UTC)", submittedAtIso],
    ["Originating page", displayOrNotProvided(data.pageUrl)],
  ];

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");

  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e5e5e5;font-weight:600;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 12px;border:1px solid #e5e5e5;">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  const html = `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#1a1a1a;">
<p>A new moving enquiry was submitted on the SW London Removals website.</p>
<table style="border-collapse:collapse;width:100%;max-width:640px;">${htmlRows}</table>
</body></html>`;

  return { subject, text, html };
}

/**
 * Customer acknowledgement — no MoveFlow links, no quote-ready / survey-booked claims.
 */
export function buildCustomerAcknowledgementContent(
  fullName: string
): { subject: string; text: string; html: string } {
  const firstName = firstNameFromFullName(fullName);
  const safeFirst = escapeHtml(firstName);
  const whatsappUrl = ENQUIRY_SURVEY_WHATSAPP_URL;
  const subject = "We’ve received your moving enquiry";

  const text = [
    `Hi ${firstName},`,
    "",
    "Thank you for contacting South West London Removals.",
    "",
    "Our team will be in touch shortly to discuss your move.",
    "",
    "Alternatively, WhatsApp us to arrange a free, no-obligation home survey:",
    whatsappUrl,
    "",
    "Kind regards,",
    "South West London Removals",
  ].join("\n");

  const html = `<!DOCTYPE html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;line-height:1.5;">
<p>Hi ${safeFirst},</p>
<p>Thank you for contacting South West London Removals.</p>
<p>Our team will be in touch shortly to discuss your move.</p>
<p>Alternatively, WhatsApp us to arrange a free, no-obligation home survey:</p>
<p style="margin:24px 0;">
  <a href="${escapeHtml(whatsappUrl)}" style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:999px;">Message us on WhatsApp</a>
</p>
<p style="font-size:14px;color:#555;">Or open: <a href="${escapeHtml(whatsappUrl)}" style="color:#0F3D2E;">${escapeHtml(whatsappUrl)}</a></p>
<p>Kind regards,<br/>South West London Removals</p>
</body></html>`;

  return { subject, text, html };
}

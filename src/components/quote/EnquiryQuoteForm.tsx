"use client";

import { useCallback, useState, type FormEvent } from "react";
import { Check, Loader2, MessageCircle } from "lucide-react";
import {
  BEDROOM_OPTIONS,
  ENQUIRY_SURVEY_WHATSAPP_HREF,
  PROPERTY_TYPES,
  TIMEFRAME_OPTIONS,
} from "@/lib/enquiry";

export type EnquiryFormValues = {
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
  companyWebsite: string;
};

const INITIAL: EnquiryFormValues = {
  fullName: "",
  phone: "",
  email: "",
  propertyType: "",
  collectionPostcode: "",
  deliveryPostcode: "",
  bedrooms: "",
  timeframe: "",
  moveDate: "",
  collectionAddress: "",
  deliveryAddress: "",
  companyWebsite: "",
};

type Props = {
  variant?: "modal" | "page";
  onSuccess?: () => void;
};

function fieldClass(hasError: boolean) {
  return [
    "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-charcoal outline-none transition-colors",
    "placeholder:text-charcoal-muted/70",
    "focus:border-green-700 focus:ring-2 focus:ring-green-700/15",
    hasError ? "border-red-400" : "border-border",
  ].join(" ");
}

function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-charcoal"
    >
      {children}
      {required ? <span className="text-green-800"> *</span> : null}
    </label>
  );
}

export function EnquiryQuoteForm({ variant = "modal", onSuccess }: Props) {
  const [values, setValues] = useState<EnquiryFormValues>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const update = useCallback((patch: Partial<EnquiryFormValues>) => {
    setValues((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setSubmitError(null);
    setErrors({});

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          pageUrl:
            typeof window !== "undefined" ? window.location.href : "",
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        errors?: Record<string, string>;
        configMissing?: boolean;
      };

      if (!response.ok || !payload.ok) {
        if (payload.errors) setErrors(payload.errors);
        setSubmitError(
          payload.error ||
            "We could not send your enquiry. Please try again."
        );
        return;
      }

      setSucceeded(true);
      onSuccess?.();
    } catch {
      setSubmitError(
        "We could not send your enquiry. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (succeeded) {
    return (
      <div
        className={`text-center ${variant === "page" ? "py-10" : "py-8 px-1"}`}
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-800/10">
          <Check className="h-7 w-7 text-green-800" aria-hidden />
        </div>
        <h3 className="font-display text-2xl font-semibold text-charcoal tracking-tight">
          Thank you, we&apos;ve received your enquiry.
        </h3>
        <p className="mt-3 text-charcoal-light leading-relaxed max-w-md mx-auto">
          Our team will be in touch about your move. If you&apos;d like to
          arrange a free, no-obligation in-person survey, message us on
          WhatsApp.
        </p>
        <a
          href={ENQUIRY_SURVEY_WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1ebe57]"
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          Arrange a free survey on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative space-y-5">
      <div>
        <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-green-700">
          About your move
        </p>
      </div>

      {/* Honeypot */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor="companyWebsite">Company website</label>
        <input
          id="companyWebsite"
          name="companyWebsite"
          tabIndex={-1}
          autoComplete="off"
          value={values.companyWebsite}
          onChange={(e) => update({ companyWebsite: e.target.value })}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="fullName" required>
            Full name
          </Label>
          <input
            id="fullName"
            name="fullName"
            autoComplete="name"
            className={fieldClass(Boolean(errors.fullName))}
            value={values.fullName}
            onChange={(e) => update({ fullName: e.target.value })}
            required
          />
          {errors.fullName ? (
            <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={fieldClass(Boolean(errors.phone))}
            value={values.phone}
            onChange={(e) => update({ phone: e.target.value })}
          />
          {errors.phone ? (
            <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
          ) : null}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="email" required>
            Email
          </Label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={fieldClass(Boolean(errors.email))}
            value={values.email}
            onChange={(e) => update({ email: e.target.value })}
            required
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="propertyType" required>
            Property type
          </Label>
          <select
            id="propertyType"
            name="propertyType"
            className={fieldClass(Boolean(errors.propertyType))}
            value={values.propertyType}
            onChange={(e) => update({ propertyType: e.target.value })}
            required
          >
            <option value="">Select…</option>
            {PROPERTY_TYPES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.propertyType ? (
            <p className="mt-1 text-xs text-red-600">{errors.propertyType}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="bedrooms" required>
            Bedrooms
          </Label>
          <select
            id="bedrooms"
            name="bedrooms"
            className={fieldClass(Boolean(errors.bedrooms))}
            value={values.bedrooms}
            onChange={(e) => update({ bedrooms: e.target.value })}
            required
          >
            <option value="">Select…</option>
            {BEDROOM_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.bedrooms ? (
            <p className="mt-1 text-xs text-red-600">{errors.bedrooms}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="collectionPostcode" required>
            Collection postcode
          </Label>
          <input
            id="collectionPostcode"
            name="collectionPostcode"
            autoComplete="postal-code"
            className={fieldClass(Boolean(errors.collectionPostcode))}
            value={values.collectionPostcode}
            onChange={(e) => update({ collectionPostcode: e.target.value })}
            required
          />
          {errors.collectionPostcode ? (
            <p className="mt-1 text-xs text-red-600">
              {errors.collectionPostcode}
            </p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="deliveryPostcode" required>
            Delivery postcode
          </Label>
          <input
            id="deliveryPostcode"
            name="deliveryPostcode"
            className={fieldClass(Boolean(errors.deliveryPostcode))}
            value={values.deliveryPostcode}
            onChange={(e) => update({ deliveryPostcode: e.target.value })}
            required
          />
          {errors.deliveryPostcode ? (
            <p className="mt-1 text-xs text-red-600">
              {errors.deliveryPostcode}
            </p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="timeframe" required>
            When are you moving?
          </Label>
          <select
            id="timeframe"
            name="timeframe"
            className={fieldClass(Boolean(errors.timeframe))}
            value={values.timeframe}
            onChange={(e) => update({ timeframe: e.target.value })}
            required
          >
            <option value="">Select…</option>
            {TIMEFRAME_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.timeframe ? (
            <p className="mt-1 text-xs text-red-600">{errors.timeframe}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="moveDate">Exact move date (if known)</Label>
          <input
            id="moveDate"
            name="moveDate"
            type="date"
            className={fieldClass(Boolean(errors.moveDate))}
            value={values.moveDate}
            onChange={(e) => update({ moveDate: e.target.value })}
          />
          {errors.moveDate ? (
            <p className="mt-1 text-xs text-red-600">{errors.moveDate}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="collectionAddress">
            Collection street address (optional)
          </Label>
          <input
            id="collectionAddress"
            name="collectionAddress"
            autoComplete="street-address"
            className={fieldClass(Boolean(errors.collectionAddress))}
            value={values.collectionAddress}
            onChange={(e) => update({ collectionAddress: e.target.value })}
          />
          {errors.collectionAddress ? (
            <p className="mt-1 text-xs text-red-600">
              {errors.collectionAddress}
            </p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="deliveryAddress">
            Delivery street address (optional)
          </Label>
          <input
            id="deliveryAddress"
            name="deliveryAddress"
            className={fieldClass(Boolean(errors.deliveryAddress))}
            value={values.deliveryAddress}
            onChange={(e) => update({ deliveryAddress: e.target.value })}
          />
          {errors.deliveryAddress ? (
            <p className="mt-1 text-xs text-red-600">
              {errors.deliveryAddress}
            </p>
          ) : null}
        </div>
      </div>

      {submitError ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {submitError}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-green-800 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-70 md:w-auto md:min-w-[220px]"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Sending…
          </>
        ) : (
          "Request my quotation"
        )}
      </button>

      <p className="text-xs text-charcoal-muted leading-relaxed">
        Your details are private and only sent to SW London Removals.
      </p>
    </form>
  );
}

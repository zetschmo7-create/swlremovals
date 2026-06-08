"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { WHATSAPP_HREF } from "@/lib/constants";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MessageCircle,
  Upload,
} from "lucide-react";

type FormData = {
  movingFrom: string;
  movingTo: string;
  propertyType: string;
  moveDate: string;
  bedrooms: string;
  packingRequired: string;
  storageRequired: string;
  phone: string;
  email: string;
  whatsappPreferred: boolean;
  preferredContact: string;
  videoFile: File | null;
  name: string;
};

const INITIAL: FormData = {
  movingFrom: "",
  movingTo: "",
  propertyType: "",
  moveDate: "",
  bedrooms: "",
  packingRequired: "",
  storageRequired: "",
  phone: "",
  email: "",
  whatsappPreferred: true,
  preferredContact: "WhatsApp",
  videoFile: null,
  name: "",
};

const STEPS = [
  { title: "Locations", description: "Where are you moving?" },
  { title: "Property", description: "Tell us about your home" },
  { title: "Services", description: "Packing and storage" },
  { title: "Contact", description: "How can we reach you?" },
];

const PROPERTY_TYPES = [
  "Flat / Apartment",
  "Terraced house",
  "Semi-detached",
  "Detached house",
  "Bungalow",
  "Office / Commercial",
];

export function QuoteForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  const update = (fields: Partial<FormData>) =>
    setData((prev) => ({ ...prev, ...fields }));

  const progress = ((step + 1) / STEPS.length) * 100;

  const canProceed = () => {
    switch (step) {
      case 0:
        return data.movingFrom.trim() && data.movingTo.trim();
      case 1:
        return data.propertyType && data.bedrooms && data.moveDate;
      case 2:
        return data.packingRequired && data.storageRequired;
      case 3:
        return (
          data.name.trim() &&
          data.phone.trim() &&
          data.email.trim() &&
          data.preferredContact
        );
      default:
        return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-green-800/10 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-800" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal mb-4">
          Quote request received
        </h2>
        <p className="text-charcoal-light max-w-md mx-auto mb-8">
          Thank you, {data.name}. We will review your details and respond with a
          fixed quotation — typically within a few hours during business hours.
        </p>
        {data.whatsappPreferred && (
          <Button href={WHATSAPP_HREF} variant="whatsapp" external>
            <MessageCircle className="w-5 h-5" />
            Continue on WhatsApp
          </Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Progress */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-medium text-charcoal">
            Step {step + 1} of {STEPS.length}
          </p>
          <p className="text-sm text-charcoal-muted">{STEPS[step].description}</p>
        </div>
        <div className="h-1.5 bg-cream-dark rounded-full overflow-hidden">
          <div
            className="h-full bg-green-800 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="hidden sm:flex justify-between mt-4">
          {STEPS.map((s, i) => (
            <span
              key={s.title}
              className={`text-xs font-medium ${i <= step ? "text-green-800" : "text-charcoal-muted"}`}
            >
              {s.title}
            </span>
          ))}
        </div>
      </div>

      <div className="min-h-[320px]">
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Moving from — postcode or area
              </label>
              <input
                type="text"
                value={data.movingFrom}
                onChange={(e) => update({ movingFrom: e.target.value })}
                placeholder="e.g. SW19 Wimbledon"
                className="w-full px-4 py-3.5 rounded-xl border border-border bg-white text-charcoal placeholder:text-charcoal-muted focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Moving to — postcode or area
              </label>
              <input
                type="text"
                value={data.movingTo}
                onChange={(e) => update({ movingTo: e.target.value })}
                placeholder="e.g. TW9 Richmond"
                className="w-full px-4 py-3.5 rounded-xl border border-border bg-white text-charcoal placeholder:text-charcoal-muted focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition-colors"
                required
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Property type
              </label>
              <select
                value={data.propertyType}
                onChange={(e) => update({ propertyType: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition-colors"
                required
              >
                <option value="">Select property type</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Number of bedrooms
              </label>
              <select
                value={data.bedrooms}
                onChange={(e) => update({ bedrooms: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition-colors"
                required
              >
                <option value="">Select bedrooms</option>
                {["Studio", "1", "2", "3", "4", "5", "6+"].map((n) => (
                  <option key={n} value={n}>
                    {n === "Studio" ? "Studio" : `${n} bedroom${n === "1" ? "" : "s"}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Preferred move date
              </label>
              <input
                type="date"
                value={data.moveDate}
                onChange={(e) => update({ moveDate: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition-colors"
                required
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-3">
                Packing required?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["Full packing", "Partial", "None"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => update({ packingRequired: opt })}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                      data.packingRequired === opt
                        ? "border-green-800 bg-green-800/5 text-green-800"
                        : "border-border bg-white text-charcoal-light hover:border-green-700/30"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-3">
                Storage required?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["Yes", "Maybe", "No"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => update({ storageRequired: opt })}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                      data.storageRequired === opt
                        ? "border-green-800 bg-green-800/5 text-green-800"
                        : "border-border bg-white text-charcoal-light hover:border-green-700/30"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Your name
              </label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="Full name"
                className="w-full px-4 py-3.5 rounded-xl border border-border bg-white text-charcoal placeholder:text-charcoal-muted focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition-colors"
                required
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => update({ phone: e.target.value })}
                  placeholder="07xxx xxxxxx"
                  className="w-full px-4 py-3.5 rounded-xl border border-border bg-white text-charcoal placeholder:text-charcoal-muted focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => update({ email: e.target.value })}
                  placeholder="you@email.com"
                  className="w-full px-4 py-3.5 rounded-xl border border-border bg-white text-charcoal placeholder:text-charcoal-muted focus:outline-none focus:ring-2 focus:ring-green-700/20 focus:border-green-700 transition-colors"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-3">
                Preferred contact method
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["WhatsApp", "Phone", "Email"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() =>
                      update({
                        preferredContact: opt,
                        whatsappPreferred: opt === "WhatsApp",
                      })
                    }
                    className={`px-4 py-3.5 rounded-xl border text-sm font-medium transition-all ${
                      data.preferredContact === opt
                        ? "border-green-800 bg-green-800/5 text-green-800"
                        : "border-border bg-white text-charcoal-light hover:border-green-700/30"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Upload walkthrough video (optional)
              </label>
              <label className="flex flex-col items-center justify-center w-full px-4 py-8 rounded-xl border-2 border-dashed border-border bg-cream hover:border-green-700/30 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-charcoal-muted mb-2" />
                <span className="text-sm text-charcoal-light">
                  {data.videoFile
                    ? data.videoFile.name
                    : "Drop a video file or click to browse"}
                </span>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) =>
                    update({ videoFile: e.target.files?.[0] ?? null })
                  }
                />
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-10 pt-6 border-t border-border">
        {step > 0 ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep(step - 1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        ) : (
          <div />
        )}

        {step < STEPS.length - 1 ? (
          <Button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button type="submit" disabled={!canProceed()}>
            Submit Quote Request
          </Button>
        )}
      </div>
    </form>
  );
}

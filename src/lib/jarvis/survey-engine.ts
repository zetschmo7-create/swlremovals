import type { ClassifiedEmail } from "./types";
import {
  extractPostcodeZone,
  extractTimesFromText,
  formatMinutesAsTime,
  parseEmailDate,
} from "./extractors";

export type SurveyZone = "GU" | "RH" | "TN";
export type SurveyConfidence = "high" | "medium" | "none";

export type SurveySlot = {
  zone: SurveyZone;
  date: string;
  dateLabel: string;
  time: string;
  confidence: SurveyConfidence;
  reasoning: string;
  existingBookings: string[];
};

type ZoneBooking = {
  zone: SurveyZone;
  dateKey: string;
  minutes: number;
};

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatDateLabel(dateKeyStr: string): string {
  const today = dateKey(new Date());
  const tomorrow = dateKey(new Date(Date.now() + 86400000));
  if (dateKeyStr === today) return "Today";
  if (dateKeyStr === tomorrow) return "Tomorrow";
  return new Date(dateKeyStr).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function extractSurveyBookings(emails: ClassifiedEmail[]): ZoneBooking[] {
  const bookings: ZoneBooking[] = [];

  for (const email of emails) {
    if (email.category !== "survey_booking" && !/survey/i.test(email.subject)) {
      continue;
    }

    const zone = extractPostcodeZone(email);
    if (!zone) continue;

    const when = parseEmailDate(email.date);
    if (!when) continue;

    const times = extractTimesFromText(
      `${email.subject} ${email.snippet} ${email.body}`
    );
    if (times.length === 0) continue;

    for (const minutes of times) {
      bookings.push({ zone, dateKey: dateKey(when), minutes });
    }
  }

  return bookings;
}

function suggestNextSlot(
  zone: SurveyZone,
  dateKeyStr: string,
  bookings: ZoneBooking[]
): SurveySlot | null {
  const dayBookings = bookings
    .filter((b) => b.zone === zone && b.dateKey === dateKeyStr)
    .map((b) => b.minutes)
    .sort((a, b) => a - b);

  if (dayBookings.length === 0) return null;

  const last = dayBookings[dayBookings.length - 1];
  const nextMinutes = last + 60;

  if (nextMinutes > 19 * 60) return null;

  const count = dayBookings.length;
  const confidence: SurveyConfidence = count >= 2 ? "high" : "medium";
  const existingTimes = dayBookings.map(formatMinutesAsTime);

  const reasoning =
    count >= 2
      ? `Suggested because ${zone} surveys already exist at ${existingTimes.join(" and ")}.`
      : `Suggested because one ${zone} survey exists at ${existingTimes[0]}.`;

  return {
    zone,
    date: dateKeyStr,
    dateLabel: formatDateLabel(dateKeyStr),
    time: formatMinutesAsTime(nextMinutes),
    confidence,
    reasoning,
    existingBookings: existingTimes,
  };
}

export function buildSurveyIntelligence(emails: ClassifiedEmail[]): {
  slots: Record<SurveyZone, SurveySlot[]>;
  needsSetup: boolean;
} {
  const bookings = extractSurveyBookings(emails);
  const zones: SurveyZone[] = ["GU", "RH", "TN"];
  const today = dateKey(new Date());
  const tomorrow = dateKey(new Date(Date.now() + 86400000));
  const dates = [today, tomorrow];

  const slots: Record<SurveyZone, SurveySlot[]> = { GU: [], RH: [], TN: [] };

  if (bookings.length === 0) {
    return { slots, needsSetup: true };
  }

  for (const zone of zones) {
    for (const d of dates) {
      const suggestion = suggestNextSlot(zone, d, bookings);
      if (suggestion) slots[zone].push(suggestion);
    }
  }

  const hasAny = zones.some((z) => slots[z].length > 0);
  return { slots, needsSetup: !hasAny };
}

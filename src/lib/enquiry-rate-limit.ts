type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 8;

/** Simple in-memory rate limit (per serverless isolate). */
export function checkEnquiryRateLimit(key: string): {
  allowed: boolean;
  retryAfterSec?: number;
} {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (existing.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true };
}

const recentFingerprints = new Map<string, number>();
const DEDUPE_MS = 60 * 1000;

/** Blocks identical submissions within a short window. */
export function isDuplicateEnquiry(fingerprint: string): boolean {
  const now = Date.now();
  for (const [key, at] of recentFingerprints) {
    if (now - at > DEDUPE_MS) recentFingerprints.delete(key);
  }
  const previous = recentFingerprints.get(fingerprint);
  if (previous && now - previous < DEDUPE_MS) return true;
  recentFingerprints.set(fingerprint, now);
  return false;
}

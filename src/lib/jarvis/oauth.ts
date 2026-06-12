import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { google } from "googleapis";
import type { JarvisAccount } from "./types";

export const GMAIL_READONLY_SCOPE = "https://www.googleapis.com/auth/gmail.readonly";

const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;

export function getGoogleOAuthCredentials(): {
  clientId: string;
  clientSecret: string;
} | null {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

export function isGoogleOAuthConfigured(): boolean {
  return getGoogleOAuthCredentials() !== null;
}

export function getJarvisAppUrl(): string {
  if (process.env.JARVIS_APP_URL) {
    return process.env.JARVIS_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_ENV === "production") {
    return "https://swlremovals.co.uk";
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export function getOAuthRedirectUri(): string {
  return `${getJarvisAppUrl()}/api/jarvis/oauth/callback`;
}

function getStateSecret(): string | null {
  return process.env.JARVIS_SESSION_SECRET ?? null;
}

function signStatePayload(encoded: string): string | null {
  const secret = getStateSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update(encoded).digest("hex");
}

export function createOAuthState(account: JarvisAccount): string | null {
  const secret = getStateSecret();
  if (!secret) return null;

  const payload = JSON.stringify({
    account,
    nonce: randomBytes(16).toString("hex"),
    exp: Date.now() + OAUTH_STATE_TTL_MS,
  });
  const encoded = Buffer.from(payload).toString("base64url");
  const signature = signStatePayload(encoded);
  if (!signature) return null;
  return `${encoded}.${signature}`;
}

export function verifyOAuthState(state: string | null): JarvisAccount | null {
  if (!state) return null;

  const [encoded, signature] = state.split(".");
  if (!encoded || !signature) return null;

  const expected = signStatePayload(encoded);
  if (!expected) return null;

  try {
    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }
  } catch {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as { account?: JarvisAccount; exp?: number };
    if (!payload.account || !payload.exp || Date.now() > payload.exp) {
      return null;
    }
    if (payload.account !== "main" && payload.account !== "appointments") {
      return null;
    }
    return payload.account;
  } catch {
    return null;
  }
}

export function createOAuth2Client() {
  const creds = getGoogleOAuthCredentials();
  if (!creds) throw new Error("Google OAuth is not configured.");
  return new google.auth.OAuth2(
    creds.clientId,
    creds.clientSecret,
    getOAuthRedirectUri()
  );
}

export function buildAuthorizationUrl(account: JarvisAccount): string {
  const state = createOAuthState(account);
  if (!state) throw new Error("Unable to create OAuth state.");

  const client = createOAuth2Client();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [GMAIL_READONLY_SCOPE],
    state,
    include_granted_scopes: true,
  });
}

export async function exchangeAuthorizationCode(code: string) {
  const client = createOAuth2Client();
  const { tokens } = await client.getToken(code);
  if (!tokens.refresh_token) {
    throw new Error(
      "Google did not return a refresh token. Disconnect the app in your Google Account permissions and try again with consent."
    );
  }
  client.setCredentials(tokens);
  return { client, refreshToken: tokens.refresh_token };
}

export async function getConnectedEmail(
  refreshToken: string
): Promise<string> {
  const client = createOAuth2Client();
  client.setCredentials({ refresh_token: refreshToken });
  const gmail = google.gmail({ version: "v1", auth: client });
  const profile = await gmail.users.getProfile({ userId: "me" });
  return profile.data.emailAddress ?? "unknown@gmail.com";
}

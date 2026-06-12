import { NextResponse } from "next/server";
import { getJarvisAppUrl } from "@/lib/jarvis/oauth";
import {
  exchangeAuthorizationCode,
  getConnectedEmail,
  verifyOAuthState,
} from "@/lib/jarvis/oauth";
import { storeGmailConnection } from "@/lib/jarvis/token-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const oauthError = searchParams.get("error");

  const setupUrl = `${getJarvisAppUrl()}/admin/jarvis/setup`;

  if (oauthError) {
    return NextResponse.redirect(
      `${setupUrl}?error=${encodeURIComponent(oauthError)}`
    );
  }

  const account = verifyOAuthState(state);
  if (!account || !code) {
    return NextResponse.redirect(
      `${setupUrl}?error=${encodeURIComponent("Invalid OAuth callback.")}`
    );
  }

  try {
    const { refreshToken } = await exchangeAuthorizationCode(code);
    const email = await getConnectedEmail(refreshToken);
    await storeGmailConnection(account, refreshToken, email);

    return NextResponse.redirect(
      `${setupUrl}?connected=${encodeURIComponent(account)}`
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "OAuth callback failed";
    return NextResponse.redirect(
      `${setupUrl}?error=${encodeURIComponent(message)}`
    );
  }
}

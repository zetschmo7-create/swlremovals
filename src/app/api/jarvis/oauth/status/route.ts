import { NextResponse } from "next/server";
import { getJarvisSession } from "@/lib/jarvis/auth";
import { getOAuthRedirectUri } from "@/lib/jarvis/oauth";
import { getGmailConnectionStatus } from "@/lib/jarvis/token-store";
import type { GmailConnectionStatusResponse } from "@/lib/jarvis/types";

export async function GET() {
  const authed = await getJarvisSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = await getGmailConnectionStatus();
  const response: GmailConnectionStatusResponse = {
    ...status,
    redirectUri: getOAuthRedirectUri(),
  };

  return NextResponse.json(response);
}

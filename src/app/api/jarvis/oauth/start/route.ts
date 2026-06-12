import { NextResponse } from "next/server";
import { getJarvisSession } from "@/lib/jarvis/auth";
import { buildAuthorizationUrl } from "@/lib/jarvis/oauth";
import type { JarvisAccount } from "@/lib/jarvis/types";

export async function GET(request: Request) {
  const authed = await getJarvisSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const account = new URL(request.url).searchParams.get("account");
  if (account !== "main" && account !== "appointments") {
    return NextResponse.json({ error: "Invalid account." }, { status: 400 });
  }

  try {
    const url = buildAuthorizationUrl(account as JarvisAccount);
    return NextResponse.redirect(url);
  } catch (error) {
    const message = error instanceof Error ? error.message : "OAuth start failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

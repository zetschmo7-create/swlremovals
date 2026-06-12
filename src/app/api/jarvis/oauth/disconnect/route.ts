import { NextResponse } from "next/server";
import { getJarvisSession } from "@/lib/jarvis/auth";
import { removeGmailConnection } from "@/lib/jarvis/token-store";
import type { JarvisAccount } from "@/lib/jarvis/types";

export async function POST(request: Request) {
  const authed = await getJarvisSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let account: JarvisAccount | null = null;
  try {
    const body = (await request.json()) as { account?: string };
    if (body.account === "main" || body.account === "appointments") {
      account = body.account;
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!account) {
    return NextResponse.json({ error: "Invalid account." }, { status: 400 });
  }

  try {
    await removeGmailConnection(account);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Disconnect failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

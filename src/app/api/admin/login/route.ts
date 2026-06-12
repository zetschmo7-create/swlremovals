import { NextResponse } from "next/server";
import {
  createSessionToken,
  isJarvisAuthConfigured,
  sessionCookieOptions,
  verifyAdminPassword,
} from "@/lib/jarvis/auth";

export async function POST(request: Request) {
  if (!isJarvisAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          "Jarvis auth is not configured. Set JARVIS_ADMIN_PASSWORD and JARVIS_SESSION_SECRET.",
      },
      { status: 503 }
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = body.password ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = createSessionToken();
  if (!token) {
    return NextResponse.json({ error: "Failed to create session." }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookieOptions(token));
  return response;
}

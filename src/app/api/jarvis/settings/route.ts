import { NextResponse } from "next/server";
import { getJarvisSession } from "@/lib/jarvis/auth";
import {
  getJarvisSettings,
  saveJarvisSettings,
  type JarvisSettings,
} from "@/lib/jarvis/settings-store";

export async function GET() {
  const authed = await getJarvisSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getJarvisSettings();
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  const authed = await getJarvisSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<JarvisSettings>;
    const next = await saveJarvisSettings({
      commissionPercent:
        body.commissionPercent != null
          ? Math.max(0, Math.min(100, Number(body.commissionPercent)))
          : undefined,
      leadProviderName:
        typeof body.leadProviderName === "string"
          ? body.leadProviderName.trim()
          : undefined,
      costPerLead:
        body.costPerLead != null
          ? Math.max(0, Number(body.costPerLead))
          : undefined,
    });
    return NextResponse.json(next);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

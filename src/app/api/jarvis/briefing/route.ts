import { NextResponse } from "next/server";
import { getJarvisSession } from "@/lib/jarvis/auth";
import { generateJarvisBriefing } from "@/lib/jarvis/briefing";

export async function GET() {
  const authed = await getJarvisSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const briefing = await generateJarvisBriefing();
    return NextResponse.json(briefing);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Briefing generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

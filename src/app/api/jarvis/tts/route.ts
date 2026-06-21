import { NextResponse } from "next/server";
import { getJarvisSession } from "@/lib/jarvis/auth";
import {
  isElevenLabsConfigured,
  synthesizeElevenLabsSpeech,
} from "@/lib/jarvis/elevenlabs-tts";

export async function POST(request: Request) {
  const authed = await getJarvisSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isElevenLabsConfigured()) {
    return NextResponse.json(
      {
        error:
          "ElevenLabs is not configured. Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID.",
      },
      { status: 503 }
    );
  }

  let body: { text?: string };
  try {
    body = (await request.json()) as { text?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  try {
    const audio = await synthesizeElevenLabsSpeech(text);
    return new NextResponse(new Uint8Array(audio), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Speech synthesis failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

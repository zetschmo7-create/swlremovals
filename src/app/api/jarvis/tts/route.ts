import { NextResponse } from "next/server";
import { getJarvisSession } from "@/lib/jarvis/auth";
import {
  ElevenLabsTtsError,
  formatElevenLabsTtsDebugForUi,
  getElevenLabsConfigSummary,
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
        debug: {
          ...getElevenLabsConfigSummary(),
          text_length: 0,
        },
      },
      { status: 503 }
    );
  }

  let body: { text?: string; test?: boolean };
  try {
    body = (await request.json()) as { text?: string; test?: boolean };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const text = body.test
    ? "Jarvis voice test."
    : typeof body.text === "string"
      ? body.text.trim()
      : "";

  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  try {
    const audio = await synthesizeElevenLabsSpeech(text);
    if (audio.length === 0) {
      return NextResponse.json(
        { error: "ElevenLabs returned empty audio bytes" },
        { status: 502 }
      );
    }
    return new NextResponse(new Uint8Array(audio), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(audio.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof ElevenLabsTtsError) {
      const uiError = formatElevenLabsTtsDebugForUi(error.message, error.debug);
      return NextResponse.json(
        {
          error: uiError,
          debug: error.debug,
        },
        { status: 502 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Speech synthesis failed";
    console.error("[ElevenLabs TTS] unexpected error", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

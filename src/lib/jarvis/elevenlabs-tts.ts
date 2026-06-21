const TTS_MAX_CHARS = 1200;
const DEFAULT_MODEL = "eleven_flash_v2_5";

export function isElevenLabsConfigured(): boolean {
  return Boolean(
    process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID
  );
}

export async function synthesizeElevenLabsSpeech(text: string): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  const modelId = process.env.ELEVENLABS_MODEL_ID ?? DEFAULT_MODEL;

  if (!apiKey || !voiceId) {
    throw new Error(
      "ElevenLabs is not configured. Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID."
    );
  }

  const trimmed = text.trim().slice(0, TTS_MAX_CHARS);
  if (!trimmed) {
    throw new Error("Text is required for speech synthesis.");
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: trimmed,
        model_id: modelId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs TTS failed (${response.status})`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

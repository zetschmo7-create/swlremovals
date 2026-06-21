const TTS_MAX_CHARS = 1200;
export const DEFAULT_ELEVENLABS_MODEL = "eleven_flash_v2_5";
const FALLBACK_MODEL = "eleven_multilingual_v2";

export type ElevenLabsTtsRequestPayload = {
  text: string;
  model_id: string;
};

export type ElevenLabsTtsDebug = {
  status: number;
  elevenLabsBody: string;
  model_id: string;
  models_tried: string[];
  voice_id_present: boolean;
  voice_id_hint: string | null;
  text_length: number;
  request_payload: ElevenLabsTtsRequestPayload;
};

export class ElevenLabsTtsError extends Error {
  readonly debug: ElevenLabsTtsDebug;

  constructor(message: string, debug: ElevenLabsTtsDebug) {
    super(message);
    this.name = "ElevenLabsTtsError";
    this.debug = debug;
  }
}

export function isElevenLabsConfigured(): boolean {
  return Boolean(
    process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID
  );
}

export function getElevenLabsConfigSummary(): {
  voice_id_present: boolean;
  voice_id_hint: string | null;
  model_id: string;
} {
  const voiceId = process.env.ELEVENLABS_VOICE_ID?.trim() ?? "";
  return {
    voice_id_present: voiceId.length > 0,
    voice_id_hint: voiceId ? `${voiceId.slice(0, 4)}…` : null,
    model_id: process.env.ELEVENLABS_MODEL_ID ?? DEFAULT_ELEVENLABS_MODEL,
  };
}

function uniqueModels(models: string[]): string[] {
  return [...new Set(models.filter(Boolean))];
}

function voiceRejectedMessage(body: string, status: number): boolean {
  const lower = body.toLowerCase();
  return (
    (status === 400 || status === 404) &&
    (/voice/.test(lower) ||
      /voice_id/.test(lower) ||
      /not found/.test(lower))
  );
}

function formatElevenLabsBody(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "(empty response body)";
  try {
    const parsed = JSON.parse(trimmed) as {
      detail?: unknown;
      message?: string;
      error?: string;
    };
    if (typeof parsed.detail === "string") return parsed.detail;
    if (parsed.detail && typeof parsed.detail === "object") {
      return JSON.stringify(parsed.detail);
    }
    if (parsed.message) return parsed.message;
    if (parsed.error) return parsed.error;
    return trimmed;
  } catch {
    return trimmed.slice(0, 500);
  }
}

async function readElevenLabsErrorBody(response: Response): Promise<string> {
  try {
    const text = await response.text();
    return formatElevenLabsBody(text);
  } catch {
    return "(could not read response body)";
  }
}

async function requestElevenLabsTts(
  apiKey: string,
  voiceId: string,
  text: string,
  modelId: string
): Promise<{ ok: true; audio: Buffer } | { ok: false; status: number; body: string }> {
  const payload: ElevenLabsTtsRequestPayload = {
    text,
    model_id: modelId,
  };

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify(payload),
    }
  );

  if (response.ok) {
    const arrayBuffer = await response.arrayBuffer();
    return { ok: true, audio: Buffer.from(arrayBuffer) };
  }

  const body = await readElevenLabsErrorBody(response);
  return { ok: false, status: response.status, body };
}

export async function synthesizeElevenLabsSpeech(text: string): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID?.trim();

  if (!apiKey || !voiceId) {
    throw new Error(
      "ElevenLabs is not configured. Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID."
    );
  }

  const trimmed = text.trim().slice(0, TTS_MAX_CHARS);
  if (!trimmed) {
    throw new Error("Text is required for speech synthesis.");
  }

  const configuredModel = process.env.ELEVENLABS_MODEL_ID?.trim();
  const modelsToTry = uniqueModels([
    configuredModel || DEFAULT_ELEVENLABS_MODEL,
    ...(configuredModel && configuredModel !== FALLBACK_MODEL
      ? [FALLBACK_MODEL]
      : configuredModel
        ? []
        : [FALLBACK_MODEL]),
  ]);

  let lastStatus = 0;
  let lastBody = "";
  let lastModel = modelsToTry[0] ?? DEFAULT_ELEVENLABS_MODEL;

  for (const modelId of modelsToTry) {
    lastModel = modelId;
    const result = await requestElevenLabsTts(apiKey, voiceId, trimmed, modelId);

    if (result.ok) {
      if (result.audio.length === 0) {
        lastStatus = 502;
        lastBody = "ElevenLabs returned empty audio bytes";
        break;
      }
      return result.audio;
    }

    lastStatus = result.status;
    lastBody = result.body;

    console.error("[ElevenLabs TTS] request failed", {
      status: result.status,
      model_id: modelId,
      voice_id_hint: `${voiceId.slice(0, 4)}…`,
      text_length: trimmed.length,
      body: result.body,
      request_payload: { text: trimmed.slice(0, 80), model_id: modelId },
    });

    if (result.status !== 400) {
      break;
    }
  }

  const debug: ElevenLabsTtsDebug = {
    status: lastStatus,
    elevenLabsBody: lastBody,
    model_id: lastModel,
    models_tried: modelsToTry,
    voice_id_present: true,
    voice_id_hint: `${voiceId.slice(0, 4)}…`,
    text_length: trimmed.length,
    request_payload: {
      text: trimmed,
      model_id: lastModel,
    },
  };

  let message = `ElevenLabs TTS failed (${lastStatus}): ${lastBody}`;
  if (voiceRejectedMessage(lastBody, lastStatus)) {
    message =
      "Voice ID rejected by ElevenLabs — choose another voice or re-copy the voice ID.";
  }

  throw new ElevenLabsTtsError(message, debug);
}

export function formatElevenLabsTtsDebugForUi(
  error: string,
  debug?: ElevenLabsTtsDebug
): string {
  if (!debug) return error;

  const lines = [
    error,
    `ElevenLabs status: ${debug.status}`,
    `ElevenLabs message: ${debug.elevenLabsBody}`,
    `model_id used: ${debug.model_id}`,
    debug.models_tried.length > 1
      ? `models tried: ${debug.models_tried.join(", ")}`
      : null,
    `voice_id present: ${debug.voice_id_present ? "yes" : "no"}`,
    debug.voice_id_hint ? `voice_id hint: ${debug.voice_id_hint}` : null,
    `text length: ${debug.text_length}`,
    `request payload: ${JSON.stringify({
      text:
        debug.request_payload.text.length > 80
          ? `${debug.request_payload.text.slice(0, 80)}…`
          : debug.request_payload.text,
      model_id: debug.request_payload.model_id,
    })}`,
  ].filter(Boolean);

  return lines.join("\n");
}

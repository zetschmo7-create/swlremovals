"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import type { JarvisBriefing } from "@/lib/jarvis/types";
import {
  answerJarvisQuestionForVoice,
  trimForTts,
} from "@/lib/jarvis/ask-jarvis-voice";

type VoiceState = "off" | "listening" | "thinking" | "speaking" | "ready";

type VoiceDebugInfo = {
  secureContext: boolean;
  mediaDevicesAvailable: boolean;
  speechRecognitionAvailable: boolean;
  origin: string;
  topLevelFrame: boolean;
  permissionsPolicyMicrophone: string;
  permissionsQueryState: string;
  audioInputDevices: string;
  lastGetUserMediaResult: string;
  lastSpeechRecognitionError: string;
  rawMicTestResult: string;
};

const INITIAL_DEBUG: VoiceDebugInfo = {
  secureContext: false,
  mediaDevicesAvailable: false,
  speechRecognitionAvailable: false,
  origin: "",
  topLevelFrame: true,
  permissionsPolicyMicrophone: "unknown",
  permissionsQueryState: "not queried",
  audioInputDevices: "not enumerated",
  lastGetUserMediaResult: "not attempted",
  lastSpeechRecognitionError: "none",
  rawMicTestResult: "not run",
};

const NOT_ALLOWED_DESPITE_SITE_PERMISSION =
  "Browser returned NotAllowedError despite site permission. Check Permissions-Policy/header, extension interference, or Chrome profile.";

const MIC_TROUBLESHOOTING = [
  "Try incognito with extensions disabled",
  "Try a new Chrome profile",
  "Try a different microphone input in Windows sound settings",
  "Try https://www.swlremovals.co.uk and https://swlremovals.co.uk separately",
];

function getSpeechRecognitionCtor():
  | (new () => SpeechRecognitionInstance)
  | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

function readPermissionsPolicyMicrophone(): string {
  if (typeof document === "undefined") return "unknown";
  try {
    const doc = document as Document & {
      permissionsPolicy?: { allowsFeature: (feature: string) => boolean };
      featurePolicy?: { allowsFeature: (feature: string) => boolean };
    };
    if (doc.permissionsPolicy) {
      return doc.permissionsPolicy.allowsFeature("microphone")
        ? "allowed (Permissions-Policy)"
        : "blocked (Permissions-Policy)";
    }
    if (doc.featurePolicy) {
      return doc.featurePolicy.allowsFeature("microphone")
        ? "allowed (Feature-Policy)"
        : "blocked (Feature-Policy)";
    }
  } catch {
    /* ignore */
  }
  return "API not available";
}

async function queryMicrophonePermission(): Promise<string> {
  if (!navigator.permissions?.query) return "not supported";
  try {
    const result = await navigator.permissions.query({
      name: "microphone" as PermissionName,
    });
    return result.state;
  } catch (error) {
    return `query failed: ${formatGetUserMediaError(error)}`;
  }
}

async function enumerateAudioInputs(): Promise<string> {
  if (!navigator.mediaDevices?.enumerateDevices) return "not supported";
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const inputs = devices.filter((d) => d.kind === "audioinput");
    if (inputs.length === 0) return "0 audio inputs";
    const labelled = inputs.filter((d) => d.label).length;
    const labels = inputs
      .map((d, i) => d.label || `input ${i + 1} (no label)`)
      .join("; ");
    return `${inputs.length} input(s), ${labelled} labelled — ${labels}`;
  } catch (error) {
    return `enumerate failed: ${formatGetUserMediaError(error)}`;
  }
}

function readDebugSnapshot(): VoiceDebugInfo {
  if (typeof window === "undefined") return INITIAL_DEBUG;
  return {
    secureContext: window.isSecureContext,
    mediaDevicesAvailable: Boolean(navigator.mediaDevices?.getUserMedia),
    speechRecognitionAvailable: Boolean(getSpeechRecognitionCtor()),
    origin: window.location.origin,
    topLevelFrame: window.self === window.top,
    permissionsPolicyMicrophone: readPermissionsPolicyMicrophone(),
    permissionsQueryState: "not queried",
    audioInputDevices: "not enumerated",
    lastGetUserMediaResult: "not attempted",
    lastSpeechRecognitionError: "none",
    rawMicTestResult: "not run",
  };
}

function isMicPermissionDeniedError(error: unknown): boolean {
  if (error instanceof DOMException) {
    return (
      error.name === "NotAllowedError" || error.name === "PermissionDeniedError"
    );
  }
  return false;
}

function formatGetUserMediaError(error: unknown): string {
  if (error instanceof DOMException) {
    const constraint =
      "constraint" in error && error.constraint
        ? ` constraint=${String(error.constraint)}`
        : "";
    return `${error.name}: ${error.message}${constraint}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export function VoiceMode({ briefing }: { briefing: JarvisBriefing }) {
  const [voiceState, setVoiceState] = useState<VoiceState>("off");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [answer, setAnswer] = useState("");
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [micDeniedDespiteSitePermission, setMicDeniedDespiteSitePermission] =
    useState(false);
  const [speechRecognitionError, setSpeechRecognitionError] = useState<
    string | null
  >(null);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [ttsTesting, setTtsTesting] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [debugInfo, setDebugInfo] = useState<VoiceDebugInfo>(INITIAL_DEBUG);
  const [rawMicTesting, setRawMicTesting] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const voiceActiveRef = useRef(false);
  const processingRef = useRef(false);
  const pendingTranscriptRef = useRef("");
  const briefingRef = useRef(briefing);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speakSessionRef = useRef(0);
  const startListeningRef = useRef<() => void>(() => {});

  briefingRef.current = briefing;

  const refreshEnvironmentDebug = useCallback(async () => {
    const [permissionsQueryState, audioInputDevices] = await Promise.all([
      queryMicrophonePermission(),
      enumerateAudioInputs(),
    ]);
    setDebugInfo((prev) => ({
      ...readDebugSnapshot(),
      permissionsQueryState,
      audioInputDevices,
      lastGetUserMediaResult: prev.lastGetUserMediaResult,
      lastSpeechRecognitionError: prev.lastSpeechRecognitionError,
      rawMicTestResult: prev.rawMicTestResult,
    }));
  }, []);

  const clearRestartTimer = useCallback(() => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  }, []);

  const scheduleAutoListen = useCallback((delayMs: number) => {
    clearRestartTimer();
    restartTimerRef.current = setTimeout(() => {
      restartTimerRef.current = null;
      if (voiceActiveRef.current && !processingRef.current) {
        startListeningRef.current();
      }
    }, delayMs);
  }, [clearRestartTimer]);

  useEffect(() => {
    const supported = Boolean(getSpeechRecognitionCtor());
    setSpeechSupported(supported);
    setDebugInfo(readDebugSnapshot());
    void refreshEnvironmentDebug();
  }, [refreshEnvironmentDebug]);

  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  const stopRecognition = useCallback(() => {
    try {
      recognitionRef.current?.abort();
    } catch {
      /* ignore */
    }
    recognitionRef.current = null;
  }, []);

  const clearVoiceErrors = useCallback(() => {
    setMicPermissionDenied(false);
    setMicDeniedDespiteSitePermission(false);
    setSpeechRecognitionError(null);
    setStatusNote(null);
    setTtsError(null);
    setDebugInfo((prev) => ({
      ...prev,
      lastSpeechRecognitionError: "none",
    }));
  }, []);

  const stopVoiceMode = useCallback(() => {
    voiceActiveRef.current = false;
    processingRef.current = false;
    pendingTranscriptRef.current = "";
    speakSessionRef.current += 1;
    clearRestartTimer();
    stopRecognition();
    cleanupAudio();
    setVoiceState("off");
    setInterimTranscript("");
    clearVoiceErrors();
  }, [cleanupAudio, clearRestartTimer, clearVoiceErrors, stopRecognition]);

  const stopSpeaking = useCallback(() => {
    speakSessionRef.current += 1;
    cleanupAudio();
    if (voiceActiveRef.current) {
      setVoiceState("ready");
    }
  }, [cleanupAudio]);

  const playTtsBlob = useCallback(
    async (blob: Blob, sessionId: number): Promise<void> => {
      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;

      await new Promise<void>((resolve, reject) => {
        const finish = () => {
          if (sessionId !== speakSessionRef.current) {
            resolve();
            return;
          }
          resolve();
        };
        audio.onended = finish;
        audio.onerror = () => {
          if (sessionId !== speakSessionRef.current) {
            resolve();
            return;
          }
          reject(new Error("Audio playback failed"));
        };
        void audio.play().catch((err) => {
          if (sessionId !== speakSessionRef.current) {
            resolve();
            return;
          }
          reject(err);
        });
      });
    },
    []
  );

  const requestTts = useCallback(
    async (payload: { text?: string; test?: boolean }): Promise<Blob> => {
      const res = await fetch("/api/jarvis/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(json.error ?? `ElevenLabs TTS failed (${res.status})`);
      }

      return res.blob();
    },
    []
  );

  const testElevenLabsTts = useCallback(async () => {
    const sessionId = speakSessionRef.current + 1;
    speakSessionRef.current = sessionId;
    setTtsTesting(true);
    setTtsError(null);
    cleanupAudio();

    try {
      const blob = await requestTts({ test: true });
      if (sessionId !== speakSessionRef.current) return;
      await playTtsBlob(blob, sessionId);
      setStatusNote("ElevenLabs test playback succeeded.");
    } catch (error) {
      if (sessionId !== speakSessionRef.current) return;
      const message =
        error instanceof Error ? error.message : "ElevenLabs test failed";
      setTtsError(message);
    } finally {
      if (sessionId === speakSessionRef.current) {
        cleanupAudio();
      }
      setTtsTesting(false);
    }
  }, [cleanupAudio, playTtsBlob, requestTts]);

  const speakAnswer = useCallback(
    async (text: string): Promise<void> => {
      const sessionId = speakSessionRef.current + 1;
      speakSessionRef.current = sessionId;

      cleanupAudio();
      setTtsError(null);
      setVoiceState("speaking");

      try {
        const blob = await requestTts({ text: trimForTts(text) });

        if (sessionId !== speakSessionRef.current) return;

        await playTtsBlob(blob, sessionId);
      } catch (error) {
        if (sessionId !== speakSessionRef.current) return;
        const message =
          error instanceof Error ? error.message : "Voice playback failed";
        setTtsError(message);
      } finally {
        if (sessionId === speakSessionRef.current) {
          cleanupAudio();
        }
      }
    },
    [cleanupAudio, playTtsBlob, requestTts]
  );

  const processQuestion = useCallback(
    async (question: string) => {
      if (!question.trim()) {
        setStatusNote("No speech detected. Try again.");
        if (voiceActiveRef.current) setVoiceState("ready");
        return;
      }

      processingRef.current = true;
      setVoiceState("thinking");
      setFinalTranscript(question);
      setInterimTranscript("");
      setStatusNote(null);

      const voiceAnswer = answerJarvisQuestionForVoice(
        briefingRef.current,
        question
      );
      setAnswer(voiceAnswer);

      await speakAnswer(voiceAnswer);
      processingRef.current = false;

      if (voiceActiveRef.current) {
        setVoiceState("ready");
        pendingTranscriptRef.current = "";
        scheduleAutoListen(400);
      }
    },
    [scheduleAutoListen, speakAnswer]
  );

  const runRawMicrophoneTest = useCallback(async () => {
    setRawMicTesting(true);
    clearVoiceErrors();

    setDebugInfo((prev) => ({
      ...prev,
      rawMicTestResult: "requesting…",
      lastGetUserMediaResult: "raw test: requesting…",
    }));

    if (!navigator.mediaDevices?.getUserMedia) {
      const message = "mediaDevices.getUserMedia is not available";
      setDebugInfo((prev) => ({
        ...prev,
        rawMicTestResult: message,
        lastGetUserMediaResult: `raw test: ${message}`,
      }));
      setStatusNote(message);
      setRawMicTesting(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const trackInfo = stream
        .getAudioTracks()
        .map((t) => `${t.label || "unlabelled"} (${t.readyState})`)
        .join("; ");
      stream.getTracks().forEach((track) => track.stop());

      const audioInputDevices = await enumerateAudioInputs();
      const permissionsQueryState = await queryMicrophonePermission();
      const success = `granted — tracks: ${trackInfo || "none"}`;

      setMicPermissionDenied(false);
      setMicDeniedDespiteSitePermission(false);
      setDebugInfo((prev) => ({
        ...prev,
        rawMicTestResult: success,
        lastGetUserMediaResult: `raw test: ${success}`,
        audioInputDevices,
        permissionsQueryState,
        permissionsPolicyMicrophone: readPermissionsPolicyMicrophone(),
      }));
      setStatusNote("Raw microphone test succeeded.");
    } catch (error) {
      const formatted = formatGetUserMediaError(error);
      const permissionsQueryState = await queryMicrophonePermission();
      const policyBlocked =
        readPermissionsPolicyMicrophone().startsWith("blocked");

      setDebugInfo((prev) => ({
        ...prev,
        rawMicTestResult: formatted,
        lastGetUserMediaResult: `raw test: ${formatted}`,
        permissionsQueryState,
        permissionsPolicyMicrophone: readPermissionsPolicyMicrophone(),
      }));

      if (isMicPermissionDeniedError(error)) {
        setMicPermissionDenied(true);
        if (permissionsQueryState === "granted" || policyBlocked) {
          setMicDeniedDespiteSitePermission(true);
        }
      } else {
        setStatusNote(`Raw microphone test failed: ${formatted}`);
      }
    } finally {
      setRawMicTesting(false);
    }
  }, [clearVoiceErrors]);

  const requestMicrophoneAccess = useCallback(async (): Promise<boolean> => {
    setDebugInfo((prev) => ({
      ...readDebugSnapshot(),
      lastGetUserMediaResult: "requesting…",
      lastSpeechRecognitionError: prev.lastSpeechRecognitionError,
      rawMicTestResult: prev.rawMicTestResult,
    }));

    if (!navigator.mediaDevices?.getUserMedia) {
      const message = "mediaDevices.getUserMedia is not available";
      setDebugInfo((prev) => ({
        ...prev,
        lastGetUserMediaResult: message,
      }));
      setStatusNote(message);
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());

      const audioInputDevices = await enumerateAudioInputs();
      const permissionsQueryState = await queryMicrophonePermission();

      setMicPermissionDenied(false);
      setMicDeniedDespiteSitePermission(false);
      setDebugInfo((prev) => ({
        ...prev,
        lastGetUserMediaResult: "granted (tracks released)",
        audioInputDevices,
        permissionsQueryState,
        permissionsPolicyMicrophone: readPermissionsPolicyMicrophone(),
      }));
      return true;
    } catch (error) {
      const formatted = formatGetUserMediaError(error);
      const permissionsQueryState = await queryMicrophonePermission();
      const policyBlocked =
        readPermissionsPolicyMicrophone().startsWith("blocked");

      setDebugInfo((prev) => ({
        ...prev,
        lastGetUserMediaResult: formatted,
        permissionsQueryState,
        permissionsPolicyMicrophone: readPermissionsPolicyMicrophone(),
      }));

      if (isMicPermissionDeniedError(error)) {
        setMicPermissionDenied(true);
        if (permissionsQueryState === "granted" || policyBlocked) {
          setMicDeniedDespiteSitePermission(true);
        }
        return false;
      }

      setStatusNote(`Microphone access failed: ${formatted}`);
      return false;
    }
  }, []);

  const startListening = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor || !voiceActiveRef.current || processingRef.current) return;

    stopRecognition();
    pendingTranscriptRef.current = "";
    setSpeechRecognitionError(null);

    const recognition = new Ctor();
    recognition.lang = "en-GB";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionResultEvent) => {
      let interim = "";
      let final = "";
      for (let i = 0; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? "";
        if (result.isFinal) final += text;
        else interim += text;
      }
      if (interim) setInterimTranscript(interim.trim());
      if (final) {
        const trimmed = final.trim();
        pendingTranscriptRef.current = trimmed;
        setFinalTranscript(trimmed);
        setInterimTranscript("");
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "aborted") return;

      const detail = event.message
        ? `${event.error}: ${event.message}`
        : event.error;

      setDebugInfo((prev) => ({
        ...prev,
        lastSpeechRecognitionError: detail,
      }));

      if (event.error === "no-speech") {
        setStatusNote("No speech detected. Try speaking again.");
      } else if (event.error === "not-allowed") {
        setSpeechRecognitionError(
          "Speech recognition failed: microphone blocked for speech recognition (not getUserMedia)."
        );
      } else {
        setSpeechRecognitionError(`Speech recognition failed: ${detail}`);
      }

      if (voiceActiveRef.current && !processingRef.current) {
        setVoiceState("ready");
      }
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      if (!voiceActiveRef.current || processingRef.current) return;

      const text = pendingTranscriptRef.current.trim();
      if (text) {
        pendingTranscriptRef.current = "";
        void processQuestion(text);
      } else {
        setStatusNote((prev) => prev ?? "No speech detected. Try again.");
        setVoiceState("ready");
        scheduleAutoListen(600);
      }
    };

    recognitionRef.current = recognition;
    setVoiceState("listening");
    setStatusNote(null);
    setTtsError(null);

    try {
      recognition.start();
    } catch (error) {
      const detail =
        error instanceof Error ? error.message : "Could not start recognition";
      setSpeechRecognitionError(`Speech recognition failed: ${detail}`);
      setDebugInfo((prev) => ({
        ...prev,
        lastSpeechRecognitionError: detail,
      }));
      setVoiceState("ready");
    }
  }, [processQuestion, scheduleAutoListen, stopRecognition]);

  startListeningRef.current = startListening;

  const startVoiceMode = useCallback(async () => {
    if (!getSpeechRecognitionCtor()) return;

    clearVoiceErrors();
    setAnswer("");
    setFinalTranscript("");
    setInterimTranscript("");
    pendingTranscriptRef.current = "";

    const micOk = await requestMicrophoneAccess();
    if (!micOk) return;

    voiceActiveRef.current = true;
    setVoiceState("ready");
    startListening();
  }, [clearVoiceErrors, requestMicrophoneAccess, startListening]);

  const retryMicrophone = useCallback(() => {
    if (voiceActiveRef.current) {
      stopRecognition();
    } else {
      voiceActiveRef.current = false;
    }
    clearVoiceErrors();
    void startVoiceMode();
  }, [clearVoiceErrors, startVoiceMode, stopRecognition]);

  useEffect(() => {
    return () => {
      voiceActiveRef.current = false;
      speakSessionRef.current += 1;
      clearRestartTimer();
      stopRecognition();
      cleanupAudio();
    };
  }, [cleanupAudio, clearRestartTimer, stopRecognition]);

  const primaryLabel =
    voiceState === "off"
      ? "Start Voice Mode"
      : voiceState === "listening"
        ? "Listening..."
        : voiceState === "thinking"
          ? "Thinking..."
          : voiceState === "speaking"
            ? "Speaking..."
            : "Ready";

  const displayTranscript = interimTranscript || finalTranscript;
  const showRetry =
    micPermissionDenied ||
    Boolean(speechRecognitionError) ||
    debugInfo.lastGetUserMediaResult.startsWith("NotAllowed") ||
    debugInfo.lastGetUserMediaResult.includes("PermissionDenied") ||
    debugInfo.rawMicTestResult.startsWith("NotAllowed");

  return (
    <div className="jarvis-glass mt-4 rounded-xl border border-violet-500/20 p-5">
      <div className="mb-4 flex items-center gap-2">
        <Mic className="h-5 w-5 text-violet-400" strokeWidth={1.5} />
        <h3 className="font-display text-lg font-semibold text-white">Voice Mode</h3>
      </div>

      {!speechSupported && (
        <p className="mb-4 text-sm text-amber-300/90">
          Voice mode requires Chrome or a browser with speech recognition support.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {voiceState === "off" ? (
          <button
            type="button"
            disabled={!speechSupported}
            onClick={() => void startVoiceMode()}
            className="inline-flex items-center gap-2 rounded-lg bg-violet-900/60 px-4 py-2.5 text-sm font-medium text-violet-100 hover:bg-violet-800/60 disabled:opacity-50"
          >
            <Mic className="h-4 w-4" />
            Start Voice Mode
          </button>
        ) : (
          <>
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 rounded-lg bg-violet-950/80 px-4 py-2.5 text-sm font-medium text-violet-200 opacity-90"
            >
              {voiceState === "speaking" ? (
                <Volume2 className="h-4 w-4 animate-pulse" />
              ) : voiceState === "listening" ? (
                <Mic className="h-4 w-4 animate-pulse" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
              {primaryLabel}
            </button>
            <button
              type="button"
              onClick={stopVoiceMode}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5"
            >
              <MicOff className="h-4 w-4" />
              Stop Voice Mode
            </button>
            {voiceState === "speaking" && (
              <button
                type="button"
                onClick={stopSpeaking}
                className="inline-flex items-center gap-2 rounded-lg border border-amber-500/30 px-4 py-2.5 text-sm text-amber-200 hover:bg-amber-950/30"
              >
                <VolumeX className="h-4 w-4" />
                Stop speaking
              </button>
            )}
          </>
        )}
        <button
          type="button"
          disabled={rawMicTesting}
          onClick={() => void runRawMicrophoneTest()}
          className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 px-4 py-2.5 text-sm text-cyan-200 hover:bg-cyan-950/40 disabled:opacity-50"
        >
          <Mic className="h-4 w-4" />
          {rawMicTesting ? "Testing mic…" : "Test raw microphone"}
        </button>
        <button
          type="button"
          disabled={ttsTesting}
          onClick={() => void testElevenLabsTts()}
          className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 px-4 py-2.5 text-sm text-emerald-200 hover:bg-emerald-950/40 disabled:opacity-50"
        >
          <Volume2 className="h-4 w-4" />
          {ttsTesting ? "Testing TTS…" : "Test ElevenLabs TTS"}
        </button>
        {showRetry && (
          <button
            type="button"
            onClick={retryMicrophone}
            className="inline-flex items-center gap-2 rounded-lg border border-violet-500/40 px-4 py-2.5 text-sm text-violet-200 hover:bg-violet-950/40"
          >
            <Mic className="h-4 w-4" />
            Retry microphone
          </button>
        )}
      </div>

      {micDeniedDespiteSitePermission && (
        <p className="mt-3 text-sm text-amber-300/90">
          {NOT_ALLOWED_DESPITE_SITE_PERMISSION}
        </p>
      )}
      {micPermissionDenied && !micDeniedDespiteSitePermission && (
        <p className="mt-3 text-sm text-amber-300/90">
          Microphone permission denied. Allow mic access in Chrome site settings and
          try again.
        </p>
      )}
      {speechRecognitionError && (
        <p className="mt-3 text-sm text-amber-300/90">{speechRecognitionError}</p>
      )}
      {statusNote && !micPermissionDenied && (
        <p className="mt-3 text-sm text-amber-300/90">{statusNote}</p>
      )}
      {ttsError && (
        <div className="mt-3 rounded-lg border border-red-500/30 bg-red-950/20 p-3 text-sm text-red-200/90">
          <p className="mb-1 font-medium text-red-200">ElevenLabs TTS error</p>
          <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-red-200/80">
            {ttsError}
          </pre>
          <p className="mt-2 text-xs text-red-300/70">
            Text answer is still shown below.
          </p>
        </div>
      )}

      {(micPermissionDenied || micDeniedDespiteSitePermission) && (
        <ul className="mt-3 list-inside list-disc text-xs text-slate-400">
          {MIC_TROUBLESHOOTING.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      )}

      {voiceState !== "off" && (
        <div className="mt-4 rounded-lg border border-white/10 bg-black/30 p-4">
          <p className="mb-1 text-xs uppercase tracking-widest text-slate-500">
            You said
          </p>
          <p className="min-h-[1.25rem] text-sm text-slate-200">
            {displayTranscript || (
              <span className="text-slate-500">Waiting for speech…</span>
            )}
          </p>
        </div>
      )}

      {answer && (
        <div className="mt-4 rounded-lg border border-violet-500/20 bg-violet-950/20 p-4">
          <p className="mb-1 text-xs uppercase tracking-widest text-violet-400/80">
            Jarvis
          </p>
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">
            {answer}
          </p>
        </div>
      )}

      <div className="mt-4 rounded-lg border border-white/5 bg-black/20 p-3 font-mono text-[11px] leading-relaxed text-slate-500">
        <p>origin: {debugInfo.origin || "—"}</p>
        <p>top-level frame: {debugInfo.topLevelFrame ? "yes" : "no (iframe)"}</p>
        <p>secure context: {debugInfo.secureContext ? "yes" : "no"}</p>
        <p>mediaDevices available: {debugInfo.mediaDevicesAvailable ? "yes" : "no"}</p>
        <p>
          SpeechRecognition available:{" "}
          {debugInfo.speechRecognitionAvailable ? "yes" : "no"}
        </p>
        <p>Permissions-Policy microphone: {debugInfo.permissionsPolicyMicrophone}</p>
        <p>permissions.query(microphone): {debugInfo.permissionsQueryState}</p>
        <p>audio inputs: {debugInfo.audioInputDevices}</p>
        <p>raw mic test: {debugInfo.rawMicTestResult}</p>
        <p>last getUserMedia result: {debugInfo.lastGetUserMediaResult}</p>
        <p>last SpeechRecognition error: {debugInfo.lastSpeechRecognitionError}</p>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Speech-to-text uses your browser (free). Jarvis speaks via ElevenLabs after
        each question. Try: &quot;What are my highest ROI tasks today?&quot;
      </p>
    </div>
  );
}

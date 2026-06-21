"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import type { JarvisBriefing } from "@/lib/jarvis/types";
import {
  answerJarvisQuestionForVoice,
  trimForTts,
} from "@/lib/jarvis/ask-jarvis-voice";

type VoiceState = "off" | "listening" | "thinking" | "speaking" | "ready";

function getSpeechRecognitionCtor():
  | (new () => SpeechRecognitionInstance)
  | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

export function VoiceMode({ briefing }: { briefing: JarvisBriefing }) {
  const [voiceState, setVoiceState] = useState<VoiceState>("off");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [answer, setAnswer] = useState("");
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);

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
    setSpeechSupported(Boolean(getSpeechRecognitionCtor()));
  }, []);

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
    setStatusNote(null);
    setTtsError(null);
  }, [cleanupAudio, clearRestartTimer, stopRecognition]);

  const stopSpeaking = useCallback(() => {
    speakSessionRef.current += 1;
    cleanupAudio();
    if (voiceActiveRef.current) {
      setVoiceState("ready");
    }
  }, [cleanupAudio]);

  const speakAnswer = useCallback(
    async (text: string): Promise<void> => {
      const sessionId = speakSessionRef.current + 1;
      speakSessionRef.current = sessionId;

      cleanupAudio();
      setTtsError(null);
      setVoiceState("speaking");

      try {
        const res = await fetch("/api/jarvis/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: trimForTts(text) }),
        });

        if (sessionId !== speakSessionRef.current) return;

        if (!res.ok) {
          const json = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(json.error ?? "Voice playback failed");
        }

        const blob = await res.blob();
        if (sessionId !== speakSessionRef.current) return;

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
    [cleanupAudio]
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

  const startListening = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor || !voiceActiveRef.current || processingRef.current) return;

    stopRecognition();
    pendingTranscriptRef.current = "";

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
      if (event.error === "no-speech") {
        setStatusNote("No speech detected. Try speaking again.");
      } else if (event.error !== "aborted") {
        setStatusNote(`Speech recognition error: ${event.error}`);
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
    } catch {
      setStatusNote("Could not start microphone. Check browser permissions.");
      setVoiceState("ready");
    }
  }, [processQuestion, scheduleAutoListen, stopRecognition]);

  startListeningRef.current = startListening;

  const startVoiceMode = useCallback(async () => {
    if (!getSpeechRecognitionCtor()) return;

    setStatusNote(null);
    setTtsError(null);
    setAnswer("");
    setFinalTranscript("");
    setInterimTranscript("");
    pendingTranscriptRef.current = "";

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setStatusNote("Microphone permission denied. Allow mic access and try again.");
      return;
    }

    voiceActiveRef.current = true;
    setVoiceState("ready");
    startListening();
  }, [startListening]);

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
      </div>

      {statusNote && (
        <p className="mt-3 text-sm text-amber-300/90">{statusNote}</p>
      )}
      {ttsError && (
        <p className="mt-3 text-sm text-red-300/90">
          {ttsError} — text answer is still shown below.
        </p>
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

      <p className="mt-4 text-xs text-slate-500">
        Speech-to-text uses your browser (free). Jarvis speaks via ElevenLabs after
        each question. Try: &quot;What are my highest ROI tasks today?&quot;
      </p>
    </div>
  );
}

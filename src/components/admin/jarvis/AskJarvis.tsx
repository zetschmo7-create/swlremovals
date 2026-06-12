"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import type { JarvisBriefing } from "@/lib/jarvis/types";
import { answerJarvisQuestion } from "@/lib/jarvis/ask-jarvis";

const SUGGESTIONS = [
  "How much did we spend on CMM this week?",
  "How much commission is due this Friday?",
  "Which postcode is most profitable?",
  "Which quotes were accepted but not deposit paid?",
  "How many CMM leads came from GU this week?",
  "Which jobs have deposit receipts but unknown values?",
];

export function AskJarvis({ briefing }: { briefing: JarvisBriefing }) {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  function submit(q: string) {
    setQuery(q);
    setAnswer(answerJarvisQuestion(briefing, q));
  }

  return (
    <div className="jarvis-glass rounded-xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-cyan-400" strokeWidth={1.5} />
        <h3 className="font-display text-lg font-semibold text-white">
          Ask Jarvis
        </h3>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(query);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask Jarvis…"
          className="flex-1 rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-cyan-500/40 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-cyan-900/60 px-4 py-2.5 text-sm font-medium text-cyan-100 hover:bg-cyan-800/60"
        >
          Ask
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => submit(s)}
            className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400 hover:border-cyan-500/30 hover:text-cyan-200"
          >
            {s}
          </button>
        ))}
      </div>
      {answer && (
        <div className="mt-4 rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-4">
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

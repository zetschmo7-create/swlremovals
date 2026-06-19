"use client";

import { useState } from "react";
import type { JarvisBriefing } from "@/lib/jarvis/types";
import { AskJarvis } from "./AskJarvis";
import { SalesGptPanel } from "./SalesGptPanel";

type AssistantMode = "analytics" | "sales";

export function JarvisAssistant({ briefing }: { briefing: JarvisBriefing }) {
  const [mode, setMode] = useState<AssistantMode>("analytics");

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("analytics")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "analytics"
              ? "bg-cyan-900/60 text-cyan-100"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          Analytics
        </button>
        <button
          type="button"
          onClick={() => setMode("sales")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "sales"
              ? "bg-emerald-900/60 text-emerald-100"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          Sales GPT
        </button>
      </div>
      {mode === "analytics" ? (
        <AskJarvis briefing={briefing} />
      ) : (
        <SalesGptPanel briefing={briefing} />
      )}
    </div>
  );
}

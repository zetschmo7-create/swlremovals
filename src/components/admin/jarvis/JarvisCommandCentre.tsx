"use client";

import { useState } from "react";
import type { JarvisBriefing } from "@/lib/jarvis/types";
import { JarvisHomeView } from "./JarvisHomeView";
import { JarvisFullAnalytics } from "./JarvisFullAnalytics";
import { ChevronDown } from "lucide-react";

export function JarvisCommandCentre({
  briefing,
  onSettingsSaved,
}: {
  briefing: JarvisBriefing;
  onSettingsSaved: () => void;
}) {
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  return (
    <>
      <JarvisHomeView briefing={briefing} />

      <div className="mt-8">
        <button
          type="button"
          onClick={() => setAnalyticsOpen((o) => !o)}
          className="jarvis-glass flex w-full items-center justify-between rounded-xl px-5 py-4 text-left transition-colors hover:border-cyan-500/25"
        >
          <div>
            <p className="font-display text-lg font-semibold text-white">
              Full Analytics
            </p>
            <p className="text-sm text-slate-500">
              30-day revenue, ROI, lead tracker, charts & all task queues
            </p>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-slate-400 transition-transform ${analyticsOpen ? "rotate-180" : ""}`}
          />
        </button>

        {analyticsOpen && (
          <JarvisFullAnalytics
            briefing={briefing}
            onSettingsSaved={onSettingsSaved}
          />
        )}
      </div>
    </>
  );
}

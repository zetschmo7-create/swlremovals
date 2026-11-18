"use client";

import { useEffect } from "react";
import { captureAttributionOnLanding } from "@/lib/attribution";

/** First-touch UTM / click-id capture for MoveFlow website leads. */
export function AttributionCapture() {
  useEffect(() => {
    captureAttributionOnLanding();
  }, []);

  return null;
}

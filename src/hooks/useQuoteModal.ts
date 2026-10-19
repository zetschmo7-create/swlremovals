"use client";

import { useContext } from "react";
import { QuoteModalContext } from "@/context/QuoteModalContext";

export function useQuoteModal() {
  const context = useContext(QuoteModalContext);
  if (!context) {
    throw new Error("useQuoteModal must be used within QuoteModalProvider");
  }
  return context;
}

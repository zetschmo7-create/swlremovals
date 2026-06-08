"use client";

import { useContext } from "react";
import { MoveFlowModalContext } from "@/context/MoveFlowModalContext";

export function useMoveFlowModal() {
  const context = useContext(MoveFlowModalContext);
  if (!context) {
    throw new Error("useMoveFlowModal must be used within MoveFlowModalProvider");
  }
  return context;
}

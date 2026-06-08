"use client";

import { useMoveFlowModal } from "@/hooks/useMoveFlowModal";
import { type MouseEvent, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  "aria-label"?: string;
};

export function QuoteTrigger({
  children,
  className = "",
  onClick,
  "aria-label": ariaLabel,
}: Props) {
  const { openQuoteModal } = useMoveFlowModal();

  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      onClick={(event) => {
        onClick?.(event);
        openQuoteModal();
      }}
    >
      {children}
    </button>
  );
}

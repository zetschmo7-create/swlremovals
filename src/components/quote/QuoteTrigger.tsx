"use client";

import { useQuoteModal } from "@/hooks/useQuoteModal";
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
  const { openQuoteModal } = useQuoteModal();

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

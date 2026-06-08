"use client";

import { Button } from "@/components/ui/Button";
import { useMoveFlowModal } from "@/hooks/useMoveFlowModal";
import { type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "whatsapp" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type Props = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function QuoteButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled,
}: Props) {
  const { openQuoteModal } = useMoveFlowModal();

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      type={type}
      disabled={disabled}
      onClick={openQuoteModal}
    >
      {children}
    </Button>
  );
}

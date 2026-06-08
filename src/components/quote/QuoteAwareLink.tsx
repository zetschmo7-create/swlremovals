"use client";

import Link from "next/link";
import { useMoveFlowModal } from "@/hooks/useMoveFlowModal";
import { type ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function QuoteAwareLink({ href, children, className }: Props) {
  const { openQuoteModal } = useMoveFlowModal();

  if (href === "/quote") {
    return (
      <button type="button" className={className} onClick={openQuoteModal}>
        {children}
      </button>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

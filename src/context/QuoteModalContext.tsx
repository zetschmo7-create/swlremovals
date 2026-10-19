"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";

const EnquiryQuoteModal = dynamic(
  () =>
    import("@/components/quote/EnquiryQuoteModal").then(
      (mod) => mod.EnquiryQuoteModal
    ),
  { ssr: false }
);

type QuoteModalContextValue = {
  isOpen: boolean;
  openQuoteModal: () => void;
  closeQuoteModal: () => void;
};

export const QuoteModalContext =
  createContext<QuoteModalContextValue | null>(null);

/** @deprecated Use QuoteModalContext — kept as alias during rename */
export const MoveFlowModalContext = QuoteModalContext;

export function QuoteModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openQuoteModal = useCallback(() => setIsOpen(true), []);
  const closeQuoteModal = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, openQuoteModal, closeQuoteModal }),
    [isOpen, openQuoteModal, closeQuoteModal]
  );

  return (
    <QuoteModalContext.Provider value={value}>
      {children}
      {isOpen ? (
        <EnquiryQuoteModal isOpen={isOpen} onClose={closeQuoteModal} />
      ) : null}
    </QuoteModalContext.Provider>
  );
}

/** @deprecated Use QuoteModalProvider */
export const MoveFlowModalProvider = QuoteModalProvider;

"use client";

import dynamic from "next/dynamic";
import { trackLeadInteraction } from "@/lib/lead-tracking";
import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const MoveFlowQuoteModal = dynamic(
  () =>
    import("@/components/quote/MoveFlowQuoteModal").then(
      (mod) => mod.MoveFlowQuoteModal
    ),
  { ssr: false }
);

type MoveFlowModalContextValue = {
  isOpen: boolean;
  openQuoteModal: () => void;
  closeQuoteModal: () => void;
};

export const MoveFlowModalContext =
  createContext<MoveFlowModalContextValue | null>(null);

export function MoveFlowModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openQuoteModal = useCallback(() => {
    trackLeadInteraction("quote_form_open", "moveflow_modal");
    setIsOpen(true);
  }, []);
  const closeQuoteModal = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, openQuoteModal, closeQuoteModal }),
    [isOpen, openQuoteModal, closeQuoteModal]
  );

  return (
    <MoveFlowModalContext.Provider value={value}>
      {children}
      {isOpen ? <MoveFlowQuoteModal isOpen={isOpen} onClose={closeQuoteModal} /> : null}
    </MoveFlowModalContext.Provider>
  );
}

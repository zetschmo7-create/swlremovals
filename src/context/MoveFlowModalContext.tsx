"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MoveFlowQuoteModal } from "@/components/quote/MoveFlowQuoteModal";

type MoveFlowModalContextValue = {
  isOpen: boolean;
  openQuoteModal: () => void;
  closeQuoteModal: () => void;
};

export const MoveFlowModalContext =
  createContext<MoveFlowModalContextValue | null>(null);

export function MoveFlowModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openQuoteModal = useCallback(() => setIsOpen(true), []);
  const closeQuoteModal = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, openQuoteModal, closeQuoteModal }),
    [isOpen, openQuoteModal, closeQuoteModal]
  );

  return (
    <MoveFlowModalContext.Provider value={value}>
      {children}
      <MoveFlowQuoteModal isOpen={isOpen} onClose={closeQuoteModal} />
    </MoveFlowModalContext.Provider>
  );
}

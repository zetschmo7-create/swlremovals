"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type FAQItem = {
  question: string;
  answer: string;
};

type Props = {
  items: FAQItem[];
  light?: boolean;
};

export function FAQ({ items, light }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.question}
            className={`rounded-2xl border overflow-hidden ${light ? "border-white/10 bg-white/5" : "border-border bg-white"}`}
          >
            <button
              type="button"
              className={`w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left transition-colors ${light ? "hover:bg-white/5" : "hover:bg-cream"}`}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <span
                className={`font-medium text-base md:text-lg pr-4 ${light ? "text-white" : "text-charcoal"}`}
              >
                {item.question}
              </span>
              <ChevronDown
                className={`shrink-0 w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""} ${light ? "text-white/60" : "text-charcoal-muted"}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div
                    className={`px-5 md:px-6 pb-5 md:pb-6 text-base leading-relaxed ${light ? "text-white/70" : "text-charcoal-light"}`}
                  >
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

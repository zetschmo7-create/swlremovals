import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
};

export function Card({ children, className = "", hover = true }: Props) {
  return (
    <div
      className={`bg-white rounded-2xl border border-border p-6 md:p-8 shadow-[var(--shadow-soft)] ${hover ? "transition-all duration-300 hover:shadow-[var(--shadow-card)] hover:-translate-y-0.5" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

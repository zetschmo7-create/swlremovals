import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { type ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, description, children }: Props) {
  return (
    <section className="relative bg-green-900 pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="absolute inset-0 bg-gradient-to-br from-green-950 to-green-800" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <FadeIn>
          {eyebrow && (
            <p className="text-green-500 text-sm font-medium tracking-widest uppercase mb-4">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-tight max-w-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-6 text-lg text-white/70 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </FadeIn>
      </div>
    </section>
  );
}

import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
};

export function Section({ children, className = "", id, dark }: Props) {
  return (
    <section
      id={id}
      className={`section-padding ${dark ? "bg-green-900 text-white" : ""} ${className}`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  light?: boolean;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  light,
  align = "left",
  className = "",
  titleClassName = "",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";

  return (
    <div className={`mb-12 md:mb-16 max-w-2xl ${alignClass} ${className}`}>
      {eyebrow && (
        <p
          className={`text-sm font-medium tracking-widest uppercase mb-3 ${light ? "text-green-500" : "text-green-700"}`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight ${light ? "text-white" : "text-charcoal"} ${titleClassName}`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-lg leading-relaxed ${light ? "text-white/70" : "text-charcoal-light"}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

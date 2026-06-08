import Link from "next/link";
import { type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "whatsapp" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-green-800 text-white hover:bg-green-900 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)]",
  secondary:
    "bg-white text-green-800 border border-border hover:bg-cream-dark shadow-[var(--shadow-soft)]",
  outline:
    "bg-transparent text-white border border-white/30 hover:bg-white/10",
  whatsapp:
    "bg-[#25D366] text-white hover:bg-[#1fb855] shadow-[var(--shadow-soft)]",
  ghost: "bg-transparent text-charcoal hover:bg-cream-dark",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

type Props = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  external?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  external,
  className = "",
  onClick,
  type = "button",
  disabled,
}: Props) {
  const classes = `inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-300 ease-out ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`;

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

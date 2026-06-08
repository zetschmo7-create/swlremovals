"use client";

import Image from "next/image";
import { SITE_NAME } from "@/lib/constants";
import { IMAGES, LOGO_DISPLAY } from "@/lib/images";

type Props = {
  scrolled: boolean;
  variant?: "header" | "drawer";
};

export function NavLogo({ scrolled, variant = "header" }: Props) {
  const isDrawer = variant === "drawer";

  return (
    <Image
      src={IMAGES.navLogo}
      alt={SITE_NAME}
      width={LOGO_DISPLAY.width}
      height={LOGO_DISPLAY.height}
      priority={!isDrawer}
      sizes={
        isDrawer
          ? "170px"
          : "(max-width: 639px) 170px, (max-width: 1023px) 220px, 300px"
      }
      className={[
        "block object-contain object-left",
        isDrawer
          ? "w-[140px] h-auto"
          : "w-[170px] sm:w-[220px] lg:w-[300px] h-auto",
        scrolled || isDrawer ? "nav-logo--scrolled" : "nav-logo--hero",
      ].join(" ")}
    />
  );
}

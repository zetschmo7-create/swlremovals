/** Central image registry — paths relative to /public */
export const IMAGES = {
  hero: "/images/South West London Removals - Wimbledon House Move Hero.png",
  banner: "/images/sw-london-removals-home-banner.webp.webp",
  logo: "/images/sw-london-removals-logo.webp",
  navLogo: "/images/sw-london-removals-logo.webp",
  mover: "/images/sw-london-removals-mover.webp",
  movingDay: "/images/sw-london-removals-moving-day.png",
  officeMove: "/images/sw-london-removals-office-move-team.webp.png",
  packing: "/images/sw-london-removals-packing-service-dining-room.webp.png",
  storage: "/images/sw-london-removals-storage-yard.webp",
  brand: "/images/South West London Removals.webp",
  favicon: "/images/swlremovals-favicon-512x512.webp",
} as const;

/** Display dimensions for Next/Image — matches largest rendered size (no CLS) */
export const LOGO_DISPLAY = { width: 300, height: 300 } as const;

export type ImageKey = keyof typeof IMAGES;

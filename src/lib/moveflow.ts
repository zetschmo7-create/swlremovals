export const MOVEFLOW_INTAKE_URL =
  "https://moveflow.cloud/intake/sw-london-removals";

export const MOVEFLOW_EMBED_URL =
  "https://moveflow.cloud/embed/sw-london-removals?theme=light&corner=rounded";

export const MOVEFLOW_REVIEWS_URL =
  "https://moveflow.cloud/reviews/sw-london-removals";

export const MOVEFLOW_REVIEWS_IFRAME_SRC =
  "https://moveflow.cloud/widgets/reviews/sw-london-removals?type=badge&theme=light&accent=%230F3D2E&limit=6&source=all&showSources=true&showVerified=true&minRating=0&radius=16";

/** Mobile-compact reviews embed for mobile/tablet */
export const MOVEFLOW_REVIEWS_IFRAME_SRC_MOBILE =
  "https://moveflow.cloud/widgets/reviews/sw-london-removals?type=mobile-compact&theme=light&accent=%230F3D2E&limit=2&bg=transparent&showSources=false&showVerified=true&radius=16";

export const MOVEFLOW_REVIEWS_IFRAME_HEIGHT_DESKTOP = 150;
export const MOVEFLOW_REVIEWS_IFRAME_HEIGHT_MOBILE = 360;

export const MOVEFLOW_SLUG = "sw-london-removals";

/** Selected accreditation badges for the homepage section */
export const MOVEFLOW_ACCREDITATION_BADGES =
  "gold-mover,mover-of-the-year,verified-by-moveflow";

export const MOVEFLOW_BADGES_IFRAME_FALLBACK_HEIGHT = 200;

type BadgeIframeOptions = {
  badges?: string;
  layout?: "row" | "grid" | "strip";
  variant?: string;
  title?: string;
};

export function buildMoveFlowBadgesIframeSrc({
  badges,
  layout = "row",
  variant = "shield-seal",
  title,
}: BadgeIframeOptions = {}) {
  const params = new URLSearchParams({
    variant,
    theme: "light",
    layout,
    bg: "0",
  });

  if (badges) params.set("badges", badges);
  if (title) params.set("title", title);

  return `https://moveflow.cloud/embed/badges/${MOVEFLOW_SLUG}?${params.toString()}`;
}

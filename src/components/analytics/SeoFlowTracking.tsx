import Script from "next/script";

export const SEOFLOW_SITE_ID = "south-west-london-removals";

/**
 * MoveFlow SeoFlow page analytics only — not quotation intake.
 * Website quotes post to /api/enquiry (SMTP). Do not treat this script as a
 * replacement for disabling MoveFlow survey-reminder automations in their dashboard.
 */
export function SeoFlowTracking() {
  return (
    <Script
      src="https://moveflow.cloud/seoflow/track.js"
      strategy="afterInteractive"
      data-site={SEOFLOW_SITE_ID}
    />
  );
}

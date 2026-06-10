import Script from "next/script";

export const SEOFLOW_SITE_ID = "south-west-london-removals";

export function SeoFlowTracking() {
  return (
    <Script
      src="https://moveflow.cloud/seoflow/track.js"
      strategy="afterInteractive"
      data-site={SEOFLOW_SITE_ID}
    />
  );
}

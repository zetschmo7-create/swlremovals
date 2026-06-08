import { createMetadata } from "@/lib/seo";
import { LocationsHub } from "@/components/locations/LocationsHub";
import { getLocationSlugs } from "@/data/locationPages";

const locationCount = getLocationSlugs().length;

export const metadata = createMetadata({
  title: "Areas Covered",
  description:
    `Premium removals across ${locationCount} locations in South West London, Central London, Surrey and commuter towns. Fixed quotes, local access knowledge and insured crews.`,
  path: "/areas-covered",
  keywords: [
    "South West London removals areas",
    "Surrey removals locations",
    "Wimbledon removals coverage",
    "removal company areas",
    "local removals South London",
  ],
});

export default function AreasCoveredPage() {
  return <LocationsHub />;
}

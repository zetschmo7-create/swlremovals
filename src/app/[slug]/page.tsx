import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import {
  getLocationPage,
  getLocationSlugs,
  locationPath,
} from "@/data/locationPages";
import { LocationPageTemplate } from "@/components/templates/LocationPageTemplate";

type Props = {
  params: Promise<{ slug: string }>;
};

function getLocationPageForDisplay(slug: string) {
  const location = getLocationPage(slug);
  if (!location || slug !== "wimbledon-removals") return location;

  return {
    ...location,
    metaTitle: "Wimbledon Removals Company | SW19",
    metaDescription:
      "Looking for a removals company in Wimbledon? We move houses, flats and offices across SW19 and SW20, with fixed quotes and careful access planning.",
    intro:
      "If you need a removals company in Wimbledon, we plan the move around the property and access—not just the distance. Narrow Village lanes, controlled parking near the Common and steep staircases in period homes can all affect the crew, vehicle and timing. We assess your addresses before quoting a fixed price, then protect floors and wrap furniture before loading.",
    recentMoves: [],
  };
}

export function generateStaticParams() {
  return getLocationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const location = getLocationPageForDisplay(slug);
  if (!location) return {};

  return createMetadata({
    title: location.metaTitle,
    description: location.metaDescription,
    path: locationPath(location.slug),
    keywords: [
      `${location.locationName} removals`,
      `removals ${location.locationName}`,
      `house removals ${location.locationName}`,
      ...location.postcodes.map((p) => `removals ${p}`),
    ],
  });
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const location = getLocationPageForDisplay(slug);
  if (!location) notFound();

  return <LocationPageTemplate location={location} />;
}

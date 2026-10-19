import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import {
  getLocationPage,
  getLocationSlugs,
  locationPath,
} from "@/data/locationPages";
import { buildLocationSeoTitle } from "@/lib/locationSeoTitles";
import { LocationPageTemplate } from "@/components/templates/LocationPageTemplate";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getLocationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const location = getLocationPage(slug);
  if (!location) return {};

  return createMetadata({
    title: buildLocationSeoTitle(
      location.slug,
      location.locationName,
      location.postcodes
    ),
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
  const location = getLocationPage(slug);
  if (!location) notFound();

  return <LocationPageTemplate location={location} />;
}

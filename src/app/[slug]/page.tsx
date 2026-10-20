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

function getLocationPageForDisplay(slug: string) {
  const location = getLocationPage(slug);
  if (!location || slug !== "wimbledon-removals") return location;

  return {
    ...location,
    metaTitle: "Wimbledon Removals Company",
    metaDescription:
      "Looking for a removals company in Wimbledon? We move houses, flats and offices across SW19 and SW20, with fixed quotes and careful access planning.",
    intro:
      "If you need a removals company in Wimbledon, we plan around your property, access and moving distance. Narrow Village lanes, controlled parking near the Common and steep staircases in period homes can all affect the crew, vehicle and timing. We assess your addresses before quoting a fixed price, then protect floors and wrap furniture before loading.",
    recentMoves: [],
    faq: [
      ...location.faq,
      {
        question: "What affects the cost of a Wimbledon removal?",
        answer:
          "The amount to move, the journey, stairs or lifts, the distance from the van to the door, packing and furniture dismantling all affect the work involved. Send the collection and delivery addresses, your preferred date and a walkthrough of every room so we can quote for the agreed scope.",
      },
      {
        question: "Should I arrange a parking bay suspension for moving day?",
        answer:
          "Check the restrictions at both addresses and agree who will arrange any suspension before moving day. Merton Council currently requires at least ten full working days for a suspension or yellow line waiver application. Check its current guidance and charges before applying; a resident or visitor permit does not reserve a bay.",
      },
    ],
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
  const location = getLocationPageForDisplay(slug);
  if (!location) notFound();

  return <LocationPageTemplate location={location} />;
}

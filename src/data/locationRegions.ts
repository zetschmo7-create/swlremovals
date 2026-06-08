import {
  getAllLocationPages,
  getLocationSlugs,
  type LocationPageData,
} from "@/data/locationPages";

export type LocationRegion = {
  id: string;
  title: string;
  intro: string;
  slugs: readonly string[];
};

export const LOCATION_REGIONS: LocationRegion[] = [
  {
    id: "south-west-london",
    title: "South West London",
    intro:
      "From Wimbledon and Richmond to Sutton, Greenwich and the Thames-side villages we know every street, permit zone and access challenge.",
    slugs: [
      "wimbledon-removals",
      "raynes-park-removals",
      "putney-removals",
      "wandsworth-removals",
      "clapham-removals",
      "balham-removals",
      "tooting-removals",
      "fulham-removals",
      "richmond-removals",
      "kingston-upon-thames-removals",
      "new-malden-removals",
      "battersea-removals",
      "southfields-removals",
      "earlsfield-removals",
      "sutton-removals",
      "carshalton-removals",
      "mitcham-removals",
      "streatham-removals",
      "brixton-removals",
      "dulwich-removals",
      "herne-hill-removals",
      "chiswick-removals",
      "barnes-removals",
      "kew-removals",
      "twickenham-removals",
      "surbiton-removals",
      "worcester-park-removals",
      "hammersmith-removals",
      "acton-removals",
      "ealing-removals",
      "mortlake-removals",
      "roehampton-removals",
      "east-sheen-removals",
      "west-brompton-removals",
      "vauxhall-removals",
      "caterham-removals",
      "coulsdon-removals",
      "purley-removals",
      "wallington-removals",
      "cheam-removals",
      "morden-removals",
      "norbiton-removals",
      "hampton-removals",
      "teddington-removals",
      "hampton-wick-removals",
      "greenwich-removals",
    ],
  },
  {
    id: "central-london",
    title: "Central London",
    intro:
      "Discreet, careful moves across prime postcodes — mansion flats, terraces and townhouses where access and timing matter.",
    slugs: [
      "chelsea-removals",
      "kensington-removals",
      "pimlico-removals",
      "notting-hill-removals",
      "south-kensington-removals",
      "knightsbridge-removals",
      "belgravia-removals",
      "mayfair-removals",
      "st-johns-wood-removals",
      "maida-vale-removals",
      "hampstead-removals",
      "islington-removals",
      "camden-removals",
    ],
  },
  {
    id: "surrey",
    title: "Surrey",
    intro:
      "County town and market-town moves with fixed pricing for semis, detached homes and executive relocations.",
    slugs: [
      "guildford-removals",
      "woking-removals",
      "epsom-removals",
      "esher-removals",
      "cobham-removals",
      "weybridge-removals",
      "leatherhead-removals",
      "reigate-removals",
      "redhill-removals",
      "dorking-removals",
      "godalming-removals",
      "walton-on-thames-removals",
      "ashtead-removals",
      "banstead-removals",
    ],
  },
  {
    id: "surrey-villages",
    title: "Surrey villages",
    intro:
      "Village lanes, green-belt properties and rural access planned properly from survey to shuttle loading.",
    slugs: [
      "virginia-water-removals",
      "oxshott-removals",
      "claygate-removals",
      "bookham-removals",
      "fetcham-removals",
      "oxted-removals",
      "tadworth-removals",
      "warlingham-removals",
      "chobham-removals",
      "windlesham-removals",
      "lightwater-removals",
      "sunningdale-removals",
      "cranleigh-removals",
      "horsley-removals",
      "east-horsley-removals",
      "west-horsley-removals",
      "ripley-removals",
      "haslemere-removals",
      "hindhead-removals",
      "godstone-removals",
    ],
  },
  {
    id: "commuter-towns",
    title: "Commuter towns",
    intro:
      "Moves along the M3 and A3 corridors for families stepping out of London or relocating between Hampshire and Surrey borders.",
    slugs: [
      "sunbury-on-thames-removals",
      "staines-removals",
      "addlestone-removals",
      "ascot-removals",
      "farnham-removals",
      "farnborough-removals",
      "camberley-removals",
    ],
  },
];

export type GroupedLocation = {
  region: LocationRegion;
  locations: LocationPageData[];
};

function validateRegionCoverage() {
  const allSlugs = new Set(getLocationSlugs());
  const regionSlugs = new Set(LOCATION_REGIONS.flatMap((region) => region.slugs));

  for (const slug of allSlugs) {
    if (!regionSlugs.has(slug)) {
      throw new Error(`Location hub missing region assignment for: ${slug}`);
    }
  }

  for (const slug of regionSlugs) {
    if (!allSlugs.has(slug)) {
      throw new Error(`Location hub references unknown slug: ${slug}`);
    }
  }
}

validateRegionCoverage();

const locationMap = new Map(
  getAllLocationPages().map((location) => [location.slug, location])
);

export function getGroupedLocations(): GroupedLocation[] {
  return LOCATION_REGIONS.map((region) => ({
    region,
    locations: region.slugs
      .map((slug) => locationMap.get(slug))
      .filter((location): location is LocationPageData => location !== undefined),
  }));
}

export function getHubDescriptor(location: LocationPageData): string {
  const firstSentence = location.metaDescription.split(/(?<=[.!?])\s+/)[0];
  return firstSentence.trim();
}

export const AREAS_COVERED_PATH = "/areas-covered";

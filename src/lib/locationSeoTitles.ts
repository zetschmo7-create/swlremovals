/**
 * Confirmed SEO title postcodes for priority location pages.
 * Title format: `{Area} Removals ({Postcodes}) | SWL Removals`
 */
export const LOCATION_SEO_POSTCODES: Record<string, string> = {
  "balham-removals": "SW12",
  "barnes-removals": "SW13",
  "battersea-removals": "SW11",
  "brixton-removals": "SW2 & SW9",
  "carshalton-removals": "SM5",
  "chelsea-removals": "SW3",
  "chiswick-removals": "W4",
  "clapham-removals": "SW4",
  "cobham-removals": "KT11",
  "dulwich-removals": "SE21",
  "earlsfield-removals": "SW18",
  "epsom-removals": "KT17 & KT18",
  "esher-removals": "KT10",
  "fulham-removals": "SW6",
  "guildford-removals": "GU1 & GU2",
  "herne-hill-removals": "SE24",
  "kensington-removals": "W8",
  "kew-removals": "TW9",
  "kingston-upon-thames-removals": "KT1 & KT2",
  "leatherhead-removals": "KT22",
  "mitcham-removals": "CR4",
  "new-malden-removals": "KT3",
  "putney-removals": "SW15",
  "raynes-park-removals": "SW20",
  "reigate-removals": "RH2",
  "richmond-removals": "TW9 & TW10",
  "southfields-removals": "SW18",
  "streatham-removals": "SW16",
  "surbiton-removals": "KT5 & KT6",
  "sutton-removals": "SM1 & SM2",
  "twickenham-removals": "TW1 & TW2",
  "wandsworth-removals": "SW18",
  "weybridge-removals": "KT13",
  "woking-removals": "GU21 & GU22",
  "worcester-park-removals": "KT4",
};

/** Display name overrides for SEO titles (table uses short names). */
const LOCATION_SEO_AREA_NAMES: Record<string, string> = {
  "kingston-upon-thames-removals": "Kingston",
};

/**
 * Build the document title for a location page.
 * Wimbledon and Tooting use special titles; priority slugs use confirmed postcodes;
 * all other location pages use postcodes from page data (TODO: confirm with owner).
 */
export function buildLocationSeoTitle(
  slug: string,
  locationName: string,
  postcodes: string[]
): string {
  if (slug === "wimbledon-removals") {
    return "Removals Wimbledon (SW19) | Fixed Quotes | SWL Removals";
  }

  if (slug === "tooting-removals") {
    return "Tooting Removals | SW17 House & Flat Moves | SWL Removals";
  }

  const confirmed = LOCATION_SEO_POSTCODES[slug];
  const area = LOCATION_SEO_AREA_NAMES[slug] ?? locationName;

  if (confirmed) {
    return `${area} Removals (${confirmed}) | SWL Removals`;
  }

  // TODO: confirm SEO title postcodes for slug: see unconfirmedLocationSlugs()
  const fallback = postcodes.length > 0 ? postcodes.join(" & ") : "local";
  return `${area} Removals (${fallback}) | SWL Removals`;
}

/** Slugs that fall back to page-data postcodes (not in the confirmed table). */
export function unconfirmedLocationSlugs(allSlugs: string[]): string[] {
  return allSlugs.filter(
    (slug) =>
      slug !== "wimbledon-removals" &&
      slug !== "tooting-removals" &&
      !(slug in LOCATION_SEO_POSTCODES)
  );
}

/*
 * TODO: confirm SEO title postcodes for these location slugs (not in the
 * confirmed table; titles currently use postcodes from locationPages data):
 * redhill-removals, dorking-removals, godalming-removals, hammersmith-removals,
 * acton-removals, ealing-removals, mortlake-removals, roehampton-removals,
 * east-sheen-removals, west-brompton-removals, pimlico-removals,
 * notting-hill-removals, south-kensington-removals, knightsbridge-removals,
 * belgravia-removals, mayfair-removals, st-johns-wood-removals,
 * maida-vale-removals, hampstead-removals, islington-removals, camden-removals,
 * vauxhall-removals, walton-on-thames-removals, ashtead-removals,
 * virginia-water-removals, sunbury-on-thames-removals, staines-removals,
 * addlestone-removals, oxshott-removals, claygate-removals, bookham-removals,
 * fetcham-removals, oxted-removals, banstead-removals, tadworth-removals,
 * warlingham-removals, chobham-removals, windlesham-removals,
 * lightwater-removals, sunningdale-removals, ascot-removals, cranleigh-removals,
 * horsley-removals, east-horsley-removals, west-horsley-removals,
 * ripley-removals, haslemere-removals, hindhead-removals, farnham-removals,
 * farnborough-removals, camberley-removals, godstone-removals,
 * caterham-removals, coulsdon-removals, purley-removals, wallington-removals,
 * cheam-removals, morden-removals, norbiton-removals, hampton-removals,
 * teddington-removals, hampton-wick-removals, greenwich-removals
 */

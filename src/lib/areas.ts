export type AreaData = {
  slug: string;
  name: string;
  title: string;
  description: string;
  intro: string;
  landmarks: string[];
  neighbourhoods: string[];
  faqs: { question: string; answer: string }[];
  nearbyAreas: { name: string; slug: string }[];
};

export const AREAS: AreaData[] = [
  {
    slug: "wimbledon",
    name: "Wimbledon",
    title: "Wimbledon Removals",
    description:
      "Premium house and office removals in Wimbledon. Fixed quotations, experienced local crews, careful handling across SW19 and surrounding areas.",
    intro:
      "Wimbledon demands removals done properly. From Victorian terraces near the Village to modern apartments by the Common, we understand the access challenges, parking restrictions, and expectations of homeowners in SW19. Our crews arrive prepared with floor protection, furniture wrapping, and the local knowledge that makes moving day run smoothly.",
    landmarks: [
      "Wimbledon Common",
      "Wimbledon Village",
      "Wimbledon Park",
      "South Park Gardens",
      "Cannizaro Park",
    ],
    neighbourhoods: [
      "Wimbledon Village",
      "Wimbledon Park",
      "South Wimbledon",
      "Wimbledon Chase",
      "Raynes Park border",
    ],
    faqs: [
      {
        question: "Do you cover all of Wimbledon including SW19?",
        answer:
          "Yes. We serve the full SW19 postcode and surrounding areas including Raynes Park, Colliers Wood, and Southfields.",
      },
      {
        question: "Can you handle moves from period properties in Wimbledon Village?",
        answer:
          "Absolutely. Our crews are experienced with narrow staircases, tight access, and the careful handling required for period homes.",
      },
      {
        question: "How quickly can I get a quote for a Wimbledon move?",
        answer:
          "Send a WhatsApp walkthrough video and we typically respond with a fixed quotation within a few hours during business hours.",
      },
    ],
    nearbyAreas: [
      { name: "Richmond", slug: "richmond" },
      { name: "Kingston", slug: "kingston" },
      { name: "Surrey", slug: "surrey" },
    ],
  },
  {
    slug: "richmond",
    name: "Richmond",
    title: "Richmond Removals",
    description:
      "Expert removals in Richmond upon Thames. Premium service for homes and offices across TW9, TW10 and the Richmond area.",
    intro:
      "Richmond combines riverside elegance with village charm, and your move should reflect that standard. Whether you are relocating from a Georgian townhouse near the Green or a family home in East Sheen, we provide fixed quotations, trained crews, and meticulous care throughout.",
    landmarks: [
      "Richmond Green",
      "Richmond Park",
      "Kew Gardens",
      "Ham Common",
      "Petersham Meadows",
    ],
    neighbourhoods: [
      "Richmond Hill",
      "East Sheen",
      "North Sheen",
      "St Margarets",
      "Barnes border",
    ],
    faqs: [
      {
        question: "Do you move homes near Richmond Park?",
        answer:
          "Yes. We regularly serve properties around Richmond Park, Sheen, and the surrounding TW9 and TW10 postcodes.",
      },
      {
        question: "Can you manage parking permits for Richmond moves?",
        answer:
          "We advise on suspension bays and local parking arrangements as part of your move planning.",
      },
      {
        question: "Do you offer packing services in Richmond?",
        answer:
          "Yes. Full and partial packing services are available with premium materials and careful labelling.",
      },
    ],
    nearbyAreas: [
      { name: "Wimbledon", slug: "wimbledon" },
      { name: "Kingston", slug: "kingston" },
      { name: "Fulham", slug: "fulham" },
    ],
  },
  {
    slug: "kingston",
    name: "Kingston",
    title: "Kingston Removals",
    description:
      "Professional removals in Kingston upon Thames. Reliable crews, fixed quotes, and careful handling across KT1, KT2 and beyond.",
    intro:
      "Kingston sits at the heart of South West London with a mix of riverside apartments, family homes, and thriving commercial spaces. Our Kingston removals service is built around clear communication, punctual crews, and the operational excellence that affluent homeowners expect.",
    landmarks: [
      "Kingston Riverside",
      "Bushy Park",
      "Richmond Park border",
      "Canbury Gardens",
      "Hampton Court proximity",
    ],
    neighbourhoods: [
      "Kingston Town Centre",
      "Surbiton",
      "New Malden",
      "Tolworth",
      "Ham",
    ],
    faqs: [
      {
        question: "Which Kingston postcodes do you cover?",
        answer: "We cover KT1, KT2, and surrounding areas including Surbiton, New Malden, and Tolworth.",
      },
      {
        question: "Can you help with student moves in Kingston?",
        answer:
          "Yes, though our primary focus is premium home and office relocations across the borough.",
      },
      {
        question: "Do you offer storage near Kingston?",
        answer:
          "We provide secure storage solutions for short and long-term requirements, ideal for chain moves.",
      },
    ],
    nearbyAreas: [
      { name: "Wimbledon", slug: "wimbledon" },
      { name: "Richmond", slug: "richmond" },
      { name: "Surrey", slug: "surrey" },
    ],
  },
  {
    slug: "clapham",
    name: "Clapham",
    title: "Clapham Removals",
    description:
      "Premium removals in Clapham. Experienced crews for Victorian terraces, modern flats, and family homes across SW4 and SW11.",
    intro:
      "Clapham properties range from grand Victorian conversions to contemporary developments near the Common. Our crews understand the parking logistics, building management requirements, and the careful handling needed when moving through period properties with original features.",
    landmarks: [
      "Clapham Common",
      "Abbeville Village",
      "Northcote Road",
      "Clapham Old Town",
      "Battersea Rise",
    ],
    neighbourhoods: ["Clapham Common", "Clapham South", "Clapham North", "Abbeville Village", "Stockwell border"],
    faqs: [
      {
        question: "Do you handle flat moves in Clapham?",
        answer:
          "Yes. We regularly move clients from mansion blocks and converted terraces, coordinating with building management where required.",
      },
      {
        question: "Can you move at weekends in Clapham?",
        answer: "Weekend moves are available and popular. We recommend booking early for Saturday slots.",
      },
      {
        question: "How do you protect staircases in period Clapham homes?",
        answer:
          "Floor and banister protection is standard. We assess access during survey and bring appropriate materials.",
      },
    ],
    nearbyAreas: [
      { name: "Wandsworth", slug: "wandsworth" },
      { name: "Fulham", slug: "fulham" },
      { name: "Wimbledon", slug: "wimbledon" },
    ],
  },
  {
    slug: "fulham",
    name: "Fulham",
    title: "Fulham Removals",
    description:
      "Discreet, professional removals in Fulham. Premium service across SW6 for homes, apartments, and offices.",
    intro:
      "Fulham homeowners expect a removals service that matches the calibre of their properties. From riverside apartments to family homes near Parsons Green, we deliver fixed quotations, immaculate vehicles, and crews who work calmly and efficiently.",
    landmarks: [
      "Fulham Broadway",
      "Parsons Green",
      "Hurlingham Park",
      "Bishops Park",
      "Putney Bridge",
    ],
    neighbourhoods: [
      "Parsons Green",
      "Fulham Broadway",
      "Sands End",
      "Walham Green",
      "Putney border",
    ],
    faqs: [
      {
        question: "Do you cover the full SW6 postcode?",
        answer: "Yes, including Parsons Green, Fulham Broadway, Sands End, and surrounding streets.",
      },
      {
        question: "Can you coordinate with concierge buildings in Fulham?",
        answer:
          "We regularly work with managed buildings and arrange lift bookings and loading bay access in advance.",
      },
      {
        question: "Do you offer office removals in Fulham?",
        answer: "Yes. Discreet commercial relocations with minimal business disruption.",
      },
    ],
    nearbyAreas: [
      { name: "Wandsworth", slug: "wandsworth" },
      { name: "Richmond", slug: "richmond" },
      { name: "Clapham", slug: "clapham" },
    ],
  },
  {
    slug: "wandsworth",
    name: "Wandsworth",
    title: "Wandsworth Removals",
    description:
      "Trusted removals in Wandsworth. Fixed quotes and careful crews across SW18 and the Wandsworth area.",
    intro:
      "Wandsworth offers a blend of riverside living and established residential streets. Our local crews know the area well, from the Southside Shopping Centre vicinity to the quieter residential roads towards Putney Heath.",
    landmarks: [
      "Wandsworth Common",
      "Battersea Park border",
      "River Thames",
      "Wandsworth Town",
      "Earlsfield",
    ],
    neighbourhoods: ["Wandsworth Town", "Earlsfield", "Southfields", "Putney border", "Battersea border"],
    faqs: [
      {
        question: "Which areas of Wandsworth do you serve?",
        answer: "We cover SW18 and surrounding postcodes including Earlsfield and Southfields.",
      },
      {
        question: "Can you help with moves to or from Wandsworth Common?",
        answer: "Yes. Properties around the Common are a regular part of our schedule.",
      },
      {
        question: "Do you provide fixed quotations?",
        answer: "All our quotes are fixed with no hidden extras, agreed before your move date.",
      },
    ],
    nearbyAreas: [
      { name: "Clapham", slug: "clapham" },
      { name: "Fulham", slug: "fulham" },
      { name: "Wimbledon", slug: "wimbledon" },
    ],
  },
  {
    slug: "epsom",
    name: "Epsom",
    title: "Epsom Removals",
    description:
      "Premium removals in Epsom and Ewell. Experienced crews for Surrey family homes with fixed, transparent pricing.",
    intro:
      "Epsom and the surrounding Surrey countryside attract families who value space, quality, and discretion. Our Epsom removals service combines the operational standards of a premium London operator with genuine Surrey local knowledge.",
    landmarks: [
      "Epsom Downs",
      "Rosebery Park",
      "Epsom Common",
      "Ewell Village",
      "Horton Country Park",
    ],
    neighbourhoods: ["Epsom Town", "Ewell", "Stoneleigh", "Tattenham Corner", "Nork"],
    faqs: [
      {
        question: "Do you move large family homes in Epsom?",
        answer:
          "Yes. Five and six-bedroom properties are regularly handled with appropriate crew sizes and vehicles.",
      },
      {
        question: "Can you move from Epsom to London?",
        answer: "Absolutely. We handle moves throughout Surrey and into all South West London boroughs.",
      },
      {
        question: "Is storage available for Epsom moves?",
        answer: "Secure storage is available for chain moves and downsizing projects.",
      },
    ],
    nearbyAreas: [
      { name: "Surrey", slug: "surrey" },
      { name: "Wimbledon", slug: "wimbledon" },
      { name: "Kingston", slug: "kingston" },
    ],
  },
  {
    slug: "surrey",
    name: "Surrey",
    title: "Surrey Removals",
    description:
      "Premium removals throughout Surrey. From Epsom to the Surrey Hills, experienced crews and fixed quotations.",
    intro:
      "Surrey removals require more than a van and two people. Large family homes, long driveways, and valuable contents demand proper planning, adequate crew sizes, and a company that treats your move with the seriousness it deserves. We serve Surrey from our South West London base with the same standards we apply across Wimbledon, Kingston, and Richmond.",
    landmarks: [
      "Surrey Hills AONB",
      "Box Hill",
      "Guildford",
      "Leatherhead",
      "Dorking",
    ],
    neighbourhoods: [
      "Epsom & Ewell",
      "Leatherhead",
      "Dorking",
      "Reigate",
      "Cobham",
      "Weybridge",
    ],
    faqs: [
      {
        question: "How far into Surrey do you operate?",
        answer:
          "We cover the full Surrey area including Epsom, Leatherhead, Dorking, Reigate, Cobham, and Weybridge.",
      },
      {
        question: "Can you handle long-distance moves from Surrey?",
        answer: "Yes. We manage nationwide relocations from Surrey with full inventory and insurance.",
      },
      {
        question: "Do Surrey moves cost more than London moves?",
        answer:
          "Pricing depends on volume, distance, and access. We provide fixed quotations after survey with no hidden fees.",
      },
    ],
    nearbyAreas: [
      { name: "Epsom", slug: "epsom" },
      { name: "Wimbledon", slug: "wimbledon" },
      { name: "Kingston", slug: "kingston" },
    ],
  },
];

export function getAreaBySlug(slug: string): AreaData | undefined {
  return AREAS.find((a) => a.slug === slug);
}

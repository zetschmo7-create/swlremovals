export type LocationFAQ = {
  question: string;
  answer: string;
};

export type LocationTestimonial = {
  quote: string;
  author: string;
  moveType: string;
};

export type LocationMoveRoute = {
  from: string;
  to: string;
  description: string;
};

export type LocationRecentMove = {
  summary: string;
  propertyType: string;
  month: string;
};

export type LocationInternalLink = {
  label: string;
  href: string;
};

export type NearbyAreaLink = {
  name: string;
  slug: string;
};

export type LocationPageData = {
  locationName: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  propertyTypes: string[];
  commonMoveTypes: string[];
  parkingAccessNotes: string;
  localRoads: string[];
  localLandmarks: string[];
  postcodes: string[];
  nearbyAreas: NearbyAreaLink[];
  popularMoveRoutes: LocationMoveRoute[];
  recentMoves: LocationRecentMove[];
  faq: LocationFAQ[];
  testimonial: LocationTestimonial;
  internalLinks: LocationInternalLink[];
};

const DEFAULT_INTERNAL_LINKS: LocationInternalLink[] = [
  { label: "House removals", href: "/services/house-removals" },
  { label: "Office removals", href: "/services/office-removals" },
  { label: "Packing service", href: "/services/packing" },
  { label: "Storage", href: "/services/storage" },
  { label: "Get a fixed quote", href: "/quote" },
  { label: "Contact us", href: "/contact" },
];

export const LOCATION_PAGES: LocationPageData[] = [
  {
    locationName: "Wimbledon",
    slug: "wimbledon-removals",
    metaTitle: "Wimbledon Removals | House & Office Moves SW19",
    metaDescription:
      "Premium removals in Wimbledon SW19. Experienced crews for period homes, flats and office moves. Fixed quotes, parking-aware planning and careful handling across the Village and Common.",
    h1: "Wimbledon removals done with local knowledge",
    intro:
      "Wimbledon moves need more than a van and two men. Narrow Village lanes, permit zones around the Common, and steep staircases in Edwardian terraces all affect how a job should be planned. We quote fixed prices after understanding your access, parking window and property type, then arrive with floor protection, wrapping and a crew who know SW19 well.",
    propertyTypes: [
      "Victorian and Edwardian family homes near Wimbledon Common",
      "Converted flats along Worple Road and Alexandra Road",
      "Modern apartments around Wimbledon Park and the town centre",
      "Mansion blocks and maisonettes south of the Broadway",
      "Office suites above retail units on Wimbledon Hill Road",
    ],
    commonMoveTypes: [
      "Family home relocations within SW19 and into Surrey",
      "Downsizing from larger Village properties to town centre flats",
      "Rental changeovers for landlords and letting agents",
      "Office moves for local professional firms",
      "Part-load deliveries for furniture and single-room moves",
    ],
    parkingAccessNotes:
      "Much of Wimbledon Village and the roads around the Common sit within controlled parking zones. We plan around permit holder bays, visitor vouchers and timed loading slots. For properties with shared drives or rear access only, we walk the route in advance so the right vehicle size is booked and carrying distances are realistic.",
    localRoads: [
      "Wimbledon Hill Road",
      "Worple Road",
      "Alexandra Road",
      "Parkside",
      "The Causeway",
      "Ridgway",
    ],
    localLandmarks: [
      "Wimbledon Common",
      "Wimbledon Village",
      "Wimbledon Park",
      "Cannizaro Park",
      "South Park Gardens",
    ],
    postcodes: ["SW19", "SW20"],
    nearbyAreas: [
      { name: "Raynes Park", slug: "raynes-park-removals" },
      { name: "New Malden", slug: "new-malden-removals" },
      { name: "Wandsworth", slug: "wandsworth-removals" },
      { name: "Putney", slug: "putney-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Wimbledon Village",
        to: "Richmond",
        description:
          "A regular route for families leaving larger period homes for riverside living. We allow extra time for wrapping and narrow access at both ends.",
      },
      {
        from: "Wimbledon town centre",
        to: "Guildford",
        description:
          "Popular with commuters upsizing into Surrey. Fixed quotes cover the full carry and motorway-ready loading.",
      },
      {
        from: "South Wimbledon",
        to: "Clapham",
        description:
          "Typical young professional move from a flat share to a larger rental. Evening and weekend slots available.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Four-bedroom Edwardian home near the Common to a detached property in Coombe. Two-day pack, single moving day.",
        propertyType: "Edwardian house",
        month: "Recent example",
      },
      {
        summary:
          "Two-bedroom flat on Worple Road to a ground-floor rental in Southfields. Morning slot to avoid school-run parking pressure.",
        propertyType: "Period conversion flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover all of Wimbledon including the Village?",
        answer:
          "Yes. We work across SW19 and SW20, including the Village, Broadway, Wimbledon Park and South Wimbledon. Access and parking are assessed during quoting.",
      },
      {
        question: "Can you move large furniture from homes with tight staircases?",
        answer:
          "We regularly handle sofas, wardrobes and pianos in period properties. A video walkthrough helps us plan dismantling and the right crew size.",
      },
      {
        question: "How do I get a fixed quote for a Wimbledon move?",
        answer:
          "Send a WhatsApp walkthrough of each room or complete our online form. We respond with a clear fixed price, not an estimate that changes on the day.",
      },
    ],
    testimonial: {
      quote:
        "The team understood Wimbledon parking from the start and had floor covers down before anything was carried. Stress-free move from our Village house.",
      author: "Sarah M.",
      moveType: "Family home move, SW19",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Raynes Park",
    slug: "raynes-park-removals",
    metaTitle: "Raynes Park Removals | Local House Moves SW20",
    metaDescription:
      "Trusted removals in Raynes Park SW20. Careful moves for Victorian terraces, family semis and flats near the station. Fixed quotations and parking-aware crews.",
    h1: "Raynes Park removals with station-side know-how",
    intro:
      "Raynes Park is compact, residential and often awkward for parking near the station and along Coombe Lane. Terraced houses with small front gardens and flats above shops on Kingston Road are common here. We plan each job around rush-hour restrictions, school traffic and the carrying distance from van to door.",
    propertyTypes: [
      "Victorian terraces between Coombe Lane and the station",
      "1930s semis towards West Barnes and Cottenham Park",
      "Flats above retail on Kingston Road",
      "Bungalows and chalet-style homes near Grand Drive",
      "New-build apartments on the edge of Motspur Park",
    ],
    commonMoveTypes: [
      "Moves along the Raynes Park to New Malden corridor",
      "First-time buyer relocations into larger semis",
      "Landlord inventory changeovers near the station",
      "Downsizing from family homes to smaller bungalows",
      "Student and rental moves at the start and end of tenancy",
    ],
    parkingAccessNotes:
      "Streets close to Raynes Park station fill quickly on weekdays. We coordinate arrival times with your parking suspension or visitor bay booking where needed. Many properties have side passages rather than through-the-house access, so we measure routes before move day.",
    localRoads: [
      "Coombe Lane",
      "West Barnes Lane",
      "Grand Drive",
      "Kingston Road",
      "Bushey Road",
      "Lambton Road",
    ],
    localLandmarks: [
      "Raynes Park station",
      "Cottenham Park",
      "West Barnes Green",
      "Joseph Hood Memorial Wood",
      "The Coombe",
    ],
    postcodes: ["SW20", "KT3"],
    nearbyAreas: [
      { name: "Wimbledon", slug: "wimbledon-removals" },
      { name: "New Malden", slug: "new-malden-removals" },
      { name: "Putney", slug: "putney-removals" },
      { name: "Kingston upon Thames", slug: "kingston-upon-thames-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Raynes Park",
        to: "Wimbledon Village",
        description:
          "Short hop that still needs careful planning for narrow drives and expensive flooring in larger receiving properties.",
      },
      {
        from: "Coombe Lane area",
        to: "Guildford",
        description:
          "Families moving out to Surrey for schools and space. Full packing options available.",
      },
      {
        from: "West Barnes",
        to: "Richmond",
        description:
          "Cross-borough move often timed around completion day. We stay until everything is placed.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Three-bedroom terrace near the station to a semi in New Malden. Sofa winch through rear access.",
        propertyType: "Victorian terrace",
        month: "Recent example",
      },
      {
        summary:
          "One-bedroom flat on Kingston Road to a rental in Motspur Park. Same-day pack and move.",
        propertyType: "Conversion flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Raynes Park within your regular coverage area?",
        answer:
          "Yes. SW20 is core territory for us. We move locally and longer distance from Raynes Park every week.",
      },
      {
        question: "Can you work around commuter parking near the station?",
        answer:
          "We schedule early starts or off-peak slots where possible and follow any bay suspension you arrange with the council.",
      },
      {
        question: "Do you dismantle beds and wardrobes as standard?",
        answer:
          "Dismantling and reassembly are included where agreed in your quote. We note large items during the survey.",
      },
    ],
    testimonial: {
      quote:
        "Parking near the station was a worry but the crew arrived early and worked efficiently. Nothing damaged on our narrow staircase.",
      author: "James T.",
      moveType: "Terrace house move, SW20",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Putney",
    slug: "putney-removals",
    metaTitle: "Putney Removals | Riverside & SW15 House Moves",
    metaDescription:
      "Professional removals in Putney SW15. Flats, townhouses and family homes near the river and Putney Bridge. Fixed quotes and experienced local crews.",
    h1: "Putney removals for riverside and SW15 homes",
    intro:
      "Putney mixes busy high-street living with quiet residential streets running down to the Thames. Upper Richmond Road carries heavy traffic, riverside flats often have lift access only, and Victorian houses on Dover House Road need careful protection on stairwells. We tailor crew size, vehicle choice and timing to your building and street.",
    propertyTypes: [
      "Riverside apartments with concierge and lift access",
      "Victorian and Edwardian houses on the Dover House estate",
      "Townhouses and split-level homes near Putney Heath",
      "Modern developments off Putney High Street",
      "Shared houses and rental flats popular with young professionals",
    ],
    commonMoveTypes: [
      "Riverside flat moves with lift booking coordination",
      "Family relocations from Putney Heath to Surrey",
      "Professional moves into central London offices",
      "Tenancy changeovers for Putney rental stock",
      "Downsizing from family homes to bridge-side apartments",
    ],
    parkingAccessNotes:
      "Putney High Street and Lower Richmond Road are sensitive to loading restrictions. For riverside blocks we confirm lift dimensions and parking bays with building management before the day. Narrow residential streets off the Upper Richmond Road often need a smaller vehicle or staggered parking.",
    localRoads: [
      "Upper Richmond Road",
      "Putney High Street",
      "Lower Richmond Road",
      "Dover House Road",
      "Festing Road",
      "Putney Bridge Road",
    ],
    localLandmarks: [
      "Putney Bridge",
      "Putney Embankment",
      "Putney Heath",
      "Leader's Gardens",
      "St Mary's Church",
    ],
    postcodes: ["SW15"],
    nearbyAreas: [
      { name: "Wandsworth", slug: "wandsworth-removals" },
      { name: "Fulham", slug: "fulham-removals" },
      { name: "Barnes", slug: "barnes-removals" },
      { name: "Balham", slug: "balham-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Putney riverside",
        to: "Chelsea",
        description:
          "Short central London move where timing and parking at both ends matter more than distance.",
      },
      {
        from: "Putney Heath",
        to: "Woking",
        description:
          "Surrey-bound family move with full packing and garage contents included.",
      },
      {
        from: "East Putney",
        to: "Clapham",
        description:
          "Popular rental-to-rental move along the Northern line corridor.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Two-bedroom riverside flat to a townhouse in Fulham. Lift booked and building insurance requirements met.",
        propertyType: "Riverside apartment",
        month: "Recent example",
      },
      {
        summary:
          "Four-bedroom house off Putney Heath to Guildford. Two-crew pack day followed by main move.",
        propertyType: "Family townhouse",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you handle concierge buildings on the Embankment?",
        answer:
          "Yes. We work with lift slots, damage waivers and loading bay rules regularly in Putney riverside blocks.",
      },
      {
        question: "Can you move on weekends in Putney?",
        answer:
          "Saturday moves are popular and available. We recommend booking early for month-end weekends.",
      },
      {
        question: "What areas near Putney do you also cover?",
        answer:
          "We cover Roehampton, East Putney and the SW15 postcode fully, plus nearby Wandsworth and Fulham.",
      },
    ],
    testimonial: {
      quote:
        "Building management were particular about lift times. The crew had everything documented and finished within the slot.",
      author: "Helen K.",
      moveType: "Riverside flat move, SW15",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Wandsworth",
    slug: "wandsworth-removals",
    metaTitle: "Wandsworth Removals | SW18 House & Flat Moves",
    metaDescription:
      "Reliable removals in Wandsworth SW18. Homes near the town centre, riverside developments and Garratt Lane terraces. Fixed prices and careful crews.",
    h1: "Wandsworth removals across SW18",
    intro:
      "Wandsworth has changed quickly along the river while retaining tight Victorian streets inland. New apartments near Wandsworth Town station sit alongside family houses towards Earlsfield and Southfields. We match our approach to whether you are leaving a lift-served flat or a terrace with steps to the front door.",
    propertyTypes: [
      "Riverside apartments near Wandsworth Town and Eastfields",
      "Victorian terraces off Garratt Lane and Bellew Street",
      "Family semis towards Southfields and Wimbledon Park side",
      "Town centre flats above retail on Old York Road",
      "Office units in business parks towards Battersea Reach",
    ],
    commonMoveTypes: [
      "Riverside flat moves with developer parking rules",
      "Family moves from Southfields border into Surrey",
      "Young professional relocations towards Clapham and Fulham",
      "Office strip-out and relocation within SW18",
      "Storage collection and delivery for renovation projects",
    ],
    parkingAccessNotes:
      "Wandsworth Town centre has active loading controls on market days. Riverside estates issue their own parking permits for removal vehicles. We ask for any building handbook rules upfront so crews arrive with the right protection and paperwork.",
    localRoads: [
      "Old York Road",
      "Garratt Lane",
      "Bellew Street",
      "West Hill",
      "Merton Road",
      "Spencer Park",
    ],
    localLandmarks: [
      "Wandsworth Town station",
      "Southside Shopping Centre",
      "Wandsworth Park",
      "King George's Park",
      "Battersea Reach",
    ],
    postcodes: ["SW18", "SW17"],
    nearbyAreas: [
      { name: "Putney", slug: "putney-removals" },
      { name: "Balham", slug: "balham-removals" },
      { name: "Tooting", slug: "tooting-removals" },
      { name: "Fulham", slug: "fulham-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Wandsworth riverside",
        to: "Canary Wharf",
        description:
          "Professional move where early access and secure parking at the city end are coordinated in advance.",
      },
      {
        from: "Southfields border",
        to: "Wimbledon",
        description:
          "Short local move often completed in a single morning with two crew.",
      },
      {
        from: "Garratt Lane",
        to: "Guildford",
        description:
          "Growing family upsizing to Surrey with nursery furniture and garden equipment included.",
      },
    ],
    recentMoves: [
      {
        summary:
          "New-build riverside flat to a Victorian terrace in Balham. Lift and street parking coordinated at both ends.",
        propertyType: "Modern apartment",
        month: "Recent example",
      },
      {
        summary:
          "Three-bedroom semi to storage then onward to New Malden after renovation. Split delivery planned.",
        propertyType: "1930s semi",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover both riverside and inland Wandsworth?",
        answer:
          "Yes. SW18 from the Thames to the Southfields border is within our standard coverage.",
      },
      {
        question: "Can you help with moves during building works?",
        answer:
          "We often move clients into storage or temporary accommodation during renovations, then deliver back when works finish.",
      },
      {
        question: "Are quotes fixed for Wandsworth moves?",
        answer:
          "Yes. The price we confirm after your survey is the price you pay, provided access matches what was described.",
      },
    ],
    testimonial: {
      quote:
        "Clear quote, turned up on time and handled our Garratt Lane terrace without a mark on the walls.",
      author: "David P.",
      moveType: "Terrace move, SW18",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Clapham",
    slug: "clapham-removals",
    metaTitle: "Clapham Removals | SW4 House & Flat Moves",
    metaDescription:
      "Premium removals in Clapham SW4. Old Town, Abbeville Village and Northcote Road properties. Fixed quotations, careful handling and busy-street experience.",
    h1: "Clapham removals for SW4 homes and flats",
    intro:
      "Clapham is one of South West London's busiest rental and owner-occupier markets. Flat shares near the Common, family houses in Old Town and newer apartments on Clapham High Street all move differently. Peak-time traffic on Clapham High Street and parking around Abbeville Village mean planning matters as much as packing.",
    propertyTypes: [
      "Converted Victorian flats around Clapham Common",
      "Family houses in Clapham Old Town and Abbeville Village",
      "Modern apartments on the High Street and Venn Street",
      "Maisonettes with shared garden access",
      "Professional house shares near Clapham South",
    ],
    commonMoveTypes: [
      "Rental changeovers at month end across SW4",
      "Upsizing from flat share to one-bedroom rental",
      "Family moves from Old Town to outer Surrey",
      "Downsizing from large houses to Common-side flats",
      "Office moves for local businesses on the High Street",
    ],
    parkingAccessNotes:
      "Controlled zones cover much of SW4. We work with your suspension permits or visitor vouchers and avoid school-run hours on Abbeville Road where possible. Properties backing onto the Common sometimes have long carries from side streets when front parking is unavailable.",
    localRoads: [
      "Clapham High Street",
      "Northcote Road",
      "Abbeville Road",
      "Cedars Road",
      "Broomfield Road",
      "Lavender Hill",
    ],
    localLandmarks: [
      "Clapham Common",
      "Clapham Old Town",
      "Abbeville Village",
      "Northcote Road shops",
      "Holy Trinity Church",
    ],
    postcodes: ["SW4", "SW12"],
    nearbyAreas: [
      { name: "Balham", slug: "balham-removals" },
      { name: "Wandsworth", slug: "wandsworth-removals" },
      { name: "Battersea", slug: "battersea-removals" },
      { name: "Fulham", slug: "fulham-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Clapham Common",
        to: "Richmond",
        description:
          "Family leaving a larger SW4 home for a quieter Thames-side area. Full packing recommended.",
      },
      {
        from: "Clapham North",
        to: "Chelsea",
        description:
          "Professional couple moving closer to work in west central London.",
      },
      {
        from: "Old Town",
        to: "Guildford",
        description:
          "School-driven move to Surrey with garage and garden contents.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Five-bedroom Old Town house to a Surrey village. Three crew, two days including piano.",
        propertyType: "Victorian family house",
        month: "Recent example",
      },
      {
        summary:
          "Two-bedroom flat share split into two separate rentals in Balham and Brixton.",
        propertyType: "Conversion flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Can you handle busy month-end Clapham moves?",
        answer:
          "Yes, though slots fill quickly. Book early and share parking permits as soon as they are issued.",
      },
      {
        question: "Do you move from top-floor flats without lifts?",
        answer:
          "We do. Stair carries are priced transparently after a walkthrough or video survey.",
      },
      {
        question: "Is Clapham South included?",
        answer:
          "Yes. SW4 and the Clapham South and Clapham Common stations area are all covered.",
      },
    ],
    testimonial: {
      quote:
        "Month-end chaos elsewhere but this team were calm and fast. Northcote Road parking was sorted before they arrived.",
      author: "Emma L.",
      moveType: "Flat move, SW4",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Balham",
    slug: "balham-removals",
    metaTitle: "Balham Removals | SW12 Local House Moves",
    metaDescription:
      "Trusted removals in Balham SW12. Victorian terraces, Edwardian semis and flats near the High Road. Fixed quotes and careful handling on Bedford Hill.",
    h1: "Balham removals on the SW12 corridor",
    intro:
      "Balham sits between Clapham and Tooting with a strong mix of period housing and modern conversions. Bedford Hill is steep, the High Road is congested at peak times, and many homes have bay windows and tight hallways. We protect both property and furniture before anything leaves the room.",
    propertyTypes: [
      "Edwardian semis and terraces near Balham station",
      "Flats above shops on Balham High Road",
      "Family homes towards Tooting Bec and Ritherdon Road",
      "Converted Victorian houses with multiple flats",
      "Newer apartments near Balham Bowls Club",
    ],
    commonMoveTypes: [
      "Moves between Balham and Clapham rental stock",
      "Family relocations from Bedford Hill to Surrey",
      "First-home purchases in the SW12 postcode",
      "Landlord inventory moves between tenancies",
      "Partial moves for home office setup or nursery rooms",
    ],
    parkingAccessNotes:
      "Balham High Road loading is time-sensitive. Side streets off Bedford Hill offer better parking but steep carries. We assess whether a smaller van with shuttle runs works better than one large vehicle on busy days.",
    localRoads: [
      "Balham High Road",
      "Bedford Hill",
      "Ritherdon Road",
      "Endlesham Road",
      "Balham Grove",
      "Yerdua Road",
    ],
    localLandmarks: [
      "Balham station",
      "Tooting Bec Common",
      "Balham Bowls Club",
      "Bedford Hill open space",
      "The Bedford pub",
    ],
    postcodes: ["SW12", "SW17"],
    nearbyAreas: [
      { name: "Clapham", slug: "clapham-removals" },
      { name: "Tooting", slug: "tooting-removals" },
      { name: "Wandsworth", slug: "wandsworth-removals" },
      { name: "Putney", slug: "putney-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Balham",
        to: "Wimbledon",
        description:
          "Family upsizing from a terrace to a larger SW19 home. Popular school catchment move.",
      },
      {
        from: "Bedford Hill",
        to: "Richmond",
        description:
          "Downsizing couple leaving a multi-floor semi for a riverside flat.",
      },
      {
        from: "Balham High Road",
        to: "Clapham",
        description:
          "Short rental move often completed in a half-day with two crew.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Three-bedroom semi on Ritherdon Road to a flat in Putney. Dismantling included for large IKEA wardrobes.",
        propertyType: "Edwardian semi",
        month: "Recent example",
      },
      {
        summary:
          "Studio flat on the High Road to a one-bedroom in Tooting Broadway. Same-day completion.",
        propertyType: "Shop-top flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is steep Bedford Hill a problem for large items?",
        answer:
          "We plan extra crew or dismantling where needed. Your survey flags anything that needs special handling.",
      },
      {
        question: "Do you cover Nightingale Lane?",
        answer:
          "Yes. The full SW12 area including the Clapham South border is covered.",
      },
      {
        question: "Can I get a quote on WhatsApp?",
        answer:
          "Yes. A short video walkthrough is often enough for a fixed Balham quote.",
      },
    ],
    testimonial: {
      quote:
        "Bedford Hill carry was tough but the team stayed cheerful and nothing was rushed. Would use again.",
      author: "Rachel W.",
      moveType: "Semi-detached move, SW12",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Tooting",
    slug: "tooting-removals",
    metaTitle: "Tooting Removals | SW17 House & Flat Moves",
    metaDescription:
      "Local removals in Tooting SW17. Broadway flats, Bec Common family homes and period terraces. Fixed quotes and experienced South West London crews.",
    h1: "Tooting removals across SW17",
    intro:
      "Tooting is busy, diverse and full of vertical living. Flats above the Broadway, family houses near Tooting Bec Common and terraces towards Tooting Graveney all present different access challenges. Market days and school traffic affect timing, so we agree a realistic schedule with you in advance.",
    propertyTypes: [
      "Period terraces and semis near Tooting Bec Common",
      "Flats and maisonettes above Broadway retail",
      "Victorian houses converted to flats on Totterdown Street",
      "Council and housing association properties with lift access",
      "Loft conversions and extended family homes in Furzedown",
    ],
    commonMoveTypes: [
      "Broadway rental changeovers at tenancy end",
      "Family moves from Bec Common area into Merton and Surrey",
      "Downsizing from larger homes to ground-floor flats",
      "Moves linked to loft conversion temporary storage",
      "Student and shared-house relocations",
    ],
    parkingAccessNotes:
      "Tooting Broadway is congested most weekdays. We use early starts where possible and follow any bay suspension you arrange. For flats above shops, rear service access sometimes exists but must be confirmed with the landlord beforehand.",
    localRoads: [
      "Tooting High Street",
      "Tooting Broadway",
      "Upper Tooting Road",
      "Trinity Road",
      "Totterdown Street",
      "Furzedown Road",
    ],
    localLandmarks: [
      "Tooting Bec Common",
      "Tooting Broadway market",
      "Tooting Lido",
      "Granada Cinema building",
      "St Benedict's Church",
    ],
    postcodes: ["SW17"],
    nearbyAreas: [
      { name: "Balham", slug: "balham-removals" },
      { name: "Wandsworth", slug: "wandsworth-removals" },
      { name: "Wimbledon", slug: "wimbledon-removals" },
      { name: "Mitcham", slug: "mitcham-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Tooting Broadway",
        to: "Clapham",
        description:
          "Rental upgrade move along the Northern line. Often a single van job.",
      },
      {
        from: "Tooting Bec",
        to: "Kingston upon Thames",
        description:
          "Family move towards schools and green space in KT1 and KT2.",
      },
      {
        from: "Furzedown",
        to: "Woking",
        description:
          "Surrey relocation with full pack for a four-bedroom extended home.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Two-bedroom flat above the Broadway to a house in Colliers Wood. Early start to secure parking.",
        propertyType: "Shop-top flat",
        month: "Recent example",
      },
      {
        summary:
          "Four-bedroom house near the Common to Guildford. Garden tools and shed contents included.",
        propertyType: "Extended terrace",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you move from top-floor Broadway flats?",
        answer:
          "Yes. We price stair carries clearly after seeing the property layout on video or in person.",
      },
      {
        question: "Is Tooting Graveney covered?",
        answer:
          "Yes. The whole SW17 postcode including Graveney and Furzedown is within our area.",
      },
      {
        question: "Can you pack the day before?",
        answer:
          "Separate packing days are available and popular for larger Tooting family homes.",
      },
    ],
    testimonial: {
      quote:
        "Market day on the Broadway but they navigated parking and finished on time. Very professional.",
      author: "Ahmed S.",
      moveType: "Flat move, SW17",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Fulham",
    slug: "fulham-removals",
    metaTitle: "Fulham Removals | SW6 House & Flat Moves",
    metaDescription:
      "Premium removals in Fulham SW6. Parsons Green, Munster Road and Fulham Road properties. Fixed quotes, lift access experience and careful period-home handling.",
    h1: "Fulham removals for SW6 homes",
    intro:
      "Fulham properties are often high value with tight access. White-painted hallways, polished floors and narrow stairs between half-landings are standard in converted houses. We use floor runners, door protectors and experienced crews who treat your home as carefully as your furniture.",
    propertyTypes: [
      "Victorian conversions on Munster Road and Lillie Road",
      "Townhouses and terraces in Parsons Green",
      "Riverside flats towards Putney Bridge",
      "Mansion flats near Fulham Broadway",
      "Family homes south towards Sands End",
    ],
    commonMoveTypes: [
      "Parsons Green family moves into larger Surrey homes",
      "Flat moves between Fulham and Chelsea",
      "Rental changeovers for SW6 letting stock",
      "Downsizing from houses to Fulham Road apartments",
      "Art and fragile item moves with extra wrapping",
    ],
    parkingAccessNotes:
      "Fulham Road and New King's Road are busy throughout the day. Many streets are permit-only by 8am. We coordinate suspensions where needed and use smaller vehicles for mews and cul-de-sac access.",
    localRoads: [
      "Fulham Road",
      "New King's Road",
      "Munster Road",
      "Lillie Road",
      "Parsons Green Lane",
      "Wandsworth Bridge Road",
    ],
    localLandmarks: [
      "Parsons Green",
      "Fulham Broadway",
      "Bishops Park",
      "Craven Cottage",
      "South Park",
    ],
    postcodes: ["SW6"],
    nearbyAreas: [
      { name: "Chelsea", slug: "chelsea-removals" },
      { name: "Putney", slug: "putney-removals" },
      { name: "Kensington", slug: "kensington-removals" },
      { name: "Wandsworth", slug: "wandsworth-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Parsons Green",
        to: "Richmond",
        description:
          "Family leaving London for more space while keeping a reasonable commute.",
      },
      {
        from: "Fulham Broadway",
        to: "Kensington",
        description:
          "Upsizing to a larger flat closer to central work locations.",
      },
      {
        from: "Sands End",
        to: "Woking",
        description:
          "Surrey move with nursery and home office equipment handled separately.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Three-bedroom Munster Road conversion to a Chelsea maisonette. Extra protection on painted stairwells.",
        propertyType: "Victorian conversion",
        month: "Recent example",
      },
      {
        summary:
          "Two-bedroom Fulham Road flat to storage during refurbishment. Return delivery booked.",
        propertyType: "Apartment",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you take extra care with high-end finishes?",
        answer:
          "Yes. Floor and door protection is standard on Fulham jobs. Tell us about delicate surfaces during quoting.",
      },
      {
        question: "Can you move from Fulham to Chelsea same day?",
        answer:
          "Yes. Short west London moves are routine for our crews.",
      },
      {
        question: "Do you cover Sands End and Imperial Wharf?",
        answer:
          "Yes. The full SW6 postcode including riverside developments is covered.",
      },
    ],
    testimonial: {
      quote:
        "White carpets and a narrow staircase. They protected everything and worked quietly. Excellent service.",
      author: "Victoria H.",
      moveType: "Conversion flat move, SW6",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Chelsea",
    slug: "chelsea-removals",
    metaTitle: "Chelsea Removals | SW3 Premium House Moves",
    metaDescription:
      "Discreet premium removals in Chelsea SW3. King's Road, Sloane Square and riverside apartments. Fixed quotes, experienced crews and careful high-value handling.",
    h1: "Chelsea removals with premium handling",
    intro:
      "Chelsea clients expect discretion, punctuality and immaculate protection. Many homes are lateral flats in stucco terraces, mansion blocks with porters, or modern riverside apartments with strict lift rules. We plan around building protocols and keep hallways clean throughout the job.",
    propertyTypes: [
      "Stucco-fronted terraces and lateral conversions",
      "Portered mansion blocks near Sloane Square",
      "Riverside apartments with concierge services",
      "Mews houses behind King's Road",
      "High-value rental flats on Cadogan Estate streets",
    ],
    commonMoveTypes: [
      "International-linked moves to and from Chelsea bases",
      "Downsizing from large terraces to serviced apartments",
      "Art, antique and fragile-heavy relocations",
      "Tenancy changeovers for prime rental stock",
      "Office moves for local design and retail businesses",
    ],
    parkingAccessNotes:
      "Chelsea parking is heavily controlled. Suspensions or porter-arranged bays are usually essential. We confirm lift capacity, carpet protection rules and working hours with building management before confirming your slot.",
    localRoads: [
      "King's Road",
      "Fulham Road",
      "Sydney Street",
      "Cadogan Gardens",
      "Cheyne Walk",
      "Royal Hospital Road",
    ],
    localLandmarks: [
      "Sloane Square",
      "King's Road",
      "Royal Hospital Chelsea",
      "Albert Bridge",
      "Duke of York Square",
    ],
    postcodes: ["SW3", "SW10"],
    nearbyAreas: [
      { name: "Kensington", slug: "kensington-removals" },
      { name: "Fulham", slug: "fulham-removals" },
      { name: "Westminster", slug: "kensington-removals" },
      { name: "Putney", slug: "putney-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Chelsea",
        to: "Richmond",
        description:
          "Family retaining a London base while seeking more space by the river.",
      },
      {
        from: "Sloane Square",
        to: "Guildford",
        description:
          "Surrey relocation with school term timing planned around completion.",
      },
      {
        from: "Cheyne Walk",
        to: "Kensington",
        description:
          "Short move between prime areas with fragile contents and tight lift access.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Lateral flat on King's Road to a Sloane Square mansion block. Porter coordination and lift padding.",
        propertyType: "Lateral conversion",
        month: "Recent example",
      },
      {
        summary:
          "Mews house to storage during renovation. Inventory list provided for insurance.",
        propertyType: "Mews house",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Are your crews experienced with portered buildings?",
        answer:
          "Yes. We follow porter instructions, protect lifts and keep common parts tidy throughout Chelsea jobs.",
      },
      {
        question: "Can you handle high-value fragile items?",
        answer:
          "We offer enhanced wrapping and careful handling. Flag antiques and artwork during your survey.",
      },
      {
        question: "Do you work in Cadogan Estate streets?",
        answer:
          "Yes, subject to any estate access rules you share with us in advance.",
      },
    ],
    testimonial: {
      quote:
        "Porter was impressed with how tidy they kept the lift and hallway. Calm, professional and on schedule.",
      author: "Charles F.",
      moveType: "Mansion block move, SW3",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Kensington",
    slug: "kensington-removals",
    metaTitle: "Kensington Removals | W8 House & Flat Moves",
    metaDescription:
      "Expert removals in Kensington W8. Holland Park, High Street and period mansion flats. Fixed quotations and discreet, careful crews.",
    h1: "Kensington removals for W8 properties",
    intro:
      "Kensington homes are often spacious but awkward to access. Tall ceilings, curved staircases, basement kitchens and limited on-street parking all require forethought. We survey properly, quote fixed prices and arrive with the protection and crew skill that larger properties demand.",
    propertyTypes: [
      "Large period flats and maisonettes near Holland Park",
      "Townhouses on Kensington Court and Brunswick Gardens",
      "Apartments on Kensington High Street and Notting Hill border",
      "Mansion blocks with lift and porter services",
      "Family homes south towards Earl's Court",
    ],
    commonMoveTypes: [
      "Whole-house moves from multi-floor townhouses",
      "Downsizing from large flats to smaller serviced apartments",
      "Moves linked to property refurbishment and storage",
      "Professional relocations to and from central London",
      "Partial moves for home office or nursery setup",
    ],
    parkingAccessNotes:
      "Kensington streets are permit-controlled and often congested. We plan suspensions or off-peak slots and confirm whether items need hoisting or special dismantling before booking the vehicle size.",
    localRoads: [
      "Kensington High Street",
      "Holland Park Avenue",
      "Kensington Church Street",
      "Gloucester Road",
      "Earl's Court Road",
      "Palace Green",
    ],
    localLandmarks: [
      "Holland Park",
      "Kensington Palace",
      "Design Museum",
      "Royal Albert Hall",
      "Kensington Gardens",
    ],
    postcodes: ["W8", "W14", "SW7"],
    nearbyAreas: [
      { name: "Chelsea", slug: "chelsea-removals" },
      { name: "Fulham", slug: "fulham-removals" },
      { name: "Richmond", slug: "richmond-removals" },
      { name: "Westminster", slug: "chelsea-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Holland Park",
        to: "Richmond",
        description:
          "Family leaving a large townhouse for riverside living with more garden space.",
      },
      {
        from: "Kensington High Street",
        to: "Guildford",
        description:
          "Surrey move with full packing and garage contents.",
      },
      {
        from: "Earl's Court border",
        to: "Chelsea",
        description:
          "Short west London relocation between rental properties.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Five-bedroom townhouse near Holland Park to a Surrey manor-style home. Multi-day pack and move.",
        propertyType: "Townhouse",
        month: "Recent example",
      },
      {
        summary:
          "Two-bedroom mansion flat to storage during kitchen renovation. Return delivery scheduled.",
        propertyType: "Mansion flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Can you move large items on curved staircases?",
        answer:
          "We assess stair geometry during the survey and bring the right crew and equipment on the day.",
      },
      {
        question: "Is Holland Park Village covered?",
        answer:
          "Yes. W8 and the surrounding Kensington streets are within our regular coverage.",
      },
      {
        question: "Do you offer discreet unmarked vans?",
        answer:
          "Ask when booking. We can discuss vehicle options for sensitive moves.",
      },
    ],
    testimonial: {
      quote:
        "Large townhouse, three floors plus basement. They planned it properly and nothing was left to guesswork.",
      author: "Margaret D.",
      moveType: "Townhouse move, W8",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Richmond",
    slug: "richmond-removals",
    metaTitle: "Richmond Removals | TW9 & TW10 House Moves",
    metaDescription:
      "Premium removals in Richmond upon Thames. Homes near the Green, Richmond Hill and riverside. Fixed quotes, parking planning and careful local crews.",
    h1: "Richmond removals across TW9 and TW10",
    intro:
      "Richmond combines village character with serious access constraints. Hills, one-way systems near the Green, and beautiful but narrow period homes make local knowledge valuable. We move families, professionals and downsizers across Richmond, St Margarets and East Sheen with fixed pricing and full protection.",
    propertyTypes: [
      "Georgian and Victorian houses near Richmond Green",
      "Riverside apartments along the Thames",
      "Family homes on Richmond Hill with sloped drives",
      "Flats in St Margarets and North Sheen",
      "Mews and cottage-style homes near Petersham",
    ],
    commonMoveTypes: [
      "Family moves within Richmond and into Surrey",
      "Downsizing from Hill properties to Green-side flats",
      "Moves from London to Richmond for schools and green space",
      "Office relocations for local businesses",
      "Storage-linked moves during home renovation",
    ],
    parkingAccessNotes:
      "Richmond town centre parking is limited, especially weekends. Hill properties may have steep garden paths. We walk access routes during quoting and match vehicle size to what the street can realistically take.",
    localRoads: [
      "Richmond Hill",
      "Sheen Road",
      "Upper Richmond Road West",
      "Queen's Road",
      "Cross Deep",
      "Ormond Road",
    ],
    localLandmarks: [
      "Richmond Green",
      "Richmond Park",
      "Kew Gardens",
      "Richmond Bridge",
      "Ham House",
    ],
    postcodes: ["TW9", "TW10"],
    nearbyAreas: [
      { name: "Kingston upon Thames", slug: "kingston-upon-thames-removals" },
      { name: "Putney", slug: "putney-removals" },
      { name: "Wimbledon", slug: "wimbledon-removals" },
      { name: "Fulham", slug: "fulham-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Richmond Hill",
        to: "Guildford",
        description:
          "Staying in Surrey while leaving the steepest Richmond streets behind.",
      },
      {
        from: "St Margarets",
        to: "Chelsea",
        description:
          "Professional move back towards central London offices.",
      },
      {
        from: "East Sheen",
        to: "Wimbledon",
        description:
          "Family cross-postcode move within South West London.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Four-bedroom house on Richmond Hill to a barn conversion in Surrey. Piano and garden statuary included.",
        propertyType: "Period house",
        month: "Recent example",
      },
      {
        summary:
          "Riverside flat to a cottage near Petersham. Narrow lane access with smaller van shuttle.",
        propertyType: "Riverside apartment",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover St Margarets and North Sheen?",
        answer:
          "Yes. TW9 and TW10 including the Sheen areas are all within standard coverage.",
      },
      {
        question: "Can you move from properties near Richmond Park?",
        answer:
          "Yes. We plan parking and carrying routes around park traffic and event days where relevant.",
      },
      {
        question: "Are quotes fixed for Richmond moves?",
        answer:
          "Yes. Your agreed price holds provided the access described matches move day reality.",
      },
    ],
    testimonial: {
      quote:
        "Richmond Hill parking is never easy but they had a plan and stuck to it. Careful with our antiques.",
      author: "Peter N.",
      moveType: "Period house move, TW10",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Kingston upon Thames",
    slug: "kingston-upon-thames-removals",
    metaTitle: "Kingston Removals | KT1 & KT2 House Moves",
    metaDescription:
      "Reliable removals in Kingston upon Thames. Town centre flats, Canbury family homes and riverside properties. Fixed quotes and local Surrey-London experience.",
    h1: "Kingston upon Thames removals",
    intro:
      "Kingston sits where London meets Surrey, with busy town centre roads, quiet Canbury streets and riverside walks all in one borough. Students, families and professionals move here for schools, the hospital and good transport links. We handle everything from studio flats to large detached homes with the same fixed-quote clarity.",
    propertyTypes: [
      "Town centre apartments near Kingston station",
      "Victorian and Edwardian houses in Canbury and Tudor Drive area",
      "Riverside homes along the Thames path",
      "New-build developments towards Surbiton border",
      "Student and rental flats in the KT1 postcode",
    ],
    commonMoveTypes: [
      "Family moves within Kingston and into Surrey villages",
      "University term-time student relocations",
      "Downsizing from detached homes to town centre flats",
      "Office moves for Kingston business park tenants",
      "Moves from London into Kingston for schools",
    ],
    parkingAccessNotes:
      "Kingston town centre has active loading restrictions near the Bentall Centre. Canbury streets are residential with permit zones. We schedule around market days and agree realistic parking with you before confirming.",
    localRoads: [
      "Richmond Road",
      "London Road",
      "Cambridge Road",
      "Tudor Drive",
      "Kingston Hill",
      "Portsmouth Road",
    ],
    localLandmarks: [
      "Kingston town centre",
      "Bushy Park",
      "Kingston Bridge",
      "Canbury Gardens",
      "Rose Theatre",
    ],
    postcodes: ["KT1", "KT2"],
    nearbyAreas: [
      { name: "New Malden", slug: "new-malden-removals" },
      { name: "Richmond", slug: "richmond-removals" },
      { name: "Wimbledon", slug: "wimbledon-removals" },
      { name: "Guildford", slug: "guildford-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Canbury",
        to: "Guildford",
        description:
          "Deeper Surrey move while staying on the same railway line.",
      },
      {
        from: "Kingston town centre",
        to: "Wimbledon",
        description:
          "Professional move back towards South West London rental stock.",
      },
      {
        from: "Surbiton border",
        to: "Woking",
        description:
          "Family relocation to a newer Surrey estate with garden equipment.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Three-bedroom Canbury house to a flat in Richmond. Two-day pack for garage workshop contents.",
        propertyType: "Edwardian house",
        month: "Recent example",
      },
      {
        summary:
          "Studio near the station to a shared house in New Malden. Completed in one afternoon.",
        propertyType: "Town centre flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Surbiton included in Kingston coverage?",
        answer:
          "Yes. KT1, KT2 and the wider Kingston area including the Surbiton border are covered.",
      },
      {
        question: "Can you help with student moves?",
        answer:
          "Yes. Smaller loads and flexible timing for term starts and ends are available.",
      },
      {
        question: "Do you move into Surrey from Kingston?",
        answer:
          "Yes. Kingston to Guildford, Woking and villages beyond is routine for us.",
      },
    ],
    testimonial: {
      quote:
        "Moved from Canbury to Guildford. Packing was neat, labelled by room, and nothing went missing.",
      author: "Laura B.",
      moveType: "Family home move, KT2",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "New Malden",
    slug: "new-malden-removals",
    metaTitle: "New Malden Removals | KT3 House & Flat Moves",
    metaDescription:
      "Local removals in New Malden KT3. Semis, flats and family homes near the A3 and station. Fixed quotes and moves across Kingston, Wimbledon and Surrey.",
    h1: "New Malden removals across KT3",
    intro:
      "New Malden is a practical, residential area with strong links to Kingston, Wimbledon and the A3 corridor. Semis with driveways sit next to flats near the high street and station. Moves here are often about efficiency: clear quotes, reliable timing and crews who know the local roads.",
    propertyTypes: [
      "1930s and post-war semis with front drives",
      "Flats and maisonettes near New Malden station",
      "Bungalows on the Coombe Road side",
      "Terraced housing towards Motspur Park",
      "Commercial upper-floor units on the high street",
    ],
    commonMoveTypes: [
      "Moves along the New Malden to Raynes Park corridor",
      "Family relocations into Surrey via the A3",
      "Downsizing within KT3",
      "Landlord changeovers near the station",
      "Part-load furniture deliveries",
    ],
    parkingAccessNotes:
      "The high street and station area get busy quickly. Driveway access on semis is a real advantage and we note it during quoting. For flats without parking we plan bay suspensions or short carries from the nearest legal stop.",
    localRoads: [
      "High Street New Malden",
      "Coombe Road",
      "Malden Road",
      "Beverley Way",
      "Westbury Road",
      "Kingston Road",
    ],
    localLandmarks: [
      "New Malden station",
      "Beverley Park",
      "The A3 corridor",
      "Motspur Park border",
      "Kingston Road shops",
    ],
    postcodes: ["KT3"],
    nearbyAreas: [
      { name: "Raynes Park", slug: "raynes-park-removals" },
      { name: "Kingston upon Thames", slug: "kingston-upon-thames-removals" },
      { name: "Wimbledon", slug: "wimbledon-removals" },
      { name: "Worcester Park", slug: "worcester-park-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "New Malden",
        to: "Wimbledon",
        description:
          "Popular family move within a short drive. Often completed in one day.",
      },
      {
        from: "KT3 semi",
        to: "Guildford",
        description:
          "A3-linked Surrey relocation with full house contents.",
      },
      {
        from: "Station area flat",
        to: "Kingston upon Thames",
        description:
          "Rental move with lift access at the receiving building.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Three-bedroom semi with driveway to a terrace in Raynes Park. Garden shed cleared and moved.",
        propertyType: "1930s semi",
        month: "Recent example",
      },
      {
        summary:
          "Two-bedroom flat near the station to Woking new-build. Afternoon slot after parking suspension confirmed.",
        propertyType: "Flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover Motspur Park and the KT3 border?",
        answer:
          "Yes. The full New Malden area and nearby Motspur Park streets are included.",
      },
      {
        question: "Can you use the A3 route for Surrey moves?",
        answer:
          "Yes. We plan Surrey deliveries from New Malden regularly and price them as fixed journeys.",
      },
      {
        question: "Is weekend availability good in New Malden?",
        answer:
          "Saturdays book ahead but we usually have options if you enquire early.",
      },
    ],
    testimonial: {
      quote:
        "Straightforward move from our semi to Kingston. Quote was clear and the team were friendly and quick.",
      author: "Kevin J.",
      moveType: "Semi-detached move, KT3",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Guildford",
    slug: "guildford-removals",
    metaTitle: "Guildford Removals | Surrey House & Office Moves",
    metaDescription:
      "Professional removals in Guildford GU1 and GU2. Town centre flats, suburban family homes and university area properties. Fixed Surrey quotes and insured crews.",
    h1: "Guildford removals across Surrey",
    intro:
      "Guildford is the county town with a mix of historic streets, modern estates and village-style suburbs on the hills around town. The one-way system and university term dates affect traffic, while larger family homes in areas like Merrow and Onslow need proper crew planning. We move within Guildford and to London with the same fixed-quote approach.",
    propertyTypes: [
      "Town centre apartments near the station and High Street",
      "Detached and semi-detached homes in Merrow and Onslow",
      "Student houses in the university area",
      "Rural-edge properties towards Shalford and Artington",
      "Office units in Guildford business parks",
    ],
    commonMoveTypes: [
      "London to Guildford family relocations",
      "University term moves and parental help runs",
      "Downsizing within Surrey",
      "Office moves within Guildford parks",
      "Moves from Guildford to Woking and other Surrey towns",
    ],
    parkingAccessNotes:
      "Guildford town centre loading windows matter for flat moves. Suburban estates usually offer easier parking but longer carries from rear gardens are common. We confirm access for larger vehicles on hilly or narrow lanes before move day.",
    localRoads: [
      "High Street",
      "London Road",
      "Epsom Road",
      "Portsmouth Road",
      "Stoke Road",
      "Onslow Village Road",
    ],
    localLandmarks: [
      "Guildford Cathedral",
      "Guildford Castle",
      "Stoke Park",
      "University of Surrey",
      "River Wey",
    ],
    postcodes: ["GU1", "GU2"],
    nearbyAreas: [
      { name: "Woking", slug: "woking-removals" },
      { name: "Kingston upon Thames", slug: "kingston-upon-thames-removals" },
      { name: "Wimbledon", slug: "wimbledon-removals" },
      { name: "Richmond", slug: "richmond-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Guildford",
        to: "Wimbledon",
        description:
          "Commuter family moving closer to London while keeping Surrey links.",
      },
      {
        from: "Merrow",
        to: "Woking",
        description:
          "Short Surrey move between similar family housing stock.",
      },
      {
        from: "Town centre",
        to: "Richmond",
        description:
          "Downsizing from suburban Surrey to riverside London living.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Four-bedroom Onslow house to a Wimbledon semi. Two-day pack with loft and garage contents.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "Student house near campus cleared at term end. Items to storage and family home.",
        propertyType: "Student house",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover villages around Guildford?",
        answer:
          "Yes. Merrow, Onslow, Shalford and surrounding GU postcodes are within our Surrey coverage.",
      },
      {
        question: "Can you move from London into Guildford?",
        answer:
          "Yes. South West London to Guildford is one of our most common longer routes.",
      },
      {
        question: "Do you handle office moves in Guildford?",
        answer:
          "Yes. We relocate offices and small businesses with out-of-hours options where needed.",
      },
    ],
    testimonial: {
      quote:
        "London to Guildford with two kids' rooms worth of toys. Everything arrived labelled and intact.",
      author: "Nicola G.",
      moveType: "Family relocation, GU2",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Woking",
    slug: "woking-removals",
    metaTitle: "Woking Removals | GU21 & GU22 Surrey Moves",
    metaDescription:
      "Trusted removals in Woking GU21 and GU22. Town centre flats, Horsell family homes and new estates. Fixed Surrey quotes and links to London moves.",
    h1: "Woking removals in Surrey",
    intro:
      "Woking is a major Surrey hub with fast trains to London, newer estates and established areas like Horsell and Knaphill nearby. Moves range from town centre apartments to large family homes with gardens and home offices. We quote clearly for local Woking jobs and cross-county runs into South West London.",
    propertyTypes: [
      "Town centre apartments near Woking station",
      "Family homes in Horsell and West Byfleet border",
      "New-build estates on the edge of town",
      "Bungalows and chalets in wooded Surrey lanes",
      "Office space in Woking town and business parks",
    ],
    commonMoveTypes: [
      "Surrey internal moves between Woking neighbourhoods",
      "London to Woking family relocations",
      "Downsizing from large detached homes",
      "New-build completion day moves",
      "Office relocations within GU21",
    ],
    parkingAccessNotes:
      "Station area flats need timed loading. New estates often have strict developer rules for removal vans on driveways. Rural lanes towards Horsell may need smaller vehicles or shuttle runs from a main road meeting point.",
    localRoads: [
      "Chertsey Road",
      "Victoria Way",
      "Guildford Road",
      "Horsell High Street",
      "Knaphill Road",
      "Robin Hood Road",
    ],
    localLandmarks: [
      "Woking town centre",
      "Horsell Common",
      "The Lightbox",
      "Woking station",
      "Basingstoke Canal",
    ],
    postcodes: ["GU21", "GU22"],
    nearbyAreas: [
      { name: "Guildford", slug: "guildford-removals" },
      { name: "Kingston upon Thames", slug: "kingston-upon-thames-removals" },
      { name: "Wimbledon", slug: "wimbledon-removals" },
      { name: "Richmond", slug: "richmond-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Woking",
        to: "Putney",
        description:
          "Commuter move closer to the river with school term timing.",
      },
      {
        from: "Horsell",
        to: "Guildford",
        description:
          "Short Surrey relocation between family neighbourhoods.",
      },
      {
        from: "New estate Woking",
        to: "Kingston upon Thames",
        description:
          "Downsizing from a large new-build to a smaller London flat.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Five-bedroom Horsell home to a Putney townhouse. Three crew, piano and garden furniture.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "Town centre flat to new-build on completion day. Keys handover coordinated with solicitor.",
        propertyType: "Apartment",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover Horsell and Knaphill?",
        answer:
          "Yes. GU21, GU22 and the wider Woking area are within our Surrey coverage.",
      },
      {
        question: "Can you move on new-build completion day?",
        answer:
          "Yes. We coordinate with your completion time and site access rules.",
      },
      {
        question: "Do you travel from Woking into London?",
        answer:
          "Yes. Woking to South West London is a standard route for our crews.",
      },
    ],
    testimonial: {
      quote:
        "Completion day nerves but they waited patiently and got us in before evening. Brilliant crew.",
      author: "Mark S.",
      moveType: "New-build move, GU22",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Battersea",
    slug: "battersea-removals",
    metaTitle: "Battersea Removals | SW11 House & Flat Moves",
    metaDescription:
      "Professional removals in Battersea SW11. Power Station apartments, Battersea Park homes and Northcote Road flats. Fixed quotes and parking-aware crews.",
    h1: "Battersea removals across SW11",
    intro:
      "Battersea has shifted from light industrial streets to riverside towers and restored Victorian terraces in a single generation. That mix creates very different moves on the same postcode. We plan around lift bookings at new developments, permit streets near the park, and the tight hallways common in older conversions.",
    propertyTypes: [
      "Riverside apartments at Battersea Power Station and Circus West",
      "Victorian terraces and conversions near Battersea Park",
      "Flats along Northcote Road and Lavender Hill",
      "Maisonettes in the Shaftesbury Estate",
      "Townhouses towards Clapham Junction",
    ],
    commonMoveTypes: [
      "Riverside flat moves with concierge and lift coordination",
      "Family relocations from park-side houses into Surrey",
      "Rental changeovers near Clapham Junction",
      "Downsizing from larger SW11 homes to central London flats",
      "Office moves for businesses around Battersea Reach",
    ],
    parkingAccessNotes:
      "Battersea Park Road and Queenstown Road carry heavy traffic most of the day. New riverside blocks require advance notice for van access. Older streets often need a suspension or an early start before commuter parking fills every bay.",
    localRoads: [
      "Battersea Park Road",
      "Lavender Hill",
      "Queenstown Road",
      "Northcote Road",
      "York Road",
      "Battersea Bridge Road",
    ],
    localLandmarks: [
      "Battersea Power Station",
      "Battersea Park",
      "Clapham Junction",
      "Battersea Arts Centre",
      "Albert Bridge",
    ],
    postcodes: ["SW11", "SW8"],
    nearbyAreas: [
      { name: "Clapham", slug: "clapham-removals" },
      { name: "Wandsworth", slug: "wandsworth-removals" },
      { name: "Fulham", slug: "fulham-removals" },
      { name: "Brixton", slug: "brixton-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Battersea riverside",
        to: "Wandsworth",
        description:
          "Short move between new-build flats and older family housing stock. Lift slots booked at both ends.",
      },
      {
        from: "Northcote Road",
        to: "Richmond",
        description:
          "Family leaving a Victorian terrace for more space west of the river.",
      },
      {
        from: "Clapham Junction area",
        to: "Guildford",
        description:
          "Commuter relocation with full pack and garage clearance included.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Two-bedroom Power Station flat to a house in Wandsworth. Building handbook rules followed and lift protected.",
        propertyType: "Riverside apartment",
        month: "Recent example",
      },
      {
        summary:
          "Three-bedroom terrace near the park to storage during extension works. Return delivery booked for autumn.",
        propertyType: "Victorian terrace",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you move from Battersea Power Station buildings?",
        answer:
          "Yes. We coordinate with concierge teams, lift padding and loading bay times as part of the quote.",
      },
      {
        question: "Is Clapham Junction considered Battersea for your crews?",
        answer:
          "Yes. SW11 around the Junction is regular work for us, including evening and weekend slots.",
      },
      {
        question: "Can you handle narrow Victorian staircases in SW11?",
        answer:
          "We do this weekly. A video walkthrough helps us plan dismantling and crew size before the day.",
      },
    ],
    testimonial: {
      quote:
        "New-build rules were confusing but the team had done it before. Lift left spotless and we were in on time.",
      author: "Olivia R.",
      moveType: "Riverside flat move, SW11",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Southfields",
    slug: "southfields-removals",
    metaTitle: "Southfields Removals | SW18 Local House Moves",
    metaDescription:
      "Trusted removals in Southfields SW18. Edwardian terraces, family semis and flats near the tube. Fixed quotations and Wimbledon border experience.",
    h1: "Southfields removals near the District line",
    intro:
      "Southfields feels like a village tucked inside SW18. Rows of Edwardian houses sit close to Southfields station, with quieter streets running towards Wimbledon Park. Parking is competitive on match weekends and school runs, so we agree realistic arrival windows and vehicle size before confirming your quote.",
    propertyTypes: [
      "Edwardian terraces and semis near Revelstoke Road",
      "Family homes towards Wimbledon Park side",
      "Flats above shops on Replingham Road",
      "Bungalows and chalet houses on the edge of the All England Club area",
      "Rental flats popular with young families",
    ],
    commonMoveTypes: [
      "Moves between Southfields and Wimbledon",
      "Family upsizing towards Putney or Kingston",
      "Tenancy changeovers near the tube",
      "Downsizing after children leave for university",
      "Part-load moves for furniture bought locally",
    ],
    parkingAccessNotes:
      "Replingham Road and Revelstoke Road fill quickly on weekdays. For properties near the tennis club, event traffic can affect access in summer. We use floor protection as standard on polished hallways common in this area.",
    localRoads: [
      "Replingham Road",
      "Revelstoke Road",
      "Merton Road",
      "Durnsford Road",
      "Augustus Road",
      "Parkside Southfields",
    ],
    localLandmarks: [
      "Southfields station",
      "Wimbledon Park",
      "All England Lawn Tennis Club",
      "Southfields Grid",
      "Garratt Park",
    ],
    postcodes: ["SW18", "SW19"],
    nearbyAreas: [
      { name: "Wimbledon", slug: "wimbledon-removals" },
      { name: "Wandsworth", slug: "wandsworth-removals" },
      { name: "Earlsfield", slug: "earlsfield-removals" },
      { name: "Putney", slug: "putney-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Southfields",
        to: "Wimbledon Village",
        description:
          "Short premium move where access at the receiving property matters more than distance.",
      },
      {
        from: "Revelstoke Road",
        to: "Guildford",
        description:
          "Family relocation to Surrey with two-day packing for loft and garage contents.",
      },
      {
        from: "Southfields",
        to: "Richmond",
        description:
          "Downsizing couple leaving a semi for a riverside flat.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Four-bedroom semi near the park to a flat in Putney. Loft cleared and labelled boxes by room.",
        propertyType: "Edwardian semi",
        month: "Recent example",
      },
      {
        summary:
          "One-bedroom flat on Replingham Road to Earlsfield rental. Morning slot before street parking filled.",
        propertyType: "Conversion flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover the full Southfields grid?",
        answer:
          "Yes. SW18 around Southfields station and the park border is within our standard coverage.",
      },
      {
        question: "Can you work around Wimbledon tennis traffic?",
        answer:
          "We plan summer moves with extra time where needed and discuss access when you book.",
      },
      {
        question: "Are quotes fixed for Southfields moves?",
        answer:
          "Yes. The price confirmed after your survey is the price you pay if access matches what was described.",
      },
    ],
    testimonial: {
      quote:
        "Polished floors and a narrow hall. They laid covers first and worked carefully. Very happy.",
      author: "Fiona C.",
      moveType: "Semi-detached move, SW18",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Earlsfield",
    slug: "earlsfield-removals",
    metaTitle: "Earlsfield Removals | SW18 Terrace & Flat Moves",
    metaDescription:
      "Local removals in Earlsfield SW18. Station-side terraces, Garratt Lane flats and family homes. Fixed quotes and experienced South West London crews.",
    h1: "Earlsfield removals around the station",
    intro:
      "Earlsfield is compact, busy and mostly Victorian. Streets fan out from the station towards Garratt Lane and Tooting Bec border, with a mix of owner-occupied terraces and rental flats. Rush-hour footfall and limited parking mean we schedule smart rather than simply sending the largest van available.",
    propertyTypes: [
      "Victorian terraces near Earlsfield station",
      "Flats and maisonettes along Garratt Lane",
      "Family houses towards Summerstown",
      "Conversion flats on Ravenslea Road",
      "Newer apartments near Wimbledon Road",
    ],
    commonMoveTypes: [
      "First-home buyer moves into Earlsfield terraces",
      "Rental changeovers at month end",
      "Moves from Earlsfield to Balham or Tooting",
      "Family relocations into Surrey",
      "Single-item and part-load deliveries",
    ],
    parkingAccessNotes:
      "Station approach roads are congested between 7am and 9am. Many terraces have no off-street parking, so we align with any bay suspension you arrange. Rear access is rare; we measure front door to kerb distance during quoting.",
    localRoads: [
      "Garratt Lane",
      "Ravenslea Road",
      "Summerstown",
      "Tranmere Road",
      "Wimbledon Road",
      "Brodrick Road",
    ],
    localLandmarks: [
      "Earlsfield station",
      "Garratt Park",
      "St Andrew's Church",
      "Summerstown",
      "Wandsworth Common border",
    ],
    postcodes: ["SW18", "SW17"],
    nearbyAreas: [
      { name: "Wandsworth", slug: "wandsworth-removals" },
      { name: "Tooting", slug: "tooting-removals" },
      { name: "Southfields", slug: "southfields-removals" },
      { name: "Balham", slug: "balham-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Earlsfield",
        to: "Clapham",
        description:
          "Popular rental upgrade along the train line. Often completed in a half-day.",
      },
      {
        from: "Garratt Lane",
        to: "Woking",
        description:
          "Young family upsizing to Surrey with nursery furniture handled separately.",
      },
      {
        from: "Earlsfield terrace",
        to: "Putney",
        description:
          "Move from period housing to a riverside flat with lift booking at the new address.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Two-bedroom terrace near the station to Balham flat. Sofa dismantled for tight turn on stairs.",
        propertyType: "Victorian terrace",
        month: "Recent example",
      },
      {
        summary:
          "Three-bedroom house on Ravenslea Road to Guildford. Garage tools boxed and moved.",
        propertyType: "Family terrace",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Summerstown included in Earlsfield coverage?",
        answer:
          "Yes. The SW18 area around the station and Garratt Lane is all covered.",
      },
      {
        question: "Do you offer evening moves in Earlsfield?",
        answer:
          "Limited evening slots exist. Ask when booking if you need to avoid peak station traffic.",
      },
      {
        question: "Can you move a piano from an Earlsfield terrace?",
        answer:
          "Yes, with prior notice. We assess stairs and doorway widths during the survey.",
      },
    ],
    testimonial: {
      quote:
        "Tiny terrace, big sofa. They took it apart and rebuilt it without a scratch. Fair price too.",
      author: "Tom H.",
      moveType: "Terrace move, SW18",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Sutton",
    slug: "sutton-removals",
    metaTitle: "Sutton Removals | SM1 & SM2 House Moves",
    metaDescription:
      "Reliable removals in Sutton SM1 and SM2. Town centre flats, Cheam borders and family semis. Fixed Surrey-London quotes and careful crews.",
    h1: "Sutton removals across SM1 and SM2",
    intro:
      "Sutton sits at the southern edge of Greater London with good links into central London and Surrey. The town centre has busy one-way systems while residential streets towards Cheam and Belmont are quieter but still permit-controlled. We quote fixed prices whether you are moving within Sutton or heading north towards Wimbledon.",
    propertyTypes: [
      "Town centre apartments near Sutton station",
      "1930s semis in Carshalton and Belmont borders",
      "Detached family homes towards Cheam",
      "Flats in the St Nicholas shopping centre area",
      "Office units in Sutton business parks",
    ],
    commonMoveTypes: [
      "Moves within Sutton and into Surrey villages",
      "London to Sutton relocations for schools and space",
      "Downsizing from detached homes to town centre flats",
      "Office relocations in SM1",
      "Student and rental moves at tenancy end",
    ],
    parkingAccessNotes:
      "Sutton High Street loading is restricted during trading hours. Residential roads need permit awareness and sometimes council suspensions for larger vehicles. Hills towards Belmont can affect how we position the van for long carries.",
    localRoads: [
      "Sutton High Street",
      "Brighton Road",
      "Cheam Road",
      "Carshalton Road",
      "Belmont Road",
      "London Road Sutton",
    ],
    localLandmarks: [
      "Sutton town centre",
      "Manor Park",
      "Sutton station",
      "Rose Hill",
      "Nonsuch Park border",
    ],
    postcodes: ["SM1", "SM2", "SM3"],
    nearbyAreas: [
      { name: "Carshalton", slug: "carshalton-removals" },
      { name: "Wimbledon", slug: "wimbledon-removals" },
      { name: "Mitcham", slug: "mitcham-removals" },
      { name: "Epsom", slug: "epsom-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Sutton",
        to: "Wimbledon",
        description:
          "Northbound family move staying on the train corridor with good schools in mind.",
      },
      {
        from: "Belmont",
        to: "Guildford",
        description:
          "Deeper Surrey relocation from a larger detached home.",
      },
      {
        from: "Sutton town centre",
        to: "Croydon",
        description:
          "Rental move with lift access at the receiving building.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Four-bedroom detached in Belmont to Epsom. Two-day pack including garden furniture.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "Town centre flat to Carshalton semi. Afternoon completion after parking suspension confirmed.",
        propertyType: "Apartment",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover Cheam and Belmont from Sutton?",
        answer:
          "Yes. SM1, SM2 and the wider Sutton area including Cheam borders are covered.",
      },
      {
        question: "Can you move from Sutton into central London?",
        answer:
          "Yes. Sutton to South West London is a routine route for our crews.",
      },
      {
        question: "Do you offer packing in Sutton?",
        answer:
          "Yes. Separate packing days are popular before larger family moves.",
      },
    ],
    testimonial: {
      quote:
        "Belmont to Epsom on completion day. They waited when solicitors ran late and still finished calmly.",
      author: "Graham W.",
      moveType: "Detached home move, SM2",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Carshalton",
    slug: "carshalton-removals",
    metaTitle: "Carshalton Removals | SM5 Village House Moves",
    metaDescription:
      "Local removals in Carshalton SM5. Village cottages, Edwardian semis and ponds-side streets. Fixed quotes and Sutton border experience.",
    h1: "Carshalton removals in the SM5 village",
    intro:
      "Carshalton keeps a village feel with the ponds, park and high street at its heart. Properties range from period cottages on narrow lanes to larger semis towards Wallington and Sutton borders. Low bridges and tight corners on older streets sometimes mean we use a smaller van with repeat runs rather than one large lorry.",
    propertyTypes: [
      "Period cottages near Carshalton Ponds",
      "Edwardian and 1930s semis on the park borders",
      "Flats above shops on Carshalton High Street",
      "Family homes towards Wallington and Sutton",
      "Bungalows on quiet residential lanes",
    ],
    commonMoveTypes: [
      "Village house moves within SM5",
      "Relocations from Carshalton to Surrey",
      "Downsizing from family semis to bungalows",
      "Landlord inventory changeovers",
      "Moves linked to loft conversions and extensions",
    ],
    parkingAccessNotes:
      "Carshalton High Street has active loading controls. Ponds area lanes are narrow; we confirm vehicle dimensions before booking. Wallington border streets are easier for parking but carries can be longer from rear gardens.",
    localRoads: [
      "Carshalton High Street",
      "West Street",
      "Park Lane Carshalton",
      "Ruskin Road",
      "Nightingale Road",
      "Banstead Road",
    ],
    localLandmarks: [
      "Carshalton Ponds",
      "Grove Park",
      "All Saints Church",
      "Honeywood Museum",
      "Carshalton station",
    ],
    postcodes: ["SM5"],
    nearbyAreas: [
      { name: "Sutton", slug: "sutton-removals" },
      { name: "Wallington", slug: "wallington-removals" },
      { name: "Mitcham", slug: "mitcham-removals" },
      { name: "Epsom", slug: "epsom-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Carshalton village",
        to: "Sutton",
        description:
          "Short local move often done in a morning with two crew.",
      },
      {
        from: "Carshalton",
        to: "Reigate",
        description:
          "Family heading further into Surrey for schools and garden space.",
      },
      {
        from: "Ponds area cottage",
        to: "Wimbledon",
        description:
          "Upsizing move north with fragile items wrapped individually.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Two-bedroom cottage near the ponds to a Sutton semi. Smaller van used for narrow lane access.",
        propertyType: "Period cottage",
        month: "Recent example",
      },
      {
        summary:
          "Three-bedroom semi to Epsom. Shed contents cleared and garden pots packed.",
        propertyType: "1930s semi",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Can your vans access the ponds area lanes?",
        answer:
          "We survey access first. A smaller vehicle or shuttle from the main road is arranged when needed.",
      },
      {
        question: "Is Wallington covered from your Carshalton team?",
        answer:
          "Yes. SM5 and neighbouring SM6 streets are within standard coverage.",
      },
      {
        question: "Do you move pianos in Carshalton cottages?",
        answer:
          "Yes, with a prior visit or detailed video to plan the route through doors and stairs.",
      },
    ],
    testimonial: {
      quote:
        "Narrow lane meant a smaller van but they still moved our whole house in one day. Well organised.",
      author: "Janet P.",
      moveType: "Cottage move, SM5",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Mitcham",
    slug: "mitcham-removals",
    metaTitle: "Mitcham Removals | CR4 House & Flat Moves",
    metaDescription:
      "Trusted removals in Mitcham CR4. Commonside terraces, town centre flats and family homes. Fixed quotes across Merton and South West London.",
    h1: "Mitcham removals across CR4",
    intro:
      "Mitcham stretches from Mitcham Common to busy London Road and the tram corridor. Housing stock varies from post-war estates to older terraces near the cricket green. We plan moves around tram works, market traffic and the long carries common on estates without adjacent parking.",
    propertyTypes: [
      "Terraces and semis near Mitcham Common",
      "Flats along London Road and the town centre",
      "Family homes towards Colliers Wood and Wimbledon borders",
      "Council and housing association properties with lift access",
      "Commercial upper floors in the retail parade",
    ],
    commonMoveTypes: [
      "Moves along the Mitcham to Wimbledon corridor",
      "Rental changeovers near Mitcham Eastfields",
      "Family relocations into Sutton and Surrey",
      "Downsizing within CR4",
      "Part-load furniture deliveries",
    ],
    parkingAccessNotes:
      "London Road is congested for much of the day. Commonside streets are easier for parking but some have steep garden paths. We confirm whether items need to go through the house when rear access is blocked.",
    localRoads: [
      "London Road Mitcham",
      "Commonside East",
      "Mitcham Road",
      "Streatham Road",
      "Morden Road",
      "Bond Road",
    ],
    localLandmarks: [
      "Mitcham Common",
      "Mitcham Cricket Green",
      "Mitcham Eastfields station",
      "Canons Leisure Centre",
      "Mitcham tram stop",
    ],
    postcodes: ["CR4", "CR0"],
    nearbyAreas: [
      { name: "Tooting", slug: "tooting-removals" },
      { name: "Wimbledon", slug: "wimbledon-removals" },
      { name: "Sutton", slug: "sutton-removals" },
      { name: "Streatham", slug: "streatham-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Mitcham Common",
        to: "Wimbledon",
        description:
          "Northbound family move with school catchment often cited as the reason.",
      },
      {
        from: "Mitcham town centre",
        to: "Croydon",
        description:
          "Rental move with afternoon slot after parking bay confirmed.",
      },
      {
        from: "Colliers Wood border",
        to: "Guildford",
        description:
          "Surrey relocation with garage and shed contents included.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Three-bedroom terrace near the Common to Sutton semi. Children's rooms packed and labelled.",
        propertyType: "Terrace house",
        month: "Recent example",
      },
      {
        summary:
          "Two-bedroom flat on London Road to Streatham rental. Early start to beat shop delivery traffic.",
        propertyType: "Town centre flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover Colliers Wood and Cricket Green?",
        answer:
          "Yes. CR4 including the Common, Cricket Green and town centre is fully covered.",
      },
      {
        question: "Can you work around tram stop congestion?",
        answer:
          "We schedule to avoid peak commuter windows where possible and plan alternative parking.",
      },
      {
        question: "Are Mitcham to Wimbledon moves fixed price?",
        answer:
          "Yes. Your quoted price is fixed once access and inventory are confirmed.",
      },
    ],
    testimonial: {
      quote:
        "Estate parking was awkward but they shuttled from the main road without complaint. Solid work.",
      author: "Dean M.",
      moveType: "Terrace move, CR4",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Streatham",
    slug: "streatham-removals",
    metaTitle: "Streatham Removals | SW16 House & Flat Moves",
    metaDescription:
      "Professional removals in Streatham SW16. Hill slopes, High Road flats and Common-side homes. Fixed quotes and experienced south London crews.",
    h1: "Streatham removals on the SW16 hill",
    intro:
      "Streatham is long, busy and varied. The High Road never really sleeps, while streets off Streatham Common are quieter and often hilly. Top-floor flats without lifts are common, and parking suspensions are part of life for larger moves. We price stair carries clearly and arrive with the protection your floors need.",
    propertyTypes: [
      "Flats and maisonettes along Streatham High Road",
      "Family houses near Streatham Common",
      "Victorian terraces towards Streatham Hill",
      "Modern apartments near Streatham station",
      "Houses on the Norwood border",
    ],
    commonMoveTypes: [
      "High Road rental changeovers",
      "Moves from Streatham Hill to Balham or Clapham",
      "Family relocations into Surrey and Kent borders",
      "Downsizing from larger Common-side homes",
      "Student and shared-house moves",
    ],
    parkingAccessNotes:
      "Streatham High Road loading windows are tight. Hill properties may need parking lower on the slope with longer carries. We discuss realistic timing for completion day when solicitors are involved.",
    localRoads: [
      "Streatham High Road",
      "Streatham Hill",
      "Leigham Court Road",
      "Greyhound Lane",
      "Mitcham Lane",
      "Wellfield Road",
    ],
    localLandmarks: [
      "Streatham Common",
      "Streatham station",
      "The Odeon Streatham",
      "Bishop Thomas Grant School area",
      "St Leonard's Church",
    ],
    postcodes: ["SW16", "SW2"],
    nearbyAreas: [
      { name: "Balham", slug: "balham-removals" },
      { name: "Tooting", slug: "tooting-removals" },
      { name: "Mitcham", slug: "mitcham-removals" },
      { name: "Brixton", slug: "brixton-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Streatham Common",
        to: "Balham",
        description:
          "Popular move along the Northern line with two similar property types.",
      },
      {
        from: "Streatham Hill",
        to: "Croydon",
        description:
          "Downsizing from a larger house to a modern flat near Boxpark.",
      },
      {
        from: "Streatham",
        to: "Guildford",
        description:
          "Family leaving London for Surrey space with full packing service.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Top-floor flat on Streatham Hill to ground-floor rental in Balham. Stair carry priced upfront.",
        propertyType: "Conversion flat",
        month: "Recent example",
      },
      {
        summary:
          "Four-bedroom house near the Common to Reigate. Piano and garden furniture included.",
        propertyType: "Family house",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover Streatham Hill and Streatham Vale?",
        answer:
          "Yes. SW16 from the Common to Norwood border is within our coverage.",
      },
      {
        question: "How do you price steep hill carries?",
        answer:
          "Distance from van to door and floor level are included in your fixed quote after the survey.",
      },
      {
        question: "Can you move on busy High Road weekends?",
        answer:
          "Yes, with early starts recommended. We factor timing into your schedule on booking.",
      },
    ],
    testimonial: {
      quote:
        "Fourth floor, no lift. They were upfront about the stair cost and worked steadily all day.",
      author: "Aisha K.",
      moveType: "Flat move, SW16",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Brixton",
    slug: "brixton-removals",
    metaTitle: "Brixton Removals | SW2 & SW9 Local Moves",
    metaDescription:
      "Reliable removals in Brixton SW2 and SW9. Victorian terraces, market-area flats and Coldharbour Lane homes. Fixed quotes and careful handling.",
    h1: "Brixton removals with local street knowledge",
    intro:
      "Brixton moves fast. Market traffic, busy junctions and densely packed Victorian housing mean timing and parking matter. Many homes are split into flats with awkward shared hallways. We protect common parts, work cleanly and quote fixed prices once we understand your access.",
    propertyTypes: [
      "Victorian terraces and conversions near Brixton Hill",
      "Flats above shops around Brixton Market",
      "Houses in the Railton Road and Loughborough Junction area",
      "Council estates with lift and stair-only blocks",
      "Newer apartments near Brixton station",
    ],
    commonMoveTypes: [
      "Market-area rental changeovers",
      "Moves from Brixton to Clapham and Streatham",
      "Shared-house splits into separate tenancies",
      "Family relocations south towards Dulwich",
      "Creative studio and small office moves",
    ],
    parkingAccessNotes:
      "Atlantic Road and Electric Avenue are difficult for loading at peak times. Coldharbour Lane carries constant traffic. We use early slots or council suspensions where needed and keep hallways tidy in shared buildings.",
    localRoads: [
      "Brixton Road",
      "Coldharbour Lane",
      "Atlantic Road",
      "Brixton Hill",
      "Acre Lane",
      "Effra Road",
    ],
    localLandmarks: [
      "Brixton Market",
      "Brixton station",
      "Ritzy Cinema",
      "Brockwell Park",
      "Windrush Square",
    ],
    postcodes: ["SW2", "SW9"],
    nearbyAreas: [
      { name: "Clapham", slug: "clapham-removals" },
      { name: "Streatham", slug: "streatham-removals" },
      { name: "Herne Hill", slug: "herne-hill-removals" },
      { name: "Dulwich", slug: "dulwich-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Brixton",
        to: "Clapham",
        description:
          "Short south London move along the Victoria line corridor.",
      },
      {
        from: "Brixton Hill",
        to: "Dulwich",
        description:
          "Family upsizing from a conversion flat to a larger house.",
      },
      {
        from: "Brixton",
        to: "Brighton",
        description:
          "Longer distance move with early start and inventory check at both ends.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Two-bedroom conversion near the market to Clapham rental. Shared hallway protected throughout.",
        propertyType: "Conversion flat",
        month: "Recent example",
      },
      {
        summary:
          "Three-bedroom terrace on Brixton Hill to Herne Hill. Dismantling for large IKEA wardrobes.",
        propertyType: "Victorian terrace",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you move from flats above Brixton Market?",
        answer:
          "Yes. We plan timing around market hours and confirm rear access where available.",
      },
      {
        question: "Is Loughborough Junction included?",
        answer:
          "Yes. SW9 and the junction area are covered as part of our Brixton work.",
      },
      {
        question: "Can you split a shared-house move?",
        answer:
          "Yes. We label and separate rooms so each tenant's items go to the right address.",
      },
    ],
    testimonial: {
      quote:
        "Shared house move with three destinations. Everything labelled and nothing mixed up. Impressive.",
      author: "Jordan L.",
      moveType: "Shared-house move, SW9",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Dulwich",
    slug: "dulwich-removals",
    metaTitle: "Dulwich Removals | SE21 Premium House Moves",
    metaDescription:
      "Careful removals in Dulwich SE21. Village houses, College Road estates and East Dulwich borders. Fixed quotes and high-value handling experience.",
    h1: "Dulwich removals for SE21 homes",
    intro:
      "Dulwich attracts families who care about their homes. Large Edwardian houses, village cottages and modern extensions near the park all need careful handling. Driveways help on some roads; others are narrow and tree-lined with limited turning space. We survey properly and quote fixed prices with the right crew and protection.",
    propertyTypes: [
      "Large Edwardian and Victorian houses in Dulwich Village",
      "Family homes on the Alleyn's and Dulwich College roads",
      "Flats and maisonettes towards East Dulwich border",
      "Modern infill houses on quiet lanes",
      "Properties backing onto Dulwich Park",
    ],
    commonMoveTypes: [
      "Whole-house moves within SE21",
      "School-term relocations for Dulwich families",
      "Moves from Dulwich to Surrey and Kent",
      "Downsizing from large houses to village cottages",
      "Fragile and art-heavy moves with extra wrapping",
    ],
    parkingAccessNotes:
      "College Road and Village streets are narrow with school traffic at peak times. We plan around term dates where possible. Large vehicles may need to park on a main road with a shuttle for the final carry on the tightest lanes.",
    localRoads: [
      "College Road",
      "Dulwich Village",
      "East Dulwich Road",
      "Lordship Lane border",
      "Croxted Road",
      "Turney Road",
    ],
    localLandmarks: [
      "Dulwich Park",
      "Dulwich Picture Gallery",
      "Dulwich Village",
      "Alleyn's School",
      "Belair Park",
    ],
    postcodes: ["SE21", "SE22"],
    nearbyAreas: [
      { name: "Herne Hill", slug: "herne-hill-removals" },
      { name: "Brixton", slug: "brixton-removals" },
      { name: "Streatham", slug: "streatham-removals" },
      { name: "Chelsea", slug: "chelsea-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Dulwich Village",
        to: "Richmond",
        description:
          "Family retaining London links while seeking riverside space.",
      },
      {
        from: "East Dulwich border",
        to: "Guildford",
        description:
          "Surrey relocation with nursery and playroom packed separately.",
      },
      {
        from: "Dulwich",
        to: "Chelsea",
        description:
          "Professional move back towards central London employment.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Five-bedroom house near the park to Weybridge. Three crew, two-day pack, fragile art crated.",
        propertyType: "Edwardian house",
        month: "Recent example",
      },
      {
        summary:
          "Village cottage to East Dulwich maisonette. Narrow lane access with smaller van shuttle.",
        propertyType: "Period cottage",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you handle high-value items in Dulwich homes?",
        answer:
          "Yes. Tell us about art, antiques and delicate finishes during quoting so we bring the right materials.",
      },
      {
        question: "Is East Dulwich covered?",
        answer:
          "Yes. SE21 and SE22 borders including Lordship Lane area are within coverage.",
      },
      {
        question: "Can you work around school run traffic?",
        answer:
          "We schedule start times to avoid the busiest College Road windows where practical.",
      },
    ],
    testimonial: {
      quote:
        "Large house, lots of art. They wrapped properly and nothing was rushed. Felt very professional.",
      author: "Catherine B.",
      moveType: "Family home move, SE21",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Herne Hill",
    slug: "herne-hill-removals",
    metaTitle: "Herne Hill Removals | SE24 Victorian Home Moves",
    metaDescription:
      "Local removals in Herne Hill SE24. Brockwell Park streets, Half Moon Lane houses and Denmark Hill borders. Fixed quotes and careful period-home handling.",
    h1: "Herne Hill removals around Brockwell Park",
    intro:
      "Herne Hill sits between Brixton, Dulwich and Denmark Hill with a strong community feel and serious house prices. Victorian terraces and larger family homes near the park need floor protection and patient handling. Rush hour on Norwood Road affects access, so we agree a practical start time with you.",
    propertyTypes: [
      "Victorian terraces and larger houses near Brockwell Park",
      "Flats and conversions on Herne Hill and Half Moon Lane",
      "Family homes towards Tulse Hill border",
      "Maisonettes with garden access",
      "Properties on the Denmark Hill fringe",
    ],
    commonMoveTypes: [
      "Family moves within SE24",
      "Relocations from Herne Hill to Dulwich and Streatham",
      "Young family upsizing near the park",
      "Downsizing to smaller conversions",
      "Moves linked to renovation and storage",
    ],
    parkingAccessNotes:
      "Half Moon Lane and park-side streets are permit zones with limited daytime space. Denmark Hill junction traffic can delay arrival if timed badly. We recommend suspensions for larger homes and confirm vehicle length for mews-style access.",
    localRoads: [
      "Half Moon Lane",
      "Herne Hill",
      "Norwood Road",
      "Burbage Road",
      "Danvers Avenue",
      "Poplar Road",
    ],
    localLandmarks: [
      "Brockwell Park",
      "Brockwell Lido",
      "Herne Hill station",
      "Herne Hill Market",
      "St Paul's Church",
    ],
    postcodes: ["SE24", "SE27"],
    nearbyAreas: [
      { name: "Brixton", slug: "brixton-removals" },
      { name: "Dulwich", slug: "dulwich-removals" },
      { name: "Streatham", slug: "streatham-removals" },
      { name: "Clapham", slug: "clapham-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Herne Hill",
        to: "Dulwich",
        description:
          "Short premium move between similar family housing stock.",
      },
      {
        from: "Brockwell Park side",
        to: "Wimbledon",
        description:
          "Family crossing south west for schools and green space.",
      },
      {
        from: "Herne Hill",
        to: "Brighton",
        description:
          "Coastal relocation with early departure and fixed journey price.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Three-bedroom house on Half Moon Lane to Dulwich Village. Floor runners laid throughout.",
        propertyType: "Victorian house",
        month: "Recent example",
      },
      {
        summary:
          "Two-bedroom conversion to Clapham rental. Norwood Road parking booked via suspension.",
        propertyType: "Conversion flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover Tulse Hill border streets?",
        answer:
          "Yes. SE24 and the immediate Herne Hill area including park-side roads are covered.",
      },
      {
        question: "Can you move during Herne Hill Market hours?",
        answer:
          "We plan around market Saturdays to avoid loading conflicts near the station.",
      },
      {
        question: "Are Brockwell Park road parking rules included in planning?",
        answer:
          "Yes. We factor permit zones and suspensions into your move plan during quoting.",
      },
    ],
    testimonial: {
      quote:
        "Park-side terrace with white carpets. Covers down first, shoes off, very respectful crew.",
      author: "Michael T.",
      moveType: "Terrace move, SE24",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Chiswick",
    slug: "chiswick-removals",
    metaTitle: "Chiswick Removals | W4 House & Riverside Moves",
    metaDescription:
      "Expert removals in Chiswick W4. Turnham Green terraces, Chiswick Mall riverside homes and Gunnersbury borders. Fixed quotes and west London experience.",
    h1: "Chiswick removals across W4",
    intro:
      "Chiswick blends village streets with serious family housing and busy arterial roads. The A4 and Hogarth Roundabout affect journey timing, while riverside properties on Chiswick Mall need careful planning for access and parking. We quote fixed prices and arrive with protection suited to polished floors and tight London hallways.",
    propertyTypes: [
      "Georgian and Victorian houses near Turnham Green",
      "Riverside homes on Chiswick Mall and Eyot Green",
      "Flats on Chiswick High Road and Devonshire Road",
      "Family semis towards Gunnersbury and Acton border",
      "Mews houses behind the High Road",
    ],
    commonMoveTypes: [
      "Riverside house moves with fragile contents",
      "Family relocations from Chiswick to Surrey",
      "Moves between Chiswick and Hammersmith",
      "Downsizing from large houses to High Road flats",
      "Office moves for Chiswick business park tenants",
    ],
    parkingAccessNotes:
      "Chiswick High Road loading is restricted at peak retail hours. Mall and riverside lanes are extremely tight for long vehicles. We confirm turning space and sometimes stage from Chiswick Lane or Devonshire Road.",
    localRoads: [
      "Chiswick High Road",
      "Turnham Green Terrace",
      "Devonshire Road",
      "Grove Park Road",
      "Bath Road",
      "Duke's Avenue",
    ],
    localLandmarks: [
      "Turnham Green",
      "Chiswick House and Gardens",
      "St Nicholas Church",
      "Chiswick Mall",
      "Gunnersbury Park",
    ],
    postcodes: ["W4", "W3"],
    nearbyAreas: [
      { name: "Hammersmith", slug: "hammersmith-removals" },
      { name: "Acton", slug: "acton-removals" },
      { name: "Kew", slug: "kew-removals" },
      { name: "Barnes", slug: "barnes-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Turnham Green",
        to: "Richmond",
        description:
          "Short west London move between similar family neighbourhoods.",
      },
      {
        from: "Chiswick riverside",
        to: "Guildford",
        description:
          "Family leaving the river for Surrey schools and garden space.",
      },
      {
        from: "Chiswick",
        to: "Kensington",
        description:
          "Professional move closer to central offices with lift booking.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Four-bedroom house near Turnham Green to Barnes. Antique dining table crated separately.",
        propertyType: "Victorian house",
        month: "Recent example",
      },
      {
        summary:
          "Riverside flat to storage during refurbishment. Inventory list for insurance provided.",
        propertyType: "Riverside apartment",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you move from Chiswick Mall properties?",
        answer:
          "Yes, with prior access planning. We confirm vehicle size and parking on a nearby main road if needed.",
      },
      {
        question: "Is Gunnersbury included in Chiswick coverage?",
        answer:
          "Yes. W4 including Gunnersbury border streets is within standard coverage.",
      },
      {
        question: "Can you avoid Hogarth Roundabout delays?",
        answer:
          "We schedule around peak traffic and allow realistic journey time for cross-west London legs.",
      },
    ],
    testimonial: {
      quote:
        "Riverside lane was tight but they knew the drill. Careful with our hall floors and very polite.",
      author: "Philippa S.",
      moveType: "Riverside home move, W4",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Barnes",
    slug: "barnes-removals",
    metaTitle: "Barnes Removals | SW13 Village House Moves",
    metaDescription:
      "Premium removals in Barnes SW13. Village green houses, Castelnau terraces and riverside walks. Fixed quotes and careful local handling.",
    h1: "Barnes removals in the SW13 village",
    intro:
      "Barnes feels like a Thames-side village inside London. The high street, common and riverside paths create charm and access challenges in equal measure. Many homes have steps from the street, low bridges nearby and polished interiors that need proper protection before loading begins.",
    propertyTypes: [
      "Village houses and cottages near Barnes Green",
      "Terraces and semis on Castelnau and Rocks Lane",
      "Riverside apartments with strict building rules",
      "Family homes towards East Sheen border",
      "Flats above Barnes High Street shops",
    ],
    commonMoveTypes: [
      "Village house moves within SW13",
      "Relocations from Barnes to Richmond and Putney",
      "Downsizing from family homes to riverside flats",
      "Moves linked to renovation near the common",
      "Fragile-heavy moves with art and antiques",
    ],
    parkingAccessNotes:
      "Barnes High Street has loading limits during shop hours. Castelnau carries through traffic to Hammersmith Bridge. We often use early starts and floor protection throughout hallways and stairwells.",
    localRoads: [
      "Barnes High Street",
      "Castelnau",
      "Rocks Lane",
      "Mill Hill Road",
      "Church Road Barnes",
      "The Terrace",
    ],
    localLandmarks: [
      "Barnes Common",
      "Barnes Green",
      "London Wetland Centre",
      "Barnes Bridge",
      "Olympic Studios area",
    ],
    postcodes: ["SW13"],
    nearbyAreas: [
      { name: "Richmond", slug: "richmond-removals" },
      { name: "Putney", slug: "putney-removals" },
      { name: "Chiswick", slug: "chiswick-removals" },
      { name: "Kew", slug: "kew-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Barnes village",
        to: "Richmond",
        description:
          "Short move between two village-style areas with similar access issues.",
      },
      {
        from: "Castelnau",
        to: "Weybridge",
        description:
          "Family crossing the river into Surrey with garden equipment moved.",
      },
      {
        from: "Barnes",
        to: "Chelsea",
        description:
          "Downsizing from a house to a lateral flat with porter coordination.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Three-bedroom house on Rocks Lane to Richmond flat. Large bookcase dismantled and rebuilt.",
        propertyType: "Family house",
        month: "Recent example",
      },
      {
        summary:
          "Village cottage to Putney riverside. Early morning slot for High Street loading.",
        propertyType: "Period cottage",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover East Sheen border streets?",
        answer:
          "Yes. SW13 including Castelnau, Rocks Lane and the village centre is fully covered.",
      },
      {
        question: "Can you move antiques from Barnes village homes?",
        answer:
          "Yes. Enhanced wrapping is available when you flag fragile items during the survey.",
      },
      {
        question: "Is Barnes Bridge traffic considered in timing?",
        answer:
          "Yes. We allow for local traffic when scheduling cross-river journeys.",
      },
    ],
    testimonial: {
      quote:
        "Village house with awkward stairs. They measured first and brought the right tools. Spotless finish.",
      author: "Henry D.",
      moveType: "Village house move, SW13",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Kew",
    slug: "kew-removals",
    metaTitle: "Kew Removals | TW9 Riverside & Green Moves",
    metaDescription:
      "Careful removals in Kew TW9. Green-side family homes, station flats and Kew Gardens borders. Fixed quotes and Richmond-Kingston corridor experience.",
    h1: "Kew removals near the Green and Gardens",
    intro:
      "Kew is green, residential and surprisingly varied. Streets near the Gardens attract family houses with gardens, while flats near Kew Gardens station suit commuters. North Sheen border roads link into Mortlake and Richmond. We plan parking around school traffic and visitor congestion near the botanic gardens.",
    propertyTypes: [
      "Family houses on Kew Green and surrounding lanes",
      "Flats near Kew Gardens station",
      "Victorian terraces towards North Sheen",
      "Riverside properties on the Mortlake border",
      "Apartments in newer developments off Sandycombe Road",
    ],
    commonMoveTypes: [
      "Family moves within TW9",
      "Relocations from Kew to Kingston and Richmond",
      "Downsizing from houses to station-area flats",
      "Moves into Kew for schools and green space",
      "Storage-linked moves during renovation",
    ],
    parkingAccessNotes:
      "Kew Green has event and school parking pressure. Sandycombe Road carries steady traffic. Narrow lanes near the river may need a smaller van for final delivery with shuttle from a wider road.",
    localRoads: [
      "Kew Green",
      "Sandycombe Road",
      "Kew Road",
      "North Road Kew",
      "Lichfield Road",
      "Mortlake High Street border",
    ],
    localLandmarks: [
      "Kew Gardens",
      "Kew Green",
      "Kew Bridge",
      "St Anne's Church",
      "The National Archives",
    ],
    postcodes: ["TW9", "TW10"],
    nearbyAreas: [
      { name: "Richmond", slug: "richmond-removals" },
      { name: "Chiswick", slug: "chiswick-removals" },
      { name: "Twickenham", slug: "twickenham-removals" },
      { name: "Kingston upon Thames", slug: "kingston-upon-thames-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Kew Green",
        to: "Kingston upon Thames",
        description:
          "Family staying local but moving for a larger garden.",
      },
      {
        from: "Kew",
        to: "Guildford",
        description:
          "Surrey relocation with loft and garage cleared.",
      },
      {
        from: "North Sheen",
        to: "Putney",
        description:
          "Commuter move closer to the District line.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Four-bedroom house on Kew Green to Esher. Piano and garden statuary moved with care.",
        propertyType: "Period house",
        month: "Recent example",
      },
      {
        summary:
          "Two-bedroom flat near the station to Richmond. Lift booked and building rules followed.",
        propertyType: "Station-area flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover North Sheen as part of Kew?",
        answer:
          "Yes. TW9 including Kew Green, station area and North Sheen borders is covered.",
      },
      {
        question: "Can you work around Kew Gardens visitor traffic?",
        answer:
          "We schedule to avoid the busiest visitor windows where practical.",
      },
      {
        question: "Do you move from Mortlake border properties?",
        answer:
          "Yes. Riverside and Mortlake fringe streets are included in our Kew coverage.",
      },
    ],
    testimonial: {
      quote:
        "Green-side house with a busy family. They labelled kids' rooms first and kept us on schedule.",
      author: "Sophie A.",
      moveType: "Family home move, TW9",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Twickenham",
    slug: "twickenham-removals",
    metaTitle: "Twickenham Removals | TW1 & TW2 House Moves",
    metaDescription:
      "Local removals in Twickenham TW1 and TW2. St Margarets terraces, rugby stadium area homes and riverside flats. Fixed quotes and Thames-side experience.",
    h1: "Twickenham removals across TW1 and TW2",
    intro:
      "Twickenham mixes rugby crowds, riverside living and quiet St Margarets streets. Match days affect parking near the stadium while the Embankment offers tight access to flats with river views. We agree realistic schedules and quote fixed prices once we know your property layout.",
    propertyTypes: [
      "Victorian and Edwardian houses in St Margarets",
      "Riverside flats on the Twickenham Embankment",
      "Family semis towards Teddington border",
      "Flats near Twickenham Green",
      "Properties in the stadium and town centre fringe",
    ],
    commonMoveTypes: [
      "St Margarets family moves within TW1",
      "Relocations from Twickenham to Kingston and Richmond",
      "Rental changeovers near the station",
      "Downsizing from houses to Embankment flats",
      "Moves timed around rugby event calendars",
    ],
    parkingAccessNotes:
      "Stadium event days restrict parking across large parts of TW1. Embankment lanes are narrow with limited turning room. We ask about match fixtures when you book and plan suspensions for larger house moves.",
    localRoads: [
      "King Street Twickenham",
      "St Margarets Road",
      "Twickenham Embankment",
      "Heath Road",
      "Cross Deep",
      "London Road Twickenham",
    ],
    localLandmarks: [
      "Twickenham Stadium",
      "Twickenham Green",
      "Marble Hill House",
      "Strawberry Hill",
      "Twickenham Bridge",
    ],
    postcodes: ["TW1", "TW2"],
    nearbyAreas: [
      { name: "Richmond", slug: "richmond-removals" },
      { name: "Teddington", slug: "kingston-upon-thames-removals" },
      { name: "Kew", slug: "kew-removals" },
      { name: "Surbiton", slug: "surbiton-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "St Margarets",
        to: "Richmond",
        description:
          "Short Thames-side move between similar Victorian housing.",
      },
      {
        from: "Twickenham",
        to: "Weybridge",
        description:
          "Family crossing into Surrey with home office equipment packed separately.",
      },
      {
        from: "Twickenham Green",
        to: "Putney",
        description:
          "Downsizing move to a riverside flat with lift coordination.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Three-bedroom St Margarets house to Teddington. Move scheduled away from stadium event day.",
        propertyType: "Edwardian house",
        month: "Recent example",
      },
      {
        summary:
          "Embankment flat to Kingston riverside. Smaller van for final lane delivery.",
        propertyType: "Riverside flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you avoid stadium match days?",
        answer:
          "We check fixtures when you book and reschedule if parking would be unrealistic.",
      },
      {
        question: "Is Strawberry Hill included?",
        answer:
          "Yes. TW1 including St Margarets, Green and Strawberry Hill is covered.",
      },
      {
        question: "Can you move from Twickenham to Surrey same day?",
        answer:
          "Yes. Twickenham to Weybridge, Esher and beyond are standard fixed-price routes.",
      },
    ],
    testimonial: {
      quote:
        "They checked the rugby calendar before confirming our date. Smart planning and a smooth move.",
      author: "Andrew G.",
      moveType: "St Margarets move, TW1",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Surbiton",
    slug: "surbiton-removals",
    metaTitle: "Surbiton Removals | KT5 & KT6 Fast Train Corridor",
    metaDescription:
      "Reliable removals in Surbiton KT5 and KT6. Victorian station streets, Maple Road homes and Thames Ditton borders. Fixed Surrey-London quotes.",
    h1: "Surbiton removals on the fast line",
    intro:
      "Surbiton is popular with commuters who want a quick train and a proper house. Streets near the station are Victorian and often split into flats, while areas towards Tolworth and Thames Ditton offer larger semis and detached homes. We know the parking quirks around Maple Road and the one-way systems near the clock tower.",
    propertyTypes: [
      "Victorian houses and conversions near Surbiton station",
      "Family semis towards Tolworth and Hinchley Wood borders",
      "Flats on Maple Road and Victoria Road",
      "Riverside properties towards Thames Ditton",
      "Newer apartments in Surbiton town centre",
    ],
    commonMoveTypes: [
      "Commuter moves between Surbiton and central London",
      "Family relocations within KT5 and KT6",
      "Moves from Surbiton to Guildford and Woking",
      "Downsizing from detached homes to station flats",
      "Landlord changeovers on Maple Road rentals",
    ],
    parkingAccessNotes:
      "Station approach roads are busy between 7am and 9am. Maple Road loading needs sensible timing. Thames Ditton lanes are narrower and may require shuttle delivery from a wider street.",
    localRoads: [
      "Maple Road",
      "Victoria Road Surbiton",
      "Ewell Road",
      "Kingston Road Surbiton",
      "St Mark's Hill",
      "Surbiton Crescent",
    ],
    localLandmarks: [
      "Surbiton station",
      "Surbiton clock tower",
      "Alexandra Recreation Ground",
      "Thames Ditton border",
      "Hampton Court Park fringe",
    ],
    postcodes: ["KT5", "KT6"],
    nearbyAreas: [
      { name: "Kingston upon Thames", slug: "kingston-upon-thames-removals" },
      { name: "New Malden", slug: "new-malden-removals" },
      { name: "Esher", slug: "esher-removals" },
      { name: "Twickenham", slug: "twickenham-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Surbiton station area",
        to: "Wimbledon",
        description:
          "Northbound move staying on a fast train corridor.",
      },
      {
        from: "Surbiton",
        to: "Guildford",
        description:
          "Deeper Surrey move from a larger semi.",
      },
      {
        from: "Thames Ditton border",
        to: "Cobham",
        description:
          "Upsizing within Surrey with garden furniture included.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Four-bedroom semi in Tolworth border to Cobham. Two-day pack with loft clearance.",
        propertyType: "Family semi",
        month: "Recent example",
      },
      {
        summary:
          "Station-area flat to Clapham rental. Evening slot after commuter parking eased.",
        propertyType: "Conversion flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover Tolworth and Hinchley Wood?",
        answer:
          "Yes. KT5, KT6 and Surbiton borders including Tolworth are covered.",
      },
      {
        question: "Can you move on weekdays for commuters?",
        answer:
          "Yes. We offer early starts and off-peak timing to suit work schedules.",
      },
      {
        question: "Is Thames Ditton included?",
        answer:
          "Yes. Riverside streets on the Ditton fringe are part of our Surbiton work.",
      },
    ],
    testimonial: {
      quote:
        "Maple Road parking is never easy. They had a plan and we were loaded before midday.",
      author: "Claire N.",
      moveType: "Semi-detached move, KT6",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Worcester Park",
    slug: "worcester-park-removals",
    metaTitle: "Worcester Park Removals | KT4 Family Home Moves",
    metaDescription:
      "Local removals in Worcester Park KT4. Central Road semis, station flats and Nonsuch Park borders. Fixed quotes across Kingston and Sutton.",
    h1: "Worcester Park removals in KT4",
    intro:
      "Worcester Park is a practical suburban pocket between Kingston, Sutton and Ewell. Central Road carries steady traffic while quieter streets towards Nonsuch Park offer driveways and family semis. We quote fixed prices for local moves and longer runs into central London or deeper Surrey.",
    propertyTypes: [
      "1930s semis with front drives on residential crescents",
      "Flats near Worcester Park station",
      "Bungalows towards Stoneleigh border",
      "Terraces and semis off Central Road",
      "Family homes near Nonsuch Park",
    ],
    commonMoveTypes: [
      "Moves between Worcester Park and New Malden",
      "Family upsizing towards Epsom and Surrey",
      "Downsizing within KT4",
      "First-home buyer moves into semis",
      "Garage and shed clearance as part of house moves",
    ],
    parkingAccessNotes:
      "Central Road is busy but usually offers short loading windows. Station area streets fill on weekdays. Driveway access on semis speeds the job; we note this during your survey.",
    localRoads: [
      "Central Road Worcester Park",
      "The Hamptons",
      "Grand Drive border",
      "Sparrow Farm Road",
      "Grafton Road",
      "Cheam Common Road",
    ],
    localLandmarks: [
      "Worcester Park station",
      "Nonsuch Park",
      "Auriol Park",
      "Stoneleigh Broadway border",
      "Central Road shops",
    ],
    postcodes: ["KT4"],
    nearbyAreas: [
      { name: "New Malden", slug: "new-malden-removals" },
      { name: "Sutton", slug: "sutton-removals" },
      { name: "Epsom", slug: "epsom-removals" },
      { name: "Kingston upon Thames", slug: "kingston-upon-thames-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Worcester Park",
        to: "Wimbledon",
        description:
          "Northbound family move with good schools often mentioned.",
      },
      {
        from: "Worcester Park semi",
        to: "Epsom",
        description:
          "Short Surrey-edge relocation from one semi to another.",
      },
      {
        from: "Worcester Park",
        to: "Clapham",
        description:
          "Young professional move back towards central London rental stock.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Three-bedroom semi with drive to Epsom detached. Garden shed dismantled and rebuilt.",
        propertyType: "1930s semi",
        month: "Recent example",
      },
      {
        summary:
          "Flat near station to New Malden house. Morning slot before commuter parking filled.",
        propertyType: "Station-area flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Stoneleigh covered from Worcester Park?",
        answer:
          "Yes. KT4 including Stoneleigh border and Nonsuch Park area is covered.",
      },
      {
        question: "Can you move a full garage workshop?",
        answer:
          "Yes. Tools and heavy items are noted during quoting so the right vehicle and crew are booked.",
      },
      {
        question: "Do you offer fixed quotes for KT4?",
        answer:
          "Yes. WhatsApp walkthroughs are enough for most Worcester Park homes.",
      },
    ],
    testimonial: {
      quote:
        "Semi to semi across KT4. Straightforward quote, friendly crew, done by mid afternoon.",
      author: "Paul E.",
      moveType: "Semi-detached move, KT4",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Epsom",
    slug: "epsom-removals",
    metaTitle: "Epsom Removals | KT17 & KT18 Surrey Moves",
    metaDescription:
      "Trusted removals in Epsom KT17 and KT18. Town centre flats, Downs-side homes and racecourse area properties. Fixed Surrey quotes and insured crews.",
    h1: "Epsom removals across the Downs",
    intro:
      "Epsom combines a busy town centre with handsome streets on the Downs and quieter suburbs towards Ewell and Tattenham Corner. Race days and market traffic affect central parking while hillside properties need planning for long garden paths. We move locally and to London with fixed quotations.",
    propertyTypes: [
      "Town centre apartments near Epsom station",
      "Large family homes on the Downs and Woodcote area",
      "Victorian terraces towards Ewell border",
      "Modern estates on the edge of town",
      "Bungalows and chalets near Tattenham Corner",
    ],
    commonMoveTypes: [
      "Moves within Epsom and into Leatherhead corridor",
      "London to Epsom relocations for space and schools",
      "Downsizing from larger homes to town centre flats",
      "Racecourse area moves timed around events",
      "Office moves for Epsom business parks",
    ],
    parkingAccessNotes:
      "Ashley Road and High Street loading is restricted during trading hours. Downs roads can be steep with limited turning space for the largest lorries. We confirm gradient and access on sloped drives during the survey.",
    localRoads: [
      "Epsom High Street",
      "Ashley Road",
      "Dorking Road",
      "Reigate Road Epsom",
      "Chalk Lane",
      "Tattenham Corner Road",
    ],
    localLandmarks: [
      "Epsom Downs",
      "Epsom racecourse",
      "Rosebery Park",
      "Epsom station",
      "Horton Country Park border",
    ],
    postcodes: ["KT17", "KT18", "KT19"],
    nearbyAreas: [
      { name: "Ewell", slug: "epsom-removals" },
      { name: "Leatherhead", slug: "leatherhead-removals" },
      { name: "Sutton", slug: "sutton-removals" },
      { name: "Worcester Park", slug: "worcester-park-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Epsom Downs",
        to: "Wimbledon",
        description:
          "Family move north with larger garden at the Surrey end.",
      },
      {
        from: "Epsom town centre",
        to: "Guildford",
        description:
          "Staying in Surrey with a move to university town housing.",
      },
      {
        from: "Epsom",
        to: "Brighton",
        description:
          "Coastal relocation with fixed journey pricing.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Five-bedroom Downs house to Cobham. Three crew, fragile items and wine collection packed separately.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "Town centre flat to Leatherhead bungalow. Lift access at departure, drive at arrival.",
        propertyType: "Apartment",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you work around racecourse event days?",
        answer:
          "Yes. We check local event calendars when you book central Epsom moves.",
      },
      {
        question: "Is Ewell covered as part of Epsom?",
        answer:
          "Yes. KT17, KT18 and Ewell border streets are within coverage.",
      },
      {
        question: "Can you move from Epsom to central London?",
        answer:
          "Yes. Epsom to South West London is a routine route with fixed pricing.",
      },
    ],
    testimonial: {
      quote:
        "Downs house with a sloped drive. They positioned the van safely and took their time. No damage at all.",
      author: "Susan R.",
      moveType: "Detached home move, KT18",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Esher",
    slug: "esher-removals",
    metaTitle: "Esher Removals | KT10 Premium Surrey Moves",
    metaDescription:
      "Premium removals in Esher KT10. Claremont Park roads, Esher high street and Thames Ditton borders. Fixed quotes for high-value Surrey homes.",
    h1: "Esher removals for KT10 properties",
    intro:
      "Esher is established Surrey suburbia with large detached homes, gated drives and quiet lanes near Claremont Landscape Garden. Sandown Park race days and A307 traffic affect timing. Clients here often need careful handling, clear communication and crews who respect high-spec interiors.",
    propertyTypes: [
      "Large detached homes on Claremont Park roads",
      "Family houses in West End Esher and Copsem Lane area",
      "Flats and townhouses near Esher station",
      "Properties towards Thames Ditton and Hampton Court fringe",
      "Renovation projects requiring storage-linked moves",
    ],
    commonMoveTypes: [
      "Whole-house moves within KT10",
      "Esher to London moves for work",
      "Downsizing within Esher village areas",
      "Moves into Esher from Kingston and Surbiton",
      "Fragile and art-heavy relocations",
    ],
    parkingAccessNotes:
      "Copsem Lane and Portsmouth Road carry heavy traffic. Gated drives need access codes shared before the day. Some lanes near the park are narrow; we confirm vehicle length and turning space in advance.",
    localRoads: [
      "High Street Esher",
      "Copsem Lane",
      "Portsmouth Road",
      "Park Road Esher",
      "Milbourne Lane",
      "Couchmore Green",
    ],
    localLandmarks: [
      "Claremont Landscape Garden",
      "Sandown Park",
      "Esher station",
      "Esher Common",
      "Hampton Court fringe",
    ],
    postcodes: ["KT10"],
    nearbyAreas: [
      { name: "Cobham", slug: "cobham-removals" },
      { name: "Surbiton", slug: "surbiton-removals" },
      { name: "Kingston upon Thames", slug: "kingston-upon-thames-removals" },
      { name: "Weybridge", slug: "weybridge-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Esher",
        to: "Chelsea",
        description:
          "Professional move back towards central London with porter buildings at arrival.",
      },
      {
        from: "Claremont area",
        to: "Cobham",
        description:
          "Staying in premium Surrey with a move to a larger plot.",
      },
      {
        from: "Esher",
        to: "Richmond",
        description:
          "Family crossing the river for London lifestyle with Surrey space left behind.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Detached home on Copsem Lane to Weybridge. Wine cellar and gym equipment moved separately.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "Esher station townhouse to Surbiton flat. Two-day pack for home office and nursery.",
        propertyType: "Townhouse",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you handle gated drive properties in Esher?",
        answer:
          "Yes. Share gate codes and any weight limits during booking so we arrive prepared.",
      },
      {
        question: "Is Thames Ditton fringe included?",
        answer:
          "Yes. KT10 including borders towards Ditton and West End Esher is covered.",
      },
      {
        question: "Can you provide enhanced wrapping for high-value homes?",
        answer:
          "Yes. Flag antiques, art and delicate surfaces during your survey.",
      },
    ],
    testimonial: {
      quote:
        "High-spec kitchen and marble floors. Protection was thorough and the team were discreet. Excellent.",
      author: "Jonathan W.",
      moveType: "Detached home move, KT10",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Cobham",
    slug: "cobham-removals",
    metaTitle: "Cobham Removals | KT11 Surrey Family Home Moves",
    metaDescription:
      "Expert removals in Cobham KT11. Portsmouth Road estates, Stoke d'Abernon village and Painshill borders. Fixed Surrey quotes and large-home experience.",
    h1: "Cobham removals across KT11",
    intro:
      "Cobham is one of Surrey's best-known residential addresses. Large plots, private lanes and premium finishes are normal here. Portsmouth Road traffic is constant, while village lanes near Stoke d'Abernon need smaller vehicles or careful positioning. We survey large homes properly and quote fixed crew days.",
    propertyTypes: [
      "Detached executive homes on private roads",
      "Village properties in Stoke d'Abernon",
      "Townhouses near Cobham station",
      "Homes bordering Painshill Park and Fairmile",
      "New-build completions on edge-of-town estates",
    ],
    commonMoveTypes: [
      "Large whole-house relocations within KT11",
      "Cobham to London moves for commuting families",
      "International-linked moves with storage phases",
      "Downsizing within Cobham village",
      "Garage, gym and garden building contents",
    ],
    parkingAccessNotes:
      "Private estates issue their own van rules. Fairmile and Portsmouth Road need realistic timing around rush hour. Long gravel drives require us to confirm ground conditions before heavy vehicles cross them.",
    localRoads: [
      "Portsmouth Road Cobham",
      "Between Streets",
      "Fairmile",
      "Stoke Road",
      "Downside Road",
      "Anyards Road",
    ],
    localLandmarks: [
      "Painshill Park",
      "Cobham station",
      "Stoke d'Abernon",
      "Cobham Mill",
      "Silvermere Lake",
    ],
    postcodes: ["KT11"],
    nearbyAreas: [
      { name: "Esher", slug: "esher-removals" },
      { name: "Weybridge", slug: "weybridge-removals" },
      { name: "Leatherhead", slug: "leatherhead-removals" },
      { name: "Guildford", slug: "guildford-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Cobham",
        to: "Kensington",
        description:
          "Family keeping a London base while retaining a Surrey property.",
      },
      {
        from: "Stoke d'Abernon",
        to: "Weybridge",
        description:
          "Short premium Surrey move between village-style addresses.",
      },
      {
        from: "Cobham estate",
        to: "Guildford",
        description:
          "Relocation towards university town with full packing service.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Six-bedroom Fairmile home to Cobham village cottage. Downsizing with auction items to storage.",
        propertyType: "Executive detached",
        month: "Recent example",
      },
      {
        summary:
          "New-build completion day move from Surbiton. Developer access rules followed on drive.",
        propertyType: "New-build house",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you move large homes with outbuildings?",
        answer:
          "Yes. Gym equipment, garden offices and pool houses are listed during quoting.",
      },
      {
        question: "Is Stoke d'Abernon covered?",
        answer:
          "Yes. KT11 including village lanes and Painshill borders is fully covered.",
      },
      {
        question: "Can you coordinate multi-day packing in Cobham?",
        answer:
          "Yes. Larger homes often book a separate pack day before the main move.",
      },
    ],
    testimonial: {
      quote:
        "Big house, lots of kit. Three days planned properly and the crew leader kept us informed throughout.",
      author: "Diana L.",
      moveType: "Executive home move, KT11",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Weybridge",
    slug: "weybridge-removals",
    metaTitle: "Weybridge Removals | KT13 Thames & Brooklands Moves",
    metaDescription:
      "Premium removals in Weybridge KT13. Brooklands, Oatlands Park and town centre homes. Fixed Surrey quotes and riverside corridor experience.",
    h1: "Weybridge removals in KT13",
    intro:
      "Weybridge sits on the Thames with Brooklands history and modern executive housing side by side. St George's Hill addresses need privacy and careful access planning. Town centre flats suit commuters while Oatlands Park roads offer larger family plots. We handle high-value contents and fixed-price Surrey moves daily.",
    propertyTypes: [
      "Executive homes on St George's Hill and private estates",
      "Town centre apartments near Weybridge station",
      "Family houses in Oatlands Park and Queens Road area",
      "Riverside properties along the Thames",
      "Brooklands adjacent new developments",
    ],
    commonMoveTypes: [
      "Whole-house moves on private estates",
      "Weybridge to London commuter relocations",
      "Downsizing from Hill properties to town centre",
      "Moves into Weybridge from Esher and Cobham",
      "Office moves for Brooklands business park",
    ],
    parkingAccessNotes:
      "St George's Hill has strict access and security procedures. Station area parking is easier but still permit-aware. Riverside lanes are tight; we confirm vehicle choice during the survey.",
    localRoads: [
      "Queens Road Weybridge",
      "Heath Road",
      "Brooklands Road",
      "Oatlands Drive",
      "Church Street Weybridge",
      "St Georges Avenue",
    ],
    localLandmarks: [
      "Brooklands Museum",
      "Oatlands Park Hotel",
      "Weybridge station",
      "River Wey",
      "St George's Hill",
    ],
    postcodes: ["KT13"],
    nearbyAreas: [
      { name: "Esher", slug: "esher-removals" },
      { name: "Cobham", slug: "cobham-removals" },
      { name: "Walton", slug: "weybridge-removals" },
      { name: "Chertsey", slug: "weybridge-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Weybridge",
        to: "Richmond",
        description:
          "Thames-side family crossing the river into London.",
      },
      {
        from: "St George's Hill",
        to: "Chelsea",
        description:
          "Downsizing to a portered flat with fragile contents.",
      },
      {
        from: "Weybridge station area",
        to: "Woking",
        description:
          "Shorter Surrey move between commuter towns.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Oatlands Park house to Esher. Garden statuary and gym equipment moved with specialist trolleys.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "Town centre flat to Brooklands new-build. Lift and loading bay booked at arrival.",
        propertyType: "Apartment",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you move from St George's Hill estates?",
        answer:
          "Yes. Security passes and access rules are confirmed before we dispatch crew.",
      },
      {
        question: "Is Brooklands business park covered?",
        answer:
          "Yes. Office and commercial moves in KT13 are available with out-of-hours options.",
      },
      {
        question: "Can you move riverside properties in Weybridge?",
        answer:
          "Yes. We plan lane access and parking on a main road where riverside paths are pedestrian only.",
      },
    ],
    testimonial: {
      quote:
        "Estate security was handled smoothly. Professional team and our antiques arrived exactly as packed.",
      author: "Robert C.",
      moveType: "Estate home move, KT13",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Leatherhead",
    slug: "leatherhead-removals",
    metaTitle: "Leatherhead Removals | KT22 Surrey Town Moves",
    metaDescription:
      "Reliable removals in Leatherhead KT22. Town centre, Fetcham borders and M25 corridor homes. Fixed Surrey quotes and London link experience.",
    h1: "Leatherhead removals on the A243 corridor",
    intro:
      "Leatherhead is a proper Surrey market town with a busy centre, office parks and residential streets climbing towards Fetcham and Ashtead. M25 traffic affects journey times to London while village lanes on the edges need smaller vans. We quote fixed prices for local moves and cross-county runs.",
    propertyTypes: [
      "Town centre flats and maisonettes near the theatre",
      "Family semis and detached homes towards Fetcham",
      "Bungalows on quiet lanes off the Kingston Road",
      "Properties near Leatherhead station",
      "Executive homes on the edge of town towards Mickleham",
    ],
    commonMoveTypes: [
      "Moves within Leatherhead and Fetcham",
      "London to Leatherhead relocations",
      "Downsizing from larger homes to town centre",
      "Office moves for business park tenants",
      "Moves linked to M25 corridor job relocations",
    ],
    parkingAccessNotes:
      "High Street loading is time-limited during shop hours. Station car park rules affect some central flats. Fetcham lanes can be narrow; we confirm access before sending the largest vehicle.",
    localRoads: [
      "High Street Leatherhead",
      "Kingston Road Leatherhead",
      "North Street",
      "Bridge Street",
      "Fetcham Road",
      "Epsom Road Leatherhead",
    ],
    localLandmarks: [
      "Leatherhead theatre",
      "Leatherhead station",
      "River Mole",
      "Fetcham village",
      "Ashtead Common border",
    ],
    postcodes: ["KT22", "KT23"],
    nearbyAreas: [
      { name: "Dorking", slug: "dorking-removals" },
      { name: "Epsom", slug: "epsom-removals" },
      { name: "Cobham", slug: "cobham-removals" },
      { name: "Guildford", slug: "guildford-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Leatherhead",
        to: "Wimbledon",
        description:
          "Commuter family move north with fixed cross-county pricing.",
      },
      {
        from: "Fetcham",
        to: "Reigate",
        description:
          "Short Surrey move between similar suburban streets.",
      },
      {
        from: "Leatherhead",
        to: "Brighton",
        description:
          "Coastal relocation with early departure planned.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Four-bedroom Fetcham house to Dorking. Loft and garage cleared as part of two-day pack.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "Town centre flat to Cobham semi. Completion day timing coordinated with solicitor.",
        propertyType: "Apartment",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover Fetcham and Ashtead borders?",
        answer:
          "Yes. KT22 including Fetcham village and approach roads is covered.",
      },
      {
        question: "Can you move business park offices in Leatherhead?",
        answer:
          "Yes. Out-of-hours office moves are available on request.",
      },
      {
        question: "How do M25 delays affect my quote?",
        answer:
          "Journey time is built into fixed cross-area pricing agreed before booking.",
      },
    ],
    testimonial: {
      quote:
        "Fetcham to Dorking on a rainy Friday. Crew kept floors dry and finished earlier than expected.",
      author: "Karen H.",
      moveType: "Detached home move, KT22",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Reigate",
    slug: "reigate-removals",
    metaTitle: "Reigate Removals | RH2 Historic Town House Moves",
    metaDescription:
      "Local removals in Reigate RH2. High Street, Redhill border and Priory Park homes. Fixed Surrey quotes and North Downs corridor experience.",
    h1: "Reigate removals in the RH2 valley",
    intro:
      "Reigate has a historic high street, castle tunnels below the town and handsome streets climbing the slopes. Parking in the centre is awkward while residential roads towards Woodhatch and Redhill borders are more forgiving. We plan access carefully and quote fixed prices for Surrey and London moves.",
    propertyTypes: [
      "Period houses near Reigate Hill and Park Lane",
      "Town centre flats above the High Street",
      "Family semis towards Woodhatch",
      "Properties near Reigate Priory and Priory Park",
      "Modern homes on the Redhill fringe",
    ],
    commonMoveTypes: [
      "Moves within Reigate and into Redhill",
      "London to Reigate family relocations",
      "Downsizing from larger hillside homes",
      "School-term moves for Reigate families",
      "Office moves for town centre businesses",
    ],
    parkingAccessNotes:
      "Bell Street and High Street have tight loading windows. Hillside properties may have steep drives. We assess whether shuttles from the town centre are needed for the narrowest lanes.",
    localRoads: [
      "Reigate High Street",
      "Bell Street",
      "Park Lane Reigate",
      "Reigate Hill",
      "Woodhatch Road",
      "London Road Reigate",
    ],
    localLandmarks: [
      "Reigate Priory",
      "Priory Park",
      "Reigate Hill",
      "Reigate castle tunnels",
      "Reigate station",
    ],
    postcodes: ["RH2"],
    nearbyAreas: [
      { name: "Redhill", slug: "redhill-removals" },
      { name: "Dorking", slug: "dorking-removals" },
      { name: "Crawley", slug: "redhill-removals" },
      { name: "Epsom", slug: "epsom-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Reigate",
        to: "Clapham",
        description:
          "Commuter move back towards central London rental or purchase.",
      },
      {
        from: "Reigate Hill",
        to: "Guildford",
        description:
          "Surrey internal move with large garden contents.",
      },
      {
        from: "Reigate",
        to: "Brighton",
        description:
          "South coast relocation with fixed journey quote.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Hillside house on Park Lane to Redhill flat. Long garden carry from rear access.",
        propertyType: "Period house",
        month: "Recent example",
      },
      {
        summary:
          "High Street flat to Dorking cottage. Early slot before shop deliveries began.",
        propertyType: "Town centre flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Woodhatch included in Reigate coverage?",
        answer:
          "Yes. RH2 including Woodhatch and Priory Park area is fully covered.",
      },
      {
        question: "Can you move on Reigate High Street?",
        answer:
          "Yes, with timed loading agreed in advance for central properties.",
      },
      {
        question: "Do you link Reigate and Redhill moves?",
        answer:
          "Yes. Short moves between the two towns are common and fixed-price.",
      },
    ],
    testimonial: {
      quote:
        "Steep drive and a heavy sideboard. They brought extra crew without fuss. Very professional.",
      author: "Neil B.",
      moveType: "Hillside house move, RH2",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Redhill",
    slug: "redhill-removals",
    metaTitle: "Redhill Removals | RH1 Station & Suburb Moves",
    metaDescription:
      "Trusted removals in Redhill RH1. Town centre flats, Earlswood borders and commuter family homes. Fixed Surrey quotes and fast-line experience.",
    h1: "Redhill removals across RH1",
    intro:
      "Redhill is a busy Surrey hub with strong trains to London and Brighton. The town centre mixes flats and offices while suburbs towards Earlswood and Salfords offer semis and detached homes. We know the one-way systems near the station and quote fixed prices for local and long-distance moves.",
    propertyTypes: [
      "Flats and apartments near Redhill station",
      "Victorian and Edwardian houses towards Earlswood",
      "Family semis in Salfords and Merstham borders",
      "Town centre maisonettes",
      "New-build estates on the town edge",
    ],
    commonMoveTypes: [
      "Commuter moves between Redhill and London",
      "Moves within RH1 and into Reigate",
      "Family relocations towards Crawley and Gatwick corridor",
      "Rental changeovers near the station",
      "Downsizing from suburban semis to town flats",
    ],
    parkingAccessNotes:
      "Station forecourt traffic is heavy at peak times. Town centre loading bays need prompt use. Suburban crescents usually offer better parking but longer carries from rear gardens are common.",
    localRoads: [
      "Station Road Redhill",
      "London Road Redhill",
      "Brighton Road Redhill",
      "Linkfield Street",
      "Earlswood Road",
      "Princes Road",
    ],
    localLandmarks: [
      "Redhill station",
      "Earlswood Lakes",
      "Redhill town centre",
      "Memorial Park",
      "Royal Earlswood Park border",
    ],
    postcodes: ["RH1"],
    nearbyAreas: [
      { name: "Reigate", slug: "reigate-removals" },
      { name: "Crawley", slug: "redhill-removals" },
      { name: "Dorking", slug: "dorking-removals" },
      { name: "Epsom", slug: "epsom-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Redhill",
        to: "Croydon",
        description:
          "Northbound move towards South London employment.",
      },
      {
        from: "Earlswood",
        to: "Guildford",
        description:
          "Surrey internal family move with schools in mind.",
      },
      {
        from: "Redhill",
        to: "Brighton",
        description:
          "Coastal move along the Brighton line corridor.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Three-bedroom Earlswood semi to Reigate. Children's playhouse dismantled and rebuilt.",
        propertyType: "Edwardian semi",
        month: "Recent example",
      },
      {
        summary:
          "Station-area flat to Croydon rental. Evening move after work hours.",
        propertyType: "Apartment",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover Earlswood and Salfords?",
        answer:
          "Yes. RH1 including Earlswood lakes area and Salfords border is covered.",
      },
      {
        question: "Can you move early for commuters?",
        answer:
          "Yes. Early starts are popular for Redhill station area flats.",
      },
      {
        question: "Is Merstham border included?",
        answer:
          "Yes. Northern RH1 fringe towards Merstham is within coverage.",
      },
    ],
    testimonial: {
      quote:
        "Station flat to a house in Earlswood. Quick quote on WhatsApp and a smooth same-week move.",
      author: "Lisa F.",
      moveType: "Flat to semi move, RH1",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Dorking",
    slug: "dorking-removals",
    metaTitle: "Dorking Removals | RH4 Surrey Hills Home Moves",
    metaDescription:
      "Local removals in Dorking RH4. Town centre, Holmwood and North Downs villages. Fixed Surrey quotes and hillside access experience.",
    h1: "Dorking removals at the foot of the Downs",
    intro:
      "Dorking sits where the Surrey Hills meet practical town living. Streets rise sharply towards the North Downs, village lanes in Westcott and Holmwood are narrow, and the town centre still draws market-day traffic. We assess hills, lanes and parking honestly so your quote reflects the real job.",
    propertyTypes: [
      "Town centre flats and shops-with-flats",
      "Family homes on the slopes towards Denbies",
      "Village cottages in Westcott and Coldharbour lanes",
      "Semis and detached homes in North Holmwood",
      "Rural-edge properties with long drives",
    ],
    commonMoveTypes: [
      "Moves within Dorking and surrounding villages",
      "London to Dorking lifestyle relocations",
      "Downsizing from hillside homes",
      "Market-town rental changeovers",
      "Moves with stables, outbuildings and garden offices",
    ],
    parkingAccessNotes:
      "High Street market activity affects central loading. Hillside drives can be steep and slippery in wet weather. Village lanes may require a smaller van staging on a B road with repeat carries.",
    localRoads: [
      "High Street Dorking",
      "South Street",
      "London Road Dorking",
      "West Street",
      "Horsham Road",
      "Deepdene Road",
    ],
    localLandmarks: [
      "Dorking High Street",
      "Box Hill",
      "Denbies Wine Estate",
      "Dorking station",
      "Polesden Lacey border",
    ],
    postcodes: ["RH4", "RH5"],
    nearbyAreas: [
      { name: "Leatherhead", slug: "leatherhead-removals" },
      { name: "Reigate", slug: "reigate-removals" },
      { name: "Guildford", slug: "guildford-removals" },
      { name: "Godalming", slug: "godalming-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Dorking",
        to: "Wimbledon",
        description:
          "Family move north with Box Hill left behind for London commuting.",
      },
      {
        from: "Westcott village",
        to: "Godalming",
        description:
          "Village-to-town Surrey move with narrow lane access at departure.",
      },
      {
        from: "Dorking town",
        to: "Brighton",
        description:
          "South coast relocation with garden contents included.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Hillside house near Denbies to Leatherhead. Shuttle from narrow lane to main road.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "Westcott cottage to Dorking town flat. Antique furniture wrapped individually.",
        propertyType: "Village cottage",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover Westcott and North Holmwood?",
        answer:
          "Yes. RH4, RH5 and Dorking villages are within standard coverage.",
      },
      {
        question: "Can you access narrow village lanes?",
        answer:
          "We survey first and use a smaller vehicle or shuttle when lanes are tight.",
      },
      {
        question: "Are hillside properties priced differently?",
        answer:
          "Carry distance and access are built into your fixed quote after the survey.",
      },
    ],
    testimonial: {
      quote:
        "Lane too tight for a big lorry. They shuttled without drama and kept us informed all day.",
      author: "Tim R.",
      moveType: "Village cottage move, RH4",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Godalming",
    slug: "godalming-removals",
    metaTitle: "Godalming Removals | GU7 Surrey Town & Village Moves",
    metaDescription:
      "Careful removals in Godalming GU7. Town centre, Farncombe and Hurtmore borders. Fixed Surrey quotes and Wey valley experience.",
    h1: "Godalming removals along the Wey valley",
    intro:
      "Godalming is a handsome Surrey town with a historic high street, river walks and suburbs stretching towards Farncombe and Busbridge. Properties range from central flats to large family homes on the hills. We move within GU7 and connect to Guildford, Woking and South West London with fixed pricing.",
    propertyTypes: [
      "Town centre flats and period houses near the church",
      "Family semis and detached homes in Busbridge",
      "Farncombe terraces and riverside properties",
      "Cottages on lanes towards Milford and Witley",
      "New-build homes on town edge developments",
    ],
    commonMoveTypes: [
      "Moves within Godalming and Farncombe",
      "Guildford to Godalming relocations",
      "Downsizing from larger hillside homes",
      "London to Godalming lifestyle moves",
      "Moves with home offices and garden buildings",
    ],
    parkingAccessNotes:
      "High Street and Bridge Street are sensitive during market and school hours. Farncombe riverside lanes are narrow. Hillside properties may need parking lower on the slope with longer carries.",
    localRoads: [
      "High Street Godalming",
      "Bridge Street",
      "Flambard Way",
      "Meadrow",
      "Portsmouth Road Godalming",
      "Farncombe Street",
    ],
    localLandmarks: [
      "Godalming High Street",
      "River Wey",
      "Godalming station",
      "Busbridge church",
      "Farncombe boat house",
    ],
    postcodes: ["GU7", "GU8"],
    nearbyAreas: [
      { name: "Guildford", slug: "guildford-removals" },
      { name: "Woking", slug: "woking-removals" },
      { name: "Haslemere", slug: "godalming-removals" },
      { name: "Dorking", slug: "dorking-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Godalming",
        to: "Guildford",
        description:
          "Short Surrey move often completed in a single day.",
      },
      {
        from: "Farncombe",
        to: "Wimbledon",
        description:
          "Commuter family move north with fixed cross-county price.",
      },
      {
        from: "Busbridge",
        to: "Woking",
        description:
          "Move between Surrey towns with large garden contents.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Four-bedroom Busbridge house to Guildford. Greenhouse dismantled and garden tools boxed.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "Farncombe terrace to Godalming town flat. Riverside lane access with smaller van.",
        propertyType: "Terrace house",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover Farncombe and Milford?",
        answer:
          "Yes. GU7 including Farncombe, Busbridge and Milford borders is covered.",
      },
      {
        question: "Can you move from Godalming to London?",
        answer:
          "Yes. Godalming to South West London is a standard fixed-price route.",
      },
      {
        question: "Do you handle outbuildings and garden offices?",
        answer:
          "Yes. List them during quoting so crew and vehicle size are correct.",
      },
    ],
    testimonial: {
      quote:
        "Busbridge to Guildford with a full garden to move. They did not cut corners and the price stayed fixed.",
      author: "Angela M.",
      moveType: "Detached home move, GU7",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Hammersmith",
    slug: "hammersmith-removals",
    metaTitle: "Hammersmith Removals | W6 House & Flat Moves",
    metaDescription:
      "Professional removals in Hammersmith W6. Broadway flats, riverside homes and Brackenbury Village houses. Fixed quotes and west London corridor experience.",
    h1: "Hammersmith removals on the W6 corridor",
    intro:
      "Hammersmith is a major west London junction where the A4, Hammersmith flyover and Thames foot traffic all meet. Flats above the Broadway sit beside village streets in Brackenbury and riverside walks towards Furnivall Gardens. We plan around rush-hour gridlock, bridge works and the lift rules common in larger blocks.",
    propertyTypes: [
      "Flats and offices above Hammersmith Broadway",
      "Victorian houses in Brackenbury Village",
      "Riverside apartments towards Hammersmith Bridge",
      "Council and mansion blocks near Ravenscourt Park",
      "Townhouses on the Shepherds Bush border",
    ],
    commonMoveTypes: [
      "Broadway rental changeovers at month end",
      "Family moves from Brackenbury to Richmond and Chiswick",
      "Professional relocations towards Kensington and the City",
      "Downsizing from houses to lift-served flats",
      "Office strip-outs on the King Street corridor",
    ],
    parkingAccessNotes:
      "Hammersmith Broadway loading is difficult during retail hours. Bridge closure periods affect riverside access. Many mansion blocks require lift padding and insurance documents before vans arrive.",
    localRoads: [
      "Hammersmith Broadway",
      "King Street Hammersmith",
      "Fulham Palace Road",
      "Beadon Road",
      "Glenthorne Road",
      "Ravenscourt Road",
    ],
    localLandmarks: [
      "Hammersmith Apollo",
      "Ravenscourt Park",
      "Hammersmith Bridge",
      "Lyric Square",
      "Brackenbury Village",
    ],
    postcodes: ["W6", "W14"],
    nearbyAreas: [
      { name: "Chiswick", slug: "chiswick-removals" },
      { name: "Fulham", slug: "fulham-removals" },
      { name: "Acton", slug: "acton-removals" },
      { name: "Kensington", slug: "kensington-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Hammersmith",
        to: "Chiswick",
        description:
          "Short west London hop where parking at both ends needs advance planning.",
      },
      {
        from: "Brackenbury Village",
        to: "Guildford",
        description:
          "Family leaving the A4 corridor for Surrey garden space.",
      },
      {
        from: "Hammersmith Broadway",
        to: "South Kensington",
        description:
          "Professional move closer to museum and embassy district housing.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Two-bedroom riverside flat to Fulham townhouse. Lift booked and hallway carpet protected.",
        propertyType: "Riverside apartment",
        month: "Recent example",
      },
      {
        summary:
          "Brackenbury Victorian to storage during kitchen refurb. Return delivery scheduled.",
        propertyType: "Victorian house",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover Shepherds Bush border streets?",
        answer:
          "Yes. W6 including Brackenbury, Ravenscourt and Broadway is within standard coverage.",
      },
      {
        question: "Can you move during Hammersmith Bridge disruption?",
        answer:
          "We plan alternate routes and riverside access when bridge works affect your street.",
      },
      {
        question: "Are fixed quotes available on WhatsApp?",
        answer:
          "Yes. A walkthrough video is usually enough for a clear W6 price.",
      },
    ],
    testimonial: {
      quote:
        "Broadway parking was a nightmare on paper but they had a workable plan. Efficient and tidy.",
      author: "Gregory A.",
      moveType: "Flat move, W6",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Acton",
    slug: "acton-removals",
    metaTitle: "Acton Removals | W3 Local House & Flat Moves",
    metaDescription:
      "Trusted removals in Acton W3. Acton Central terraces, South Acton flats and Gunnersbury borders. Fixed quotes across west London.",
    h1: "Acton removals across W3",
    intro:
      "Acton is larger than outsiders expect, stretching from Acton Central village streets to busy Horn Lane and the South Acton estate. Victorian terraces, ex-council conversions and newer boxes near the station all move differently. We match crew size and van choice to your stairs, parking and carry distance.",
    propertyTypes: [
      "Victorian terraces near Acton Central",
      "Flats on Horn Lane and the High Street",
      "South Acton estate properties with lift or stair access",
      "Houses towards Ealing and Gunnersbury borders",
      "Studios and rentals near Acton Main Line station",
    ],
    commonMoveTypes: [
      "Moves between Acton and Ealing",
      "First-time buyer purchases on Central Acton streets",
      "Rental changeovers near the station",
      "Family relocations from Acton to Chiswick and Richmond",
      "Part-load furniture runs for flat refurnishing",
    ],
    parkingAccessNotes:
      "Horn Lane is narrow and busy with industrial traffic. Acton Central streets use permit bays that fill early. South Acton has designated loading areas but booking times with management helps on estate moves.",
    localRoads: [
      "Horn Lane",
      "Acton High Street",
      "Churchfield Road",
      "Gunnersbury Lane",
      "Uxbridge Road Acton",
      "Mill Hill Terrace",
    ],
    localLandmarks: [
      "Acton Central station",
      "Acton Park",
      "Gunnersbury Triangle",
      "South Acton estate",
      "Osterley border",
    ],
    postcodes: ["W3"],
    nearbyAreas: [
      { name: "Ealing", slug: "ealing-removals" },
      { name: "Chiswick", slug: "chiswick-removals" },
      { name: "Hammersmith", slug: "hammersmith-removals" },
      { name: "Shepherd's Bush", slug: "hammersmith-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Acton Central",
        to: "Richmond",
        description:
          "Family crossing west with loft contents and garden tools included.",
      },
      {
        from: "Acton",
        to: "Notting Hill",
        description:
          "Rental upgrade move towards west central London.",
      },
      {
        from: "South Acton",
        to: "Wimbledon",
        description:
          "Southbound move with two crew and a single van load.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Three-bedroom terrace on Churchfield Road to Ealing semi. Dismantling for super king bed.",
        propertyType: "Victorian terrace",
        month: "Recent example",
      },
      {
        summary:
          "Studio near Acton Main Line to Clapham flat share. Same-day pack and go.",
        propertyType: "Studio flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is South Acton estate covered?",
        answer:
          "Yes. W3 including South Acton, Central Acton and Horn Lane is fully covered.",
      },
      {
        question: "Can you move from top-floor Acton conversions?",
        answer:
          "Yes. Stair carries are included transparently in your fixed quote after survey.",
      },
      {
        question: "Do you link Acton and Ealing moves?",
        answer:
          "Yes. Short moves between W3 and W5 are routine with fixed pricing.",
      },
    ],
    testimonial: {
      quote:
        "Horn Lane is tight but they got the van in and out without holding up traffic. Good crew.",
      author: "Priya S.",
      moveType: "Terrace move, W3",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Ealing",
    slug: "ealing-removals",
    metaTitle: "Ealing Removals | W5 & W13 Family Home Moves",
    metaDescription:
      "Reliable removals in Ealing W5 and W13. Broadway flats, Pitshanger semis and Hanwell borders. Fixed west London quotes and insured crews.",
    h1: "Ealing removals across W5 and W13",
    intro:
      "Ealing calls itself the queen of the suburbs for good reason. Wide tree-lined avenues near Pitshanger sit alongside busy Broadway flats and Hanwell fringe terraces. School traffic around Mount Park Road and the Uxbridge Road artery affects timing, so we agree start windows that match your parking permits.",
    propertyTypes: [
      "Flats above Ealing Broadway shopping centre",
      "Edwardian semis in Pitshanger and Northfields",
      "Victorian houses towards Walpole and Hanger Hill",
      "Hanwell border terraces and bungalows",
      "Family homes near Montpelier and Cleveland Park",
    ],
    commonMoveTypes: [
      "Moves within Ealing and into Acton",
      "School-term family relocations",
      "Downsizing from Pitshanger semis to Broadway flats",
      "Moves from central London into Ealing for space",
      "Office moves for Uxbridge Road businesses",
    ],
    parkingAccessNotes:
      "Broadway basement loading needs centre management approval for some blocks. Pitshanger streets are permit-only by mid-morning. Larger vehicles may need to park on Uxbridge Road with a carry across residential pavements.",
    localRoads: [
      "Uxbridge Road Ealing",
      "Pitshanger Lane",
      "Mount Park Road",
      "Hanger Lane",
      "Northfield Avenue",
      "St Mary's Road Ealing",
    ],
    localLandmarks: [
      "Ealing Broadway station",
      "Pitshanger Lane shops",
      "Walpole Park",
      "Ealing Common",
      "Gunnersbury Park border",
    ],
    postcodes: ["W5", "W13", "W7"],
    nearbyAreas: [
      { name: "Acton", slug: "acton-removals" },
      { name: "Chiswick", slug: "chiswick-removals" },
      { name: "Hanwell", slug: "ealing-removals" },
      { name: "Richmond", slug: "richmond-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Pitshanger",
        to: "Richmond",
        description:
          "Family staying west of central London with a larger garden at destination.",
      },
      {
        from: "Ealing Broadway",
        to: "Kensington",
        description:
          "Professional couple moving closer to work in west central London.",
      },
      {
        from: "Northfields",
        to: "Guildford",
        description:
          "Surrey relocation with nursery and playroom packed separately.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Four-bedroom Pitshanger semi to Twickenham. Two-day pack with garage workshop cleared.",
        propertyType: "Edwardian semi",
        month: "Recent example",
      },
      {
        summary:
          "Broadway flat to Northfields house. Lift rules followed at departure building.",
        propertyType: "Shopping-centre flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover Northfields and Hanger Hill?",
        answer:
          "Yes. W5, W13 and the wider Ealing borough fringe are within coverage.",
      },
      {
        question: "Can you move from Ealing Broadway centre flats?",
        answer:
          "Yes. We coordinate with building management for lift and loading bay access.",
      },
      {
        question: "Are Saturday moves available in Ealing?",
        answer:
          "Yes. Month-end Saturdays book early but we usually have capacity with notice.",
      },
    ],
    testimonial: {
      quote:
        "Pitshanger semi to Richmond. Kids' rooms labelled and nothing mixed up. Very organised.",
      author: "Claire D.",
      moveType: "Semi-detached move, W5",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Mortlake",
    slug: "mortlake-removals",
    metaTitle: "Mortlake Removals | SW14 Riverside Home Moves",
    metaDescription:
      "Careful removals in Mortlake SW14. Thames Path cottages, station terraces and Barnes borders. Fixed quotes and riverside access experience.",
    h1: "Mortlake removals by the Thames",
    intro:
      "Mortlake is a small Thames-side pocket between Barnes and Kew with village lanes and strong community feel. The towpath, brewery site history and match-day ripple from nearby stadiums all affect parking. Properties are often period, polished and accessed from narrow streets that need a measured approach.",
    propertyTypes: [
      "Terraces and cottages near Mortlake station",
      "Riverside homes on Thames Path approaches",
      "Flats towards North Sheen and Kew borders",
      "Family houses on Mortlake High Street",
      "Mews-style lanes off Sheen Lane",
    ],
    commonMoveTypes: [
      "Moves between Mortlake and Barnes",
      "Relocations from Mortlake to Richmond and Kew",
      "Downsizing from houses to riverside flats",
      "Fragile-heavy moves with antiques and art",
      "Renovation-linked storage moves",
    ],
    parkingAccessNotes:
      "Mortlake High Street and Thames-side lanes allow limited stopping. Stadium event days push parking further out. We sometimes stage on Sheen Lane or Mortlake Green with shorter shuttle runs.",
    localRoads: [
      "Mortlake High Street",
      "Sheen Lane",
      "Mortlake Terrace",
      "Ship Lane",
      "Church Road Mortlake",
      "Thames Bank",
    ],
    localLandmarks: [
      "Mortlake station",
      "Thames Path",
      "Mortlake Green",
      "St Mary Magdalene Church",
      "Barnes Bridge",
    ],
    postcodes: ["SW14", "TW9"],
    nearbyAreas: [
      { name: "Barnes", slug: "barnes-removals" },
      { name: "Kew", slug: "kew-removals" },
      { name: "Richmond", slug: "richmond-removals" },
      { name: "East Sheen", slug: "east-sheen-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Mortlake",
        to: "Putney",
        description:
          "Short Thames-side move with bridge traffic built into timing.",
      },
      {
        from: "Mortlake cottage",
        to: "Esher",
        description:
          "Family crossing into Surrey with garden statuary wrapped separately.",
      },
      {
        from: "Mortlake",
        to: "Chiswick",
        description:
          "West London internal move along the A316 corridor.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Two-bedroom Thames Path cottage to Barnes flat. Narrow lane shuttle from main road.",
        propertyType: "Riverside cottage",
        month: "Recent example",
      },
      {
        summary:
          "Mortlake terrace to Kew house. Antique sideboard crated for stairs.",
        propertyType: "Period terrace",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is North Sheen included in Mortlake coverage?",
        answer:
          "Yes. SW14 including station area and Thames Path streets is covered.",
      },
      {
        question: "Can you work around rugby event parking?",
        answer:
          "We check local fixtures when you book and adjust arrival plans accordingly.",
      },
      {
        question: "Do you handle narrow Thames lane access?",
        answer:
          "Yes. Smaller vans or shuttle runs are planned during the survey.",
      },
    ],
    testimonial: {
      quote:
        "Lane too small for a lorry. Shuttle worked well and the crew stayed cheerful throughout.",
      author: "Edward F.",
      moveType: "Cottage move, SW14",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Roehampton",
    slug: "roehampton-removals",
    metaTitle: "Roehampton Removals | SW15 Estate & House Moves",
    metaDescription:
      "Local removals in Roehampton SW15. Alton Estate, Roehampton Vale and Richmond Park borders. Fixed quotes and south west London experience.",
    h1: "Roehampton removals across SW15",
    intro:
      "Roehampton mixes large post-war estates, university campus housing and handsome roads edging Richmond Park. Alton Estate high-rises need lift bookings while Roehampton Lane properties face steep carries from sloped drives. We survey access properly rather than guessing on move day.",
    propertyTypes: [
      "Flats on the Alton Estate with lift access",
      "Houses on Roehampton Lane towards the park",
      "University and rental accommodation near Digby Stuart",
      "Semis towards Putney Vale",
      "Bungalows on the Kingston border",
    ],
    commonMoveTypes: [
      "Estate flat moves with lift coordination",
      "Family moves from Roehampton to Wimbledon and Kingston",
      "Student term-time relocations",
      "Downsizing within SW15",
      "Moves from park-side houses into Surrey",
    ],
    parkingAccessNotes:
      "Estate rules vary on van size and booking slots. Roehampton Lane is narrow near the park gates. We confirm lift dimensions and estate office requirements before dispatching crew.",
    localRoads: [
      "Roehampton Lane",
      "Alton Road",
      "Medfield Street",
      "Roehampton Vale",
      "Minstead Gardens",
      "Putney Vale",
    ],
    localLandmarks: [
      "Richmond Park gates",
      "Alton Estate",
      "Roehampton Club",
      "Digby Stuart College",
      "Beverley Brook",
    ],
    postcodes: ["SW15"],
    nearbyAreas: [
      { name: "Putney", slug: "putney-removals" },
      { name: "Wimbledon", slug: "wimbledon-removals" },
      { name: "Richmond", slug: "richmond-removals" },
      { name: "Kingston upon Thames", slug: "kingston-upon-thames-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Roehampton",
        to: "Wimbledon",
        description:
          "Family move north with school catchment often part of the conversation.",
      },
      {
        from: "Alton Estate",
        to: "Putney",
        description:
          "Downsizing from estate flat to riverside rental.",
      },
      {
        from: "Roehampton Lane",
        to: "Guildford",
        description:
          "Surrey relocation with loft and shed cleared.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Alton Estate flat to Putney riverside. Lift slot booked and damage waiver filed.",
        propertyType: "Estate flat",
        month: "Recent example",
      },
      {
        summary:
          "Park-side house to Kingston semi. Sloped drive required careful van positioning.",
        propertyType: "Detached house",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you move from Alton Estate towers?",
        answer:
          "Yes. Lift booking and estate access rules are confirmed before your move date.",
      },
      {
        question: "Is Putney Vale covered?",
        answer:
          "Yes. SW15 including Roehampton Vale and park borders is within coverage.",
      },
      {
        question: "Can you help with student moves?",
        answer:
          "Yes. Smaller loads and flexible timing for term starts and ends are available.",
      },
    ],
    testimonial: {
      quote:
        "Estate office were picky about lift times. Crew had paperwork ready and finished on schedule.",
      author: "Yasmin O.",
      moveType: "Estate flat move, SW15",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "East Sheen",
    slug: "east-sheen-removals",
    metaTitle: "East Sheen Removals | SW14 Village House Moves",
    metaDescription:
      "Premium removals in East Sheen SW14. Sheen Common roads, Upper Richmond Road homes and Mortlake borders. Fixed quotes and careful period handling.",
    h1: "East Sheen removals near Sheen Common",
    intro:
      "East Sheen feels like a village pressed against Richmond Park. Upper Richmond Road carries constant traffic while quieter crescents off Sheen Lane hold family semis and Edwardian houses. Clients here expect floors protected, neighbours respected and crews who turn up on time.",
    propertyTypes: [
      "Edwardian and Victorian houses near Sheen Common",
      "Semis on the Upper Richmond Road",
      "Flats towards North Sheen station",
      "Family homes backing onto Richmond Park",
      "Bungalows on the Mortlake fringe",
    ],
    commonMoveTypes: [
      "Whole-house moves within East Sheen",
      "Relocations to Richmond and Barnes",
      "School-term family moves",
      "Downsizing to smaller Sheen cottages",
      "Moves with antiques and fragile décor",
    ],
    parkingAccessNotes:
      "Upper Richmond Road loading is time-sensitive. Park-side streets tighten on weekends. We use early starts where needed and full hallway protection on polished wood floors.",
    localRoads: [
      "Upper Richmond Road West",
      "Sheen Lane",
      "Sheen Common Drive",
      "Fife Road",
      "East Sheen Avenue",
      "Parklands Road",
    ],
    localLandmarks: [
      "Sheen Common",
      "Richmond Park East Sheen gate",
      "East Sheen shops",
      "Mortlake station fringe",
      "St Leonard's Court",
    ],
    postcodes: ["SW14", "TW10"],
    nearbyAreas: [
      { name: "Mortlake", slug: "mortlake-removals" },
      { name: "Richmond", slug: "richmond-removals" },
      { name: "Barnes", slug: "barnes-removals" },
      { name: "Roehampton", slug: "roehampton-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "East Sheen",
        to: "Richmond",
        description:
          "Short move between adjoining village-style neighbourhoods.",
      },
      {
        from: "Sheen Common road",
        to: "Weybridge",
        description:
          "Family crossing the river into Surrey with garden equipment.",
      },
      {
        from: "East Sheen",
        to: "Kensington",
        description:
          "Professional move back towards central London employment.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Four-bedroom house near the Common to Barnes. Piano moved with specialist straps.",
        propertyType: "Edwardian house",
        month: "Recent example",
      },
      {
        summary:
          "Semi on Upper Richmond Road to Mortlake cottage. Parking suspension arranged by client.",
        propertyType: "Family semi",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover North Sheen station area?",
        answer:
          "Yes. SW14 East Sheen and immediate North Sheen fringe are covered.",
      },
      {
        question: "Can you protect original floorboards?",
        answer:
          "Yes. Floor runners are standard on Sheen period properties when requested.",
      },
      {
        question: "Are park-side moves more expensive?",
        answer:
          "Access and carry distance are built into your fixed quote after survey.",
      },
    ],
    testimonial: {
      quote:
        "Original parquet throughout. Covers down before a box moved. Exactly the standard we wanted.",
      author: "Helen V.",
      moveType: "Edwardian house move, SW14",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "West Brompton",
    slug: "west-brompton-removals",
    metaTitle: "West Brompton Removals | SW5 & SW10 Flat Moves",
    metaDescription:
      "Local removals in West Brompton SW5 and SW10. Earls Court borders, Lillie Road flats and Chelsea fringe homes. Fixed west London quotes.",
    h1: "West Brompton removals on the Chelsea fringe",
    intro:
      "West Brompton sits where Earls Court, Fulham and Chelsea meet. Lillie Road carries heavy traffic, while streets towards the cemetery and Brompton Park are quieter but tight. Mansion flats and converted terraces need careful hall protection and realistic parking plans.",
    propertyTypes: [
      "Victorian conversions on Lillie Road and Finborough Road",
      "Flats near West Brompton station",
      "Mansion blocks towards Earls Court",
      "Houses on the Chelsea Creek fringe",
      "Rental flats popular with young professionals",
    ],
    commonMoveTypes: [
      "Rental changeovers near the station",
      "Moves between West Brompton and Fulham",
      "Upsizing from flats to Chelsea townhouses",
      "Downsizing to smaller SW10 apartments",
      "Short moves timed around tenancy handovers",
    ],
    parkingAccessNotes:
      "Lillie Road and Old Brompton Road are busy most of the day. Cemetery side streets offer shorter carries but limited turning room. We confirm van length before booking the largest vehicle.",
    localRoads: [
      "Lillie Road",
      "Finborough Road",
      "Old Brompton Road",
      "Ifield Road",
      "Seagrave Road",
      "Brompton Park Crescent",
    ],
    localLandmarks: [
      "West Brompton station",
      "Brompton Cemetery",
      "Chelsea FC Stamford Bridge fringe",
      "North End Road market",
      "Earls Court Exhibition fringe",
    ],
    postcodes: ["SW5", "SW10"],
    nearbyAreas: [
      { name: "Chelsea", slug: "chelsea-removals" },
      { name: "Fulham", slug: "fulham-removals" },
      { name: "Kensington", slug: "kensington-removals" },
      { name: "Earls Court", slug: "kensington-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "West Brompton",
        to: "Fulham",
        description:
          "Short SW move often finished within a morning.",
      },
      {
        from: "Lillie Road flat",
        to: "Richmond",
        description:
          "Family leaving a conversion for a larger house west of the river.",
      },
      {
        from: "West Brompton",
        to: "Clapham",
        description:
          "Rental move south with two crew and one van.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Two-bedroom conversion to Chelsea maisonette. Painted stairs protected throughout.",
        propertyType: "Conversion flat",
        month: "Recent example",
      },
      {
        summary:
          "Studio near station to Clapham house share. Evening slot after work.",
        propertyType: "Studio flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Earls Court border included?",
        answer:
          "Yes. SW5 and SW10 around West Brompton station are within coverage.",
      },
      {
        question: "Can you move near Stamford Bridge on match days?",
        answer:
          "We check fixtures and adjust timing when parking would be unrealistic.",
      },
      {
        question: "Do you offer half-day West Brompton moves?",
        answer:
          "Yes. Smaller flats often fit a morning slot with two crew.",
      },
    ],
    testimonial: {
      quote:
        "Tight conversion staircase. Wardrobe came apart and went back together perfectly.",
      author: "Luke M.",
      moveType: "Flat move, SW5",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Pimlico",
    slug: "pimlico-removals",
    metaTitle: "Pimlico Removals | SW1 Westminster Flat Moves",
    metaDescription:
      "Discreet removals in Pimlico SW1. Grid streets, Grosvenor Road flats and Victoria borders. Fixed quotes and porter building experience.",
    h1: "Pimlico removals in the SW1 grid",
    intro:
      "Pimlico is orderly on the map and demanding on move day. Regency terraces split into grand flats, mansion blocks with porters and newer riverside apartments all sit on tight grid streets. Controlled parking and working-hour rules mean we plan suspensions and building access before confirming your slot.",
    propertyTypes: [
      "Regency terrace flats with high ceilings",
      "Portered mansion blocks off St George's Square",
      "Riverside apartments on Grosvenor Road",
      "Houses on the Churchill Gardens estate",
      "Professional lets near Victoria station",
    ],
    commonMoveTypes: [
      "Mansion block moves with lift padding",
      "Diplomatic and corporate relocations",
      "Downsizing within Pimlico",
      "Moves from Pimlico to Chelsea and Belgravia",
      "Tenancy changeovers on grid streets",
    ],
    parkingAccessNotes:
      "Controlled zones cover most SW1 streets. Porter buildings need insurance schedules and lift bookings. Grosvenor Road riverside access is time-limited during peak traffic.",
    localRoads: [
      "St George's Square",
      "Belgrave Road Pimlico",
      "Grosvenor Road",
      "Lupus Street",
      "Churchill Gardens",
      "Pimlico Road",
    ],
    localLandmarks: [
      "St George's Square",
      "Pimlico Gardens",
      "Tate Britain",
      "Victoria station fringe",
      "Churchill Gardens",
    ],
    postcodes: ["SW1V", "SW1W"],
    nearbyAreas: [
      { name: "Belgravia", slug: "belgravia-removals" },
      { name: "Westminster", slug: "pimlico-removals" },
      { name: "Chelsea", slug: "chelsea-removals" },
      { name: "Vauxhall", slug: "vauxhall-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Pimlico",
        to: "Chelsea",
        description:
          "Short central London move between prime rental markets.",
      },
      {
        from: "St George's Square",
        to: "Richmond",
        description:
          "Family leaving central SW1 for riverside space.",
      },
      {
        from: "Pimlico",
        to: "Mayfair",
        description:
          "Upsizing move to larger serviced accommodation.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Portered mansion flat to Belgravia. Lift protected and common parts left clean.",
        propertyType: "Mansion flat",
        month: "Recent example",
      },
      {
        summary:
          "Regency flat to storage during refurbishment. Inventory for insurance supplied.",
        propertyType: "Terrace flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you work with porter buildings in Pimlico?",
        answer:
          "Yes. We follow porter instructions and bring lift protection as standard.",
      },
      {
        question: "Is Churchill Gardens estate covered?",
        answer:
          "Yes. SW1V including estate blocks and grid streets is covered.",
      },
      {
        question: "Can you arrange parking suspensions?",
        answer:
          "You arrange suspensions with the council; we plan the move around your permit window.",
      },
    ],
    testimonial: {
      quote:
        "Porter was satisfied with how tidy they kept the lift. Discreet and efficient.",
      author: "Amanda J.",
      moveType: "Mansion block move, SW1V",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Notting Hill",
    slug: "notting-hill-removals",
    metaTitle: "Notting Hill Removals | W11 House & Flat Moves",
    metaDescription:
      "Expert removals in Notting Hill W11. Portobello terraces, Ladbroke Grove flats and Holland Park borders. Fixed quotes and colourful-street experience.",
    h1: "Notting Hill removals across W11",
    intro:
      "Notting Hill is famous for its streets and unforgiving on parking. Pastel terraces, stucco fronts and steep Portobello side roads need crews who protect paintwork and work calmly when space is tight. Carnival weekend and market Saturdays require extra scheduling thought.",
    propertyTypes: [
      "Colourful terraces and stucco houses near Portobello",
      "Flats on Ladbroke Grove and Westbourne Grove",
      "Mansion flats on Pembridge and Lansdowne",
      "Houses on the Holland Park border",
      "High-value rentals around Westbourne Park",
    ],
    commonMoveTypes: [
      "Whole-house moves within W11",
      "Moves from Notting Hill to Kensington and Chelsea",
      "Downsizing from large houses to Grove flats",
      "International-linked relocations",
      "Market-weekend timed moves",
    ],
    parkingAccessNotes:
      "Portobello Road market days restrict loading. Lansdowne crescents are permit-heavy. We recommend suspensions for larger homes and early starts for flat moves above shops.",
    localRoads: [
      "Portobello Road",
      "Ladbroke Grove",
      "Westbourne Grove",
      "Pembridge Road",
      "Lansdowne Road",
      "Kensington Park Road",
    ],
    localLandmarks: [
      "Portobello Market",
      "Ladbroke Square",
      "Holland Park border",
      "Westbourne Grove",
      "Notting Hill Gate",
    ],
    postcodes: ["W11", "W2"],
    nearbyAreas: [
      { name: "Kensington", slug: "kensington-removals" },
      { name: "Maida Vale", slug: "maida-vale-removals" },
      { name: "Hammersmith", slug: "hammersmith-removals" },
      { name: "Holland Park", slug: "notting-hill-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Notting Hill",
        to: "Richmond",
        description:
          "Family seeking more space while keeping west London links.",
      },
      {
        from: "Ladbroke Grove",
        to: "South Kensington",
        description:
          "Professional move towards museum district flats.",
      },
      {
        from: "Notting Hill house",
        to: "Guildford",
        description:
          "Surrey relocation with home office packed separately.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Four-bedroom Lansdowne house to Surrey. Artwork crated and moved separately.",
        propertyType: "Stucco house",
        month: "Recent example",
      },
      {
        summary:
          "Portobello flat to Maida Vale. Market morning avoided by early start.",
        propertyType: "Conversion flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Can you avoid Carnival weekend?",
        answer:
          "Yes. We flag bank holiday and Carnival dates when you enquire and reschedule if needed.",
      },
      {
        question: "Is Westbourne Park fringe included?",
        answer:
          "Yes. W11 and W2 borders around Notting Hill are covered.",
      },
      {
        question: "Do you handle high-value interiors?",
        answer:
          "Yes. Tell us about delicate finishes and artwork during quoting.",
      },
    ],
    testimonial: {
      quote:
        "Stucco hallway and a baby grand. Wrapped properly and moved without drama.",
      author: "Isabelle T.",
      moveType: "House move, W11",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "South Kensington",
    slug: "south-kensington-removals",
    metaTitle: "South Kensington Removals | SW7 Museum District Moves",
    metaDescription:
      "Premium removals in South Kensington SW7. Exhibition Road flats, Onslow Gardens houses and embassy quarter homes. Fixed discreet quotes.",
    h1: "South Kensington removals in SW7",
    intro:
      "South Kensington is museum land, embassy streets and some of the most expensive rental stock in London. Mansion blocks expect tidy lifts, quiet crews and paperwork done correctly. We match that standard with fixed quotes and careful protection on marble and parquet.",
    propertyTypes: [
      "Mansion flats near Exhibition Road",
      "Large lateral conversions on Onslow Gardens",
      "Embassy quarter townhouses",
      "Student lets near Imperial College",
      "Portered blocks on Harrington and Roland Gardens",
    ],
    commonMoveTypes: [
      "Mansion block relocations with porter coordination",
      "Academic and diplomatic moves",
      "Downsizing within South Kensington",
      "Moves to Chelsea and Belgravia",
      "Fragile art and antique handling",
    ],
    parkingAccessNotes:
      "Onslow Square and Cromwell Road traffic is constant. Embassy streets may have security checks. Porter buildings need lift slots and sometimes refuse large items without prior measurement.",
    localRoads: [
      "Exhibition Road",
      "Old Brompton Road",
      "Onslow Gardens",
      "Cromwell Road",
      "Harrington Road",
      "Roland Gardens",
    ],
    localLandmarks: [
      "Natural History Museum",
      "Victoria and Albert Museum",
      "Imperial College",
      "Hyde Park border",
      "South Kensington station",
    ],
    postcodes: ["SW7"],
    nearbyAreas: [
      { name: "Knightsbridge", slug: "knightsbridge-removals" },
      { name: "Chelsea", slug: "chelsea-removals" },
      { name: "Kensington", slug: "kensington-removals" },
      { name: "Belgravia", slug: "belgravia-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "South Kensington",
        to: "Richmond",
        description:
          "Family leaving central SW7 for riverside gardens.",
      },
      {
        from: "Onslow Gardens",
        to: "Mayfair",
        description:
          "Upsizing to larger serviced London base.",
      },
      {
        from: "South Kensington",
        to: "Wimbledon",
        description:
          "Move south west for schools while keeping district line links.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Lateral flat on Onslow Gardens to Belgravia. Porter sign-off at both buildings.",
        propertyType: "Lateral conversion",
        month: "Recent example",
      },
      {
        summary:
          "Imperial College area flat to storage. Books and lab equipment boxed separately.",
        propertyType: "Rental flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you move from Imperial College area flats?",
        answer:
          "Yes. SW7 student and academic lets are regular work for us.",
      },
      {
        question: "Can you work with embassy security procedures?",
        answer:
          "Yes. Share access rules in advance so crew arrive with correct ID.",
      },
      {
        question: "Is Knightsbridge border included?",
        answer:
          "Yes. SW7 including Exhibition Road and Onslow Square is covered.",
      },
    ],
    testimonial: {
      quote:
        "Porter praised their lift etiquette. Marble hall left spotless. Very discreet team.",
      author: "Dr James W.",
      moveType: "Mansion flat move, SW7",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Knightsbridge",
    slug: "knightsbridge-removals",
    metaTitle: "Knightsbridge Removals | SW1X Premium Home Moves",
    metaDescription:
      "Discreet premium removals in Knightsbridge SW1X. Brompton Road, Hans Place and Hyde Park borders. Fixed quotes and high-value handling.",
    h1: "Knightsbridge removals in SW1X",
    intro:
      "Knightsbridge is retail traffic, embassy security and some of London's most demanding buildings. Flats overlooking Hyde Park and houses on quiet squares behind Brompton Road need crews who arrive prepared, dressed appropriately and focused on protection rather than speed alone.",
    propertyTypes: [
      "Luxury flats on Brompton Road and Sloane Street",
      "Houses on Hans Place and Wilton Place",
      "Portered mansion blocks near Harrods",
      "Embassy quarter residences",
      "Serviced apartments for international assignees",
    ],
    commonMoveTypes: [
      "High-value flat and house relocations",
      "International corporate moves",
      "Downsizing within Knightsbridge",
      "Art and jewellery-heavy handling",
      "Short lets between tenancy periods",
    ],
    parkingAccessNotes:
      "Brompton Road loading is heavily restricted. Building management often controls lift times and carpet protection. We confirm item sizes for tight service lifts before move day.",
    localRoads: [
      "Brompton Road",
      "Sloane Street",
      "Hans Place",
      "Wilton Place",
      "Montpelier Square",
      "Ennismore Gardens",
    ],
    localLandmarks: [
      "Harrods",
      "Hyde Park",
      "Knightsbridge station",
      "Harvey Nichols",
      "Brompton Oratory",
    ],
    postcodes: ["SW1X", "SW3"],
    nearbyAreas: [
      { name: "Belgravia", slug: "belgravia-removals" },
      { name: "South Kensington", slug: "south-kensington-removals" },
      { name: "Chelsea", slug: "chelsea-removals" },
      { name: "Mayfair", slug: "mayfair-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Knightsbridge",
        to: "Richmond",
        description:
          "Family leaving central luxury for riverside space.",
      },
      {
        from: "Hans Place",
        to: "Cobham",
        description:
          "Surrey relocation with wine collection packed separately.",
      },
      {
        from: "Knightsbridge",
        to: "Wimbledon",
        description:
          "Move south west for schools while keeping city access.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Brompton Road apartment to Belgravia house. Art handlers coordinated for fragile pieces.",
        propertyType: "Luxury apartment",
        month: "Recent example",
      },
      {
        summary:
          "Hans Place townhouse to storage during renovation. Detailed inventory provided.",
        propertyType: "Townhouse",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you offer discreet unmarked vehicles?",
        answer:
          "Ask when booking. Options can be discussed for sensitive Knightsbridge moves.",
      },
      {
        question: "Can you meet building insurance requirements?",
        answer:
          "Yes. Share management schedules and we arrive with correct documentation.",
      },
      {
        question: "Is Sloane Street border included?",
        answer:
          "Yes. SW1X and immediate Knightsbridge streets are covered.",
      },
    ],
    testimonial: {
      quote:
        "Building manager was fussy. Crew had every document and left the lift immaculate.",
      author: "Victoria L.",
      moveType: "Luxury flat move, SW1X",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Belgravia",
    slug: "belgravia-removals",
    metaTitle: "Belgravia Removals | SW1W Square & Mews Moves",
    metaDescription:
      "Premium removals in Belgravia SW1W. Eaton Square, Chester Square and Belgravia mews. Fixed discreet quotes and porter experience.",
    h1: "Belgravia removals around the squares",
    intro:
      "Belgravia is squares, mews and strict standards. White stucco, black railings and portered blocks set expectations high. Moves here are about precision: correct paperwork, clean common parts and furniture wrapped before it crosses a threshold.",
    propertyTypes: [
      "Grand flats on Eaton and Chester Square",
      "Mews houses behind Grosvenor Crescent",
      "Portered blocks on Ebury Street",
      "Diplomatic residences",
      "Lateral conversions with period plasterwork",
    ],
    commonMoveTypes: [
      "Whole-house moves on Belgravia squares",
      "Diplomatic and embassy relocations",
      "Downsizing to smaller Belgravia flats",
      "Moves to Knightsbridge and Mayfair",
      "Renovation storage phases",
    ],
    parkingAccessNotes:
      "Square gardens limit kerb space to designated windows. Mews lanes need compact vans or shuttles. Portered buildings require lift padding and timed slots.",
    localRoads: [
      "Eaton Square",
      "Chester Square",
      "Ebury Street",
      "Elizabeth Street",
      "Lower Belgrave Street",
      "Wilton Crescent",
    ],
    localLandmarks: [
      "Eaton Square",
      "Belgrave Square",
      "St Peter's Church Eaton Square",
      "Elizabeth Street shops",
      "Victoria station fringe",
    ],
    postcodes: ["SW1W", "SW1X"],
    nearbyAreas: [
      { name: "Pimlico", slug: "pimlico-removals" },
      { name: "Knightsbridge", slug: "knightsbridge-removals" },
      { name: "Chelsea", slug: "chelsea-removals" },
      { name: "Mayfair", slug: "mayfair-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Belgravia",
        to: "Richmond",
        description:
          "Family retaining London links while gaining garden space.",
      },
      {
        from: "Eaton Square",
        to: "Guildford",
        description:
          "Surrey move timed around school term.",
      },
      {
        from: "Belgravia mews",
        to: "South Kensington",
        description:
          "Short central move with tight mews access at departure.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Chester Square flat to Mayfair. Porter coordination at both ends.",
        propertyType: "Square flat",
        month: "Recent example",
      },
      {
        summary:
          "Mews house to Weybridge. Narrow lane shuttle from Eaton Square area.",
        propertyType: "Mews house",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you work on Eaton and Chester Square?",
        answer:
          "Yes. SW1W squares and adjoining streets are regular premium work.",
      },
      {
        question: "Can you protect plaster cornices and marble?",
        answer:
          "Yes. Enhanced wrapping is available when you flag delicate interiors.",
      },
      {
        question: "Are Belgravia mews moves different to square flats?",
        answer:
          "Access varies. We survey mews width and quote accordingly with no day-of surprises.",
      },
    ],
    testimonial: {
      quote:
        "White hallway, black floor tiles. Not a scuff anywhere. Exactly what Belgravia expects.",
      author: "George H.",
      moveType: "Square flat move, SW1W",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Mayfair",
    slug: "mayfair-removals",
    metaTitle: "Mayfair Removals | W1K Luxury Flat & House Moves",
    metaDescription:
      "Discreet premium removals in Mayfair W1K. Grosvenor Square, Mount Street and Berkeley Square homes. Fixed quotes and central London expertise.",
    h1: "Mayfair removals in W1K",
    intro:
      "Mayfair is central, expensive and exacting. Serviced apartments, grand terraces and quiet mews behind Mount Street all require punctual crews and immaculate conduct. Congestion charging, resident parking and porter rules are factored into how we schedule your move.",
    propertyTypes: [
      "Serviced apartments on Park Lane fringe",
      "Terraces on Grosvenor and Berkeley Square",
      "Mews houses behind Mount Street",
      "Portered luxury blocks",
      "Corporate lets near Bond Street",
    ],
    commonMoveTypes: [
      "Corporate and diplomatic relocations",
      "Downsizing within Mayfair",
      "Moves to Belgravia and Knightsbridge",
      "Art and antique moves",
      "Short-term let changeovers",
    ],
    parkingAccessNotes:
      "Central Mayfair kerb space is scarce. Suspensions or porter-arranged bays are typical. Buildings often restrict working hours; we align crew arrival with management windows.",
    localRoads: [
      "Mount Street",
      "Grosvenor Square",
      "Berkeley Square",
      "South Audley Street",
      "Curzon Street",
      "Park Lane fringe",
    ],
    localLandmarks: [
      "Grosvenor Square",
      "Berkeley Square",
      "Bond Street",
      "Hyde Park corner",
      "Royal Academy fringe",
    ],
    postcodes: ["W1K", "W1J"],
    nearbyAreas: [
      { name: "Belgravia", slug: "belgravia-removals" },
      { name: "Knightsbridge", slug: "knightsbridge-removals" },
      { name: "Marylebone", slug: "st-johns-wood-removals" },
      { name: "Pimlico", slug: "pimlico-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Mayfair",
        to: "Richmond",
        description:
          "Downsizing from central luxury to riverside living.",
      },
      {
        from: "Grosvenor Square",
        to: "Chelsea",
        description:
          "Short west London move between prime addresses.",
      },
      {
        from: "Mayfair",
        to: "Wimbledon",
        description:
          "Family seeking space while keeping reasonable commute.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Berkeley Square apartment to storage. High-value contents inventory for insurance.",
        propertyType: "Luxury apartment",
        month: "Recent example",
      },
      {
        summary:
          "Mount Street mews to Belgravia flat. Compact van for final lane delivery.",
        propertyType: "Mews house",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you handle Bond Street area serviced flats?",
        answer:
          "Yes. W1K serviced buildings are familiar territory for our crews.",
      },
      {
        question: "Can moves start early to beat congestion?",
        answer:
          "Yes. Early slots are popular in Mayfair and available on request.",
      },
      {
        question: "Is Hyde Park corner fringe included?",
        answer:
          "Yes. W1J and W1K Mayfair streets are within coverage.",
      },
    ],
    testimonial: {
      quote:
        "Corporate relocation with tight timing. They were discreet, fast and left everything placed correctly.",
      author: "Richard E.",
      moveType: "Serviced flat move, W1K",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "St John's Wood",
    slug: "st-johns-wood-removals",
    metaTitle: "St John's Wood Removals | NW8 Family Home Moves",
    metaDescription:
      "Trusted removals in St John's Wood NW8. Abbey Road, Regent's Park borders and Wellington Place homes. Fixed north west London quotes.",
    h1: "St John's Wood removals in NW8",
    intro:
      "St John's Wood is leafier than central London with villa-style houses, mansion flats and quiet crescents near Regent's Park. Lord's Cricket Ground event days and school traffic on Wellington Road affect parking. We plan access honestly and protect the wide hallways and timber floors common here.",
    propertyTypes: [
      "Detached and semi-detached villas near Regent's Park",
      "Mansion flats on Wellington and Circus Road",
      "Townhouses on Hamilton Terrace",
      "Flats near St John's Wood station",
      "Family homes on the Maida Vale border",
    ],
    commonMoveTypes: [
      "Large family home relocations",
      "Moves from St John's Wood to Hampstead and Richmond",
      "Downsizing to smaller NW8 flats",
      "Cricket-ground-area timed moves",
      "International assignee relocations",
    ],
    parkingAccessNotes:
      "Wellington Road is busy on match days at Lord's. Mansion blocks need lift bookings. Villa drives help but overhanging trees sometimes limit lorry height.",
    localRoads: [
      "Abbey Road",
      "Wellington Road",
      "Hamilton Terrace",
      "Circus Road",
      "St John's Wood High Street",
      "Acacia Road",
    ],
    localLandmarks: [
      "Lord's Cricket Ground",
      "Regent's Park",
      "Abbey Road Studios",
      "St John's Wood Church",
      "Swiss Cottage fringe",
    ],
    postcodes: ["NW8"],
    nearbyAreas: [
      { name: "Maida Vale", slug: "maida-vale-removals" },
      { name: "Hampstead", slug: "hampstead-removals" },
      { name: "Marylebone", slug: "mayfair-removals" },
      { name: "Camden", slug: "camden-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "St John's Wood",
        to: "Hampstead",
        description:
          "North west move between similar family neighbourhoods.",
      },
      {
        from: "Hamilton Terrace",
        to: "Richmond",
        description:
          "Family crossing west for schools and Thames-side space.",
      },
      {
        from: "St John's Wood",
        to: "Wimbledon",
        description:
          "Southbound relocation with fixed cross-London price.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Five-bedroom villa near Regent's Park to Hampstead. Three crew over two days.",
        propertyType: "Detached villa",
        month: "Recent example",
      },
      {
        summary:
          "Mansion flat to Maida Vale. Lord's match day avoided when scheduling.",
        propertyType: "Mansion flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you plan around Lord's Cricket fixtures?",
        answer:
          "Yes. We check the calendar when you book central NW8 dates.",
      },
      {
        question: "Is Swiss Cottage border included?",
        answer:
          "Yes. NW8 including Wellington Road and Abbey Road is covered.",
      },
      {
        question: "Can you move large villas in one day?",
        answer:
          "Larger homes may need two days. We advise honestly after the survey.",
      },
    ],
    testimonial: {
      quote:
        "Big villa, lots of artwork. Crated properly and the team leader kept us updated.",
      author: "Diana K.",
      moveType: "Villa move, NW8",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Maida Vale",
    slug: "maida-vale-removals",
    metaTitle: "Maida Vale Removals | W9 Canal & Mansion Flat Moves",
    metaDescription:
      "Local removals in Maida Vale W9. Canal-side flats, Randolph Avenue houses and Little Venice borders. Fixed quotes and north west London experience.",
    h1: "Maida Vale removals by the canal",
    intro:
      "Maida Vale circles the Regent's Canal with mansion blocks, white stucco terraces and quiet roads towards Little Venice. Boats, narrow bridges and tree-lined avenues create a distinctive neighbourhood. Flats often have service lifts and strict management rules we follow without fuss.",
    propertyTypes: [
      "Mansion flats on Randolph and Elgin Avenues",
      "Canal-side apartments near Little Venice",
      "Houses on Maida Vale and Warrington Crescent",
      "Conversion flats on Formosa Street",
      "Rentals near Maida Vale station",
    ],
    commonMoveTypes: [
      "Mansion block moves with lift coordination",
      "Moves between Maida Vale and St John's Wood",
      "Downsizing from houses to canal flats",
      "Professional relocations to west London",
      "Tenancy changeovers on avenue mansion blocks",
    ],
    parkingAccessNotes:
      "Randolph Avenue is wide but permit-controlled. Canal towpath properties may need longer carries from nearest road parking. Mansion blocks require lift padding and timed slots.",
    localRoads: [
      "Randolph Avenue",
      "Elgin Avenue",
      "Maida Vale",
      "Warrington Crescent",
      "Formosa Street",
      "Warwick Avenue",
    ],
    localLandmarks: [
      "Little Venice",
      "Regent's Canal",
      "Maida Vale station",
      "Paddington Recreation Ground",
      "St Mark's Church",
    ],
    postcodes: ["W9"],
    nearbyAreas: [
      { name: "St John's Wood", slug: "st-johns-wood-removals" },
      { name: "Notting Hill", slug: "notting-hill-removals" },
      { name: "Kilburn", slug: "maida-vale-removals" },
      { name: "Paddington", slug: "maida-vale-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Maida Vale",
        to: "Richmond",
        description:
          "Family leaving canal-side flat for larger west London house.",
      },
      {
        from: "Little Venice",
        to: "Kensington",
        description:
          "Professional move towards west central employment.",
      },
      {
        from: "Maida Vale",
        to: "Hampstead",
        description:
          "North west upsizing with nursery contents packed separately.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Randolph Avenue mansion flat to Notting Hill. Porter sign-off at both buildings.",
        propertyType: "Mansion flat",
        month: "Recent example",
      },
      {
        summary:
          "Canal-side flat to Wimbledon. Lift booked and bike stored separately.",
        propertyType: "Canal apartment",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Little Venice included?",
        answer:
          "Yes. W9 canal streets and mansion avenues are fully covered.",
      },
      {
        question: "Can you access towpath-side properties?",
        answer:
          "We plan parking on nearest road and price longer carries after survey.",
      },
      {
        question: "Do you work with mansion block managers?",
        answer:
          "Yes. Insurance schedules and lift rules are standard on Maida Vale jobs.",
      },
    ],
    testimonial: {
      quote:
        "Canal flat with awkward lift. They measured first and brought the right trolley. Smooth day.",
      author: "Natalie B.",
      moveType: "Mansion flat move, W9",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Hampstead",
    slug: "hampstead-removals",
    metaTitle: "Hampstead Removals | NW3 Village & Heath Moves",
    metaDescription:
      "Premium removals in Hampstead NW3. Village lanes, Heath-side homes and Belsize Park borders. Fixed quotes and hillside access experience.",
    h1: "Hampstead removals on the NW3 slopes",
    intro:
      "Hampstead climbs. Village lanes near the High Street, grand houses on the Heath and Belsize Park terraces each present different access puzzles. Narrow curves, steep drives and expensive finishes mean we survey properly and send crews who protect property before they lift a box.",
    propertyTypes: [
      "Village cottages and townhouses near Hampstead High Street",
      "Large detached homes on the Heath borders",
      "Belsize Park terraces and mansion flats",
      "Flats near Hampstead tube",
      "Modern apartments on the South End Green fringe",
    ],
    commonMoveTypes: [
      "Whole-house moves on Heath-side roads",
      "Moves from Hampstead to St John's Wood and Richmond",
      "Downsizing within NW3",
      "International relocations",
      "Renovation storage phases",
    ],
    parkingAccessNotes:
      "Village lanes reject the largest lorries. Heath-side drives can be steep and wet in winter. We use smaller vehicles or staging points when geometry demands it.",
    localRoads: [
      "Hampstead High Street",
      "Fitzjohn's Avenue",
      "East Heath Road",
      "Belsize Park Gardens",
      "Heath Street",
      "South End Road",
    ],
    localLandmarks: [
      "Hampstead Heath",
      "Hampstead Village",
      "Kenwood House",
      "Jack Straw's Castle",
      "Fenton House",
    ],
    postcodes: ["NW3"],
    nearbyAreas: [
      { name: "St John's Wood", slug: "st-johns-wood-removals" },
      { name: "Camden", slug: "camden-removals" },
      { name: "Islington", slug: "islington-removals" },
      { name: "Highgate", slug: "hampstead-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Hampstead Village",
        to: "Richmond",
        description:
          "Family leaving the village for Thames-side gardens.",
      },
      {
        from: "Belsize Park",
        to: "Wimbledon",
        description:
          "Southbound move with fixed cross-London pricing.",
      },
      {
        from: "Hampstead Heath road",
        to: "Guildford",
        description:
          "Surrey relocation with home office and library packed separately.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Heath-side detached home to Cobham. Narrow lane shuttle and three crew over two days.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "Village cottage to Belsize flat. Antique furniture wrapped individually.",
        propertyType: "Period cottage",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Can large lorries reach Hampstead Village?",
        answer:
          "Often not. We plan smaller vans or shuttles after checking your street during survey.",
      },
      {
        question: "Is Belsize Park included?",
        answer:
          "Yes. NW3 including Belsize, South End Green and village centre is covered.",
      },
      {
        question: "Do you handle steep Heath drives?",
        answer:
          "Yes. Gradient and grip are assessed so vans park safely on move day.",
      },
    ],
    testimonial: {
      quote:
        "Lane too tight for our old movers' lorry. This team shuttled calmly and finished on time.",
      author: "William P.",
      moveType: "Heath-side house move, NW3",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Islington",
    slug: "islington-removals",
    metaTitle: "Islington Removals | N1 Georgian Terrace Moves",
    metaDescription:
      "Professional removals in Islington N1. Upper Street flats, Barnsbury squares and Angel rentals. Fixed north London quotes and terrace experience.",
    h1: "Islington removals across N1",
    intro:
      "Islington mixes Georgian squares, busy Upper Street rentals and newer builds towards City Road. Barnsbury terraces have steep stairs and painted woodwork. Angel and Essex Road traffic never really stops. We protect halls, quote stair carries clearly and turn up when agreed.",
    propertyTypes: [
      "Georgian terraces and squares in Barnsbury",
      "Flats above shops on Upper Street and Essex Road",
      "Modern apartments near Angel station",
      "Family houses towards Highbury borders",
      "Shared rentals popular with young professionals",
    ],
    commonMoveTypes: [
      "Barnsbury whole-house moves",
      "Rental changeovers near Angel",
      "Moves from Islington to Clapham and Camden",
      "Downsizing from houses to Upper Street flats",
      "Office moves for Upper Street businesses",
    ],
    parkingAccessNotes:
      "Upper Street loading is restricted during trading hours. Square garden streets need suspensions for larger vans. Shared hallways in conversions require tidy, quiet working.",
    localRoads: [
      "Upper Street",
      "Essex Road",
      "Colebrooke Row",
      "Liverpool Road",
      "Highbury Corner fringe",
      "St Paul's Road",
    ],
    localLandmarks: [
      "Angel station",
      "Upper Street",
      "Barnsbury Square",
      "Business Design Centre",
      "Regent's Canal Islington",
    ],
    postcodes: ["N1", "N5"],
    nearbyAreas: [
      { name: "Camden", slug: "camden-removals" },
      { name: "King's Cross", slug: "islington-removals" },
      { name: "Highbury", slug: "islington-removals" },
      { name: "Clapham", slug: "clapham-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Barnsbury",
        to: "Richmond",
        description:
          "Family leaving Georgian square for west London space.",
      },
      {
        from: "Angel",
        to: "Wimbledon",
        description:
          "South west relocation with two crew and one van.",
      },
      {
        from: "Islington",
        to: "Brighton",
        description:
          "Coastal move with early departure from N1.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Barnsbury terrace to Clapham. Painted staircase fully protected.",
        propertyType: "Georgian terrace",
        month: "Recent example",
      },
      {
        summary:
          "Upper Street flat share split into two tenancies. Rooms labelled clearly.",
        propertyType: "Shop-top flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover Barnsbury and Canonbury?",
        answer:
          "Yes. N1 squares and terrace streets are regular work for us.",
      },
      {
        question: "Can you move on busy Upper Street Saturdays?",
        answer:
          "Early starts help. We factor shop delivery traffic into your schedule.",
      },
      {
        question: "Are Angel and Essex Road included?",
        answer:
          "Yes. Central N1 from Angel to City Road fringe is covered.",
      },
    ],
    testimonial: {
      quote:
        "Barnsbury stairs are brutal. Price was clear upfront and the crew were steady all day.",
      author: "Chris N.",
      moveType: "Terrace move, N1",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Camden",
    slug: "camden-removals",
    metaTitle: "Camden Removals | NW1 Market & Terrace Moves",
    metaDescription:
      "Local removals in Camden NW1. Camden Town flats, Primrose Hill houses and Kentish Town borders. Fixed north London quotes.",
    h1: "Camden removals across NW1",
    intro:
      "Camden is loud, busy and full of vertical living. Market traffic, canal bridges and Victorian terraces stacked with flats make every job slightly different. Primrose Hill streets are quieter but parking is still competitive. We work cleanly in shared buildings and quote honestly for stair carries.",
    propertyTypes: [
      "Flats above Camden High Street and market arches",
      "Primrose Hill Victorian houses",
      "Kentish Town border terraces",
      "Canal-side apartments near Regent's Canal",
      "Housing association blocks with lift access",
    ],
    commonMoveTypes: [
      "Camden Town rental changeovers",
      "Moves from Primrose Hill to St John's Wood",
      "Shared-flat splits and student moves",
      "Family relocations south towards Islington",
      "Music studio and creative office moves",
    ],
    parkingAccessNotes:
      "Camden High Street is congested most weekends. Primrose Hill permit zones fill early. Canal towpath flats may need longer carries from nearest legal parking.",
    localRoads: [
      "Camden High Street",
      "Regent's Park Road",
      "Chalk Farm Road",
      "Kentish Town Road",
      "Gloucester Avenue",
      "Parkway",
    ],
    localLandmarks: [
      "Camden Market",
      "Regent's Canal",
      "Primrose Hill",
      "Roundhouse",
      "Camden Town station",
    ],
    postcodes: ["NW1"],
    nearbyAreas: [
      { name: "Islington", slug: "islington-removals" },
      { name: "Hampstead", slug: "hampstead-removals" },
      { name: "St John's Wood", slug: "st-johns-wood-removals" },
      { name: "Kentish Town", slug: "camden-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Primrose Hill",
        to: "Richmond",
        description:
          "Family crossing west from north London village streets.",
      },
      {
        from: "Camden Town",
        to: "Clapham",
        description:
          "Rental move south popular with young professionals.",
      },
      {
        from: "Camden",
        to: "Wimbledon",
        description:
          "South west relocation with fixed journey quote.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Primrose Hill house to Hampstead. Street suspension arranged by client.",
        propertyType: "Victorian house",
        month: "Recent example",
      },
      {
        summary:
          "Camden market-area flat to Islington. Early Sunday start to beat crowds.",
        propertyType: "Conversion flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover Chalk Farm and Kentish Town borders?",
        answer:
          "Yes. NW1 including Camden Town, Primrose Hill and Chalk Farm is covered.",
      },
      {
        question: "Can you avoid Camden Market peak crowds?",
        answer:
          "We schedule early or weekday slots when market congestion would slow loading.",
      },
      {
        question: "Do you split shared Camden flat moves?",
        answer:
          "Yes. We label by room so each tenant's items reach the right address.",
      },
    ],
    testimonial: {
      quote:
        "Market street flat on a Sunday morning. They started early and were gone before it got busy.",
      author: "Megan S.",
      moveType: "Flat move, NW1",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Vauxhall",
    slug: "vauxhall-removals",
    metaTitle: "Vauxhall Removals | SW8 Riverside Tower Moves",
    metaDescription:
      "Professional removals in Vauxhall SW8. Nine Elms towers, Vauxhall Cross flats and Kennington borders. Fixed quotes and new-build lift experience.",
    h1: "Vauxhall removals in the Nine Elms corridor",
    intro:
      "Vauxhall has transformed with riverside towers, diplomatic density and fast links to the City. New builds need lift bookings and loading bay slots; older stock near Vauxhall Cross faces busy gyratory traffic. We know both worlds and quote fixed prices once access is clear.",
    propertyTypes: [
      "Riverside towers in Nine Elms",
      "Flats near Vauxhall station and bus station",
      "Houses on the Kennington and Oval borders",
      "Diplomatic and corporate lets",
      "Older mansion conversions towards Pimlico fringe",
    ],
    commonMoveTypes: [
      "Nine Elms tower moves with concierge coordination",
      "Professional relocations to Canary Wharf and City",
      "Moves from Vauxhall to Clapham and Battersea",
      "Downsizing from houses to riverside flats",
      "Tenancy changeovers in SW8 rentals",
    ],
    parkingAccessNotes:
      "Nine Elms developments issue strict van rules and time slots. Vauxhall Cross gyratory makes kerb stops brief. We file building paperwork early and align crew arrival with concierge windows.",
    localRoads: [
      "Nine Elms Lane",
      "Wandsworth Road Vauxhall",
      "South Lambeth Road",
      "Albert Embankment",
      "Vauxhall Walk",
      "Kennington Lane",
    ],
    localLandmarks: [
      "Vauxhall station",
      "Nine Elms",
      "MI6 building",
      "Vauxhall Pleasure Gardens",
      "Tate Britain fringe",
    ],
    postcodes: ["SW8", "SW11"],
    nearbyAreas: [
      { name: "Battersea", slug: "battersea-removals" },
      { name: "Pimlico", slug: "pimlico-removals" },
      { name: "Kennington", slug: "vauxhall-removals" },
      { name: "Clapham", slug: "clapham-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Nine Elms tower",
        to: "Canary Wharf",
        description:
          "Professional move east with early slot at riverside loading bay.",
      },
      {
        from: "Vauxhall",
        to: "Wimbledon",
        description:
          "South west family move with nursery packed separately.",
      },
      {
        from: "Albert Embankment",
        to: "Richmond",
        description:
          "Riverside to riverside move with bridge traffic planned in.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Two-bedroom Nine Elms flat to Battersea. Loading bay booked and lift padded.",
        propertyType: "Riverside tower flat",
        month: "Recent example",
      },
      {
        summary:
          "Kennington border house to Clapham. Gyratory traffic avoided with early start.",
        propertyType: "Terrace house",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you move from Nine Elms new builds?",
        answer:
          "Yes. Concierge slots, lift rules and damage waivers are standard on SW8 tower jobs.",
      },
      {
        question: "Is Kennington border included?",
        answer:
          "Yes. SW8 including Oval and Kennington fringe is covered.",
      },
      {
        question: "Can you work early before gyratory peak?",
        answer:
          "Yes. Early Vauxhall starts are popular and available on request.",
      },
    ],
    testimonial: {
      quote:
        "Nine Elms concierge had a long checklist. Crew ticked every box and we were in by lunch.",
      author: "Daniel F.",
      moveType: "Tower flat move, SW8",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Walton-on-Thames",
    slug: "walton-on-thames-removals",
    metaTitle: "Walton-on-Thames Removals | KT12 Riverside Moves",
    metaDescription:
      "Trusted removals in Walton-on-Thames KT12. Bridge Street, riverside flats and Ashley Park homes. Fixed Surrey quotes and Thames corridor experience.",
    h1: "Walton-on-Thames removals on the Thames",
    intro:
      "Walton-on-Thames sits between Weybridge and Hersham with a busy town centre, riverside walks and established residential roads towards Ashley Park. Commuters use the fast line while families value the green spaces along the river. We plan parking around Bridge Street traffic and quote fixed prices for local and London-bound moves.",
    propertyTypes: [
      "Riverside apartments near Walton Bridge",
      "Victorian and Edwardian houses on Ashley Park",
      "Semis and detached homes towards Hersham border",
      "Town centre flats above Bridge Street retail",
      "New-build homes on the edge of town",
    ],
    commonMoveTypes: [
      "Moves between Walton and Weybridge",
      "Commuter relocations to South West London",
      "Downsizing from detached homes to town flats",
      "Family moves within KT12",
      "Office moves for local business parks",
    ],
    parkingAccessNotes:
      "Bridge Street and High Street loading is restricted during shop hours. Riverside lanes are narrow with limited turning space. Ashley Park roads are easier for parking but drives can be sloped.",
    localRoads: [
      "Bridge Street Walton",
      "High Street Walton-on-Thames",
      "Ashley Park Road",
      "Oatlands Drive fringe",
      "Hersham Road",
      "Rydens Road",
    ],
    localLandmarks: [
      "Walton Bridge",
      "River Thames",
      "Ashley Park",
      "Walton-on-Thames station",
      "Elmbridge meadows",
    ],
    postcodes: ["KT12"],
    nearbyAreas: [
      { name: "Weybridge", slug: "weybridge-removals" },
      { name: "Esher", slug: "esher-removals" },
      { name: "Hersham", slug: "walton-on-thames-removals" },
      { name: "Chertsey", slug: "weybridge-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Walton-on-Thames",
        to: "Richmond",
        description:
          "Thames-side family crossing the river into London with garden contents included.",
      },
      {
        from: "Ashley Park",
        to: "Cobham",
        description:
          "Short Surrey move between similar executive housing stock.",
      },
      {
        from: "Walton town centre",
        to: "Wimbledon",
        description:
          "Commuter move north with fixed cross-county pricing.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Four-bedroom Ashley Park house to Weybridge. Garden furniture and shed cleared.",
        propertyType: "Edwardian house",
        month: "Recent example",
      },
      {
        summary:
          "Riverside flat to Esher semi. Smaller van for final lane near the bridge.",
        propertyType: "Riverside apartment",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover Hersham and Rydens Road area?",
        answer:
          "Yes. KT12 including Ashley Park, town centre and Hersham border is covered.",
      },
      {
        question: "Can you move on Walton Bridge event days?",
        answer:
          "We plan routes and timing when local events affect bridge and town centre traffic.",
      },
      {
        question: "Are Walton to Weybridge moves fixed price?",
        answer:
          "Yes. Short Surrey hops are quoted as fixed journeys after your survey.",
      },
    ],
    testimonial: {
      quote:
        "Ashley Park to Richmond. Quote stayed fixed and the crew were careful on our oak floors.",
      author: "Simon R.",
      moveType: "Family home move, KT12",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Ashtead",
    slug: "ashtead-removals",
    metaTitle: "Ashtead Removals | KT21 Village House Moves",
    metaDescription:
      "Local removals in Ashtead KT21. Village commons, station roads and Epsom borders. Fixed Surrey quotes and careful family home handling.",
    h1: "Ashtead removals in the KT21 village",
    intro:
      "Ashtead keeps a village centre around the commons with larger family homes on the slopes towards Epsom and Leatherhead. Station Road carries commuter traffic while quieter lanes near Ashtead Park need thoughtful van positioning. We survey drives and staircases before quoting a fixed price.",
    propertyTypes: [
      "Detached and semi-detached homes near Ashtead Park",
      "Village cottages around the commons",
      "Flats and maisonettes near Ashtead station",
      "Bungalows on the Leatherhead border",
      "Family houses on Barnett Wood Lane",
    ],
    commonMoveTypes: [
      "Village house moves within KT21",
      "Moves from Ashtead to Epsom and Leatherhead",
      "London to Ashtead family relocations",
      "Downsizing from larger detached homes",
      "Garage and garden building contents",
    ],
    parkingAccessNotes:
      "Station Road parking fills on weekday mornings. Commons area lanes are narrow for long lorries. Sloped drives on park-side roads need safe van placement in wet weather.",
    localRoads: [
      "Station Road Ashtead",
      "The Street Ashtead",
      "Barnett Wood Lane",
      "Craddocks Avenue",
      "Link Road",
      "Epsom Road Ashtead",
    ],
    localLandmarks: [
      "Ashtead Common",
      "Ashtead Park",
      "Ashtead station",
      "St Georges Church",
      "Ashtead Peace Memorial",
    ],
    postcodes: ["KT21"],
    nearbyAreas: [
      { name: "Leatherhead", slug: "leatherhead-removals" },
      { name: "Epsom", slug: "epsom-removals" },
      { name: "Bookham", slug: "bookham-removals" },
      { name: "Fetcham", slug: "fetcham-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Ashtead",
        to: "Wimbledon",
        description:
          "Commuter family move north with schools often cited as the driver.",
      },
      {
        from: "Ashtead village",
        to: "Guildford",
        description:
          "Deeper Surrey relocation from a larger detached home.",
      },
      {
        from: "Ashtead",
        to: "Clapham",
        description:
          "Young professional move back towards central London rentals.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Detached home on Barnett Wood Lane to Leatherhead. Loft and garage workshop cleared.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "Village cottage to Epsom flat. Narrow lane shuttle from commons area.",
        propertyType: "Period cottage",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Ashtead Common area included?",
        answer:
          "Yes. KT21 village, commons and park roads are within standard coverage.",
      },
      {
        question: "Can you move pianos in Ashtead houses?",
        answer:
          "Yes, with prior survey of stairs and doorway widths.",
      },
      {
        question: "Do you offer packing before Ashtead moves?",
        answer:
          "Yes. Separate pack days are popular for larger village properties.",
      },
    ],
    testimonial: {
      quote:
        "Sloped drive made us nervous but they positioned the van safely and worked methodically.",
      author: "Patricia G.",
      moveType: "Detached home move, KT21",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Virginia Water",
    slug: "virginia-water-removals",
    metaTitle: "Virginia Water Removals | GU25 Estate Home Moves",
    metaDescription:
      "Premium removals in Virginia Water GU25. Wentworth Estate borders, lake roads and commuter village homes. Fixed Surrey quotes and private-road experience.",
    h1: "Virginia Water removals in GU25",
    intro:
      "Virginia Water is one of Surrey's most recognisable addresses. Large plots, private roads and properties near the lake and Wentworth fringe demand careful planning. Security gates, gravel drives and tight tree canopies affect which vehicle we send. We quote fixed crew days after understanding your access properly.",
    propertyTypes: [
      "Executive homes on private estate roads",
      "Lake-side properties on Portnall Drive approaches",
      "Family houses towards Trumps Green",
      "Flats near Virginia Water station",
      "Bungalows on wooded Surrey lanes",
    ],
    commonMoveTypes: [
      "Whole-house moves on estate roads",
      "Relocations from Virginia Water to London",
      "Downsizing within GU25",
      "Moves with gym, wine and garden outbuildings",
      "International assignee relocations",
    ],
    parkingAccessNotes:
      "Private estate rules vary on van size and working hours. Lake roads are scenic but narrow. Gravel drives may need ground protection and smaller vehicles when overhanging branches limit height.",
    localRoads: [
      "Portnall Drive",
      "London Road Virginia Water",
      "Trumps Green Road",
      "Wentworth Drive fringe",
      "Christchurch Road",
      "Sandhurst Road",
    ],
    localLandmarks: [
      "Virginia Water lake",
      "Wentworth Estate fringe",
      "Virginia Water station",
      "Windsor Great Park border",
      "Trumps Green",
    ],
    postcodes: ["GU25"],
    nearbyAreas: [
      { name: "Ascot", slug: "ascot-removals" },
      { name: "Sunningdale", slug: "sunningdale-removals" },
      { name: "Egham", slug: "staines-removals" },
      { name: "Windlesham", slug: "windlesham-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Virginia Water",
        to: "Kensington",
        description:
          "Executive move back towards central London with fragile contents.",
      },
      {
        from: "Virginia Water estate",
        to: "Cobham",
        description:
          "Surrey internal move between private-road properties.",
      },
      {
        from: "Virginia Water",
        to: "Richmond",
        description:
          "Family crossing the river while keeping west London links.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Five-bedroom estate home to Ascot. Gate codes shared in advance and gravel drive protected.",
        propertyType: "Executive detached",
        month: "Recent example",
      },
      {
        summary:
          "Lake-area bungalow to Sunningdale flat. Narrow lane shuttle planned during survey.",
        propertyType: "Bungalow",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you move from Wentworth fringe roads?",
        answer:
          "Yes. GU25 including estate borders and lake roads is covered with prior access checks.",
      },
      {
        question: "Can you handle gated private roads?",
        answer:
          "Yes. Share gate rules and any weight limits when you book.",
      },
      {
        question: "Are large outbuildings included in quotes?",
        answer:
          "Yes. Gym, pool houses and garden offices are listed during surveying.",
      },
    ],
    testimonial: {
      quote:
        "Private road rules were strict. Crew had done this before and everything ran to plan.",
      author: "Jonathan M.",
      moveType: "Estate home move, GU25",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Sunbury-on-Thames",
    slug: "sunbury-on-thames-removals",
    metaTitle: "Sunbury-on-Thames Removals | TW16 Riverside Moves",
    metaDescription:
      "Reliable removals in Sunbury-on-Thames TW16. Thames Street, Greenlands fringe and Kempton Park borders. Fixed Surrey-Thames quotes.",
    h1: "Sunbury-on-Thames removals by the river",
    intro:
      "Sunbury-on-Thames stretches along the Thames with Greenlands and Kempton Park shaping local character. Thames Street and French Street hold period charm and tight access, while newer estates towards Ashford offer easier parking. Race days at Kempton can affect timing, which we factor in when you book.",
    propertyTypes: [
      "Riverside cottages and terraces on Thames Street",
      "Semis and detached homes towards Sunbury Cross",
      "Flats near Sunbury and Kempton Park stations",
      "Properties on the Shepperton border",
      "Bungalows on quiet residential closes",
    ],
    commonMoveTypes: [
      "Riverside cottage moves within TW16",
      "Relocations to Walton and Staines",
      "Commuter moves to South West London",
      "Downsizing within Sunbury",
      "Moves linked to river-side renovations",
    ],
    parkingAccessNotes:
      "Thames Street lanes are narrow with limited passing places. Kempton Park event days reduce nearby parking. Sunbury Cross carries heavy traffic; early starts help for town fringe properties.",
    localRoads: [
      "Thames Street Sunbury",
      "French Street",
      "Green Street Sunbury",
      "Staines Road East",
      "Nelson Road",
      "Charlton Road",
    ],
    localLandmarks: [
      "River Thames",
      "Kempton Park racecourse",
      "Sunbury Court",
      "Sunbury Cross",
      "Greenlands fringe",
    ],
    postcodes: ["TW16"],
    nearbyAreas: [
      { name: "Staines", slug: "staines-removals" },
      { name: "Walton-on-Thames", slug: "walton-on-thames-removals" },
      { name: "Shepperton", slug: "sunbury-on-thames-removals" },
      { name: "Hampton", slug: "richmond-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Sunbury riverside",
        to: "Richmond",
        description:
          "Thames corridor move with bridge traffic built into journey time.",
      },
      {
        from: "Sunbury",
        to: "Weybridge",
        description:
          "Short Surrey hop across the Elmbridge border.",
      },
      {
        from: "Sunbury Cross",
        to: "Wimbledon",
        description:
          "Family move north with fixed cross-London price.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Thames Street cottage to Walton semi. Shuttle from main road due to narrow lane.",
        propertyType: "Riverside cottage",
        month: "Recent example",
      },
      {
        summary:
          "Detached home near Kempton to Staines. Move scheduled away from race day.",
        propertyType: "Detached home",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you plan around Kempton Park fixtures?",
        answer:
          "Yes. We check event dates when you book TW16 moves near the course.",
      },
      {
        question: "Is Shepperton border included?",
        answer:
          "Yes. TW16 including Sunbury Cross and riverside streets is covered.",
      },
      {
        question: "Can you access Thames Street cottages?",
        answer:
          "Yes. We survey lane width and plan shuttle runs when needed.",
      },
    ],
    testimonial: {
      quote:
        "Race day was the same weekend. They picked a smart slot and we were loaded before crowds arrived.",
      author: "Karen S.",
      moveType: "Cottage move, TW16",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Staines",
    slug: "staines-removals",
    metaTitle: "Staines Removals | TW18 Thames Valley Moves",
    metaDescription:
      "Professional removals in Staines-upon-Thames TW18. Town centre, riverside and Laleham borders. Fixed Surrey quotes and M25 corridor experience.",
    h1: "Staines removals across TW18",
    intro:
      "Staines-upon-Thames is a Thames Valley hub with strong links to London and the M25. The town centre mixes flats and offices while riverside roads and Laleham borders offer larger family homes. Two rivers meet nearby, and bridge traffic can affect journey timing on busy days.",
    propertyTypes: [
      "Town centre apartments near Staines station",
      "Riverside homes along the Thames Path",
      "Semis and detached houses towards Laleham",
      "Flats in the Elmsleigh Centre area",
      "Properties on the Ashford and Stanwell borders",
    ],
    commonMoveTypes: [
      "Moves within Staines and into Surrey villages",
      "Commuter relocations to South West London",
      "Downsizing from family homes to town flats",
      "Office moves for Thames Valley business parks",
      "Moves towards Heathrow corridor employment",
    ],
    parkingAccessNotes:
      "High Street and Mustard Mill Road loading is time-limited. Riverside lanes need compact vans on the tightest sections. Laleham roads are quieter but carries from rear gardens are common.",
    localRoads: [
      "High Street Staines",
      "Thames Street Staines",
      "London Road Staines",
      "Mustard Mill Road",
      "Wraysbury Road",
      "Laleham Road",
    ],
    localLandmarks: [
      "River Thames",
      "Staines station",
      "Two Rivers shopping centre",
      "Laleham Abbey fringe",
      "Staines Memorial Gardens",
    ],
    postcodes: ["TW18", "TW19"],
    nearbyAreas: [
      { name: "Egham", slug: "staines-removals" },
      { name: "Sunbury-on-Thames", slug: "sunbury-on-thames-removals" },
      { name: "Virginia Water", slug: "virginia-water-removals" },
      { name: "Windsor", slug: "virginia-water-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Staines",
        to: "Windsor",
        description:
          "Short Thames Valley move between commuter towns.",
      },
      {
        from: "Staines riverside",
        to: "Richmond",
        description:
          "Family crossing into London with garden tools included.",
      },
      {
        from: "Staines",
        to: "Guildford",
        description:
          "Surrey internal relocation with two-day pack option.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Town centre flat to Laleham detached. Lift rules at departure, drive at arrival.",
        propertyType: "Town centre flat",
        month: "Recent example",
      },
      {
        summary:
          "Four-bedroom Laleham house to Virginia Water. Completion day timing with solicitors.",
        propertyType: "Detached home",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover Laleham and Ashford borders?",
        answer:
          "Yes. TW18 and immediate Staines fringe including Laleham is covered.",
      },
      {
        question: "Can you move early for Heathrow workers?",
        answer:
          "Yes. Early starts suit commuters around TW18.",
      },
      {
        question: "Are Staines to Windsor moves fixed price?",
        answer:
          "Yes. Short Thames Valley routes are quoted fixed after survey.",
      },
    ],
    testimonial: {
      quote:
        "Laleham to Richmond on completion day. They waited when keys were late and still finished calmly.",
      author: "Mark D.",
      moveType: "Detached home move, TW18",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Addlestone",
    slug: "addlestone-removals",
    metaTitle: "Addlestone Removals | KT15 Local House Moves",
    metaDescription:
      "Trusted removals in Addlestone KT15. Station roads, Weybridge borders and Chertsey fringe homes. Fixed Surrey quotes and commuter corridor experience.",
    h1: "Addlestone removals across KT15",
    intro:
      "Addlestone is a practical Surrey town between Weybridge and Chertsey with good road links and a busy station. Housing ranges from post-war semis to newer estates towards New Haw. We quote fixed prices for local moves and journeys into South West London without surprise extras on the day.",
    propertyTypes: [
      "Semis and terraces near Addlestone station",
      "Detached homes towards Ottershaw border",
      "Flats on the town centre fringe",
      "Bungalows on residential closes",
      "Properties near the Brooklands business fringe",
    ],
    commonMoveTypes: [
      "Moves between Addlestone and Weybridge",
      "Commuter moves to Walton and Richmond",
      "Family relocations within KT15",
      "Downsizing to smaller semis",
      "Part-load furniture deliveries",
    ],
    parkingAccessNotes:
      "Station approach roads fill on weekday mornings. Town centre loading needs sensible timing. Narrower lanes towards Chertsey may need a smaller van for final delivery.",
    localRoads: [
      "Station Road Addlestone",
      "Chertsey Road Addlestone",
      "Garfield Road",
      "New Haw Road",
      "Weybridge Road Addlestone",
      "Byfleet Road fringe",
    ],
    localLandmarks: [
      "Addlestone station",
      "Woburn Hill",
      "Addlestone Moor",
      "Brooklands fringe",
      "St Pauls Church",
    ],
    postcodes: ["KT15"],
    nearbyAreas: [
      { name: "Weybridge", slug: "weybridge-removals" },
      { name: "Chertsey", slug: "weybridge-removals" },
      { name: "Walton-on-Thames", slug: "walton-on-thames-removals" },
      { name: "Woking", slug: "woking-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Addlestone",
        to: "Weybridge",
        description:
          "Short Elmbridge move often done in a morning.",
      },
      {
        from: "Addlestone",
        to: "Wimbledon",
        description:
          "Commuter family move north with fixed pricing.",
      },
      {
        from: "Addlestone semi",
        to: "Cobham",
        description:
          "Upsizing within Surrey with garage contents included.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Three-bedroom semi to Weybridge townhouse. IKEA wardrobes dismantled on site.",
        propertyType: "Semi-detached",
        month: "Recent example",
      },
      {
        summary:
          "Flat near station to Woking new-build. Afternoon slot after parking confirmed.",
        propertyType: "Flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is New Haw and Ottershaw border covered?",
        answer:
          "Yes. KT15 including station area and Chertsey fringe is within coverage.",
      },
      {
        question: "Can you move from Brooklands fringe offices?",
        answer:
          "Yes. Small office moves in KT15 are available on request.",
      },
      {
        question: "Are quotes fixed for Addlestone?",
        answer:
          "Yes. Your agreed price holds if access matches the survey.",
      },
    ],
    testimonial: {
      quote:
        "Addlestone to Weybridge in one morning. Straightforward quote and a hardworking crew.",
      author: "Steve L.",
      moveType: "Semi move, KT15",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Oxshott",
    slug: "oxshott-removals",
    metaTitle: "Oxshott Removals | KT22 Premium Surrey Moves",
    metaDescription:
      "Premium removals in Oxshott KT22. Private roads, wooded plots and Esher borders. Fixed quotes for large Surrey homes and careful high-value handling.",
    h1: "Oxshott removals on private Surrey roads",
    intro:
      "Oxshott is discreet Surrey wealth: wooded plots, long drives and houses set back from the road. Access is often the story here, not distance. We check bridge weight limits, overhanging trees and gravel surfaces before confirming vehicle size and crew days.",
    propertyTypes: [
      "Large detached homes on private lanes",
      "Executive houses on the Esher and Leatherhead borders",
      "Renovated properties with home gyms and offices",
      "Bungalows on wooded plots",
      "New-build completions on edge plots",
    ],
    commonMoveTypes: [
      "Whole-house moves on Oxshott lanes",
      "Relocations to London and back",
      "Downsizing within KT22",
      "Moves with wine cellars and gym equipment",
      "Renovation storage phases",
    ],
    parkingAccessNotes:
      "Many drives are long, gravel and tree-lined. Some lanes reject artic lorries entirely. We stage on a main road with shuttle runs when geometry demands it.",
    localRoads: [
      "Oxshott Road",
      "Portsmouth Road fringe",
      "Stoke D'Abernon border lanes",
      "Woodlands Road",
      "Holt Road",
      "Esher Road Oxshott",
    ],
    localLandmarks: [
      "Oxshott Woods",
      "Oxshott village shops",
      "Esher border commons",
      "Leatherhead Road approaches",
      "Private estate lanes",
    ],
    postcodes: ["KT22"],
    nearbyAreas: [
      { name: "Esher", slug: "esher-removals" },
      { name: "Leatherhead", slug: "leatherhead-removals" },
      { name: "Cobham", slug: "cobham-removals" },
      { name: "Ashtead", slug: "ashtead-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Oxshott",
        to: "Chelsea",
        description:
          "Executive move towards central London with fragile contents.",
      },
      {
        from: "Oxshott",
        to: "Cobham",
        description:
          "Short premium Surrey hop between private-road homes.",
      },
      {
        from: "Oxshott",
        to: "Richmond",
        description:
          "Family crossing the river with garden statuary wrapped separately.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Six-bedroom wooded plot home to Weybridge. Three crew, shuttle from main road, two-day pack.",
        propertyType: "Executive detached",
        month: "Recent example",
      },
      {
        summary:
          "Oxshott bungalow to Leatherhead flat. Gravel drive protected with mats.",
        propertyType: "Bungalow",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Can large lorries reach Oxshott lanes?",
        answer:
          "Often not. We survey and plan shuttles or smaller vehicles before booking.",
      },
      {
        question: "Do you handle gym and wine cellar contents?",
        answer:
          "Yes. List heavy and fragile items during quoting.",
      },
      {
        question: "Is Esher border included?",
        answer:
          "Yes. KT22 Oxshott including wooded lanes is fully covered.",
      },
    ],
    testimonial: {
      quote:
        "Our lane is awkward. They shuttled without complaint and protected the gravel properly.",
      author: "Fiona W.",
      moveType: "Executive home move, KT22",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Claygate",
    slug: "claygate-removals",
    metaTitle: "Claygate Removals | KT10 Village & Station Moves",
    metaDescription:
      "Local removals in Claygate KT10. Village centre, station roads and Esher commons borders. Fixed Surrey quotes and family home experience.",
    h1: "Claygate removals in the KT10 village",
    intro:
      "Claygate feels like a village with a station. The parade, commons and quiet residential roads towards Hinchley Wood attract families who want space without leaving Surrey. Steep sections near the railway and narrow village lanes mean we choose van size carefully.",
    propertyTypes: [
      "Family semis and detached homes near Claygate station",
      "Village properties on The Parade",
      "Houses towards Hinchley Wood and Esher borders",
      "Bungalows on wooded lanes",
      "Flats in smaller village conversions",
    ],
    commonMoveTypes: [
      "Village house moves within KT10",
      "Moves from Claygate to Surbiton and Kingston",
      "London to Claygate family relocations",
      "Downsizing within the village",
      "School-term timed moves",
    ],
    parkingAccessNotes:
      "The Parade has shop delivery traffic during the day. Station car park rules affect some central flats. Wooded lanes may need smaller vans when branches limit height.",
    localRoads: [
      "The Parade Claygate",
      "St Leonards Road",
      "Foley Road",
      "Red Lane",
      "Hinchley Wood Way fringe",
      "Portsmouth Road fringe",
    ],
    localLandmarks: [
      "Claygate station",
      "Claygate Common",
      "The Parade shops",
      "St Leonards Church",
      "Hinchley Wood border",
    ],
    postcodes: ["KT10"],
    nearbyAreas: [
      { name: "Esher", slug: "esher-removals" },
      { name: "Surbiton", slug: "surbiton-removals" },
      { name: "Oxshott", slug: "oxshott-removals" },
      { name: "Kingston upon Thames", slug: "kingston-upon-thames-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Claygate",
        to: "Surbiton",
        description:
          "Short move along the commuter line with similar housing stock.",
      },
      {
        from: "Claygate village",
        to: "Guildford",
        description:
          "Deeper Surrey relocation from a family detached home.",
      },
      {
        from: "Claygate",
        to: "Wimbledon",
        description:
          "Northbound move with fixed cross-county quote.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Four-bedroom house near station to Cobham. Children's rooms packed and labelled.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "Village cottage to Surbiton flat. Narrow lane shuttle planned in advance.",
        propertyType: "Cottage",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Hinchley Wood border included?",
        answer:
          "Yes. KT10 Claygate village and fringe roads are covered.",
      },
      {
        question: "Can you move during school term?",
        answer:
          "Yes. We schedule around local school traffic where practical.",
      },
      {
        question: "Do you offer Claygate to Kingston moves?",
        answer:
          "Yes. Short hops to KT1 and KT2 are routine fixed-price routes.",
      },
    ],
    testimonial: {
      quote:
        "Claygate to Surbiton before school pick-up. Early start, done on time, very tidy.",
      author: "Helen C.",
      moveType: "Family home move, KT10",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Bookham",
    slug: "bookham-removals",
    metaTitle: "Bookham Removals | KT23 Great & Little Bookham",
    metaDescription:
      "Trusted removals in Great and Little Bookham KT23. Village commons, station roads and Leatherhead borders. Fixed Surrey family home quotes.",
    h1: "Bookham removals across KT23",
    intro:
      "Bookham splits into Great and Little Bookham with commons, village shops and family housing spread between them. Leatherhead and Fetcham are close neighbours. Rural lanes on the edges need honest access surveys while village centres need parking thought on market mornings.",
    propertyTypes: [
      "Village houses near Great Bookham shops",
      "Semis and detached homes towards Little Bookham",
      "Properties backing onto Bookham Commons",
      "Flats near Bookham station",
      "Cottages on rural Surrey lanes",
    ],
    commonMoveTypes: [
      "Moves within Great and Little Bookham",
      "Relocations to Leatherhead and Dorking",
      "London to Bookham family moves",
      "Downsizing from larger village houses",
      "Moves with stables and outbuildings",
    ],
    parkingAccessNotes:
      "High Street Great Bookham has shop delivery windows. Commons lanes are narrow. Station area parking competes with commuters on weekdays.",
    localRoads: [
      "High Street Great Bookham",
      "Lower Road Bookham",
      "Beeches Road",
      "Eastwick Road",
      "Chrystie Road",
      "Dorking Road Bookham",
    ],
    localLandmarks: [
      "Bookham Commons",
      "Great Bookham village",
      "Bookham station",
      "St Nicolas Church",
      "Little Bookham green",
    ],
    postcodes: ["KT23"],
    nearbyAreas: [
      { name: "Fetcham", slug: "fetcham-removals" },
      { name: "Leatherhead", slug: "leatherhead-removals" },
      { name: "Ashtead", slug: "ashtead-removals" },
      { name: "Dorking", slug: "dorking-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Great Bookham",
        to: "Leatherhead",
        description:
          "Short Surrey village move with similar property types.",
      },
      {
        from: "Bookham",
        to: "Wimbledon",
        description:
          "Commuter family relocation north.",
      },
      {
        from: "Little Bookham",
        to: "Guildford",
        description:
          "Staying in Surrey with a move to university town housing.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Commons-side house to Leatherhead. Garden office dismantled and moved.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "Village flat to Fetcham semi. Market morning avoided with early start.",
        propertyType: "Village flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover both Great and Little Bookham?",
        answer:
          "Yes. KT23 villages and commons area are fully covered.",
      },
      {
        question: "Can you move stable and tack room contents?",
        answer:
          "Yes. Outbuildings are listed during quoting.",
      },
      {
        question: "Is Bookham station area included?",
        answer:
          "Yes. Station roads and village centre are within coverage.",
      },
    ],
    testimonial: {
      quote:
        "Little Bookham lane was tight. Smaller van shuttle worked perfectly and nothing was rushed.",
      author: "Roger T.",
      moveType: "Village house move, KT23",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Fetcham",
    slug: "fetcham-removals",
    metaTitle: "Fetcham Removals | KT22 Village & Downs Moves",
    metaDescription:
      "Local removals in Fetcham KT22. Village street, Leatherhead borders and downs-side homes. Fixed Surrey quotes and lane access experience.",
    h1: "Fetcham removals in KT22",
    intro:
      "Fetcham sits between Leatherhead and the North Downs with a proper village street and larger homes on the slopes. The Cobham Road carries through traffic while quieter crescents offer drives and gardens families want. We match crew and vehicles to your access rather than sending the biggest lorry by default.",
    propertyTypes: [
      "Village houses on The Street Fetcham",
      "Detached homes on downs-side roads",
      "Semis towards Leatherhead border",
      "Bungalows on quiet closes",
      "Properties near Fetcham Springs",
    ],
    commonMoveTypes: [
      "Village moves within Fetcham",
      "Moves to Leatherhead and Bookham",
      "Family relocations to London",
      "Downsizing within KT22",
      "Garage workshop and garden moves",
    ],
    parkingAccessNotes:
      "The Street is narrow through the village centre. Downs roads can be steep. We confirm van length and whether shuttle delivery is needed during the survey.",
    localRoads: [
      "The Street Fetcham",
      "Cobham Road Fetcham",
      "Bell Lane Fetcham",
      "Downs Road",
      "Guildford Road Fetcham",
      "Leatherhead Road fringe",
    ],
    localLandmarks: [
      "Fetcham village street",
      "Fetcham Springs",
      "North Downs fringe",
      "St Marys Church Fetcham",
      "Leatherhead border",
    ],
    postcodes: ["KT22"],
    nearbyAreas: [
      { name: "Leatherhead", slug: "leatherhead-removals" },
      { name: "Bookham", slug: "bookham-removals" },
      { name: "Ashtead", slug: "ashtead-removals" },
      { name: "Oxshott", slug: "oxshott-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Fetcham",
        to: "Leatherhead",
        description:
          "Short hop between adjoining Surrey villages.",
      },
      {
        from: "Fetcham downs road",
        to: "Dorking",
        description:
          "Move along the North Downs corridor.",
      },
      {
        from: "Fetcham",
        to: "Richmond",
        description:
          "Family crossing into London with fixed journey price.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Downs-side detached to Leatherhead bungalow. Steep drive handled with chocks and care.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "Village cottage to Bookham semi. Antique dresser wrapped and carried upright.",
        propertyType: "Cottage",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Fetcham Springs area covered?",
        answer:
          "Yes. KT22 Fetcham village and downs roads are within coverage.",
      },
      {
        question: "Can you handle steep Fetcham drives?",
        answer:
          "Yes. Gradient is assessed so vans park safely.",
      },
      {
        question: "Do you link Fetcham and Leatherhead moves?",
        answer:
          "Yes. Adjoining village moves are common and fixed-price.",
      },
    ],
    testimonial: {
      quote:
        "Village street plus a steep drive. They planned it properly and finished without drama.",
      author: "Janet H.",
      moveType: "Detached move, KT22",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Oxted",
    slug: "oxted-removals",
    metaTitle: "Oxted Removals | RH8 Surrey & Kent Border Moves",
    metaDescription:
      "Reliable removals in Oxted RH8. Station village, Limpsfield borders and commuter family homes. Fixed Surrey quotes and hillside access planning.",
    h1: "Oxted removals in the RH8 commuter village",
    intro:
      "Oxted is a proper station village with shops, cafes and family housing climbing towards the Kent border. Limpsfield and the Greensand Ridge add hills and lanes that reward advance planning. Commuters head to London while others move deeper into Surrey. We quote fixed prices once we know your stairs, drive and parking.",
    propertyTypes: [
      "Victorian and Edwardian houses near Oxted station",
      "Family semis on the Hurst Green border",
      "Cottages in Limpsfield and Limpsfield Chart",
      "Modern estates on the town edge",
      "Flats above village shops",
    ],
    commonMoveTypes: [
      "Village house moves within RH8",
      "Commuter moves to South West London",
      "Relocations towards Sevenoaks and Kent",
      "Downsizing within Oxted",
      "School-term family moves",
    ],
    parkingAccessNotes:
      "Station Road and Bluehouse Lane are busy at peak commute. Limpsfield lanes are narrow with passing places. Hillside drives need safe positioning in wet weather.",
    localRoads: [
      "Station Road East Oxted",
      "Bluehouse Lane",
      "Granville Road",
      "Chichele Road",
      "Limpsfield Road",
      "Hurst Green Road",
    ],
    localLandmarks: [
      "Oxted station",
      "Master Park",
      "Limpsfield village",
      "Hurst Green",
      "Greensand Way fringe",
    ],
    postcodes: ["RH8", "TN8"],
    nearbyAreas: [
      { name: "Caterham", slug: "warlingham-removals" },
      { name: "Godstone", slug: "oxted-removals" },
      { name: "Reigate", slug: "reigate-removals" },
      { name: "Redhill", slug: "redhill-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Oxted",
        to: "Clapham",
        description:
          "Commuter move north along the train line.",
      },
      {
        from: "Limpsfield",
        to: "Guildford",
        description:
          "Surrey internal move from a larger village property.",
      },
      {
        from: "Oxted",
        to: "Sevenoaks",
        description:
          "Cross-border Kent move with fixed journey pricing.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Four-bedroom station village house to Reigate. Loft cleared and garden pots packed.",
        propertyType: "Edwardian house",
        month: "Recent example",
      },
      {
        summary:
          "Limpsfield cottage to Oxted semi. Narrow lane shuttle from main road.",
        propertyType: "Period cottage",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Limpsfield and Hurst Green included?",
        answer:
          "Yes. RH8 including Limpsfield Chart and Hurst Green border is covered.",
      },
      {
        question: "Can you move across the Kent border?",
        answer:
          "Yes. Oxted to Sevenoaks and nearby Kent villages are routine routes.",
      },
      {
        question: "Do you plan around commuter station parking?",
        answer:
          "Yes. We schedule to avoid the busiest station drop-off windows where possible.",
      },
    ],
    testimonial: {
      quote:
        "Limpsfield lane was a worry. Shuttle worked smoothly and the price stayed exactly as quoted.",
      author: "Andrew P.",
      moveType: "Cottage move, RH8",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Banstead",
    slug: "banstead-removals",
    metaTitle: "Banstead Removals | SM7 Village & Downs Moves",
    metaDescription:
      "Local removals in Banstead SM7. High Street village, Banstead Downs and Epsom borders. Fixed Surrey quotes and family home experience.",
    h1: "Banstead removals across SM7",
    intro:
      "Banstead combines village High Street charm with spacious housing on the Downs and towards Nork. Epsom and Sutton are close neighbours. Roads near the common get busy on fine weekends while village parking needs early starts on market days.",
    propertyTypes: [
      "Village houses near Banstead High Street",
      "Semis and detached homes on the Downs",
      "Properties towards Nork and Tattenham Corner",
      "Flats in smaller village conversions",
      "Bungalows on quiet residential roads",
    ],
    commonMoveTypes: [
      "Village moves within Banstead",
      "Moves to Epsom and Sutton",
      "Family relocations into Surrey from London",
      "Downsizing from larger Downs homes",
      "Moves linked to golf club area properties",
    ],
    parkingAccessNotes:
      "High Street loading is limited during trading hours. Downs roads are open but carries from rear gardens are common. Nork lanes can be tight for the longest vehicles.",
    localRoads: [
      "High Street Banstead",
      "Brighton Road Banstead",
      "Park Road Banstead",
      "Dunottar Avenue",
      "Garratts Lane",
      "Winkworth Road",
    ],
    localLandmarks: [
      "Banstead High Street",
      "Banstead Downs",
      "All Saints Church",
      "Nork Park border",
      "Tattenham Corner fringe",
    ],
    postcodes: ["SM7", "SM2"],
    nearbyAreas: [
      { name: "Epsom", slug: "epsom-removals" },
      { name: "Sutton", slug: "sutton-removals" },
      { name: "Tadworth", slug: "tadworth-removals" },
      { name: "Carshalton", slug: "carshalton-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Banstead Downs",
        to: "Wimbledon",
        description:
          "Family move north with good schools often mentioned.",
      },
      {
        from: "Banstead village",
        to: "Reigate",
        description:
          "Deeper Surrey move from a larger detached home.",
      },
      {
        from: "Banstead",
        to: "Clapham",
        description:
          "Young professional rental move towards central London.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Downs detached home to Epsom. Garden office and shed contents included.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "High Street flat to Sutton semi. Early Saturday start before shop traffic.",
        propertyType: "Village flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover Nork and Tattenham fringe?",
        answer:
          "Yes. SM7 Banstead including Downs and Nork is fully covered.",
      },
      {
        question: "Can you move on Banstead market mornings?",
        answer:
          "Early starts help. We factor village traffic into your schedule.",
      },
      {
        question: "Are Banstead to Epsom moves fixed price?",
        answer:
          "Yes. Short local routes are quoted fixed after survey.",
      },
    ],
    testimonial: {
      quote:
        "Downs house with a full garage. Everything labelled and nothing left behind.",
      author: "Graham F.",
      moveType: "Detached move, SM7",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Tadworth",
    slug: "tadworth-removals",
    metaTitle: "Tadworth Removals | KT20 Downs & Village Moves",
    metaDescription:
      "Trusted removals in Tadworth KT20. Village square, Tattenham Corner borders and Epsom Downs fringe. Fixed Surrey family home quotes.",
    h1: "Tadworth removals on the KT20 Downs",
    intro:
      "Tadworth sits below the Downs with a village square, local shops and family housing spread towards Kingswood and Walton Downs. Epsom and Reigate are a short drive. Racecourse traffic can ripple through on event days, so we ask about fixtures when you book central dates.",
    propertyTypes: [
      "Village houses near Tadworth square",
      "Semis and detached homes towards Kingswood",
      "Bungalows on downs fringe roads",
      "Properties near Tadworth station",
      "Larger homes on the Walton Downs border",
    ],
    commonMoveTypes: [
      "Village moves within Tadworth",
      "Moves to Epsom and Reigate",
      "Family relocations from London",
      "Downsizing within KT20",
      "Moves with equestrian equipment from nearby yards",
    ],
    parkingAccessNotes:
      "Village square parking is competitive on weekdays. Downs fringe lanes are winding. Kingswood private roads may have estate rules we confirm before move day.",
    localRoads: [
      "Tadworth Street",
      "Preston Lane",
      "Horseshoe Lane",
      "Dorking Road Tadworth",
      "Buckland Road",
      "Tattenham Way fringe",
    ],
    localLandmarks: [
      "Tadworth village square",
      "Tadworth station",
      "Epsom Downs fringe",
      "Kingswood border",
      "Walton Downs",
    ],
    postcodes: ["KT20"],
    nearbyAreas: [
      { name: "Epsom", slug: "epsom-removals" },
      { name: "Banstead", slug: "banstead-removals" },
      { name: "Reigate", slug: "reigate-removals" },
      { name: "Kingswood", slug: "tadworth-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Tadworth",
        to: "Wimbledon",
        description:
          "Northbound family move with fixed cross-county pricing.",
      },
      {
        from: "Kingswood border",
        to: "Cobham",
        description:
          "Upsizing within Surrey executive housing.",
      },
      {
        from: "Tadworth",
        to: "Brighton",
        description:
          "Coastal relocation with early departure planned.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Four-bedroom Kingswood fringe house to Reigate. Two-day pack for loft and garage.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "Village square cottage to Epsom flat. Race weekend avoided when booking.",
        propertyType: "Cottage",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Kingswood border included?",
        answer:
          "Yes. KT20 Tadworth village and Kingswood fringe are covered.",
      },
      {
        question: "Do you plan around Epsom Downs events?",
        answer:
          "Yes. We check local fixtures when you book downs fringe dates.",
      },
      {
        question: "Can you move yard and tack equipment?",
        answer:
          "Yes. Mention outbuildings and equestrian items during quoting.",
      },
    ],
    testimonial: {
      quote:
        "Kingswood to Reigate with a busy family. Crew kept us on track and labelled every box.",
      author: "Sarah J.",
      moveType: "Detached move, KT20",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Warlingham",
    slug: "warlingham-removals",
    metaTitle: "Warlingham Removals | CR6 Green & Village Moves",
    metaDescription:
      "Local removals in Warlingham CR6. Village greens, common roads and Caterham borders. Fixed Surrey hill and village access quotes.",
    h1: "Warlingham removals across CR6",
    intro:
      "Warlingham spreads across greens and commons with a village centre, station and slopes towards the North Downs. Caterham and Whyteleafe are close neighbours. Hill starts and narrow village lanes mean we choose vehicles with care and quote carries honestly.",
    propertyTypes: [
      "Village houses near Warlingham Green",
      "Semis on slopes towards Common Road",
      "Bungalows with downs views",
      "Flats near Warlingham station",
      "Properties on the Hamsey Green border",
    ],
    commonMoveTypes: [
      "Village moves within Warlingham",
      "Moves to Caterham and Purley",
      "Family relocations into Surrey from London",
      "Downsizing on the green",
      "Moves with long garden carries",
    ],
    parkingAccessNotes:
      "Church Road and Common Road get busy at school times. Green-side parking is limited on summer weekends. Steep sections need safe van placement.",
    localRoads: [
      "Church Road Warlingham",
      "Common Road Warlingham",
      "Croydon Road Warlingham",
      "Shelvers Hill",
      "Portley Lane",
      "Hamsey Green fringe",
    ],
    localLandmarks: [
      "Warlingham Green",
      "Warlingham station",
      "Warlingham Park School area",
      "North Downs fringe",
      "Caterham border",
    ],
    postcodes: ["CR6"],
    nearbyAreas: [
      { name: "Caterham", slug: "warlingham-removals" },
      { name: "Purley", slug: "sutton-removals" },
      { name: "Whyteleafe", slug: "warlingham-removals" },
      { name: "Oxted", slug: "oxted-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Warlingham",
        to: "Croydon",
        description:
          "Northbound move towards South London employment.",
      },
      {
        from: "Warlingham green",
        to: "Reigate",
        description:
          "Surrey internal family move.",
      },
      {
        from: "Warlingham",
        to: "Wimbledon",
        description:
          "Family crossing north west with fixed journey quote.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Hillside semi to Caterham. Long rear garden carry priced upfront.",
        propertyType: "Semi-detached",
        month: "Recent example",
      },
      {
        summary:
          "Green-side bungalow to Purley flat. Steep drive handled with care.",
        propertyType: "Bungalow",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Hamsey Green border covered?",
        answer:
          "Yes. CR6 Warlingham including green and station area is covered.",
      },
      {
        question: "Can you handle steep Warlingham roads?",
        answer:
          "Yes. Gradient and parking are built into your fixed quote.",
      },
      {
        question: "Do you link Warlingham and Caterham moves?",
        answer:
          "Yes. Adjoining village moves are common and fixed-price.",
      },
    ],
    testimonial: {
      quote:
        "Steep drive and a heavy American fridge. Extra crew brought without us asking. Top service.",
      author: "Mike B.",
      moveType: "Semi move, CR6",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Chobham",
    slug: "chobham-removals",
    metaTitle: "Chobham Removals | GU24 Village & Common Moves",
    metaDescription:
      "Trusted removals in Chobham GU24. Village High Street, Chobham Common and Sunningdale borders. Fixed Surrey quotes and rural lane experience.",
    h1: "Chobham removals on the common",
    intro:
      "Chobham is a Surrey village with real open space. The common, High Street and winding lanes towards Sunningdale and Woking attract families who want countryside feel within reach of London. Narrow bridges and tree canopies sometimes limit vehicle size. We survey first and quote fixed crew days.",
    propertyTypes: [
      "Village houses on Chobham High Street",
      "Detached homes on common-side lanes",
      "Cottages on rural Surrey roads",
      "Larger properties towards Sunningdale border",
      "Renovation projects with outbuildings",
    ],
    commonMoveTypes: [
      "Village house moves within GU24",
      "Moves to Woking and Sunningdale",
      "London to Chobham lifestyle relocations",
      "Downsizing within the village",
      "Moves with stables and yard equipment",
    ],
    parkingAccessNotes:
      "High Street loading is time-limited near shops. Common lanes are narrow with soft verges. Wet weather affects gravel drives and field-edge access.",
    localRoads: [
      "High Street Chobham",
      "Bagshot Road Chobham",
      "Valley End Road",
      "Whitmoor Lane",
      "Mincing Lane",
      "Chobham Road",
    ],
    localLandmarks: [
      "Chobham Common",
      "Chobham village green",
      "St Lawrence Church",
      "Valley End",
      "Sunningdale border",
    ],
    postcodes: ["GU24"],
    nearbyAreas: [
      { name: "Sunningdale", slug: "sunningdale-removals" },
      { name: "Woking", slug: "woking-removals" },
      { name: "Windlesham", slug: "windlesham-removals" },
      { name: "Ascot", slug: "ascot-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Chobham village",
        to: "Woking",
        description:
          "Short Surrey move to town centre or suburbs.",
      },
      {
        from: "Chobham",
        to: "Kensington",
        description:
          "Executive move back towards central London.",
      },
      {
        from: "Common-side lane",
        to: "Ascot",
        description:
          "Premium Surrey hop between village and racecourse town.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Common-side detached to Sunningdale. Shuttle from Bagshot Road when lane was too soft.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "High Street cottage to Woking flat. Antique furniture wrapped individually.",
        propertyType: "Cottage",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Can lorries reach common-side lanes?",
        answer:
          "Sometimes not. We plan shuttles after checking lane width and ground conditions.",
      },
      {
        question: "Is Valley End included?",
        answer:
          "Yes. GU24 Chobham village and surrounding lanes are covered.",
      },
      {
        question: "Do you move stable and yard contents?",
        answer:
          "Yes. Outbuildings are listed during your survey.",
      },
    ],
    testimonial: {
      quote:
        "Soft gravel lane after rain. They used mats and a smaller van without cutting corners.",
      author: "Elizabeth R.",
      moveType: "Detached move, GU24",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Windlesham",
    slug: "windlesham-removals",
    metaTitle: "Windlesham Removals | GU20 Village & Heath Moves",
    metaDescription:
      "Local removals in Windlesham GU20. Village centre, Lightwater borders and Ascot fringe. Fixed Surrey quotes and wooded lane access planning.",
    h1: "Windlesham removals in GU20",
    intro:
      "Windlesham is a wooded Surrey village between Lightwater, Bagshot and the Ascot fringe. Properties sit on private lanes with tall trees and gravel drives. Commuters value quick road links while families want space and quiet. We confirm vehicle size and estate rules before quoting a fixed price.",
    propertyTypes: [
      "Detached homes on wooded private lanes",
      "Village properties near Windlesham Square",
      "Bungalows towards Lightwater border",
      "Executive houses on the Ascot fringe",
      "Renovation projects with outbuildings",
    ],
    commonMoveTypes: [
      "Village moves within Windlesham",
      "Moves to Ascot and Sunningdale",
      "Relocations to Woking and London",
      "Downsizing within GU20",
      "Moves with home offices and gyms",
    ],
    parkingAccessNotes:
      "Wooded lanes limit lorry height and length. Gravel drives need ground protection. Some estates issue van time slots we follow without exception.",
    localRoads: [
      "Updown Road",
      "Chertsey Road Windlesham",
      "Bagshot Road Windlesham",
      "Jenner Road",
      "Holloway Hill",
      "Lightwater border roads",
    ],
    localLandmarks: [
      "Windlesham village",
      "Windlesham Arboretum fringe",
      "Lightwater Country Park border",
      "Ascot fringe lanes",
      "St John the Baptist Church",
    ],
    postcodes: ["GU20"],
    nearbyAreas: [
      { name: "Lightwater", slug: "lightwater-removals" },
      { name: "Ascot", slug: "ascot-removals" },
      { name: "Virginia Water", slug: "virginia-water-removals" },
      { name: "Chobham", slug: "chobham-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Windlesham",
        to: "Ascot",
        description:
          "Short premium Surrey move between village addresses.",
      },
      {
        from: "Windlesham",
        to: "Richmond",
        description:
          "Family crossing into London with garden equipment.",
      },
      {
        from: "Windlesham lane",
        to: "Woking",
        description:
          "Move to town centre or suburbs with shuttle if needed.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Wooded lane detached to Sunningdale. Gate codes shared and gravel protected.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "Village bungalow to Lightwater semi. Garden office moved intact on trolley.",
        propertyType: "Bungalow",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Can tall lorries pass Windlesham lanes?",
        answer:
          "Often not. We survey tree canopy height and plan smaller vehicles or shuttles.",
      },
      {
        question: "Is Lightwater border included?",
        answer:
          "Yes. GU20 Windlesham village and fringe roads are covered.",
      },
      {
        question: "Do you handle estate access rules?",
        answer:
          "Yes. Share management requirements when you book.",
      },
    ],
    testimonial: {
      quote:
        "Overhanging trees meant a smaller van. Team shuttled efficiently and stayed cheerful.",
      author: "Peter K.",
      moveType: "Detached move, GU20",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Lightwater",
    slug: "lightwater-removals",
    metaTitle: "Lightwater Removals | GU18 Village & Country Park Moves",
    metaDescription:
      "Reliable removals in Lightwater GU18. Village shops, country park borders and Bagshot links. Fixed Surrey quotes and family home handling.",
    h1: "Lightwater removals in GU18",
    intro:
      "Lightwater is a compact Surrey village with a parade, country park access and quick links towards Bagshot and Camberley. Housing is mostly semis and detached homes on quiet closes. Families move here for schools and green space while keeping reasonable commutes.",
    propertyTypes: [
      "Semis and detached homes on village closes",
      "Properties near Lightwater Country Park",
      "Bungalows towards Bagshot border",
      "Flats in smaller village developments",
      "New-build homes on estate fringes",
    ],
    commonMoveTypes: [
      "Moves within Lightwater and to Windlesham",
      "Relocations to Woking and Guildford",
      "London to Lightwater family moves",
      "Downsizing within GU18",
      "Garage and garden building contents",
    ],
    parkingAccessNotes:
      "All Saints Road and the village parade have delivery traffic. Country park side streets are quieter. Bagshot Road carries through traffic; early starts help.",
    localRoads: [
      "All Saints Road Lightwater",
      "Lightwater Road",
      "Macdonald Road",
      "Blackstroud Lane",
      "Bagshot Road Lightwater",
      "Ullswater Road",
    ],
    localLandmarks: [
      "Lightwater Country Park",
      "Lightwater village parade",
      "All Saints Church",
      "Bagshot border",
      "Windlesham fringe",
    ],
    postcodes: ["GU18"],
    nearbyAreas: [
      { name: "Windlesham", slug: "windlesham-removals" },
      { name: "Bagshot", slug: "lightwater-removals" },
      { name: "Camberley", slug: "lightwater-removals" },
      { name: "Chobham", slug: "chobham-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Lightwater",
        to: "Woking",
        description:
          "Commuter family move with fixed cross-Surrey price.",
      },
      {
        from: "Lightwater",
        to: "Ascot",
        description:
          "Short hop to racecourse town housing.",
      },
      {
        from: "Lightwater",
        to: "Wimbledon",
        description:
          "Northbound relocation with nursery packed separately.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Detached close to country park to Windlesham. Shed and playhouse dismantled.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "Semi on All Saints Road to Bagshot. Morning slot before school run.",
        propertyType: "Semi-detached",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Bagshot border covered from Lightwater?",
        answer:
          "Yes. GU18 including country park side and parade area is covered.",
      },
      {
        question: "Can you move to Camberley from Lightwater?",
        answer:
          "Yes. Short GU moves are routine fixed-price routes.",
      },
      {
        question: "Do you offer packing in Lightwater?",
        answer:
          "Yes. Pack days are available before larger family moves.",
      },
    ],
    testimonial: {
      quote:
        "Lightwater to Woking in a day. Kids' boxes colour-coded. Made unpacking easy.",
      author: "Nicola T.",
      moveType: "Detached move, GU18",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Sunningdale",
    slug: "sunningdale-removals",
    metaTitle: "Sunningdale Removals | SL5 Premium Commuter Moves",
    metaDescription:
      "Premium removals in Sunningdale SL5. Station village, Charters roads and Ascot borders. Fixed quotes for executive Surrey homes.",
    h1: "Sunningdale removals in SL5",
    intro:
      "Sunningdale is station village living with Charters roads, golf club addresses and Ascot on the doorstep. Properties are often large, set back and finished to a high standard. We plan private road access, gravel drives and fragile interiors with the same care we bring to central London mansion blocks.",
    propertyTypes: [
      "Executive homes on Charters and Sunningdale roads",
      "Village properties near the station",
      "Mansion-style houses on private drives",
      "Flats in smaller village blocks",
      "Homes bordering Sunningdale Golf Club",
    ],
    commonMoveTypes: [
      "Whole-house moves on Charters roads",
      "Relocations to London and return",
      "Downsizing within Sunningdale",
      "Moves to Ascot and Virginia Water",
      "Fragile art and antique handling",
    ],
    parkingAccessNotes:
      "Charters roads are wide but drives are long and often gravel. Golf club area traffic increases on event days. Station car park rules affect some central flats.",
    localRoads: [
      "London Road Sunningdale",
      "Charters Road",
      "Sunningdale Road",
      "Broomhall Lane",
      "Chobham Road fringe",
      "Station Parade",
    ],
    localLandmarks: [
      "Sunningdale station",
      "Sunningdale Golf Club",
      "Royal Berkshire border",
      "Village shops",
      "Ascot fringe",
    ],
    postcodes: ["SL5"],
    nearbyAreas: [
      { name: "Ascot", slug: "ascot-removals" },
      { name: "Virginia Water", slug: "virginia-water-removals" },
      { name: "Chobham", slug: "chobham-removals" },
      { name: "Windsor", slug: "virginia-water-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Sunningdale",
        to: "Kensington",
        description:
          "Executive move towards west central London.",
      },
      {
        from: "Charters Road",
        to: "Cobham",
        description:
          "Surrey internal move between private-road homes.",
      },
      {
        from: "Sunningdale",
        to: "Richmond",
        description:
          "Family crossing the river with fixed journey quote.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Charters detached to Ascot. Wine collection and gym moved separately.",
        propertyType: "Executive detached",
        month: "Recent example",
      },
      {
        summary:
          "Station village flat to Virginia Water house. Porter-style building at departure.",
        propertyType: "Village flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover Charters and Sunningdale roads?",
        answer:
          "Yes. SL5 premium roads and village centre are regular work.",
      },
      {
        question: "Can you work around golf club event traffic?",
        answer:
          "Yes. We adjust timing when local events affect parking.",
      },
      {
        question: "Are high-value contents handled differently?",
        answer:
          "Yes. Flag art and antiques during quoting for enhanced wrapping.",
      },
    ],
    testimonial: {
      quote:
        "Charters Road home with fragile art. Crated properly and placed exactly where asked.",
      author: "William H.",
      moveType: "Executive home move, SL5",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Ascot",
    slug: "ascot-removals",
    metaTitle: "Ascot Removals | SL5 Racecourse Town Home Moves",
    metaDescription:
      "Premium removals in Ascot SL5. High Street, racecourse area and Sunninghill borders. Fixed Surrey quotes and Royal Borough experience.",
    h1: "Ascot removals in racecourse country",
    intro:
      "Ascot means the High Street, the racecourse and roads like Sunninghill and Kennel Ride where properties are substantial. Royal Ascot week transforms parking and access. We ask about fixtures when you book and quote fixed prices that reflect real carrying distances on large homes.",
    propertyTypes: [
      "Executive detached homes on Sunninghill roads",
      "Village properties near Ascot High Street",
      "Homes bordering the racecourse",
      "Flats in smaller Ascot developments",
      "Properties on private estate drives",
    ],
    commonMoveTypes: [
      "Whole-house moves within Ascot",
      "Relocations to London and Surrey",
      "Downsizing after family homes",
      "Moves timed around race week",
      "International assignee relocations",
    ],
    parkingAccessNotes:
      "Race week restricts large areas near the course. High Street loading is time-limited. Private drives may need matting on gravel and turning space checked in advance.",
    localRoads: [
      "High Street Ascot",
      "London Road Ascot",
      "Sunninghill Road",
      "Kennel Ride",
      "Buckhurst Road",
      "Winkfield Road",
    ],
    localLandmarks: [
      "Ascot Racecourse",
      "Ascot High Street",
      "Ascot station",
      "Royal Lodge fringe",
      "Sunninghill border",
    ],
    postcodes: ["SL5", "GU25"],
    nearbyAreas: [
      { name: "Sunningdale", slug: "sunningdale-removals" },
      { name: "Virginia Water", slug: "virginia-water-removals" },
      { name: "Windlesham", slug: "windlesham-removals" },
      { name: "Bracknell", slug: "ascot-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Ascot",
        to: "Chelsea",
        description:
          "Executive move towards central London with fragile items.",
      },
      {
        from: "Sunninghill",
        to: "Cobham",
        description:
          "Surrey internal move between large detached homes.",
      },
      {
        from: "Ascot",
        to: "Wimbledon",
        description:
          "Family move north with schools in mind.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Sunninghill detached to Weybridge. Move booked outside Royal Ascot week.",
        propertyType: "Executive detached",
        month: "Recent example",
      },
      {
        summary:
          "High Street flat to Sunningdale. Antique dining suite crated.",
        propertyType: "Village flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you avoid Royal Ascot week?",
        answer:
          "We can move during race week but recommend alternative dates when parking is severely limited.",
      },
      {
        question: "Is Sunninghill included?",
        answer:
          "Yes. SL5 Ascot including Sunninghill and Kennel Ride is covered.",
      },
      {
        question: "Can you handle gated estate properties?",
        answer:
          "Yes. Gate codes and van rules are confirmed before dispatch.",
      },
    ],
    testimonial: {
      quote:
        "Booked deliberately after Ascot week. Crew were punctual and handled our gym kit properly.",
      author: "Caroline D.",
      moveType: "Executive home move, SL5",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Cranleigh",
    slug: "cranleigh-removals",
    metaTitle: "Cranleigh Removals | GU6 Surrey Hills Village Moves",
    metaDescription:
      "Local removals in Cranleigh GU6. Village High Street, commons and Dunsfold borders. Fixed Surrey quotes and rural lane access planning.",
    h1: "Cranleigh removals in the Surrey Hills",
    intro:
      "Cranleigh is one of Surrey's largest villages with a broad High Street, commons and lanes stretching towards Dunsfold and Ewhurst. Families enjoy schools and countryside while accepting longer carries from some rural properties. We survey lane access honestly and quote fixed crew days for larger homes.",
    propertyTypes: [
      "Village houses on Cranleigh High Street",
      "Detached homes on commons-side roads",
      "Cottages on rural lanes towards Dunsfold",
      "Semis in village developments",
      "Properties with paddocks and outbuildings",
    ],
    commonMoveTypes: [
      "Village moves within Cranleigh",
      "Moves to Godalming and Guildford",
      "London to Cranleigh lifestyle relocations",
      "Downsizing within GU6",
      "Moves with agricultural and yard equipment",
    ],
    parkingAccessNotes:
      "High Street loading is restricted near shops. Rural lanes may need shuttle from a B road. Commons verges are soft after rain; we protect ground when driving on gravel.",
    localRoads: [
      "High Street Cranleigh",
      "Knowle Lane",
      "Horsham Road Cranleigh",
      "Ewhurst Road",
      "Baynards Road",
      "Dunsfold Road",
    ],
    localLandmarks: [
      "Cranleigh High Street",
      "Cranleigh Common",
      "Snoxhall Fields",
      "St Nicolas Church",
      "Dunsfold border",
    ],
    postcodes: ["GU6"],
    nearbyAreas: [
      { name: "Godalming", slug: "godalming-removals" },
      { name: "Guildford", slug: "guildford-removals" },
      { name: "Dorking", slug: "dorking-removals" },
      { name: "Ewhurst", slug: "cranleigh-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Cranleigh",
        to: "Guildford",
        description:
          "County town move with larger garden at destination.",
      },
      {
        from: "Cranleigh village",
        to: "Wimbledon",
        description:
          "Commuter family relocation north.",
      },
      {
        from: "Dunsfold lane property",
        to: "Godalming",
        description:
          "Rural lane departure with shuttle planned during survey.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Commons-side detached to Godalming. Greenhouse dismantled and paddock tools boxed.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "High Street cottage to Guildford flat. Narrow lane shuttle from Horsham Road.",
        propertyType: "Cottage",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover Dunsfold and Ewhurst borders?",
        answer:
          "Yes. GU6 Cranleigh village and rural fringes are covered.",
      },
      {
        question: "Can you move paddock and yard equipment?",
        answer:
          "Yes. Outbuildings and equipment are listed during quoting.",
      },
      {
        question: "Are Cranleigh to Guildford moves fixed price?",
        answer:
          "Yes. Journey and access are built into your fixed quote after survey.",
      },
    ],
    testimonial: {
      quote:
        "Rural lane meant shuttling. Honest quote upfront and a patient, hardworking team.",
      author: "Robert E.",
      moveType: "Detached move, GU6",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Horsley",
    slug: "horsley-removals",
    metaTitle: "Horsley Removals | KT24 Surrey Village Moves",
    metaDescription:
      "Local removals in Horsley KT24. Village centre, station roads and Effingham borders. Fixed Surrey quotes and rural lane access planning.",
    h1: "Horsley removals in the KT24 village",
    intro:
      "Horsley village sits between Guildford and Leatherhead with a proper high street, station and commons nearby. Properties range from village cottages to larger detached homes on the Effingham border. Lanes are often narrow and tree-lined, so we confirm vehicle size during the survey rather than guessing on move day.",
    propertyTypes: [
      "Village houses on Horsley High Street",
      "Detached homes towards Effingham and Ockham",
      "Semis near Horsley station",
      "Cottages on rural Surrey lanes",
      "Flats in smaller village conversions",
    ],
    commonMoveTypes: [
      "Village moves within Horsley",
      "Moves to Guildford and Leatherhead",
      "London to Horsley family relocations",
      "Downsizing within KT24",
      "Moves with stables and outbuildings",
    ],
    parkingAccessNotes:
      "High Street shop deliveries affect daytime loading. Station parking competes with commuters. Effingham border lanes may need shuttle delivery from a wider road.",
    localRoads: [
      "Horsley High Street",
      "Ockham Road Horsley",
      "Effingham Road",
      "Forest Road Horsley",
      "Sheep Green",
      "East Horsley Road",
    ],
    localLandmarks: [
      "Horsley station",
      "Horsley village shops",
      "Sheep Green",
      "St Marys Church Horsley",
      "Effingham border",
    ],
    postcodes: ["KT24"],
    nearbyAreas: [
      { name: "East Horsley", slug: "east-horsley-removals" },
      { name: "West Horsley", slug: "west-horsley-removals" },
      { name: "Bookham", slug: "bookham-removals" },
      { name: "Guildford", slug: "guildford-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Horsley",
        to: "Guildford",
        description:
          "Short Surrey county town move with similar family housing.",
      },
      {
        from: "Horsley village",
        to: "Wimbledon",
        description:
          "Commuter family relocation north with fixed pricing.",
      },
      {
        from: "Horsley",
        to: "Cobham",
        description:
          "Elmbridge move from a larger detached home.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Village house to Guildford semi. Garden shed dismantled and rebuilt.",
        propertyType: "Village house",
        month: "Recent example",
      },
      {
        summary:
          "Effingham border detached to Leatherhead. Rural lane shuttle planned.",
        propertyType: "Detached home",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover East and West Horsley from Horsley village?",
        answer:
          "Yes. KT24 including village centre, station and border lanes is covered.",
      },
      {
        question: "Can you move stable yard equipment?",
        answer:
          "Yes. Outbuildings are listed during your survey.",
      },
      {
        question: "Are Horsley to Guildford moves fixed price?",
        answer:
          "Yes. Short Surrey routes are quoted fixed after access is confirmed.",
      },
    ],
    testimonial: {
      quote:
        "Narrow lane near Effingham. Shuttle worked well and the quote never changed.",
      author: "Tim W.",
      moveType: "Village house move, KT24",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "East Horsley",
    slug: "east-horsley-removals",
    metaTitle: "East Horsley Removals | KT24 Estate & Village Moves",
    metaDescription:
      "Premium removals in East Horsley KT24. Duke of Wellington, woodland lanes and Sheepleas borders. Fixed Surrey quotes for large village homes.",
    h1: "East Horsley removals in woodland Surrey",
    intro:
      "East Horsley is the larger, leafier half of the Horsley parish. Woodland lanes, substantial plots and properties near Sheepleas attract families who want countryside within reach of Guildford. Long drives and overhanging branches often dictate a smaller van or shuttle plan.",
    propertyTypes: [
      "Large detached homes on wooded private lanes",
      "Village properties near the Duke of Wellington",
      "Cottages on Sheepleas fringe roads",
      "Renovated homes with home offices",
      "Bungalows on quiet closes",
    ],
    commonMoveTypes: [
      "Whole-house moves on East Horsley lanes",
      "Relocations to London and back",
      "Downsizing within KT24",
      "Moves with gym and garden buildings",
      "Renovation storage phases",
    ],
    parkingAccessNotes:
      "Wooded lanes limit lorry height. Gravel drives need matting in wet weather. Some roads have soft verges we avoid after heavy rain.",
    localRoads: [
      "Ockham Road East Horsley",
      "Forest Road",
      "Sheepleas Lane",
      "Green Dene",
      "Kingston Avenue",
      "Horsley Road",
    ],
    localLandmarks: [
      "Duke of Wellington East Horsley",
      "Sheepleas Woods",
      "St Martins Church",
      "East Horsley village",
      "Horsley Park fringe",
    ],
    postcodes: ["KT24"],
    nearbyAreas: [
      { name: "West Horsley", slug: "west-horsley-removals" },
      { name: "Horsley", slug: "horsley-removals" },
      { name: "Bookham", slug: "bookham-removals" },
      { name: "Ripley", slug: "ripley-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "East Horsley",
        to: "Chelsea",
        description:
          "Executive move towards central London with fragile contents.",
      },
      {
        from: "East Horsley",
        to: "Guildford",
        description:
          "County town move from a larger woodland property.",
      },
      {
        from: "Sheepleas fringe",
        to: "Cobham",
        description:
          "Elmbridge relocation with garden equipment included.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Five-bedroom wooded lane home to Weybridge. Three crew, shuttle from main road.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "Cottage to Guildford flat. Antique furniture wrapped individually.",
        propertyType: "Cottage",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Can large lorries reach East Horsley lanes?",
        answer:
          "Often not. We survey canopy height and lane width before booking vehicles.",
      },
      {
        question: "Is Sheepleas area included?",
        answer:
          "Yes. KT24 East Horsley including woodland fringes is covered.",
      },
      {
        question: "Do you offer multi-day packing?",
        answer:
          "Yes. Larger homes often book a separate pack day before the main move.",
      },
    ],
    testimonial: {
      quote:
        "Woodland drive and a piano. They measured stairs first and brought the right crew.",
      author: "Diana S.",
      moveType: "Detached move, KT24",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "West Horsley",
    slug: "west-horsley-removals",
    metaTitle: "West Horsley Removals | KT24 Village & Manor Moves",
    metaDescription:
      "Trusted removals in West Horsley KT24. Village street, West Horsley Place borders and Shere lanes. Fixed Surrey family home quotes.",
    h1: "West Horsley removals in the KT24 parish",
    intro:
      "West Horsley keeps a tighter village feel with a historic manor estate nearby and lanes running towards Shere and the Surrey Hills. Houses are often period or extended family homes with drives that slope or curve. We quote fixed prices after walking access, not from a postcode alone.",
    propertyTypes: [
      "Village houses on The Street West Horsley",
      "Family homes near West Horsley Place",
      "Cottages on lanes towards Shere",
      "Semis on village fringes",
      "Properties with paddocks and outbuildings",
    ],
    commonMoveTypes: [
      "Village moves within West Horsley",
      "Moves to Guildford and Dorking",
      "London to village lifestyle relocations",
      "Downsizing within the parish",
      "Moves with equestrian equipment",
    ],
    parkingAccessNotes:
      "The Street is narrow through the village core. Shere border lanes need compact vans on the tightest sections. Estate-area traffic can increase on event weekends.",
    localRoads: [
      "The Street West Horsley",
      "West Horsley Place approach",
      "Epsom Road West Horsley",
      "Guildford Road West Horsley",
      "Shere Road fringe",
      "Crabtree Road",
    ],
    localLandmarks: [
      "West Horsley village",
      "West Horsley Place",
      "St Marys West Horsley",
      "Shere border lanes",
      "Surrey Hills fringe",
    ],
    postcodes: ["KT24"],
    nearbyAreas: [
      { name: "East Horsley", slug: "east-horsley-removals" },
      { name: "Shere", slug: "west-horsley-removals" },
      { name: "Guildford", slug: "guildford-removals" },
      { name: "Ripley", slug: "ripley-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "West Horsley",
        to: "Dorking",
        description:
          "Surrey Hills corridor move with rural lane access at departure.",
      },
      {
        from: "West Horsley village",
        to: "Wimbledon",
        description:
          "Family move north with fixed cross-county quote.",
      },
      {
        from: "West Horsley",
        to: "Cranleigh",
        description:
          "Village-to-village Surrey relocation.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Village house to Shere cottage. Lane shuttle and careful wrapping on antiques.",
        propertyType: "Village house",
        month: "Recent example",
      },
      {
        summary:
          "Detached near manor estate to Guildford. Paddock tools boxed separately.",
        propertyType: "Detached home",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is West Horsley Place area covered?",
        answer:
          "Yes. KT24 West Horsley village and estate fringes are within coverage.",
      },
      {
        question: "Can you access Shere border lanes?",
        answer:
          "Yes. We survey lane width and plan shuttles when required.",
      },
      {
        question: "Do you move yard and tack room items?",
        answer:
          "Yes. Mention equestrian equipment during quoting.",
      },
    ],
    testimonial: {
      quote:
        "Village street plus paddock gear. Everything accounted for in the quote. No surprises.",
      author: "Helen R.",
      moveType: "Village house move, KT24",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Ripley",
    slug: "ripley-removals",
    metaTitle: "Ripley Removals | GU23 Surrey Village & Green Moves",
    metaDescription:
      "Local removals in Ripley GU23. High Street, village green and Send borders. Fixed Surrey quotes and riverside lane experience.",
    h1: "Ripley removals on the village green",
    intro:
      "Ripley is a Thames-side village with a broad green, busy summer footfall and lanes towards Send and Wisley. Properties mix period cottages with larger homes on the outskirts. Market and pub traffic affects High Street loading while riverside lanes stay tight for long vehicles.",
    propertyTypes: [
      "Cottages around Ripley Green",
      "Houses on Ripley High Street",
      "Detached homes towards Send and Ockham",
      "Flats in village conversions",
      "Properties with riverside lane access",
    ],
    commonMoveTypes: [
      "Village moves within Ripley",
      "Moves to Woking and Guildford",
      "Downsizing within GU23",
      "Weekend cottage relocations",
      "Moves linked to riverside renovations",
    ],
    parkingAccessNotes:
      "High Street and green area parking is competitive on summer weekends. Send border lanes are narrow. We often use early starts for village centre properties.",
    localRoads: [
      "Ripley High Street",
      "Rose Lane Ripley",
      "Send Road Ripley",
      "Portsmouth Road Ripley",
      "Old Lane Ripley",
      "Ockham Mill Lane fringe",
    ],
    localLandmarks: [
      "Ripley Green",
      "Ripley High Street",
      "The Talbot Ripley",
      "Send border",
      "River Wey fringe",
    ],
    postcodes: ["GU23"],
    nearbyAreas: [
      { name: "Woking", slug: "woking-removals" },
      { name: "Guildford", slug: "guildford-removals" },
      { name: "Send", slug: "ripley-removals" },
      { name: "East Horsley", slug: "east-horsley-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Ripley",
        to: "Woking",
        description:
          "Short Surrey move along the A3 corridor.",
      },
      {
        from: "Ripley green cottage",
        to: "Richmond",
        description:
          "Thames-side family crossing into London.",
      },
      {
        from: "Ripley",
        to: "Cobham",
        description:
          "Elmbridge relocation from a village property.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Green-side cottage to Woking semi. Summer weekend avoided when booking.",
        propertyType: "Period cottage",
        month: "Recent example",
      },
      {
        summary:
          "High Street house to Guildford. Antique dresser crated for stairs.",
        propertyType: "Village house",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Send border included?",
        answer:
          "Yes. GU23 Ripley village and Send fringe are covered.",
      },
      {
        question: "Can you move on busy green weekends?",
        answer:
          "Early starts help. We discuss timing when you book summer dates.",
      },
      {
        question: "Are Ripley to Woking moves fixed price?",
        answer:
          "Yes. Short corridor routes are quoted fixed after survey.",
      },
    ],
    testimonial: {
      quote:
        "Ripley green traffic was busy but they started early and finished before the rush.",
      author: "Paul M.",
      moveType: "Cottage move, GU23",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Haslemere",
    slug: "haslemere-removals",
    metaTitle: "Haslemere Removals | GU27 Surrey Hills Town Moves",
    metaDescription:
      "Reliable removals in Haslemere GU27. Town centre, Hindhead borders and commuter family homes. Fixed Surrey quotes and hillside access planning.",
    h1: "Haslemere removals in the Surrey Hills",
    intro:
      "Haslemere is a proper Surrey Hills town with a station, high street and housing climbing towards Hindhead and Grayswood. Commuters head to London while others arrive for schools and National Trust countryside. Hills, bends and wooded drives mean we survey access before confirming vehicle size.",
    propertyTypes: [
      "Town centre flats near Haslemere station",
      "Victorian and Edwardian houses on sloping streets",
      "Family homes towards Grayswood and Hindhead",
      "Cottages on rural lanes",
      "Bungalows with downs views",
    ],
    commonMoveTypes: [
      "Moves within Haslemere and Hindhead",
      "Commuter relocations to London",
      "London to Haslemere lifestyle moves",
      "Downsizing within GU27",
      "Office moves for local businesses",
    ],
    parkingAccessNotes:
      "High Street loading is restricted during shop hours. Hillside drives need safe van placement. Grayswood lanes are narrow with limited passing places.",
    localRoads: [
      "High Street Haslemere",
      "Petworth Road",
      "Grayswood Road",
      "Wey Hill",
      "Lion Lane",
      "Portsmouth Road Haslemere",
    ],
    localLandmarks: [
      "Haslemere station",
      "Haslemere High Street",
      "National Trust Hindhead fringe",
      "Grayswood",
      "Gibbet Hill approach",
    ],
    postcodes: ["GU27"],
    nearbyAreas: [
      { name: "Hindhead", slug: "hindhead-removals" },
      { name: "Godalming", slug: "godalming-removals" },
      { name: "Farnham", slug: "farnham-removals" },
      { name: "Petworth", slug: "haslemere-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Haslemere",
        to: "Wimbledon",
        description:
          "Commuter family move north with fixed journey pricing.",
      },
      {
        from: "Grayswood",
        to: "Guildford",
        description:
          "Surrey internal move from a larger hillside home.",
      },
      {
        from: "Haslemere",
        to: "Brighton",
        description:
          "South coast relocation with early departure.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Hillside detached to Hindhead bungalow. Steep drive handled with chocks.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "Town centre flat to Godalming house. Station parking timed around commute.",
        propertyType: "Town centre flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover Grayswood and Hindhead borders?",
        answer:
          "Yes. GU27 Haslemere town and fringe roads are fully covered.",
      },
      {
        question: "Can you handle steep Haslemere drives?",
        answer:
          "Yes. Gradient is assessed during survey for safe van placement.",
      },
      {
        question: "Do you offer Haslemere to London moves?",
        answer:
          "Yes. Commuter corridor routes are routine with fixed pricing.",
      },
    ],
    testimonial: {
      quote:
        "Grayswood lane is tight. Smaller van shuttle and a patient crew. Very professional.",
      author: "John C.",
      moveType: "Detached move, GU27",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Hindhead",
    slug: "hindhead-removals",
    metaTitle: "Hindhead Removals | GU26 Commons & Village Moves",
    metaDescription:
      "Careful removals in Hindhead GU26. Devil's Punch Bowl, National Trust roads and Haslemere borders. Fixed Surrey hillside quotes.",
    h1: "Hindhead removals on the commons",
    intro:
      "Hindhead sits high on the Surrey Hills with commons, pine woods and properties on lanes that twist and climb. The A3 tunnel improved links but local roads stay rural in character. Large homes with long drives are common. We plan shuttles and crew days honestly after seeing your access.",
    propertyTypes: [
      "Detached homes on wooded Hindhead lanes",
      "Bungalows with views towards the Punch Bowl",
      "Village properties near Hindhead crossroads",
      "Cottages on National Trust fringe roads",
      "Renovation projects with outbuildings",
    ],
    commonMoveTypes: [
      "Whole-house moves on Hindhead lanes",
      "Relocations to Haslemere and Farnham",
      "Downsizing within GU26",
      "London to Hindhead lifestyle moves",
      "Moves with home gyms and offices",
    ],
    parkingAccessNotes:
      "Wooded lanes limit lorry length and height. Wet weather affects gravel and woodland tracks. Some properties need parking on a main road with longer carries.",
    localRoads: [
      "Portsmouth Road Hindhead",
      "Hazel Grove Hindhead",
      "Crossways Road",
      "Gibbet Hill approach",
      "Punch Bowl approach roads",
      "Grayswood Road fringe",
    ],
    localLandmarks: [
      "Devil's Punch Bowl",
      "National Trust Hindhead",
      "Hindhead crossroads",
      "Gibbet Hill",
      "Haslemere border",
    ],
    postcodes: ["GU26"],
    nearbyAreas: [
      { name: "Haslemere", slug: "haslemere-removals" },
      { name: "Farnham", slug: "farnham-removals" },
      { name: "Grayswood", slug: "haslemere-removals" },
      { name: "Godalming", slug: "godalming-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Hindhead",
        to: "Guildford",
        description:
          "County town move from a woodland property.",
      },
      {
        from: "Hindhead lane",
        to: "Richmond",
        description:
          "Family crossing into London with fixed cross-county price.",
      },
      {
        from: "Hindhead",
        to: "Farnham",
        description:
          "Short west Surrey move between market towns.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Woodland detached to Haslemere. Shuttle from Portsmouth Road, two-day pack.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "Bungalow to Godalming flat. Long garden carry priced upfront.",
        propertyType: "Bungalow",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Can lorries reach all Hindhead lanes?",
        answer:
          "Not always. We survey and plan shuttles or smaller vehicles as needed.",
      },
      {
        question: "Is Devil's Punch Bowl fringe covered?",
        answer:
          "Yes. GU26 Hindhead including commons approaches is covered.",
      },
      {
        question: "Do wet weather conditions affect planning?",
        answer:
          "Yes. Soft tracks may require matting or alternate parking we discuss in advance.",
      },
    ],
    testimonial: {
      quote:
        "Long wooded drive. They shuttled without fuss and protected the gravel throughout.",
      author: "Margaret L.",
      moveType: "Detached move, GU26",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Farnham",
    slug: "farnham-removals",
    metaTitle: "Farnham Removals | GU9 Historic Market Town Moves",
    metaDescription:
      "Trusted removals in Farnham GU9. Castle Street, station roads and Hale borders. Fixed Surrey quotes and market town access experience.",
    h1: "Farnham removals in GU9",
    intro:
      "Farnham is a historic market town with a castle, cobbled streets and a strong creative community. Housing ranges from town centre flats to family homes in Hale and Badshot Lea. One-way systems and market days affect central loading while village fringes need rural lane planning.",
    propertyTypes: [
      "Town centre flats and maisonettes",
      "Period houses on Castle Street approaches",
      "Family semis and detached homes in Hale",
      "Cottages in Farnham villages",
      "Properties near Farnham station",
    ],
    commonMoveTypes: [
      "Moves within Farnham and Hale",
      "London to Farnham relocations",
      "University and arts community moves",
      "Downsizing from larger Hale homes",
      "Office moves for town centre businesses",
    ],
    parkingAccessNotes:
      "Castle Street and central Farnham have tight medieval layouts. Market days restrict loading. Hale roads are easier but some lanes towards rural Surrey need smaller vans.",
    localRoads: [
      "Castle Street Farnham",
      "West Street Farnham",
      "Hale Road",
      "Farnham Road",
      "Guildford Road Farnham",
      "Badshot Lea Road",
    ],
    localLandmarks: [
      "Farnham Castle",
      "Farnham town centre",
      "Farnham station",
      "Bourne Woods fringe",
      "Hale village",
    ],
    postcodes: ["GU9", "GU10"],
    nearbyAreas: [
      { name: "Aldershot", slug: "farnborough-removals" },
      { name: "Haslemere", slug: "haslemere-removals" },
      { name: "Godalming", slug: "godalming-removals" },
      { name: "Fleet", slug: "farnborough-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Farnham",
        to: "Guildford",
        description:
          "County town hop with university and family moves common.",
      },
      {
        from: "Hale",
        to: "Wimbledon",
        description:
          "Commuter family relocation north.",
      },
      {
        from: "Farnham town",
        to: "Brighton",
        description:
          "South coast move with fixed journey quote.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Hale detached to Godalming. Home studio equipment moved separately.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "Castle Street flat to Fleet semi. Central loading timed before market setup.",
        propertyType: "Town centre flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover Hale and Badshot Lea?",
        answer:
          "Yes. GU9 and GU10 Farnham town and fringes are covered.",
      },
      {
        question: "Can you move on market days in town centre?",
        answer:
          "We schedule around market hours or use early slots when central access is tight.",
      },
      {
        question: "Are Farnham to Guildford moves fixed price?",
        answer:
          "Yes. Short Surrey routes are quoted fixed after survey.",
      },
    ],
    testimonial: {
      quote:
        "Hale to Wimbledon with two kids. Rooms labelled and the day ran to plan.",
      author: "Sarah K.",
      moveType: "Detached move, GU9",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Farnborough",
    slug: "farnborough-removals",
    metaTitle: "Farnborough Removals | GU14 & GU15 Commuter Moves",
    metaDescription:
      "Professional removals in Farnborough GU14 and GU15. Town centre, aviation fringe and Cove borders. Fixed Surrey-Hampshire quotes.",
    h1: "Farnborough removals across GU14 and GU15",
    intro:
      "Farnborough mixes town centre living, business park employment and suburban estates towards Cove and North Camp. The aviation heritage area and busy A325 affect traffic patterns. Flats near the station suit commuters while family semis spread towards Surrey borders.",
    propertyTypes: [
      "Flats and maisonettes near Farnborough station",
      "Semis and detached homes in Cove and Southwood",
      "Town centre apartments",
      "Properties on the Fleet and Aldershot borders",
      "New-build estates on town edges",
    ],
    commonMoveTypes: [
      "Commuter moves to London and Guildford",
      "Moves within Farnborough and Cove",
      "Family relocations to Surrey villages",
      "Downsizing to town centre flats",
      "Office moves for business park tenants",
    ],
    parkingAccessNotes:
      "Station approach roads fill at peak commute. Cove residential roads are easier for parking. Town centre loading needs timed windows near the main shopping streets.",
    localRoads: [
      "Farnborough Road",
      "Reading Road Farnborough",
      "Cove Road",
      "Guildford Road Farnborough",
      "Ively Road",
      "North Camp Road",
    ],
    localLandmarks: [
      "Farnborough station",
      "Farnborough Air Sciences Trust area",
      "Kingsmead shopping",
      "Cove village",
      "Queen Elizabeth Park fringe",
    ],
    postcodes: ["GU14", "GU15"],
    nearbyAreas: [
      { name: "Camberley", slug: "camberley-removals" },
      { name: "Farnham", slug: "farnham-removals" },
      { name: "Fleet", slug: "farnham-removals" },
      { name: "Aldershot", slug: "farnborough-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Farnborough",
        to: "Guildford",
        description:
          "Commuter corridor move with fixed cross-county pricing.",
      },
      {
        from: "Cove",
        to: "Woking",
        description:
          "Family move north into Surrey suburbs.",
      },
      {
        from: "Farnborough",
        to: "Reading",
        description:
          "Westbound relocation along the M3 corridor.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Cove semi to Camberley. Garage workshop cleared and labelled.",
        propertyType: "Semi-detached",
        month: "Recent example",
      },
      {
        summary:
          "Station flat to Fleet house. Early start before commuter parking filled.",
        propertyType: "Flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Cove and North Camp included?",
        answer:
          "Yes. GU14 and GU15 Farnborough areas are fully covered.",
      },
      {
        question: "Can you move from business park offices?",
        answer:
          "Yes. Small office relocations are available on request.",
      },
      {
        question: "Do you offer Farnborough to London moves?",
        answer:
          "Yes. Commuter routes are routine with fixed journey quotes.",
      },
    ],
    testimonial: {
      quote:
        "Cove to Woking on a Friday. Quote stayed fixed and the team were quick and careful.",
      author: "Dave H.",
      moveType: "Semi move, GU14",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Camberley",
    slug: "camberley-removals",
    metaTitle: "Camberley Removals | GU15 Surrey Town Home Moves",
    metaDescription:
      "Reliable removals in Camberley GU15. Town centre, Frimley borders and London Road estates. Fixed Surrey quotes and commuter experience.",
    h1: "Camberley removals across GU15",
    intro:
      "Camberley is a busy Surrey town with strong links to London, Farnborough and the M3. London Road carries constant traffic while quieter estates towards Frimley and Lightwater offer drives and gardens. We quote fixed prices for local moves and cross-border runs into Hampshire.",
    propertyTypes: [
      "Town centre flats near Camberley station",
      "Semis and detached homes on London Road estates",
      "Properties towards Frimley and Mytchett borders",
      "Bungalows on residential closes",
      "New-build homes on development fringes",
    ],
    commonMoveTypes: [
      "Moves within Camberley and Frimley",
      "Commuter relocations to London",
      "Family moves to Guildford and Woking",
      "Downsizing to town centre flats",
      "Military-linked relocations near Sandhurst fringe",
    ],
    parkingAccessNotes:
      "London Road and town centre loading is time-sensitive. Frimley border roads are residential with permit zones. Large vehicles may need to avoid the tightest estate corners.",
    localRoads: [
      "London Road Camberley",
      "Portsmouth Road Camberley",
      "Park Road Camberley",
      "Frimley Road",
      "Watchetts Drive",
      "Maultway",
    ],
    localLandmarks: [
      "Camberley town centre",
      "The Atrium",
      "Frimley Lodge Park",
      "Royal Military Academy Sandhurst fringe",
      "Lightwater border",
    ],
    postcodes: ["GU15", "GU16"],
    nearbyAreas: [
      { name: "Farnborough", slug: "farnborough-removals" },
      { name: "Lightwater", slug: "lightwater-removals" },
      { name: "Bagshot", slug: "lightwater-removals" },
      { name: "Woking", slug: "woking-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Camberley",
        to: "Woking",
        description:
          "Northbound Surrey move with similar suburban housing.",
      },
      {
        from: "Camberley",
        to: "Wimbledon",
        description:
          "Commuter family relocation with fixed pricing.",
      },
      {
        from: "Frimley border",
        to: "Guildford",
        description:
          "County town move from a larger semi.",
      },
    ],
    recentMoves: [
      {
        summary:
          "London Road semi to Lightwater. Children's rooms packed and colour-coded.",
        propertyType: "Semi-detached",
        month: "Recent example",
      },
      {
        summary:
          "Town centre flat to Farnborough. Lift access at departure building.",
        propertyType: "Flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover Frimley and Mytchett borders?",
        answer:
          "Yes. GU15 and GU16 Camberley fringe areas are covered.",
      },
      {
        question: "Can you work around Sandhurst event traffic?",
        answer:
          "We plan timing when local events affect Frimley roads.",
      },
      {
        question: "Are Camberley to Woking moves fixed price?",
        answer:
          "Yes. Short Surrey hops are quoted fixed after survey.",
      },
    ],
    testimonial: {
      quote:
        "Frimley border to Guildford. Straightforward WhatsApp quote and a smooth day.",
      author: "Lisa P.",
      moveType: "Semi move, GU15",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Godstone",
    slug: "godstone-removals",
    metaTitle: "Godstone Removals | RH9 Village & Green Moves",
    metaDescription:
      "Local removals in Godstone RH9. Village green, station roads and North Downs borders. Fixed Surrey quotes and rural lane planning.",
    h1: "Godstone removals in RH9",
    intro:
      "Godstone is a village with a broad green, a station and lanes running towards the North Downs and Kent border. Properties mix village cottages with larger homes on rural roads. Commuters use the line to London while others move here for schools and open space.",
    propertyTypes: [
      "Cottages around Godstone Green",
      "Houses on Godstone High Street",
      "Detached homes on rural RH9 lanes",
      "Flats near Godstone station",
      "Properties with paddocks and outbuildings",
    ],
    commonMoveTypes: [
      "Village moves within Godstone",
      "Moves to Oxted and Caterham",
      "London to Godstone family relocations",
      "Downsizing within the village",
      "Moves with yard and garden equipment",
    ],
    parkingAccessNotes:
      "Green area parking is busy on summer weekends. Rural lanes towards Tandridge need shuttle planning. Station commuter parking affects weekday morning access.",
    localRoads: [
      "Godstone High Street",
      "Church Lane Godstone",
      "Tandridge Lane",
      "Eastbourne Road Godstone",
      "Lagham Road",
      "Station Road Godstone",
    ],
    localLandmarks: [
      "Godstone Green",
      "Godstone station",
      "St Nicholas Church",
      "North Downs fringe",
      "Lagham Park",
    ],
    postcodes: ["RH9"],
    nearbyAreas: [
      { name: "Oxted", slug: "oxted-removals" },
      { name: "Caterham", slug: "caterham-removals" },
      { name: "Redhill", slug: "redhill-removals" },
      { name: "Warlingham", slug: "warlingham-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Godstone",
        to: "Caterham",
        description:
          "Short valley move between adjoining villages.",
      },
      {
        from: "Godstone",
        to: "Clapham",
        description:
          "Commuter move north along the train line.",
      },
      {
        from: "Godstone rural lane",
        to: "Reigate",
        description:
          "Surrey internal move with lane shuttle at departure.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Green-side cottage to Oxted. Antique sideboard crated for narrow stairs.",
        propertyType: "Cottage",
        month: "Recent example",
      },
      {
        summary:
          "Detached on rural lane to Redhill. Shuttle from main road planned in survey.",
        propertyType: "Detached home",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Tandridge border included?",
        answer:
          "Yes. RH9 Godstone village and rural fringes are covered.",
      },
      {
        question: "Can you access narrow Godstone lanes?",
        answer:
          "Yes. We survey width and plan shuttles when needed.",
      },
      {
        question: "Do you link Godstone and Oxted moves?",
        answer:
          "Yes. Adjoining village moves are common and fixed-price.",
      },
    ],
    testimonial: {
      quote:
        "Rural lane meant shuttling. Honest quote from the start and a tidy finish.",
      author: "Brian T.",
      moveType: "Cottage move, RH9",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Caterham",
    slug: "caterham-removals",
    metaTitle: "Caterham Removals | CR3 Valley & Hill Moves",
    metaDescription:
      "Trusted removals in Caterham CR3. Valley floor, Caterham Hill and station roads. Fixed Surrey quotes and steep-road experience.",
    h1: "Caterham removals across CR3",
    intro:
      "Caterham splits between the valley and the hill, each with different access challenges. Station Road and the town centre bustle while Caterham Hill climbs with tight terraces and steep carries. Coulsdon and Whyteleafe are close neighbours on the London border.",
    propertyTypes: [
      "Flats and houses near Caterham stations",
      "Terraces on Caterham Hill",
      "Semis in Caterham Valley",
      "Bungalows on slopes towards Chaldon",
      "Properties near Queen's Park",
    ],
    commonMoveTypes: [
      "Moves between Caterham Valley and Hill",
      "Commuter moves to central London",
      "Family relocations within CR3",
      "Downsizing on the hill",
      "Moves to Purley and Coulsdon",
    ],
    parkingAccessNotes:
      "Caterham Hill streets are steep and narrow. Valley floor parking competes with shoppers and commuters. Long carries from side streets are priced clearly after survey.",
    localRoads: [
      "Caterham Hill",
      "Station Avenue Caterham",
      "Croydon Road Caterham",
      "Chaldon Road",
      "Tillingdown Hill",
      "Whyteleafe Road",
    ],
    localLandmarks: [
      "Caterham Valley station",
      "Caterham Hill",
      "Queen's Park",
      "Chaldon village fringe",
      "Kenley Aerodrome fringe",
    ],
    postcodes: ["CR3"],
    nearbyAreas: [
      { name: "Coulsdon", slug: "coulsdon-removals" },
      { name: "Warlingham", slug: "warlingham-removals" },
      { name: "Whyteleafe", slug: "warlingham-removals" },
      { name: "Godstone", slug: "godstone-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Caterham Hill",
        to: "Clapham",
        description:
          "Commuter move north with stair carry priced upfront.",
      },
      {
        from: "Caterham Valley",
        to: "Purley",
        description:
          "Short border move between valley suburbs.",
      },
      {
        from: "Caterham",
        to: "Reigate",
        description:
          "Deeper Surrey move from a larger valley house.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Hill terrace to Coulsdon flat. Steep street and heavy wardrobe dismantled.",
        propertyType: "Terrace",
        month: "Recent example",
      },
      {
        summary:
          "Valley semi to Godstone. Garage cleared and garden tools boxed.",
        propertyType: "Semi-detached",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Do you cover Caterham Valley and Hill?",
        answer:
          "Yes. CR3 including Chaldon fringe is fully covered.",
      },
      {
        question: "How do you price Caterham Hill stair carries?",
        answer:
          "Floor level and access are built into your fixed quote after survey.",
      },
      {
        question: "Can you move early for commuters?",
        answer:
          "Yes. Early starts suit valley station area flats.",
      },
    ],
    testimonial: {
      quote:
        "Caterham Hill is steep. Extra crew brought without drama. Worth every penny.",
      author: "Karen B.",
      moveType: "Terrace move, CR3",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Coulsdon",
    slug: "coulsdon-removals",
    metaTitle: "Coulsdon Removals | CR5 Suburban Family Moves",
    metaDescription:
      "Local removals in Coulsdon CR5. Town centre, Chipstead borders and commuter semis. Fixed Surrey-London border quotes.",
    h1: "Coulsdon removals on the CR5 corridor",
    intro:
      "Coulsdon sits on the southern edge of Greater London with semis, detached homes and busy Brighton Road traffic. Families often move between Coulsdon, Purley and Caterham while keeping station links. We plan around school runs and commuter parking with fixed quotes agreed in advance.",
    propertyTypes: [
      "1930s semis and detached homes",
      "Flats near Coulsdon town centre",
      "Properties towards Old Coulsdon and Chipstead",
      "Bungalows on quiet residential roads",
      "Houses near Coulsdon South station",
    ],
    commonMoveTypes: [
      "Family moves within Coulsdon",
      "Moves to Purley and Sutton",
      "Commuter relocations north",
      "Downsizing within CR5",
      "Moves towards Surrey villages",
    ],
    parkingAccessNotes:
      "Brighton Road is congested at peak times. Old Coulsdon lanes are narrower. Chipstead border properties may have longer driveway carries.",
    localRoads: [
      "Brighton Road Coulsdon",
      "Coulsdon Road",
      "Chipstead Valley Road",
      "Marlpit Lane",
      "Smitham Bottom Lane",
      "Barnet Wood Lane",
    ],
    localLandmarks: [
      "Coulsdon town centre",
      "Coulsdon South station",
      "Farthing Downs fringe",
      "Lion Green",
      "Chipstead border",
    ],
    postcodes: ["CR5"],
    nearbyAreas: [
      { name: "Purley", slug: "purley-removals" },
      { name: "Caterham", slug: "caterham-removals" },
      { name: "Sutton", slug: "sutton-removals" },
      { name: "Chipstead", slug: "caterham-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Coulsdon",
        to: "Wimbledon",
        description:
          "Northbound family move with fixed cross-border price.",
      },
      {
        from: "Old Coulsdon",
        to: "Reigate",
        description:
          "Surrey relocation from a larger semi.",
      },
      {
        from: "Coulsdon",
        to: "Croydon",
        description:
          "Short move towards town centre employment.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Chipstead border detached to Purley. Loft and garage cleared in two-day pack.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "Town centre flat to Sutton. Morning slot before Brighton Road peak.",
        propertyType: "Flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Old Coulsdon and Chipstead fringe covered?",
        answer:
          "Yes. CR5 including Coulsdon South and town centre is covered.",
      },
      {
        question: "Can you move to central London from Coulsdon?",
        answer:
          "Yes. Commuter corridor moves are routine with fixed pricing.",
      },
      {
        question: "Do you offer Coulsdon to Purley moves?",
        answer:
          "Yes. Short adjoining moves are common and fixed-price.",
      },
    ],
    testimonial: {
      quote:
        "Coulsdon to Wimbledon before school term. Organised, labelled boxes, on time.",
      author: "Steve N.",
      moveType: "Semi move, CR5",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Purley",
    slug: "purley-removals",
    metaTitle: "Purley Removals | CR8 Family & Commuter Moves",
    metaDescription:
      "Trusted removals in Purley CR8. Brighton Road, Riddlesdown and station semis. Fixed Surrey-London border quotes and careful family moves.",
    h1: "Purley removals across CR8",
    intro:
      "Purley is a well-established commuter suburb with large semis, detached homes and flats near the station. Brighton Road cuts through the centre while Riddlesdown and Coulsdon borders offer quieter residential roads. Families often move within CR8 or step up into deeper Surrey.",
    propertyTypes: [
      "1930s semis and detached homes on residential roads",
      "Flats and maisonettes near Purley station",
      "Properties towards Riddlesdown and Kenley",
      "Bungalows on quiet closes",
      "Houses with long drives off Brighton Road",
    ],
    commonMoveTypes: [
      "Family moves within Purley and Riddlesdown",
      "Commuter relocations to central London",
      "Moves to Coulsdon and Caterham",
      "Downsizing near the station",
      "Moves into Surrey villages south",
    ],
    parkingAccessNotes:
      "Brighton Road loading needs off-peak timing. Station car park traffic affects weekday mornings. Riddlesdown slopes can mean longer garden-to-van carries.",
    localRoads: [
      "Brighton Road Purley",
      "Godstone Road Purley",
      "Blenheim Road Purley",
      "Foxley Lane",
      "Riddlesdown Road",
      "Purley Downs Road",
    ],
    localLandmarks: [
      "Purley station",
      "Purley town centre",
      "Riddlesdown",
      "Kenley Aerodrome fringe",
      "Foxley Wood",
    ],
    postcodes: ["CR8"],
    nearbyAreas: [
      { name: "Coulsdon", slug: "coulsdon-removals" },
      { name: "Caterham", slug: "caterham-removals" },
      { name: "Sutton", slug: "sutton-removals" },
      { name: "Kenley", slug: "coulsdon-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Purley",
        to: "Wimbledon",
        description:
          "Northbound family move with fixed cross-border pricing.",
      },
      {
        from: "Riddlesdown",
        to: "Reigate",
        description:
          "Surrey relocation from a larger detached home.",
      },
      {
        from: "Purley",
        to: "Clapham",
        description:
          "Commuter flat move with early start option.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Riddlesdown detached to Coulsdon. Loft storage cleared and labelled by room.",
        propertyType: "Detached home",
        month: "Recent example",
      },
      {
        summary:
          "Station maisonette to Sutton. Permit bay booked for loading window.",
        propertyType: "Maisonette",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Riddlesdown and Kenley fringe included?",
        answer:
          "Yes. CR8 Purley including Riddlesdown is fully covered.",
      },
      {
        question: "Can you move on Brighton Road at peak times?",
        answer:
          "We schedule around peak traffic where possible and price loading time clearly.",
      },
      {
        question: "Do you offer Purley to Coulsdon moves?",
        answer:
          "Yes. Short adjoining moves are routine with fixed quotes.",
      },
    ],
    testimonial: {
      quote:
        "Purley semi to Reigate. Garage tools sorted and quote matched the final bill.",
      author: "Helen W.",
      moveType: "Semi move, CR8",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Wallington",
    slug: "wallington-removals",
    metaTitle: "Wallington Removals | SM6 Suburban Home Moves",
    metaDescription:
      "Local removals in Wallington SM6. Woodcote Road, station semis and Carshalton borders. Fixed Sutton corridor quotes.",
    h1: "Wallington removals in SM6",
    intro:
      "Wallington is a practical Sutton borough suburb with semis, terraces and flats around the station. Woodcote Road carries steady traffic while quieter roads towards Carshalton Beeches offer drives and gardens. We quote fixed prices for local hops and longer Surrey runs.",
    propertyTypes: [
      "Semis and terraces near Wallington station",
      "Flats above shops on Woodcote Road",
      "Properties towards Beddington and Carshalton",
      "Bungalows on residential closes",
      "Family homes near Wallington County Grammar catchment",
    ],
    commonMoveTypes: [
      "Moves within Wallington and Carshalton",
      "Family relocations to Sutton and Cheam",
      "Commuter moves north to London",
      "Downsizing to station-area flats",
      "First-time buyer moves within SM6",
    ],
    parkingAccessNotes:
      "Woodcote Road double yellows limit loading windows. Station approach roads fill at commute time. Carshalton border lanes are narrower for larger vans.",
    localRoads: [
      "Woodcote Road Wallington",
      "Manor Road Wallington",
      "Carshalton Road",
      "Brighton Road Wallington",
      "Demesne Road",
      "Ross Road",
    ],
    localLandmarks: [
      "Wallington station",
      "Wallington town centre",
      "Beddington Park fringe",
      "Carshalton Beeches border",
      "Manor Park",
    ],
    postcodes: ["SM6"],
    nearbyAreas: [
      { name: "Carshalton", slug: "carshalton-removals" },
      { name: "Sutton", slug: "sutton-removals" },
      { name: "Purley", slug: "purley-removals" },
      { name: "Mitcham", slug: "mitcham-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Wallington",
        to: "Sutton",
        description:
          "Short borough move between adjoining suburbs.",
      },
      {
        from: "Wallington",
        to: "Wimbledon",
        description:
          "Family relocation north with fixed pricing.",
      },
      {
        from: "Carshalton border",
        to: "Epsom",
        description:
          "Surrey move from a larger semi with garage contents.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Woodcote Road terrace to Carshalton. Morning slot before shop delivery traffic.",
        propertyType: "Terrace",
        month: "Recent example",
      },
      {
        summary:
          "Station semi to Cheam. Children's rooms packed with colour labels.",
        propertyType: "Semi-detached",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Beddington and Carshalton fringe covered?",
        answer:
          "Yes. SM6 Wallington including Carshalton borders is covered.",
      },
      {
        question: "Can you load on Woodcote Road?",
        answer:
          "Yes. We plan timed windows and use permit bays where available.",
      },
      {
        question: "Do you offer Wallington to Sutton moves?",
        answer:
          "Yes. Short local moves are fixed-price after survey.",
      },
    ],
    testimonial: {
      quote:
        "Wallington to Epsom. Straightforward quote on WhatsApp and a calm moving day.",
      author: "Mark D.",
      moveType: "Semi move, SM6",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Cheam",
    slug: "cheam-removals",
    metaTitle: "Cheam Removals | SM2 Village & Park Moves",
    metaDescription:
      "Professional removals in Cheam SM2. Village centre, Nonsuch Park borders and station roads. Fixed Sutton corridor quotes.",
    h1: "Cheam removals across SM2",
    intro:
      "Cheam blends village character with suburban family housing around Nonsuch Park. The High Street and station road attract shoppers while Parkside and Cheam Village offer larger semis and detached homes. Moves here often involve school catchment changes and careful timing around park event days.",
    propertyTypes: [
      "Semis and detached homes near Nonsuch Park",
      "Village cottages and period terraces",
      "Flats near Cheam station",
      "Properties on Parkside and Malden Road",
      "Bungalows on quiet Cheam closes",
    ],
    commonMoveTypes: [
      "Family moves within Cheam and Belmont",
      "Moves to Sutton and Worcester Park",
      "School catchment relocations",
      "Downsizing to village flats",
      "Moves south towards Epsom",
    ],
    parkingAccessNotes:
      "Cheam Village parking is tight on Saturdays. Parkside roads are residential with limited kerb space. Station commuter bays affect weekday morning access.",
    localRoads: [
      "Cheam Road",
      "Park Lane Cheam",
      "Malden Road Cheam",
      "Parkside",
      "London Road Cheam",
      "Ewell Road Cheam",
    ],
    localLandmarks: [
      "Cheam village centre",
      "Cheam station",
      "Nonsuch Park",
      "Whitehall Recreation Ground",
      "Belmont border",
    ],
    postcodes: ["SM2", "SM3"],
    nearbyAreas: [
      { name: "Sutton", slug: "sutton-removals" },
      { name: "Worcester Park", slug: "worcester-park-removals" },
      { name: "Epsom", slug: "epsom-removals" },
      { name: "Belmont", slug: "sutton-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Cheam",
        to: "Wimbledon",
        description:
          "Northbound family move with fixed cross-border price.",
      },
      {
        from: "Parkside",
        to: "Guildford",
        description:
          "Surrey relocation from a larger detached home.",
      },
      {
        from: "Cheam village",
        to: "Kingston upon Thames",
        description:
          "Commuter move west with careful village street planning.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Nonsuch Park semi to Worcester Park. Garden furniture wrapped and staged.",
        propertyType: "Semi-detached",
        month: "Recent example",
      },
      {
        summary:
          "Village cottage to Sutton flat. Narrow stairs and antique dresser crated.",
        propertyType: "Cottage",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Belmont and Nonsuch Park fringe included?",
        answer:
          "Yes. SM2 and SM3 Cheam areas are fully covered.",
      },
      {
        question: "Can you work around Nonsuch Park event days?",
        answer:
          "Yes. We adjust timing when park roads are busier than usual.",
      },
      {
        question: "Do you offer Cheam to Epsom moves?",
        answer:
          "Yes. Short Surrey hops are quoted fixed after survey.",
      },
    ],
    testimonial: {
      quote:
        "Cheam Parkside to Guildford. Honest about access and finished on schedule.",
      author: "Rachel F.",
      moveType: "Detached move, SM2",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Morden",
    slug: "morden-removals",
    metaTitle: "Morden Removals | SM4 Tube Corridor Moves",
    metaDescription:
      "Reliable removals in Morden SM4. Tube links, council estates and Morden Hall Park borders. Fixed Merton quotes and Northern line commuter experience.",
    h1: "Morden removals across SM4",
    intro:
      "Morden sits at the southern end of the Northern line with a mix of interwar semis, flats and newer developments near the town centre. Morden Hall Park and the Wandle valley bring green space while London Road and Kingston Road carry heavy traffic. We plan fixed quotes around access, lifts and parking restrictions.",
    propertyTypes: [
      "1930s semis on residential roads",
      "Flats near Morden station and town centre",
      "Properties towards Morden Park and Lower Morden",
      "Maisonettes on estate roads",
      "Houses near Morden Hall Park",
    ],
    commonMoveTypes: [
      "Moves within Morden and Mitcham",
      "Commuter relocations along the Northern line",
      "Family moves to Sutton and Wimbledon",
      "Downsizing to station-area flats",
      "Moves from council and housing association properties",
    ],
    parkingAccessNotes:
      "London Road loading is time-sensitive. Estate roads may have height barriers. Morden Hall Park fringe streets are quieter but drives can be narrow.",
    localRoads: [
      "London Road Morden",
      "Kingston Road Morden",
      "Central Road Morden",
      "St Helier Avenue",
      "Lower Morden Lane",
      "Garth Road",
    ],
    localLandmarks: [
      "Morden station",
      "Morden town centre",
      "Morden Hall Park",
      "Morden Park",
      "St Helier estate fringe",
    ],
    postcodes: ["SM4"],
    nearbyAreas: [
      { name: "Mitcham", slug: "mitcham-removals" },
      { name: "Sutton", slug: "sutton-removals" },
      { name: "Wimbledon", slug: "wimbledon-removals" },
      { name: "Colliers Wood", slug: "wimbledon-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Morden",
        to: "Clapham",
        description:
          "Northern line commuter move with fixed pricing.",
      },
      {
        from: "Lower Morden",
        to: "Kingston upon Thames",
        description:
          "Westbound family move along the Kingston Road corridor.",
      },
      {
        from: "Morden",
        to: "Sutton",
        description:
          "Short borough hop between adjoining suburbs.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Morden Hall Park semi to Mitcham. Garage cleared and tools boxed separately.",
        propertyType: "Semi-detached",
        month: "Recent example",
      },
      {
        summary:
          "Station flat to Wimbledon. Lift booked and floor protection laid throughout.",
        propertyType: "Flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Lower Morden and St Helier fringe covered?",
        answer:
          "Yes. SM4 Morden including Morden Park is fully covered.",
      },
      {
        question: "Can you move from estate flats with lifts?",
        answer:
          "Yes. Lift access and booking windows are planned into your quote.",
      },
      {
        question: "Do you offer Morden to Sutton moves?",
        answer:
          "Yes. Short local moves are routine with fixed prices.",
      },
    ],
    testimonial: {
      quote:
        "Morden to Clapham before term started. Early crew, labelled boxes, no surprises on cost.",
      author: "James L.",
      moveType: "Semi move, SM4",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Norbiton",
    slug: "norbiton-removals",
    metaTitle: "Norbiton Removals | KT2 Kingston Fringe Moves",
    metaDescription:
      "Local removals in Norbiton KT2. Kingston Road corridor, station flats and Hogsmill borders. Fixed Kingston quotes and careful access planning.",
    h1: "Norbiton removals on the KT2 Kingston fringe",
    intro:
      "Norbiton sits between Kingston town centre and New Malden with Victorian terraces, semis and flats near the station. Kingston Road is busy throughout the day while quieter roads towards the Hogsmill River offer family housing. Commuters and families move here for schools and quick links into central Kingston.",
    propertyTypes: [
      "Victorian terraces near Norbiton station",
      "Semis and detached homes towards Coombe borders",
      "Flats along Kingston Road",
      "Properties near Kingston Hospital",
      "Maisonettes on residential estate roads",
    ],
    commonMoveTypes: [
      "Moves within Norbiton and Kingston",
      "Family relocations to New Malden and Surbiton",
      "Commuter moves to central London",
      "Downsizing near the station",
      "Hospital and university-linked relocations",
    ],
    parkingAccessNotes:
      "Kingston Road permit zones need advance planning. Station approach roads compete with commuters. Terrace streets can be tight for larger lorries.",
    localRoads: [
      "Kingston Road Norbiton",
      "Cambridge Road Kingston",
      "Portsmouth Road Norbiton",
      "Wheatfield Way fringe",
      "London Road Kingston fringe",
      "Hogsmill Lane",
    ],
    localLandmarks: [
      "Norbiton station",
      "Kingston Hospital",
      "Hogsmill River",
      "Kingston town centre fringe",
      "Beverley Park",
    ],
    postcodes: ["KT2"],
    nearbyAreas: [
      { name: "Kingston upon Thames", slug: "kingston-upon-thames-removals" },
      { name: "New Malden", slug: "new-malden-removals" },
      { name: "Wimbledon", slug: "wimbledon-removals" },
      { name: "Surbiton", slug: "kingston-upon-thames-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Norbiton",
        to: "Wimbledon",
        description:
          "Short cross-borough move with fixed pricing.",
      },
      {
        from: "Norbiton terrace",
        to: "Guildford",
        description:
          "Surrey relocation from a period family home.",
      },
      {
        from: "Norbiton",
        to: "Richmond",
        description:
          "West London move along the Kingston corridor.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Station flat to New Malden house. Narrow Victorian stairs and wardrobe dismantled.",
        propertyType: "Flat",
        month: "Recent example",
      },
      {
        summary:
          "Kingston Road semi to Surbiton. Permit bays booked for both ends.",
        propertyType: "Semi-detached",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Kingston Hospital and town fringe included?",
        answer:
          "Yes. KT2 Norbiton including Kingston borders is covered.",
      },
      {
        question: "Can you work around Kingston Road traffic?",
        answer:
          "Yes. We schedule loading windows to avoid the worst peak congestion.",
      },
      {
        question: "Do you offer Norbiton to New Malden moves?",
        answer:
          "Yes. Adjoining moves are common and fixed-price after survey.",
      },
    ],
    testimonial: {
      quote:
        "Norbiton terrace to Richmond. Tight street but crew knew the drill and stayed on quote.",
      author: "Claire S.",
      moveType: "Terrace move, KT2",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Hampton",
    slug: "hampton-removals",
    metaTitle: "Hampton Removals | TW12 Riverside Family Moves",
    metaDescription:
      "Trusted removals in Hampton TW12. Station roads, Bushy Park borders and Thames-side semis. Fixed Richmond corridor quotes.",
    h1: "Hampton removals across TW12",
    intro:
      "Hampton is a Thames-side suburb with village feel, strong schools and access to Bushy Park. Station Road and the High Street bustle while roads towards Hampton Hill and Fulwell offer larger family homes. Riverside properties and park-border streets need careful parking and timing.",
    propertyTypes: [
      "Semis and detached homes near Bushy Park",
      "Flats and maisonettes near Hampton station",
      "Riverside properties along the Thames",
      "Victorian terraces towards Hampton Hill",
      "Bungalows on quiet residential roads",
    ],
    commonMoveTypes: [
      "Family moves within Hampton and Hampton Hill",
      "Moves to Teddington and Twickenham",
      "Commuter relocations to central London",
      "Downsizing near the village centre",
      "Moves from homes with park-side access",
    ],
    parkingAccessNotes:
      "High Street loading needs timed windows. Bushy Park event days affect nearby roads. Riverside lanes can be narrow for larger vehicles.",
    localRoads: [
      "Hampton High Street",
      "Station Road Hampton",
      "Hampton Court Road",
      "Upper Sunbury Road",
      "Staines Road Hampton",
      "Hampton Hill High Street fringe",
    ],
    localLandmarks: [
      "Hampton station",
      "Bushy Park",
      "Hampton village centre",
      "Hampton Court Palace fringe",
      "Tagg's Island area",
    ],
    postcodes: ["TW12"],
    nearbyAreas: [
      { name: "Teddington", slug: "teddington-removals" },
      { name: "Twickenham", slug: "twickenham-removals" },
      { name: "Richmond", slug: "richmond-removals" },
      { name: "Hampton Wick", slug: "hampton-wick-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Hampton",
        to: "Wimbledon",
        description:
          "South-west London family move with fixed pricing.",
      },
      {
        from: "Hampton Hill",
        to: "Kingston upon Thames",
        description:
          "Cross-river move with bridge traffic planned in.",
      },
      {
        from: "Hampton",
        to: "Guildford",
        description:
          "Surrey relocation from a larger park-side semi.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Bushy Park semi to Teddington. Garden shed contents cleared and labelled.",
        propertyType: "Semi-detached",
        month: "Recent example",
      },
      {
        summary:
          "Village flat to Twickenham. Morning slot before High Street deliveries.",
        propertyType: "Flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Hampton Hill and Fulwell fringe included?",
        answer:
          "Yes. TW12 Hampton including park borders is fully covered.",
      },
      {
        question: "Can you move near Hampton Court on busy days?",
        answer:
          "Yes. We plan around palace visitor traffic where it affects loading.",
      },
      {
        question: "Do you offer Hampton to Teddington moves?",
        answer:
          "Yes. Short adjoining moves are routine with fixed quotes.",
      },
    ],
    testimonial: {
      quote:
        "Hampton to Kingston. Park-side road was tight but shuttle plan worked smoothly.",
      author: "Peter G.",
      moveType: "Semi move, TW12",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Teddington",
    slug: "teddington-removals",
    metaTitle: "Teddington Removals | TW11 Thames Village Moves",
    metaDescription:
      "Professional removals in Teddington TW11. High Street, station semis and Bushy Park borders. Fixed Richmond corridor quotes.",
    h1: "Teddington removals in TW11",
    intro:
      "Teddington is a popular Thames-side village with independent shops, strong schools and a busy station. Properties range from period terraces near the High Street to larger semis towards Hampton and Strawberry Hill. Lock access, park borders and commuter parking all shape how a move should be run.",
    propertyTypes: [
      "Period terraces and semis near Teddington High Street",
      "Flats near Teddington station",
      "Larger detached homes towards Hampton Wick",
      "Riverside properties with mooring access",
      "Bungalows on residential roads off Park Road",
    ],
    commonMoveTypes: [
      "Family moves within Teddington and Hampton Wick",
      "Commuter moves to Waterloo",
      "Moves to Twickenham and Richmond",
      "Downsizing to village centre flats",
      "School catchment relocations",
    ],
    parkingAccessNotes:
      "High Street loading is restricted at peak shopping hours. Station roads fill early on weekdays. Riverside paths are unsuitable for vans so carries may be longer.",
    localRoads: [
      "Teddington High Street",
      "Station Road Teddington",
      "Park Road Teddington",
      "Broad Street Teddington",
      "Kingston Road Teddington",
      "Elmfield Avenue",
    ],
    localLandmarks: [
      "Teddington station",
      "Teddington Lock",
      "Bushy Park border",
      "Teddington village green",
      "Strawberry Hill fringe",
    ],
    postcodes: ["TW11"],
    nearbyAreas: [
      { name: "Hampton", slug: "hampton-removals" },
      { name: "Hampton Wick", slug: "hampton-wick-removals" },
      { name: "Twickenham", slug: "twickenham-removals" },
      { name: "Richmond", slug: "richmond-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Teddington",
        to: "Wimbledon",
        description:
          "South-west London family move with fixed cross-area pricing.",
      },
      {
        from: "Teddington High Street",
        to: "Kingston upon Thames",
        description:
          "Short move west with village street access planned.",
      },
      {
        from: "Teddington",
        to: "Clapham",
        description:
          "Commuter relocation with early start option.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Park Road semi to Hampton Wick. Piano moved on specialist trolley.",
        propertyType: "Semi-detached",
        month: "Recent example",
      },
      {
        summary:
          "High Street flat to Richmond. Permit bay booked for loading window.",
        propertyType: "Flat",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Strawberry Hill fringe included?",
        answer:
          "Yes. TW11 Teddington including park and river borders is covered.",
      },
      {
        question: "Can you move from riverside properties?",
        answer:
          "Yes. We survey mooring path access and price longer carries clearly.",
      },
      {
        question: "Do you offer Teddington to Hampton moves?",
        answer:
          "Yes. Adjoining village moves are fixed-price after survey.",
      },
    ],
    testimonial: {
      quote:
        "Teddington to Wimbledon before the schools went back. Calm crew and quote stayed fixed.",
      author: "Anna M.",
      moveType: "Semi move, TW11",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Hampton Wick",
    slug: "hampton-wick-removals",
    metaTitle: "Hampton Wick Removals | KT1 Palace & Park Moves",
    metaDescription:
      "Local removals in Hampton Wick KT1. Station village, Bushy Park gates and Kingston borders. Fixed Thames corridor quotes.",
    h1: "Hampton Wick removals in KT1",
    intro:
      "Hampton Wick is a compact village between Kingston, Bushy Park and Hampton Court. Station Road properties suit commuters while roads towards the park offer family semis and detached homes. Palace visitor traffic and park gate closures can affect access on busy weekends.",
    propertyTypes: [
      "Victorian terraces near Hampton Wick station",
      "Semis and detached homes towards Bushy Park",
      "Flats above village shops",
      "Properties on Kingston Road Hampton Wick",
      "Houses with park-side pedestrian access",
    ],
    commonMoveTypes: [
      "Moves within Hampton Wick and Kingston",
      "Family relocations to Teddington and Hampton",
      "Commuter moves to Waterloo",
      "Downsizing in the village centre",
      "Moves linked to Kingston schools",
    ],
    parkingAccessNotes:
      "Station Road is narrow with commuter parking pressure. Bushy Park gate traffic affects nearby roads on event days. Kingston Road loading needs off-peak timing.",
    localRoads: [
      "Station Road Hampton Wick",
      "Kingston Road Hampton Wick",
      "Hampton Court Road",
      "Broom Road",
      "Lower Teddington Road",
      "Park Road Hampton Wick",
    ],
    localLandmarks: [
      "Hampton Wick station",
      "Bushy Park gates",
      "Hampton Court Palace approach",
      "Hampton Wick village centre",
      "Kingston town centre fringe",
    ],
    postcodes: ["KT1"],
    nearbyAreas: [
      { name: "Kingston upon Thames", slug: "kingston-upon-thames-removals" },
      { name: "Teddington", slug: "teddington-removals" },
      { name: "Hampton", slug: "hampton-removals" },
      { name: "Twickenham", slug: "twickenham-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Hampton Wick",
        to: "Wimbledon",
        description:
          "South-west London move with fixed pricing.",
      },
      {
        from: "Hampton Wick village",
        to: "Richmond",
        description:
          "Thames corridor relocation with bridge timing planned.",
      },
      {
        from: "Hampton Wick",
        to: "Guildford",
        description:
          "Surrey move from a larger park-border semi.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Bushy Park semi to Kingston flat. Lift booked and floor sheets laid throughout.",
        propertyType: "Semi-detached",
        month: "Recent example",
      },
      {
        summary:
          "Village terrace to Teddington. Narrow stairs and bookcase dismantled on site.",
        propertyType: "Terrace",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Kingston town centre fringe included?",
        answer:
          "Yes. KT1 Hampton Wick including Kingston borders is covered.",
      },
      {
        question: "Can you work around Hampton Court visitor traffic?",
        answer:
          "Yes. We adjust timing when palace approach roads are busiest.",
      },
      {
        question: "Do you offer Hampton Wick to Teddington moves?",
        answer:
          "Yes. Short village hops are routine with fixed quotes.",
      },
    ],
    testimonial: {
      quote:
        "Hampton Wick to Richmond. Palace weekend traffic expected and crew still finished on time.",
      author: "Tom R.",
      moveType: "Terrace move, KT1",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
  {
    locationName: "Greenwich",
    slug: "greenwich-removals",
    metaTitle: "Greenwich Removals | SE10 Historic Riverside Moves",
    metaDescription:
      "Expert removals in Greenwich SE10. Maritime quarter, Blackheath borders and commuter flats. Fixed south-east London quotes and careful period-home handling.",
    h1: "Greenwich removals across SE10",
    intro:
      "Greenwich combines UNESCO heritage streets, modern riverside apartments and family housing towards Blackheath and Westcombe Park. Narrow Georgian terraces near the market need careful handling while newer developments at Greenwich Peninsula suit lift-access moves. Tourist traffic around the Cutty Sark affects loading on busy days.",
    propertyTypes: [
      "Georgian terraces in the historic centre",
      "Riverside apartments at Greenwich Peninsula",
      "Victorian semis towards Westcombe Park",
      "Flats near Greenwich and Maze Hill stations",
      "Properties on Blackheath border roads",
    ],
    commonMoveTypes: [
      "Moves within Greenwich and Blackheath",
      "Commuter relocations to Canary Wharf and the City",
      "Family moves to Dulwich and Lewisham",
      "Downsizing in the maritime quarter",
      "Moves from period homes with tight staircases",
    ],
    parkingAccessNotes:
      "Historic centre streets are narrow with visitor congestion. Peninsula estates need lift booking. Blackheath border roads have resident permit zones.",
    localRoads: [
      "Greenwich High Road",
      "Trafalgar Road",
      "Crooms Hill",
      "Blackheath Avenue",
      "Westcombe Park Road",
      "Maze Hill",
    ],
    localLandmarks: [
      "Greenwich Park",
      "Cutty Sark",
      "Royal Observatory",
      "Greenwich Market",
      "O2 Greenwich Peninsula",
    ],
    postcodes: ["SE10", "SE3"],
    nearbyAreas: [
      { name: "Blackheath", slug: "dulwich-removals" },
      { name: "Dulwich", slug: "dulwich-removals" },
      { name: "Woolwich", slug: "dulwich-removals" },
      { name: "Herne Hill", slug: "herne-hill-removals" },
    ],
    popularMoveRoutes: [
      {
        from: "Greenwich",
        to: "Wimbledon",
        description:
          "Cross-south London family move with fixed journey pricing.",
      },
      {
        from: "Greenwich Peninsula",
        to: "Clapham",
        description:
          "Commuter flat move with lift access planned.",
      },
      {
        from: "Westcombe Park",
        to: "Kingston upon Thames",
        description:
          "South-west relocation from a larger Victorian semi.",
      },
    ],
    recentMoves: [
      {
        summary:
          "Crooms Hill terrace to Dulwich. Period mouldings protected and narrow stairs managed.",
        propertyType: "Terrace",
        month: "Recent example",
      },
      {
        summary:
          "Peninsula apartment to Canary Wharf. Lift slot booked and packing completed day before.",
        propertyType: "Apartment",
        month: "Recent example",
      },
    ],
    faq: [
      {
        question: "Is Westcombe Park and Maze Hill included?",
        answer:
          "Yes. SE10 Greenwich including Blackheath borders is covered.",
      },
      {
        question: "Can you move in the historic centre on busy weekends?",
        answer:
          "Yes. We plan around market and tourist traffic where it affects access.",
      },
      {
        question: "Do you offer Greenwich to Wimbledon moves?",
        answer:
          "Yes. Cross-south London moves are quoted fixed after survey.",
      },
    ],
    testimonial: {
      quote:
        "Greenwich terrace to Wimbledon. Tight stairs but crew were patient and the quote never changed.",
      author: "Sophie K.",
      moveType: "Terrace move, SE10",
    },
    internalLinks: DEFAULT_INTERNAL_LINKS,
  },
];

export function getLocationPage(slug: string): LocationPageData | undefined {
  return LOCATION_PAGES.find((page) => page.slug === slug);
}

export function getAllLocationPages(): LocationPageData[] {
  return LOCATION_PAGES;
}

export function getLocationSlugs(): string[] {
  return LOCATION_PAGES.map((page) => page.slug);
}

export function locationPath(slug: string): string {
  return `/${slug}`;
}

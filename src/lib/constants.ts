export const SITE_NAME = "South West London Removals";
export const SITE_URL = "https://www.southwestlondonremovals.co.uk";
export const SITE_DESCRIPTION =
  "Premium removals across Wimbledon and South West London. Fixed quotations, insured crews, WhatsApp video surveys for home, office, packing and storage moves across Surrey.";

export const PHONE = "020 7946 0958";
export const PHONE_HREF = "tel:+442079460958";
export const WHATSAPP = "+44 7700 900458";
export const WHATSAPP_HREF =
  "https://wa.me/447700900458?text=Hello%2C%20I%27d%20like%20to%20discuss%20a%20removal.";
export const WHATSAPP_SURVEY_HREF =
  "https://wa.me/447700900458?text=Hello%2C%20I%27d%20like%20to%20send%20a%20walkthrough%20video%20for%20a%20quotation.";
export const EMAIL = "enquiries@southwestlondonremovals.co.uk";

export const TRUST_STATS = {
  googleRating: 4.9,
  reviewCount: 127,
  yearsExperience: 15,
  movesCompleted: 1800,
} as const;

export const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Areas", href: "/areas-covered" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const SERVICE_LINKS = [
  {
    title: "House Removals",
    description:
      "Careful home moves for flats, terraces and family properties across Wimbledon, Richmond and Surrey.",
    href: "/services/house-removals",
    icon: "home" as const,
    imageKey: "movingDay" as const,
  },
  {
    title: "Office Removals",
    description:
      "Discreet commercial relocations with minimal disruption — evenings and weekends available.",
    href: "/services/office-removals",
    icon: "building" as const,
    imageKey: "officeMove" as const,
  },
  {
    title: "Packing Services",
    description:
      "Full or partial packing with premium materials, careful labelling and wardrobe boxes included.",
    href: "/services/packing",
    icon: "package" as const,
    imageKey: "packing" as const,
  },
  {
    title: "Storage",
    description:
      "Secure short and long-term storage — ideal for chain moves, renovations and downsizing.",
    href: "/services/storage",
    icon: "warehouse" as const,
    imageKey: "storage" as const,
  },
  {
    title: "Long Distance Moves",
    description:
      "Nationwide relocations from your South West London base with full inventory and insurance.",
    href: "/services/house-removals",
    icon: "truck" as const,
    imageKey: "banner" as const,
  },
  {
    title: "Furniture Dismantling",
    description:
      "Professional dismantling and reassembly of beds, wardrobes and complex furniture on arrival.",
    href: "/services/house-removals",
    icon: "wrench" as const,
    imageKey: "mover" as const,
  },
] as const;

export const RECENT_MOVES = [
  {
    from: "Wimbledon",
    to: "Richmond",
    type: "4-bedroom family home",
    date: "Completed this week",
    imageKey: "movingDay" as const,
  },
  {
    from: "Kingston",
    to: "Surrey Hills",
    type: "5-bedroom executive move",
    date: "Completed last week",
    imageKey: "banner" as const,
  },
  {
    from: "Chelsea",
    to: "Chelsea",
    type: "Office relocation",
    date: "Completed this month",
    imageKey: "officeMove" as const,
  },
  {
    from: "Epsom",
    to: "Epsom",
    type: "Family relocation",
    date: "Completed this week",
    imageKey: "packing" as const,
  },
  {
    from: "Clapham",
    to: "Fulham",
    type: "2-bedroom apartment move",
    date: "Completed yesterday",
    imageKey: "mover" as const,
  },
] as const;

export const WHY_CHOOSE_US = [
  {
    title: "Calm, experienced crews",
    description:
      "In-house trained teams who work methodically — never rushed, never chaotic. The same standard whether you are moving a flat or a five-bedroom home.",
    icon: "users" as const,
  },
  {
    title: "Fixed quotations",
    description:
      "Your price is agreed before moving day and honoured throughout. No surprise extras, no last-minute additions.",
    icon: "fileCheck" as const,
  },
  {
    title: "Careful furniture protection",
    description:
      "Blankets, shrink wrap and corner protectors on every piece. Your furniture is wrapped before it leaves the room.",
    icon: "shield" as const,
  },
  {
    title: "Reliable communication",
    description:
      "A dedicated coordinator from survey to completion. You always know who is handling your move and when they will arrive.",
    icon: "message" as const,
  },
  {
    title: "Fully insured",
    description:
      "Comprehensive public liability cover for complete peace of mind. Documentation available on request.",
    icon: "umbrella" as const,
  },
  {
    title: "Dismantling & reassembly",
    description:
      "Beds, wardrobes and complex furniture dismantled with care and reassembled in your new home.",
    icon: "wrench" as const,
  },
  {
    title: "Floor protection",
    description:
      "Protective coverings laid before a single item is moved — hallways, staircases and door frames included.",
    icon: "layers" as const,
  },
  {
    title: "Wardrobe boxes included",
    description:
      "Clothing transferred on hangers wherever required — no creased suits or crumpled dresses on arrival.",
    icon: "shirt" as const,
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "We moved from a four-bedroom in Wimbledon to Richmond. The crew were calm, professional, and nothing felt rushed. Floor protection was down before anything was touched. Exactly what you want when moving a family home.",
    author: "Sarah & James M.",
    location: "Wimbledon → Richmond",
    rating: 5,
    service: "House removal",
  },
  {
    quote:
      "I sent a WhatsApp walkthrough on Sunday evening and had a fixed quote by Monday morning. Moving day ran exactly to plan — every item accounted for, nothing damaged.",
    author: "David L.",
    location: "Kingston upon Thames",
    rating: 5,
    service: "WhatsApp survey",
  },
  {
    quote:
      "Our Chelsea office move happened overnight with zero disruption to the team. Discreet, efficient, and properly organised. We were operational by 9am.",
    author: "Helena R.",
    location: "Chelsea",
    rating: 5,
    service: "Office relocation",
  },
  {
    quote:
      "The packing team spent two days preparing our Epsom home. Everything labelled by room, fragile items wrapped individually. Moving day was genuinely stress-free.",
    author: "Richard & Anna T.",
    location: "Epsom",
    rating: 5,
    service: "Packing & removal",
  },
] as const;

export const TRUST_ITEMS = [
  {
    label: "Google rating",
    value: `${TRUST_STATS.googleRating}`,
    suffix: "★",
    sub: `${TRUST_STATS.reviewCount} verified reviews`,
  },
  {
    label: "Moves completed",
    value: `${TRUST_STATS.movesCompleted}`,
    suffix: "+",
    sub: "across South West London",
  },
  {
    label: "Fully insured",
    value: "£2M",
    suffix: "",
    sub: "public liability cover",
  },
  {
    label: "Fixed quotes",
    value: "100%",
    suffix: "",
    sub: "no hidden fees",
  },
  {
    label: "Survey response",
    value: "Same",
    suffix: " day",
    sub: "WhatsApp video quotes",
  },
  {
    label: "Experience",
    value: `${TRUST_STATS.yearsExperience}`,
    suffix: "+ yrs",
    sub: "serving SW London",
  },
] as const;

export const HOME_FAQS = [
  {
    question: "Can I send a WhatsApp video for a quotation?",
    answer:
      "Yes — this is our fastest option. Record a brief walkthrough of your rooms and send it via WhatsApp. We typically respond with a fixed quotation within a few hours during business hours, without needing an in-person survey.",
  },
  {
    question: "Are your quotes fixed?",
    answer:
      "Yes. Every quotation we provide is fixed and agreed before your move date. The price you are quoted is the price you pay — no hidden extras or last-minute additions.",
  },
  {
    question: "Are you fully insured?",
    answer:
      "Yes. We hold comprehensive public liability insurance. Full documentation is available on request. We recommend customers maintain their own contents insurance for the duration of the move.",
  },
  {
    question: "Do you dismantle and reassemble furniture?",
    answer:
      "Yes. Beds, wardrobes, dining tables and other complex furniture are dismantled with care before loading and reassembled in your new property on arrival.",
  },
  {
    question: "Do you provide packing services?",
    answer:
      "Yes. We offer full home packing, partial packing (kitchen, fragile items) and supply all materials including boxes, bubble wrap and wardrobe boxes.",
  },
  {
    question: "How quickly can I book a move?",
    answer:
      "Availability depends on the season, but we regularly accommodate moves within two to three weeks. For urgent moves, contact us via WhatsApp and we will do our best to help.",
  },
  {
    question: "Do you offer storage?",
    answer:
      "Yes. Secure short and long-term storage is available — ideal for property chains, renovations and downsizing. Collection and delivery are included.",
  },
] as const;

export const BEFORE_AFTER_ITEMS = [
  {
    title: "Furniture protection",
    description: "Every piece wrapped in blankets and shrink wrap before leaving the room.",
    imageKey: "packing" as const,
    tag: "Protection",
  },
  {
    title: "Floor coverings",
    description: "Hallways, staircases and door frames protected before loading begins.",
    imageKey: "movingDay" as const,
    tag: "Preparation",
  },
  {
    title: "Organised loading",
    description: "Methodical loading with inventory — nothing left behind, nothing damaged.",
    imageKey: "mover" as const,
    tag: "Execution",
  },
  {
    title: "Professional crews",
    description: "Clean vehicles, uniformed teams, and the right equipment for your property.",
    imageKey: "officeMove" as const,
    tag: "Standards",
  },
] as const;

export type MoveFlowReview = {
  id: string;
  name: string;
  rating: 5;
  quote: string;
  locationRoute: string;
  source: "Verified MoveFlow review";
};

/** Curated from MoveFlow public reviews — https://moveflow.cloud/reviews/sw-london-removals */
export const MOVEFLOW_REVIEWS: MoveFlowReview[] = [
  {
    id: "ella-c",
    name: "Ella C.",
    rating: 5,
    quote:
      "Moved from a 4 bed in Wandsworth to a converted barn in Surrey. Whole thing took a day and a half including a pack day. Chris came out for the survey and was straight up about pricing, no surprises on the day. Wayne led the crew, Luke and Jake were the muscle. They got the big oak dresser out a window when it wouldn't fit down the stairs. Would 100% use them again.",
    locationRoute: "Wandsworth → Surrey · Packing & house move",
    source: "Verified MoveFlow review",
  },
  {
    id: "daniel-o",
    name: "Daniel O.",
    rating: 5,
    quote:
      "Booked these guys after a recommendation and they didn't disappoint. Nathan turned up bang on time, gave a quick walk-through of what was going where, and then they just got on with it. Everything arrived in one piece and they shifted the sofa up two flights without scuffing the wall once. Would use again no question.",
    locationRoute: "House move · Nathan's crew",
    source: "Verified MoveFlow review",
  },
  {
    id: "megan-r",
    name: "Megan R.",
    rating: 5,
    quote:
      "Honestly such a smooth move. Ryan kept me updated the whole way through, the price was the price with no surprise add ons at the end, and the team were genuinely lovely. Even the dog liked them. Thanks again.",
    locationRoute: "House move · Fixed quotation",
    source: "Verified MoveFlow review",
  },
  {
    id: "vik-r",
    name: "Vik R.",
    rating: 5,
    quote:
      "Long distance to Devon, three lads two vans, everything wrapped properly and nothing missing or broken.",
    locationRoute: "London → Devon · Long distance move",
    source: "Verified MoveFlow review",
  },
  {
    id: "rory-m-battersea",
    name: "Rory M.",
    rating: 5,
    quote:
      "Moved a 3 bed in Battersea, took about 6 hours start to finish. No complaints at all.",
    locationRoute: "Battersea · 3-bed house move",
    source: "Verified MoveFlow review",
  },
  {
    id: "steve-o",
    name: "Steve O.",
    rating: 5,
    quote:
      "Pretty pricey but we got what we paid for. Wayne and Ryan worked non stop.",
    locationRoute: "House move · Wayne & Ryan",
    source: "Verified MoveFlow review",
  },
  {
    id: "frank-w",
    name: "Frank W.",
    rating: 5,
    quote:
      "Booked them on short notice and they fit us in. A bit more than another quote we got but worth every penny. Chris was upfront about everything.",
    locationRoute: "Short-notice move · Chris coordinated",
    source: "Verified MoveFlow review",
  },
  {
    id: "megan-d",
    name: "Megan D.",
    rating: 5,
    quote:
      "Asked them to be careful with a vintage record player and they wrapped it like it was a baby.",
    locationRoute: "Fragile packing · Specialist care",
    source: "Verified MoveFlow review",
  },
  {
    id: "lola-s-piano",
    name: "Lola S.",
    rating: 5,
    quote:
      "We had a piano. They had a piano. They moved a piano. No drama.",
    locationRoute: "Piano move · Specialist handling",
    source: "Verified MoveFlow review",
  },
  {
    id: "sophie-m",
    name: "Sophie M.",
    rating: 5,
    quote:
      "Wayne kept us in the loop all morning which we really appreciated. Whole move done by 2pm.",
    locationRoute: "House move · Wayne's crew",
    source: "Verified MoveFlow review",
  },
  {
    id: "romy-b",
    name: "Romy B.",
    rating: 5,
    quote:
      "Honestly didn't expect it to go this smoothly. Jake and Luke were both really patient with my nan who kept getting in the way.",
    locationRoute: "Family move · Jake & Luke",
    source: "Verified MoveFlow review",
  },
  {
    id: "isla-r",
    name: "Isla R.",
    rating: 5,
    quote:
      "Wardrobes came apart and went back together no bother. Tea was offered. What more do you want.",
    locationRoute: "House move · Dismantling & reassembly",
    source: "Verified MoveFlow review",
  },
  {
    id: "sophie-b",
    name: "Sophie B.",
    rating: 5,
    quote:
      "Chris and the lads were brilliant. In and out, nothing broken, no fuss.",
    locationRoute: "House move · Chris's team",
    source: "Verified MoveFlow review",
  },
  {
    id: "ellie-w",
    name: "Ellie W.",
    rating: 5,
    quote:
      "Can't believe how quick they were. Started at 8, done by 12.",
    locationRoute: "House move · Same-day completion",
    source: "Verified MoveFlow review",
  },
  {
    id: "sienna-r",
    name: "Sienna R.",
    rating: 5,
    quote:
      "My toddler thought it was a game and they played along. Lovely with the kids.",
    locationRoute: "Family move · Child-friendly crew",
    source: "Verified MoveFlow review",
  },
  {
    id: "lola-s-time",
    name: "Lola S.",
    rating: 5,
    quote:
      "Lads turned up bang on time. Didn't break anything. Price was what they said. Ten out of ten.",
    locationRoute: "Local move · On-time service",
    source: "Verified MoveFlow review",
  },
  {
    id: "daisy-w",
    name: "Daisy W.",
    rating: 5,
    quote:
      "Honestly didn't think I'd be writing a review for movers but here we are. Genuinely impressed.",
    locationRoute: "House move · Professional service",
    source: "Verified MoveFlow review",
  },
  {
    id: "sam-p",
    name: "Sam P.",
    rating: 5,
    quote: "Fast and polite.",
    locationRoute: "Local move · Professional crew",
    source: "Verified MoveFlow review",
  },
  {
    id: "sara-e",
    name: "Sara E.",
    rating: 5,
    quote: "Showed up early. Result.",
    locationRoute: "House move · Punctual arrival",
    source: "Verified MoveFlow review",
  },
  {
    id: "rory-m-ryan",
    name: "Rory M.",
    rating: 5,
    quote: "Brilliant, cheers Ryan.",
    locationRoute: "House move · Ryan's crew",
    source: "Verified MoveFlow review",
  },
];

export { MOVEFLOW_REVIEWS_URL } from "@/lib/moveflow";

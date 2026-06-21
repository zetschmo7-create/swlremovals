/** Carl Hancock — parser test only (new lead, not quoted / no deposit). */
export const PARSER_TEST_QUERIES = [
  "Carl Hancock",
  "Carl",
  "yabasto@yahoo.co.uk",
  "CAR-1781959748",
] as const;

export type RoiTraceCandidate = {
  leadQuery: string;
  jobRef: string;
  label: string;
};

/** Review / deposit candidates for end-to-end ROI tracing. */
export const ROI_TRACE_CANDIDATES: RoiTraceCandidate[] = [
  { leadQuery: "Will", jobRef: "3064", label: "Will → job 3064" },
  { leadQuery: "Jo", jobRef: "3189", label: "Jo → job 3189" },
  { leadQuery: "Kevin", jobRef: "2786", label: "Kevin → job 2786" },
];

export function isParserTestQuery(query: string): boolean {
  const q = query.trim().toLowerCase();
  return PARSER_TEST_QUERIES.some(
    (p) => q === p.toLowerCase() || q.includes(p.toLowerCase())
  );
}

export function resolveRoiCandidate(query: string): RoiTraceCandidate | null {
  const q = query.trim().toLowerCase();
  for (const c of ROI_TRACE_CANDIDATES) {
    if (
      q === c.leadQuery.toLowerCase() ||
      q === c.jobRef ||
      q.includes(c.jobRef) ||
      q.includes(c.leadQuery.toLowerCase())
    ) {
      return c;
    }
  }
  return null;
}

export function resolveTraceMode(query: string): "parser" | "roi" {
  if (isParserTestQuery(query)) return "parser";
  if (resolveRoiCandidate(query)) return "roi";
  // Job refs 3064, 3189, 2786 without name → ROI
  if (/^(3064|3189|2786)$/.test(query.trim())) return "roi";
  return "roi";
}

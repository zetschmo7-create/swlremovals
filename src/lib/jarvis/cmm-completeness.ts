import type { CmmCompletenessStats, CmmLeadRecord } from "./types";

function hasFullName(name: string | null): boolean {
  if (!name?.trim()) return false;
  return name.trim().split(/\s+/).length >= 2;
}

export function buildCmmCompletenessStats(
  leads: CmmLeadRecord[]
): CmmCompletenessStats {
  let withFullName = 0;
  let withEmail = 0;
  let withPhone = 0;
  let withCurrentPostcode = 0;
  let withNewPostcode = 0;
  let withMoveDate = 0;

  for (const lead of leads) {
    if (hasFullName(lead.customer_name)) withFullName += 1;
    if (lead.customer_email) withEmail += 1;
    if (lead.customer_phone) withPhone += 1;
    if (lead.current_postcode || lead.collection_postcode) withCurrentPostcode += 1;
    if (lead.new_postcode || lead.delivery_postcode) withNewPostcode += 1;
    if (lead.move_date) withMoveDate += 1;
  }

  const incompleteSamples = leads
    .filter((l) => !l.customer_email || !hasFullName(l.customer_name))
    .slice(0, 8)
    .map((l) => ({
      customer_name: l.customer_name,
      customer_email: l.customer_email,
      customer_phone: l.customer_phone,
      received_at: l.received_at,
    }));

  return {
    totalLeads: leads.length,
    withFullName,
    withEmail,
    withPhone,
    withCurrentPostcode,
    withNewPostcode,
    withMoveDate,
    incompleteSamples,
  };
}

export type { CmmCompletenessStats };

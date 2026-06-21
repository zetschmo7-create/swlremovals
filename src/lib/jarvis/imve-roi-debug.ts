import type { CmmLeadRecord, PostcodeArea } from "./types";
import type {
  ImveCmmLeadMatch,
  ImveJobRecord,
  ImveRoiEligibilityDebug,
  ImveRoiMatchEvaluation,
} from "./imve-types";
import { isImveMatchUsableForRoi, hasImveDepositValueSignal } from "./imve-cmm-match";

export type {
  ImveRoiEligibilityDebug,
  ImveRoiMatchEvaluation,
  ImveRoiAreaBreakdown,
  ImveRoiExclusionReason,
} from "./imve-types";

function turnoverFromJob(job: ImveJobRecord): number {
  return job.turnover ?? job.quote_value ?? 0;
}

function commissionFromMatch(
  match: ImveCmmLeadMatch,
  job: ImveJobRecord
): number {
  return match.commission ?? job.commission ?? 0;
}

function hasDepositSignal(
  match: ImveCmmLeadMatch,
  job: ImveJobRecord
): boolean {
  return match.deposit_paid || hasImveDepositValueSignal(job);
}

export function evaluateImveMatchForRoi(
  lead: CmmLeadRecord,
  match: ImveCmmLeadMatch | undefined,
  job: ImveJobRecord | undefined
): ImveRoiMatchEvaluation {
  const area = lead.collection_postcode_area;
  const base = {
    lead_id: lead.gmail_message_id,
    lead_name: lead.customer_name,
    area,
    deposit_paid: false,
    deposit_amount: null as number | null,
    turnover_value: null as number | null,
    quote_value: null as number | null,
    commission_value: null as number | null,
    booked: false,
    job_reference: null as string | null,
  };

  if (!match) {
    return {
      ...base,
      match_status: "none",
      included: false,
      exclusion_reason: "no_match",
    };
  }

  if (match.match_status === "needs_review") {
    return {
      ...base,
      match_status: match.match_status,
      included: false,
      exclusion_reason: "status_needs_review",
      job_reference: match.candidate_job_reference,
    };
  }

  if (match.match_status === "rejected") {
    return {
      ...base,
      match_status: match.match_status,
      included: false,
      exclusion_reason: "status_rejected",
    };
  }

  if (match.match_status === "unmatched") {
    return {
      ...base,
      match_status: match.match_status,
      included: false,
      exclusion_reason: "status_unmatched",
    };
  }

  if (!isImveMatchUsableForRoi(match)) {
    return {
      ...base,
      match_status: match.match_status,
      included: false,
      exclusion_reason: "status_not_eligible",
    };
  }

  if (!match.imve_job_id) {
    return {
      ...base,
      match_status: match.match_status,
      included: false,
      exclusion_reason: "missing_imve_job_id",
    };
  }

  if (!job) {
    return {
      ...base,
      match_status: match.match_status,
      included: false,
      exclusion_reason: "imve_job_not_found",
      job_reference: match.job_reference,
    };
  }

  const deposit = hasDepositSignal(match, job);
  const value = turnoverFromJob(job) > 0;

  if (!deposit && !value) {
    return {
      ...base,
      match_status: match.match_status,
      included: false,
      exclusion_reason: "no_deposit_or_value",
      job_reference: job.job_reference,
      deposit_paid: deposit,
      deposit_amount: job.deposit_amount,
      turnover_value: job.turnover,
      quote_value: job.quote_value,
      booked: match.booked || job.booked,
    };
  }

  return {
    ...base,
    match_status: match.match_status,
    included: true,
    exclusion_reason: null,
    deposit_paid: deposit,
    deposit_amount: job.deposit_amount,
    turnover_value: job.turnover,
    quote_value: job.quote_value,
    commission_value: commissionFromMatch(match, job),
    booked: match.booked || job.booked,
    job_reference: job.job_reference,
  };
}

export function buildImveRoiEligibilityDebug(
  leads: CmmLeadRecord[],
  matches: Record<string, ImveCmmLeadMatch>,
  imveJobs: ImveJobRecord[],
  useImveRoi: boolean,
  costPerLead: number,
  areas: PostcodeArea[]
): ImveRoiEligibilityDebug {
  const jobById = new Map(imveJobs.map((j) => [j.imve_id, j]));
  const allMatches = Object.values(matches);

  const evaluations = leads.map((lead) =>
    evaluateImveMatchForRoi(
      lead,
      matches[lead.gmail_message_id],
      jobById.get(matches[lead.gmail_message_id]?.imve_job_id ?? "")
    )
  );

  const included = evaluations.filter((e) => e.included);
  const excluded = evaluations.filter((e) => !e.included);

  const by_area = areas.map((area) => {
    const areaLeads = leads.filter((l) => l.collection_postcode_area === area);
    const areaEvals = evaluations.filter((e) => e.area === area);
    const usable = areaEvals.filter((e) => e.included);
    const spend = areaLeads.length * costPerLead;

    const deposit_jobs_counted = usable.filter((e) => e.deposit_paid).length;
    const booked_jobs_counted = usable.filter((e) => e.booked).length;
    const turnover_summed = usable.reduce(
      (s, e) => s + (e.turnover_value ?? e.quote_value ?? 0),
      0
    );
    const commission_summed = usable.reduce(
      (s, e) => s + (e.commission_value ?? 0),
      0
    );

    const roi_value =
      spend > 0 && turnover_summed > 0
        ? (turnover_summed - spend) / spend
        : null;

    const matched_cmm_leads = areaEvals.filter(
      (e) => e.match_status !== "none" && e.match_status !== "unmatched"
    ).length;

    return {
      area,
      cmm_leads_in_area: areaLeads.length,
      matched_cmm_leads,
      usable_roi_matches: usable.length,
      deposit_jobs_counted,
      booked_jobs_counted,
      turnover_summed,
      commission_summed,
      roi_formula: "(turnover - area_spend) / area_spend",
      roi_value,
      spend_all_time: spend,
    };
  });

  return {
    using_imve_for_roi: useImveRoi,
    totals: {
      total_matches: allMatches.length,
      auto_matched: allMatches.filter((m) => m.match_status === "auto_matched")
        .length,
      manually_approved: allMatches.filter((m) => m.match_status === "approved")
        .length,
      needs_review: allMatches.filter((m) => m.match_status === "needs_review")
        .length,
      rejected: allMatches.filter((m) => m.match_status === "rejected").length,
      unmatched: allMatches.filter((m) => m.match_status === "unmatched")
        .length,
      with_deposit_paid: allMatches.filter((m) => m.deposit_paid).length,
      with_deposit_amount: allMatches.filter((m) => {
        const job = m.imve_job_id ? jobById.get(m.imve_job_id) : undefined;
        return (job?.deposit_amount ?? 0) > 0;
      }).length,
      with_turnover_value: allMatches.filter((m) => {
        const job = m.imve_job_id ? jobById.get(m.imve_job_id) : undefined;
        return job != null && turnoverFromJob(job) > 0;
      }).length,
      included_in_roi: included.length,
      excluded_from_roi: excluded.length,
    },
    excluded_samples: excluded.slice(0, 15).map((e) => ({
      lead_name: e.lead_name,
      match_status: e.match_status,
      reason: e.exclusion_reason ?? "unknown",
    })),
    match_evaluations: evaluations
      .filter(
        (e) => e.match_status !== "none" && e.match_status !== "unmatched"
      )
      .slice(0, 30),
    by_area,
  };
}

export function imveRoiMetricsFromEvaluations(
  evaluations: ImveRoiMatchEvaluation[]
): {
  depositsPaid: number;
  bookedJobs: number;
  turnover: number;
  commission: number;
} {
  const included = evaluations.filter((e) => e.included);
  return {
    depositsPaid: included.filter((e) => e.deposit_paid).length,
    bookedJobs: included.filter((e) => e.booked).length,
    turnover: included.reduce(
      (s, e) => s + (e.turnover_value ?? e.quote_value ?? 0),
      0
    ),
    commission: included.reduce((s, e) => s + (e.commission_value ?? 0), 0),
  };
}

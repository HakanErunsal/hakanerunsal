import { UeDetailsPanel, MELEE_TRACE_TEAM_FILTER_DETAILS } from "@/components/ue-editor";

/** SECMeleeTraceComponent team damage filter (separate from target selection). Verified against SECMeleeTraceComponent.h. */
export default function MeleeTraceTeamFilterDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={MELEE_TRACE_TEAM_FILTER_DETAILS} />
    </div>
  );
}

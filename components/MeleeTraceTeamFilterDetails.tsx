import { UeComponentDetailsPanel, MELEE_TRACE_TEAM_FILTER_DETAILS } from "@/components/ue-editor";

/** SECMeleeTraceComponent TeamFilter — verified against SECMeleeTraceComponent.h */
export default function MeleeTraceTeamFilterDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Melee Trace"
      attachTo="Enemy Character Base"
      note="Damage category on the wielder trace component. Filters who can be hit, separate from combat target selection."
      categories={MELEE_TRACE_TEAM_FILTER_DETAILS}
    />
  );
}

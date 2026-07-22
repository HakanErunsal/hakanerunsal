import { UeComponentDetailsPanel, MELEE_TRACE_COMPONENT_DETAILS } from "@/components/ue-editor";

/** USECMeleeTraceComponent defaults. Verified against SECMeleeTraceComponent.h. */
export default function MeleeTraceComponentDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Melee Trace Component"
      sourceClass="SECMeleeTraceComponent"
      attachTo="AEnemyCharacterBase"
      note="Default component on the enemy pawn. Add SEC Melee Trace to other wielders manually."
      categories={MELEE_TRACE_COMPONENT_DETAILS}
    />
  );
}

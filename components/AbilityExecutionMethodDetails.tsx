import { UeDetailsPanel, ABILITY_EXECUTION_METHOD_DETAILS } from "@/components/ue-editor";

/**
 * Details panel for an action's Execution group with the Gameplay Ability
 * method picked, rendered the way the Unreal editor shows an Instanced
 * UPROPERTY: a class combo whose sub-object properties nest beneath it. Data
 * lives in ABILITY_EXECUTION_METHOD_DETAILS, verified against
 * SECExecutionMethod.h.
 */
export default function AbilityExecutionMethodDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={ABILITY_EXECUTION_METHOD_DETAILS} />
    </div>
  );
}

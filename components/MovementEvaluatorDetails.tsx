import { UeDetailsPanel, MOVEMENT_EVALUATOR_DETAILS } from "@/components/ue-editor";

/**
 * Details panel for UMovementEvaluatorComponent, showing its public C++ UPROPERTY
 * defaults grouped by category, exactly as the Unreal editor renders them.
 *
 * These are component variables set in the Details panel, not Blueprint variables.
 * Data lives in MOVEMENT_EVALUATOR_DETAILS (UeDetailsPanel), verified against the
 * plugin header.
 */
export default function MovementEvaluatorDetails() {
  return (
    <div className="my-6 max-w-[620px]">
      <UeDetailsPanel categories={MOVEMENT_EVALUATOR_DETAILS} />
    </div>
  );
}

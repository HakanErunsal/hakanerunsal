import { UeComponentDetailsPanel, PERFORMANCE_MOVEMENT_TUNING_DETAILS } from "@/components/ue-editor";

/** UMovementEvaluatorComponent fields that dominate SEC CPU cost. Verified against MovementEvaluatorComponent.h */
export default function PerformanceMovementTuningDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="Movement Evaluator Component"
      sourceClass="MovementEvaluatorComponent"
      attachTo="AEnemyControllerBase"
      note="Num Samples scales the direction-scoring loop. Avoidance and nav sampling both refresh at 10 Hz by default."
      categories={PERFORMANCE_MOVEMENT_TUNING_DETAILS}
    />
  );
}

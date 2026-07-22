import { UeComponentDetailsPanel, MOVEMENT_EVAL_DEBUG_DETAILS } from "@/components/ue-editor";

/** UMovementEvaluatorComponent debug flags. Verified against MovementEvaluatorComponent.h */
export default function MovementEvaluatorDebugDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="Movement Evaluator Component"
      sourceClass="MovementEvaluatorComponent"
      attachTo="AEnemyControllerBase"
      note="Component flags OR matching SEC.Debug.Movement.* console variables enable the same output."
      categories={MOVEMENT_EVAL_DEBUG_DETAILS}
    />
  );
}

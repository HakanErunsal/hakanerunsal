import { UeComponentDetailsPanel, ACTION_EVAL_DEBUG_DETAILS } from "@/components/ue-editor";

/** UActionEvaluationComponent debug flags. Verified against ActionEvaluationComponent.h */
export default function ActionEvaluationDebugDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="Action Evaluation Component"
      sourceClass="ActionEvaluationComponent"
      attachTo="AEnemyControllerBase"
      note="Component flags OR matching SEC.Debug.* console variables enable the same logs."
      categories={ACTION_EVAL_DEBUG_DETAILS}
    />
  );
}

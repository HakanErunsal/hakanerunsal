import { UeComponentDetailsPanel, STATE_TREE_BEHAVIOR_CONFIG_DETAILS } from "@/components/ue-editor";

/** UEnemyAIConfig DefaultStateTree + DecisionContextParams. Verified against EnemyAIConfig.h. */
export default function StateTreeBehaviorConfigDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="Enemy AI Config"
      sourceClass="EnemyAIConfig"
      sourceKind="asset"
      attachTo="DA_EnemyAIConfig"
      note="Empty Default State Tree runs the native combat loop. Decision Context Params feed Build Decision Context and the native brain."
      categories={STATE_TREE_BEHAVIOR_CONFIG_DETAILS}
    />
  );
}

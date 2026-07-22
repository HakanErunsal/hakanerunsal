import { UeComponentDetailsPanel, AWARENESS_FILTERED_TARGET_SELECTOR_DETAILS } from "@/components/ue-editor";

/** UAwarenessFilteredTargetSelector instanced fields. Verified against AwarenessFilteredTargetSelector.h. */
export default function AwarenessFilteredTargetSelectorDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="Awareness Filtered Target Selector"
      sourceClass="AwarenessFilteredTargetSelector"
      sourceKind="instanced"
      attachTo="UEnemyAIConfig → Target Selection"
      note="Instanced selector on EnemyAIConfig. Requires USECAwarenessComponent on the AI controller."
      categories={AWARENESS_FILTERED_TARGET_SELECTOR_DETAILS}
    />
  );
}

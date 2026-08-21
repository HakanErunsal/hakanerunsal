import { UeComponentDetailsPanel, AWARENESS_FILTERED_TARGET_SELECTOR_DETAILS } from "@/components/ue-editor";

/** UAwarenessFilteredTargetSelector instanced fields. Verified against AwarenessFilteredTargetSelector.h. */
export default function AwarenessFilteredTargetSelectorDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="Awareness Filtered Target Selector"
      sourceClass="AwarenessFilteredTargetSelector"
      sourceKind="instanced"
      attachTo="Enemy AI Config → Combat Role"
      note="Instanced selector on the Enemy AI Config. Needs a SEC Awareness component on the AI controller."
      categories={AWARENESS_FILTERED_TARGET_SELECTOR_DETAILS}
    />
  );
}

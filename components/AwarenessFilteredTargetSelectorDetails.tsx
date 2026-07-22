import { UeDetailsPanel, AWARENESS_FILTERED_TARGET_SELECTOR_DETAILS } from "@/components/ue-editor";

/** UAwarenessFilteredTargetSelector instanced fields. Verified against AwarenessFilteredTargetSelector.h. */
export default function AwarenessFilteredTargetSelectorDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={AWARENESS_FILTERED_TARGET_SELECTOR_DETAILS} />
    </div>
  );
}

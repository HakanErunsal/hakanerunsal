import { UeComponentDetailsPanel, AWARENESS_CONFIG_MEMORY_DETAILS } from "@/components/ue-editor";

/** USECAwarenessConfig memory and loss fields. Verified against SECAwarenessConfig.h. */
export default function AwarenessConfigMemoryDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Awareness Config"
      sourceClass="SECAwarenessConfig"
      sourceKind="asset"
      attachTo="DA_Awareness_Guard"
      note="Memory category on the awareness config asset."
      categories={AWARENESS_CONFIG_MEMORY_DETAILS}
    />
  );
}

import { UeDetailsPanel, AWARENESS_CONFIG_MEMORY_DETAILS } from "@/components/ue-editor";

/** USECAwarenessConfig memory, proximity, and loss hysteresis. Verified against SECAwarenessConfig.h. */
export default function AwarenessConfigMemoryDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={AWARENESS_CONFIG_MEMORY_DETAILS} />
    </div>
  );
}

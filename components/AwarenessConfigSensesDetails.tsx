import { UeDetailsPanel, AWARENESS_CONFIG_SENSES_DETAILS } from "@/components/ue-editor";

/** USECAwarenessConfig sight, hearing, damage fields. Verified against SECAwarenessConfig.h. */
export default function AwarenessConfigSensesDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={AWARENESS_CONFIG_SENSES_DETAILS} />
    </div>
  );
}

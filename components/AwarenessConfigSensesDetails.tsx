import { UeComponentDetailsPanel, AWARENESS_CONFIG_SENSES_DETAILS } from "@/components/ue-editor";

/** USECAwarenessConfig sight, hearing, damage fields. Verified against SECAwarenessConfig.h. */
export default function AwarenessConfigSensesDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Awareness Config"
      sourceClass="SECAwarenessConfig"
      sourceKind="asset"
      attachTo="DA_Awareness_Guard"
      note="Perception tuning on the awareness config asset the Enemy AI Config points at."
      categories={AWARENESS_CONFIG_SENSES_DETAILS}
    />
  );
}

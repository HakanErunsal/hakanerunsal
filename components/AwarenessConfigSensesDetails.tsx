import { UeComponentDetailsPanel, AWARENESS_CONFIG_SENSES_DETAILS } from "@/components/ue-editor";

/** USECAwarenessConfig sight, hearing, damage fields. Verified against SECAwarenessConfig.h. */
export default function AwarenessConfigSensesDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Awareness Config"
      sourceClass="SECAwarenessConfig"
      sourceKind="asset"
      attachTo="DA_AwarenessConfig"
      note="Perception tuning on the awareness config asset referenced by EnemyAIConfig."
      categories={AWARENESS_CONFIG_SENSES_DETAILS}
    />
  );
}

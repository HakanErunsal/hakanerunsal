import { UeComponentDetailsPanel, AWARENESS_ENEMY_AI_CONFIG_DETAILS } from "@/components/ue-editor";

/** UEnemyAIConfig awareness fields. Verified against EnemyAIConfig.h. */
export default function AwarenessEnemyAIConfigDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="Enemy AI Config"
      sourceClass="EnemyAIConfig"
      sourceKind="asset"
      attachTo="DA_EnemyAIConfig"
      note="Awareness category on the Enemy AI Config asset the enemy pawn points at."
      categories={AWARENESS_ENEMY_AI_CONFIG_DETAILS}
    />
  );
}

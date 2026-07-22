import { UeDetailsPanel, AWARENESS_ENEMY_AI_CONFIG_DETAILS } from "@/components/ue-editor";

/** UEnemyAIConfig awareness fields. Verified against EnemyAIConfig.h. */
export default function AwarenessEnemyAIConfigDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={AWARENESS_ENEMY_AI_CONFIG_DETAILS} />
    </div>
  );
}

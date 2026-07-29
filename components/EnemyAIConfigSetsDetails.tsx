import { UeDetailsPanel, ENEMY_AI_CONFIG_SETS_DETAILS } from "@/components/ue-editor";

/**
 * Details panel for the set-management categories on a UEnemyAIConfig asset,
 * the part the role, behavior and awareness panels do not cover. Data lives in
 * ENEMY_AI_CONFIG_SETS_DETAILS, verified against EnemyAIConfig.h.
 */
export default function EnemyAIConfigSetsDetails() {
  return (
    <div className="my-6 max-w-[560px]">
      <UeDetailsPanel categories={ENEMY_AI_CONFIG_SETS_DETAILS} />
    </div>
  );
}

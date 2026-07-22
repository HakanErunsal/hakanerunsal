import { UeDetailsPanel, TARGETING_CONFIG_DETAILS } from "@/components/ue-editor";

/** EnemyAIConfig target selection fields. Verified against EnemyAIConfig.h. */
export default function TargetingConfigDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={TARGETING_CONFIG_DETAILS} />
    </div>
  );
}

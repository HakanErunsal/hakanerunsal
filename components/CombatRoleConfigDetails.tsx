import { UeDetailsPanel, COMBAT_ROLE_CONFIG_DETAILS } from "@/components/ue-editor";

/** EnemyAIConfig combat role fields. Verified against EnemyAIConfig.h + FAIRoleRegistrationParams. */
export default function CombatRoleConfigDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={COMBAT_ROLE_CONFIG_DETAILS} />
    </div>
  );
}

import { UeDetailsPanel, COMBAT_ROLE_TIMING_DETAILS } from "@/components/ue-editor";

/** Project Settings timing for AICombatRoleSubsystem. Verified against SoulslikeEnemyCombatSettings.h. */
export default function CombatRoleTimingDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={COMBAT_ROLE_TIMING_DETAILS} />
    </div>
  );
}

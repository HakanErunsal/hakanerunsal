import { UeDetailsPanel, COMBAT_TOKEN_SETTINGS_DETAILS } from "@/components/ue-editor";

/** Project Settings token pools shipped by the plugin. Verified against SoulslikeEnemyCombatSettings.h. */
export default function CombatTokenSettingsDetails() {
  return (
    <div className="my-6 max-w-[560px]">
      <UeDetailsPanel categories={COMBAT_TOKEN_SETTINGS_DETAILS} />
    </div>
  );
}

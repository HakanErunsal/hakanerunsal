import { UeDetailsPanel, PROJECT_TARGETING_DETAILS } from "@/components/ue-editor";

/** Project Settings default target selector. Verified against SoulslikeEnemyCombatSettings.h. */
export default function ProjectTargetingDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={PROJECT_TARGETING_DETAILS} />
    </div>
  );
}

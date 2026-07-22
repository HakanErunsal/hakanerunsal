import { UeDetailsPanel, MOVEMENT_PROFILE_DETAILS } from "@/components/ue-editor";

/**
 * Details panel for UMovementBehaviorProfile, the role-swappable data asset.
 * Shows only the fields a combat role changes, grouped by category exactly as the
 * Unreal editor renders them. Data lives in MOVEMENT_PROFILE_DETAILS, verified
 * against the plugin header.
 */
export default function MovementProfileDetails() {
  return (
    <div className="my-6 max-w-[620px]">
      <UeDetailsPanel categories={MOVEMENT_PROFILE_DETAILS} />
    </div>
  );
}

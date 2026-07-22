import { UeDetailsPanel, TARGET_SELECTION_CONTEXT_DETAILS } from "@/components/ue-editor";

/** FTargetSelectionContext fields built by UAICombatRoleSubsystem before SelectTarget. */
export default function TargetSelectionContextDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={TARGET_SELECTION_CONTEXT_DETAILS} />
    </div>
  );
}

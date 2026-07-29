import { UeDetailsPanel, COMBAT_CONTROLLER_DETAILS } from "@/components/ue-editor";

/**
 * Details panel for USECCombatControllerComponent as it appears on an AI
 * controller in the Unreal editor. Data lives in COMBAT_CONTROLLER_DETAILS,
 * verified against SECCombatControllerComponent.h.
 */
export default function CombatControllerDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={COMBAT_CONTROLLER_DETAILS} />
    </div>
  );
}

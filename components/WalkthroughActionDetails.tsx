import {
  UeDetailsPanel,
  WALKTHROUGH_LIGHT_ATTACK_DETAILS,
  WALKTHROUGH_HEAVY_ATTACK_DETAILS,
  WALKTHROUGH_RETREAT_DETAILS,
} from "@/components/ue-editor";

/**
 * Details panels for the three actions the step-by-step walkthrough builds, as
 * each appears on its FActionSpec entry in the Unreal editor. Data lives in
 * WALKTHROUGH_*_DETAILS, verified against ActionSet.h.
 */
export function WalkthroughLightAttackDetails() {
  return (
    <div className="my-6 max-w-[560px]">
      <UeDetailsPanel categories={WALKTHROUGH_LIGHT_ATTACK_DETAILS} />
    </div>
  );
}

export function WalkthroughHeavyAttackDetails() {
  return (
    <div className="my-6 max-w-[560px]">
      <UeDetailsPanel categories={WALKTHROUGH_HEAVY_ATTACK_DETAILS} />
    </div>
  );
}

export function WalkthroughRetreatDetails() {
  return (
    <div className="my-6 max-w-[560px]">
      <UeDetailsPanel categories={WALKTHROUGH_RETREAT_DETAILS} />
    </div>
  );
}

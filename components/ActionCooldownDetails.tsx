import { UeDetailsPanel, ACTION_COOLDOWN_DETAILS } from "@/components/ue-editor";

/**
 * Details panel for an action's FActionCooldown group, rendered the way the
 * Unreal editor shows it: clamp-aware spin boxes with fill bars on the bounded
 * fields (Randomization, Spawn Cooldown Chance). Data lives in
 * ACTION_COOLDOWN_DETAILS, verified against ActionSet.h.
 */
export default function ActionCooldownDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={ACTION_COOLDOWN_DETAILS} />
    </div>
  );
}

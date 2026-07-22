import { UeDetailsPanel, COOLDOWN_ROLE_EVALUATOR_DETAILS } from "@/components/ue-editor";

/** UCooldownRoleEvaluator defaults. Verified against RoleEvaluator.h. */
export default function CooldownRoleEvaluatorDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={COOLDOWN_ROLE_EVALUATOR_DETAILS} />
    </div>
  );
}

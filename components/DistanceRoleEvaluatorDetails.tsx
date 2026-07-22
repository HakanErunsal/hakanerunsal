import { UeDetailsPanel, DISTANCE_ROLE_EVALUATOR_DETAILS } from "@/components/ue-editor";

/** UDistanceRoleEvaluator defaults. Verified against RoleEvaluator.h. */
export default function DistanceRoleEvaluatorDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={DISTANCE_ROLE_EVALUATOR_DETAILS} />
    </div>
  );
}

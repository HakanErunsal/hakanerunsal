import { UeDetailsPanel, REACTION_PRECONDITION_DETAILS } from "@/components/ue-editor";

/**
 * Reaction hard-gate authoring fields: Enabled, Requires/Block Tags, and
 * FActionCooldown. Verified against PassesReactionGates in
 * ReactionEvaluationComponent.cpp and FReactionSpec in ReactionSet.h.
 */
export default function ReactionPreconditionDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={REACTION_PRECONDITION_DETAILS} />
    </div>
  );
}

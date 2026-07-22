import { UeDetailsPanel, REACTION_SCORING_DETAILS } from "@/components/ue-editor";

/**
 * Priority, Selection Weight, and Scoring array on FReactionSpec.
 * Verified against ReactionSet.h.
 */
export default function ReactionScoringDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={REACTION_SCORING_DETAILS} />
    </div>
  );
}

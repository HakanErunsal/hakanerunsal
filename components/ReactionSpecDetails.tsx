import { UeDetailsPanel, REACTION_SPEC_DETAILS } from "@/components/ue-editor";

/**
 * Details panel for one FReactionSpec entry inside a ReactionSet data asset.
 * Shows Identity, Execution, Tags, Scoring, and Action Interaction with struct
 * defaults from ReactionSet.h. Pair with ActionCooldownDetails for the Cooldown group.
 */
export default function ReactionSpecDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={REACTION_SPEC_DETAILS} />
    </div>
  );
}

import { UeDetailsPanel, REACTION_TRIGGER_RULE_DETAILS } from "@/components/ue-editor";

/**
 * Details panel for one FSECReactionTriggerRule entry in a ReactionSet's Trigger
 * Rules array. Struct defaults verified against ReactionSet.h.
 */
export default function ReactionTriggerRuleDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={REACTION_TRIGGER_RULE_DETAILS} />
    </div>
  );
}

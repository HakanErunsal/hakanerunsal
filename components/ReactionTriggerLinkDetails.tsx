import { UeDetailsPanel, REACTION_TRIGGER_LINK_DETAILS } from "@/components/ue-editor";

/**
 * Details panel for one FSECReactionTriggerLink entry in a trigger rule's Reaction
 * Links array, which is what an arrow on the canvas writes. Struct defaults verified
 * against ReactionSet.h.
 */
export default function ReactionTriggerLinkDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={REACTION_TRIGGER_LINK_DETAILS} />
    </div>
  );
}

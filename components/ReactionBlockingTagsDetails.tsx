import {
  UeDetailsPanel,
  REACTION_BLOCKING_PARRY_TAGS,
  REACTION_BLOCKING_DODGE_TAGS,
} from "@/components/ue-editor";

/**
 * Side-by-side Tags setup for reaction-to-reaction blocking:
 * Parry adds SEC.State.ReactionActive; Dodge blocks on that same tag.
 */
export default function ReactionBlockingTagsDetails() {
  return (
    <div className="not-prose my-6 grid min-w-0 gap-6 md:grid-cols-2">
      <div>
        <p className="mb-2 text-sm font-medium text-[#c8c8c8]">Parry reaction</p>
        <p className="mb-3 text-xs text-[#888888]">
          Adds <code className="text-[#7ec8e3]">SEC.State.ReactionActive</code> while it runs. No block tags.
        </p>
        <UeDetailsPanel categories={REACTION_BLOCKING_PARRY_TAGS} />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-[#c8c8c8]">Dodge reaction</p>
        <p className="mb-3 text-xs text-[#888888]">
          Same add tag, plus <strong className="font-medium text-[#c8c8c8]">Block Tags</strong> so it cannot fire during Parry.
        </p>
        <UeDetailsPanel categories={REACTION_BLOCKING_DODGE_TAGS} />
      </div>
    </div>
  );
}

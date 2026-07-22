import { UeDetailsPanel, RANGE_EVAL_DETAILS } from "@/components/ue-editor";

/**
 * Details panel for an FRangeEval curve, as it appears on a scorer's Range
 * property in the Unreal editor. Shows the Distance Scorer's melee-preset
 * default (0/100/250/500). Data lives in RANGE_EVAL_DETAILS, verified against
 * ActionSet.h.
 */
export default function RangeEvalDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={RANGE_EVAL_DETAILS} />
    </div>
  );
}

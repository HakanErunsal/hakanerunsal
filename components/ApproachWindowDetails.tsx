import { APPROACH_WINDOW_NOTIFY_DETAILS, UeComponentDetailsPanel } from "@/components/ue-editor";

/** The SEC Approach Window notify as authored on an in-place greatsword attack. Verified against SECApproachWindowNotifyState.h. */
export default function ApproachWindowDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Approach Window"
      sourceClass="SECApproachWindowNotifyState"
      attachTo="AM_Greatsword_Overhead"
      sourceKind="notify"
      note="Dragged across the wind-up frames. Every override left at -1 takes the character's own answer, and a built-in default when it gives none."
      categories={APPROACH_WINDOW_NOTIFY_DETAILS}
    />
  );
}

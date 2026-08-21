import { APPROACH_WINDOW_NOTIFY_DETAILS, UeComponentDetailsPanel } from "@/components/ue-editor";

/** The SEC Approach Window notify as authored on an in-place two-handed attack. Verified against SECApproachWindowNotifyState.h. */
export default function ApproachWindowDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Approach Window"
      sourceClass="SECApproachWindowNotifyState"
      attachTo="AM_SEC_TwoHanded_SingleAttack"
      sourceKind="notify"
      note="Dragged across the wind-up frames. Approach Target Name picks which stored target it steers toward, or Move By Offset steps a set distance instead. Every override left at -1 takes the value on that target, then the matching Default on the Approach component."
      categories={APPROACH_WINDOW_NOTIFY_DETAILS}
    />
  );
}

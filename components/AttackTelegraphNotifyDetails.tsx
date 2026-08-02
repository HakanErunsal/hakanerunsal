import { ATTACK_TELEGRAPH_NOTIFY_DETAILS, UeComponentDetailsPanel } from "@/components/ue-editor";

/** The SEC Attack Telegraph notify as authored on a greatsword overhead. Verified against SECAttackTelegraphNotify.h. */
export default function AttackTelegraphNotifyDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Telegraph"
      sourceClass="SECAttackTelegraphNotify"
      attachTo="AM_Greatsword_Overhead"
      sourceKind="notify"
      note="Placed on the montage where the wind-up starts. Time To Impact Override at 0 lets the notify measure the gap to the next trace window itself."
      categories={ATTACK_TELEGRAPH_NOTIFY_DETAILS}
    />
  );
}

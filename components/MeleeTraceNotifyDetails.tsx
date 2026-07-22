import { UeComponentDetailsPanel, MELEE_TRACE_NOTIFY_DETAILS } from "@/components/ue-editor";

/** USECMeleeTraceNotifyState montage window fields. Verified against SECMeleeTraceNotifyState.h. */
export default function MeleeTraceNotifyDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Melee Trace Window"
      sourceClass="SECMeleeTraceNotifyState"
      sourceKind="notify"
      attachTo="Attack montage"
      note="Anim notify state on strike frames. Empty Socket IDs activates every registered socket."
      categories={MELEE_TRACE_NOTIFY_DETAILS}
    />
  );
}

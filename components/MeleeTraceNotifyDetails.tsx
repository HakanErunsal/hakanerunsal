import { UeDetailsPanel, MELEE_TRACE_NOTIFY_DETAILS } from "@/components/ue-editor";

/** USECMeleeTraceNotifyState montage window fields. Verified against SECMeleeTraceNotifyState.h. */
export default function MeleeTraceNotifyDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={MELEE_TRACE_NOTIFY_DETAILS} />
    </div>
  );
}

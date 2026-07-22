import { UeDetailsPanel, MELEE_TRACE_COMPONENT_DETAILS } from "@/components/ue-editor";

/** USECMeleeTraceComponent defaults. Verified against SECMeleeTraceComponent.h. */
export default function MeleeTraceComponentDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={MELEE_TRACE_COMPONENT_DETAILS} />
    </div>
  );
}

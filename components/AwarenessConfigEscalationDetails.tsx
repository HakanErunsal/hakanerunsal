import { UeDetailsPanel, AWARENESS_CONFIG_ESCALATION_DETAILS } from "@/components/ue-editor";

/** USECAwarenessConfig escalation meter fields. Verified against SECAwarenessConfig.h. */
export default function AwarenessConfigEscalationDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={AWARENESS_CONFIG_ESCALATION_DETAILS} />
    </div>
  );
}

import { UeComponentDetailsPanel, AWARENESS_CONFIG_ESCALATION_DETAILS } from "@/components/ue-editor";

/** USECAwarenessConfig escalation fields. Verified against SECAwarenessConfig.h. */
export default function AwarenessConfigEscalationDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Awareness Config"
      sourceClass="SECAwarenessConfig"
      sourceKind="asset"
      attachTo="DA_Awareness_Guard"
      note="Escalation category on the awareness config asset."
      categories={AWARENESS_CONFIG_ESCALATION_DETAILS}
    />
  );
}

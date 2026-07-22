import { UeDetailsPanel, THREAT_RESPONSE_WIRING_DETAILS } from "@/components/ue-editor";

/** USECCombatControllerComponent BeginPlay threat enable toggle. Verified against SECCombatControllerComponent.h. */
export default function ThreatResponseWiringDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={THREAT_RESPONSE_WIRING_DETAILS} />
    </div>
  );
}

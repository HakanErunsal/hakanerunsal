import { UeComponentDetailsPanel, THREAT_RESPONSE_WIRING_DETAILS } from "@/components/ue-editor";

/** USECCombatControllerComponent BeginPlay threat enable toggle. Verified against SECCombatControllerComponent.h. */
export default function ThreatResponseWiringDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Combat Controller Component"
      sourceClass="SECCombatControllerComponent"
      attachTo="AEnemyControllerBase"
      note="Binds threat delegates on BeginPlay when ThreatDetectionComponent exists. Enable Threat Detection only controls SetThreatDetectionEnabled(true) on BeginPlay."
      categories={THREAT_RESPONSE_WIRING_DETAILS}
    />
  );
}

import { UeComponentDetailsPanel, THREAT_RESPONSE_WIRING_DETAILS } from "@/components/ue-editor";

/** USECCombatControllerComponent BeginPlay threat enable toggle. Verified against SECCombatControllerComponent.h. */
export default function ThreatResponseWiringDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Combat Controller Component"
      sourceClass="SECCombatControllerComponent"
      attachTo="AEnemyControllerBase"
      note="Wires threat delegates to MovementEvaluatorComponent when bEnableThreatDetection is true."
      categories={THREAT_RESPONSE_WIRING_DETAILS}
    />
  );
}

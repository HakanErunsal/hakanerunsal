import { UeComponentDetailsPanel, THREAT_RESPONSE_WIRING_DETAILS } from "@/components/ue-editor";

/** USECCombatControllerComponent BeginPlay threat enable toggle. Verified against SECCombatControllerComponent.h. */
export default function ThreatResponseWiringDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Combat Controller Component"
      sourceClass="SECCombatControllerComponent"
      attachTo="Enemy Controller Base"
      note="Binds the threat events at BeginPlay whenever a Threat Detection component sits on the same controller. Enable Threat Detection turns evaluation on there and never turns it off."
      categories={THREAT_RESPONSE_WIRING_DETAILS}
    />
  );
}

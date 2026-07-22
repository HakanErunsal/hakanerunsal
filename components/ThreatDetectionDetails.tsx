import { UeComponentDetailsPanel, THREAT_DETECTION_DETAILS } from "@/components/ue-editor";

/** UThreatDetectionComponent tuning fields. Verified against ThreatDetectionComponent.h. */
export default function ThreatDetectionDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="Threat Detection Component"
      sourceClass="ThreatDetectionComponent"
      attachTo="AEnemyControllerBase"
      note="AI controller component. Evaluation starts disabled in EnemyControllerBase; SECCombatControllerComponent calls SetThreatDetectionEnabled(true) on BeginPlay when Enable Threat Detection is on."
      categories={THREAT_DETECTION_DETAILS}
    />
  );
}

import { UeComponentDetailsPanel, THREAT_DETECTION_DETAILS } from "@/components/ue-editor";

/** UThreatDetectionComponent tuning fields. Verified against ThreatDetectionComponent.h. */
export default function ThreatDetectionDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="Threat Detection Component"
      sourceClass="ThreatDetectionComponent"
      attachTo="AEnemyControllerBase"
      note="AI controller component. Disabled by default; SECCombatControllerComponent enables it when AIConfig is assigned."
      categories={THREAT_DETECTION_DETAILS}
    />
  );
}

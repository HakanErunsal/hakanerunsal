import { UeComponentDetailsPanel, THREAT_DETECTION_DETAILS } from "@/components/ue-editor";

/** UThreatDetectionComponent tuning fields. Verified against ThreatDetectionComponent.h. */
export default function ThreatDetectionDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="Threat Detection Component"
      sourceClass="ThreatDetectionComponent"
      attachTo="Enemy Controller Base"
      note="Sits on the AI controller. Evaluation starts off on a controller made from Enemy Controller Base, and the SEC Combat Controller turns it on at BeginPlay when Enable Threat Detection is ticked."
      categories={THREAT_DETECTION_DETAILS}
    />
  );
}

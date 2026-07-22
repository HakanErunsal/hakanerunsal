import { UeDetailsPanel, THREAT_DETECTION_DETAILS } from "@/components/ue-editor";

/** UThreatDetectionComponent tuning fields. Verified against ThreatDetectionComponent.h. */
export default function ThreatDetectionDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={THREAT_DETECTION_DETAILS} />
    </div>
  );
}

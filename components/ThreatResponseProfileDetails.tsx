import { UeDetailsPanel, THREAT_RESPONSE_PROFILE_DETAILS } from "@/components/ue-editor";

/** UMovementBehaviorProfile threat response fields (role-swapped with movement profile). */
export default function ThreatResponseProfileDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={THREAT_RESPONSE_PROFILE_DETAILS} />
    </div>
  );
}

import { UeComponentDetailsPanel, THREAT_RESPONSE_PROFILE_DETAILS } from "@/components/ue-editor";

/** UMovementBehaviorProfile threat response fields (role-swapped with movement profile). */
export default function ThreatResponseProfileDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="Movement Behavior Profile"
      sourceClass="MovementBehaviorProfile"
      sourceKind="asset"
      attachTo="Movement profile asset"
      note="Role-swapped fields on the active movement profile. Make* presets leave both flags false."
      categories={THREAT_RESPONSE_PROFILE_DETAILS}
    />
  );
}

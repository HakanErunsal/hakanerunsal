import { UeComponentDetailsPanel, SPEED_MODIFIER_DETAILS } from "@/components/ue-editor";

/** USECSpeedModifierComponent — verified against SECSpeedModifierComponent.h */
export default function SpeedModifierDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Speed Modifier"
      sourceClass="SECSpeedModifierComponent"
      attachTo="ACharacter"
      note="Scales walk speed while a tag sits on the owner. Each entry pairs a tag with the multiplier it applies."
      categories={SPEED_MODIFIER_DETAILS}
    />
  );
}

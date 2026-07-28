import { UeComponentDetailsPanel, VITALS_COMPONENT_DETAILS } from "@/components/ue-editor";

/** USECVitalsComponent's one authored row (FSECVitalDefinition), shown as AEnemyCharacterBase ships it. Verified against SECVitalsComponent.h. */
export default function VitalsComponentDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Vitals Component"
      sourceClass="SECVitalsComponent"
      attachTo="AEnemyCharacterBase"
      note="Default component on the enemy pawn, authored with one Health row at 100 and no regeneration. Add a row for stamina, stance, or any other pool."
      categories={VITALS_COMPONENT_DETAILS}
    />
  );
}

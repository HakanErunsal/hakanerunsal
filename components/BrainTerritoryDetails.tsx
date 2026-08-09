import { UeComponentDetailsPanel, BRAIN_TERRITORY_DETAILS } from "@/components/ue-editor";

/** USECBrainComponent territory category. Verified against SECBrainComponent.h. */
export default function BrainTerritoryDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Brain"
      sourceClass="SECBrainComponent"
      sourceKind="component"
      attachTo="BP_EnemyController"
      note="Territory category on the brain. What it does while walking home, as opposed to the ground itself, which the Territory component on the pawn describes."
      categories={BRAIN_TERRITORY_DETAILS}
    />
  );
}

import { UeComponentDetailsPanel, BRAIN_TERRITORY_DETAILS } from "@/components/ue-editor";

/** USECBrainComponent territory category. Verified against SECBrainComponent.h. */
export default function BrainTerritoryDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Brain"
      sourceClass="SECBrainComponent"
      sourceKind="component"
      attachTo="BP_EnemyController"
      note="Territory category on the brain. These decide what it does with the ground the Territory component describes."
      categories={BRAIN_TERRITORY_DETAILS}
    />
  );
}

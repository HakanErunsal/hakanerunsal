import { UeComponentDetailsPanel, TERRITORY_COMPONENT_DETAILS } from "@/components/ue-editor";

/** USECTerritoryComponent properties. Verified against SECTerritoryComponent.h. */
export default function TerritoryComponentDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Territory"
      sourceClass="SECTerritoryComponent"
      sourceKind="component"
      attachTo="BP_EnemyController"
      note="Leave Posts empty to take the posts the possessed pawn carries instead."
      categories={TERRITORY_COMPONENT_DETAILS}
    />
  );
}

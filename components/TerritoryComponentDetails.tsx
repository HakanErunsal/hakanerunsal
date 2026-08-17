import { UeComponentDetailsPanel, TERRITORY_COMPONENT_DETAILS } from "@/components/ue-editor";

/** USECTerritoryComponent properties. Verified against SECTerritoryComponent.h. */
export default function TerritoryComponentDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Territory"
      sourceClass="SECTerritoryComponent"
      sourceKind="component"
      attachTo="AEnemyCharacterBase"
      note="Posts live on this component alone; an empty list means the enemy owns no ground. The leash rows show once Leash Enabled is ticked."
      categories={TERRITORY_COMPONENT_DETAILS}
    />
  );
}

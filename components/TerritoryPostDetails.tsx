import { UeComponentDetailsPanel, TERRITORY_POST_DETAILS } from "@/components/ue-editor";

/** USECTerritoryPostComponent properties. Verified against SECTerritoryPostComponent.h. */
export default function TerritoryPostDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Territory Post"
      sourceClass="SECTerritoryPostComponent"
      sourceKind="component"
      attachTo="Any placed actor"
      note="Wander Radius and How To Pick show for the Radius shape only."
      categories={TERRITORY_POST_DETAILS}
    />
  );
}

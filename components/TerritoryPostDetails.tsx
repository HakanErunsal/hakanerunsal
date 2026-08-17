import { UeComponentDetailsPanel, TERRITORY_POST_DETAILS } from "@/components/ue-editor";

/** USECTerritoryPostComponent properties. Verified against SECTerritoryPostComponent.h. */
export default function TerritoryPostDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Territory Post"
      sourceClass="SECTerritoryPostComponent"
      sourceKind="component"
      attachTo="Any placed actor"
      note="How To Pick shows for the Radius and Box shapes, Wander Radius for Radius, Wander Box Extent for Box."
      categories={TERRITORY_POST_DETAILS}
    />
  );
}

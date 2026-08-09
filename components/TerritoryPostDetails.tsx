import { UeComponentDetailsPanel, TERRITORY_POST_DETAILS } from "@/components/ue-editor";

/** USECTerritoryPostComponent properties. Verified against SECTerritoryPostComponent.h. */
export default function TerritoryPostDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Territory Post"
      sourceClass="SECTerritoryPostComponent"
      sourceKind="component"
      attachTo="Any placed actor"
      note="Wander Radius shows for the Radius shape, Wander Box Extent for the Box shape. How To Pick hides for the Point shape."
      categories={TERRITORY_POST_DETAILS}
    />
  );
}

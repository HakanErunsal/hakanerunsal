import { UeComponentDetailsPanel, TERRITORY_POST_DETAILS } from "@/components/ue-editor";

/** ASECTerritoryPost placed-actor properties. Verified against SECTerritoryPost.h. */
export default function TerritoryPostDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Territory Post"
      sourceClass="SECTerritoryPost"
      sourceKind="blueprint"
      attachTo="Level"
      note="Wander Radius shows for the Radius shape, Wander Box Extent for the Box shape."
      categories={TERRITORY_POST_DETAILS}
    />
  );
}

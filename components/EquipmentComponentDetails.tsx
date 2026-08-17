import { UeComponentDetailsPanel, EQUIPMENT_COMPONENT_DETAILS } from "@/components/ue-editor";

/** USECEquipmentComponent on the enemy pawn. Verified against SECEquipmentComponent.h. */
export default function EquipmentComponentDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Equipment Component"
      sourceClass="USECEquipmentComponent"
      sourceKind="component"
      attachTo="BP_Enemy"
      note="Spawns and holds the pawn's equipment. Enemy Character Base carries one already."
      categories={EQUIPMENT_COMPONENT_DETAILS}
    />
  );
}

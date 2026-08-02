import { DEFENSE_COMPONENT_DETAILS, UeComponentDetailsPanel } from "@/components/ue-editor";

/** USECDefenseComponent as a pawn carries it, shown with a shared set and three own responses authored. Verified against SECDefenseComponent.h. */
export default function DefenseComponentDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Defense"
      sourceClass="SECDefenseComponent"
      attachTo="BP_PlayerCharacter"
      note="Responses run top down. Whatever the pawn is carrying answers first, then these, then the Defense Set."
      categories={DEFENSE_COMPONENT_DETAILS}
    />
  );
}

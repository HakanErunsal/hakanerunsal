import { UeComponentDetailsPanel, EQUIP_LOADOUT_ENTRY_DETAILS } from "@/components/ue-editor";

/** One FSECEquipLoadoutEntry inside Starting Loadout. Verified against SECEquipmentComponent.h. */
export default function EquipLoadoutEntryDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="Equip Loadout Entry"
      sourceClass="FSECEquipLoadoutEntry"
      sourceKind="blueprint"
      attachTo="SEC Equipment Component (Starting Loadout)"
      note="One entry spawns one actor and equips it. Turn Use As Weapon off for an off-hand item."
      categories={EQUIP_LOADOUT_ENTRY_DETAILS}
    />
  );
}

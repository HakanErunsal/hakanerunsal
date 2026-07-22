import { UeComponentDetailsPanel, WEAPON_TRACE_SOCKET_DETAILS } from "@/components/ue-editor";

/** ASECWeaponBase attach + one FSECTraceSocket entry. Verified against SECWeaponBase.h. */
export default function WeaponTraceSocketDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="Weapon Trace Socket"
      sourceClass="FSECTraceSocket"
      sourceKind="blueprint"
      attachTo="BP_EnemySword (ASECWeaponBase)"
      note="One TraceSockets array entry on the weapon Blueprint. OnEquipped registers sockets on the wielder trace component."
      categories={WEAPON_TRACE_SOCKET_DETAILS}
    />
  );
}

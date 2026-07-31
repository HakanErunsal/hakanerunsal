import { UeComponentDetailsPanel, WEAPON_TRACE_SOCKET_DETAILS } from "@/components/ue-editor";

/** One FSECTraceSocket entry. Verified against SECMeleeTraceComponent.h. */
export default function WeaponTraceSocketDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="Trace Socket"
      sourceClass="FSECTraceSocket"
      sourceKind="blueprint"
      attachTo="Trace Sockets (weapon Blueprint)"
      note="One entry in the weapon's Trace Sockets array. Equipping registers it on the wielder."
      categories={WEAPON_TRACE_SOCKET_DETAILS}
    />
  );
}

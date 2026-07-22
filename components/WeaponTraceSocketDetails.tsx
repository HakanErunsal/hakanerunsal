import { UeDetailsPanel, WEAPON_TRACE_SOCKET_DETAILS } from "@/components/ue-editor";

/** ASECWeaponBase attach + one FSECTraceSocket entry. Verified against SECWeaponBase.h. */
export default function WeaponTraceSocketDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={WEAPON_TRACE_SOCKET_DETAILS} />
    </div>
  );
}

import { UeComponentDetailsPanel, WEAPON_BASE_DETAILS } from "@/components/ue-editor";

/** ASECWeaponBase defaults on a weapon Blueprint. Verified against SECWeaponBase.h. */
export default function WeaponBaseDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="Weapon Defaults"
      sourceClass="ASECWeaponBase"
      sourceKind="blueprint"
      attachTo="BP_EnemyGreatsword (ASECWeaponBase)"
      note="Class Defaults on the weapon Blueprint. Leave a set empty to keep the enemy's own."
      categories={WEAPON_BASE_DETAILS}
    />
  );
}

import { UeComponentDetailsPanel, SEC_DAMAGE_CONFIG_DETAILS } from "@/components/ue-editor";

/** USECDamageConfig fields. Verified against SECDamageConfig.h. */
export default function SECDamageConfigDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Damage Config"
      sourceClass="SECDamageConfig"
      sourceKind="asset"
      attachTo="DA_MeleeDamage"
      note="Data asset assigned on the montage notify or the trace component Default Damage Config."
      categories={SEC_DAMAGE_CONFIG_DETAILS}
    />
  );
}

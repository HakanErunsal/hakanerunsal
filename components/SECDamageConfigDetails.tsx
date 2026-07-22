import { UeDetailsPanel, SEC_DAMAGE_CONFIG_DETAILS } from "@/components/ue-editor";

/** USECDamageConfig fields. Verified against SECDamageConfig.h. */
export default function SECDamageConfigDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={SEC_DAMAGE_CONFIG_DETAILS} />
    </div>
  );
}

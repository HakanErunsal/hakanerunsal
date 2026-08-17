import { UeComponentDetailsPanel, COMBAT_ROLE_REPLICATED_DETAILS } from "@/components/ue-editor";

/** USECCombatRoleComponent field replicated to clients. Verified against SECCombatRoleComponent.h. */
export default function CombatRoleReplicatedDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Combat Role"
      sourceClass="SECCombatRoleComponent"
      note="Replicated runtime state on the pawn. SECCombatControllerComponent calls SetCombatRole on the server; clients bind OnCombatRoleChanged."
      categories={COMBAT_ROLE_REPLICATED_DETAILS}
    />
  );
}

import { UeDetailsPanel, COMBAT_TOKEN_GATE_DETAILS } from "@/components/ue-editor";

/** One Combat Token Gate on an action's Scoring list. Verified against SECTokenGate.h. */
export default function CombatTokenGateDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={COMBAT_TOKEN_GATE_DETAILS} />
    </div>
  );
}

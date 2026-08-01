import { UeDetailsPanel, TOKEN_BUDGET_COMPONENT_DETAILS } from "@/components/ue-editor";

/** SEC Token Budget Component, the per-target override map. Verified against SECTokenBudgetComponent.h. */
export default function TokenBudgetComponentDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={TOKEN_BUDGET_COMPONENT_DETAILS} />
    </div>
  );
}

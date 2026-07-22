import { UeComponentDetailsPanel, MULTIPLAYER_ACTION_STATE_DETAILS } from "@/components/ue-editor";

/** USECActionSetComponent fields replicated to clients. Verified against SECActionSetComponent.h. */
export default function MultiplayerActionStateDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="SEC Action Set Component"
      sourceClass="SECActionSetComponent"
      note="Replicated runtime state on the pawn. The server writes via NotifyActionStarted and role sync; clients read fields or bind OnActionExecutionStarted."
      categories={MULTIPLAYER_ACTION_STATE_DETAILS}
    />
  );
}

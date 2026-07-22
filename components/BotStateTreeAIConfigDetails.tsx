import { UeComponentDetailsPanel, BOT_STATE_TREE_AI_DETAILS } from "@/components/ue-editor";

/** UBotStateTreeAIComponent init fields. Verified against BotStateTreeAIComponent.h. */
export default function BotStateTreeAIConfigDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="Bot State Tree AI Component"
      sourceClass="BotStateTreeAIComponent"
      attachTo="AEnemyControllerBase (runtime)"
      note="SECBrainComponent creates this at runtime when Default State Tree is set. Custom controllers can add it manually."
      categories={BOT_STATE_TREE_AI_DETAILS}
    />
  );
}

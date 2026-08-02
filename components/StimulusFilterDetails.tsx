import { STIMULUS_FILTER_DETAILS, UeComponentDetailsPanel } from "@/components/ue-editor";

/** UEnemyAIConfig::StimulusFilters with all three shipped filters authored. Verified against EnemyAIConfig.h and SECStimulusFilter.h. */
export default function StimulusFilterDetails() {
  return (
    <UeComponentDetailsPanel
      displayName="DA_KnightAIConfig"
      sourceClass="EnemyAIConfig"
      attachTo="Enemy AI Config"
      sourceKind="asset"
      note="Every filter has to pass before the enemy considers answering. An empty list notices everything, including a swing behind its back."
      categories={STIMULUS_FILTER_DETAILS}
    />
  );
}

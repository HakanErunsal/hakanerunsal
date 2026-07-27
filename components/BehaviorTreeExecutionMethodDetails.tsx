import { UeDetailsPanel, BEHAVIOR_TREE_EXECUTION_METHOD_DETAILS } from "@/components/ue-editor";

/**
 * Details panel for an action's Execution group with the Behavior Tree
 * Sequence method picked and an Ability Payload assigned, showing how the
 * payload's own fields nest under the method. Data lives in
 * BEHAVIOR_TREE_EXECUTION_METHOD_DETAILS, verified against
 * SECExecutionMethod.h and SECBehaviorTreePayload.h.
 */
export default function BehaviorTreeExecutionMethodDetails() {
  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={BEHAVIOR_TREE_EXECUTION_METHOD_DETAILS} />
    </div>
  );
}

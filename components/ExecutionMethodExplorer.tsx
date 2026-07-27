"use client";

import { useState } from "react";
import {
  UeClassPickerCombo,
  UeDetailsPanel,
  type UeDetailCategory,
  type UeDetailProperty,
} from "@/components/ue-editor";

/**
 * An action's Execution group, live. Pick a method from the combo and the
 * properties below it change to that class's own, the way the Details panel
 * redraws when an Instanced UPROPERTY gets a new sub-object.
 *
 * Field sets are verified against SECExecutionMethod.h and
 * SECBehaviorTreePayload.h: which class exposes a timeout, which takes a tag
 * instead of a class, and which properties sit behind the Advanced expander.
 */

const NONE = "None";
const ABILITY = "Gameplay Ability";
const FIRE_AND_FORGET = "Gameplay Ability (Fire And Forget)";
const BY_TAG = "Gameplay Ability By Tag";
const BEHAVIOR_TREE = "Behavior Tree Sequence";

/** The class picker lists non-abstract subclasses alphabetically, None first. */
const METHOD_OPTIONS = [NONE, BEHAVIOR_TREE, ABILITY, FIRE_AND_FORGET, BY_TAG];

const PAYLOAD_NONE = "None";
const PAYLOAD_ABILITY = "Ability Payload";
const PAYLOAD_OPTIONS = [PAYLOAD_NONE, PAYLOAD_ABILITY];

/** One line under the panel saying what the picked method does. */
const METHOD_SUMMARY: Record<string, string> = {
  [NONE]: "No method set. The action cannot run, and the evaluator skips it with a warning.",
  [ABILITY]: "Grants the ability, starts it, and finishes the action when the ability ends.",
  [FIRE_AND_FORGET]:
    "Starts the ability and finishes the action in the same frame without cancelling it. No timeout, because nothing is waiting.",
  [BY_TAG]:
    "Starts every granted ability carrying the tag, for an ability granted somewhere else. Finishes when the first of them ends.",
  [BEHAVIOR_TREE]: "Runs the trees in order, handing each one the payload through a blackboard key.",
};

const asset = (value: string): UeDetailProperty["value"] => ({ kind: "asset", value });
const seconds = (value: number): UeDetailProperty["value"] => ({ kind: "number", value });

/** Properties marked AdvancedDisplay sit behind the category's Advanced expander, shut by default. */
const advanced = (properties: UeDetailProperty[]): UeDetailCategory => ({
  title: "Advanced",
  defaultOpen: false,
  properties,
});

export default function ExecutionMethodExplorer({
  initialMethod = ABILITY,
}: {
  /** Method selected on load. Set it to the one the surrounding section covers. */
  initialMethod?: string;
}) {
  const [method, setMethod] = useState(initialMethod);
  const [payload, setPayload] = useState(PAYLOAD_ABILITY);

  const methodRow: UeDetailProperty = {
    label: "Execution Method",
    value: {
      kind: "node",
      node: (
        <UeClassPickerCombo label="Execution Method" value={method} options={METHOD_OPTIONS} onSelect={setMethod} />
      ),
    },
  };

  const children: UeDetailCategory[] = [];

  if (method === ABILITY) {
    children.push({
      title: "Ability",
      properties: [{ label: "Ability Class", value: asset("GA_SEC_TwoHanded_DoubleAttack") }],
      children: [advanced([{ label: "Ability Timeout", value: seconds(0) }])],
    });
  } else if (method === FIRE_AND_FORGET) {
    children.push({
      title: "Ability",
      properties: [{ label: "Ability Class", value: asset("GA_SEC_TwoHanded_Shoot") }],
    });
  } else if (method === BY_TAG) {
    children.push({
      title: "Ability",
      properties: [{ label: "Activation Tag", value: { kind: "enum", value: "SEC.Action.Attack.Light" } }],
      children: [advanced([{ label: "Ability Timeout", value: seconds(0) }])],
    });
  } else if (method === BEHAVIOR_TREE) {
    const hasPayload = payload !== PAYLOAD_NONE;
    const treeChildren: UeDetailCategory[] = [];

    if (hasPayload) {
      treeChildren.push({
        title: "Payload",
        properties: [{ label: "Ability Class", value: asset("GA_SEC_TwoHanded_TripleAttack") }],
      });
      // Payload Key Name carries EditConditionHides on Payload != nullptr.
      treeChildren.push(advanced([{ label: "Payload Key Name", value: { kind: "text", value: "SEC_Payload" } }]));
    }

    children.push({
      title: "Behavior Tree",
      properties: [
        { label: "Behavior Tree Sequence", value: { kind: "text", value: "1 Array element" } },
        { label: "Index [ 0 ]", value: asset("BT_SEC_AbilityAction") },
        { label: "Behavior Tree Timeout", value: seconds(0) },
        {
          label: "Payload",
          value: {
            kind: "node",
            node: (
              <UeClassPickerCombo label="Payload" value={payload} options={PAYLOAD_OPTIONS} onSelect={setPayload} />
            ),
          },
        },
      ],
      children: treeChildren,
    });
  }

  const categories: UeDetailCategory[] = [{ title: "Execution", properties: [methodRow], children }];

  return (
    <div className="my-6 max-w-[520px]">
      <UeDetailsPanel categories={categories} />
      <p className="mt-2 text-[12px] leading-snug text-muted-foreground">{METHOD_SUMMARY[method]}</p>
    </div>
  );
}

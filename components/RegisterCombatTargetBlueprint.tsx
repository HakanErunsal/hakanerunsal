"use client";

import { useRef } from "react";
import {
  UeBlueprintComment,
  UeBlueprintFunctionNode,
  UeBlueprintGraph,
  UeBlueprintSubsystemNode,
  UeBlueprintWire,
  getPinColor,
} from "@/components/ue-editor";

/** BeginPlay wiring for RegisterCombatTarget — matches UE subsystem getter + BlueprintCallable surface. */
export default function RegisterCombatTargetBlueprint() {
  const containerRef = useRef<HTMLDivElement>(null);
  const subsystemPinRef = useRef<HTMLSpanElement>(null);
  const targetPinRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="my-6 max-w-[540px]">
      <UeBlueprintGraph bodyClassName="p-4">
        <UeBlueprintComment title="Player pawn · Event BeginPlay">
          <div ref={containerRef} className="relative flex items-end gap-10">
            <UeBlueprintSubsystemNode titleLines={["AICombat", "Role", "Subsystem"]} pinRef={subsystemPinRef} />
            <UeBlueprintFunctionNode
              title="Register Combat Target"
              subtitle="Target is AICombat Role Subsystem"
              pins={[
                { name: "Target", type: "object", direction: "input", connected: true, dotRef: targetPinRef },
                { name: "Target Actor", type: "object", direction: "input", defaultValue: "Self" },
                { name: "Auto Assign Unassigned", type: "bool", direction: "input", defaultValue: "true" },
                { name: "Reevaluate Existing", type: "bool", direction: "input", defaultValue: "false" },
              ]}
            />
            <UeBlueprintWire
              containerRef={containerRef}
              fromRef={subsystemPinRef}
              toRef={targetPinRef}
              color={getPinColor("object")}
            />
          </div>
        </UeBlueprintComment>
      </UeBlueprintGraph>
    </div>
  );
}

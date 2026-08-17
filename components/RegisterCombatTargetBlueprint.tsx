import {
  UeBlueprintComment,
  UeBlueprintFunctionNode,
  UeBlueprintGraph,
  UeBlueprintSubsystemNode,
} from "@/components/ue-editor";

/** BeginPlay wiring for RegisterCombatTarget — matches UE subsystem getter + BlueprintCallable surface. */
export default function RegisterCombatTargetBlueprint() {
  return (
    <div className="my-6 max-w-[540px]">
      <UeBlueprintGraph bodyClassName="p-4">
        <UeBlueprintComment title="Player pawn · Event BeginPlay">
          <div className="flex flex-col items-start gap-5">
            <UeBlueprintSubsystemNode titleLines={["AICombat", "Role", "Subsystem"]} />
            <UeBlueprintFunctionNode
              title="Register Combat Target"
              subtitle="Target is AICombat Role Subsystem"
              pins={[
                { name: "Target", type: "object", direction: "input", connected: true },
                { name: "Target Actor", type: "object", direction: "input", defaultValue: "Self" },
                { name: "Auto Assign Unassigned", type: "bool", direction: "input", defaultValue: "true" },
                { name: "Reevaluate Existing", type: "bool", direction: "input", defaultValue: "false" },
              ]}
            />
          </div>
        </UeBlueprintComment>
      </UeBlueprintGraph>
    </div>
  );
}

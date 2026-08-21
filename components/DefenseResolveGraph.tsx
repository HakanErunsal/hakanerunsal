import {
  UE_BP_TITLE,
  UeBlueprintComment,
  UeBlueprintFunctionNode,
  UeBlueprintGraph,
  UeBlueprintNode,
} from "@/components/ue-editor";

/** The whole Handle Incoming Damage answer on a pawn that keeps its health in a Vitals component, matching USECDefenseStatics::ResolveAndApplyIncomingDamage. */
export default function DefenseResolveGraph() {
  return (
    <div className="my-6 max-w-[560px]">
      <UeBlueprintGraph bodyClassName="p-4">
        <UeBlueprintComment title="BP_PlayerCharacter · SEC Damageable interface">
          <div className="flex flex-col items-start gap-5">
            <UeBlueprintNode
              title="Event Handle Incoming Damage"
              kind="event"
              variant="graph"
              impure
              pins={[
                { name: "Damage Info", type: "struct", direction: "output", connected: true },
              ]}
            />
            <UeBlueprintFunctionNode
              title="Resolve Defense and Apply Damage"
              subtitle="Target is SEC Defense Statics"
              pins={[
                { name: "Defense", type: "object", direction: "input", defaultValue: "SEC Defense" },
                { name: "Damage Info", type: "struct", direction: "input", connected: true },
                { name: "Health Vital Tag", type: "struct", direction: "input", defaultValue: "SEC.Vital.Health" },
                { name: "Return Value", type: "struct", direction: "output", connected: true },
              ]}
            />
            <UeBlueprintNode
              title="Return Node"
              kind="function"
              variant="graph"
              impure
              headerColor={UE_BP_TITLE.result}
              pins={[{ name: "Return Value", type: "struct", direction: "input", connected: true }]}
            />
          </div>
        </UeBlueprintComment>
      </UeBlueprintGraph>
    </div>
  );
}

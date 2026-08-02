import {
  UeBlueprintComment,
  UeBlueprintFunctionNode,
  UeBlueprintGraph,
  UeBlueprintNode,
} from "@/components/ue-editor";

/** Announcing a projectile from an event graph, the same call the SEC Attack Telegraph notify makes. Pins verified against SECStimulusLibrary.h. */
export default function ReportAreaStimulusGraph() {
  return (
    <div className="my-6 max-w-[560px]">
      <UeBlueprintGraph bodyClassName="p-4">
        <UeBlueprintComment title="BP_Fireball · Event BeginPlay">
          <div className="flex flex-col items-start gap-5">
            <UeBlueprintNode
              title="Get Velocity"
              kind="pure"
              variant="graph"
              pins={[
                { name: "Target", type: "object", direction: "input", defaultValue: "Self" },
                { name: "Return Value", type: "vector", direction: "output", connected: true },
              ]}
            />
            <UeBlueprintFunctionNode
              title="Report Area Stimulus"
              subtitle="Target is SEC Stimulus Library"
              pins={[
                { name: "Source", type: "object", direction: "input", defaultValue: "Self" },
                { name: "Stimulus", type: "struct", direction: "input", connected: true },
                { name: "Shape", type: "struct", direction: "input", connected: true },
                { name: "Facing", type: "vector", direction: "input", connected: true },
                { name: "Return Value", type: "int", direction: "output" },
              ]}
            />
          </div>
        </UeBlueprintComment>
      </UeBlueprintGraph>
    </div>
  );
}

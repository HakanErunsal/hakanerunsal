import { SEC_STIMULUS_DEBUG, UE } from "@/components/ue-editor/ue-theme";

/**
 * What each marker means once SEC.Debug.Stimulus.Draw is on. Listed in the order a pawn
 * falls out of the pipeline, so a run of grey then blue then red reads top to bottom.
 * Colors and labels verified against SECStimulusDebug.cpp.
 */

type Marker = {
  color: string;
  name: string;
  label: string;
  meaning: string;
};

const MARKERS: Marker[] = [
  {
    color: SEC_STIMULUS_DEBUG.broadcast,
    name: "Orange",
    label: "the announcement",
    meaning:
      "Drawn at the origin: a sphere for the reach, the covered wedge, and an arrow for the facing, labelled with the tag, the radius, the arc and the notice chance.",
  },
  {
    color: SEC_STIMULUS_DEBUG.teamFiltered,
    name: "Grey",
    label: "Team filtered",
    meaning: "The team filter refused this pawn, which is what keeps an attack from startling its own side.",
  },
  {
    color: SEC_STIMULUS_DEBUG.outsideArc,
    name: "Blue",
    label: "Outside shape",
    meaning: "In range but off the ground the shape covers. Widen the shape, or turn a cone with its yaw offset.",
  },
  {
    color: SEC_STIMULUS_DEBUG.noticeRollFailed,
    name: "Magenta",
    label: "Notice roll failed",
    meaning: "The announcement's Notice Chance dropped this pawn before its own perception ran.",
  },
  {
    color: SEC_STIMULUS_DEBUG.perceptionFiltered,
    name: "Red",
    label: "Not noticed",
    meaning: "One of the receiver's Stimulus Filters refused it. The label names which filter.",
  },
  {
    color: SEC_STIMULUS_DEBUG.noReaction,
    name: "Yellow",
    label: "No reaction",
    meaning:
      "Noticed, and nothing answered. The label says why: no trigger rule matched, or nothing in the category passed its gates.",
  },
  {
    color: SEC_STIMULUS_DEBUG.reacted,
    name: "Green",
    label: "Reacted",
    meaning: "A reaction started, and the label names it.",
  },
  {
    color: SEC_STIMULUS_DEBUG.listenerOnly,
    name: "Cyan",
    label: "Listener only",
    meaning: "A pawn carrying a Stimulus Listener and no reaction component, which is the player.",
  },
  {
    color: SEC_STIMULUS_DEBUG.noReceiver,
    name: "White",
    label: "No receiver",
    meaning: "Neither a reaction component nor a listener, so the announcement reached a pawn that cannot use it.",
  },
];

export default function StimulusDebugLegend() {
  return (
    <div className="my-6 overflow-x-auto">
      <div
        className="min-w-[540px] rounded-sm border p-3"
        style={{ background: UE.panel, borderColor: UE.windowBorder }}
      >
        <div className="flex flex-col gap-2">
          {MARKERS.map((marker) => (
            <div key={marker.name} className="flex items-start gap-3">
              <div
                className="mt-[3px] h-4 w-4 shrink-0 rounded-full border"
                style={{ background: marker.color, borderColor: UE.windowBorder }}
                aria-hidden
              />
              <div className="min-w-0">
                <div className="text-[13px] font-semibold" style={{ color: UE.foregroundHeader }}>
                  {marker.name}
                  <span className="ml-2 font-mono text-[11px] font-normal" style={{ color: UE.hover2 }}>
                    {marker.label}
                  </span>
                </div>
                <div className="text-[12px] leading-snug" style={{ color: UE.foreground }}>
                  {marker.meaning}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

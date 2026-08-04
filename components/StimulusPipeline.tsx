import { UE } from "@/components/ue-editor/ue-theme";

/**
 * The five stages between an attack winding up and an enemy answering it. Matches the order
 * in USECStimulusLibrary::ReportAreaStimulus and UReactionEvaluationComponent::ReceiveStimulus.
 */

type Stage = {
  index: string;
  title: string;
  decidedBy: string;
  passes: string;
  dropsOut: string;
};

const STAGES: Stage[] = [
  {
    index: "1",
    title: "The attack announces itself",
    decidedBy: "SEC Attack Telegraph notify, or Report Area Stimulus from any graph",
    passes: "One announcement carrying the attacker, how long is left, and what kind of attack it is.",
    dropsOut: "Nothing yet. The announcement fires once, at the instant the notify sits on.",
  },
  {
    index: "2",
    title: "Who is in danger",
    decidedBy: "Shape, Team Filter, Notice Chance",
    passes: "The pawns standing inside the wedge, minus the ones the notice roll missed.",
    dropsOut: "Anyone out of reach, behind the arc, on the attacker's own side, or unlucky on the roll.",
  },
  {
    index: "3",
    title: "Did this one notice",
    decidedBy: "Stimulus Filters on the receiver's Enemy AI Config",
    passes: "The enemies that could have seen it coming.",
    dropsOut: "Back turned, has not spotted the attacker yet, a wall in between.",
  },
  {
    index: "4",
    title: "What kind of answer",
    decidedBy: "Trigger Rules on the receiver's Reaction Set, checked top down",
    passes: "A reaction category: defensive, aggressive, whatever the rule names.",
    dropsOut: "No rule matched the tags, the rule's Chance failed, or its Min Interval has not run out.",
  },
  {
    index: "5",
    title: "Which reaction runs",
    decidedBy: "The usual reaction scoring inside that category",
    passes: "One reaction, which starts its ability.",
    dropsOut: "Nothing in the category passed its gates, so the enemy takes the hit.",
  },
];

export default function StimulusPipeline() {
  return (
    <div className="my-6 overflow-x-auto">
      <div
        className="min-w-[560px] rounded-sm border p-3"
        style={{ background: UE.panel, borderColor: UE.windowBorder }}
      >
        <div className="flex flex-col gap-2">
          {STAGES.map((stage, i) => (
            <div key={stage.index}>
              <div className="flex items-start gap-3 rounded-sm p-2" style={{ background: UE.recessed }}>
                <div
                  className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-sm text-[11px] font-bold"
                  style={{ background: UE.primary, color: UE.foregroundHeader }}
                >
                  {stage.index}
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold" style={{ color: UE.foregroundHeader }}>
                    {stage.title}
                  </div>
                  <div className="font-mono text-[11px]" style={{ color: UE.hover2 }}>
                    {stage.decidedBy}
                  </div>
                  <div className="mt-1 text-[12px] leading-snug" style={{ color: UE.foreground }}>
                    {stage.passes}
                  </div>
                  <div className="mt-0.5 text-[12px] leading-snug" style={{ color: UE.warning }}>
                    Drops out here: {stage.dropsOut}
                  </div>
                </div>
              </div>
              {i < STAGES.length - 1 && (
                <div className="mx-auto h-3 w-px" style={{ background: UE.secondary }} aria-hidden />
              )}
            </div>
          ))}
        </div>

        <div
          className="mt-3 border-t px-1 pt-2 text-[12px] leading-snug"
          style={{ borderColor: UE.windowBorder, color: UE.foreground }}
        >
          Stage 2 and stage 4 each roll their own dice. Set both to 0.5 and roughly a quarter of the enemies in the arc answer.
        </div>
      </div>
    </div>
  );
}

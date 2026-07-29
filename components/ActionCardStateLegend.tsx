import { UE, SEC_CARD } from "@/components/ue-editor/ue-theme";

/**
 * Legend for the five looks an action card takes while the game runs, drawn with
 * the same border and body colors the graph editor uses. Listed in the order the
 * editor resolves them, so the topmost entry wins when several apply.
 */

type CardState = {
  badge: string;
  border: string;
  body: string;
  meaning: string;
  detail: string;
};

const STATES: CardState[] = [
  {
    badge: "RUNNING",
    border: SEC_CARD.runningBorder,
    body: SEC_CARD.runningBody,
    meaning: "Executing right now",
    detail: "One card at a time. Outranks every other look, so a running action still reads as running.",
  },
  {
    badge: "TOP PICK",
    border: SEC_CARD.winnerBorder,
    body: SEC_CARD.winnerBody,
    meaning: "Scored highest this round",
    detail: "What the AI would pick next if it picked at this moment.",
  },
  {
    badge: "COOLDOWN",
    border: SEC_CARD.cooldownBorder,
    body: SEC_CARD.cooldownBody,
    meaning: "Waiting out its cooldown",
    detail: "The card counts down the seconds left, and the bar fills back up as it recovers.",
  },
  {
    badge: "BLOCKED",
    border: SEC_CARD.vetoedBorder,
    body: SEC_CARD.vetoedBody,
    meaning: "A gate refused it",
    detail: "The card names the gate that said no: a missing tag, no line of sight, not enough stamina.",
  },
  {
    badge: "OFF",
    border: SEC_CARD.disabledBorder,
    body: SEC_CARD.disabledBody,
    meaning: "Switched off in the asset",
    detail: "Enabled is unticked, so nothing considers it.",
  },
];

export default function ActionCardStateLegend() {
  return (
    <div className="my-6 overflow-x-auto">
      <div
        className="min-w-[540px] rounded-sm border p-3"
        style={{ background: UE.panel, borderColor: UE.windowBorder }}
      >
        <div className="flex flex-col gap-2">
          {STATES.map((state) => (
            <div key={state.badge} className="flex items-start gap-3">
              <div
                className="mt-[2px] w-[104px] shrink-0 rounded-sm border-2 px-2 py-1 text-center text-[10px] font-bold tracking-wide"
                style={{
                  borderColor: state.border,
                  background: state.body,
                  color: state.border,
                }}
              >
                {state.badge}
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold" style={{ color: UE.foregroundHeader }}>
                  {state.meaning}
                </div>
                <div className="text-[12px] leading-snug" style={{ color: UE.foreground }}>
                  {state.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

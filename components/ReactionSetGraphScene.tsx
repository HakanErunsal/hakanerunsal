/**
 * The Reaction Set editor's actual canvas, redrawn from
 * SEdNode_SECReactionCard.cpp and EdNode_SECReactionNodes.cpp
 * (Source/SECEditor/Private/Reaction). Same chip colors (TriggerTint,
 * ReactionTint, and a body tint at 42% of the border), same card layout, and
 * the exact line text GatherCardLines() builds for a Trigger and a Reaction
 * card. The System doc page explains the fields; this page shows the canvas
 * they land on.
 */
const COLOR = {
  triggerChip: "#5880B0",
  triggerBody: "#253A4A",
  reactionChip: "#966CB0",
  reactionBody: "#3F2D4A",
  title: "#F6F0E6",
  detail: "#ECECF3",
  wire: "#B8B8C8",
  pin: "#D8D8E4",
} as const;

interface CardSpec {
  kind: "TRIGGER" | "REACTION";
  title: string;
  lines: string[];
  left: number;
  top: number;
}

const WIDTH = 280;
const HEIGHT = 150;

const CARDS: CardSpec[] = [
  {
    kind: "TRIGGER",
    title: "GuardFrontal",
    lines: ["on SEC.Stimulus.DamageTaken", "priority 10", "answers with 2", "limited to SEC.Reaction", "1 condition(s)"],
    left: 20,
    top: 20,
  },
  {
    kind: "REACTION",
    title: "Block",
    lines: ["runs Ability: GA_SEC_Reaction", "priority 1, weight 1.00", "in SEC.Reaction", "cooldown 3.0s"],
    left: 400,
    top: 20,
  },
  {
    kind: "TRIGGER",
    title: "GuardSides",
    lines: ["on SEC.Stimulus.AttackTelegraphed", "priority 5", "answers with 1", "limited to SEC.Reaction", "20% of the time", "1 condition(s)"],
    left: 20,
    top: 220,
  },
  {
    kind: "REACTION",
    title: "Dodge",
    lines: ["runs Ability: GA_SEC_DodgeBack", "priority 0, weight 1.00", "in SEC.Reaction", "cooldown 15.0s"],
    left: 400,
    top: 220,
  },
];

/** GuardFrontal answers with Block and Dodge; GuardSides answers with Dodge only. */
const WIRES: Array<[number, number]> = [
  [0, 1],
  [0, 3],
  [2, 3],
];

function Card({ card }: { card: CardSpec }) {
  const chip = card.kind === "TRIGGER" ? COLOR.triggerChip : COLOR.reactionChip;
  const body = card.kind === "TRIGGER" ? COLOR.triggerBody : COLOR.reactionBody;
  const pinSide = card.kind === "TRIGGER" ? "right" : "left";

  return (
    <div
      className="absolute flex flex-col justify-center rounded-[3px] px-3 py-2"
      style={{ left: card.left, top: card.top, width: WIDTH, height: HEIGHT, background: body, border: `2px solid ${chip}` }}
    >
      <div className="flex items-center gap-2">
        <span className="rounded-[2px] px-1.5 py-0.5 text-[9px] font-bold text-white" style={{ background: chip }}>
          {card.kind}
        </span>
        <span className="truncate text-[13px] font-bold" style={{ color: COLOR.title }}>{card.title}</span>
      </div>
      <div className="mt-1 flex flex-col gap-[1px]">
        {card.lines.map((line) => (
          <span key={line} className="text-[10px] leading-tight" style={{ color: COLOR.detail }}>{line}</span>
        ))}
      </div>
      <span
        className="absolute top-1/2 flex -translate-y-1/2 items-center gap-1 text-[9px]"
        style={{ color: COLOR.pin, [pinSide]: -34 } as React.CSSProperties}
      >
        {pinSide === "right" ? (
          <>Out<span className="h-2 w-2 rounded-full" style={{ background: COLOR.pin }} /></>
        ) : (
          <><span className="h-2 w-2 rounded-full" style={{ background: COLOR.pin }} />In</>
        )}
      </span>
    </div>
  );
}

function wirePath(from: CardSpec, to: CardSpec) {
  const x1 = from.left + WIDTH + 34;
  const y1 = from.top + HEIGHT / 2;
  const x2 = to.left - 34;
  const y2 = to.top + HEIGHT / 2;
  const dx = Math.max(40, Math.abs(x2 - x1) * 0.5);
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

export default function ReactionSetGraphScene() {
  return (
    <figure className="not-prose my-6">
      <div className="overflow-x-auto rounded-[4px] border" style={{ borderColor: "#0F0F0F" }}>
        <div className="relative" style={{ width: 720, height: 410, background: "#242424", backgroundImage: "linear-gradient(#2b2b2b 1px, transparent 1px), linear-gradient(90deg, #2b2b2b 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
          <svg className="pointer-events-none absolute inset-0" width={720} height={410} aria-hidden>
            {WIRES.map(([from, to]) => (
              <path key={`${from}-${to}`} d={wirePath(CARDS[from], CARDS[to])} fill="none" stroke={COLOR.wire} strokeWidth={1.5} />
            ))}
          </svg>
          {CARDS.map((card) => (
            <Card key={card.title} card={card} />
          ))}
        </div>
      </div>
      <figcaption className="mt-2 text-[12px] text-muted-foreground">
        The Reaction Set editor&apos;s own canvas: a Trigger card&apos;s Out pin wired to every Reaction its rule may pick. GuardFrontal can answer with Block or Dodge; GuardSides only ever reaches for Dodge.
      </figcaption>
    </figure>
  );
}

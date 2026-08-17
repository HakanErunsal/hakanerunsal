/**
 * The Action Set editor's actual canvas, redrawn from SEdNode_SECActionNode.cpp
 * and SECActionNodeStyle.cpp (Source/SECEditor/Private/Ed). Same border and
 * body color for an authored card, same per-execution-method chip tint (Tree,
 * Ability), the same disabled-card graying when an action's Enabled box is
 * off, and the same labeled stat rows (Weight, Cooldown, Best range, Scorers,
 * Gates) MakeStatRows() builds. The System doc page explains what each field
 * does; this page shows the canvas they land on, chain link included.
 */
const COLOR = {
  border: "#C6863A",
  body: "#60442A",
  disabledBorder: "#68625A",
  disabledBody: "#403C37",
  title: "#F6F0E6",
  detail: "#F1E6D4",
  statLabel: "#DFD4C4",
  treeChip: "#B85E30",
  abilityChip: "#CA8232",
  wire: "#C6863A",
} as const;

interface StatRow {
  label: string;
  value: string;
}

interface CardSpec {
  chip: "Tree" | "Ability";
  chipColor: string;
  title: string;
  summary: string;
  stats: StatRow[];
  left: number;
  top: number;
  disabled?: boolean;
}

const WIDTH = 220;
const HEIGHT = 140;

const CARDS: CardSpec[] = [
  {
    chip: "Tree",
    chipColor: COLOR.treeChip,
    title: "SingleAttack",
    summary: "BT Sequence (1)",
    stats: [
      { label: "Weight", value: "1" },
      { label: "Cooldown", value: "15s" },
      { label: "Best range", value: "50 to 150 cm" },
      { label: "Scorers", value: "1" },
      { label: "Gates", value: "1" },
    ],
    left: 20,
    top: 20,
  },
  {
    chip: "Ability",
    chipColor: COLOR.abilityChip,
    title: "Dash",
    summary: "Ability: GA_SEC_DodgeBack_C",
    stats: [
      { label: "Weight", value: "1" },
      { label: "Cooldown", value: "15s" },
      { label: "Best range", value: "0 to 150 cm" },
      { label: "Scorers", value: "2" },
    ],
    left: 320,
    top: 20,
  },
  {
    chip: "Tree",
    chipColor: COLOR.treeChip,
    title: "DoubleAttack",
    summary: "BT Sequence (1)",
    stats: [
      { label: "Weight", value: "1" },
      { label: "Cooldown", value: "20s" },
      { label: "Best range", value: "150 to 500 cm" },
      { label: "Scorers", value: "1" },
      { label: "Gates", value: "1" },
    ],
    left: 20,
    top: 200,
  },
  {
    chip: "Tree",
    chipColor: COLOR.treeChip,
    title: "Disabled Action",
    summary: "BT Sequence (1)",
    stats: [
      { label: "Weight", value: "1" },
      { label: "Cooldown", value: "20s" },
      { label: "Best range", value: "250 to 500 cm" },
      { label: "Scorers", value: "2" },
    ],
    left: 320,
    top: 200,
    disabled: true,
  },
];

function Card({ card }: { card: CardSpec }) {
  const border = card.disabled ? COLOR.disabledBorder : COLOR.border;
  const body = card.disabled ? COLOR.disabledBody : COLOR.body;

  return (
    <div
      className="absolute flex flex-col rounded-[3px] px-3 py-2"
      style={{ left: card.left, top: card.top, width: WIDTH, height: HEIGHT, background: body, border: `2px solid ${border}` }}
    >
      <div className="flex items-center gap-2">
        <span className="rounded-[2px] px-1.5 py-0.5 text-[9px] font-bold text-white" style={{ background: card.disabled ? COLOR.disabledBorder : card.chipColor }}>
          {card.chip}
        </span>
        <span className="truncate text-[13px] font-bold" style={{ color: COLOR.title }}>{card.title}</span>
      </div>
      <span className="mt-0.5 truncate text-[10px] italic" style={{ color: COLOR.detail }}>{card.summary}</span>
      <div className="mt-1.5 flex flex-col gap-[2px]">
        {card.stats.map((stat) => (
          <div key={stat.label} className="flex text-[10px] leading-tight">
            <span className="w-[72px] shrink-0" style={{ color: COLOR.statLabel }}>{stat.label}</span>
            <span style={{ color: COLOR.detail }}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function wirePath(from: CardSpec, to: CardSpec) {
  const x1 = from.left + WIDTH;
  const y1 = from.top + HEIGHT / 2;
  const x2 = to.left;
  const y2 = to.top + HEIGHT / 2;
  return `M ${x1} ${y1} L ${x2} ${y2}`;
}

export default function ActionSetGraphScene() {
  return (
    <figure className="not-prose my-6">
      <div className="overflow-x-auto rounded-[4px] border" style={{ borderColor: "#0F0F0F" }}>
        <div className="relative" style={{ width: 560, height: 360, background: "#242424", backgroundImage: "linear-gradient(#2b2b2b 1px, transparent 1px), linear-gradient(90deg, #2b2b2b 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
          <svg className="pointer-events-none absolute inset-0" width={560} height={360} aria-hidden>
            <defs>
              <marker id="actionChainArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill={COLOR.wire} />
              </marker>
            </defs>
            <path d={wirePath(CARDS[0], CARDS[1])} fill="none" stroke={COLOR.wire} strokeWidth={2} markerEnd="url(#actionChainArrow)" />
          </svg>
          {CARDS.map((card) => (
            <Card key={card.title} card={card} />
          ))}
        </div>
      </div>
      <figcaption className="mt-2 text-[12px] text-muted-foreground">
        The Action Set editor&apos;s own canvas. SingleAttack chains into Dash: land the hit, then dash away. DoubleAttack scores independently, and an unchecked Enabled box grays a card out without deleting it.
      </figcaption>
    </figure>
  );
}

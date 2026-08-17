"use client";

import { useSceneClock } from "./ue-editor/useSceneClock";

/**
 * Wiring a combo, animated: drag from Fake Attack's right pin to Quick
 * Attack's left pin, the way "Building a Combo" on the Action Set Editor
 * page describes it.
 * Card look matches ActionSetGraphScene (SEdNode_SECActionNode.cpp colors),
 * kept to title and chip since the teaching point here is the wire, not the
 * stat rows.
 */
const COLOR = {
  border: "#C6863A",
  body: "#60442A",
  title: "#F6F0E6",
  chip: "#B85E30",
  wire: "#C6863A",
  cursor: "#FFFFFF",
  bonus: "#7ED06C",
} as const;

const CARD_WIDTH = 170;
const CARD_HEIGHT = 90;
const LEFT_X = 30;
const RIGHT_X = 360;
const CARD_Y = 35;
const PIN_Y = CARD_Y + CARD_HEIGHT / 2;
const START_X = LEFT_X + CARD_WIDTH;
const END_X = RIGHT_X;

function Card({ x, title }: { x: number; title: string }) {
  return (
    <div
      className="absolute flex flex-col items-start justify-center rounded-[3px] px-3"
      style={{ left: x, top: CARD_Y, width: CARD_WIDTH, height: CARD_HEIGHT, background: COLOR.body, border: `2px solid ${COLOR.border}` }}
    >
      <span className="rounded-[2px] px-1.5 py-0.5 text-[9px] font-bold text-white" style={{ background: COLOR.chip }}>Tree</span>
      <span className="mt-1.5 text-[14px] font-bold" style={{ color: COLOR.title }}>{title}</span>
    </div>
  );
}

export default function ComboWireScene() {
  const durations = [900, 700, 900, 1400];
  const { step, ref } = useSceneClock(durations, 2);

  const cursorX = step === 0 ? START_X : step === 1 ? START_X : END_X;
  const cursorY = PIN_Y;
  const wireVisible = step >= 2;
  const cursorVisible = step >= 1 && step <= 2;
  const bonusVisible = step === 3;

  return (
    <figure ref={ref} className="not-prose my-6">
      <div className="overflow-x-auto rounded-[4px] border" style={{ borderColor: "#0F0F0F" }}>
        <div
          className="relative"
          style={{
            width: 560,
            height: 160,
            background: "#242424",
            backgroundImage: "linear-gradient(#2b2b2b 1px, transparent 1px), linear-gradient(90deg, #2b2b2b 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          <svg className="pointer-events-none absolute inset-0" width={560} height={160} aria-hidden>
            <path
              d={`M ${START_X} ${PIN_Y} L ${END_X} ${PIN_Y}`}
              fill="none"
              stroke={COLOR.wire}
              strokeWidth={2}
              pathLength={100}
              style={{
                strokeDasharray: 100,
                strokeDashoffset: wireVisible ? 0 : 100,
                transition: "stroke-dashoffset 500ms ease",
              }}
            />
          </svg>

          <Card x={LEFT_X} title="Fake Attack" />
          <Card x={RIGHT_X} title="Quick Attack" />

          <div
            className="absolute h-2.5 w-2.5 rounded-full"
            style={{ left: START_X - 5, top: PIN_Y - 5, background: COLOR.wire }}
          />
          <div
            className="absolute h-2.5 w-2.5 rounded-full"
            style={{ left: END_X - 5, top: PIN_Y - 5, background: COLOR.wire }}
          />

          <div
            className="absolute transition-all duration-500 ease-out"
            style={{ left: cursorX, top: cursorY, opacity: cursorVisible ? 1 : 0 }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" style={{ transform: "translate(-2px, -2px)" }} aria-hidden>
              <path d="M2 1 L2 15 L5.5 11.8 L7.8 16.5 L10 15.4 L7.7 10.7 L12 10.4 Z" fill={COLOR.cursor} stroke="#0F0F0F" strokeWidth="0.6" />
            </svg>
          </div>

          <span
            className="absolute text-[12px] font-semibold transition-opacity duration-300"
            style={{
              left: (START_X + END_X) / 2 - 24,
              top: PIN_Y - 26,
              color: COLOR.bonus,
              opacity: bonusVisible ? 1 : 0,
            }}
          >
            x1.5 bonus
          </span>
        </div>
      </div>
      <figcaption className="mt-2 text-[12px] text-muted-foreground">
        Dragging from Fake Attack&apos;s right pin to Quick Attack&apos;s left pin: the feint opens the guard, and Quick Attack gets a score bonus for a short window after.
      </figcaption>
    </figure>
  );
}

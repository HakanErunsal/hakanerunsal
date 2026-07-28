import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { UePanel } from "./UePanel";
import { UeBlueprintGraph } from "./UeBlueprintGraph";
import { UeBlueprintNode } from "./UeBlueprintNode";
import { UE_BP_PIN_SRGB } from "./ue-blueprint-theme";

/**
 * One factor in a product / quotient formula.
 * `op` is the operator applied to this factor (omit / "=" on the base weight).
 */
export interface UeFormulaFactor {
  label: string;
  op?: "×" | "÷";
  /** Optional short note shown under the getter. */
  note?: string;
}

export interface UeFormulaGraphProps {
  title?: string;
  breadcrumb?: string[];
  resultLabel?: string;
  factors: UeFormulaFactor[];
  caption?: ReactNode;
  className?: string;
}

/** Float pin accent for getter pills only — keep wires/hub neutral so the graph is not all green. */
const FLOAT = UE_BP_PIN_SRGB.float;
const WIRE = "rgba(180, 180, 188, 0.45)";
const HUB_FILL = "#242428";
const HUB_STROKE = "#9a9aa0";

/** Larger × / ÷ chip — dark chrome, high-contrast glyph (not the tiny green operator node). */
function FormulaOpChip({ op }: { op: "×" | "÷" }) {
  return (
    <div
      className="flex h-9 w-9 items-center justify-center rounded-md border border-[#4a4a50] shadow-[0_2px_8px_rgba(0,0,0,0.55)]"
      style={{
        background:
          "linear-gradient(180deg, rgba(48,48,54,0.98) 0%, rgba(22,22,26,0.98) 100%)",
      }}
      aria-hidden
    >
      <span className="font-mono text-[20px] font-bold leading-none text-[#f0f0f2]">{op}</span>
    </div>
  );
}

/** Place N points evenly on a circle, starting at top (-90°). */
function polar(cx: number, cy: number, r: number, i: number, n: number) {
  const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
  return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, angle: a };
}

/**
 * Radial Blueprint-style formula graph: factors sit on a ring and wire into
 * a center hub (Final Score). × / ÷ markers sit on each spoke.
 */
export function UeFormulaGraph({
  title = "Final Score",
  breadcrumb,
  resultLabel = "Final Score",
  factors,
  caption,
  className,
}: UeFormulaGraphProps) {
  const n = factors.length;
  const W = 640;
  const H = 420;
  const cx = W / 2;
  const cy = H / 2;
  const hubR = 40;
  const opR = 82;
  const nodeR = 150;

  const spokes = factors.map((factor, i) => {
    const node = polar(cx, cy, nodeR, i, n);
    const op = polar(cx, cy, opR, i, n);
    const inner = polar(cx, cy, hubR + 4, i, n);
    const outer = polar(cx, cy, nodeR - 18, i, n);
    return { factor, node, op, inner, outer };
  });

  return (
    <UePanel
      title={title}
      breadcrumb={breadcrumb}
      assetType="blueprint"
      className={cn("my-6 max-w-[680px]", className)}
      caption={caption}
    >
      <UeBlueprintGraph className="min-h-0" grid bodyClassName="p-3">
        <div className="relative mx-auto w-full" style={{ aspectRatio: `${W} / ${H}`, maxWidth: W }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="absolute inset-0 h-full w-full"
            aria-hidden
          >
            {spokes.map((s, i) => (
              <line
                key={`wire-${i}`}
                x1={s.inner.x}
                y1={s.inner.y}
                x2={s.outer.x}
                y2={s.outer.y}
                stroke={WIRE}
                strokeWidth={1.5}
              />
            ))}

            <circle
              cx={cx}
              cy={cy}
              r={hubR}
              fill={HUB_FILL}
              stroke={HUB_STROKE}
              strokeWidth={1.5}
            />
            <circle
              cx={cx}
              cy={cy}
              r={hubR - 7}
              fill="none"
              stroke={HUB_STROKE}
              strokeWidth={1}
              opacity={0.3}
            />
          </svg>

          <div className="pointer-events-none absolute left-1/2 top-1/2 z-[2] flex w-[84px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center">
            <span className="text-[14px] font-semibold leading-tight text-[#f0f0f2]">
              {resultLabel}
            </span>
          </div>

          {spokes.map((s, i) =>
            s.factor.op ? (
              <div
                key={`op-${i}`}
                className="absolute z-[2] -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${(s.op.x / W) * 100}%`, top: `${(s.op.y / H) * 100}%` }}
              >
                <FormulaOpChip op={s.factor.op} />
              </div>
            ) : null,
          )}

          {spokes.map((s, i) => (
            <div
              key={`node-${i}`}
              className="absolute z-[3] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5"
              style={{ left: `${(s.node.x / W) * 100}%`, top: `${(s.node.y / H) * 100}%` }}
            >
              <UeBlueprintNode
                kind="variable-get"
                title={s.factor.label}
                headerColor={FLOAT}
                className="[&_span.relative]:text-[14px] [&_span.relative]:font-medium [&_span.relative]:text-[#f2f2f2]"
              />
              {s.factor.note && (
                <span className="max-w-[130px] text-center text-[12px] leading-tight text-[#9a9aa0]">
                  {s.factor.note}
                </span>
              )}
            </div>
          ))}
        </div>
      </UeBlueprintGraph>
    </UePanel>
  );
}

/** Verified against ActionSet.h / ActionEvaluationComponent scoring product. */
export const ACTION_SCORE_FACTORS: UeFormulaFactor[] = [
  { label: "Selection Weight" },
  { label: "Risk Penalty", op: "÷" },
  { label: "Tag Multipliers", op: "×" },
  { label: "Novelty", op: "×", note: "Penalizes recent use" },
  { label: "Chain Bonus", op: "×" },
  { label: "Scorers", op: "×", note: "Distance · Angle · Health · Speed · custom" },
  { label: "Runtime Modifiers", op: "×", note: "GlobalMultiplier × SetActionOverride" },
  { label: "Jitter", op: "×", note: "±5%, deterministic" },
];

import { UePanel } from "@/components/ue-editor";
import { UE } from "@/components/ue-editor/ue-theme";

/**
 * Radial distance-comfort-zone diagram, redrawn from the plugin's own picture:
 * SSECMovementProfileDiagram (Source/SECEditor/Private/Movement), the custom
 * OnPaint the Movement Behavior Profile asset editor draws live. Same target-
 * centred rings, same band order and colors, same direction and distance
 * labels and legend. What the live editor adds and this static copy leaves
 * out: zoom, the watched-enemy pip tracking a real target, the threat ring,
 * and the per-angle Positioning Rule lanes, since none of those have a
 * meaning outside a running level. The distance labels sit in their own rows
 * and the enemy pip sits off the label axis, both departures from the
 * editor's own layout made so the picture stays readable at doc width.
 */
interface DistanceBandVisualizerProps {
  desiredDistance?: number;
  tolerance?: number;
  crowdTolerance?: number;
}

/** Movement diagram palette, from SECMovementDiagramColors in SSECMovementProfileDiagram.cpp. */
const DIAGRAM_COLOR = {
  comfort: "#7ED06C",
  warning: "#D6563C",
  easing: "#F2B248",
  label: "#F6F0E6",
  faintLabel: "#DFD4C4",
  targetGlyph: "#969EAC",
  enemy: "#60A8E8",
} as const;

const hex = (color: string, alpha: number) => {
  const a = Math.round(alpha * 255).toString(16).padStart(2, "0");
  return `${color}${a}`;
};

/** Tick spacing climbing a 1, 2, 5 ladder, matching SECMovementDiagramLayout::TickStepFor. */
function tickStepFor(viewRadiusCm: number): number {
  const roughStep = Math.max(viewRadiusCm, 1) / 6;
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const rounded = roughStep / magnitude;
  return magnitude * (rounded >= 5 ? 5 : rounded >= 2 ? 2 : 1);
}

/** Point on a circle, 0 degrees at the top, rising clockwise — matches SSECMovementProfileDiagram's PointAt. */
function pointAt(cx: number, cy: number, radius: number, angleDegrees: number) {
  const radians = (angleDegrees * Math.PI) / 180;
  return { x: cx + radius * Math.sin(radians), y: cy - radius * Math.cos(radians) };
}

/** Ring path between two radii, even-odd filled so the band paints once rather than stacking twice where it overlaps a wider one. */
function annulusPath(cx: number, cy: number, outer: number, inner: number) {
  const disc = (r: number) =>
    `M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} Z`;
  return inner > 0 ? `${disc(outer)} ${disc(inner)}` : disc(outer);
}

/** Chevron sitting on a circle, pointing toward the centre — matches SSECMovementProfileDiagram's DrawChevron. */
function chevronPoints(cx: number, cy: number, radius: number, angleDegrees: number) {
  const depth = 8;
  const halfSpanDegrees = ((6 / radius) * 180) / Math.PI;
  const tipRadius = radius - depth;
  const a = pointAt(cx, cy, radius, angleDegrees - halfSpanDegrees);
  const b = pointAt(cx, cy, tipRadius, angleDegrees);
  const c = pointAt(cx, cy, radius, angleDegrees + halfSpanDegrees);
  return `${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y}`;
}

const metres = (cm: number) => `${(cm / 100).toFixed(1)}m`;

export default function DistanceBandVisualizer({
  desiredDistance = 400,
  tolerance = 0.2,
  crowdTolerance = 0.45,
}: DistanceBandVisualizerProps) {
  const desired = Math.max(desiredDistance, 1);
  const innerTolerance = desired * Math.min(Math.max(crowdTolerance, 0), 1);
  const outerTolerance = desired * Math.min(Math.max(tolerance, 0), 1);

  const innerEdgeCm = Math.max(desired - innerTolerance, 0);
  const outerEdgeCm = desired + outerTolerance;
  const innerSoftEdgeCm = Math.max(desired - innerTolerance * 2, 0);
  const outerSoftEdgeCm = desired + outerTolerance * 2;

  const widestCm = Math.max(outerSoftEdgeCm, 100) * 1.1;
  const stepCm = tickStepFor(widestCm);
  const worldRadiusCm = Math.ceil(widestCm / stepCm) * stepCm;

  const cx = 200;
  const cy = 175;
  const drawRadiusPx = 140;
  const pxPerCm = drawRadiusPx / worldRadiusCm;
  const toPx = (cm: number) => Math.max(cm, 0) * pxPerCm;

  const innerSoftPx = toPx(innerSoftEdgeCm);
  const innerPx = toPx(innerEdgeCm);
  const idealPx = toPx(desired);
  const outerPx = toPx(outerEdgeCm);
  const outerSoftPx = toPx(outerSoftEdgeCm);

  const ticks: number[] = [];
  for (let tick = stepCm; tick <= worldRadiusCm + 1; tick += stepCm) ticks.push(tick);

  // Fifty-five degrees, not the editor's own ninety, keeps the enemy pip off the
  // same row as the distance labels below, which crowd together at any width
  // narrow enough for a website embed.
  const enemySpot = pointAt(cx, cy, idealPx, 55);

  const key = [
    { swatch: DIAGRAM_COLOR.comfort, meaning: "Settles here" },
    { swatch: DIAGRAM_COLOR.easing, meaning: "Eases back into place" },
    { swatch: DIAGRAM_COLOR.warning, meaning: "Too close or too far" },
    { swatch: DIAGRAM_COLOR.enemy, meaning: "The enemy" },
  ];

  return (
    <UePanel
      title="Distance Comfort Zone"
      breadcrumb={["MovementBehaviorProfile"]}
      assetType="dataAsset"
      className="mx-auto max-w-[550px]"
      caption={
        <span>
          Comfort band = <span className="text-[#c8c8c8]">{metres(innerEdgeCm)}</span> to{" "}
          <span className="text-[#c8c8c8]">{metres(outerEdgeCm)}</span>, around a desired{" "}
          {metres(desired)} with Crowd Tolerance {Math.round(crowdTolerance * 100)}% on the near
          side and Distance Tolerance {Math.round(tolerance * 100)}% on the far side. Same rings,
          bands and colors the Movement Behavior Profile editor draws for these three fields,
          spaced out a little further here so the labels stay readable at this size.
        </span>
      }
    >
      <div className="w-full bg-[#1b1b1b] p-2">
        <svg viewBox="0 0 400 380" className="w-full" role="img" aria-label="AI distance comfort zone, drawn as the plugin's own editor draws it">
          <defs>
            {/* Every label sits over a band, a ring, or another label, so each one carries its own dark halo rather than relying on contrast with whatever is behind it. */}
            <filter id="dbTextShadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="1.4" floodColor="#000000" floodOpacity="0.85" />
            </filter>
          </defs>

          {/* Distance graticule */}
          {ticks.map((tick) => (
            <circle key={tick} cx={cx} cy={cy} r={toPx(tick)} fill="none" stroke={hex(DIAGRAM_COLOR.label, 0.09)} strokeWidth={1} />
          ))}

          {/* Too far, then its easing stretch (drawn second, so it double-blends where the two overlap, matching the editor) */}
          <path d={annulusPath(cx, cy, drawRadiusPx, outerPx)} fill={hex(DIAGRAM_COLOR.warning, 0.13)} fillRule="evenodd" />
          <path d={annulusPath(cx, cy, outerSoftPx, outerPx)} fill={hex(DIAGRAM_COLOR.easing, 0.13)} fillRule="evenodd" />

          {/* Too close, then its easing stretch */}
          <path d={annulusPath(cx, cy, innerSoftPx, 0)} fill={hex(DIAGRAM_COLOR.warning, 0.13)} fillRule="evenodd" />
          <path d={annulusPath(cx, cy, innerPx, innerSoftPx)} fill={hex(DIAGRAM_COLOR.easing, 0.13)} fillRule="evenodd" />

          {/* The comfortable band the enemy circles inside */}
          <path d={annulusPath(cx, cy, outerPx, innerPx)} fill={hex(DIAGRAM_COLOR.comfort, 0.2)} fillRule="evenodd" />

          {/* Band edges, with the ideal distance picked out */}
          <circle cx={cx} cy={cy} r={innerPx} fill="none" stroke={hex(DIAGRAM_COLOR.label, 0.5)} strokeWidth={1} />
          <circle cx={cx} cy={cy} r={outerPx} fill="none" stroke={hex(DIAGRAM_COLOR.label, 0.5)} strokeWidth={1} />
          <circle cx={cx} cy={cy} r={idealPx} fill="none" stroke={DIAGRAM_COLOR.comfort} strokeWidth={2} />

          {/* Which way the enemy closes when it is too far out */}
          {[40, 160, 280].map((angle) => (
            <polyline
              key={angle}
              points={chevronPoints(cx, cy, (outerSoftPx + drawRadiusPx) / 2, angle)}
              fill="none"
              stroke={hex(DIAGRAM_COLOR.warning, 0.75)}
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
          ))}

          {/* The target, facing up the screen */}
          <circle cx={cx} cy={cy} r={7} fill={hex(DIAGRAM_COLOR.targetGlyph, 0.9)} />

          {/* The enemy, holding the ideal distance */}
          <circle cx={enemySpot.x} cy={enemySpot.y} r={5} fill={DIAGRAM_COLOR.enemy} />

          {/* Every label, in one group so a single filter shadows them all against the bands and rings underneath */}
          <g filter="url(#dbTextShadow)">
            <text x={cx} y={cy - 7 - 10} textAnchor="middle" fill={DIAGRAM_COLOR.label} fontSize={10} letterSpacing="0.05em">TARGET</text>

            {/* Distance ticks along the target's right, each on its own row so they
                never crowd each other regardless of how narrow the band is */}
            <text x={cx + idealPx} y={cy - 17} textAnchor="middle" fill={DIAGRAM_COLOR.comfort} fontSize={10} fontWeight={600}>{metres(desired)}</text>
            <text x={cx + innerPx} y={cy + 25} textAnchor="middle" fill={DIAGRAM_COLOR.faintLabel} fontSize={9}>{metres(innerEdgeCm)}</text>
            <text x={cx + outerPx} y={cy + 40} textAnchor="middle" fill={DIAGRAM_COLOR.faintLabel} fontSize={9}>{metres(outerEdgeCm)}</text>

            {/* Whose directions these are, named once at the label a reader reaches first */}
            <text x={cx} y={cy - drawRadiusPx - 14} textAnchor="middle" fill={DIAGRAM_COLOR.faintLabel} fontSize={10}>Target forward</text>
            <text x={cx} y={cy + drawRadiusPx + 22} textAnchor="middle" fill={DIAGRAM_COLOR.faintLabel} fontSize={10}>Back</text>
            <text x={cx + drawRadiusPx + 6} y={cy - 12} textAnchor="start" fill={DIAGRAM_COLOR.faintLabel} fontSize={10}>Right</text>
            <text x={cx - drawRadiusPx - 6} y={cy - 12} textAnchor="end" fill={DIAGRAM_COLOR.faintLabel} fontSize={10}>Left</text>
          </g>
        </svg>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 px-2 pb-1">
          {key.map((entry) => (
            <span key={entry.meaning} className="flex items-center gap-1.5">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: hex(entry.swatch, 0.85) }} />
              <span className="text-[11px]" style={{ color: DIAGRAM_COLOR.faintLabel }}>{entry.meaning}</span>
            </span>
          ))}
        </div>
      </div>
    </UePanel>
  );
}

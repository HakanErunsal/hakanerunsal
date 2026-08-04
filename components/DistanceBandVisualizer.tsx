import { UePanel } from "@/components/ue-editor";
import { UE } from "@/components/ue-editor/ue-theme";

/**
 * Linear distance-band gauge for the Movement System doc. Shows the comfort zone
 * around DesiredDistance, which is wider on the crowded side than the far side:
 * Crowd Tolerance sets the near edge, Distance Tolerance the far one. Driven by
 * props so the numbers match whatever the doc states.
 */
interface DistanceBandVisualizerProps {
  desiredDistance?: number;
  tolerance?: number;
  crowdTolerance?: number;
}

const hex = (color: string, alpha: number) => {
  const a = Math.round(alpha * 255).toString(16).padStart(2, "0");
  return `${color}${a}`;
};

export default function DistanceBandVisualizer({
  desiredDistance = 400,
  tolerance = 0.2,
  crowdTolerance = 0.45,
}: DistanceBandVisualizerProps) {
  const nearEdge = Math.round(desiredDistance * (1 - crowdTolerance));
  const farEdge = Math.round(desiredDistance * (1 + tolerance));
  const viewMax = Math.round(desiredDistance * 1.55);

  const X0 = 52;
  const X1 = 566;
  const track = X1 - X0;
  const x = (d: number) => X0 + (Math.min(d, viewMax) / viewMax) * track;

  const bandTop = 64;
  const bandBot = 106;
  const mid = (bandTop + bandBot) / 2;

  const xNear = x(nearEdge);
  const xDes = x(desiredDistance);
  const xFar = x(farEdge);

  const closeMid = (X0 + xNear) / 2;
  const farMid = (xFar + X1) / 2;

  const guide = (gx: number, top: string, sub?: string) => (
    <g key={`${gx}-${top}`}>
      <line x1={gx} y1={bandTop - 8} x2={gx} y2={bandBot + 10} stroke="rgba(255,255,255,0.28)" strokeWidth={1} strokeDasharray="3 3" />
      <text x={gx} y={bandBot + 24} textAnchor="middle" fill={UE.foregroundHeader} fontSize={11} fontFamily="ui-monospace, monospace">{top}</text>
      {sub && <text x={gx} y={bandBot + 36} textAnchor="middle" fill={UE.hover2} fontSize={9}>{sub}</text>}
    </g>
  );

  return (
    <UePanel title="Distance Comfort Zone" breadcrumb={["MovementBehaviorProfile"]} assetType="dataAsset"
      caption={<span>Comfort band = <span className="text-[#c8c8c8]">{nearEdge}</span> to <span className="text-[#c8c8c8]">{farEdge}</span> cm, from a desired {desiredDistance} with Crowd Tolerance {Math.round(crowdTolerance * 100)}% on the near side and Distance Tolerance {Math.round(tolerance * 100)}% on the far side. Inside it the AI circles. Closer than the near edge it gives ground, at a fraction of its walk speed. Past the far edge it closes in.</span>}
    >
      <div className="w-full bg-[#1b1b1b] p-2">
        <svg viewBox="0 0 620 156" className="w-full" role="img" aria-label="AI distance comfort zone gauge">
          <defs>
            <linearGradient id="dbGloss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
              <stop offset="45%" stopColor="rgba(255,255,255,0.02)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
            </linearGradient>
          </defs>

          {/* Zone titles */}
          <text x={closeMid} y={44} textAnchor="middle" fill={UE.error} fontSize={10} letterSpacing="0.08em">CROWDED</text>
          <text x={(xNear + xFar) / 2} y={44} textAnchor="middle" fill={UE.success} fontSize={10} letterSpacing="0.08em">COMFORT ZONE</text>
          <text x={farMid} y={44} textAnchor="middle" fill={UE.primaryHover} fontSize={10} letterSpacing="0.08em">TOO FAR</text>

          {/* Bands */}
          <rect x={X0} y={bandTop} width={xNear - X0} height={bandBot - bandTop} fill={hex(UE.error, 0.16)} stroke={hex(UE.error, 0.55)} strokeWidth={1} rx={3} />
          <rect x={xNear} y={bandTop} width={xFar - xNear} height={bandBot - bandTop} fill={hex(UE.success, 0.16)} stroke={hex(UE.success, 0.6)} strokeWidth={1} rx={3} />
          <rect x={xFar} y={bandTop} width={X1 - xFar} height={bandBot - bandTop} fill={hex(UE.primaryHover, 0.16)} stroke={hex(UE.primaryHover, 0.55)} strokeWidth={1} rx={3} />
          {/* Gloss overlay */}
          <rect x={X0} y={bandTop} width={X1 - X0} height={bandBot - bandTop} fill="url(#dbGloss)" rx={3} pointerEvents="none" />

          {/* Guides and distance labels (under the markers). The desired label drops its text when an
              edge sits close enough to overlap it, since the AI marker already names that spot. */}
          {guide(xNear, String(nearEdge), "near edge")}
          {Math.min(xDes - xNear, xFar - xDes) >= 34
            ? guide(xDes, String(desiredDistance), "desired")
            : guide(xDes, "", undefined)}
          {guide(xFar, String(farEdge), "far edge")}

          {/* Action verbs: crowded gives ground, too far closes in */}
          <text x={closeMid} y={mid + 4} textAnchor="middle" fill="#d7b3ad" fontSize={11}>give ground</text>
          <text x={(xNear + xFar) / 2} y={mid + 20} textAnchor="middle" fill={hex(UE.success, 0.72)} fontSize={11}>circle</text>
          <text x={farMid} y={mid + 4} textAnchor="middle" fill="#a9cbe6" fontSize={11}>close in</text>

          {/* Target at distance 0 */}
          <path d={`M ${X0} ${mid - 7} L ${X0 + 7} ${mid} L ${X0} ${mid + 7} L ${X0 - 7} ${mid} Z`} fill={UE.error} stroke="#ffd9d4" strokeWidth={1} />
          <text x={X0} y={bandBot + 24} textAnchor="middle" fill={UE.hover2} fontSize={9}>target (0)</text>

          {/* AI pawn circling at desired distance */}
          <circle cx={xDes} cy={mid} r={10} fill={UE.primary} stroke="#cfe8ff" strokeWidth={1.5} />
          <text x={xDes} y={mid + 3} textAnchor="middle" fill="#ffffff" fontSize={9} fontWeight={600}>AI</text>

          {/* Farther arrow */}
          <text x={X1 + 14} y={mid + 4} textAnchor="middle" fill={UE.hover2} fontSize={12}>&#8594;</text>
        </svg>
      </div>
    </UePanel>
  );
}

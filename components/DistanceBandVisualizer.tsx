import { UePanel } from "@/components/ue-editor";

/**
 * Linear distance-band gauge for the Movement System doc. Shows the comfort zone
 * around DesiredDistance: an inner approach band, the strafe band, and an outer
 * retreat band. Driven by props so the numbers match whatever the doc states.
 */
interface DistanceBandVisualizerProps {
  desiredDistance?: number;
  tolerance?: number;
}

const RED = "#e0574a";
const GREEN = "#6cc644";
const BLUE = "#0078d4";

export default function DistanceBandVisualizer({
  desiredDistance = 400,
  tolerance = 0.2,
}: DistanceBandVisualizerProps) {
  const optMin = Math.round(desiredDistance * (1 - tolerance));
  const optMax = Math.round(desiredDistance * (1 + tolerance));
  const viewMax = Math.round(desiredDistance * 1.55);

  const X0 = 52;
  const X1 = 566;
  const track = X1 - X0;
  const x = (d: number) => X0 + (Math.min(d, viewMax) / viewMax) * track;

  const bandTop = 64;
  const bandBot = 106;
  const mid = (bandTop + bandBot) / 2;

  const xMin = x(optMin);
  const xDes = x(desiredDistance);
  const xMax = x(optMax);

  const closeMid = (X0 + xMin) / 2;
  const farMid = (xMax + X1) / 2;

  const guide = (gx: number, top: string, sub?: string) => (
    <g key={gx}>
      <line x1={gx} y1={bandTop - 8} x2={gx} y2={bandBot + 10} stroke="rgba(255,255,255,0.28)" strokeWidth={1} strokeDasharray="3 3" />
      <text x={gx} y={bandBot + 24} textAnchor="middle" fill="#c8c8c8" fontSize={11} fontFamily="ui-monospace, monospace">{top}</text>
      {sub && <text x={gx} y={bandBot + 36} textAnchor="middle" fill="#7c7c7c" fontSize={9}>{sub}</text>}
    </g>
  );

  return (
    <UePanel title="Distance Comfort Zone" breadcrumb={["MovementBehaviorProfile"]} assetType="dataAsset"
      caption={<span>Comfort band = <span className="text-[#c8c8c8]">{optMin}</span> to <span className="text-[#c8c8c8]">{optMax}</span> cm (desired {desiredDistance} ±{Math.round(tolerance * 100)}%). Inside it the AI strafes; too close it retreats, too far it approaches.</span>}
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
          <text x={closeMid} y={44} textAnchor="middle" fill={RED} fontSize={10} letterSpacing="0.08em">TOO CLOSE</text>
          <text x={(xMin + xMax) / 2} y={44} textAnchor="middle" fill={GREEN} fontSize={10} letterSpacing="0.08em">COMFORT ZONE</text>
          <text x={farMid} y={44} textAnchor="middle" fill={BLUE} fontSize={10} letterSpacing="0.08em">TOO FAR</text>

          {/* Bands */}
          <rect x={X0} y={bandTop} width={xMin - X0} height={bandBot - bandTop} fill="rgba(224,87,74,0.16)" stroke="rgba(224,87,74,0.55)" strokeWidth={1} rx={3} />
          <rect x={xMin} y={bandTop} width={xMax - xMin} height={bandBot - bandTop} fill="rgba(108,198,68,0.18)" stroke="rgba(108,198,68,0.7)" strokeWidth={1} rx={3} />
          <rect x={xMax} y={bandTop} width={X1 - xMax} height={bandBot - bandTop} fill="rgba(0,120,212,0.16)" stroke="rgba(0,120,212,0.55)" strokeWidth={1} rx={3} />
          {/* Gloss overlay */}
          <rect x={X0} y={bandTop} width={X1 - X0} height={bandBot - bandTop} fill="url(#dbGloss)" rx={3} pointerEvents="none" />

          {/* Guides and distance labels (under the markers) */}
          {guide(xMin, String(optMin), "opt min")}
          {guide(xDes, String(desiredDistance), "desired")}
          {guide(xMax, String(optMax), "opt max")}

          {/* Action verbs: too close backs off, too far closes in */}
          <text x={closeMid} y={mid + 4} textAnchor="middle" fill="#d7b3ad" fontSize={11}>retreat</text>
          <text x={farMid} y={mid + 4} textAnchor="middle" fill="#a9cbe6" fontSize={11}>approach</text>

          {/* Target at distance 0 */}
          <path d={`M ${X0} ${mid - 7} L ${X0 + 7} ${mid} L ${X0} ${mid + 7} L ${X0 - 7} ${mid} Z`} fill={RED} stroke="#ffd9d4" strokeWidth={1} />
          <text x={X0} y={bandBot + 24} textAnchor="middle" fill="#7c7c7c" fontSize={9}>target (0)</text>

          {/* AI pawn strafing at desired distance */}
          <circle cx={xDes} cy={mid} r={10} fill={BLUE} stroke="#cfe8ff" strokeWidth={1.5} />
          <text x={xDes} y={mid + 3} textAnchor="middle" fill="#ffffff" fontSize={9} fontWeight={600}>AI</text>

          {/* Farther arrow */}
          <text x={X1 + 14} y={mid + 4} textAnchor="middle" fill="#7c7c7c" fontSize={12}>&#8594;</text>
        </svg>
      </div>
    </UePanel>
  );
}

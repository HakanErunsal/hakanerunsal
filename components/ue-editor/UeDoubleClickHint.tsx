import { UeAssetTile } from "./UeAssetThumb";
import { UE } from "./ue-theme";

/** Two ripples, the way a double-click reads in a screen recording. */
function DoubleClickCursor() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" className="shrink-0" aria-hidden>
      <circle cx="17" cy="17" r="13" fill="none" stroke={UE.primaryHover} strokeWidth="1.4" opacity="0.35" />
      <circle cx="17" cy="17" r="7" fill="none" stroke={UE.primaryHover} strokeWidth="1.6" opacity="0.6" />
    </svg>
  );
}

/**
 * The moment before a graph scene: the asset's Content Browser tile, a
 * double-click cursor, and an arrow into the canvas that opens. Pairs with
 * ReactionSetGraphScene / ActionSetGraphScene, which show what that canvas
 * actually looks like once it does.
 */
export default function UeDoubleClickHint({
  accent,
  assetName,
}: {
  accent: string;
  assetName: string;
}) {
  return (
    <div className="not-prose my-4 flex items-center justify-center gap-4 rounded-[4px] border p-4" style={{ borderColor: UE.windowBorder, background: UE.background }}>
      <div className="relative">
        <UeAssetTile accent={accent} size={72} name={assetName} typeLabel="" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <DoubleClickCursor />
        </div>
      </div>
      <span className="text-[15px]" style={{ color: UE.hover2 }}>Double-click to open</span>
      <svg width="28" height="14" viewBox="0 0 28 14" aria-hidden>
        <path d="M0 7 H22 M17 2 L22 7 L17 12" fill="none" stroke={UE.hover2} strokeWidth="1.5" />
      </svg>
    </div>
  );
}

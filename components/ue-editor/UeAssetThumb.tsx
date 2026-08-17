import { UE, SEC_ASSET_THUMBNAIL } from "./ue-theme";

/**
 * The asset thumbnail the editor draws in the Content Browser and beside an
 * asset property: a recessed square holding a wheel, with a colored line along
 * the edge where the square meets whatever sits under it.
 */

/**
 * The badge the editor puts at the head of an instanced object picker, on every
 * such property rather than on any one type.
 */
export function UeInstancedObjectIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className="shrink-0" aria-hidden>
      <circle cx="8" cy="8" r="7" fill={UE.recessed} stroke={UE.hover2} strokeWidth="1" />
      <circle cx="8" cy="8" r="3.4" fill="none" stroke={UE.foregroundHeader} strokeWidth="1.4" />
      <path d="M8 1.6 L8 4.4 M8 11.6 L8 14.4" stroke={UE.foregroundHeader} strokeWidth="1.2" />
    </svg>
  );
}

/** The browse-to-asset and use-selected-asset buttons under an asset picker. */
export function UeAssetBrowseButtons() {
  return (
    <span className="flex items-center gap-1" style={{ color: UE.hover2 }}>
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M9.5 5.5 L6.5 8 L9.5 10.5" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M2 4.5 H6.5 L8 6.5 H14 V12.5 H2 Z" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </span>
  );
}

/** The wheel itself, filling the box it is given. */
export function UeAssetWheel({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className="shrink-0" aria-hidden>
      <circle cx="8" cy="8" r="6.2" fill={SEC_ASSET_THUMBNAIL.wheel} />
      <path d="M8 8 L8 1.8 A6.2 6.2 0 0 1 13.4 4.9 Z" fill={SEC_ASSET_THUMBNAIL.slice} />
    </svg>
  );
}

/**
 * A montage's own render thumbnail: a still of the mannequin's first pose,
 * not the generic data-asset wheel. Simplified to a plain humanoid silhouette
 * over the viewport's floor grid.
 */
export function UeMontagePose({ size }: { size: number }) {
  const gridStep = Math.max(Math.round(size / 4), 4);
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{
        background: "#1E1E1E",
        backgroundImage: "linear-gradient(#2A2A2A 1px, transparent 1px), linear-gradient(90deg, #2A2A2A 1px, transparent 1px)",
        backgroundSize: `${gridStep}px ${gridStep}px`,
      }}
    >
      <svg width={Math.round(size * 0.5)} height={Math.round(size * 0.82)} viewBox="0 0 24 34" aria-hidden>
        <circle cx="12" cy="5" r="4" fill="#E8E8E8" />
        <rect x="7" y="10" width="10" height="13" rx="2" fill="#E8E8E8" />
        <rect x="3.5" y="11" width="3.5" height="11" rx="1.5" fill="#E8E8E8" />
        <rect x="17" y="11" width="3.5" height="11" rx="1.5" fill="#E8E8E8" />
        <rect x="8" y="23" width="3.5" height="10" rx="1.5" fill="#E8E8E8" />
        <rect x="12.5" y="23" width="3.5" height="10" rx="1.5" fill="#E8E8E8" />
      </svg>
    </div>
  );
}

/**
 * A StateTree's own icon: a root state branching into its children, not the
 * generic data-asset wheel. A graph asset has no scene to render a still of,
 * so the icon stands in for the shape of the thing rather than a preview.
 */
export function UeStateTreeIcon({ size }: { size: number }) {
  return (
    <svg width={Math.round(size * 0.62)} height={Math.round(size * 0.62)} viewBox="0 0 16 16" aria-hidden>
      <circle cx="8" cy="3" r="2.2" fill="#E8E8E8" />
      <path d="M8 5.2 V8 M8 8 L3.5 8 L3.5 10.3 M8 8 L12.5 8 L12.5 10.3" fill="none" stroke="#898989" strokeWidth="1.2" />
      <circle cx="3.5" cy="12.5" r="2" fill="#E8E8E8" />
      <circle cx="12.5" cy="12.5" r="2" fill="#E8E8E8" />
    </svg>
  );
}

/**
 * Square thumbnail with the type color along its bottom edge. Used on its own
 * beside an asset property, and as the upper half of a Content Browser tile.
 */
export function UeAssetThumbSquare({
  accent,
  size,
  bordered = true,
  showWheel = true,
  variant = "wheel",
}: {
  accent: string;
  size: number;
  /** Off when a tile draws the border around the thumbnail and its label together. */
  bordered?: boolean;
  /** Off for a None reference: an unset asset has no thumbnail to draw. */
  showWheel?: boolean;
  /** A montage renders its own pose and a StateTree its own icon, not the generic data-asset wheel. */
  variant?: "wheel" | "montage" | "tree";
}) {
  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden"
      style={{
        width: size,
        height: size,
        background: UE.recessed,
        border: bordered ? `1px solid ${UE.secondary}` : undefined,
      }}
    >
      {showWheel &&
        (variant === "montage" ? (
          <UeMontagePose size={size} />
        ) : variant === "tree" ? (
          <UeStateTreeIcon size={size} />
        ) : (
          <UeAssetWheel size={Math.round(size * 0.86)} />
        ))}
      <div className="absolute inset-x-0 bottom-0" style={{ height: 2, background: accent }} />
    </div>
  );
}

/**
 * Content Browser tile: the thumbnail, the type color at the boundary, then the
 * name and its type on the lighter block beneath.
 */
export function UeAssetTile({
  accent,
  size,
  name,
  typeLabel,
  renaming,
}: {
  accent: string;
  size: number;
  name: string;
  typeLabel: string;
  /** Shows the caret the editor leaves in the name field on a fresh asset. */
  renaming?: boolean;
}) {
  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ width: size, border: `1px solid ${UE.secondary}` }}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ height: size, background: UE.recessed }}
      >
        <UeAssetWheel size={Math.round(size * 0.58)} />
        <div className="absolute inset-x-0 bottom-0" style={{ height: 2, background: accent }} />
      </div>
      <div
        className="flex flex-col px-1.5 pb-1.5 pt-1"
        style={{ background: UE.secondary, gap: 4 }}
      >
        <span
          className="truncate text-[10px] leading-tight"
          style={{ color: renaming ? UE.foregroundHover : UE.foregroundHeader }}
        >
          {name}
          {renaming && <span className="ml-px animate-pulse">|</span>}
        </span>
        <span className="truncate text-[9px] leading-tight" style={{ color: UE.hover2 }}>
          {typeLabel}
        </span>
      </div>
    </div>
  );
}

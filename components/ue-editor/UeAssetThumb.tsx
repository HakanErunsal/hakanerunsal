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
 * Square thumbnail with the type color along its bottom edge. Used on its own
 * beside an asset property, and as the upper half of a Content Browser tile.
 */
export function UeAssetThumbSquare({
  accent,
  size,
  bordered = true,
}: {
  accent: string;
  size: number;
  /** Off when a tile draws the border around the thumbnail and its label together. */
  bordered?: boolean;
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
      <UeAssetWheel size={Math.round(size * 0.62)} />
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
          className="truncate text-[9px] leading-tight"
          style={{ color: renaming ? UE.foregroundHover : UE.foregroundHeader }}
        >
          {name}
          {renaming && <span className="ml-px animate-pulse">|</span>}
        </span>
        <span className="truncate text-[8px] leading-tight" style={{ color: UE.hover2 }}>
          {typeLabel}
        </span>
      </div>
    </div>
  );
}

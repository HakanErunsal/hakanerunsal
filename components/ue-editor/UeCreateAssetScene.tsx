"use client";

import {
  UE,
  SEC_ASSET_ACCENTS,
  SEC_ASSET_ACCENT_DEFAULT,
  SEC_ASSET_THUMBNAIL,
} from "./ue-theme";
import { getAssetAccent, getAssetTypeLabel } from "./UeAssetIcon";
import type { UeAssetType } from "./ue-theme";
import { UeSceneFrame } from "./UeSceneFrame";
import { useSceneClock } from "./useSceneClock";

/** Every asset the plugin's own factories add under the SEC heading, as the editor lists them. */
const SEC_ASSETS = [
  "Action Set",
  "Awareness Config",
  "Damage Config",
  "Defense Rule Set",
  "Enemy AI Config",
  "Impact Surface Set",
  "Movement Behavior Profile",
  "Reaction Set",
];

/** The categories around SEC in the Content Browser's create menu, in the order the editor lists them. */
const ROOT_MENU = [
  "Live Link",
  "Material",
  "Media",
  "Miscellaneous",
  "Paper2D",
  "Physics",
  "SEC",
  "Texture",
  "Tool Presets",
  "User Interface",
  "World",
];

interface UeCreateAssetSceneProps {
  /** Entry picked under the heading. One of the SEC assets unless submenuItems says otherwise. */
  create: string;
  /** Name the new asset ends up with. */
  assetName: string;
  /** Context menu heading the entry sits under. */
  heading?: string;
  /** Overrides the entries listed under the heading. */
  submenuItems?: string[];
  /** Drives the tile's accent stripe and its type line. */
  assetType?: UeAssetType;
  typeLabel?: string;
  caption?: string;
  width?: number;
}

/** Where the new asset lands, and so where the right-click that creates it happens. */
const TILE = { x: 8, y: 40, size: 84, labelHeight: 32 };
const TILE_CENTER = { x: TILE.x + TILE.size / 2, y: TILE.y + TILE.size / 2 };

/** Menu geometry, matched to the rendered rows so the cursor lands on the highlighted entry. */
const ROW_HEIGHT = 18;
const MENU_PAD = 4;
/** Fixed so the cascade opens flush against the parent's edge whatever the font measures. */
const ROOT_MENU_WIDTH = 118;

function rowTop(top: number, index: number) {
  return top + MENU_PAD + index * ROW_HEIGHT;
}

function rowCenter(top: number, index: number) {
  return rowTop(top, index) + ROW_HEIGHT / 2;
}

/**
 * Steps, in order: rest on the empty spot, right-click, the menu opens, travel
 * to the heading, dwell on it so the cascade opens, travel to the entry, dwell
 * on that, click, the asset appears while the cursor returns to it, then a beat
 * before the loop.
 *
 * Travel and dwell are separate steps because the cursor animates over the
 * length of one step. A combined step would land the pointer exactly as the next
 * thing fired, leaving no hover to see.
 */
const STEP = {
  Rest: 0,
  RightClick: 1,
  MenuOpen: 2,
  ToHeading: 3,
  OnHeading: 4,
  SubmenuOpen: 5,
  ToEntry: 6,
  OnEntry: 7,
  ClickEntry: 8,
  Created: 9,
  Settled: 10,
} as const;

/** Steps that move the pointer run for CURSOR_TRAVEL_MS, matching its transition. */
const CURSOR_TRAVEL_MS = 500;

const DURATIONS = [
  700,
  400,
  450,
  CURSOR_TRAVEL_MS,
  500,
  400,
  CURSOR_TRAVEL_MS,
  300,
  320,
  700,
  1000,
];

/**
 * The thumbnail the editor draws for a SEC asset: a dark tile, a wheel with one
 * slice, and an underline naming the type. Used at menu size beside an entry and
 * again at tile size on the asset the scene creates, so the two agree.
 */
function AssetGlyph({ accent, size }: { accent: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className="shrink-0" aria-hidden>
      <rect width="16" height="16" rx="1" fill={SEC_ASSET_THUMBNAIL.tile} />
      <circle cx="8" cy="7" r="4.6" fill={SEC_ASSET_THUMBNAIL.wheel} />
      <path d="M8 7 L8 2.4 A4.6 4.6 0 0 1 11.95 4.7 Z" fill={SEC_ASSET_THUMBNAIL.slice} />
      <rect x="0" y="13" width="16" height="3" fill={accent} />
    </svg>
  );
}

function Cursor({ x, y }: { x: number; y: number }) {
  return (
    <svg
      className="pointer-events-none absolute z-30 transition-all duration-500 ease-in-out"
      style={{ left: x, top: y }}
      width="13"
      height="17"
      viewBox="0 0 14 18"
      aria-hidden
    >
      <path
        d="M1 1 L1 14 L4.5 10.5 L7 16 L9.5 15 L7 9.5 L12 9.5 Z"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="1"
      />
    </svg>
  );
}

/** Ring marking a press. Sits above the menus so a click on an entry still reads. */
function ClickRing({ x, y }: { x: number; y: number }) {
  return (
    <span
      className="pointer-events-none absolute z-[25] h-6 w-6 rounded-full"
      style={{ left: x - 12, top: y - 12, border: `1px solid ${UE.primary}` }}
    />
  );
}

function Menu({
  items,
  active,
  x,
  y,
  cascades,
  glyphs,
  width,
}: {
  items: string[];
  active: string;
  x: number;
  y: number;
  cascades?: boolean;
  glyphs?: boolean;
  width?: number;
}) {
  return (
    <div
      className="absolute z-20 rounded-[2px] border shadow-[0_4px_14px_rgba(0,0,0,0.65)]"
      style={{
        left: x,
        top: y,
        width,
        paddingTop: MENU_PAD,
        paddingBottom: MENU_PAD,
        borderColor: UE.windowBorder,
        background: UE.panel,
      }}
    >
      {items.map((item) => {
        const on = item === active;
        return (
          <div
            key={item}
            className="flex items-center justify-between gap-3 whitespace-nowrap px-2 text-[10px]"
            style={{
              height: ROW_HEIGHT,
              background: on ? UE.primary : "transparent",
              color: on ? "#FFFFFF" : UE.foreground,
            }}
          >
            <span className="flex items-center gap-1.5">
              {glyphs && (
                <AssetGlyph
                  accent={SEC_ASSET_ACCENTS[item] ?? SEC_ASSET_ACCENT_DEFAULT}
                  size={13}
                />
              )}
              {item}
            </span>
            {cascades && <span style={{ color: on ? "#FFFFFF" : UE.hover2 }}>›</span>}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Right-click in the Content Browser through to a named asset on disk. One scene
 * stands in for the create step of a quick start.
 */
export default function UeCreateAssetScene({
  create,
  assetName,
  heading = "SEC",
  submenuItems = SEC_ASSETS,
  assetType = "dataAsset",
  typeLabel,
  caption,
  width = 400,
}: UeCreateAssetSceneProps) {
  // Reduced motion rests on the open cascade, which is the frame that shows both
  // menus and names the entry to pick.
  const { step, ref } = useSceneClock(DURATIONS, STEP.OnEntry);

  const headingIndex = Math.max(ROOT_MENU.indexOf(heading), 0);
  const createIndex = Math.max(submenuItems.indexOf(create), 0);

  const menuOpen = step >= STEP.MenuOpen && step <= STEP.ClickEntry;
  const submenuOpen = step >= STEP.SubmenuOpen && step <= STEP.ClickEntry;
  const tileShown = step >= STEP.Created;
  const renaming = step === STEP.Created;

  // The cascade opens level with the heading it comes from.
  const submenuTop = rowTop(TILE_CENTER.y, headingIndex) - MENU_PAD;
  const submenuLeft = TILE_CENTER.x + ROOT_MENU_WIDTH;

  const headingPoint = {
    x: TILE_CENTER.x + 30,
    y: rowCenter(TILE_CENTER.y, headingIndex),
  };
  const entryPoint = {
    x: submenuLeft + 26,
    y: rowCenter(submenuTop, createIndex),
  };

  const cursor =
    step >= STEP.ToHeading && step <= STEP.SubmenuOpen
      ? headingPoint
      : step >= STEP.ToEntry && step <= STEP.ClickEntry
        ? entryPoint
        : TILE_CENTER;

  // A row highlights only once the pointer has finished travelling to it, so the
  // highlight follows the cursor rather than leading it.
  const headingActive = step >= STEP.OnHeading ? heading : "";
  const entryActive = step >= STEP.OnEntry ? create : "";

  // The tile is underlined in the same color the menu drew beside the entry.
  const accent = SEC_ASSET_ACCENTS[create] ?? getAssetAccent(assetType);
  const label = typeLabel ?? getAssetTypeLabel(assetType);

  return (
    <UeSceneFrame title="Content Browser" caption={caption} width={width} height={380} frameRef={ref}>
      <div className="absolute inset-0 overflow-hidden p-2" style={{ background: UE.recessed }}>
        <div
          className="flex items-center gap-1 rounded-[2px] px-1.5 py-1 text-[9px]"
          style={{ background: UE.panel, color: UE.hover2 }}
        >
          <span style={{ color: UE.accentFolder }}>▸</span> Content
        </div>

        {tileShown && (
          <div
            className="absolute flex flex-col overflow-hidden rounded-[2px]"
            style={{ left: TILE.x, top: TILE.y, width: TILE.size }}
          >
            <div
              className="relative flex items-center justify-center"
              style={{ height: TILE.size, background: UE.input }}
            >
              <AssetGlyph accent={accent} size={44} />
            </div>
            <div
              className="flex flex-col justify-center px-1 py-1"
              style={{ height: TILE.labelHeight, background: renaming ? UE.selectInactive : UE.panel }}
            >
              <span
                className="truncate text-[9px] leading-tight"
                style={{ color: UE.foregroundHeader }}
              >
                {assetName}
                {renaming && <span className="ml-px animate-pulse">|</span>}
              </span>
              <span className="truncate text-[7px] leading-tight" style={{ color: UE.hover2 }}>
                {label}
              </span>
            </div>
          </div>
        )}

        {step === STEP.RightClick && <ClickRing x={TILE_CENTER.x} y={TILE_CENTER.y} />}
        {step === STEP.ClickEntry && <ClickRing x={entryPoint.x} y={entryPoint.y} />}

        {menuOpen && (
          <Menu
            items={ROOT_MENU}
            active={headingActive}
            x={TILE_CENTER.x}
            y={TILE_CENTER.y}
            width={ROOT_MENU_WIDTH}
            cascades
          />
        )}

        {submenuOpen && (
          <Menu items={submenuItems} active={entryActive} x={submenuLeft} y={submenuTop} glyphs />
        )}

        <Cursor x={cursor.x} y={cursor.y} />
      </div>
    </UeSceneFrame>
  );
}

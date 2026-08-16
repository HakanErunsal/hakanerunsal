"use client";

import { UE } from "./ue-theme";
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

const CURSOR_REST = { x: 300, y: 300 };
const CURSOR_CLICK = { x: 36, y: 44 };

/** Menu geometry, matched to the rendered rows so the cursor lands on the highlighted entry. */
const ROW_HEIGHT = 20;
const MENU_PAD = 4;
/** Fixed so the cascade opens flush against the parent's edge whatever the font measures. */
const ROOT_MENU_WIDTH = 118;

function rowTop(top: number, index: number) {
  return top + MENU_PAD + index * ROW_HEIGHT;
}

function rowCenter(top: number, index: number) {
  return rowTop(top, index) + ROW_HEIGHT / 2;
}

/** The pie-wedge thumbnail the editor draws beside a data asset entry. */
function AssetGlyph() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" className="shrink-0" aria-hidden>
      <circle cx="8" cy="8" r="7" fill={UE.dataAsset} />
      <path d="M8 8 L8 1 A7 7 0 0 1 14.5 5.5 Z" fill={UE.background} opacity="0.55" />
    </svg>
  );
}

function Cursor({ x, y }: { x: number; y: number }) {
  return (
    <svg
      className="pointer-events-none absolute z-30 transition-all duration-500 ease-out"
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
              {glyphs && <AssetGlyph />}
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
  const { step, ref } = useSceneClock([1100, 450, 1400, 1700, 800, 1900]);

  const menuOpen = step >= 2 && step <= 3;
  const submenuOpen = step === 3;
  const tileShown = step >= 4;
  const renaming = step === 4;

  const headingIndex = Math.max(ROOT_MENU.indexOf(heading), 0);
  const createIndex = Math.max(submenuItems.indexOf(create), 0);

  // The submenu opens level with the heading it cascades from.
  const submenuTop = rowTop(CURSOR_CLICK.y, headingIndex) - MENU_PAD;
  const submenuLeft = CURSOR_CLICK.x + ROOT_MENU_WIDTH;

  const cursor =
    step === 0
      ? CURSOR_REST
      : step === 2
        ? { x: CURSOR_CLICK.x + 30, y: rowCenter(CURSOR_CLICK.y, headingIndex) }
        : step === 3
          ? { x: submenuLeft + 26, y: rowCenter(submenuTop, createIndex) }
          : CURSOR_CLICK;

  const accent = getAssetAccent(assetType);
  const label = typeLabel ?? getAssetTypeLabel(assetType);

  return (
    <UeSceneFrame title="Content Browser" caption={caption} width={width} height={352} frameRef={ref}>
      <div className="absolute inset-0 overflow-hidden p-2" style={{ background: UE.recessed }}>
        <div
          className="mb-2 flex items-center gap-1 rounded-[2px] px-1.5 py-1 text-[9px]"
          style={{ background: UE.panel, color: UE.hover2 }}
        >
          <span style={{ color: UE.accentFolder }}>▸</span> Content
        </div>

        {tileShown && (
          <div className="flex w-[84px] flex-col overflow-hidden rounded-[2px]">
            <div
              className="relative flex aspect-square items-center justify-center"
              style={{ background: UE.input }}
            >
              <svg width="32" height="32" viewBox="0 0 16 16" aria-hidden>
                <rect x="1" y="1" width="14" height="13" rx="1" fill={UE.panel} stroke={UE.secondary} />
              </svg>
              <div className="absolute inset-x-0 bottom-0 h-[2px]" style={{ background: accent }} />
            </div>
            <div
              className="flex min-h-[32px] flex-col justify-center px-1 py-1"
              style={{ background: renaming ? UE.selectInactive : UE.panel }}
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

        {step === 1 && (
          <span
            className="absolute z-10 h-6 w-6 rounded-full"
            style={{
              left: CURSOR_CLICK.x - 12,
              top: CURSOR_CLICK.y - 12,
              border: `1px solid ${UE.primary}`,
            }}
          />
        )}

        {menuOpen && (
          <Menu
            items={ROOT_MENU}
            active={heading}
            x={CURSOR_CLICK.x}
            y={CURSOR_CLICK.y}
            width={ROOT_MENU_WIDTH}
            cascades
          />
        )}

        {submenuOpen && (
          <Menu items={submenuItems} active={create} x={submenuLeft} y={submenuTop} glyphs />
        )}

        <Cursor x={cursor.x} y={cursor.y} />
      </div>
    </UeSceneFrame>
  );
}

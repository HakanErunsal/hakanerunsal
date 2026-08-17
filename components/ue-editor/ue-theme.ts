import { cn } from "@/lib/utils";

/**
 * Action Set card colors, from SECCardColors in SEdNode_SECActionNode.cpp.
 * These are the plugin's own graph-editor colors rather than engine palette
 * entries, so a component showing card states matches an editor screenshot.
 */
export const SEC_CARD = {
  runningBorder: "rgb(126, 208, 108)",
  runningBody: "rgb(54, 92, 48)",
  winnerBorder: "rgb(242, 178, 72)",
  winnerBody: "rgb(118, 82, 40)",
  cooldownBorder: "rgb(146, 106, 48)",
  cooldownBody: "rgb(72, 54, 34)",
  vetoedBorder: "rgb(112, 78, 72)",
  vetoedBody: "rgb(52, 42, 40)",
  disabledBorder: "rgb(104, 98, 90)",
  disabledBody: "rgb(64, 60, 55)",
} as const;

/**
 * Marker colors SEC.Debug.Stimulus.Draw paints in the world, from the FColor
 * values in SECStimulusDebug.cpp. Engine FColor constants resolved against
 * Engine/Source/Runtime/Core/Private/Math/Color.cpp, so a legend on the page
 * reads the same as a screenshot of the running game.
 */
export const SEC_STIMULUS_DEBUG = {
  /** FColor::Orange, the announcement itself: reach, arc, facing. */
  broadcast: "#F39C12",
  /** FColor::Silver */
  teamFiltered: "#BDC3C7",
  /** FColor(70, 130, 255) */
  outsideArc: "#4682FF",
  /** FColor::Magenta */
  noticeRollFailed: "#FF00FF",
  /** FColor::Red */
  perceptionFiltered: "#FF0000",
  /** FColor::Yellow */
  noReaction: "#FFFF00",
  /** FColor::Green */
  reacted: "#00FF00",
  /** FColor::Cyan */
  listenerOnly: "#00FFFF",
  /** FColor::White */
  noReceiver: "#FFFFFF",
} as const;

/**
 * The Content Browser thumbnail for a SEC asset: a dark tile, a white wheel with
 * a grey slice, and an underline whose color names the asset type. Sampled from
 * the editor, so a mock of that menu matches a screenshot of it.
 */
export const SEC_ASSET_THUMBNAIL = {
  tile: "#151515",
  wheel: "#FFFFFF",
  slice: "#898989",
} as const;

/** Underline color per SEC asset, keyed by the name the create menu lists. */
export const SEC_ASSET_ACCENTS: Record<string, string> = {
  "Action Set": "#7890B8",
  "Awareness Config": "#C91D55",
  "Damage Config": "#C91D55",
  "Defense Rule Set": "#C91D55",
  "Enemy AI Config": "#C91D55",
  "Impact Surface Set": "#C91D55",
  "Movement Behavior Profile": "#60A884",
  "Reaction Set": "#966CB0",
};

/** Underline for an asset the map does not name. */
export const SEC_ASSET_ACCENT_DEFAULT = "#C91D55";

/**
 * UE 5.8 Starship StyleColors — from
 * Engine/Source/Runtime/SlateCore/Private/Styling/StyleColors.cpp
 */
export const UE = {
  background: "#151515",
  title: "#151515",
  windowBorder: "#0F0F0F",
  input: "#0F0F0F",
  recessed: "#1A1A1A",
  panel: "#242424",
  header: "#2F2F2F",
  secondary: "#383838",
  dropdownOutline: "#4C4C4C",
  hover: "#575757",
  hover2: "#808080",
  foreground: "#C0C0C0",
  foregroundHeader: "#C8C8C8",
  /** StyleColors ForegroundHover. Text and glyphs at full brightness: selection text, checkbox check, exec pins. */
  foregroundHover: "#FFFFFF",
  primary: "#0070E0",
  primaryHover: "#0E86FF",
  selectInactive: "#40576F",
  selectParent: "#2C323A",
  selectHover: "#242424",
  accentBlue: "#26BBFF",
  accentFolder: "#B68F55",
  warning: "#FFB800",
  error: "#EF3535",
  success: "#1FE44B",
  /** AssetDefinition_DataAsset.h — FColor(201, 29, 85) */
  dataAsset: "#C91D55",
  /** AssetDefinition_Blueprint.h — FColor(63, 126, 255) */
  blueprint: "#3F7EFF",
  /** AssetDefinition_AnimMontage.h — FColor(100, 100, 255) */
  animMontage: "#6464FF",
  /** BehaviorTreeEditor's AssetDefinition_BehaviorTree.cpp — FColor(149, 70, 255) */
  behaviorTree: "#9546FF",
  /** AssetDefinition_Curve.h, inherited by UAssetDefinition_CurveFloat — FColor(78, 40, 165) */
  curveFloat: "#4E28A5",
} as const;

/**
 * Kit colors with no StyleColors entry. Each value names where it came from.
 *
 * Values consumed by styles/ue-editor.css appear verbatim in the :root block
 * there; `npm run check:colors` reports any that disagree.
 */
export const UE_KIT = {
  /** Tag name text in a gameplay tag container. Reading affordance with no engine counterpart. */
  gameplayTagText: "#7EC8E3",
  /** AssetDefinition_StateTree.cpp GetAssetColor() — FColor(201, 185, 29) */
  stateTreeAsset: "#C9B91D",
  /** Object pin color. Fallback when a graph leaves --pin-color or --pill-color unset. */
  pinFallback: "#0066E8",
  /** Selection outline glow on a graph node. */
  bpSelectionGlow: "rgba(255, 170, 0, 0.6)",
  /** Outer bloom on an active node, primary at low alpha. */
  primaryGlow: "rgba(0, 112, 224, 0.3)",
  /**
   * Comment box on a graph: secondary at 60 percent and foreground at 90.
   * Carried as full values because Tailwind drops an alpha modifier applied to
   * a var() color, emitting no rule at all.
   */
  bpCommentBorder: "rgba(56, 56, 56, 0.6)",
  bpCommentTitle: "rgba(192, 192, 192, 0.9)",
  /** Content Browser folder icon gradient, shading either side of accentFolder. */
  folderTop: "#A08860",
  folderBottom: "#6B5A3E",
  folderTabTop: "#B09870",
  folderTabBottom: "#8B7155",
} as const;

export const UE_NODE_HEADERS = {
  event: "#B04600",
  function: "#00549E",
  component: "#006633",
  dataAsset: "#C91D55",
  variable: "#006633",
  flow: "#00549E",
  state: "#4A2C7A",
  task: "#00549E",
  gate: "#8B6914",
  scorer: "#00549E",
  reaction: "#6B2D8B",
  action: "#006633",
  movement: "#00549E",
  threat: "#B04600",
  role: "#8B0000",
  target: "#00549E",
  ability: "#006633",
  default: "#404045",
} as const;

export type UeAssetType =
  | "blueprint"
  | "component"
  | "dataAsset"
  | "statetree"
  | "visualizer"
  | "output"
  | "ability";

export type UeNodeCategory = keyof typeof UE_NODE_HEADERS;

export function uePanel(className?: string) {
  return cn(
    "my-8 overflow-hidden rounded-[4px] border border-[color:var(--uekit-window-border)] bg-[color:var(--uekit-background)] shadow-[0_2px_8px_rgba(0,0,0,0.5)]",
    className,
  );
}

export function uePanelBody(className?: string) {
  return cn("bg-[color:var(--uekit-background)] p-2 sm:p-3", className);
}

export function ueSectionLabel(className?: string) {
  return cn("text-[10px] font-normal uppercase tracking-wide text-[color:var(--uekit-hover2)]", className);
}

export function ueCaption(className?: string) {
  return cn("text-[10px] text-[color:var(--uekit-hover2)]", className);
}

export function ueViewport(className?: string) {
  return cn(
    "relative overflow-hidden rounded-[4px] border-2 border-[color:var(--uekit-secondary)] bg-[color:var(--uekit-recessed)]",
    className,
  );
}

export function ueStatusBar(active?: boolean, className?: string) {
  return cn(
    "flex items-center gap-2 border px-2 py-1 font-mono text-[11px]",
    active
      ? "border-[color:var(--uekit-primary)] bg-[color:var(--uekit-select-inactive)] text-[color:var(--uekit-foreground)]"
      : "border-[color:var(--uekit-secondary)] bg-[color:var(--uekit-recessed)] text-[color:var(--uekit-hover2)]",
    className,
  );
}

export function ueFlowNode(active: boolean, _headerColor: string, className?: string) {
  return cn(
    "overflow-hidden rounded-[2px] border transition-all duration-500",
    active
      ? "border-[color:var(--uekit-primary)] shadow-[0_0_0_1px_var(--uekit-primary)]"
      : "border-[color:var(--uekit-secondary)] opacity-75",
    className,
  );
}

export function ueFlowNodeHeader(active: boolean, headerColor: string) {
  return cn(
    "flex items-center gap-2 px-2 py-1 text-[11px] font-normal text-white",
    active ? "brightness-110" : "brightness-90",
  );
}

export function ueFlowNodeBody(active: boolean) {
  return cn("bg-[color:var(--uekit-panel)] px-2 py-1.5", active ? "text-[color:var(--uekit-foreground)]" : "text-[color:var(--uekit-hover2)]");
}

export function uePropertyRow(_even?: boolean, className?: string) {
  return cn("ue-dp-row flex min-h-[30px] items-center text-[11px]", className);
}

export function ueButton(active?: boolean, className?: string) {
  return cn(
    "inline-flex items-center gap-1 rounded-[2px] border px-2 py-0.5 text-[11px] transition-colors",
    active
      ? "border-[color:var(--uekit-primary)] bg-[color:var(--uekit-select-inactive)] text-[color:var(--uekit-foreground)]"
      : "border-[color:var(--uekit-secondary)] bg-[color:var(--uekit-panel)] text-[color:var(--uekit-foreground)] hover:bg-[color:var(--uekit-secondary)]",
    className,
  );
}

export function ueSelect(className?: string) {
  return cn(
    "rounded-full border border-[color:var(--uekit-secondary)] bg-[color:var(--uekit-window-border)] px-2.5 py-0.5 text-[11px] text-[color:var(--uekit-foreground)] outline-none focus:border-[color:var(--uekit-primary)]",
    className,
  );
}

export function ueChip(_active: boolean, _done: boolean, className?: string) {
  return cn("flex items-center gap-1.5 text-[11px] transition-all duration-300", className);
}

export function ueListCard(shown: boolean, _accentBorder: string, dashed?: boolean, className?: string) {
  return cn(
    "transition-all duration-700 ease-out",
    dashed && "opacity-90",
    shown ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0",
    className,
  );
}

export function ueConnector(active: boolean) {
  return cn(
    "mx-auto h-5 w-px transition-all duration-500",
    active ? "bg-[color:var(--uekit-primary)]" : "bg-[color:var(--uekit-secondary)]",
  );
}

export function ueDetailsPanel(className?: string) {
  return cn("overflow-hidden rounded-[2px] border border-[color:var(--uekit-window-border)] bg-[color:var(--uekit-background)]", className);
}

export function ueConsole(className?: string) {
  return cn(
    "overflow-x-auto border border-[color:var(--uekit-secondary)] bg-[color:var(--uekit-recessed)] p-2 font-mono text-[11px] text-[color:var(--uekit-foreground)]",
    className,
  );
}

export function uePanelHeader(className?: string) {
  return cn("flex items-center justify-between gap-3 border-b border-[color:var(--uekit-window-border)] bg-[color:var(--uekit-recessed)] px-2 py-1", className);
}

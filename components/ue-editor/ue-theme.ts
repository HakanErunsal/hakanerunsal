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
    "my-8 overflow-hidden rounded-[4px] border border-[#0F0F0F] bg-[#151515] shadow-[0_2px_8px_rgba(0,0,0,0.5)]",
    className,
  );
}

export function uePanelBody(className?: string) {
  return cn("bg-[#151515] p-2 sm:p-3", className);
}

export function ueSectionLabel(className?: string) {
  return cn("text-[10px] font-normal uppercase tracking-wide text-[#808080]", className);
}

export function ueCaption(className?: string) {
  return cn("text-[10px] text-[#808080]", className);
}

export function ueViewport(className?: string) {
  return cn(
    "relative overflow-hidden rounded-[4px] border-2 border-[#383838] bg-[#1A1A1A]",
    className,
  );
}

export function ueStatusBar(active?: boolean, className?: string) {
  return cn(
    "flex items-center gap-2 border px-2 py-1 font-mono text-[11px]",
    active
      ? "border-[#0070E0] bg-[#40576F] text-[#C0C0C0]"
      : "border-[#383838] bg-[#1A1A1A] text-[#808080]",
    className,
  );
}

export function ueFlowNode(active: boolean, _headerColor: string, className?: string) {
  return cn(
    "overflow-hidden rounded-[2px] border transition-all duration-500",
    active ? "border-[#0070E0] shadow-[0_0_0_1px_#0070E0]" : "border-[#383838] opacity-75",
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
  return cn("bg-[#242424] px-2 py-1.5", active ? "text-[#C0C0C0]" : "text-[#808080]");
}

export function uePropertyRow(_even?: boolean, className?: string) {
  return cn(
    "ue-property-row flex min-h-[28px] items-stretch border-b border-[#0F0F0F] text-[11px] last:border-b-0",
    className,
  );
}

export function ueButton(active?: boolean, className?: string) {
  return cn(
    "inline-flex items-center gap-1 rounded-[2px] border px-2 py-0.5 text-[11px] transition-colors",
    active
      ? "border-[#0070E0] bg-[#40576F] text-[#C0C0C0]"
      : "border-[#383838] bg-[#242424] text-[#C0C0C0] hover:bg-[#383838]",
    className,
  );
}

export function ueSelect(className?: string) {
  return cn(
    "rounded-full border border-[#383838] bg-[#0F0F0F] px-2.5 py-0.5 text-[11px] text-[#C0C0C0] outline-none focus:border-[#0070E0]",
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
    active ? "bg-[#0070E0]" : "bg-[#383838]",
  );
}

export function ueDetailsPanel(className?: string) {
  return cn("overflow-hidden rounded-[2px] border border-[#0F0F0F] bg-[#151515]", className);
}

export function ueConsole(className?: string) {
  return cn(
    "overflow-x-auto border border-[#383838] bg-[#1A1A1A] p-2 font-mono text-[11px] text-[#C0C0C0]",
    className,
  );
}

export function uePanelHeader(className?: string) {
  return cn("flex items-center justify-between gap-3 border-b border-[#0F0F0F] bg-[#1A1A1A] px-2 py-1", className);
}

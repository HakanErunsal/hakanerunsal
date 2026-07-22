/**
 * UE 5.8 Blueprint graph colors — GraphEditorSettings.cpp defaults.
 * FLinearColor values converted to sRGB hex.
 */

function linearToHex(r: number, g: number, b: number): string {
  const byte = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${byte(r)}${byte(g)}${byte(b)}`;
}

/** Gamma-correct a linear channel to sRGB (what UE actually displays). */
function linearChannelToSrgb(c: number): number {
  const v = Math.min(1, Math.max(0, c));
  return v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
}

/** FLinearColor → sRGB hex, matching UE editor display (used for pin/pill icons). */
function linearToSrgbHex(r: number, g: number, b: number): string {
  return linearToHex(linearChannelToSrgb(r), linearChannelToSrgb(g), linearChannelToSrgb(b));
}

/** Official Blueprint node title colors */
export const UE_BP_TITLE = {
  event: linearToHex(1, 0, 0),
  function: linearToHex(0.190525, 0.583898, 1),
  pure: linearToHex(0.4, 0.85, 0.35),
  parentFunction: linearToHex(1, 0.17, 0),
  terminator: linearToHex(0.6, 0, 1),
  branch: linearToHex(1, 1, 1),
  sequence: linearToHex(0.8, 0.4, 0.4),
  result: linearToHex(1, 0.65, 0.4),
  comment: linearToHex(0.15, 0.15, 0.15),
} as const;

/** Official pin / wire type colors */
export const UE_BP_PIN = {
  exec: linearToHex(1, 1, 1),
  bool: linearToHex(0.3, 0, 0),
  byte: linearToHex(0, 0.16, 0.13127),
  int: linearToHex(0.013575, 0.77, 0.429609),
  int64: linearToHex(0.413575, 0.77, 0.429609),
  float: linearToHex(0.357667, 1, 0.06),
  double: linearToHex(0.039216, 0.666667, 0),
  name: linearToHex(0.607717, 0.224984, 1),
  string: linearToHex(1, 0, 0.660537),
  text: linearToHex(0.8, 0.2, 0.4),
  object: linearToHex(0, 0.4, 0.91),
  class: linearToHex(0.1, 0, 0.5),
  interface: linearToHex(0.8784, 1, 0.4),
  struct: linearToHex(0, 0.1, 0.6),
  vector: linearToHex(1, 0.591255, 0.016512),
  rotator: linearToHex(0.353393, 0.454175, 1),
  transform: linearToHex(1, 0.172585, 0),
  delegate: linearToHex(1, 0.04, 0.04),
  wildcard: linearToHex(0.22, 0.1958, 0.1958),
  default: linearToHex(0.75, 0.6, 0.4),
} as const;

export type UePinType = keyof typeof UE_BP_PIN;

export type UeBlueprintNodeKind =
  | "function"
  | "pure"
  | "event"
  | "struct"
  | "break-struct"
  | "make-struct"
  | "variable-get"
  | "variable-set"
  | "branch"
  | "sequence"
  | "operator"
  | "macro"
  | "custom";

/** Resolve header color from node kind */
export function getBlueprintTitleColor(kind: UeBlueprintNodeKind): string {
  switch (kind) {
    case "pure":
    case "operator":
      return UE_BP_TITLE.pure;
    case "event":
      return UE_BP_TITLE.event;
    case "struct":
    case "break-struct":
    case "make-struct":
      return UE_BP_PIN.struct;
    case "branch":
      return UE_BP_TITLE.branch;
    case "sequence":
      return UE_BP_TITLE.sequence;
    case "variable-get":
    case "variable-set":
      return UE_BP_PIN.object;
    case "function":
    case "macro":
    default:
      return UE_BP_TITLE.function;
  }
}

export function getPinColor(type: UePinType): string {
  return UE_BP_PIN[type];
}

/**
 * Gamma-corrected sRGB pin colors — match UE's My Blueprint type pill display.
 * (Pill icons are drawn at full brightness, unlike node headers which UE darkens.)
 */
export const UE_BP_PIN_SRGB = {
  exec: linearToSrgbHex(1, 1, 1),
  bool: linearToSrgbHex(0.3, 0, 0),
  byte: linearToSrgbHex(0, 0.16, 0.13127),
  int: linearToSrgbHex(0.013575, 0.77, 0.429609),
  int64: linearToSrgbHex(0.413575, 0.77, 0.429609),
  float: linearToSrgbHex(0.357667, 1, 0.06),
  double: linearToSrgbHex(0.039216, 0.666667, 0),
  name: linearToSrgbHex(0.607717, 0.224984, 1),
  string: linearToSrgbHex(1, 0, 0.660537),
  text: linearToSrgbHex(0.8, 0.2, 0.4),
  object: linearToSrgbHex(0, 0.4, 0.91),
  class: linearToSrgbHex(0.1, 0, 0.5),
  interface: linearToSrgbHex(0.8784, 1, 0.4),
  struct: linearToSrgbHex(0, 0.1, 0.6),
  vector: linearToSrgbHex(1, 0.591255, 0.016512),
  rotator: linearToSrgbHex(0.353393, 0.454175, 1),
  transform: linearToSrgbHex(1, 0.172585, 0),
  delegate: linearToSrgbHex(1, 0.04, 0.04),
  wildcard: linearToSrgbHex(0.22, 0.1958, 0.1958),
  default: linearToSrgbHex(0.75, 0.6, 0.4),
} as const;

/** My Blueprint variable types — component uses object pin color (instanced ActorComponent) */
export type UeVariableType = UePinType | "component";

export function getVariableTypeColor(type: UeVariableType): string {
  if (type === "component") return UE_BP_PIN_SRGB.object;
  return UE_BP_PIN_SRGB[type];
}

const DEFAULT_TYPE_LABELS: Partial<Record<UeVariableType, string>> = {
  bool: "Boolean",
  float: "Float",
  double: "Double",
  int: "Integer",
  int64: "Integer64",
  byte: "Byte",
  string: "String",
  name: "Name",
  text: "Text",
  struct: "Struct",
  vector: "Vector",
  rotator: "Rotator",
  transform: "Transform",
  object: "Object",
  class: "Class",
  interface: "Interface",
  delegate: "Delegate",
};

export function getDefaultTypeLabel(type: UeVariableType): string | undefined {
  return DEFAULT_TYPE_LABELS[type];
}

/** Wire thickness — GraphEditorSettings defaults */
export const UE_BP_WIRE = {
  exec: 2.5,
  data: 1.5,
} as const;

/** Node chrome — approximates Graph.Node.Body + VarNode overlays */
export const UE_BP_NODE = {
  bodyBg: "rgba(18, 18, 20, 0.94)",
  bodyBorder: "rgba(72, 72, 76, 0.85)",
  shadow: "0 3px 12px rgba(0, 0, 0, 0.55), 0 1px 0 rgba(255, 255, 255, 0.04) inset",
  shadowSelected: "0 0 0 1px #0070E0, 0 4px 16px rgba(0, 112, 224, 0.35)",
  text: "#E8E8E8",
  subtitle: "#A0A0A8",
  pinLabel: "#C8C8C8",
  gridMajor: "#2A2A2E",
  gridMinor: "#222226",
  graphBg: "#1B1B1F",
} as const;

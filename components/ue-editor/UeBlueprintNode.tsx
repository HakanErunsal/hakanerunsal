import { cn } from "@/lib/utils";
import { UE_NODE_HEADERS, type UeNodeCategory } from "./ue-theme";
import {
  getBlueprintTitleColor,
  UE_BP_NODE,
  UE_BP_PIN_SRGB,
  type UeBlueprintNodeKind,
} from "./ue-blueprint-theme";
import {
  UeBlueprintExecRow,
  UeBlueprintPinRow,
  type UeBlueprintPinDef,
} from "./UeBlueprintPin";
import { UeBreakStructIcon, UeEventIcon, UeFunctionIcon } from "./icons/UeBlueprintIcons";

export type { UeBlueprintPinDef };

interface UeBlueprintNodeProps {
  title: string;
  subtitle?: string;
  /** Stacked label lines for subsystem-get nodes (e.g. AICombat / Role / Subsystem). */
  titleLines?: string[];
  /** Semantic Blueprint node type — drives official UE header color */
  kind?: UeBlueprintNodeKind;
  /** Legacy category from flow visualizers — used when kind is not set */
  category?: UeNodeCategory;
  headerColor?: string;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  /** Tile-style compact node (Content Browser metaphor, not graph node) */
  compact?: boolean;
  /** Graph node with pins — auto when `pins` is non-empty */
  variant?: "flow" | "graph";
  pure?: boolean;
  pins?: UeBlueprintPinDef[];
  /** Show exec flow pins on impure graph nodes */
  impure?: boolean;
  trailing?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

function resolveHeaderColor(props: UeBlueprintNodeProps, flowMode = false): string {
  if (props.headerColor) return props.headerColor;
  if (props.kind) return getBlueprintTitleColor(props.kind);
  if (props.pure) return getBlueprintTitleColor("pure");
  if (props.category && props.category in UE_NODE_HEADERS) {
    // Conceptual flow charts — muted semantic colors, not graph-editor title colors
    if (flowMode) {
      return UE_NODE_HEADERS[props.category];
    }
    const custom = UE_NODE_HEADERS[props.category];
    if (props.category === "function" || props.category === "flow") {
      return getBlueprintTitleColor("function");
    }
    if (props.category === "event") return getBlueprintTitleColor("event");
    if (props.category === "action" || props.category === "component" || props.category === "variable") {
      return getBlueprintTitleColor("pure");
    }
    return custom;
  }
  return flowMode ? UE_NODE_HEADERS.default : getBlueprintTitleColor("function");
}

function defaultIcon(kind?: UeBlueprintNodeKind, pure?: boolean) {
  if (kind === "break-struct" || kind === "make-struct" || kind === "struct") {
    return <UeBreakStructIcon className="h-3.5 w-3.5" />;
  }
  if (kind === "event") return <UeEventIcon className="h-3.5 w-3.5" />;
  if (kind === "pure" || kind === "operator" || pure) {
    return <UeFunctionIcon className="h-3.5 w-3.5 text-[color:var(--uekit-bp-pure-glyph)]" />;
  }
  return <UeFunctionIcon className="h-3.5 w-3.5" />;
}

function splitPins(pins: UeBlueprintPinDef[]) {
  const exec = pins.filter((p) => p.type === "exec");
  const data = pins.filter((p) => p.type !== "exec");
  const inputs = data.filter((p) => p.direction === "input");
  const outputs = data.filter((p) => p.direction === "output");
  return { exec, inputs, outputs };
}

/** Dark compact world/game subsystem getter — no inputs, object ref output only. */
function SubsystemGetNode({
  lines,
  active,
  disabled,
  className,
}: {
  lines: string[];
  active?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "ue-bp-subsystem-node relative inline-flex min-w-[160px] items-center justify-center px-6 py-4",
        active && "ue-bp-node--active",
        disabled && "ue-bp-node--disabled",
        className,
      )}
    >
      <div className="ue-bp-subsystem-node__gloss" aria-hidden />
      <div className="relative z-[1] flex flex-col items-center gap-0.5 text-center">
        {lines.map((line) => (
          <span key={line} className="text-[15px] font-bold leading-tight text-[color:var(--uekit-bp-pin-label)]">
            {line}
          </span>
        ))}
      </div>
      <span
        className="ue-bp-data-pin ue-bp-data-pin--connected ue-bp-subsystem-node__pin absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2"
        style={{ "--pin-color": UE_BP_PIN_SRGB.object } as React.CSSProperties}
        aria-hidden
      />
    </div>
  );
}
/** Pill-shaped variable getter / setter — Graph.VarNode */
function VariableGetNode({
  title,
  headerColor,
  active,
  disabled,
  kind,
  className,
}: {
  title: string;
  headerColor: string;
  active?: boolean;
  disabled?: boolean;
  kind: "variable-get" | "variable-set";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "ue-bp-var-node relative inline-flex min-w-[120px] items-center justify-center px-4 py-2",
        active && "ue-bp-node--active",
        disabled && "ue-bp-node--disabled",
        className,
      )}
      style={{ "--bp-header": headerColor } as React.CSSProperties}
    >
      <div className="ue-bp-var-node__spill" aria-hidden />
      <div className="ue-bp-var-node__gloss" aria-hidden />
      {kind === "variable-set" && (
        <span className="absolute left-2 top-1 text-[10px] font-bold uppercase tracking-wide text-white/70">
          SET
        </span>
      )}
      <span className="relative z-[1] text-[13px] font-normal text-[color:var(--uekit-bp-text)]">{title}</span>
      <span
        className="ue-bp-data-pin ue-bp-data-pin--connected ue-bp-var-node__pin absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2"
        style={{ "--pin-color": headerColor } as React.CSSProperties}
        aria-hidden
      />
    </div>
  );
}

/** Small operator node (==, +, etc.) */
function OperatorNode({
  title,
  headerColor,
  active,
  disabled,
  pins,
  className,
}: {
  title: string;
  headerColor: string;
  active?: boolean;
  disabled?: boolean;
  pins?: UeBlueprintPinDef[];
  className?: string;
}) {
  const inputs = pins?.filter((p) => p.direction === "input") ?? [];
  const outputs = pins?.filter((p) => p.direction === "output") ?? [];

  return (
    <div
      className={cn(
        "ue-bp-operator relative inline-flex items-center gap-2 px-3 py-1.5",
        active && "ue-bp-node--active",
        disabled && "ue-bp-node--disabled",
        className,
      )}
      style={{ "--bp-header": headerColor } as React.CSSProperties}
    >
      <div className="ue-bp-operator__header" aria-hidden />
      <span className="relative z-[1] font-mono text-[14px] font-bold text-white">{title}</span>
      {inputs.length > 0 && (
        <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {inputs.map((p, i) => (
            <span
              key={i}
              className="ue-bp-data-pin block"
              style={{ "--pin-color": headerColor } as React.CSSProperties}
            />
          ))}
        </span>
      )}
      {outputs.length > 0 && (
        <span className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
          {outputs.map((p, i) => (
            <span
              key={i}
              className="ue-bp-data-pin block"
              style={{ "--pin-color": headerColor } as React.CSSProperties}
            />
          ))}
        </span>
      )}
    </div>
  );
}

/** Full graph node — SGraphNode layout with ColorSpill + TitleGloss */
function GraphNode({
  title,
  subtitle,
  headerColor,
  icon,
  active,
  disabled,
  impure,
  pins,
  trailing,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  headerColor: string;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  impure?: boolean;
  pins: UeBlueprintPinDef[];
  trailing?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  const { inputs, outputs } = splitPins(pins);
  const showExec = impure ?? pins.some((p) => p.type === "exec");
  const maxRows = Math.max(inputs.length, outputs.length, 1);

  return (
    <div
      className={cn(
        "ue-bp-node ue-bp-node--graph relative min-w-[200px] max-w-[320px]",
        active && "ue-bp-node--active",
        disabled && "ue-bp-node--disabled",
        className,
      )}
      style={{ "--bp-header": headerColor } as React.CSSProperties}
    >
      <div className="ue-bp-node__body" aria-hidden />

      <div className="relative z-[1]">
        {/* Title area — ColorSpill + TitleGloss + TitleHighlight */}
        <div className="ue-bp-node__header relative overflow-hidden px-3 py-1.5">
          <div className="ue-bp-node__color-spill" aria-hidden />
          <div className="ue-bp-node__gloss" aria-hidden />
          <div className="ue-bp-node__highlight" aria-hidden />
          <div className="relative flex items-start gap-2">
            {icon && <span className="mt-0.5 shrink-0 opacity-95">{icon}</span>}
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14px] font-semibold leading-tight text-white">{title}</div>
              {subtitle && (
                <div className="mt-0.5 truncate text-[12px] italic leading-snug text-[color:var(--uekit-bp-subtitle)]">
                  {subtitle}
                </div>
              )}
            </div>
            {trailing && <span className="shrink-0">{trailing}</span>}
          </div>
        </div>

        {/* Pin area */}
        <div className="ue-bp-node__pins px-2 pb-1.5 pt-0.5">
          {showExec && <UeBlueprintExecRow />}

          <div className="grid grid-cols-2 gap-x-2">
            <div className="flex flex-col">
              {inputs.map((pin, i) => (
                <UeBlueprintPinRow key={`in-${i}`} pin={pin} />
              ))}
            </div>
            <div className="flex flex-col">
              {outputs.map((pin, i) => (
                <UeBlueprintPinRow key={`out-${i}`} pin={pin} />
              ))}
            </div>
          </div>

          {inputs.length === 0 && outputs.length === 0 && maxRows === 1 && children && (
            <div className="px-1 py-1 text-[13px] text-[color:var(--uekit-bp-subtitle)]">{children}</div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Vertical flow node — gloss header, no pin columns */
function FlowNode({
  title,
  subtitle,
  headerColor,
  icon,
  active,
  disabled,
  trailing,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  headerColor: string;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  trailing?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "ue-bp-node ue-bp-node--flow relative w-full overflow-hidden",
        active ? "ue-bp-node--active opacity-100" : "",
        disabled && "ue-bp-node--disabled",
        className,
      )}
      style={{ "--bp-header": headerColor } as React.CSSProperties}
    >
      <div className="ue-bp-node__body" aria-hidden />

      <div className="relative z-[1]">
        <div className="ue-bp-node__header relative overflow-hidden px-2 py-1.5">
          <div className="ue-bp-node__color-spill" aria-hidden />
          <div className="ue-bp-node__gloss" aria-hidden />
          <div className="ue-bp-node__highlight" aria-hidden />
          <div className="relative flex items-center gap-2">
            {icon && <span className="shrink-0 opacity-90">{icon}</span>}
            <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-white">{title}</span>
            {trailing && <span className="shrink-0">{trailing}</span>}
          </div>
        </div>

        {(subtitle || children) && (
          <div className="px-2 py-1.5 text-[13px] leading-snug" style={{ color: UE_BP_NODE.subtitle }}>
            {subtitle && <div>{subtitle}</div>}
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export function UeBlueprintNode({
  title,
  subtitle,
  titleLines,
  kind,
  category = "default",
  headerColor,
  icon,
  active = false,
  disabled = false,
  compact = false,
  variant,
  pure = false,
  pins = [],
  impure,
  trailing,
  className,
  children,
}: UeBlueprintNodeProps) {
  const isGraph = variant === "graph" || pins.length > 0;
  const color = resolveHeaderColor(
    { kind, category, headerColor, pure, title, subtitle, icon, active, disabled, compact, variant, pins, impure, trailing, className, children },
    !isGraph,
  );

  const resolvedIcon = icon ?? defaultIcon(kind, pure);

  if (compact) {
    return (
      <div
        className={cn(
          "relative z-10 flex h-16 w-16 flex-col items-center justify-center overflow-hidden rounded-sm border transition-all duration-500",
          active
            ? "scale-110 border-[color:var(--uekit-primary)] shadow-[0_0_0_1px_var(--uekit-primary),0_0_16px_var(--uekit-primary-glow)]"
            : "border-[color:var(--uekit-secondary)] opacity-60",
          className,
        )}
      >
        <div className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: color }} />
        <div className={cn("flex flex-1 items-center justify-center bg-[color:var(--uekit-recessed)]", active ? "text-[color:var(--uekit-foreground)]" : "text-[color:var(--uekit-hover2)]")}>
          {icon}
        </div>
      </div>
    );
  }

  if (kind === "subsystem-get") {
    return (
      <SubsystemGetNode
        lines={titleLines ?? title.split(/\s+/).filter(Boolean)}
        active={active}
        disabled={disabled}
        className={className}
      />
    );
  }

  if (kind === "variable-get" || kind === "variable-set") {
    return (
      <VariableGetNode
        title={title}
        headerColor={color}
        active={active}
        disabled={disabled}
        kind={kind}
        className={className}
      />
    );
  }

  if (kind === "operator") {
    return (
      <OperatorNode
        title={title}
        headerColor={color}
        active={active}
        disabled={disabled}
        pins={pins}
        className={className}
      />
    );
  }

  if (isGraph) {
    return (
      <GraphNode
        title={title}
        subtitle={subtitle}
        headerColor={color}
        icon={resolvedIcon}
        active={active}
        disabled={disabled}
        impure={impure ?? (kind === "function" || kind === "event")}
        pins={pins}
        trailing={trailing}
        className={className}
      >
        {children}
      </GraphNode>
    );
  }

  return (
    <FlowNode
      title={title}
      subtitle={subtitle}
      headerColor={color}
      icon={resolvedIcon}
      active={active}
      disabled={disabled}
      trailing={trailing}
      className={className}
    >
      {children}
    </FlowNode>
  );
}

/** Preset: impure function call node matching Execute Reaction screenshot */
export function UeBlueprintFunctionNode(
  props: Omit<UeBlueprintNodeProps, "kind" | "variant"> & { pins?: UeBlueprintPinDef[] },
) {
  const defaultPins: UeBlueprintPinDef[] = props.pins ?? [
    { name: "Target", type: "object", direction: "input" },
    { name: "Reaction Id", type: "name", direction: "input", defaultValue: "Parry" },
    { name: "Context", type: "struct", direction: "input" },
    { name: "Return Value", type: "bool", direction: "output" },
  ];

  return (
    <UeBlueprintNode
      {...props}
      kind="function"
      variant="graph"
      impure
      pins={defaultPins}
      icon={props.icon ?? <UeFunctionIcon className="h-3.5 w-3.5" />}
    />
  );
}

/** Preset: Break Struct node */
export function UeBlueprintBreakStructNode(
  props: Omit<UeBlueprintNodeProps, "kind" | "variant"> & { pins?: UeBlueprintPinDef[] },
) {
  return (
    <UeBlueprintNode
      {...props}
      kind="break-struct"
      variant="graph"
      pure
      impure={false}
      icon={props.icon ?? <UeBreakStructIcon className="h-3.5 w-3.5" />}
      pins={props.pins ?? []}
    />
  );
}

/** Preset: world subsystem getter (dark compact node, output only). */
export function UeBlueprintSubsystemNode(
  props: Omit<UeBlueprintNodeProps, "kind" | "variant" | "pins" | "title"> & {
    title?: string;
    titleLines?: string[];
  },
) {
  return (
    <UeBlueprintNode
      {...props}
      kind="subsystem-get"
      title={props.title ?? "Subsystem"}
      titleLines={props.titleLines ?? ["AICombat", "Role", "Subsystem"]}
      pins={[]}
    />
  );
}

/** Preset: pure getter pill */
export function UeBlueprintGetterNode(props: Omit<UeBlueprintNodeProps, "kind">) {
  return <UeBlueprintNode {...props} kind="variable-get" />;
}

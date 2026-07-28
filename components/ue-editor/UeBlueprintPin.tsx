import { cn } from "@/lib/utils";
import { getPinColor, type UePinType } from "./ue-blueprint-theme";

export interface UeBlueprintPinDef {
  name: string;
  type: UePinType;
  direction: "input" | "output";
  /** Inline default value (e.g. "Parry" on Reaction Id) */
  defaultValue?: string;
  connected?: boolean;
}

interface UeBlueprintPinProps {
  pin: UeBlueprintPinDef;
  className?: string;
}

function ExecPin({ connected }: { direction?: "input" | "output"; connected?: boolean }) {
  return (
    <span
      className={cn("ue-bp-exec-pin inline-block shrink-0", connected && "ue-bp-exec-pin--connected")}
      aria-hidden
    />
  );
}

function DataPin({ type, connected }: { type: UePinType; connected?: boolean }) {
  return (
    <span
      className={cn("ue-bp-data-pin inline-block shrink-0", connected && "ue-bp-data-pin--connected")}
      style={{ "--pin-color": getPinColor(type) } as React.CSSProperties}
      aria-hidden
    />
  );
}

/** Single pin row — label + pin on the appropriate side */
export function UeBlueprintPinRow({ pin }: UeBlueprintPinProps) {
  const isInput = pin.direction === "input";
  const isExec = pin.type === "exec";

  return (
    <div
      className={cn(
        "ue-bp-pin-row flex min-h-[26px] items-center gap-1.5 text-[13px]",
        isInput ? "justify-start" : "justify-end",
      )}
    >
      {isInput && (isExec ? <ExecPin direction="input" connected={pin.connected} /> : <DataPin type={pin.type} connected={pin.connected} />)}

      <span className={cn("ue-bp-pin-label truncate", isInput ? "text-left" : "text-right")}>
        {pin.name}
      </span>

      {pin.defaultValue !== undefined && (
        <span className="ue-bp-pin-default shrink-0">{pin.defaultValue}</span>
      )}

      {!isInput && (isExec ? <ExecPin direction="output" connected={pin.connected} /> : <DataPin type={pin.type} connected={pin.connected} />)}
    </div>
  );
}

/** Exec-only row at top of impure nodes */
export function UeBlueprintExecRow({
  hasInput = true,
  hasOutput = true,
  inputConnected,
  outputConnected,
}: {
  hasInput?: boolean;
  hasOutput?: boolean;
  inputConnected?: boolean;
  outputConnected?: boolean;
}) {
  return (
    <div className="ue-bp-exec-row relative flex h-[14px] items-center">
      {hasInput && (
        <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <ExecPin direction="input" connected={inputConnected} />
        </span>
      )}
      {hasOutput && (
        <span className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
          <ExecPin direction="output" connected={outputConnected} />
        </span>
      )}
    </div>
  );
}

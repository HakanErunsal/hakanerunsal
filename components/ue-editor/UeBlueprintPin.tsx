import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { getPinColor, type UePinType } from "./ue-blueprint-theme";
import { UeCheckbox } from "./UeDetailsPanel";

export interface UeBlueprintPinDef {
  name: string;
  type: UePinType;
  direction: "input" | "output";
  /** Inline default value (e.g. "Parry" on Reaction Id) */
  defaultValue?: string;
  connected?: boolean;
  /** Ref to the pin's own dot, for a UeBlueprintWire anchored to this exact pin. */
  dotRef?: React.Ref<HTMLSpanElement>;
}

interface UeBlueprintPinProps {
  pin: UeBlueprintPinDef;
  className?: string;
}

function ExecPin({ connected }: { direction?: "input" | "output"; connected?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      className={cn("ue-bp-exec-pin inline-block shrink-0", connected && "ue-bp-exec-pin--connected")}
      aria-hidden
    >
      <path
        d="M2 2 L9 2 L14 8 L9 14 L2 14 Z"
        fill={connected ? "white" : "none"}
        stroke="white"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const DataPin = forwardRef<HTMLSpanElement, { type: UePinType; connected?: boolean }>(function DataPin(
  { type, connected },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn("ue-bp-data-pin inline-block shrink-0", connected && "ue-bp-data-pin--connected")}
      style={{ "--pin-color": getPinColor(type) } as React.CSSProperties}
      aria-hidden
    />
  );
});

/** Single pin row — label + pin on the appropriate side */
export function UeBlueprintPinRow({ pin }: UeBlueprintPinProps) {
  const isInput = pin.direction === "input";
  const isExec = pin.type === "exec";

  return (
    <div
      className={cn(
        "ue-bp-pin-row flex min-h-[26px] items-center gap-1.5 text-[15px]",
        isInput ? "justify-start" : "justify-end",
      )}
    >
      {isInput &&
        (isExec ? (
          <ExecPin direction="input" connected={pin.connected} />
        ) : (
          <DataPin ref={pin.dotRef} type={pin.type} connected={pin.connected} />
        ))}

      <span
        className={cn(
          "ue-bp-pin-label",
          pin.type === "bool" ? "whitespace-nowrap" : "truncate",
          isInput ? "text-left" : "text-right",
        )}
      >
        {pin.name}
      </span>

      {pin.defaultValue !== undefined && pin.type === "bool" ? (
        <UeCheckbox checked={pin.defaultValue === "true"} />
      ) : (
        pin.defaultValue !== undefined && <span className="ue-bp-pin-default shrink-0">{pin.defaultValue}</span>
      )}

      {!isInput &&
        (isExec ? (
          <ExecPin direction="output" connected={pin.connected} />
        ) : (
          <DataPin ref={pin.dotRef} type={pin.type} connected={pin.connected} />
        ))}
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
    <div className="ue-bp-exec-row relative flex h-[16px] items-center">
      {hasInput && (
        <span className="absolute left-2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <ExecPin direction="input" connected={inputConnected} />
        </span>
      )}
      {hasOutput && (
        <span className="absolute right-2 top-1/2 translate-x-1/2 -translate-y-1/2">
          <ExecPin direction="output" connected={outputConnected} />
        </span>
      )}
    </div>
  );
}

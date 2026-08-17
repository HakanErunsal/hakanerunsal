"use client";

import { UE } from "./ue-theme";
import { UeSceneFrame } from "./UeSceneFrame";
import { useSceneClock } from "./useSceneClock";

type RowKind = "number" | "text" | "bool" | "asset" | "class";

interface SceneRow {
  /** Editor DisplayName of the property. */
  name: string;
  /** What the row reads once the step has played. */
  value: string;
  /** What the row reads before it. Defaults to the property's shipped default being visibly replaced. */
  from?: string;
  kind?: RowKind;
  /** Indent one level, for a field that expands under the instanced object above it. */
  indent?: boolean;
}

interface UeSetPropertiesSceneProps {
  /** Asset or component name on the title bar. */
  title: string;
  /** Section header inside the panel. */
  section?: string;
  rows: SceneRow[];
  caption?: string;
  width?: number;
}

function RowValue({ row, filled }: { row: SceneRow; filled: boolean }) {
  const kind = row.kind ?? "number";
  const text = filled ? row.value : (row.from ?? "");

  if (kind === "bool") {
    const on = filled ? row.value !== "false" : row.from === "true";
    return (
      <span
        className="flex h-3 w-3 items-center justify-center rounded-[2px] border text-[9px] leading-none"
        style={{
          borderColor: UE.dropdownOutline,
          background: on ? UE.primary : UE.input,
          color: UE.foregroundHeader,
        }}
      >
        {on ? "✓" : ""}
      </span>
    );
  }

  if (kind === "asset" || kind === "class") {
    return (
      <span
        className="flex flex-1 items-center gap-1.5 truncate rounded-[2px] border px-1.5 py-[2px] text-[10px]"
        style={{
          borderColor: UE.dropdownOutline,
          background: UE.input,
          color: text ? UE.foregroundHeader : UE.hover2,
        }}
      >
        {kind === "asset" && (
          <span
            className="h-2 w-2 shrink-0 rounded-[1px]"
            style={{ background: text ? UE.dataAsset : UE.secondary }}
          />
        )}
        <span className="truncate">{text || "None"}</span>
      </span>
    );
  }

  return (
    <span
      className="flex-1 truncate rounded-[2px] border px-1.5 py-[2px] text-[10px]"
      style={{ borderColor: UE.dropdownOutline, background: UE.input, color: UE.foregroundHeader }}
    >
      {text || " "}
    </span>
  );
}

/**
 * A details panel filling in one property at a time. One scene stands in for the
 * set-these-fields step of a quick start.
 */
export default function UeSetPropertiesScene({
  title,
  section = "Details",
  rows,
  caption,
  width = 400,
}: UeSetPropertiesSceneProps) {
  const durations = [900, ...rows.map(() => 1000), 1800];
  const { step, ref } = useSceneClock(durations);
  const focusedRow = step - 1;

  return (
    <UeSceneFrame
      title={title}
      caption={caption}
      width={width}
      height={44 + rows.length * 26}
      frameRef={ref}
    >
      <div className="absolute inset-0" style={{ background: UE.background }}>
        <div
          className="flex items-center gap-1 border-b px-2 py-1 text-[10px] uppercase tracking-wide"
          style={{ borderColor: UE.windowBorder, background: UE.header, color: UE.foregroundHeader }}
        >
          <span style={{ color: UE.hover2 }}>▾</span>
          {section}
        </div>
        {rows.map((row, i) => {
          const focused = i === focusedRow;
          return (
            <div
              key={row.name}
              className="flex items-center gap-2 border-b px-2 py-[3px] transition-colors duration-200"
              style={{
                borderColor: UE.windowBorder,
                background: focused ? UE.selectParent : i % 2 ? UE.panel : UE.background,
                boxShadow: focused ? `inset 2px 0 0 ${UE.primary}` : "none",
              }}
            >
              <span
                className="w-[46%] shrink-0 truncate text-[10px]"
                style={{ color: UE.foreground, paddingLeft: row.indent ? 16 : 0 }}
              >
                {row.name}
              </span>
              <RowValue row={row} filled={focusedRow >= i} />
            </div>
          );
        })}
      </div>
    </UeSceneFrame>
  );
}

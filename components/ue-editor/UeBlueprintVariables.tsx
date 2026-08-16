"use client";

import { useState } from "react";
import { Bell, ChevronRight, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getDefaultTypeLabel,
  type UeVariableType,
} from "./ue-blueprint-theme";
import { UeVariableTypePill } from "./UeVariableTypePill";

export interface UeBlueprintVariable {
  name: string;
  /** Pin / variable type — drives pill color */
  type?: UeVariableType;
  /** Right-side label, e.g. "Boolean", "SECWeapon Base" */
  typeLabel?: string;
  /** Nested variables or subcategories */
  children?: UeBlueprintVariable[];
  defaultOpen?: boolean;
  selected?: boolean;
  /** Instance Editable (eye) — open = exposed, closed = hidden. Default closed. */
  instanceEditable?: boolean;
  /** Field Notify (bell) badge */
  fieldNotify?: boolean;
}

export interface UeBlueprintVariablesProps {
  /** Top-level categories / variables */
  items: UeBlueprintVariable[];
  className?: string;
  /** Hide type text for component variables (matches UE — pill only) */
  hideComponentLabels?: boolean;
}

function resolveTypeLabel(item: UeBlueprintVariable, hideComponentLabels: boolean): string | undefined {
  if (item.typeLabel !== undefined) return item.typeLabel;
  if (!item.type) return undefined;
  if (item.type === "component" && hideComponentLabels) return undefined;
  return getDefaultTypeLabel(item.type);
}

function VariableTreeItem({
  item,
  depth = 0,
  hideComponentLabels,
}: {
  item: UeBlueprintVariable;
  depth?: number;
  hideComponentLabels: boolean;
}) {
  const hasChildren = (item.children?.length ?? 0) > 0;
  const isCategory = hasChildren && !item.type;
  const [open, setOpen] = useState(item.defaultOpen ?? true);

  const typeLabel = item.type ? resolveTypeLabel(item, hideComponentLabels) : undefined;

  return (
    <div className="ue-mybp-item">
      <div
        className={cn(
          "ue-mybp-row flex min-h-[26px] items-center gap-0.5 pr-2",
          item.selected && "ue-mybp-row--selected",
          isCategory && "ue-mybp-row--category",
        )}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="ue-mybp-chevron flex h-[18px] w-[14px] shrink-0 items-center justify-center text-[color:var(--uekit-hover2)] hover:text-[color:var(--uekit-foreground)]"
            aria-expanded={open}
            aria-label={open ? "Collapse" : "Expand"}
          >
            <ChevronRight
              className={cn("h-3 w-3 transition-transform duration-150", open && "rotate-90")}
            />
          </button>
        ) : (
          <span className="inline-block w-[14px] shrink-0" aria-hidden />
        )}

        <span className="min-w-0 flex-1 truncate text-[13px] text-[color:var(--uekit-foreground)]">{item.name}</span>

        {item.type && (
          <span className="ml-2 flex shrink-0 items-center gap-1.5">
            <UeVariableTypePill type={item.type} />
            {typeLabel && (
              <span className="max-w-[120px] truncate text-[13px] text-[color:var(--uekit-hover2)]">{typeLabel}</span>
            )}
            <span className="ue-mybp-row-icons ml-1 flex items-center gap-1 text-[color:var(--uekit-hover2)]">
              <Bell className={cn("h-3 w-3", item.fieldNotify && "text-[color:var(--uekit-foreground)]")} />
              {item.instanceEditable ? (
                <Eye className="h-3 w-3 text-[color:var(--uekit-foreground)]" />
              ) : (
                <EyeOff className="h-3 w-3" />
              )}
            </span>
          </span>
        )}
      </div>

      {hasChildren && open && (
        <div className="ue-mybp-children">
          {item.children!.map((child) => (
            <VariableTreeItem
              key={child.name}
              item={child}
              depth={depth + 1}
              hideComponentLabels={hideComponentLabels}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * My Blueprint variables tree — hierarchical list with type pills.
 * Matches UE Blueprint editor variable panel (SMyBlueprint).
 */
export function UeBlueprintVariables({
  items,
  className,
  hideComponentLabels = true,
}: UeBlueprintVariablesProps) {
  return (
    <div className={cn("ue-mybp-tree select-none", className)}>
      {items.map((item) => (
        <VariableTreeItem
          key={item.name}
          item={item}
          hideComponentLabels={hideComponentLabels}
        />
      ))}
    </div>
  );
}

interface UeMyBlueprintPanelProps extends UeBlueprintVariablesProps {
  title?: string;
  className?: string;
}

/** My Blueprint panel chrome — dark tree on recessed background */
export function UeMyBlueprintPanel({
  title = "My Blueprint",
  items,
  className,
  hideComponentLabels,
}: UeMyBlueprintPanelProps) {
  return (
    <div className={cn("ue-mybp-panel overflow-hidden rounded-[2px] border border-[color:var(--uekit-window-border)]", className)}>
      <div className="border-b border-[color:var(--uekit-window-border)] bg-[color:var(--uekit-recessed)] px-2 py-1">
        <span className="text-[13px] font-normal text-[color:var(--uekit-foreground-header)]">{title}</span>
      </div>
      <div className="bg-[color:var(--uekit-background)] py-1">
        <UeBlueprintVariables items={items} hideComponentLabels={hideComponentLabels} />
      </div>
    </div>
  );
}

/** Example data matching a typical SEC Blueprint */
export const SEC_BLUEPRINT_VARIABLES: UeBlueprintVariable[] = [
  {
    name: "Components",
    defaultOpen: true,
    children: [
      { name: "DamageSenseArea", type: "component" },
      { name: "BasicHealth", type: "component" },
    ],
  },
  {
    name: "Visibility",
    defaultOpen: true,
    children: [
      { name: "RoleVisibility", type: "bool" },
      { name: "ActionsVisibility", type: "bool" },
    ],
  },
  {
    name: "SEC",
    defaultOpen: true,
    children: [
      {
        name: "Weapon",
        defaultOpen: true,
        children: [
          { name: "WeaponToUse", type: "object", typeLabel: "SECWeapon Base" },
        ],
      },
      { name: "FloatExample", type: "float" },
    ],
  },
];

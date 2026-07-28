import { cn } from "@/lib/utils";
import { UeAssetIcon } from "./UeAssetIcon";
import { UeComponentRow } from "./UeComponentRow";
import { UeDetailsPanel, type UeDetailCategory } from "./UeDetailsPanel";
import { UePanel } from "./UePanel";
import type { UeAssetType } from "./ue-theme";

/** Where the Details fields live in the Unreal editor. */
export type UeDetailsSourceKind = "component" | "asset" | "blueprint" | "notify" | "settings" | "instanced";

export interface UeComponentDetailsPanelProps {
  /** Editor display name, e.g. "SEC Action Set Component" or "SEC Awareness Config". */
  displayName: string;
  /** C++ type without prefix when possible, e.g. "SECActionSetComponent" or "SECAwarenessConfig". */
  sourceClass: string;
  /** Parent context shown in the breadcrumb (actor class, asset instance, montage, etc.). */
  attachTo?: string;
  /** Caption under the panel (replication note, setup context, etc.). */
  note?: string;
  /** Component (default), data asset, Blueprint actor, anim notify, project settings, or instanced UObject. */
  sourceKind?: UeDetailsSourceKind;
  categories: UeDetailCategory[];
  className?: string;
}

function sourceKindToAssetType(kind: UeDetailsSourceKind): UeAssetType {
  switch (kind) {
    case "component":
      return "component";
    case "asset":
    case "instanced":
    case "settings":
      return "dataAsset";
    case "blueprint":
      return "blueprint";
    case "notify":
      return "ability";
    default:
      return "component";
  }
}

function UeSourceRow({
  displayName,
  sourceClass,
  sourceKind,
}: {
  displayName: string;
  sourceClass: string;
  sourceKind: UeDetailsSourceKind;
}) {
  if (sourceKind === "component") {
    return <UeComponentRow displayName={displayName} componentClass={sourceClass} selected />;
  }

  return (
    <div className="ue-component-row ue-component-row-selected flex w-full items-center gap-1.5 px-1.5 py-0.5">
      <UeAssetIcon type={sourceKindToAssetType(sourceKind)} showLabel={false} className="shrink-0" />
      <span className="min-w-0 truncate text-[13px] leading-none text-[#cccccc]">
        {displayName}
        <span className="text-[#cccccc]"> ({sourceClass})</span>
      </span>
    </div>
  );
}

/** Details panel framed with source identity: breadcrumb, selected source row, property categories. */
export function UeComponentDetailsPanel({
  displayName,
  sourceClass,
  attachTo = "AEnemyCharacterBase",
  note,
  sourceKind = "component",
  categories,
  className,
}: UeComponentDetailsPanelProps) {
  return (
    <div className={cn("my-6 max-w-[520px]", className)}>
      <UePanel
        title="Details"
        breadcrumb={[attachTo, displayName]}
        showTitleIcon={false}
        compact
        bodyClassName="p-0"
        caption={note}
      >
        <div className="border-b border-[#0F0F0F] bg-[#1A1A1A]">
          <UeSourceRow displayName={displayName} sourceClass={sourceClass} sourceKind={sourceKind} />
        </div>
        <div className="p-2">
          <UeDetailsPanel categories={categories} />
        </div>
      </UePanel>
    </div>
  );
}

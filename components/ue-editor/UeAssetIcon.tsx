import type { UeAssetType } from "./ue-theme";
import { UE } from "./ue-theme";
import {
  UeActorComponentIcon,
  UeBlueprintThumbnailIcon,
  UeDataAssetThumbnailIcon,
} from "./icons/UeIcons";

/** Asset type accent stripe colors from EngineAssetDefinitions plugin. */
export const ASSET_ACCENTS: Record<UeAssetType, string> = {
  blueprint: UE.blueprint,
  component: UE.foreground,
  dataAsset: UE.dataAsset,
  statetree: "#A139BF",
  visualizer: UE.accentBlue,
  output: UE.hover2,
  ability: UE.success,
};

export const ASSET_TYPE_LABELS: Record<UeAssetType, string> = {
  blueprint: "Blueprint Class",
  component: "Actor Component",
  dataAsset: "Data Asset",
  statetree: "StateTree Asset",
  visualizer: "Preview",
  output: "Output Log",
  ability: "Gameplay Ability",
};

interface UeAssetIconProps {
  type: UeAssetType;
  showLabel?: boolean;
  className?: string;
}

export function UeAssetIcon({ type, showLabel = true, className }: UeAssetIconProps) {
  const color = ASSET_ACCENTS[type];
  const label = ASSET_TYPE_LABELS[type];

  return (
    <div className={`flex items-center gap-1.5 ${className ?? ""}`}>
      {type === "component" ? (
        <UeActorComponentIcon className="h-3.5 w-3.5" />
      ) : (
        <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden>
          <rect x="1" y="1" width="14" height="14" rx="1" fill="#242424" stroke="#383838" />
          <rect x="1" y="14" width="14" height="1.5" fill={color} />
        </svg>
      )}
      {showLabel && <span className="text-[12px] text-[#808080]">{label}</span>}
    </div>
  );
}

export function getAssetColor(type: UeAssetType): string {
  return ASSET_ACCENTS[type];
}

export function getAssetAccent(type: UeAssetType): string {
  return ASSET_ACCENTS[type];
}

export function getAssetTypeLabel(type: UeAssetType): string {
  return ASSET_TYPE_LABELS[type];
}

export { UeActorComponentIcon, UeBlueprintThumbnailIcon, UeDataAssetThumbnailIcon };

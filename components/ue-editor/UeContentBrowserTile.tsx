import { cn } from "@/lib/utils";
import type { UeAssetType } from "./ue-theme";
import { getAssetAccent, getAssetTypeLabel } from "./UeAssetIcon";
import {
  UeBlueprintThumbnailIcon,
  UeDataAssetThumbnailIcon,
} from "./icons/UeIcons";

interface UeContentBrowserTileProps {
  name: string;
  assetType: UeAssetType;
  typeLabel?: string;
  active?: boolean;
  faded?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Content Browser asset tile — matches StarshipStyle ContentBrowser.AssetTileItem:
 * - Recessed (#1A1A1A) thumbnail area, 4px corner radius
 * - 2px asset-type color strip (AssetThumbnail.cpp)
 * - Panel (#242424) label block, 9pt name + 7pt class name
 */
export function UeContentBrowserTile({
  name,
  assetType,
  typeLabel,
  active = false,
  faded = false,
  className,
  onClick,
}: UeContentBrowserTileProps) {
  const accent = getAssetAccent(assetType);
  const label = typeLabel ?? getAssetTypeLabel(assetType);
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      data-active={active}
      className={cn(
        "ue-cb-tile group flex w-[110px] flex-col overflow-hidden text-left transition-colors",
        active && "ue-cb-tile-active",
        faded && "opacity-45",
        onClick && "cursor-pointer",
        className,
      )}
    >
      <div className="ue-cb-tile-thumb relative flex aspect-square items-center justify-center">
        {assetType === "blueprint" ? (
          <UeBlueprintThumbnailIcon className="h-14 w-14" />
        ) : (
          <UeDataAssetThumbnailIcon className="h-14 w-14" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-[2px]" style={{ backgroundColor: accent }} />
      </div>
      <div className="ue-cb-tile-label flex min-h-[54px] flex-col justify-center px-1.5 py-1">
        <span className="line-clamp-2 text-[10px] leading-tight text-[#C0C0C0]">{name}</span>
        <span className="mt-0.5 truncate text-[8px] leading-tight text-[#808080]">{label}</span>
      </div>
    </Tag>
  );
}

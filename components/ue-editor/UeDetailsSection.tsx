import { cn } from "@/lib/utils";
import { UE, SEC_ASSET_THUMBNAIL } from "./ue-theme";
import { SectionTriangle, Triangle } from "./UeDetailsPanel";

/**
 * Free-form Details panel pieces, for a panel authored as children rather than
 * from a schema. UeDetailsPanel renders the same surfaces from a
 * UeDetailCategory[]; both emit the ue-dp-* classes so the two present alike.
 */

interface UeDetailsSectionProps {
  title: string;
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Collapsible Details panel section: header band plus property rows. */
export function UeDetailsSection({
  title,
  defaultOpen = true,
  className,
  children,
}: UeDetailsSectionProps) {
  return (
    <details open={defaultOpen} className={cn("ue-dp-section group", className)}>
      <summary
        className="ue-dp-header flex cursor-pointer list-none items-center gap-1.5 text-[13px] font-normal select-none [&::-webkit-details-marker]:hidden"
        style={{ paddingLeft: 8, color: UE.foregroundHeader }}
      >
        <SectionTriangle />
        {title}
      </summary>
      <div>{children}</div>
    </details>
  );
}

interface UePropertyRowProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

/** Details panel property row: label column at 56%, value column beside it. */
export function UePropertyRow({ label, children, className }: UePropertyRowProps) {
  return (
    <div className={cn("ue-dp-row flex min-h-[30px] items-center", className)}>
      <div
        className="flex shrink-0 items-center text-[13px]"
        style={{ width: "56%", paddingLeft: 22, color: UE.foreground }}
      >
        <span className="truncate">{label}</span>
      </div>
      <div className="ue-dp-value flex min-w-0 flex-1 items-center pr-4">{children}</div>
    </div>
  );
}

/** Asset reference dropdown drawn as a pill, filling the width it is given. */
export function UeAssetPicker({
  value,
  placeholder = "None",
  className,
}: {
  value?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-1 items-center gap-1", className)}>
      <div className="ue-dp-asset ue-asset-picker flex min-w-0 flex-1 items-center justify-between gap-1 px-2.5">
        <span className="truncate text-[13px]" style={{ color: UE.foregroundHeader }}>
          {value ?? placeholder}
        </span>
        <Triangle />
      </div>
    </div>
  );
}

/** Small square asset thumbnail with bottom accent stripe. */
export function UeAssetThumbnail({
  accent,
  className,
  children,
}: {
  accent: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-[2px] border",
        className,
      )}
      style={{ borderColor: UE.secondary, background: SEC_ASSET_THUMBNAIL.tile }}
    >
      {children ?? (
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" fill={SEC_ASSET_THUMBNAIL.wheel} />
          <path d="M8 2 A6 6 0 0 1 13 10 L8 8 Z" fill={SEC_ASSET_THUMBNAIL.slice} />
        </svg>
      )}
      <div className="absolute inset-x-0 bottom-0 h-[2px]" style={{ backgroundColor: accent }} />
    </div>
  );
}

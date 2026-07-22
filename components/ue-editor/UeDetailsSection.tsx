import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface UeDetailsSectionProps {
  title: string;
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Collapsible Details panel section — chevron header + property rows. */
export function UeDetailsSection({
  title,
  defaultOpen = true,
  className,
  children,
}: UeDetailsSectionProps) {
  return (
    <details open={defaultOpen} className={cn("ue-details-section group", className)}>
      <summary className="ue-details-section-header flex cursor-pointer list-none items-center gap-1.5 px-2 py-1.5 text-[11px] font-normal text-[#cccccc] select-none [&::-webkit-details-marker]:hidden">
        <ChevronDown className="h-3 w-3 shrink-0 text-[#888888] transition-transform group-open:rotate-0 -rotate-90" />
        {title}
      </summary>
      <div className="ue-details-section-body">{children}</div>
    </details>
  );
}

interface UePropertyRowProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

/** Details panel property row — label column + value column. */
export function UePropertyRow({ label, children, className }: UePropertyRowProps) {
  return (
    <div className={cn("ue-property-row flex min-h-[28px] items-stretch border-b border-[#111111]", className)}>
      <div className="flex w-[38%] min-w-[100px] shrink-0 items-center border-r border-[#111111] bg-[#151515] px-2 py-1 text-[11px] text-[#888888]">
        {label}
      </div>
      <div className="flex flex-1 items-center bg-[#1a1a1a] px-2 py-1">{children}</div>
    </div>
  );
}

/** Pill-shaped asset reference dropdown like the Details panel. */
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
      <div className="ue-asset-picker flex min-w-0 flex-1 items-center justify-between gap-1 rounded-full border border-[#333333] bg-[#0a0a0a] px-2.5 py-0.5">
        <span className="truncate text-[11px] text-[#cccccc]">{value ?? placeholder}</span>
        <ChevronDown className="h-3 w-3 shrink-0 text-[#666666]" />
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
        "relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-[2px] border border-[#333333] bg-[#0a0a0a]",
        className,
      )}
    >
      {children ?? (
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" fill="#333" />
          <path d="M8 2 A6 6 0 0 1 13 10 L8 8 Z" fill="#555" />
        </svg>
      )}
      <div className="absolute inset-x-0 bottom-0 h-[2px]" style={{ backgroundColor: accent }} />
    </div>
  );
}

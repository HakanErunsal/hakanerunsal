import { cn } from "@/lib/utils";
import { ueCaption, uePanel, uePanelBody } from "./ue-theme";
import type { UeAssetType } from "./ue-theme";
import { UeAssetIcon } from "./UeAssetIcon";

interface UePanelProps {
  title: string;
  breadcrumb?: string[];
  subtitle?: string;
  assetType?: UeAssetType;
  /** When false, the tab title renders without a leading asset icon. */
  showTitleIcon?: boolean;
  toolbarRight?: React.ReactNode;
  headerRight?: React.ReactNode;
  caption?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  compact?: boolean;
  children: React.ReactNode;
}

/** Docked UE panel — tab bar + breadcrumb toolbar (Starship chrome). */
export function UePanel({
  title,
  breadcrumb,
  subtitle,
  assetType = "visualizer",
  showTitleIcon = true,
  toolbarRight,
  headerRight,
  caption,
  className,
  bodyClassName,
  compact = false,
  children,
}: UePanelProps) {
  const crumbs = breadcrumb ?? (subtitle ? [subtitle] : []);

  return (
    <div className={uePanel(className)}>
      {/* Tab bar: background, with the active tab on the panel color. */}
      <div className="flex items-stretch border-b border-[color:var(--uekit-window-border)] bg-[color:var(--uekit-background)]">
        <div className="ue-panel-tab flex items-center gap-2 px-3 py-1">
          {showTitleIcon && <UeAssetIcon type={assetType} showLabel={false} />}
          <span className="text-[15px] text-[color:var(--uekit-foreground-header)]">{title}</span>
        </div>
        {(headerRight || toolbarRight) && (
          <div className="ml-auto flex items-center gap-2 px-2">{headerRight ?? toolbarRight}</div>
        )}
      </div>

      {!compact && (crumbs.length > 0 || toolbarRight) && (
        <div className="flex items-center gap-2 border-b border-[color:var(--uekit-window-border)] bg-[color:var(--uekit-recessed)] px-2 py-1">
          {crumbs.length > 0 && (
            <div className="flex min-w-0 flex-1 items-center gap-0.5 truncate text-[15px] text-[color:var(--uekit-hover2)]">
              {crumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-0.5">
                  {i > 0 && <span className="text-[color:var(--uekit-hover)]">&gt;</span>}
                  <span className={i === crumbs.length - 1 ? "text-[color:var(--uekit-foreground)]" : undefined}>{crumb}</span>
                </span>
              ))}
            </div>
          )}
          {toolbarRight && !headerRight && <div className="shrink-0">{toolbarRight}</div>}
        </div>
      )}

      <div className={uePanelBody(bodyClassName)}>{children}</div>

      {caption && (
        <div className={cn(ueCaption(), "border-t border-[color:var(--uekit-window-border)] bg-[color:var(--uekit-background)] px-3 py-2 text-left")}>
          {caption}
        </div>
      )}
    </div>
  );
}

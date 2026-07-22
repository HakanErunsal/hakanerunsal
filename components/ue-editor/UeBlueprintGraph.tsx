import { cn } from "@/lib/utils";
import { UE_BP_NODE } from "./ue-blueprint-theme";

interface UeBlueprintGraphProps {
  children: React.ReactNode;
  className?: string;
  /** Show major/minor grid like GraphPanel */
  grid?: boolean;
  /** Padding class for the content wrapper. Default p-6. */
  bodyClassName?: string;
}

/** Blueprint graph canvas — dark grid background for node layouts */
export function UeBlueprintGraph({
  children,
  className,
  grid = true,
  bodyClassName,
}: UeBlueprintGraphProps) {
  return (
    <div
      className={cn("ue-bp-graph relative overflow-auto rounded-[2px] border border-[#0F0F0F]", className)}
      style={{ backgroundColor: UE_BP_NODE.graphBg }}
    >
      {grid && <div className="ue-bp-graph__grid pointer-events-none absolute inset-0" aria-hidden />}
      <div className={cn("relative p-6", bodyClassName)}>{children}</div>
    </div>
  );
}

interface UeBlueprintCommentProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
  color?: string;
}

/** Blueprint comment / group box behind nodes */
export function UeBlueprintComment({
  title,
  children,
  className,
  color = "rgba(255, 255, 255, 0.04)",
}: UeBlueprintCommentProps) {
  return (
    <div
      className={cn("ue-bp-comment relative rounded-sm border border-[#383838]/60 p-4", className)}
      style={{ backgroundColor: color }}
    >
      <div className="mb-3 text-[14px] font-normal text-[#C0C0C0]/90">{title}</div>
      {children}
    </div>
  );
}

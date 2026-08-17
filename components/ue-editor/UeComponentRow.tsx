import { cn } from "@/lib/utils";
import { UeActorComponentIcon } from "./icons/UeIcons";

interface UeComponentRowProps {
  /** Display name shown in the Components panel, e.g. "Reaction Set Component" */
  displayName: string;
  /** C++ class name in parentheses, e.g. "ReactionSetComponent" */
  componentClass?: string;
  selected?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Components panel list row — matches UE Blueprint editor component list:
 * [ActorComponent icon] Display Name (ClassName)
 *
 * Reference: SCS.Component brush → ActorComponent_16.svg
 */
export function UeComponentRow({
  displayName,
  componentClass,
  selected = false,
  className,
  onClick,
}: UeComponentRowProps) {
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      data-selected={selected}
      className={cn(
        "ue-component-row flex w-full items-center gap-1.5 px-1.5 py-0.5 text-left",
        selected && "ue-component-row-selected",
        onClick && "cursor-pointer",
        className,
      )}
    >
      <UeActorComponentIcon className="h-4 w-4 shrink-0" />
      <span className="min-w-0 truncate text-[13px] leading-none text-[color:var(--uekit-foreground-header)]">
        {displayName}
      </span>
    </Tag>
  );
}

import { cn } from "@/lib/utils";
import { getVariableTypeColor, type UeVariableType } from "./ue-blueprint-theme";

interface UeVariableTypePillProps {
  type: UeVariableType;
  /** Override tint — e.g. custom object subclass color */
  color?: string;
  className?: string;
}

/**
 * My Blueprint type pill — Kismet.VariableList.TypeIcon (Starship/Blueprints/pill)
 * tinted with GetPinTypeColor().
 */
export function UeVariableTypePill({ type, color, className }: UeVariableTypePillProps) {
  const tint = color ?? getVariableTypeColor(type);

  return (
    <span
      className={cn("ue-var-pill shrink-0", className)}
      style={{ "--pill-color": tint } as React.CSSProperties}
      title={type}
      aria-hidden
    />
  );
}

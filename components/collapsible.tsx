import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface CollapsibleProps {
  /** Header text shown on the closed drawer. */
  title: string;
  /** Small tag on the left of the title. Defaults to "C++". Pass "" to hide. */
  badge?: string;
  /** Open on load. Defaults to closed, so complex detail stays out of the way. */
  defaultOpen?: boolean;
  children?: ReactNode;
}

/** Per-tag badge colors so C++ and Advanced drawers read as distinct groups. */
const badgeStyles: Record<string, string> = {
  "C++": "bg-primary/10 text-primary",
  Advanced: "bg-amber-400/10 text-amber-500",
  Alternative: "bg-emerald-400/10 text-emerald-500",
};

/**
 * Collapsed-by-default drawer for detail most readers can skip (C++ internals,
 * advanced setup). Built on native <details>, so it works without client JS.
 */
export function Collapsible({ title, badge = "C++", defaultOpen = false, children }: CollapsibleProps) {
  return (
    <details
      open={defaultOpen}
      className={cn(
        "group my-6 w-full overflow-hidden rounded border border-border/60 bg-muted/20",
      )}
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium select-none hover:bg-muted/40 [&::-webkit-details-marker]:hidden">
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
        {badge && (
          <span
            className={cn(
              "rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide",
              badgeStyles[badge] ?? "bg-muted text-muted-foreground",
            )}
          >
            {badge}
          </span>
        )}
        <span className="text-foreground/90">{title}</span>
      </summary>
      <div className="border-t border-border/60 px-4 py-3">{children}</div>
    </details>
  );
}

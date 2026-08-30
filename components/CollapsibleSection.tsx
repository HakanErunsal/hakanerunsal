import { cn } from "@/lib/utils";
import { collapsibleSlug } from "@/lib/collapsible-slug";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface CollapsibleSectionProps {
  /** Section title. Rendered as the h2, and its slug becomes the anchor id. */
  title: string;
  /** One-line lead-in shown next to the title while the section is closed. */
  summary?: string;
  /** Open on load. Defaults to open, so an article still reads top to bottom. */
  defaultOpen?: boolean;
  children?: ReactNode;
}

/**
 * A top-level article part the reader can fold away.
 *
 * Built on native <details>, so it works without client JS and keeps its
 * headings in the DOM while closed. That matters twice over: DocsPageTOC
 * collects h2/h3 on mount, and browsers expand a closed <details> when you
 * navigate to a fragment inside it, so TOC links into a folded part still land.
 */
export function CollapsibleSection({
  title,
  summary,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  return (
    <details
      open={defaultOpen}
      className="ue-collapsible-section group my-10 border-t border-border/60"
    >
      <summary
        className={cn(
          "flex cursor-pointer list-none items-baseline gap-2.5 pt-4 select-none",
          "[&::-webkit-details-marker]:hidden",
        )}
      >
        <ChevronRight
          className={cn(
            "ue-collapsible-arrow mt-1 h-5 w-5 shrink-0 text-muted-foreground",
            "transition-transform group-open:rotate-90",
          )}
        />
        <span className="min-w-0 flex-1">
          <h2
            id={collapsibleSlug(title)}
            className="m-0"
          >
            {title}
          </h2>
          {summary ? (
            <span className="ue-collapsible-lead mt-1 block text-sm text-muted-foreground group-open:hidden">
              {summary}
            </span>
          ) : null}
        </span>
      </summary>
      <div className="pt-2">{children}</div>
    </details>
  );
}

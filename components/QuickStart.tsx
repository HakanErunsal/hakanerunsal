import { cn } from "@/lib/utils";
import { ReactNode, ReactElement, Children, cloneElement, isValidElement } from "react";

interface QuickStartProps {
  /** Heading on the card. Defaults to the framing every system page opens with. */
  title?: string;
  /** How long the recipe takes to follow, shown as a pill next to the heading. */
  time?: string;
  /** Anchor id, so the heading reaches the page contents list and deep links resolve. */
  id?: string;
  children?: ReactNode;
}

interface QuickStepProps {
  /** The imperative one-liner: what the designer does. */
  title: string;
  /** Filled in by QuickStart. */
  index?: number;
  /** Filled in by QuickStart. Ends the connector line. */
  isLast?: boolean;
  children?: ReactNode;
}

/** One numbered step, with its detail and any clip underneath. */
export function QuickStep({ title, index, isLast, children }: QuickStepProps) {
  return (
    <li className="relative pb-6 pl-11 last:pb-0">
      <span
        className={cn(
          "absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full",
          "border border-primary/40 bg-primary/10 font-mono text-[13px] font-semibold text-primary",
        )}
      >
        {index}
      </span>
      {!isLast && <span className="absolute bottom-0 left-[13.5px] top-8 w-px bg-border/70" />}
      <p className="m-0 text-[15px] font-semibold leading-7 text-foreground">{title}</p>
      {children && <div className="quickstep-body mt-1 text-sm text-muted-foreground">{children}</div>}
    </li>
  );
}

/**
 * The recipe that opens a system page: the shortest path from an empty project
 * to the system running. Everything below it on the page is tuning.
 */
export function QuickStart({ title = "Set it up", time, id = "set-it-up", children }: QuickStartProps) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<QuickStepProps>[];
  const steps = items.map((child, i) =>
    cloneElement(child, { index: i + 1, isLast: i === items.length - 1, key: i }),
  );

  return (
    <section className="not-prose my-8 overflow-hidden rounded border border-primary/30 bg-primary/[0.03]">
      <header className="flex items-center justify-between gap-3 border-b border-primary/20 bg-primary/[0.06] px-5 py-3">
        <h2 id={id} className="m-0 scroll-mt-24 font-heading text-base font-semibold text-foreground">
          {title}
        </h2>
        {time && (
          <span className="whitespace-nowrap rounded-full border border-primary/30 px-2.5 py-0.5 font-mono text-[11px] text-primary">
            {time}
          </span>
        )}
      </header>
      <ol className="m-0 list-none p-5">{steps}</ol>
    </section>
  );
}

export default QuickStart;

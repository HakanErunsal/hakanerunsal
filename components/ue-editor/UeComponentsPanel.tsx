import { cn } from "@/lib/utils";
import { UeAssetIcon } from "./UeAssetIcon";
import { UeComponentRow } from "./UeComponentRow";
import { UePanel } from "./UePanel";

export interface UeComponentsPanelEntry {
  /** Display name shown in the Components panel, e.g. "SEC Action Set Component". */
  displayName: string;
  /** Class name in parentheses, matching what the editor prints beside the display name. */
  componentClass?: string;
  /** True when the actor already carries this one, so the reader adds nothing. */
  inherited?: boolean;
  /** Nesting under the row above, matching the attachment the Components panel draws. 0 sits directly under the actor. */
  depth?: number;
}

export interface UeComponentsPanelProps {
  /** Actor the panel belongs to, shown as the root row. */
  actor: string;
  /** Rows beneath the root, in the order the panel lists them. */
  components: UeComponentsPanelEntry[];
  /** Caption under the panel. */
  caption?: React.ReactNode;
  className?: string;
}

/** Components panel from the Blueprint editor: the Add button, the actor as the root row, and the component list beneath it. Rows the reader adds by hand carry an Add tag; inherited rows carry nothing. */
export function UeComponentsPanel({ actor, components, caption, className }: UeComponentsPanelProps) {
  return (
    <div className={cn("my-6 max-w-[440px]", className)}>
      <UePanel title="Components" showTitleIcon={false} compact bodyClassName="p-0" caption={caption}>
        <div className="flex items-center gap-2 border-b border-[color:var(--uekit-window-border)] bg-[color:var(--uekit-background)] px-2 py-1">
          <span className="rounded-sm bg-[color:var(--uekit-primary)] px-2 py-0.5 text-[12px] font-medium text-[color:var(--uekit-foreground-header)]">
            + Add
          </span>
        </div>

        <div className="bg-[color:var(--uekit-recessed)] py-1">
          <div className="flex items-center gap-1.5 px-1.5 py-0.5">
            <UeAssetIcon type="blueprint" showLabel={false} className="shrink-0" />
            <span className="min-w-0 truncate text-[15px] leading-none text-[color:var(--uekit-foreground-header)]">
              {actor} <span className="text-[color:var(--uekit-foreground)]">(Self)</span>
            </span>
          </div>

          <div className="mt-0.5 border-l border-[color:var(--uekit-window-border)] pl-3 ml-3">
            {components.map((entry) => (
              <div
                key={entry.displayName}
                className={cn(
                  "flex items-center justify-between gap-2 pr-2",
                  entry.inherited && "opacity-40",
                  entry.depth ? "ml-3 border-l border-[color:var(--uekit-window-border)] pl-3" : undefined,
                )}
              >
                <UeComponentRow displayName={entry.displayName} componentClass={entry.componentClass} />
                {!entry.inherited && (
                  <span className="shrink-0 text-[11px] uppercase tracking-wide text-[color:var(--uekit-primary)]">
                    Add
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </UePanel>
    </div>
  );
}

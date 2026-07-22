import { cn } from "@/lib/utils";

/**
 * UE 5.8 Details panel template.
 *
 * Renders C++ UPROPERTY fields the way the editor shows them: grouped by their
 * `Category` metadata, one collapsible section per category, a label column and a
 * value widget column per row. This mirrors public component variables set in the
 * Details panel. It is NOT the My Blueprint variable list.
 *
 * Drive it with a `UeDetailCategory[]` schema. Numeric rows compute their spin-box
 * fill from value/min/max, matching a UPROPERTY with ClampMin/ClampMax.
 */

export type UeDetailValue =
  | { kind: "bool"; value: boolean }
  | { kind: "number"; value: number; min?: number; max?: number; decimals?: number }
  | { kind: "enum"; value: string }
  | { kind: "asset"; value?: string }
  | { kind: "text"; value: string }
  /** FGameplayTagContainer: count label plus listed tags when non-empty. */
  | { kind: "tagContainer"; tags: string[] };

export interface UeDetailProperty {
  label: string;
  value: UeDetailValue;
  /** Greyed out, as when an EditCondition is false. */
  disabled?: boolean;
}

export interface UeDetailCategory {
  title: string;
  defaultOpen?: boolean;
  properties?: UeDetailProperty[];
  /** Sub-categories authored as `Category = "Parent|Child"`. */
  children?: UeDetailCategory[];
}

/** Static downward triangle (combo boxes, asset pickers). */
function Triangle() {
  return (
    <svg className="h-2.5 w-2.5 shrink-0 text-[#9a9a9a]" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
      <path d="M1 3 L9 3 L5 8 Z" />
    </svg>
  );
}

/** Section triangle that rotates with the native <details> open state via CSS. */
function SectionTriangle() {
  return (
    <svg
      className="h-2.5 w-2.5 shrink-0 -rotate-90 text-[#9a9a9a] transition-transform group-open:rotate-0"
      viewBox="0 0 10 10"
      fill="currentColor"
      aria-hidden
    >
      <path d="M1 3 L9 3 L5 8 Z" />
    </svg>
  );
}

function UeCheckbox({ checked, disabled }: { checked: boolean; disabled?: boolean }) {
  return (
    <span
      className={cn("ue-dp-check inline-flex h-[15px] w-[15px] items-center justify-center", disabled && "opacity-50")}
      data-checked={checked}
      aria-hidden
    >
      {checked && (
        <svg viewBox="0 0 12 12" className="h-[11px] w-[11px] text-[#e2e2e2]" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2.5 6.2 L4.8 8.6 L9.5 3.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

function formatNumber(v: number, decimals?: number) {
  if (decimals != null) return v.toFixed(decimals);
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

function UeNumericField({
  value,
  min,
  max,
  decimals,
  disabled,
}: {
  value: number;
  min?: number;
  max?: number;
  decimals?: number;
  disabled?: boolean;
}) {
  const hasRange = min != null && max != null && max > min;
  const fill = hasRange ? Math.min(1, Math.max(0, (value - min!) / (max! - min!))) : 0;
  return (
    <div className={cn("ue-dp-num relative flex items-center", disabled && "opacity-50")}>
      {hasRange && <div className="ue-dp-num-fill absolute inset-y-0 left-0" style={{ width: `${fill * 100}%` }} aria-hidden />}
      <span className="relative pl-1.5 text-[11px] text-[#c9c9c9]">{formatNumber(value, decimals)}</span>
    </div>
  );
}

function UeComboField({ value, disabled }: { value: string; disabled?: boolean }) {
  return (
    <div className={cn("ue-dp-combo relative flex items-center justify-between gap-1 pl-1.5 pr-1", disabled && "opacity-50")}>
      <span className="truncate text-[11px] leading-[18px] text-[#c9c9c9]">{value}</span>
      <Triangle />
    </div>
  );
}

function UeTagContainerField({ tags }: { tags: string[] }) {
  const count = tags.length;
  const countLabel = count === 1 ? "1 Gameplay Tag" : `${count} Gameplay Tags`;

  if (count === 0) {
    return <span className="text-[11px] text-[#888888]">0 Gameplay Tags</span>;
  }

  return (
    <div className="ue-dp-tag-container flex min-w-0 flex-col gap-1 py-0.5">
      <div className="ue-dp-combo flex items-center justify-between gap-1 pl-1.5 pr-1">
        <span className="text-[11px] leading-[18px] text-[#c9c9c9]">{countLabel}</span>
        <Triangle />
      </div>
      {tags.map((tag) => (
        <div key={tag} className="ml-4 border-l border-[#3a3a3f] pl-2">
          <span className="ue-dp-tag-name font-mono text-[10px] leading-snug text-[#7ec8e3]">{tag}</span>
        </div>
      ))}
    </div>
  );
}

function UeValueWidget({ value }: { value: UeDetailValue }) {
  switch (value.kind) {
    case "bool":
      return <UeCheckbox checked={value.value} />;
    case "number":
      return <UeNumericField value={value.value} min={value.min} max={value.max} decimals={value.decimals} />;
    case "enum":
      return <UeComboField value={value.value} />;
    case "asset":
      return (
        <div className="ue-dp-asset flex items-center justify-between gap-1 rounded-full px-2">
          <span className="truncate text-[11px] leading-[18px] text-[#c9c9c9]">{value.value ?? "None"}</span>
          <Triangle />
        </div>
      );
    case "tagContainer":
      return <UeTagContainerField tags={value.tags} />;
    case "text":
      return <span className="text-[11px] text-[#c9c9c9]">{value.value}</span>;
  }
}

function PropertyRow({ property, indent }: { property: UeDetailProperty; indent: number }) {
  const isTagContainer = property.value.kind === "tagContainer";

  return (
    <div
      className={cn(
        "ue-dp-row flex min-h-[26px]",
        isTagContainer ? "items-start py-1" : "items-center",
        property.disabled && "ue-dp-row--disabled",
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center text-[11px] text-[#a9a9a9]",
          isTagContainer && "pt-0.5",
        )}
        style={{ width: "56%", paddingLeft: indent }}
      >
        <span className="truncate">{property.label}</span>
      </div>
      <div
        className={cn(
          "ue-dp-value flex min-w-0 flex-1 pr-4",
          isTagContainer ? "items-start" : "items-center",
        )}
      >
        <UeValueWidget value={property.value} />
      </div>
    </div>
  );
}

function Category({ category, level }: { category: UeDetailCategory; level: number }) {
  const headerPad = 8 + level * 12;
  const rowIndent = 22 + level * 12;
  return (
    <details open={category.defaultOpen ?? true} className="ue-dp-section group">
      <summary
        className="ue-dp-header flex cursor-pointer list-none items-center gap-1.5 text-[11px] text-[#c8c8c8] select-none [&::-webkit-details-marker]:hidden"
        style={{ paddingLeft: headerPad }}
      >
        <SectionTriangle />
        <span className="truncate">{category.title}</span>
      </summary>
      <div>
        {category.properties?.map((p) => (
          <PropertyRow key={p.label} property={p} indent={rowIndent} />
        ))}
        {category.children?.map((c) => (
          <Category key={c.title} category={c} level={level + 1} />
        ))}
      </div>
    </details>
  );
}

export function UeDetailsPanel({ categories, className }: { categories: UeDetailCategory[]; className?: string }) {
  return (
    <div className={cn("ue-dp not-prose overflow-hidden rounded-[2px] border border-[#0d0d0d]", className)}>
      {categories.map((c) => (
        <Category key={c.title} category={c} level={0} />
      ))}
    </div>
  );
}

//=========================================================================
// Template data: UMovementEvaluatorComponent defaults
// Verified against Plugins/SoulslikeEnemyCombat/.../MovementEvaluatorComponent.h
//=========================================================================

const b = (value: boolean): UeDetailValue => ({ kind: "bool", value });
const n = (value: number, min?: number, max?: number, decimals?: number): UeDetailValue => ({
  kind: "number",
  value,
  min,
  max,
  decimals,
});
const tagContainer = (tags: string[]): UeDetailValue => ({ kind: "tagContainer", tags });

export const MOVEMENT_EVALUATOR_DETAILS: UeDetailCategory[] = [
  {
    title: "Movement Evaluator",
    properties: [
      { label: "Apply Movement Input", value: b(true) },
      { label: "Num Samples", value: n(16, 4, 32, 0) },
      { label: "Distance Tolerance", value: n(0.2, 0.05, 0.5) },
      { label: "Direction Smoothness", value: n(8, 0, 50) },
      { label: "Direction Change Penalty", value: n(1, 0, 5) },
      { label: "Speed Dead Zone", value: n(0.1, 0, 0.5) },
      { label: "Target Position Smoothness", value: n(5, 0, 20) },
      { label: "Use Pivot Smoothing", value: b(true) },
    ],
    children: [
      {
        title: "Strafe",
        properties: [
          { label: "Auto Strafe Swap", value: b(true) },
          { label: "Strafe Swap Threshold", value: n(3, 1.1, 3) },
          { label: "Strafe Swap Cooldown", value: n(2, 0.5, 5) },
          { label: "Strafe Speed Penalty", value: n(0.75, 0, 1) },
          { label: "Strafe Penalty Threshold", value: n(0.64, 0.1, 1) },
          { label: "Strafe Preference Weight", value: n(1, 0, 2) },
          { label: "Close Range Retreat Bias", value: n(0.5, 0, 1) },
        ],
      },
      {
        title: "Strafe Time Limits",
        properties: [
          { label: "Enable Strafe Time Limit", value: b(true) },
          { label: "Strafe Time Limit", value: n(5, 1, 30) },
          { label: "Strafe Time Limit Fluctuation", value: n(2.5, 0, 15) },
          { label: "Rest After Strafe Swap", value: b(false) },
          { label: "Strafe Swap Rest Time", value: n(0.5, 0.1, 5), disabled: true },
          { label: "Strafe Swap Rest Fluctuation", value: n(0.25, 0, 3), disabled: true },
        ],
      },
      {
        title: "Strafe Rest",
        properties: [
          { label: "Enable Strafe Rest", value: b(true) },
          { label: "Strafe Rest Time Limit", value: n(10, 3, 60) },
          { label: "Strafe Rest Time Limit Fluctuation", value: n(4, 0, 30) },
          { label: "Strafe Rest Duration", value: n(1.5, 0.5, 10) },
          { label: "Strafe Rest Duration Fluctuation", value: n(0.5, 0, 5) },
        ],
      },
      {
        title: "Avoidance",
        defaultOpen: false,
        properties: [
          { label: "Enable Avoidance", value: b(true) },
          { label: "Avoidance Radius", value: n(100, 50, 1000) },
          { label: "Avoidance Weight", value: n(0.4, 0, 2) },
          { label: "Avoidance Slip Bonus", value: n(0.75, 0, 2) },
          { label: "Velocity Aware Avoidance", value: b(true) },
          { label: "Momentum Bias", value: n(0.7, 0, 1) },
        ],
      },
      {
        title: "Nav Sampling",
        defaultOpen: false,
        properties: [
          { label: "Enable Nav Aware Sampling", value: b(true) },
          { label: "Nav Probe Distance", value: n(120, 30, 600) },
          { label: "Nav Score Weight", value: n(1, 0, 1) },
          { label: "Nav Blocked Floor", value: n(0.05, 0, 0.5) },
          { label: "Guard Ledge Drops", value: b(true) },
          { label: "Nav Edge Speed Floor", value: n(0.15, 0, 1) },
        ],
      },
      {
        title: "Stuck Detection",
        defaultOpen: false,
        properties: [
          { label: "Enable Stuck Detection", value: b(true) },
          { label: "Stuck Velocity Threshold", value: n(50, 10, 200) },
          { label: "Stuck Time Threshold", value: n(0.5, 0.1, 5) },
          { label: "Stuck Check Interval", value: n(0.2, 0.1, 1) },
        ],
      },
      {
        title: "Direction Blending",
        defaultOpen: false,
        properties: [
          { label: "Direction Blend Count", value: n(3, 1, 5, 0) },
          { label: "Direction Blend Min Score Ratio", value: n(0.7, 0, 1) },
        ],
      },
      {
        title: "Hybrid Movement",
        properties: [
          { label: "Enable Hybrid Movement", value: b(true) },
          { label: "Hybrid Switch Distance", value: n(800, 200, 3000) },
          { label: "Hybrid Switch Hysteresis", value: n(100, 0, 300) },
        ],
        children: [
          {
            title: "Detour",
            properties: [
              { label: "Enable Detour Escalation", value: b(true) },
              { label: "Detour Enter Ratio", value: n(1.6, 1.1, 5) },
              { label: "Detour Min Excess", value: n(200, 0, 2000) },
              { label: "Detour Recheck Interval", value: n(0.5, 0.1, 3) },
              { label: "Detour Use Line Of Sight Pre Gate", value: b(true) },
              { label: "Detour Line Of Sight Channel", value: { kind: "enum", value: "Visibility" } },
              { label: "Detour Escalate On Stall", value: b(true) },
              { label: "Detour Stall Speed", value: n(60, 0, 300) },
            ],
          },
        ],
      },
    ],
  },
];

//=========================================================================
// Template data: UMovementBehaviorProfile defaults (the role-swappable asset)
// Verified against Plugins/SoulslikeEnemyCombat/.../MovementBehaviorProfile.h
//=========================================================================

export const MOVEMENT_PROFILE_DETAILS: UeDetailCategory[] = [
  {
    title: "Distance",
    properties: [
      { label: "Desired Distance", value: n(400) },
      { label: "Distance Tolerance", value: n(0.2, 0.05, 0.5) },
    ],
  },
  {
    title: "Rest Behavior",
    properties: [
      { label: "Enable Strafe Rest", value: b(true) },
      { label: "Strafe Rest Time Limit", value: n(10, 3, 60) },
      { label: "Strafe Rest Duration", value: n(1.5, 0.5, 10) },
    ],
  },
  {
    title: "Threat Response",
    properties: [
      { label: "Swap Strafe On High Threat", value: b(false) },
      { label: "Adjust Distance By Threat", value: b(false) },
      // EditCondition bAdjustDistanceByThreat is false by default, so this is greyed out.
      { label: "Threat Distance Scale", value: n(1, 0, 5), disabled: true },
    ],
  },
  {
    title: "Positioning Rules",
    properties: [{ label: "Positioning Rules", value: { kind: "text", value: "0 Array elements" } }],
  },
];

//=========================================================================
// Template data: FActionCooldown defaults (the action's Cooldown group)
// Verified against Plugins/SoulslikeEnemyCombat/.../Abilities/ActionSet.h
//=========================================================================

export const ACTION_COOLDOWN_DETAILS: UeDetailCategory[] = [
  {
    title: "Cooldown",
    properties: [
      // ClampMin 0, no ClampMax -> no fill bar (unbounded), Units s.
      { label: "Cooldown Duration", value: n(5) },
      { label: "Initial Cooldown", value: n(0) },
      // ClampMin 0, ClampMax 0.5 -> fill bar.
      { label: "Randomization (%)", value: n(0.2, 0, 0.5) },
      // ClampMin 0, ClampMax 1 -> fill bar.
      { label: "Spawn Cooldown Chance", value: n(0, 0, 1) },
      // int32, no clamp -> no fill bar. -1 is unlimited.
      { label: "Max Consecutive Uses", value: n(-1, undefined, undefined, 0) },
    ],
  },
];

//=========================================================================
// Template data: FRangeEval on a Distance Scorer (melee preset default)
// Verified against Plugins/SoulslikeEnemyCombat/.../Abilities/ActionSet.h
// Distance Scorer's Range defaults to MakeMeleeRange() = 0/100/250/500.
//=========================================================================

export const RANGE_EVAL_DETAILS: UeDetailCategory[] = [
  {
    title: "Range",
    properties: [
      // Bounds are ClampMin 0 with no ClampMax -> no fill bar.
      { label: "Min Value", value: n(0) },
      { label: "Optimal Min", value: n(100) },
      { label: "Optimal Max", value: n(250) },
      { label: "Max Value", value: n(500) },
      // ClampMin 0.1, ClampMax 10 -> fill bar.
      { label: "Exponent", value: n(2, 0.1, 10) },
      { label: "Clamp To Zero", value: b(true) },
    ],
  },
];

//=========================================================================
// Template data: FReactionSpec groups (ReactionSet.h)
// Verified against Plugins/SoulslikeEnemyCombat/.../Abilities/ReactionSet.h
//=========================================================================

export const REACTION_IDENTITY_DETAILS: UeDetailCategory[] = [
  {
    title: "Identity",
    properties: [
      { label: "Enabled", value: b(true) },
      { label: "Reaction ID", value: { kind: "text", value: "Parry" } },
      { label: "Reaction Category", value: { kind: "text", value: "None" } },
    ],
  },
];

export const REACTION_EXECUTION_DETAILS: UeDetailCategory[] = [
  {
    title: "Execution",
    properties: [
      { label: "Ability Class", value: { kind: "asset", value: "None" } },
      { label: "Activation Mode", value: { kind: "enum", value: "By Event" } },
      { label: "Ability Tag", value: { kind: "text", value: "None" } },
      { label: "Ability End Tag", value: { kind: "text", value: "None" } },
      { label: "Ability Timeout", value: n(0) },
    ],
  },
];

export const REACTION_TAGS_DETAILS: UeDetailCategory[] = [
  {
    title: "Tags",
    properties: [
      { label: "Add Tags", value: tagContainer([]) },
      { label: "Requires Tags", value: tagContainer([]) },
      { label: "Block Tags", value: tagContainer([]) },
    ],
  },
];

/** Tags subset checked by PassesReactionGates (RequiresTags / BlockTags on the ASC). */
export const REACTION_GATE_TAGS_DETAILS: UeDetailCategory[] = [
  {
    title: "Tags",
    properties: [
      { label: "Requires Tags", value: tagContainer([]) },
      { label: "Block Tags", value: tagContainer([]) },
    ],
  },
];

const REACTION_ACTIVE = "SEC.State.ReactionActive";

/** Parry: marks itself active; nothing blocked. */
export const REACTION_BLOCKING_PARRY_TAGS: UeDetailCategory[] = [
  {
    title: "Tags",
    properties: [
      { label: "Add Tags", value: tagContainer([REACTION_ACTIVE]) },
      { label: "Requires Tags", value: tagContainer([]) },
      { label: "Block Tags", value: tagContainer([]) },
    ],
  },
];

/** Dodge: same active tag, but blocked while ReactionActive is already on the ASC. */
export const REACTION_BLOCKING_DODGE_TAGS: UeDetailCategory[] = [
  {
    title: "Tags",
    properties: [
      { label: "Add Tags", value: tagContainer([REACTION_ACTIVE]) },
      { label: "Requires Tags", value: tagContainer([]) },
      { label: "Block Tags", value: tagContainer([REACTION_ACTIVE]) },
    ],
  },
];

/** @deprecated Use REACTION_BLOCKING_PARRY_TAGS / REACTION_BLOCKING_DODGE_TAGS */
export const REACTION_BLOCKING_TAGS_EXAMPLE = REACTION_BLOCKING_DODGE_TAGS;

export const REACTION_SCORING_DETAILS: UeDetailCategory[] = [
  {
    title: "Scoring",
    properties: [
      { label: "Priority", value: n(0, undefined, undefined, 0) },
      { label: "Selection Weight", value: n(1, 0.01) },
      { label: "Scoring", value: { kind: "text", value: "0 Array elements" } },
    ],
  },
];

export const REACTION_ACTION_INTERACTION_DETAILS: UeDetailCategory[] = [
  {
    title: "Action Interaction",
    properties: [{ label: "Cancel Current Action", value: b(true) }],
  },
];

/** Editor fields that feed PassesReactionGates: Enabled, ASC tag gates, cooldown struct. */
export const REACTION_PRECONDITION_DETAILS: UeDetailCategory[] = [
  {
    title: "Identity",
    properties: [{ label: "Enabled", value: b(true) }],
  },
  ...REACTION_GATE_TAGS_DETAILS,
  ...ACTION_COOLDOWN_DETAILS,
];

export const REACTION_SPEC_DETAILS: UeDetailCategory[] = [
  ...REACTION_IDENTITY_DETAILS,
  ...REACTION_EXECUTION_DETAILS,
  ...REACTION_TAGS_DETAILS,
  ...REACTION_SCORING_DETAILS,
  ...REACTION_ACTION_INTERACTION_DETAILS,
];

//=========================================================================
// Template data: UEnemyAIConfig combat role fields
// Verified against Plugins/SoulslikeEnemyCombat/.../AI/EnemyAIConfig.h
// and FAIRoleRegistrationParams in AICombatRoleTypes.h
//=========================================================================

export const COMBAT_ROLE_CONFIG_DETAILS: UeDetailCategory[] = [
  {
    title: "Combat Role",
    properties: [
      { label: "Auto-Register for Combat Roles", value: b(true) },
      { label: "Allowed Roles (empty = any)", value: tagContainer([]) },
      { label: "Priority", value: n(0, 0, 1000, 0) },
      { label: "Preferred Role", value: { kind: "text", value: "None" } },
      { label: "Fitness Evaluators", value: { kind: "text", value: "0 Array elements" } },
      { label: "Target Selector", value: { kind: "asset", value: "None" } },
      { label: "Ignore Target Redistribution", value: b(false) },
    ],
  },
];

//=========================================================================
// Template data: USoulslikeEnemyCombatSettings timing fields
// Verified against SoulslikeEnemyCombatSettings.h
//=========================================================================

export const COMBAT_ROLE_TIMING_DETAILS: UeDetailCategory[] = [
  {
    title: "Timing",
    properties: [
      { label: "Role Reassignment Interval", value: n(8) },
      { label: "Min Time In Role", value: n(8) },
      { label: "Re-evaluate Targets On Reassignment", value: b(false) },
    ],
  },
];

//=========================================================================
// Template data: UDistanceRoleEvaluator / UCooldownRoleEvaluator
// Verified against Plugins/SoulslikeEnemyCombat/.../Subsystems/RoleEvaluator.h
//=========================================================================

export const DISTANCE_ROLE_EVALUATOR_DETAILS: UeDetailCategory[] = [
  {
    title: "Affected Roles",
    properties: [
      { label: "Role Influence Weights", value: { kind: "text", value: "SEC.Role.Attacker → 1.0" } },
      { label: "Influence On Unlisted Roles", value: n(0, 0, 1) },
    ],
  },
  {
    title: "Scoring",
    properties: [{ label: "Score Mode", value: { kind: "enum", value: "Higher Score = Better Fit" } }],
  },
  {
    title: "Distance Settings",
    properties: [
      { label: "Ideal Distance", value: n(0) },
      { label: "Effective Range", value: n(2000, 1) },
    ],
  },
];

export const COOLDOWN_ROLE_EVALUATOR_DETAILS: UeDetailCategory[] = [
  {
    title: "Affected Roles",
    properties: [
      { label: "Role Influence Weights", value: { kind: "text", value: "0 Map elements" } },
      { label: "Influence On Unlisted Roles", value: n(0, 0, 1) },
    ],
  },
  {
    title: "Scoring",
    properties: [{ label: "Score Mode", value: { kind: "enum", value: "Higher Score = Better Fit" } }],
  },
  {
    title: "Cooldown Settings",
    properties: [{ label: "Current Role Penalty", value: n(0.5, 0, 1) }],
  },
];

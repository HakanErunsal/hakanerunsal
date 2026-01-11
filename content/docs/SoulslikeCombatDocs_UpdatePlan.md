---
title: "Documentation Update Plan: Soulslike Enemy Combat"
date: 2026-01-08
description: "Plan for updating documentation to reflect recent API changes and AI Config integration."
---

# Documentation Update Plan

## Overview
This document outlines the necessary updates to the **SoulslikeEnemyCombat** documentation. The focus is on the new **Data-Driven Architecture** where `UEnemyAIConfig` drives both Movement and Action behaviors based on the active Combat Role.

## Affected Documentation Pages

| Page | URL | Status | Description of Changes |
| :--- | :--- | :--- | :--- |
| **Combat Roles** | `/docs/soulslike-combat/combat-roles` | Needs Update | Add "Runtime Configuration" (API) and "Role Syncing" (Library) sections. |
| **Movement System** | `/docs/soulslike-combat/movement-system` | Needs Update | Explain `UEnemyAIConfig` integration via `MovementEvaluatorComponent::SyncForCombatRole`. |
| **Action System** | `/docs/soulslike-combat/action-system` | Needs Update | Introduce `USECActionSetComponent` as the driver for role-based Action Set switching. |
| **Configuration** | `/docs/soulslike-combat/configuration` | **New/Update** | detailed breakdown of `UEnemyAIConfig` and its role in binding Roles to Assets. |

---

## 1. Combat Roles (`combat-roles.mdx`)

### New Section: Runtime Configuration
Document the Blueprint API in `AICombatRoleSubsystem` for dynamic control:
*   `SetReassignmentInterval`, `SetMinTimeInRole`
*   `ForceAssignRole`, `UnlockRole`
*   `ForceReassignment`, `UpdateConfig`

### New Section: Role Switching & Syncing
Explain how to synchronize components when the role changes.
*   **Automatic:** `AEnemyControllerBase` handles this automatically.
*   **Manual (Custom Controllers):** Use the new **`SECCombatRoleSyncLibrary`**.
    *   `SyncAllForCombatRole(Controller, Pawn, RoleTag, Config)`: Syncs both movement and actions.
    *   `SyncActionSetForRole(Pawn, RoleTag)`: Syncs only actions.
    *   `SyncMovementProfileForRole(Controller, RoleTag, Config)`: Syncs only movement.

---

## 2. Movement System (`movement-system.mdx`)

### Updated Workflow: AI Config Integration
Clarify that `MovementBehaviorProfile` is now typically assigned via `UEnemyAIConfig`.

*   **Logic:** `MovementEvaluatorComponent::SyncForCombatRole` relies on `UEnemyAIConfig::GetMovementProfileForRole`.
*   **Setup:**
    1.  Create `MovementBehaviorProfile` assets (e.g., Aggressive, Defensive).
    2.  Open `UEnemyAIConfig`.
    3.  Map Roles (e.g., `SEC.Role.Attacker`) to Profiles.
*   **Fallback:** If `bManageMovementProfilesAutomatically` is false, it behaves as before (manual assignment).

---

## 3. Action System (`action-system.mdx`)

### New Component: `USECActionSetComponent`
Introduce this component as the bridge between the Role System and the `ActionEvaluationComponent`.

*   **Purpose:** Monitors role changes and swaps the `ActionSet`.
*   **Location:** Placed on the **Pawn**.
*   **Logic:**
    1.  `SyncForCombatRole` is called (usually by the Sync Library or Base Controller).
    2.  It resolves the correct `UActionSet` by checking:
        *   **Runtime Override** (Highest Priority)
        *   **Equipped Weapon** (via `ISECWeaponActionSetProvider`)
        *   **AI Config Role Mapping**
        *   **AI Config Default**
    3.  It calls `ActionEvaluationComponent::SetActionSetAndResetState` on the Controller.
*   **Key Benefit:** Allows "Weapon-driven" or "Role-driven" ability sets (e.g., switching weapons changes available moves).

---

## 4. Configuration (`configuration.mdx`)

### Deep Dive: `UEnemyAIConfig`
This asset is now central to the plugin.

*   **Role Settings:** Limits, Priorities, Fitness Evaluators.
*   **Action Sets:** Map Roles -> ActionSets (or rely on Defaults).
*   **Movement Profiles:** Map Roles -> BehaviorProfiles (or rely on Defaults).
*   **Targeting:** Selector logic (e.g., Closest, Balanced).

---

## Action Items

1. [ ] **Draft Content**: Write descriptions and code blocks for the sections above.
2. [ ] **Update Pages**: Edit the .mdx files.
3. [ ] **Verify Links**: Ensure cross-references between Role, Action, and Movement pages are accurate.

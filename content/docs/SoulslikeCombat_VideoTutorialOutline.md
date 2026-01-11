# Soulslike Enemy Combat - Video Tutorial Outline

## Video Concept
**Title:** "Build Advanced Soulslike AI in Unreal Engine 5.7"
**Target Audience:** Intermediate Unreal Developers, Technical Designers.
**Tone:** Professional, clear, engaging, "Developer-to-Developer".
**Goal:** Show them how to build a smart, coordinated enemy from scratch using the plugin's Data-Driven workflow.

---

## Section 1: Introduction (0:00 - 1:30)

### Visuals
*   **0:00**: Gameplay footage. Three enemies circling the player. One attacks while others strafe.
*   **0:30**: Quick flash of a messy Behavior Tree vs the clean Architecture diagram.
*   **1:00**: The specific "Grunt" enemy model we will be working on today, standing in an empty level.

### Transcript
"Hi everyone.

Building good AI is difficult.
We often focus too much on the attacks. But good combat AI isn't just about swinging a sword.
It is about knowing *when* to swing it.
And more importantly... knowing when *not* to.

If you put five enemies in a room, you don't want them all attacking at once. That is just chaos.
You want them to circle the player. Taking turns. Working as a team.
That is what makes a Soulslike game feel tactical and fair.

Trying to build this logic inside a standard Behavior Tree can get messy very fast. You often end up with a giant web of nodes that is impossible to fix later.
That is why I built this plugin.
It uses a modular system to handle the complexity for you.

In this video, I will show you how to create a complete enemy from scratch.
We will set up his tactical movement, his attacks, and most importantly, his combat roles, so he knows how to coordinate with other enemies.

Let’s get into it."

## Section 2: Theory Explanation (1:30 - 3:00)

### Visuals
*   **2:00:** A clean 2D motion graphic. Show the "Brain" (AIController) in the center.
*   **2:15:** Three distinct "Lobes" pop out from the brain: **Movement** (Legs icon), **Actions** (Sword icon), **Roles** (Badge icon).
*   **2:40:** Highlight the **UEnemyAIConfig** file in the center. Draw animated lines connecting it to all three components. Pulse the lines to show it "driving" the logic.

### Transcript
*   **Concept:** "Think of the AI as a brain with specialized lobes."
    *   **Movement Component:** Handles where to stand (Strafing, Distance).
    *   **Action Component:** Handles what to do (Attack, Heal, Block).
    *   **Role Subsystem:** Handles the "Team Strategy" (Attacker vs Flanker).
*   **The Hub:** Introduce **UEnemyAIConfig**. "This is the single file that connects everything. We stopped hardcoding behavior on components; now we drive it all from here."

## Section 3: The Foundation - AI Config (3:00 - 5:00)

### Visuals
*   **3:00:** Unreal Editor Capture. Right-click in Content Browser -> Miscellaneous -> Data Asset.
*   **3:30:** Close-up on the `BP_EnemyAIConfig` Details panel. Highlight the `RoleRegistration` section.
*   **4:00:** Show the `StateTree` property. Briefly open the `StateTree_SEC_Core` asset. Scroll through it quickly to show it is a simple list of steps, not a complex spiderweb.

### Transcript
*   **Action:** Create a new Data Asset -> `BP_EnemyAIConfig`.
*   **Explanation:** Walk through the empty asset.
    *   **Role Registration:** "We want this enemy to be an Attacker and a Flanker."
    *   **Fitness Evaluators:** "how does it decide? Distance, Health, Randomness."
    *   **StateTree:** "Select the Core StateTree (comes with plugin). It handles the logic flow so you don't have to write it."

## Section 4: Setting Up Movement (5:00 - 8:00)

### Visuals
*   **5:00:** **Split Screen (Left/Right).**
    *   **Left:** The Data Asset editor showing `DesiredMinDistance: 200`.
    *   **Right:** Gameplay view. The enemy stands 200 units away.
*   **6:00:** Change the value on the Left to `600`. Show the Enemy on the Right immediately backing up to the new distance.
*   **7:00:** Enable debug command `SEC.Debug.Movement`. Show the green arrows projecting from the enemy, visualizing how it "feels" the environment.

### Transcript
*   **Theory:** "An enemy that stands still is boring. An enemy that just runs at you is a zombie. We want *tactical* movement."
*   **Action:** Create `MovementBehaviorProfile` assets.
    *   `DA_Move_Aggressive`: Close range (200cm), fast strafing.
    *   `DA_Move_Passive`: Far range (600cm), slow strafing.
*   **Integration:** Go back to `EnemyAIConfig`.
    *   Map `SEC.Role.Attacker` -> `DA_Move_Aggressive`.
    *   Map `SEC.Role.Waiter` -> `DA_Move_Passive`.
*   **Key Point:** "Now, when the AI becomes an Attacker, it automatically knows to get close. When it waits, it backs off. No Blueprint code needed."

## Section 5: Setting Up Actions (8:00 - 12:00)

### Visuals
*   **8:30:** Inside the Animation Montage Editor. Zoom in closely on the Notify track.
*   **9:00:** Highlight the `SECMeleeTraceWindow` notify state.
*   **10:30:** Freeze-frame gameplay. Show the sword swing. Draw a red box overlay around the weapon to visualize the active hitbox frame.
*   **11:00:** Show the Debug Log overlay on screen, highlighting: `[LightAttack] Score: 0.95 SELECTED`.

### Transcript
*   **Theory:** "Actions are scored. The AI looks at distance, angle, and cooldowns to pick the best move."
*   **Action:** Create `ActionSet` Data Asset -> `DA_ActionSet_Melee`.
*   **Step 1: Light Attack**
    *   Create `GA_LightAttack` (GameplayAbilityBase).
    *   Add Action Entry: ID="LightAttack".
    *   Scoring: "Optimal Range 150-250".
*   **Step 2: Linking Animation**
    *   Show the Animation Montage.
    *   **Crucial:** Show adding the `SECMeleeTraceWindow` notify. "This is how we hit the player."
*   **Step 3: Setup AIConfig**
    *   Map `SEC.Role.Attacker` -> `DA_ActionSet_Melee`.
*   **Visuals:** Show visualizer debug lines (green = good score, red = bad score).

## Section 6: Setting Up Combat Roles (12:00 - 15:00)

### Visuals
*   **12:00:** **Tactical Top-Down View.** The camera looks down at the arena like an RTS game.
*   **12:30:** Overlay icons above the enemy heads:
    *   ⚔️ (Red Sword) for the **Attacker**.
    *   🛡️ (Blue Shield) for the **Waiters**.
*   **13:00:** Show the Player killing the Attacker.
*   **13:05:** Immediately show the 🛡️ icon on a Waiter flip to a ⚔️ icon. The new Attacker immediately starts running in.
*   **14:00:** Blueprint Graph. Show the `SetRoleLimitOverride` node being connected.

### Transcript
*   **Theory:** "This is the secret sauce. Why don't all 5 enemies attack at once?"
*   **Concept:** The Slot System.
    *   Attacker (Limit: 1)
    *   Flankers (Limit: 2)
    *   Waiters (Unlimited)
*   **Action:**
    *   Show how `AICombatRoleSubsystem` manages this automatically.
    *   **New Feature:** Show the **Runtime Control**.
    *   *Demo:* Use the `SetRoleLimitOverride` Blueprint node to allow 3 Attackers seamlessly.
*   **Syncing:** Explain how `SECCombatRoleSyncLibrary` keeps the Movement and Actions in sync with these role changes.

## Section 7: Assembly & Testing (15:00 - 17:00)

### Visuals
*   **15:00:** Fast-forward (2x speed) of the final Blueprint assembly.
    *   Drag Mesh -> Set Anim Class -> Set AIController Class.
*   **16:00:** Moment of truth. Mouse hovers over the "Play" button. Click.
*   **16:30:** Cinematic Gameplay. No HUD.
    *   Show the enemy circle.
    *   Show the enemy attack.
    *   Show the enemy retreat.
    *   Use slow-motion on the first successful hit to emphasize impact.

### Transcript
*   **Action:**
    1.  Create `BP_MyEnemy` (Character).
    2.  Create `BP_MyController` (AIController).
    3.  **The Magic Step:** Set the `AIConfig` variable on the Character.
*   **Playtest:**
    *   Drop 1 Enemy: Sees player, moves to range, attacks.
    *   Drop 4 Enemies: One attacks, others circle/wait.
    *   Kill the Attacker: A Waiter immediately steps up.
*   **Voiceover:** "See that? The 'Waiter' just became the 'Attacker', and because of our Config mapping, he instantly switched to the Aggressive movement profile."

## Section 8: Conclusion (17:00 - End)

### Visuals
*   **17:00:** A high-quality montage of various enemy types all using this system:
    *   A heavy brute with a hammer.
    *   A fast rogue with daggers.
    *   A mage casting spells from distance.
*   **17:20:** Fade to White.
*   **17:25:** Logo Splash Screen: **Soulslike Enemy Combat**.
*   **17:30:** Text appears below: "Available on Fab Marketplace". Discord Link icon at the bottom.

### Transcript
*   **Recap:** We built a fully tactical AI using just Data Assets.
*   **Call to Action:** "Check the documentation for advanced topics like Threat Detection and Targeting."
*   **Outro:** Link to Fab Marketplace / Discord.

---

## Assets Checklist for Recording
*   [ ] `BP_Grunt` Mesh & Anims ready.
*   [ ] `DA_Move_Aggressive` & `DA_Move_Passive` pre-created (or create on cam).
*   [ ] `DA_ActionSet` empty and ready to fill.
*   [ ] `SEC_DemoLevel` open for testing.

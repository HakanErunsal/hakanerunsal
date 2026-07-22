"use client"

import { useEffect, useState } from 'react';
import { User, Swords, Shield } from 'lucide-react';
import { UePanel, ueDetailsPanel } from '@/components/ue-editor';
import { cn } from '@/lib/utils';

type Role = 'Attacker' | 'Waiter' | 'Flanker';

interface EnemyState {
    id: number;
    role: Role;
    angle: number; // degrees
    distance: number; // px from center
}

export default function CombatRoleVisualizer() {
    const [enemies, setEnemies] = useState<EnemyState[]>([
        { id: 1, role: 'Attacker', angle: 45, distance: 80 },
        { id: 2, role: 'Waiter', angle: 135, distance: 140 },
        { id: 3, role: 'Waiter', angle: 225, distance: 140 },
        { id: 4, role: 'Flanker', angle: 315, distance: 140 },
    ]);

    const [slots, setSlots] = useState({ attackers: 1, maxAttackers: 1 });

    useEffect(() => {
        let mounted = true;

        // Simulation Loop
        const loop = async () => {
            // Local state to track logic without depending on reacting to state updates
            let currentEnemies: EnemyState[] = [
                { id: 1, role: 'Attacker', angle: 45, distance: 80 },
                { id: 2, role: 'Waiter', angle: 135, distance: 140 },
                { id: 3, role: 'Waiter', angle: 225, distance: 140 },
                { id: 4, role: 'Flanker', angle: 315, distance: 140 },
            ];

            while (mounted) {
                // 1. Hold State (Everyone chill)
                await new Promise(r => setTimeout(r, 1000));
                if (!mounted) return;

                // 2. Simultaneous Swap (Tag Team)
                // One leaves, another enters immediately
                const currentAttackerIndex = currentEnemies.findIndex(e => e.role === 'Attacker');
                let justFinishedId = -1;

                // A. Process Retreat (Local State Only first)
                if (currentAttackerIndex !== -1) {
                    justFinishedId = currentEnemies[currentAttackerIndex].id;

                    currentEnemies[currentAttackerIndex] = {
                        ...currentEnemies[currentAttackerIndex],
                        role: 'Waiter',
                        distance: 140
                    };
                }

                // B. Process Advance (Find replacement)
                const candidates = currentEnemies.filter(e => e.role !== 'Attacker' && e.id !== justFinishedId);

                if (candidates.length > 0) {
                    const randomIndex = Math.floor(Math.random() * candidates.length);
                    const nextAttackerId = candidates[randomIndex].id;

                    currentEnemies = currentEnemies.map(e =>
                        e.id === nextAttackerId
                            ? { ...e, role: 'Attacker', distance: 80 }
                            : e
                    );
                }

                // C. Commit Both Updates at Once
                setEnemies([...currentEnemies]);
                // Slot count technically stays at 1 (or 0->1 instant), so just keep it 1
                setSlots(s => ({ ...s, attackers: 1 }));

                // Travel + Attack Time
                // They move (take ~700ms) and attack (take 800ms)
                await new Promise(r => setTimeout(r, 1500));

                if (!mounted) return;
            }
        };

        loop();
        return () => { mounted = false; };
    }, []);

    return (
        <UePanel
            title="Viewport"
            breadcrumb={["LVL_SEC_Showcase", "Combat Roles"]}
            assetType="visualizer"
            caption="Enemies dynamically swap roles based on slot availability and priority."
        >
            <div className="relative mx-auto flex h-[350px] w-full max-w-[500px] flex-col items-center justify-center overflow-hidden sm:overflow-visible">
                <div className="absolute left-1/2 top-1/2 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#0078d4] text-white shadow-[0_0_20px_rgba(0,120,212,0.5)]">
                    <User className="h-6 w-6" />
                    <div className="absolute -bottom-6 whitespace-nowrap text-[10px] font-bold text-[#00A2FF]">Player</div>
                </div>

                <div className="absolute left-1/2 top-1/2 h-[160px] w-[160px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#FF4444]/20" />
                <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#666666]/20" />

                {enemies.map((enemy) => {
                    const rad = (enemy.angle * Math.PI) / 180;
                    const x = Math.cos(rad) * enemy.distance;
                    const y = Math.sin(rad) * enemy.distance;
                    const isAttacker = enemy.role === 'Attacker';

                    return (
                        <div
                            key={enemy.id}
                            className={cn(
                                "absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-700",
                                isAttacker ? "z-30 scale-110 bg-[#FF4444] shadow-[0_0_15px_rgba(255,68,68,0.6)]" : "z-10 scale-100 bg-[#404045] opacity-80",
                            )}
                            style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
                        >
                            {isAttacker ? <Swords className="h-5 w-5 text-white" /> : <Shield className="h-5 w-5 text-[#888888]" />}
                            <div className={cn(
                                "absolute -top-5 whitespace-nowrap text-[10px] font-bold transition-colors duration-300 font-mono",
                                isAttacker ? "text-[#FF4444]" : "text-[#666666]",
                            )}>
                                {enemy.role}
                            </div>
                        </div>
                    );
                })}

                <div className={cn(ueDetailsPanel(), "absolute bottom-4 right-4 text-xs")}>
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#888888]">Combat Slots</div>
                    <div className="flex items-center gap-2">
                        <span className="text-[#FF4444]">Attackers:</span>
                        <span className="font-mono text-[#c8c8c8]">{slots.attackers} / {slots.maxAttackers}</span>
                    </div>
                    <div className="mt-1 text-[10px] text-[#666666]">(Others must wait)</div>
                </div>
            </div>
        </UePanel>
    );
}

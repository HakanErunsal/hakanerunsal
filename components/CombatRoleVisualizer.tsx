"use client"

import { useEffect, useState } from 'react';
import { User, Swords, Shield, Skull } from 'lucide-react';

function classNames(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

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
        <div className="my-8 rounded-lg border border-border bg-black/20 p-8 shadow-sm">
            <div className="relative mx-auto flex h-[350px] w-full max-w-[500px] flex-col items-center justify-center">

                {/* CENTER: Player */}
                <div className="absolute left-1/2 top-1/2 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                    <User className="h-6 w-6" />
                    <div className="absolute -bottom-6 whitespace-nowrap text-[10px] font-bold text-blue-500">Player</div>
                </div>

                {/* Orbit Rings (Visual Guide) */}
                <div className="absolute left-1/2 top-1/2 h-[160px] w-[160px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-red-500/20" />
                <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-slate-500/20" />

                {/* Enemies */}
                {enemies.map((enemy) => {
                    // Convert polar to cartesian
                    const rad = (enemy.angle * Math.PI) / 180;
                    const x = Math.cos(rad) * enemy.distance;
                    const y = Math.sin(rad) * enemy.distance;

                    const isAttacker = enemy.role === 'Attacker';

                    return (
                        <div
                            key={enemy.id}
                            className={classNames(
                                "absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-700",
                                isAttacker ? "bg-red-500 scale-110 z-30 shadow-[0_0_15px_rgba(239,68,68,0.6)]" : "bg-slate-700 scale-100 z-10 opacity-80"
                            )}
                            style={{
                                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                            }}
                        >
                            {isAttacker ? <Swords className="h-5 w-5 text-white" /> : <Shield className="h-5 w-5 text-slate-300" />}

                            {/* Role Label */}
                            <div className={classNames(
                                "absolute -top-5 whitespace-nowrap text-[10px] font-bold transition-colors duration-300",
                                isAttacker ? "text-red-500" : "text-slate-500"
                            )}>
                                {enemy.role}
                            </div>
                        </div>
                    );
                })}

                {/* Legend / Stats */}
                <div className="absolute bottom-4 right-4 rounded bg-background/80 p-3 text-xs shadow-sm border border-border">
                    <div className="mb-2 font-bold text-muted-foreground">Combat Slots</div>
                    <div className="flex items-center gap-2">
                        <span className="text-red-500">Attackers:</span>
                        <span className="font-mono">{slots.attackers} / {slots.maxAttackers}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                        (Others must wait)
                    </div>
                </div>

            </div>

            <div className="mt-2 text-center text-sm text-muted-foreground">
                Enemies dynamically swap roles based on slot availability and priority.
            </div>
        </div>
    );
}

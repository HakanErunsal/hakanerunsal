"use client"

import { useEffect, useState, useRef, useCallback } from 'react';
import { User, Skull, Target, Zap, RotateCcw, Bot, Plus } from 'lucide-react';
import { UePanel, ueButton, ueDetailsPanel, ueSelect } from '@/components/ue-editor';
import { cn } from '@/lib/utils';

function classNames(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

type SelectorType = 'First' | 'Closest' | 'Balanced' | 'Random';

interface TargetState {
    id: number;
    x: number; // percent from left
    y: number; // percent from top
    alive: boolean;
    color: string;
    name: string;
    isAI: boolean; // true = AI target, false = player
}

interface EnemyState {
    id: number;
    x: number;
    y: number;
    targetId: number | null;
    isOrphaned: boolean;
}

const COLORS = {
    player1: '#3b82f6', // blue
    player2: '#22c55e', // green
    aiTarget: '#f59e0b', // amber - for AI targets
};

export default function TargetingVisualizer() {
    const [selector, setSelector] = useState<SelectorType>('Balanced');
    const [isRunning, setIsRunning] = useState(true);
    const [targets, setTargets] = useState<TargetState[]>([
        { id: 1, x: 25, y: 30, alive: true, color: COLORS.player1, name: 'Target 1', isAI: false },
        { id: 2, x: 75, y: 30, alive: true, color: COLORS.player2, name: 'Target 2', isAI: false },
    ]);
    const [enemies, setEnemies] = useState<EnemyState[]>([
        { id: 1, x: 20, y: 70, targetId: 1, isOrphaned: false },
        { id: 2, x: 35, y: 75, targetId: 1, isOrphaned: false },
        { id: 3, x: 50, y: 80, targetId: 2, isOrphaned: false },
        { id: 4, x: 65, y: 75, targetId: 2, isOrphaned: false },
        { id: 5, x: 80, y: 70, targetId: 2, isOrphaned: false },
    ]);
    const [eventLog, setEventLog] = useState<string[]>([]);
    const [tick, setTick] = useState(0); // Visual tick indicator
    const logRef = useRef<HTMLDivElement>(null);

    const addLog = useCallback((message: string) => {
        setEventLog(prev => [...prev.slice(-4), message]);
    }, []);

    // Calculate distance between two points
    const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    };

    // Get count of enemies assigned to each target
    const getTargetCounts = useCallback((currentEnemies: EnemyState[]) => {
        const counts: Record<number, number> = {};
        currentEnemies.forEach(e => {
            if (e.targetId !== null) {
                counts[e.targetId] = (counts[e.targetId] || 0) + 1;
            }
        });
        return counts;
    }, []);

    // Select target based on current selector strategy
    const selectTarget = useCallback((
        enemy: EnemyState,
        availableTargets: TargetState[],
        allEnemies: EnemyState[],
        selectorType: SelectorType
    ): number | null => {
        if (availableTargets.length === 0) return null;

        switch (selectorType) {
            case 'First':
                return availableTargets[0].id;

            case 'Closest': {
                let closest = availableTargets[0];
                let minDist = getDistance(enemy.x, enemy.y, closest.x, closest.y);
                for (const t of availableTargets) {
                    const dist = getDistance(enemy.x, enemy.y, t.x, t.y);
                    if (dist < minDist) {
                        minDist = dist;
                        closest = t;
                    }
                }
                return closest.id;
            }

            case 'Balanced': {
                const counts = getTargetCounts(allEnemies.filter(e => e.id !== enemy.id));
                let minCount = Infinity;
                for (const t of availableTargets) {
                    const count = counts[t.id] || 0;
                    if (count < minCount) minCount = count;
                }
                // Stickiness: if current target is among the least-loaded, stay
                if (enemy.targetId !== null) {
                    const currentTarget = availableTargets.find(t => t.id === enemy.targetId);
                    if (currentTarget) {
                        const currentCount = counts[currentTarget.id] || 0;
                        if (currentCount <= minCount) return currentTarget.id;
                    }
                }
                // Pick first with min count
                for (const t of availableTargets) {
                    if ((counts[t.id] || 0) === minCount) return t.id;
                }
                return availableTargets[0].id;
            }

            case 'Random':
                return availableTargets[Math.floor(Math.random() * availableTargets.length)].id;

            default:
                return availableTargets[0].id;
        }
    }, [getTargetCounts]);

    // Handle target death simulation
    const killTarget = useCallback((targetId: number) => {
        setTargets(prev => prev.map(t =>
            t.id === targetId ? { ...t, alive: false } : t
        ));

        const deadTarget = targets.find(t => t.id === targetId);
        if (deadTarget) {
            addLog(`💀 ${deadTarget.name} eliminated!`);
        }

        // Mark orphaned enemies
        setEnemies(prev => {
            const updated = prev.map(e =>
                e.targetId === targetId ? { ...e, isOrphaned: true } : e
            );

            // After a short delay, reassign orphans
            setTimeout(() => {
                setEnemies(current => {
                    const aliveTargets = targets.filter(t => t.alive && t.id !== targetId);
                    if (aliveTargets.length === 0) {
                        addLog('⚠️ No targets remaining!');
                        return current.map(e => ({ ...e, targetId: null, isOrphaned: false }));
                    }

                    return current.map(e => {
                        if (e.targetId === targetId) {
                            const newTargetId = selectTarget(e, aliveTargets, current, selector);
                            const newTarget = aliveTargets.find(t => t.id === newTargetId);
                            addLog(`🎯 Enemy ${e.id} → ${newTarget?.name || 'None'}`);
                            return { ...e, targetId: newTargetId, isOrphaned: false };
                        }
                        return e;
                    });
                });
            }, 800);

            return updated;
        });
    }, [targets, selector, selectTarget, addLog]);

    // Add AI target
    const addAITarget = useCallback(() => {
        const newId = Math.max(...targets.map(t => t.id), 0) + 1;
        const newTarget: TargetState = {
            id: newId,
            x: 50,
            y: 25,
            alive: true,
            color: COLORS.aiTarget,
            name: `Target ${newId}`,
            isAI: true,
        };
        setTargets(prev => [...prev, newTarget]);
        addLog(`🤖 New Target registered!`);

        // Re-evaluate all enemies with this new target available
        setTimeout(() => {
            setEnemies(prev => {
                const aliveTargets = [...targets.filter(t => t.alive), newTarget];
                return prev.map(e => {
                    const newTargetId = selectTarget(e, aliveTargets, prev, selector);
                    if (newTargetId !== e.targetId) {
                        const newT = aliveTargets.find(t => t.id === newTargetId);
                        addLog(`🔄 E${e.id} → ${newT?.name}`);
                    }
                    return { ...e, targetId: newTargetId };
                });
            });
        }, 100);
    }, [targets, selector, selectTarget, addLog]);

    // Periodic re-evaluation simulation (only when running)
    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTick(t => t + 1); // Visual feedback that simulation is running

            setEnemies(prev => {
                const aliveTargets = targets.filter(t => t.alive);
                if (aliveTargets.length === 0) return prev;

                // Simulate periodic re-evaluation - try to switch one enemy
                if (selector === 'Balanced' || selector === 'Closest') {
                    const randomEnemy = prev[Math.floor(Math.random() * prev.length)];
                    const newTargetId = selectTarget(randomEnemy, aliveTargets, prev, selector);
                    if (newTargetId !== randomEnemy.targetId) {
                        const newTarget = aliveTargets.find(t => t.id === newTargetId);
                        addLog(`🔄 E${randomEnemy.id} re-eval → ${newTarget?.name}`);
                        return prev.map(e =>
                            e.id === randomEnemy.id ? { ...e, targetId: newTargetId } : e
                        );
                    }
                }
                return prev;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [isRunning, targets, selector, selectTarget, addLog]);

    // Reset simulation
    const reset = useCallback(() => {
        const initialTargets: TargetState[] = [
            { id: 1, x: 25, y: 30, alive: true, color: COLORS.player1, name: 'Target 1', isAI: false },
            { id: 2, x: 75, y: 30, alive: true, color: COLORS.player2, name: 'Target 2', isAI: false },
        ];
        const initialEnemies: EnemyState[] = [
            { id: 1, x: 20, y: 70, targetId: null, isOrphaned: false },
            { id: 2, x: 35, y: 75, targetId: null, isOrphaned: false },
            { id: 3, x: 50, y: 80, targetId: null, isOrphaned: false },
            { id: 4, x: 65, y: 75, targetId: null, isOrphaned: false },
            { id: 5, x: 80, y: 70, targetId: null, isOrphaned: false },
        ];

        setTargets(initialTargets);
        setEventLog([]);
        setTick(0);

        // Re-run current selector on fresh enemies
        const assignedEnemies = initialEnemies.map(e => {
            const newTargetId = selectTarget(e, initialTargets, initialEnemies, selector);
            return { ...e, targetId: newTargetId };
        });
        setEnemies(assignedEnemies);
        addLog(`🔄 Reset with ${selector} selector`);
    }, [addLog, selector, selectTarget]);

    // Re-evaluate all when selector changes
    useEffect(() => {
        const aliveTargets = targets.filter(t => t.alive);
        if (aliveTargets.length === 0) return;

        setEnemies(prev => {
            return prev.map(e => {
                const newTargetId = selectTarget(e, aliveTargets, prev, selector);
                return { ...e, targetId: newTargetId };
            });
        });
        addLog(`📋 Selector: ${selector}`);
    }, [selector]); // Only trigger on selector change

    const getTargetColor = (targetId: number | null) => {
        const target = targets.find(t => t.id === targetId);
        return target?.color || '#64748b';
    };

    const counts = getTargetCounts(enemies);
    const hasAITarget = targets.some(t => t.isAI && t.alive);

    return (
        <UePanel
            title="Viewport"
            breadcrumb={["LVL_SEC_Showcase", "Targeting"]}
            assetType="visualizer"
            caption="Click targets to eliminate. System periodically re-evaluates assignments based on strategy."
        >
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-[#888888]">Selector:</span>
                    <select
                        value={selector}
                        onChange={(e) => setSelector(e.target.value as SelectorType)}
                        className={ueSelect()}
                    >
                        <option value="First">First Target</option>
                        <option value="Closest">Closest Target</option>
                        <option value="Balanced">Balanced</option>
                        <option value="Random">Random</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <button type="button" onClick={reset} className={ueButton()}>
                        <RotateCcw className="h-3 w-3" />
                        Reset
                    </button>
                    {!hasAITarget && (
                        <button type="button" onClick={addAITarget} className={ueButton(true)}>
                            <Plus className="h-3 w-3" />
                            Add New Target
                        </button>
                    )}
                </div>
            </div>

            <div className="relative mx-auto h-[300px] w-full max-w-[600px] rounded-sm border border-[#2a2a2e] bg-[#0b0b0c]">

                {/* Connection lines */}
                <svg className="absolute inset-0 h-full w-full pointer-events-none">
                    {enemies.map(enemy => {
                        const target = targets.find(t => t.id === enemy.targetId && t.alive);
                        if (!target || enemy.isOrphaned) return null;
                        return (
                            <line
                                key={`line-${enemy.id}`}
                                x1={`${enemy.x}%`}
                                y1={`${enemy.y}%`}
                                x2={`${target.x}%`}
                                y2={`${target.y}%`}
                                stroke={target.color}
                                strokeWidth="1"
                                strokeOpacity="0.3"
                                strokeDasharray="4 4"
                            />
                        );
                    })}
                </svg>

                {/* Targets (Players & AI) */}
                {targets.map(target => (
                    <div
                        key={target.id}
                        className={classNames(
                            "absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-500",
                            target.alive
                                ? "cursor-pointer hover:scale-110"
                                : "opacity-30 grayscale"
                        )}
                        style={{
                            left: `${target.x}%`,
                            top: `${target.y}%`,
                            backgroundColor: target.color,
                            boxShadow: target.alive ? `0 0 20px ${target.color}50` : 'none'
                        }}
                        onClick={() => target.alive && killTarget(target.id)}
                        title={target.alive ? "Click to eliminate" : "Eliminated"}
                    >
                        {target.isAI ? (
                            <Bot className="h-6 w-6 text-white" />
                        ) : (
                            <User className="h-6 w-6 text-white" />
                        )}
                        <div className="absolute -bottom-6 whitespace-nowrap text-[10px] font-bold" style={{ color: target.color }}>
                            {target.name}
                            {target.alive && <span className="ml-1 opacity-60">({counts[target.id] || 0})</span>}
                        </div>
                        {!target.alive && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Skull className="h-8 w-8 text-red-500" />
                            </div>
                        )}
                    </div>
                ))}

                {/* Enemies */}
                {enemies.map(enemy => (
                    <div
                        key={enemy.id}
                        className={classNames(
                            "absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-700",
                            enemy.isOrphaned
                                ? "animate-pulse bg-yellow-500"
                                : "bg-red-600"
                        )}
                        style={{
                            left: `${enemy.x}%`,
                            top: `${enemy.y}%`,
                            borderColor: getTargetColor(enemy.targetId),
                            borderWidth: '2px',
                            borderStyle: 'solid'
                        }}
                    >
                        <Target className="h-4 w-4 text-white" />
                        <div className="absolute -top-4 text-[9px] font-bold text-slate-400">
                            E{enemy.id}
                        </div>
                    </div>
                ))}

                {/* Legend - Desktop (Absolute) / Mobile (Hidden from here, moved below) */}
                <div className={cn(ueDetailsPanel(), "absolute bottom-2 left-2 hidden p-2 text-[10px] sm:block")}>
                    <div className="mb-1 font-semibold uppercase tracking-wider text-[#888888]">Target Counts</div>
                    {targets.filter(t => t.alive).map(t => (
                        <div key={t.id} className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} />
                            <span>{t.name}: {counts[t.id] || 0}</span>
                            {t.isAI && <span className="text-[#FFB800]">(AI)</span>}
                        </div>
                    ))}
                </div>

                {/* Event Log - Desktop (Absolute) / Mobile (Hidden from here, moved below) */}
                <div
                    ref={logRef}
                    className={cn(ueDetailsPanel(), "absolute bottom-2 right-2 hidden max-h-[80px] w-[180px] overflow-hidden p-2 text-[10px] sm:block")}
                >
                    <div className="mb-1 flex items-center gap-1 font-semibold uppercase tracking-wider text-[#888888]">
                        <Zap className="h-3 w-3" /> Events
                        {isRunning && (
                            <span className="ml-auto animate-pulse text-[#6CC644]">●</span>
                        )}
                    </div>
                    {eventLog.slice(-3).map((log, i) => (
                        <div key={i} className="truncate text-[#888888]">{log}</div>
                    ))}
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:hidden">
                <div className={cn(ueDetailsPanel(), "p-3 text-xs")}>
                    <div className="mb-2 font-semibold uppercase tracking-wider text-[#888888]">Target Counts</div>
                    <div className="flex flex-wrap gap-4">
                        {targets.filter(t => t.alive).map(t => (
                            <div key={t.id} className="flex items-center gap-1.5">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} />
                                <span>{t.name}: {counts[t.id] || 0}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Log */}
                <div className={cn(ueDetailsPanel(), "p-3 text-xs")}>
                    <div className="mb-2 flex items-center gap-2 font-semibold uppercase tracking-wider text-[#888888]">
                        <Zap className="h-3 w-3" /> Event Log
                        {isRunning && <span className="animate-pulse text-[#6CC644]">●</span>}
                    </div>
                    <div className="space-y-1">
                        {eventLog.slice(-3).map((log, i) => (
                            <div key={i} className="truncate text-[#888888]">{log}</div>
                        ))}
                        {eventLog.length === 0 && <div className="italic text-[#666666]">No events yet</div>}
                    </div>
                </div>
            </div>
        </UePanel>
    );
}

"use client";

import { useState } from "react";
import { UePanel, ueConsole } from "@/components/ue-editor";

/** Illustrative per-AI ms costs for the slider model (not a live profile). */
const PER_ENEMY_MOVEMENT = 0.0035;
const PER_ENEMY_THREAT = 0.0004;

export default function PerformanceVisualizer() {
    const [enemyCount, setEnemyCount] = useState(20);

    const movementOverhead = parseFloat((enemyCount * PER_ENEMY_MOVEMENT).toFixed(4));
    const threatOverhead = parseFloat((enemyCount * PER_ENEMY_THREAT).toFixed(4));
    const avoidanceOverhead = parseFloat((movementOverhead * 0.05).toFixed(4));
    const roleOverhead = parseFloat((movementOverhead * 0.02).toFixed(4));

    const totalOverhead = parseFloat(
        (movementOverhead + threatOverhead + avoidanceOverhead + roleOverhead).toFixed(3)
    );

    const frameBudget = 16.6;
    const percentage = Math.min((totalOverhead / frameBudget) * 100, 100).toFixed(2);

    return (
        <UePanel
            title="Output Log"
            breadcrumb={["Window", "Developer Tools"]}
            assetType="output"
            compact
        >
            <div className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                    <label htmlFor="enemy-slider" className="text-xs text-[#888888]">
                        Active SEC enemies
                    </label>
                    <span className="rounded-sm border border-[#0078d4]/40 bg-[#0078d4]/10 px-3 py-1 font-mono text-xs font-bold text-[#00A2FF]">
                        {enemyCount} enemies
                    </span>
                </div>
                <input
                    id="enemy-slider"
                    type="range"
                    min="1"
                    max="150"
                    step="1"
                    value={enemyCount}
                    onChange={(e) => setEnemyCount(parseInt(e.target.value))}
                    className="ue-slider w-full"
                />
                <div className="mt-2 flex justify-between text-[10px] text-[#666666]">
                    <span>1 duel</span>
                    <span>50 horde</span>
                    <span>150 stress</span>
                </div>
            </div>

            <div className={ueConsole()}>
                <div className="mb-2 border-b border-[#3e3e42] pb-2 text-[#888888]">
                    Illustrative scaling — run <span className="font-mono text-[#cccccc]">stat SEC</span> in your level for real numbers
                </div>

                <div className="grid grid-cols-[1fr_auto] gap-x-8 gap-y-1">
                    <div className="pl-2 text-[#cccccc]">MovementEvaluator - Total</div>
                    <div className="text-[#b5cea8]">{movementOverhead.toFixed(3)} ms</div>

                    <div className="pl-4 text-[#888888]">MovementEvaluator - Direction Scoring</div>
                    <div className="text-[#888888]">{(movementOverhead * 0.9).toFixed(3)} ms</div>

                    <div className="pl-4 text-[#888888]">MovementEvaluator - Avoidance</div>
                    <div className="text-[#888888]">{avoidanceOverhead.toFixed(3)} ms</div>

                    <div className="pl-2 text-[#cccccc]">RoleSubsystem - Role Distribution</div>
                    <div className="text-[#b5cea8]">{roleOverhead.toFixed(3)} ms</div>

                    <div className="pl-2 text-[#cccccc]">ThreatDetection - Tick</div>
                    <div className="text-[#b5cea8]">{threatOverhead.toFixed(3)} ms</div>

                    <div className="col-span-2 my-1 border-t border-[#3e3e42]" />

                    <div className="pl-0 font-bold text-white">Estimated SEC overhead</div>
                    <div className="font-bold text-[#4ec9b0]">{totalOverhead.toFixed(3)} ms</div>
                </div>
            </div>

            <div className="mt-6">
                <div className="mb-1 flex justify-between text-[10px] text-[#888888]">
                    <span>Share of 60 fps frame budget (16.6 ms)</span>
                    <span>{percentage}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-sm border border-[#36363a] bg-[#1e1e22]">
                    <div
                        className="h-full bg-[#6CC644] transition-all duration-300 ease-out"
                        style={{ width: `${Math.max(parseFloat(percentage), 1)}%` }}
                    />
                </div>
                {parseFloat(percentage) < 5 && (
                    <p className="mt-2 text-xs font-medium text-[#6CC644]">
                        Low share at this count
                    </p>
                )}
            </div>
        </UePanel>
    );
}

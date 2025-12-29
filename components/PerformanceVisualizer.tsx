"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export default function PerformanceVisualizer() {
    const [enemyCount, setEnemyCount] = useState(20);

    // Constants based on Ryzen 9950x benchmarks
    const PER_ENEMY_MOVEMENT = 0.0035; // ms
    const PER_ENEMY_THREAT = 0.0004; // ms

    // Calculate stats
    // We add some base overhead + per enemy cost
    const movementOverhead = parseFloat((enemyCount * PER_ENEMY_MOVEMENT).toFixed(4));
    const threatOverhead = parseFloat((enemyCount * PER_ENEMY_THREAT).toFixed(4));

    // Avoidance runs at 10Hz, so per frame cost is amortized and low
    // Let's approximate it as ~5% of movement for visual purposes
    const avoidanceOverhead = parseFloat((movementOverhead * 0.05).toFixed(4));

    // Role distribution is timer based, also low
    const roleOverhead = parseFloat((movementOverhead * 0.02).toFixed(4));

    const totalOverhead = parseFloat(
        (movementOverhead + threatOverhead + avoidanceOverhead + roleOverhead).toFixed(3)
    );

    const frameBudget = 16.6; // 60fps
    const percentage = Math.min((totalOverhead / frameBudget) * 100, 100).toFixed(2);

    return (
        <div className="my-8 rounded-lg border border-border bg-card overflow-hidden shadow-sm">
            {/* Header */}
            <div className="border-b border-border bg-muted/30 p-4">
                <h3 className="font-semibold flex items-center gap-2">
                    <span>🚀 Live Performance Preview</span>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Adjust the enemy count to see the estimated Game Thread overhead.
                </p>
            </div>

            <div className="p-6">
                {/* Slider Section */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <label htmlFor="enemy-slider" className="text-sm font-medium">
                            Enemy Count
                        </label>
                        <span className="px-3 py-1 bg-primary/10 text-primary font-bold rounded-md font-mono">
                            {enemyCount} Enemies
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
                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>1 (Duel)</span>
                        <span>50 (Horde)</span>
                        <span>150 (Stress Test)</span>
                    </div>
                </div>

                {/* Console Display */}
                <div className="bg-[#1e1e1e] rounded-md p-4 font-mono text-xs md:text-sm overflow-x-auto border border-border/50 shadow-inner">
                    <div className="text-gray-400 mb-2 border-b border-gray-700 pb-2">
                        Output Log - stat SEC
                    </div>

                    <div className="grid grid-cols-[1fr_auto] gap-x-8 gap-y-1">
                        {/* Headers in "stat" style often have group names */}
                        <div className="col-span-2 text-[#4ec9b0] mb-1">Authenticated user: Client 1</div>

                        <div className="text-gray-300 pl-2">SEC_MovementEvaluator</div>
                        <div className="text-[#b5cea8]">{movementOverhead.toFixed(3)} ms</div>

                        <div className="text-gray-400 pl-4">SEC_DirectionScoring (16 samples)</div>
                        <div className="text-gray-400">{(movementOverhead * 0.9).toFixed(3)} ms</div>

                        <div className="text-gray-400 pl-4">SEC_Avoidance</div>
                        <div className="text-gray-400">{avoidanceOverhead.toFixed(3)} ms</div>

                        <div className="text-gray-300 pl-2">SEC_RoleDistribution</div>
                        <div className="text-[#b5cea8]">{roleOverhead.toFixed(3)} ms</div>

                        <div className="text-gray-300 pl-2">SEC_ThreatDetection</div>
                        <div className="text-[#b5cea8]">{threatOverhead.toFixed(3)} ms</div>

                        <div className="col-span-2 border-t border-gray-700 my-1"></div>

                        <div className="text-white font-bold pl-0">Total SEC Overhead</div>
                        <div className="text-[#4ec9b0] font-bold">{totalOverhead.toFixed(3)} ms</div>
                    </div>
                </div>

                {/* Frame Budget Visualization */}
                <div className="mt-6">
                    <div className="flex justify-between text-xs mb-1">
                        <span>Frame Budget Usage (60fps target)</span>
                        <span>{percentage}% of 16.6ms</span>
                    </div>
                    <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 transition-all duration-300 ease-out"
                            style={{ width: `${Math.max(parseFloat(percentage), 1)}%` }}
                        />
                    </div>
                    {parseFloat(percentage) < 5 && (
                        <p className="text-xs text-green-500 mt-2 font-medium">
                            ✅ Negligible Impact
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

"use client"

import { useEffect, useRef, useState } from 'react';
import { UePanel, UeViewport } from '@/components/ue-editor';

export default function MeleeTraceVisualizer() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Settings
    const [useInterpolation, setUseInterpolation] = useState(false);
    const [speed, setSpeed] = useState(60); // Degrees per tick
    const [stats, setStats] = useState({ hits: 0, swings: 0 });

    // Simulation State Refs
    const simRef = useRef({
        angle: -Math.PI / 2 - Math.PI / 3, // Start Left-Up (-150 deg)
        dir: 1,
        lastAngle: -Math.PI / 2 - Math.PI / 3,
        swordLength: 150,
        hitDetected: false,
        hitFrame: 0
    });

    const requestRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const ORIGIN = { x: 200, y: 300 };
        const TARGET = { x: 200, y: 160, r: 15 }; // Target is directly above Origin (-90 deg)

        // Simulation Loop (Simulating low FPS physics update)
        // We update physics every 600ms to allow user to see the "Frames" clearly
        const PHYSICS_TICK = 600;
        let lastTime = 0;

        // Bounds centered around -PI/2 (-90 deg)
        const CENTER_ANGLE = -Math.PI / 2;
        const SWING_ARC = Math.PI / 3; // +/- 60 degrees. Total range 120 deg.
        const LEFT_LIMIT = CENTER_ANGLE - SWING_ARC; // -150 deg
        const RIGHT_LIMIT = CENTER_ANGLE + SWING_ARC; // -30 deg

        const gameLoop = (timestamp: number) => {
            if (lastTime === 0) lastTime = timestamp;
            const deltaTime = timestamp - lastTime;

            // 1. Physics Update (Low FPS simulation)
            if (deltaTime >= PHYSICS_TICK) {
                lastTime = timestamp;

                const state = simRef.current;
                state.lastAngle = state.angle;

                // Dynamic Speed from Slider
                const angleStep = (speed * (Math.PI / 180));

                // Calculate potential new angle
                let nextAngle = state.angle + (angleStep * state.dir);

                // Clamp & Bounce Logic
                if (nextAngle >= RIGHT_LIMIT) {
                    nextAngle = RIGHT_LIMIT;
                    state.dir = -1;
                    setStats(s => ({ ...s, swings: s.swings + 1 }));
                    state.hitDetected = false;
                }
                else if (nextAngle <= LEFT_LIMIT) {
                    nextAngle = LEFT_LIMIT;
                    state.dir = 1;
                    setStats(s => ({ ...s, swings: s.swings + 1 }));
                    state.hitDetected = false;
                }

                state.angle = nextAngle;

                // 2. Collision Detection
                let hit = false;
                const targetAngle = CENTER_ANGLE;

                if (useInterpolation) {
                    // Check if Target Angle is BETWEEN last and current
                    const min = Math.min(state.lastAngle, state.angle);
                    const max = Math.max(state.lastAngle, state.angle);

                    // Floating point tolerance
                    if (targetAngle >= min - 0.01 && targetAngle <= max + 0.01) {
                        hit = true;
                    }
                } else {
                    // Discrete Check: Is current angle close to target?
                    if (Math.abs(state.angle - targetAngle) < 0.1) {
                        hit = true;
                    }
                }

                if (hit && !state.hitDetected) {
                    state.hitDetected = true;
                    state.hitFrame = 20; // Visual flash duration (runs on render loop, so 20 frames is ~300ms)
                    setStats(s => ({ ...s, hits: s.hits + 1 }));
                }
            }

            // 3. Render (High FPS visuals)
            const state = simRef.current;
            if (state.hitFrame > 0) state.hitFrame--;

            // Clear
            ctx.clearRect(0, 0, 400, 350);

            // Draw Arc Range (Background guide)
            ctx.beginPath();
            // Draw arc from Left Limit to Right Limit
            ctx.arc(ORIGIN.x, ORIGIN.y, state.swordLength, LEFT_LIMIT - 0.05, RIGHT_LIMIT + 0.05);
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw Target
            ctx.beginPath();
            ctx.arc(TARGET.x, TARGET.y, TARGET.r, 0, Math.PI * 2);
            ctx.fillStyle = state.hitFrame > 0 ? '#ef4444' : '#22c55e'; // Red if hit, Green if safe
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw Trace / Interpolation Fan (The "Swipe")
            // Show the swept area from last to current
            if (useInterpolation) {
                ctx.beginPath();
                ctx.moveTo(ORIGIN.x, ORIGIN.y);
                ctx.arc(ORIGIN.x, ORIGIN.y, state.swordLength, state.lastAngle, state.angle, state.lastAngle > state.angle);
                // Note: arc() takes (x, y, r, start, end, counterclockwise).
                // If last < angle (moving right), we want clockwise (false). 
                // If last > angle (moving left), we want counter-clockwise (true).
                // Condition: state.lastAngle > state.angle checks if we moved left.

                ctx.fillStyle = 'rgba(239, 68, 68, 0.3)'; // Red trace
                ctx.fill();
            }

            // Draw Ghost (Last Frame Position) - Visual helper for "Low FPS"
            ctx.beginPath();
            ctx.moveTo(ORIGIN.x, ORIGIN.y);
            const ghostX = ORIGIN.x + Math.cos(state.lastAngle) * state.swordLength;
            const ghostY = ORIGIN.y + Math.sin(state.lastAngle) * state.swordLength;
            ctx.lineTo(ghostX, ghostY);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw Sword (Current Position)
            ctx.beginPath();
            ctx.moveTo(ORIGIN.x, ORIGIN.y);
            const tipX = ORIGIN.x + Math.cos(state.angle) * state.swordLength;
            const tipY = ORIGIN.y + Math.sin(state.angle) * state.swordLength;
            ctx.lineTo(tipX, tipY);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 4;
            ctx.stroke();

            requestRef.current = requestAnimationFrame(gameLoop);
        };

        requestRef.current = requestAnimationFrame(gameLoop);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [useInterpolation, speed]); // Re-run if these change

    return (
        <UePanel
            title="Viewport"
            breadcrumb={["LVL_SEC_Showcase", "Melee Trace"]}
            assetType="visualizer"
            headerRight={
                <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#888888]">
                        {useInterpolation ? "Interpolation ON" : "Interpolation OFF"}
                    </span>
                    <button
                        type="button"
                        onClick={() => setUseInterpolation(!useInterpolation)}
                        data-state={useInterpolation ? "on" : "off"}
                        className="ue-toggle"
                        aria-pressed={useInterpolation}
                    >
                        <span className="ue-toggle-thumb" />
                    </button>
                </div>
            }
            caption={
                useInterpolation
                    ? "With Interpolation: The system fills the gap between frames, ensuring the hit is detected."
                    : "Without Interpolation: The fast sword swings 'teleport' over the target between frames, causing a miss."
            }
        >
            <div className="mb-4 flex items-center gap-4 text-xs">
                <span className="w-20 text-[#888888]">Swing Speed</span>
                <input
                    type="range"
                    min="30"
                    max="90"
                    step="5"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="ue-slider flex-1"
                />
                <span className="w-8 text-right font-mono text-[#c8c8c8]">{speed}°</span>
            </div>

            <UeViewport className="relative mx-auto aspect-[400/350] w-full max-w-[400px]">
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={350}
                    className="absolute inset-0"
                />

                <div className="absolute left-4 top-4 font-mono text-xs text-[#888888]">
                    <div>SIM_FPS: 10</div>
                    <div>STATUS: {
                        (useInterpolation || speed <= 30)
                            ? <span className="text-[#6CC644]">ROBUST</span>
                            : <span className="text-[#FF4444]">TUNNELING</span>
                    }</div>
                </div>

                <div className="absolute bottom-4 right-4 text-right">
                    <div className="font-mono text-2xl font-bold text-[#c8c8c8]">{stats.hits}</div>
                    <div className="text-[10px] uppercase text-[#888888]">Successful Hits</div>
                </div>
            </UeViewport>
        </UePanel>
    );
}

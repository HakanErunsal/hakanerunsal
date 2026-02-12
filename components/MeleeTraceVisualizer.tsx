"use client"

import { useEffect, useRef, useState } from 'react';
import { Swords } from 'lucide-react';

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
        <div className="my-8 rounded-lg border border-border bg-black/20 p-6 shadow-sm">
            <div className="mb-4 flex flex-col gap-4 border-b border-border pb-4">
                <div className="flex items-center justify-between">
                    <h4 className="flex items-center gap-2 font-semibold">
                        <Swords className="h-5 w-5" />
                        Sub-stepping Visualizer
                    </h4>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">
                            {useInterpolation ? "Interpolation ON" : "Interpolation OFF"}
                        </span>
                        <button
                            onClick={() => setUseInterpolation(!useInterpolation)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${useInterpolation ? 'bg-blue-600' : 'bg-slate-700'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useInterpolation ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>

                {/* Speed Slider */}
                <div className="flex items-center gap-4 text-xs">
                    <span className="text-muted-foreground w-20">Swing Speed</span>
                    <input
                        type="range"
                        min="30"
                        max="90"
                        step="5"
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-blue-500"
                    />
                    <span className="font-mono w-8 text-right">{speed}°</span>
                </div>
            </div>

            <div className="relative mx-auto aspect-[400/350] w-full max-w-[400px] overflow-hidden rounded bg-black/40 border border-white/5">
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={350}
                    className="absolute inset-0"
                />

                {/* Helper Text Overlay */}
                <div className="absolute top-4 left-4 text-xs font-mono text-muted-foreground">
                    <div>SIM_FPS: 10</div>
                    <div>STATUS: {
                        (useInterpolation || speed <= 30) // Technically strictly low speed hits too
                            ? <span className="text-green-400">ROBUST</span>
                            : <span className="text-red-400">TUNNELING</span>
                    }</div>
                </div>

                <div className="absolute bottom-4 right-4 text-right">
                    <div className="text-2xl font-bold font-mono">{stats.hits}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Successful Hits</div>
                </div>
            </div>

            <div className="mt-4 text-center text-sm text-muted-foreground">
                {useInterpolation
                    ? "With Interpolation: The system fills the gap between frames, ensuring the hit is detected."
                    : "Without Interpolation: The fast sword swings 'teleport' over the target between frames, causing a miss."}
            </div>
        </div>
    );
}

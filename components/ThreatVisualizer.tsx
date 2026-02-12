"use client"

import { useEffect, useRef, useState } from 'react';
import { Eye, ShieldAlert } from 'lucide-react';

export default function ThreatVisualizer() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Refs for loop state (No re-renders)
    const mousePosRef = useRef({ x: 200, y: 150 });
    const threatRef = useRef(0);
    // Target State (Polar Coordinates for strafing)
    // angle: Current angle in radians (starting at -PI/2 = Up)
    // dir: 1 (clockwise) or -1 (counter-clockwise)
    const targetRef = useRef({ angle: -Math.PI / 2, dir: 1, speed: 0.00125 }); // 4x slower

    // React state for low-frequency UI updates (color changes only when distinct state changes)
    const [isAggro, setIsAggro] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const PLAYER = { x: 200, y: 300 };
        const CONE_ANGLE = Math.PI / 4; // 45 deg
        const CONE_DIST = 250;
        // Base distance closer (130), backing away to 230 when threatened
        const BASE_RADIUS = 130;

        let animationFrameId: number;

        const render = () => {
            // 1. Update Target (Strafing Arc)
            const targetState = targetRef.current;

            // Dynamic Radius based on Threat
            // 0 Threat -> 130px
            // 100 Threat -> 230px
            const targetRadius = BASE_RADIUS + (threatRef.current * 1.0);

            // Update Angle
            targetState.angle += targetState.speed * targetState.dir;

            // Ping-pong limits (Smaller Arc: ~60 degrees centered on Up)
            // Center = -PI/2 (~-1.57). Range: -1.0 to -2.1
            if (targetState.angle > -1.0) targetState.dir = -1;
            if (targetState.angle < -2.1) targetState.dir = 1;

            // Calculate Position
            const targetPos = {
                x: PLAYER.x + Math.cos(targetState.angle) * targetRadius,
                y: PLAYER.y + Math.sin(targetState.angle) * targetRadius
            };

            // 2. Logic
            const mouse = mousePosRef.current;
            const dx = mouse.x - PLAYER.x;
            const dy = mouse.y - PLAYER.y;
            const lookAngle = Math.atan2(dy, dx);

            const tdx = targetPos.x - PLAYER.x;
            const tdy = targetPos.y - PLAYER.y;
            const dist = Math.sqrt(tdx * tdx + tdy * tdy);
            const targetAngle = Math.atan2(tdy, tdx);

            let angleDiff = targetAngle - lookAngle;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

            const inCone = dist < CONE_DIST && Math.abs(angleDiff) < (CONE_ANGLE / 2);

            // 3. Threat Update
            let currentThreat = threatRef.current;
            if (inCone) {
                currentThreat = Math.min(100, currentThreat + 1.0); // Slower rise
            } else {
                currentThreat = Math.max(0, currentThreat - 0.5); // Fast decay
            }
            threatRef.current = currentThreat;

            // Sync React State only on threshold crossing (prevent spam)
            if (currentThreat >= 90 && !isAggro) setIsAggro(true); // Can't read state safely in loop, using functional update elsewhere or just simple variable?
            // Actually accessing external state in loop is stale closure issue if not careful.
            // We'll update a ref listener or simplified: Just check the REF vs a local tracker.
            // But we can't call setIsAggro every frame.
            // Workaround: We will DRAW the status text on Canvas to avoid React complexity entirely for the high-frequency UI.

            // 4. DRAW
            ctx.clearRect(0, 0, 400, 350);

            // Cone
            ctx.save();
            ctx.translate(PLAYER.x, PLAYER.y);
            ctx.rotate(lookAngle);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, CONE_DIST, -CONE_ANGLE / 2, CONE_ANGLE / 2);
            ctx.lineTo(0, 0);
            ctx.fillStyle = inCone ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)';
            ctx.fill();
            ctx.strokeStyle = inCone ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();

            // Player
            ctx.beginPath();
            ctx.arc(PLAYER.x, PLAYER.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#3b82f6';
            ctx.fill();

            // Target
            ctx.beginPath();
            ctx.arc(targetPos.x, targetPos.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = inCone ? '#ef4444' : '#64748b';
            ctx.fill();

            // Threat Bar
            const barW = 40;
            const barH = 5;
            const barX = targetPos.x - barW / 2;
            const barY = targetPos.y - 15;
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(barX, barY, barW, barH);
            ctx.fillStyle = currentThreat > 90 ? '#ef4444' : '#f59e0b';
            ctx.fillRect(barX, barY, barW * (currentThreat / 100), barH);

            // Status Text (Canvas)
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'right';
            if (currentThreat > 90) {
                ctx.fillStyle = '#ef4444';
                ctx.fillText("AGGRO TRIGGERED", 380, 20);
            } else {
                ctx.fillStyle = '#64748b';
                ctx.fillText("DETECTING...", 380, 20);
            }
            ctx.font = '10px sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(`Threat: ${Math.floor(currentThreat)}%`, 380, 35);

            animationFrameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, []); // Run once!

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mousePosRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    return (
        <div className="my-8 rounded-lg border border-border bg-black/20 p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
                <h4 className="flex items-center gap-2 font-semibold">
                    <Eye className="h-4 w-4" />
                    Interactive Threat Detection
                </h4>
                <span className="text-xs text-muted-foreground">Aim with your mouse (Vision Cone)</span>
            </div>

            <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                className="relative mx-auto aspect-[400/350] w-full max-w-[400px] cursor-crosshair overflow-hidden rounded bg-black/20"
            >
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={350}
                    className="absolute inset-0"
                />
            </div>

            <div className="mt-2 text-center text-sm text-muted-foreground">
                Looking at an enemy increases their Threat. High Threat = Aggro.
            </div>
        </div>
    );
}

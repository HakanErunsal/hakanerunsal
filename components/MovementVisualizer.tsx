"use client"

import { useEffect, useRef, useState } from 'react';
import { MousePointer2 } from 'lucide-react';

export default function MovementVisualizer() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 200, y: 100 });
    const [isHovering, setIsHovering] = useState(false);

    // Configuration
    const CENTER = { x: 200, y: 200 };
    const IDEAL_MIN = 100;
    const IDEAL_MAX = 150;
    const NUM_SAMPLES = 16;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Animation / Draw loop
        const render = () => {
            ctx.clearRect(0, 0, 400, 400);

            // Draw Ideal Range Rings
            ctx.beginPath();
            ctx.arc(CENTER.x, CENTER.y, IDEAL_MIN, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(100, 255, 100, 0.2)';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(CENTER.x, CENTER.y, IDEAL_MAX, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(100, 255, 100, 0.2)';
            ctx.stroke();

            // Fill ideal range
            ctx.beginPath();
            ctx.arc(CENTER.x, CENTER.y, IDEAL_MAX, 0, Math.PI * 2);
            ctx.arc(CENTER.x, CENTER.y, IDEAL_MIN, 0, Math.PI * 2, true);
            ctx.fillStyle = 'rgba(100, 255, 100, 0.05)';
            ctx.fill();

            // Calculate Target Info
            const dx = mousePos.x - CENTER.x;
            const dy = mousePos.y - CENTER.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const targetAngle = Math.atan2(dy, dx);

            // Draw AI Center
            ctx.beginPath();
            ctx.arc(CENTER.x, CENTER.y, 10, 0, Math.PI * 2);
            ctx.fillStyle = '#3b82f6'; // Blue-500
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText("AI", CENTER.x, CENTER.y);

            // Draw Mouse Target (if hovering)
            // We'll draw it regardless to show state
            ctx.beginPath();
            ctx.arc(mousePos.x, mousePos.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#ef4444'; // Red-500
            ctx.fill();

            // Evaluate Directions
            for (let i = 0; i < NUM_SAMPLES; i++) {
                const angle = (i * Math.PI * 2) / NUM_SAMPLES;

                let score = 0;

                // Dot product of direction vs direction to target
                // angles are equivalent to vectors [cos(angle), sin(angle)]
                // dot = cos(angle) * cos(targetAngle) + sin(angle) * sin(targetAngle)
                //     = cos(angle - targetAngle)
                const dot = Math.cos(angle - targetAngle);

                if (dist > IDEAL_MAX) {
                    // Too far: Favor directions TOWARDS target (dot close to 1)
                    // Score = (dot + 1) / 2  --> Maps -1..1 to 0..1
                    score = (dot + 1) * 0.5;
                } else if (dist < IDEAL_MIN) {
                    // Too close: Favor directions AWAY from target (dot close to -1)
                    // Score = (-dot + 1) / 2
                    score = (-dot + 1) * 0.5;
                } else {
                    // In range: Favor STRAFING (dot close to 0)
                    // Score = 1 - abs(dot)
                    score = 1.0 - Math.abs(dot);
                }

                // Visualize Arrow
                const len = 30 + (score * 50); // Length 30 to 80

                // Color gradient: Red (0) -> Yellow (0.5) -> Green (1)
                const r = score < 0.5 ? 255 : Math.floor(255 * (1 - (score - 0.5) * 2));
                const g = score > 0.5 ? 255 : Math.floor(255 * (score * 2));
                const color = `rgb(${r}, ${g}, 0)`;

                const ex = CENTER.x + Math.cos(angle) * len;
                const ey = CENTER.y + Math.sin(angle) * len;

                ctx.beginPath();
                ctx.moveTo(CENTER.x, CENTER.y);
                ctx.lineTo(ex, ey);
                ctx.strokeStyle = color;
                ctx.lineWidth = 2 + (score * 3);
                ctx.stroke();

                // Arrowhead
                const headLen = 6;
                ctx.beginPath();
                ctx.moveTo(ex, ey);
                ctx.lineTo(ex - headLen * Math.cos(angle - Math.PI / 6), ey - headLen * Math.sin(angle - Math.PI / 6));
                ctx.lineTo(ex - headLen * Math.cos(angle + Math.PI / 6), ey - headLen * Math.sin(angle + Math.PI / 6));
                ctx.fillStyle = color;
                ctx.fill();

                // Draw score text if high score
                if (score > 0.85) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.font = '10px monospace';
                    ctx.fillText(score.toFixed(2), ex + 10 * Math.cos(angle), ey + 10 * Math.sin(angle));
                }
            }
        };

        render();

    }, [mousePos]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePos({ x, y });
    };

    return (
        <div className="my-8 rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
                <h4 className="flex items-center gap-2 font-semibold">
                    <MousePointer2 className="h-4 w-4" />
                    Interactive Direction Sampling
                </h4>
                <span className="text-xs text-muted-foreground">Move mouse to simulate Target</span>
            </div>

            <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="relative mx-auto aspect-square w-full max-w-[400px] cursor-crosshair overflow-hidden rounded bg-black/20"
            >
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={400}
                    className="absolute inset-0 h-full w-full"
                />

                {/* Legend */}
                <div className="absolute bottom-2 left-2 text-[10px] text-muted-foreground bg-black/50 p-2 rounded pointer-events-none">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#3b82f6] rounded-full"></div> AI Pawn</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#ef4444] rounded-full"></div> Target</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[rgba(100,255,100,0.2)] border border-[rgba(100,255,100,0.5)] rounded-full"></div> Ideal Range</div>
                </div>
            </div>

            <div className="mt-2 text-center text-sm text-muted-foreground">
                Green arrows = High Score (Preferred Direction)
            </div>
        </div>
    );
}

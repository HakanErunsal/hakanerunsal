"use client"

import { useEffect, useRef } from 'react';
import { Brain } from 'lucide-react';

type AwarenessState = 'Unknown' | 'Suspicious' | 'Lost' | 'Detected';

const STATE_COLOR: Record<AwarenessState, string> = {
    Unknown: '#64748b',     // slate-500
    Suspicious: '#f59e0b',  // amber-500
    Lost: '#fb923c',        // orange-400
    Detected: '#ef4444',    // red-500
};

export default function AwarenessVisualizer() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // High-frequency state lives in refs (no re-renders).
    const mouseRef = useRef({ x: 200, y: 80 });
    const stateRef = useRef<AwarenessState>('Unknown');
    const graceRef = useRef(0);       // seconds left in the Lost grace window
    const suspRef = useRef(0);        // seconds left before Suspicious decays
    const lastKnownRef = useRef<{ x: number; y: number } | null>(null);
    const lastTimeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const W = 400, H = 350;
        const AI = { x: 200, y: 250 };
        const FACING = -Math.PI / 2;   // cone points up
        const CONE = Math.PI / 3;      // 60 degrees
        const SIGHT = 200;
        const HEAR = 120;
        const GRACE = 3.0;             // Lost grace seconds (GraceLossDuration)
        const SUSP = 3.0;              // Suspicious decay seconds

        let raf = 0;

        const step = (t: number) => {
            const dt = lastTimeRef.current ? Math.min(0.05, (t - lastTimeRef.current) / 1000) : 0;
            lastTimeRef.current = t;

            const p = mouseRef.current;
            const dx = p.x - AI.x, dy = p.y - AI.y;
            const dist = Math.hypot(dx, dy);
            const ang = Math.atan2(dy, dx);
            let diff = ang - FACING;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;

            const inSight = dist < SIGHT && Math.abs(diff) < CONE / 2;
            const inHear = dist < HEAR;

            let s = stateRef.current;
            if (inSight) {
                s = 'Detected';
                lastKnownRef.current = { x: p.x, y: p.y };
                graceRef.current = GRACE;
            } else if (s === 'Detected') {
                s = 'Lost';               // just lost sight
                graceRef.current = GRACE;
            } else if (s === 'Lost') {
                graceRef.current -= dt;   // grace window keeps engaging
                if (graceRef.current <= 0) {
                    if (inHear) { s = 'Suspicious'; suspRef.current = SUSP; }
                    else { s = 'Unknown'; lastKnownRef.current = null; }
                }
            } else if (inHear) {
                s = 'Suspicious';
                suspRef.current = SUSP;
            } else if (s === 'Suspicious') {
                suspRef.current -= dt;
                if (suspRef.current <= 0) s = 'Unknown';
            } else {
                s = 'Unknown';
            }
            stateRef.current = s;
            const col = STATE_COLOR[s];

            // DRAW
            ctx.clearRect(0, 0, W, H);

            // Hearing ring
            ctx.beginPath();
            ctx.arc(AI.x, AI.y, HEAR, 0, Math.PI * 2);
            ctx.fillStyle = inHear ? 'rgba(245,158,11,0.07)' : 'rgba(255,255,255,0.03)';
            ctx.fill();
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = 'rgba(245,158,11,0.30)';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.setLineDash([]);

            // Sight cone
            ctx.save();
            ctx.translate(AI.x, AI.y);
            ctx.rotate(FACING);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, SIGHT, -CONE / 2, CONE / 2);
            ctx.closePath();
            ctx.fillStyle = inSight ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.05)';
            ctx.fill();
            ctx.strokeStyle = inSight ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.18)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();

            // Last-known marker (Lost only)
            if (s === 'Lost' && lastKnownRef.current) {
                const lk = lastKnownRef.current;
                ctx.beginPath();
                ctx.arc(lk.x, lk.y, 7, 0, Math.PI * 2);
                ctx.setLineDash([3, 3]);
                ctx.strokeStyle = STATE_COLOR.Lost;
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.fillStyle = 'rgba(251,146,60,0.7)';
                ctx.font = '9px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('last seen', lk.x, lk.y - 12);
            }

            // AI pawn (colored by state)
            ctx.beginPath();
            ctx.arc(AI.x, AI.y, 11, 0, Math.PI * 2);
            ctx.fillStyle = col;
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('AI', AI.x, AI.y);

            // Player
            ctx.beginPath();
            ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#3b82f6';
            ctx.fill();

            // Status text
            ctx.textAlign = 'left';
            ctx.textBaseline = 'alphabetic';
            ctx.font = 'bold 13px sans-serif';
            ctx.fillStyle = col;
            ctx.fillText(s.toUpperCase(), 14, 24);
            ctx.font = '10px sans-serif';
            ctx.fillStyle = '#94a3b8';
            if (s === 'Lost') ctx.fillText(`grace ${Math.max(0, graceRef.current).toFixed(1)}s`, 14, 38);
            else if (s === 'Suspicious') ctx.fillText('heard, not seen', 14, 38);

            // State ladder
            const ladder: AwarenessState[] = ['Unknown', 'Suspicious', 'Lost', 'Detected'];
            ctx.textAlign = 'right';
            ctx.font = '10px monospace';
            ladder.forEach((st, i) => {
                const active = st === s;
                ctx.fillStyle = active ? STATE_COLOR[st] : 'rgba(148,163,184,0.4)';
                ctx.fillText((active ? '▶ ' : '   ') + st, W - 12, 20 + i * 16);
            });

            raf = requestAnimationFrame(step);
        };

        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, []);

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const r = containerRef.current.getBoundingClientRect();
        mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    return (
        <div className="my-8 rounded-lg border border-border bg-black/20 p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
                <h4 className="flex items-center gap-2 font-semibold">
                    <Brain className="h-4 w-4" />
                    Interactive Awareness States
                </h4>
                <span className="text-xs text-muted-foreground">Move the player through the cone and hearing ring</span>
            </div>

            <div
                ref={containerRef}
                onMouseMove={handleMove}
                className="relative mx-auto aspect-[400/350] w-full max-w-[400px] cursor-crosshair overflow-hidden rounded bg-black/20"
            >
                <canvas ref={canvasRef} width={400} height={350} className="absolute inset-0" />
            </div>

            <div className="mt-2 text-center text-sm text-muted-foreground">
                Seen = Detected. Lose sight = Lost (grace), then Suspicious if still heard, then Unknown.
            </div>
        </div>
    );
}

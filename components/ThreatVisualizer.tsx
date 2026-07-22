"use client"

import { useEffect, useRef } from 'react';
import { UePanel, UeViewport } from '@/components/ue-editor';

export default function ThreatVisualizer() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const mousePosRef = useRef({ x: 200, y: 80 });
    const lookDurationRef = useRef(0);
    const currentTimeThresholdRef = useRef(1.5);
    const strafeDirRef = useRef(1);
    const orbitAngleRef = useRef(-Math.PI / 2);
    const displayRadiusRef = useRef(68);
    const swapFlashRef = useRef(0);
    const randomSwapTimerRef = useRef(6);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const PLAYER = { x: 200, y: 175 };
        const ANGLE_THRESHOLD_DEG = 15;
        const ANGLE_THRESHOLD = (ANGLE_THRESHOLD_DEG * Math.PI) / 180;
        const BASE_TIME_THRESHOLD = 1.5;
        const BASE_RADIUS = 68;
        const THREAT_DISTANCE_SCALE = 0.35;
        const ORBIT_SPEED = 0.28;
        const CONE_LENGTH = 120;
        const RANDOM_SWAP_MIN = 5;
        const RANDOM_SWAP_MAX = 10;

        const scheduleRandomSwap = () => {
            randomSwapTimerRef.current =
                RANDOM_SWAP_MIN +
                Math.random() * (RANDOM_SWAP_MAX - RANDOM_SWAP_MIN);
        };

        const swapStrafe = () => {
            strafeDirRef.current *= -1;
            swapFlashRef.current = 1.2;
        };

        scheduleRandomSwap();

        let animationFrameId: number;
        let lastTime = performance.now();

        const render = (now: number) => {
            const delta = Math.min((now - lastTime) / 1000, 0.05);
            lastTime = now;

            randomSwapTimerRef.current -= delta;
            if (randomSwapTimerRef.current <= 0) {
                swapStrafe();
                scheduleRandomSwap();
            }

            const orbitAngle = orbitAngleRef.current;
            orbitAngleRef.current += ORBIT_SPEED * strafeDirRef.current * delta;

            const mouse = mousePosRef.current;
            const lookDir = {
                x: mouse.x - PLAYER.x,
                y: mouse.y - PLAYER.y,
            };
            const lookLen = Math.hypot(lookDir.x, lookDir.y) || 1;
            lookDir.x /= lookLen;
            lookDir.y /= lookLen;

            const currentRadius = displayRadiusRef.current;
            const enemyForThreat = {
                x: PLAYER.x + Math.cos(orbitAngle) * currentRadius,
                y: PLAYER.y + Math.sin(orbitAngle) * currentRadius,
            };

            const toEnemy = {
                x: enemyForThreat.x - PLAYER.x,
                y: enemyForThreat.y - PLAYER.y,
            };
            const toLen = Math.hypot(toEnemy.x, toEnemy.y) || 1;
            toEnemy.x /= toLen;
            toEnemy.y /= toLen;

            const rawDot = lookDir.x * toEnemy.x + lookDir.y * toEnemy.y;
            const isLooking = rawDot >= Math.cos(ANGLE_THRESHOLD);
            const threatLevel = isLooking ? Math.min(Math.max(rawDot, 0), 1) : 0;

            const distanceMultiplier = 1 + threatLevel * THREAT_DISTANCE_SCALE;
            const targetRadius = BASE_RADIUS * distanceMultiplier;
            displayRadiusRef.current += (targetRadius - displayRadiusRef.current) * Math.min(delta * 5, 1);

            const enemyPos = {
                x: PLAYER.x + Math.cos(orbitAngle) * displayRadiusRef.current,
                y: PLAYER.y + Math.sin(orbitAngle) * displayRadiusRef.current,
            };

            const timeThreshold = currentTimeThresholdRef.current;

            if (isLooking) {
                lookDurationRef.current += delta;
                if (lookDurationRef.current >= timeThreshold) {
                    swapStrafe();
                    scheduleRandomSwap();
                    lookDurationRef.current = 0;
                    currentTimeThresholdRef.current =
                        BASE_TIME_THRESHOLD +
                        Math.random() * BASE_TIME_THRESHOLD;
                }
            } else {
                lookDurationRef.current = 0;
                currentTimeThresholdRef.current = BASE_TIME_THRESHOLD;
            }

            if (swapFlashRef.current > 0) {
                swapFlashRef.current = Math.max(0, swapFlashRef.current - delta);
            }

            const lookAngle = Math.atan2(lookDir.y, lookDir.x);
            const durationProgress = isLooking
                ? Math.min(lookDurationRef.current / timeThreshold, 1)
                : 0;

            ctx.clearRect(0, 0, 400, 350);

            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.arc(PLAYER.x, PLAYER.y, BASE_RADIUS, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(100, 255, 100, 0.25)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.beginPath();
            ctx.arc(PLAYER.x, PLAYER.y, displayRadiusRef.current, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(245, 158, 11, ${0.15 + threatLevel * 0.35})`;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.save();
            ctx.translate(PLAYER.x, PLAYER.y);
            ctx.rotate(lookAngle);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, CONE_LENGTH, -ANGLE_THRESHOLD, ANGLE_THRESHOLD);
            ctx.lineTo(0, 0);
            ctx.fillStyle = isLooking ? 'rgba(239, 68, 68, 0.18)' : 'rgba(255, 255, 255, 0.05)';
            ctx.fill();
            ctx.strokeStyle = isLooking ? 'rgba(239, 68, 68, 0.45)' : 'rgba(255, 255, 255, 0.18)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();

            ctx.beginPath();
            ctx.moveTo(PLAYER.x, PLAYER.y);
            ctx.lineTo(
                PLAYER.x + lookDir.x * 40,
                PLAYER.y + lookDir.y * 40,
            );
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(PLAYER.x, PLAYER.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#3b82f6';
            ctx.fill();
            ctx.font = '9px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('Player', PLAYER.x, PLAYER.y + 20);

            const tangentAngle = orbitAngle + (strafeDirRef.current > 0 ? Math.PI / 2 : -Math.PI / 2);
            ctx.beginPath();
            ctx.arc(enemyPos.x, enemyPos.y, 9, 0, Math.PI * 2);
            ctx.fillStyle = isLooking ? '#ef4444' : '#64748b';
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(enemyPos.x, enemyPos.y);
            ctx.lineTo(
                enemyPos.x + Math.cos(tangentAngle) * 18,
                enemyPos.y + Math.sin(tangentAngle) * 18,
            );
            ctx.strokeStyle = swapFlashRef.current > 0 ? '#fbbf24' : '#94a3b8';
            ctx.lineWidth = swapFlashRef.current > 0 ? 3 : 2;
            ctx.stroke();

            if (isLooking && durationProgress > 0) {
                const arcRadius = 22;
                const startAngle = -Math.PI / 2;
                const endAngle = startAngle + durationProgress * Math.PI * 2;
                ctx.beginPath();
                ctx.arc(enemyPos.x, enemyPos.y, arcRadius, startAngle, endAngle);
                ctx.strokeStyle =
                    durationProgress < 0.5
                        ? `rgb(255, ${Math.floor(128 + durationProgress * 254)}, 0)`
                        : `rgb(255, ${Math.floor(128 - (durationProgress - 0.5) * 256)}, 0)`;
                ctx.lineWidth = 3;
                ctx.stroke();
            }

            const hudX = 12;
            let hudY = 18;
            ctx.textAlign = 'left';
            ctx.font = '10px sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(`Threat: ${(threatLevel * 100).toFixed(0)}%`, hudX, hudY);
            hudY += 14;
            ctx.fillText(`Distance × ${distanceMultiplier.toFixed(2)}`, hudX, hudY);
            hudY += 14;
            ctx.fillText(
                `Look: ${lookDurationRef.current.toFixed(1)}s / ${timeThreshold.toFixed(1)}s`,
                hudX,
                hudY,
            );
            hudY += 14;
            ctx.fillText(
                `Strafe: ${strafeDirRef.current > 0 ? 'CCW' : 'CW'}`,
                hudX,
                hudY,
            );
            if (swapFlashRef.current > 0) {
                hudY += 14;
                ctx.fillStyle = '#fbbf24';
                ctx.fillText('Strafe swapped', hudX, hudY);
            }

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mousePosRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    return (
        <UePanel
            title="Viewport"
            breadcrumb={["LVL_SEC_Showcase", "Threat"]}
            assetType="visualizer"
            caption="Enemy strafes slowly and may flip direction on its own. Aim inside the 15° cone to build threat and push the orbit outward; hold for 1.5s to force a strafe swap."
        >
            <UeViewport
                ref={containerRef}
                onMouseMove={handleMouseMove}
                className="relative mx-auto aspect-[400/350] w-full max-w-[400px]"
            >
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={350}
                    className="absolute inset-0"
                />
            </UeViewport>
        </UePanel>
    );
}

"use client"

import { useEffect, useState } from 'react';
import { Box, Zap, Workflow, ArrowDown, MoveDownLeft, MoveDownRight } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming this exists, typical in shadcn/ui. If not, I'll remove it.

// Fallback for cn if not present, but usually is in these templates.
// I'll assume standard className construction for safety though to avoid dependency issues.
function classNames(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

export default function ActionFlowVisualizer() {
    // 0: Evaluation (Top)
    // 1: Executing Ability (Left) 
    // 2: Executing BT 1 (Right)
    // 3: Chaining to BT 2 (Right + 1)
    const [state, setState] = useState(0);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const runLoop = () => {
            if (state === 0) {
                // Evaluation Phase -> Decide
                // Alternating logic: toggle between 1 (Ability) and 2 (BT) next time?
                // Let's rely on a counter or random to make it feel alive, or just fixed sequence.
                // Sequence: Eval -> Ability -> Eval -> BT -> Repeat

                // We need an external tracker aka "which turn is it".
                // State doesn't hold that. Let's use a simpler state machine.
            }
        };
    }, [state]);

    // Better approach: Single effect loop
    useEffect(() => {
        let mounted = true;

        const sequence = async () => {
            while (mounted) {
                // 1. Evaluate (Top)
                setState(0);
                await new Promise(r => setTimeout(r, 1000));

                // 2. Go Left (Ability)
                setState(1);
                await new Promise(r => setTimeout(r, 1500));

                // 3. Return (Eval)
                setState(0);
                await new Promise(r => setTimeout(r, 800));

                // 4. Go Right (BT 1)
                setState(2);
                await new Promise(r => setTimeout(r, 1000));

                // 5. Chain (BT 2)
                setState(3);
                await new Promise(r => setTimeout(r, 1500));
            }
        };

        sequence();

        return () => { mounted = false; };
    }, []);

    const getNodeStyle = (isActive: boolean, color: string) => {
        return classNames(
            "relative z-10 flex h-16 w-16 items-center justify-center rounded-lg border-2 transition-all duration-500",
            isActive ? `bg-opacity-20 ${color} border-current scale-110 shadow-[0_0_20px_rgba(0,0,0,0.3)]` : "border-border bg-card text-muted-foreground scale-100 opacity-60"
        );
    };

    const getLineStyle = (isActive: boolean) => {
        return classNames(
            "absolute transition-all duration-500",
            isActive ? "opacity-100 stroke-[3px]" : "opacity-20 stroke-[1px]"
        );
    };

    return (
        <div className="my-8 rounded-lg border border-border bg-black/20 p-8 shadow-sm">
            <div className="relative mx-auto flex h-[300px] w-full max-w-[500px] flex-col items-center">

                {/* TOP NODE: Component */}
                <div className={classNames(getNodeStyle(state === 0, "bg-blue-500/20 border-blue-500 text-blue-500"), "mb-4")}>
                    <Box className="h-8 w-8" />
                    <div className="absolute -top-6 whitespace-nowrap text-xs font-semibold text-muted-foreground">
                        ActionEvaluationComponent
                    </div>
                </div>

                {/* MIDDLE SECTION: Lines and Label */}
                <div className="relative flex h-24 w-full items-center justify-center">

                    {/* Center Label */}
                    <div className={classNames(
                        "z-20 rounded bg-background/80 px-3 py-1 text-xs font-mono transition-all duration-300 border border-border",
                        state === 0 ? "text-foreground border-primary" : "text-muted-foreground"
                    )}>
                        EvaluateBestAction()
                    </div>

                    {/* Path to Left (Ability) */}
                    {/* Path to Left (Ability) */}
                    <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 500 100" preserveAspectRatio="none">
                        {/* Top to Left */}
                        <path
                            d="M 250 0 C 250 40, 100 0, 100 80"
                            fill="none"
                            stroke={state === 1 ? "#22c55e" : "currentColor"}
                            className={getLineStyle(state === 1)}
                        />

                        {/* Top to Right */}
                        <path
                            d="M 250 0 C 250 40, 400 0, 400 80"
                            fill="none"
                            stroke={state >= 2 ? "#f97316" : "currentColor"}
                            className={getLineStyle(state >= 2)}
                        />
                    </svg>
                </div>

                {/* BOTTOM NODES */}
                <div className="mt-4 flex w-full justify-between px-8">

                    {/* LEFT: Ability */}
                    <div className="flex w-[120px] flex-col items-center gap-2">
                        <div className={getNodeStyle(state === 1, "bg-green-500/20 border-green-500 text-green-500")}>
                            <Zap className="h-8 w-8" />
                        </div>
                        <div className={classNames("text-xs transition-colors duration-300", state === 1 ? "text-green-500 font-bold" : "text-muted-foreground")}>
                            Gameplay Ability
                        </div>
                        <div className={classNames("text-[10px] text-muted-foreground transition-opacity duration-300", state === 1 ? "opacity-100" : "opacity-0")}>
                            (Simple Action)
                        </div>
                    </div>

                    {/* RIGHT: Behavior Tree Chain */}
                    <div className="flex w-[200px] flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                            {/* First BT */}
                            <div className={getNodeStyle(state >= 2, "bg-orange-500/20 border-orange-500 text-orange-500")}>
                                <Workflow className="h-8 w-8" />
                            </div>

                            {/* Chain Arrow */}
                            <ArrowDown className={classNames(
                                "h-4 w-4 -rotate-90 transition-all duration-300",
                                state === 3 ? "text-orange-500 opacity-100" : "text-muted-foreground opacity-20"
                            )} />

                            {/* Second BT */}
                            <div className={classNames(
                                getNodeStyle(state === 3, "bg-orange-500/20 border-orange-500 text-orange-500"),
                                state < 3 ? "opacity-0 scale-50" : "" // Hide when not active
                            )}>
                                <Workflow className="h-8 w-8" />
                            </div>
                        </div>

                        <div className={classNames("text-xs transition-colors duration-300", state >= 2 ? "text-orange-500 font-bold" : "text-muted-foreground")}>
                            Behavior Tree Sequence
                        </div>
                        <div className={classNames("text-[10px] text-muted-foreground transition-opacity duration-300", state >= 2 ? "opacity-100" : "opacity-0")}>
                            {state === 3 ? "(Steps can chain!)" : "(Complex Logic)"}
                        </div>
                    </div>

                </div>

            </div>

            <div className="mt-4 text-center text-sm text-muted-foreground">
                The system dynamically chooses the execution method. <span className="text-orange-500">Behavior Trees can be chained</span> for complex sequences.
            </div>
        </div>
    );
}

"use client"

import { useEffect, useState } from 'react';
import { Box, Zap, Workflow, ArrowDown } from 'lucide-react';
import { UeBlueprintNode, UePanel, UE_NODE_HEADERS } from '@/components/ue-editor';

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

    const getLineStyle = (isActive: boolean) => {
        return classNames(
            "absolute transition-all duration-500",
            isActive ? "opacity-100 stroke-[3px]" : "opacity-20 stroke-[1px]"
        );
    };

    return (
        <UePanel
            title="Action Evaluation Flow"
            breadcrumb={["Content", "Plugins", "SoulslikeEnemyCombat", "Components"]}
            assetType="component"
            caption={
                <>The system dynamically chooses the execution method. <span className="text-[#FFB800]">Behavior Trees can be chained</span> for complex sequences.</>
            }
        >
            <div className="relative mx-auto flex h-[300px] w-full max-w-[500px] flex-col items-center">

                {/* TOP NODE: Component */}
                <div className="relative mb-4">
                    <UeBlueprintNode
                        compact
                        active={state === 0}
                        category="component"
                        title="ActionEvaluationComponent"
                        icon={<Box className="h-8 w-8" />}
                    />
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono text-[#888888]">
                        ActionEvaluationComponent
                    </div>
                </div>

                {/* MIDDLE SECTION: Lines and Label */}
                <div className="relative flex h-24 w-full items-center justify-center">

                    {/* Center Label */}
                    <div className={classNames(
                        "z-20 rounded-sm border px-3 py-1 text-xs font-mono transition-all duration-300",
                        state === 0 ? "border-[#0078d4] bg-[#1e1e22] text-[#c8c8c8]" : "border-[#3a3a3f] bg-[#1a1a1c] text-[#666666]"
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
                            stroke={state === 1 ? UE_NODE_HEADERS.action : "currentColor"}
                            className={getLineStyle(state === 1)}
                        />

                        {/* Top to Right */}
                        <path
                            d="M 250 0 C 250 40, 400 0, 400 80"
                            fill="none"
                            stroke={state >= 2 ? UE_NODE_HEADERS.event : "currentColor"}
                            className={getLineStyle(state >= 2)}
                        />
                    </svg>
                </div>

                {/* BOTTOM NODES */}
                <div className="mt-4 flex w-full justify-between px-8">

                    {/* LEFT: Ability */}
                    <div className="flex w-[120px] flex-col items-center gap-2">
                        <UeBlueprintNode
                            compact
                            active={state === 1}
                            category="ability"
                            title="Gameplay Ability"
                            icon={<Zap className="h-8 w-8" />}
                        />
                        <div className={classNames("text-xs transition-colors duration-300 font-mono", state === 1 ? "text-[#6CC644] font-bold" : "text-[#666666]")}>
                            Gameplay Ability
                        </div>
                        <div className={classNames("text-[10px] text-[#666666] transition-opacity duration-300", state === 1 ? "opacity-100" : "opacity-0")}>
                            (Simple Action)
                        </div>
                    </div>

                    {/* RIGHT: Behavior Tree Chain */}
                    <div className="flex w-[200px] flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                            <UeBlueprintNode
                                compact
                                active={state >= 2}
                                category="flow"
                                title="Behavior Tree"
                                icon={<Workflow className="h-8 w-8" />}
                            />

                            <ArrowDown className={classNames(
                                "h-4 w-4 -rotate-90 transition-all duration-300",
                                state === 3 ? "text-[#FFB800] opacity-100" : "text-[#666666] opacity-20"
                            )} />

                            <div className={classNames(state < 3 ? "opacity-0 scale-50" : "")}>
                                <UeBlueprintNode
                                    compact
                                    active={state === 3}
                                    category="flow"
                                    title="Behavior Tree 2"
                                    icon={<Workflow className="h-8 w-8" />}
                                />
                            </div>
                        </div>

                        <div className={classNames("text-xs transition-colors duration-300 font-mono", state >= 2 ? "text-[#FFB800] font-bold" : "text-[#666666]")}>
                            Behavior Tree Sequence
                        </div>
                        <div className={classNames("text-[10px] text-[#666666] transition-opacity duration-300", state >= 2 ? "opacity-100" : "opacity-0")}>
                            {state === 3 ? "(Steps can chain!)" : "(Complex Logic)"}
                        </div>
                    </div>

                </div>

            </div>
        </UePanel>
    );
}

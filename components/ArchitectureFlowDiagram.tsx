"use client"

import { Brain, GitBranch, Cpu, Crosshair, Workflow, Zap, ChevronDown } from 'lucide-react';
import { UeBlueprintNode, UePanel, ueConnector } from '@/components/ue-editor';

function Connector({ label }: { label?: string }) {
    return (
        <div className="flex flex-col items-center py-1">
            <div className={ueConnector(false)} style={{ height: '1rem' }} />
            <ChevronDown className="-mt-1 h-4 w-4 text-[#666666]" />
            {label && (
                <div className="mt-0.5 max-w-[34ch] text-center text-[10px] uppercase tracking-wide text-[#666666]">
                    {label}
                </div>
            )}
        </div>
    );
}

export default function ArchitectureFlowDiagram() {
    return (
        <UePanel
            title="Architecture"
            breadcrumb={["Content", "Plugins", "SoulslikeEnemyCombat"]}
            assetType="statetree"
            caption="One brain, chosen from the config. A StateTree adds graph structure; the built-in loop runs the same combat cycle without one."
        >
            <div className="mx-auto flex max-w-[560px] flex-col items-stretch">
                <div className="mx-auto w-full max-w-[300px]">
                    <UeBlueprintNode
                        title="SEC Brain"
                        subtitle="reads the AI Config on possession"
                        category="state"
                        icon={<Brain className="h-4 w-4" />}
                        active
                    />
                </div>

                <Connector label="Default State Tree set, or empty" />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    <UeBlueprintNode
                        title="StateTree"
                        subtitle="graph-authored"
                        category="state"
                        icon={<GitBranch className="h-4 w-4" />}
                        active
                    />
                    <UeBlueprintNode
                        title="Built-in loop"
                        subtitle="no StateTree needed"
                        category="component"
                        icon={<Cpu className="h-4 w-4" />}
                        active
                    />
                </div>

                <Connector label="either path drives the combat loop" />

                <div className="mx-auto w-full max-w-[320px]">
                    <UeBlueprintNode
                        title="Action Evaluation"
                        subtitle="scores actions through scorers and gates"
                        category="function"
                        icon={<Crosshair className="h-4 w-4" />}
                        active
                    />
                </div>

                <Connector label="executes the chosen action as" />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    <UeBlueprintNode
                        title="Behavior Tree"
                        subtitle="multi-step sequences"
                        category="flow"
                        icon={<Workflow className="h-4 w-4" />}
                        active
                    />
                    <UeBlueprintNode
                        title="Gameplay Ability"
                        subtitle="single GAS action"
                        category="ability"
                        icon={<Zap className="h-4 w-4" />}
                        active
                    />
                </div>
            </div>
        </UePanel>
    );
}

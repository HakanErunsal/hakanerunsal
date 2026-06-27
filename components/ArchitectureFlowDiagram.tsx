"use client"

import { Brain, GitBranch, Cpu, Crosshair, Workflow, Zap, ChevronDown } from 'lucide-react';

// Static, hand-editable flow of the SEC decision path. Not animated. To change it, edit the
// JSX below; the boxes are plain markup.

type NodeProps = {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    accent: string;   // tailwind text color
    border: string;   // tailwind border color
};

function Node({ icon, title, subtitle, accent, border }: NodeProps) {
    return (
        <div className={`rounded-lg border ${border} bg-card/60 px-4 py-3 text-center`}>
            <div className="flex items-center justify-center gap-2">
                <span className={accent}>{icon}</span>
                <span className={`text-sm font-semibold ${accent}`}>{title}</span>
            </div>
            {subtitle && <div className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</div>}
        </div>
    );
}

function Connector({ label }: { label?: string }) {
    return (
        <div className="flex flex-col items-center py-1">
            <div className="h-4 w-px bg-border" />
            <ChevronDown className="-mt-1 h-4 w-4 text-muted-foreground" />
            {label && (
                <div className="mt-0.5 max-w-[34ch] text-center text-[10px] uppercase tracking-wide text-muted-foreground">
                    {label}
                </div>
            )}
        </div>
    );
}

export default function ArchitectureFlowDiagram() {
    return (
        <div className="my-8 rounded-xl border border-border bg-black/20 p-5 shadow-sm sm:p-6">
            <div className="mb-4 text-center text-sm font-semibold text-foreground/80">
                How an enemy thinks
            </div>

            <div className="mx-auto flex max-w-[560px] flex-col items-stretch">
                {/* Brain at the root */}
                <div className="mx-auto w-full max-w-[300px]">
                    <Node
                        icon={<Brain className="h-4 w-4" />}
                        title="SECBrain"
                        subtitle="reads AIConfig on possession"
                        accent="text-indigo-400"
                        border="border-indigo-500/50"
                    />
                </div>

                <Connector label="DefaultStateTree set, or empty" />

                {/* The two brain modes */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    <Node
                        icon={<GitBranch className="h-4 w-4" />}
                        title="StateTree"
                        subtitle="graph-authored"
                        accent="text-sky-400"
                        border="border-sky-500/50"
                    />
                    <Node
                        icon={<Cpu className="h-4 w-4" />}
                        title="Native loop"
                        subtitle="C++, no StateTree"
                        accent="text-emerald-400"
                        border="border-emerald-500/50"
                    />
                </div>

                <Connector label="either path drives the combat loop" />

                {/* Action evaluation */}
                <div className="mx-auto w-full max-w-[320px]">
                    <Node
                        icon={<Crosshair className="h-4 w-4" />}
                        title="Action Evaluation"
                        subtitle="scores actions through scorers and gates"
                        accent="text-green-400"
                        border="border-green-500/50"
                    />
                </div>

                <Connector label="executes the chosen action as" />

                {/* Execution */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    <Node
                        icon={<Workflow className="h-4 w-4" />}
                        title="Behavior Tree"
                        subtitle="multi-step sequences"
                        accent="text-orange-400"
                        border="border-orange-500/50"
                    />
                    <Node
                        icon={<Zap className="h-4 w-4" />}
                        title="Gameplay Ability"
                        subtitle="single GAS action"
                        accent="text-violet-400"
                        border="border-violet-500/50"
                    />
                </div>
            </div>

            <div className="mt-5 text-center text-xs text-muted-foreground">
                One brain, chosen from the config. A StateTree adds graph structure; the native loop runs the same combat cycle without one.
            </div>
        </div>
    );
}

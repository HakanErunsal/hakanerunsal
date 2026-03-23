"use client"

import { useEffect, useState } from 'react';
import { Shield, Zap, AlertTriangle, CheckCircle, XCircle, Clock, Tag } from 'lucide-react';

function classNames(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

type Phase =
    | 'idle'
    | 'stimulus'
    | 'gates'
    | 'gates-blocked'
    | 'cancel-action'
    | 'activate'
    | 'running'
    | 'complete';

const phaseLabels: Record<Phase, string> = {
    idle: 'Waiting for stimulus…',
    stimulus: '⚡ Damage received! Evaluating reactions…',
    gates: '🔍 Checking gates: cooldown, tags, priority…',
    'gates-blocked': '🚫 Blocked by SEC.Reaction.BlockReactions tag',
    'cancel-action': '✋ Cancelling current action…',
    activate: '🎯 Activating parry ability…',
    running: '⏳ Ability executing…',
    complete: '✅ Reaction complete!',
};

export default function ReactionFlowVisualizer() {
    const [phase, setPhase] = useState<Phase>('idle');
    const [cycle, setCycle] = useState(0);

    useEffect(() => {
        let mounted = true;

        const sequence = async () => {
            while (mounted) {
                const isBlockedCycle = cycle % 3 === 2;

                setPhase('idle');
                await new Promise(r => setTimeout(r, 1200));
                if (!mounted) return;

                setPhase('stimulus');
                await new Promise(r => setTimeout(r, 1000));
                if (!mounted) return;

                setPhase('gates');
                await new Promise(r => setTimeout(r, 1200));
                if (!mounted) return;

                if (isBlockedCycle) {
                    setPhase('gates-blocked');
                    await new Promise(r => setTimeout(r, 1800));
                    if (!mounted) return;
                    setCycle(c => c + 1);
                    continue;
                }

                setPhase('cancel-action');
                await new Promise(r => setTimeout(r, 800));
                if (!mounted) return;

                setPhase('activate');
                await new Promise(r => setTimeout(r, 800));
                if (!mounted) return;

                setPhase('running');
                await new Promise(r => setTimeout(r, 1500));
                if (!mounted) return;

                setPhase('complete');
                await new Promise(r => setTimeout(r, 1200));
                if (!mounted) return;

                setCycle(c => c + 1);
            }
        };

        sequence();
        return () => { mounted = false; };
    }, [cycle]);

    const nodeStyle = (active: boolean, color: string) =>
        classNames(
            "relative flex items-center gap-3 rounded-lg border-2 px-4 py-3 transition-all duration-500",
            active
                ? `${color} scale-[1.02] shadow-lg`
                : "border-border bg-card text-muted-foreground opacity-50 scale-100"
        );

    const isActive = (phases: Phase[]) => phases.includes(phase);
    const isPast = (phases: Phase[]) => {
        const order: Phase[] = ['idle', 'stimulus', 'gates', 'cancel-action', 'activate', 'running', 'complete'];
        const currentIdx = order.indexOf(phase);
        return phases.some(p => order.indexOf(p) < currentIdx && currentIdx > 0);
    };

    const connectorStyle = (active: boolean) =>
        classNames(
            "mx-auto h-6 w-px transition-all duration-500",
            active ? "bg-primary" : "bg-border"
        );

    return (
        <div className="my-8 rounded-lg border border-border bg-black/20 p-6 shadow-sm">
            {/* Status bar */}
            <div className="mb-6 flex items-center justify-center gap-2 rounded-md bg-background/60 px-4 py-2 border border-border">
                <div className={classNames(
                    "h-2 w-2 rounded-full transition-colors duration-300",
                    phase === 'idle' ? "bg-muted-foreground" :
                        phase === 'gates-blocked' ? "bg-red-500" :
                            phase === 'complete' ? "bg-green-500" :
                                "bg-yellow-500 animate-pulse"
                )} />
                <span className="text-sm font-mono text-muted-foreground">
                    {phaseLabels[phase]}
                </span>
            </div>

            <div className="mx-auto max-w-md space-y-0">
                {/* 1. Stimulus */}
                <div className={nodeStyle(isActive(['stimulus']), "border-yellow-500 bg-yellow-500/10 text-yellow-500")}>
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    <div>
                        <div className="text-sm font-semibold">Stimulus (Your Code)</div>
                        <div className="text-xs opacity-75">OnDamageReceived, OnSenseDetected…</div>
                    </div>
                </div>

                <div className={connectorStyle(isActive(['stimulus', 'gates', 'gates-blocked']))} />

                {/* 2. Evaluate */}
                <div className={nodeStyle(
                    isActive(['gates', 'gates-blocked']),
                    phase === 'gates-blocked'
                        ? "border-red-500 bg-red-500/10 text-red-500"
                        : "border-blue-500 bg-blue-500/10 text-blue-500"
                )}>
                    <Tag className="h-5 w-5 shrink-0" />
                    <div>
                        <div className="text-sm font-semibold">EvaluateBestReaction(Category)</div>
                        <div className="text-xs opacity-75">
                            {phase === 'gates-blocked'
                                ? "❌ BlockReactions tag present on ASC"
                                : "Priority → Weighted random → Gate checks"
                            }
                        </div>
                    </div>
                </div>

                {phase !== 'gates-blocked' && (
                    <>
                        <div className={connectorStyle(isActive(['cancel-action', 'activate', 'running', 'complete']) || isPast(['gates']))} />

                        {/* 3. Cancel Action */}
                        <div className={nodeStyle(isActive(['cancel-action']), "border-orange-500 bg-orange-500/10 text-orange-500")}>
                            <XCircle className="h-5 w-5 shrink-0" />
                            <div>
                                <div className="text-sm font-semibold">Cancel Current Action</div>
                                <div className="text-xs opacity-75">StopCurrentAction() if bCancelCurrentAction</div>
                            </div>
                        </div>

                        <div className={connectorStyle(isActive(['activate', 'running', 'complete']) || isPast(['cancel-action']))} />

                        {/* 4. Execute */}
                        <div className={nodeStyle(isActive(['activate', 'running']), "border-purple-500 bg-purple-500/10 text-purple-500")}>
                            <Zap className="h-5 w-5 shrink-0" />
                            <div>
                                <div className="text-sm font-semibold">ExecuteReaction(Id, Context)</div>
                                <div className="text-xs opacity-75">
                                    {phase === 'running'
                                        ? "Ability running… waiting for AbilityEndTag"
                                        : "AddTags → Pack context → Activate ability"
                                    }
                                </div>
                            </div>
                            {phase === 'running' && (
                                <Clock className="h-4 w-4 shrink-0 animate-spin text-purple-400" />
                            )}
                        </div>

                        <div className={connectorStyle(isActive(['complete']) || isPast(['running']))} />

                        {/* 5. Complete */}
                        <div className={nodeStyle(isActive(['complete']), "border-green-500 bg-green-500/10 text-green-500")}>
                            <CheckCircle className="h-5 w-5 shrink-0" />
                            <div>
                                <div className="text-sm font-semibold">OnReactionCompleted</div>
                                <div className="text-xs opacity-75">Remove AddTags → Fire delegate → Reset</div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
                Reactions are <span className="text-yellow-500">event-driven</span> - your code decides <em>when</em>, the system decides <em>what</em>.
                <span className="text-red-500"> Every 3rd cycle shows a blocked reaction.</span>
            </div>
        </div>
    );
}

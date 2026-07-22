"use client"

import { useEffect, useState } from 'react';
import { Zap, AlertTriangle, CheckCircle, XCircle, Clock, Tag } from 'lucide-react';
import { UeBlueprintNode, UePanel, ueConnector, ueStatusBar } from '@/components/ue-editor';
import { cn } from '@/lib/utils';

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

    const isActive = (phases: Phase[]) => phases.includes(phase);
    const isPast = (phases: Phase[]) => {
        const order: Phase[] = ['idle', 'stimulus', 'gates', 'cancel-action', 'activate', 'running', 'complete'];
        const currentIdx = order.indexOf(phase);
        return phases.some(p => order.indexOf(p) < currentIdx && currentIdx > 0);
    };

    const statusDotColor =
        phase === 'idle' ? 'bg-[#666666]' :
        phase === 'gates-blocked' ? 'bg-[#FF4444]' :
        phase === 'complete' ? 'bg-[#6CC644]' :
        'bg-[#FFB800] animate-pulse';

    const isBlocked = phase === 'gates-blocked';

    return (
        <UePanel
            title="Reaction Evaluation Flow"
            breadcrumb={["Content", "Plugins", "SoulslikeEnemyCombat", "Components"]}
            assetType="component"
            caption={
                <>Reactions are <span className="text-[#FFB800]">event-driven</span> — your code decides <em>when</em>, the system decides <em>what</em>. <span className="text-[#FF4444]">Every 3rd cycle shows a blocked reaction.</span></>
            }
        >
            <div className={cn(ueStatusBar(phase !== 'idle'), "mb-6 min-h-[2.25rem] justify-center")}>
                <div className={cn("h-2 w-2 rounded-full transition-colors duration-300", statusDotColor)} />
                <span className="font-mono text-[#888888]">{phaseLabels[phase]}</span>
            </div>

            <div className="mx-auto min-h-[420px] max-w-md space-y-0">
                <UeBlueprintNode
                    title="Stimulus (Your Code)"
                    subtitle="OnDamageReceived, OnSenseDetected…"
                    category="event"
                    icon={<AlertTriangle className="h-4 w-4" />}
                    active={isActive(['stimulus'])}
                />

                <div className={ueConnector(isActive(['stimulus', 'gates', 'gates-blocked']))} />

                <UeBlueprintNode
                    title="EvaluateBestReaction(Category)"
                    subtitle={
                        isBlocked
                            ? "❌ BlockReactions tag present on ASC"
                            : "Gates → Scorers → Priority → Weighted random"
                    }
                    category={isBlocked ? 'gate' : 'function'}
                    icon={<Tag className="h-4 w-4" />}
                    active={isActive(['gates', 'gates-blocked'])}
                />

                <div className={ueConnector(!isBlocked && (isActive(['cancel-action', 'activate', 'running', 'complete']) || isPast(['gates'])))} />

                <UeBlueprintNode
                    title="Cancel Current Action"
                    subtitle={isBlocked ? "Skipped — evaluation returned none" : "StopCurrentAction() if bCancelCurrentAction"}
                    category="event"
                    icon={<XCircle className="h-4 w-4" />}
                    active={!isBlocked && isActive(['cancel-action'])}
                    disabled={isBlocked}
                />

                <div className={ueConnector(!isBlocked && (isActive(['activate', 'running', 'complete']) || isPast(['cancel-action'])))} />

                <UeBlueprintNode
                    title="ExecuteReaction(Id, Context)"
                    subtitle={
                        isBlocked
                            ? "Skipped — no reaction to execute"
                            : phase === 'running'
                                ? "Ability running… waiting for AbilityEndTag"
                                : "AddTags → Pack context → Activate ability"
                    }
                    category="reaction"
                    icon={<Zap className="h-4 w-4" />}
                    active={!isBlocked && isActive(['activate', 'running'])}
                    disabled={isBlocked}
                    trailing={!isBlocked && phase === 'running' ? <Clock className="h-4 w-4 animate-spin" /> : undefined}
                />

                <div className={ueConnector(!isBlocked && (isActive(['complete']) || isPast(['running'])))} />

                <UeBlueprintNode
                    title="OnReactionCompleted"
                    subtitle={isBlocked ? "Skipped — flow ended at evaluation" : "Remove AddTags → Fire delegate → Reset"}
                    category="action"
                    icon={<CheckCircle className="h-4 w-4" />}
                    active={!isBlocked && isActive(['complete'])}
                    disabled={isBlocked}
                />
            </div>
        </UePanel>
    );
}

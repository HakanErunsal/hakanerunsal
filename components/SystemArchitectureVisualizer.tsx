"use client"

import { useState, useCallback } from 'react';
import {
    Brain, Zap, Shield, Move, Settings, Radio,
    Hexagon, Server, Monitor, ChevronRight, ChevronLeft,
    ArrowRight, Network, ChevronDown, Layers, ListTree, X
} from 'lucide-react';
import { UePanel, ueDetailsPanel, UeActorComponentIcon, UeDataAssetThumbnailIcon } from '@/components/ue-editor';

type NodeId =
    | 'aiconfig' | 'combatcontroller' | 'secbrain' | 'actioneval' | 'reactioneval'
    | 'movementeval' | 'actionset' | 'reactionset' | 'combatrole' | 'asc';

type Side = 'controller' | 'pawn' | 'data';
type ViewMode = 'simple' | 'full';
type SimpleBoxId = 'config' | 'controller' | 'pawn';

interface NodeDef {
    id: NodeId;
    label: string;
    friendlyLabel: string;
    shortLabel: string;
    icon: typeof Brain;
    color: string;
    side: Side;
    simpleBox: SimpleBoxId;
    description: string;
    details: string[];
}

interface ConnectionDef { from: NodeId; to: NodeId; label: string; }

interface StoryStep {
    title: string;
    description: string;
    simpleBoxes: SimpleBoxId[];
    nodes: NodeId[];
    connectionIndices: number[];
}

/** Reserved slots so step panel height never jumps */
const MAX_CONNECTION_SLOTS = 2;

const palette: Record<string, {
    bg: string; border: string; text: string; glow: string; hexFill: string;
}> = {
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/50', text: 'text-blue-400', glow: 'shadow-[0_0_12px_rgba(59,130,246,0.18)]', hexFill: 'rgba(59,130,246,0.12)' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/50', text: 'text-green-400', glow: 'shadow-[0_0_12px_rgba(34,197,94,0.18)]', hexFill: 'rgba(34,197,94,0.12)' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/50', text: 'text-orange-400', glow: 'shadow-[0_0_12px_rgba(249,115,22,0.18)]', hexFill: 'rgba(249,115,22,0.12)' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/50', text: 'text-purple-400', glow: 'shadow-[0_0_12px_rgba(168,85,247,0.18)]', hexFill: 'rgba(168,85,247,0.12)' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/50', text: 'text-cyan-400', glow: 'shadow-[0_0_12px_rgba(6,182,212,0.18)]', hexFill: 'rgba(6,182,212,0.12)' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/50', text: 'text-amber-400', glow: 'shadow-[0_0_12px_rgba(245,158,11,0.18)]', hexFill: 'rgba(245,158,11,0.12)' },
    red: { bg: 'bg-red-500/10', border: 'border-red-500/50', text: 'text-red-400', glow: 'shadow-[0_0_12px_rgba(239,68,68,0.18)]', hexFill: 'rgba(239,68,68,0.12)' },
    indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/50', text: 'text-indigo-400', glow: 'shadow-[0_0_12px_rgba(99,102,241,0.18)]', hexFill: 'rgba(99,102,241,0.12)' },
};

const simpleBoxPalette: Record<SimpleBoxId, { color: keyof typeof palette; icon: typeof Settings; title: string; subtitle: string }> = {
    config: { color: 'amber', icon: Settings, title: 'Enemy AI Config', subtitle: 'Attacks, reactions, movement' },
    controller: { color: 'blue', icon: Server, title: 'AI Controller', subtitle: 'Hub, brain, evaluators' },
    pawn: { color: 'green', icon: Monitor, title: 'Pawn', subtitle: 'Movelists + abilities (replicated)' },
};

const nodes: NodeDef[] = [
    { id: 'aiconfig', label: 'EnemyAIConfig', friendlyLabel: 'Enemy config', shortLabel: 'AIConfig', icon: Settings, color: 'amber', side: 'data', simpleBox: 'config', description: 'Data asset that defines everything about an enemy\'s behavior.', details: ['Resolution: Pawn IEnemyAIConfigProvider → Controller DefaultAIConfig', 'Contains: DefaultActionSet, RoleActionSets, DefaultReactionSet, RoleReactionSets', 'Contains: DefaultMovementProfile, RoleMovementProfiles, DefaultStateTree', 'Customize: Create EnemyAIConfig data asset, assign to pawn or controller'] },
    { id: 'combatcontroller', label: 'SECCombatControllerComponent', friendlyLabel: 'Combat hub', shortLabel: 'CombatController', icon: Network, color: 'blue', side: 'controller', simpleBox: 'controller', description: 'Orchestrator. Caches AIConfig, syncs everything on role changes.', details: ['Lives on AI Controller (auto-created by EnemyControllerBase)', 'On possession: resolves AIConfig, registers with role subsystem', 'On role change: SyncStateForCombatRole() → syncs actions, reactions, movement', 'Customize: Override SyncStateForCombatRole in Blueprint'] },
    { id: 'secbrain', label: 'SECBrainComponent', friendlyLabel: 'Brain', shortLabel: 'SECBrain', icon: Brain, color: 'indigo', side: 'controller', simpleBox: 'controller', description: 'Runs StateTree from config, or native C++ combat loop when none is set.', details: ['DefaultStateTree set → runs StateTree; empty → native loop', 'Native loop: context → move → poll best action (~0.1s cadence)', 'Customize: leave DefaultStateTree empty for native loop only'] },
    { id: 'actioneval', label: 'ActionEvaluationComponent', friendlyLabel: 'Picks attacks', shortLabel: 'ActionEval', icon: Zap, color: 'green', side: 'controller', simpleBox: 'controller', description: 'Scores actions and executes the best one via GAS or Behavior Trees.', details: ['Queries current ActionSet; Scorers, Gates, Novelty, Chain', 'Evaluation cadence: ~0.1s between scoring passes', 'Customize: add Scorers/Gates or override CanExecuteAction()'] },
    { id: 'reactioneval', label: 'ReactionEvaluationComponent', friendlyLabel: 'Picks reactions', shortLabel: 'ReactionEval', icon: Shield, color: 'purple', side: 'controller', simpleBox: 'controller', description: 'Event-driven parry, dodge, counter reactions.', details: ['EvaluateBestReaction() → ExecuteReaction() from your events', 'Gates: enabled, cooldown, RequiresTags, BlockTags, BlockReactions'] },
    { id: 'movementeval', label: 'MovementEvaluatorComponent', friendlyLabel: 'Picks movement', shortLabel: 'MovementEval', icon: Move, color: 'cyan', side: 'controller', simpleBox: 'controller', description: 'Tactical positioning — distance, strafe, avoidance.', details: ['Profile from EnemyAIConfig → RoleMovementProfiles', 'Customize: UPositioningRule subclass'] },
    { id: 'actionset', label: 'SECActionSetComponent', friendlyLabel: 'Movelist holder', shortLabel: 'ActionSetComp', icon: Zap, color: 'green', side: 'pawn', simpleBox: 'pawn', description: 'Pawn-side action sets — resolution + replication.', details: ['Resolution: Override → Weapon → Config Role → Default → Component → null', 'Replicates CurrentActionId, bActionExecuting, ActiveActionSet', 'Inject: SetRuntimeOverride(), ISECWeaponActionSetProvider'] },
    { id: 'reactionset', label: 'SECReactionSetComponent', friendlyLabel: 'Reaction list', shortLabel: 'ReactionSetComp', icon: Shield, color: 'purple', side: 'pawn', simpleBox: 'pawn', description: 'Pawn-side reaction sets — mirrors ActionSet pattern.', details: ['Resolution: Override → Weapon → Config Role → Default → Component → null', 'Replicates CurrentReactionId, bReactionExecuting, ActiveReactionSet', 'Swap: Immediate or WaitForCompletion'] },
    { id: 'combatrole', label: 'SECCombatRoleComponent', friendlyLabel: 'Role mirror', shortLabel: 'RoleComp', icon: Radio, color: 'orange', side: 'pawn', simpleBox: 'pawn', description: 'Replicated combat role for client UI/VFX.', details: ['Updated by SECCombatControllerComponent on role changes', 'Bind OnCombatRoleChanged for visual updates'] },
    { id: 'asc', label: 'AbilitySystemComponent', friendlyLabel: 'Runs abilities', shortLabel: 'ASC', icon: Hexagon, color: 'red', side: 'pawn', simpleBox: 'pawn', description: 'GAS — abilities granted from Action/Reaction sets.', details: ['Abilities auto-granted when sets apply', 'Used by ActionEvaluation and ReactionEvaluation'] },
];

const controllerGroups: { title: string; ids: NodeId[] }[] = [
    { title: 'Hub', ids: ['combatcontroller'] },
    { title: 'Combat loop', ids: ['secbrain', 'actioneval', 'movementeval'] },
    { title: 'Events', ids: ['reactioneval'] },
];

const pawnNodes = nodes.filter(n => n.side === 'pawn');
const dataNodes = nodes.filter(n => n.side === 'data');

const connections: ConnectionDef[] = [
    { from: 'aiconfig', to: 'combatcontroller', label: 'Cached on possession' },
    { from: 'aiconfig', to: 'secbrain', label: 'Picks the brain' },
    { from: 'secbrain', to: 'actioneval', label: 'Native loop polls' },
    { from: 'secbrain', to: 'movementeval', label: 'Native loop moves' },
    { from: 'combatcontroller', to: 'actionset', label: 'SyncStateForCombatRole()' },
    { from: 'combatcontroller', to: 'reactionset', label: 'SyncStateForCombatRole()' },
    { from: 'actioneval', to: 'actionset', label: 'Notify Started/Completed' },
    { from: 'reactioneval', to: 'reactionset', label: 'Notify Started/Completed' },
    { from: 'actionset', to: 'asc', label: 'Grant abilities' },
    { from: 'reactionset', to: 'asc', label: 'Grant abilities' },
];

const storySteps: StoryStep[] = [
    { title: 'Load config', description: 'On possess, the controller resolves and caches EnemyAIConfig from the pawn or its defaults.', simpleBoxes: ['config', 'controller'], nodes: ['aiconfig', 'combatcontroller', 'secbrain'], connectionIndices: [0, 1] },
    { title: 'Sync movelists', description: 'On role change, SyncStateForCombatRole() swaps the pawn\'s action and reaction sets.', simpleBoxes: ['controller', 'pawn'], nodes: ['combatcontroller', 'actionset', 'reactionset'], connectionIndices: [4, 5] },
    { title: 'Run combat loop', description: 'Brain moves the enemy and polls for the best action (~0.1s scoring cadence).', simpleBoxes: ['controller'], nodes: ['secbrain', 'actioneval', 'movementeval'], connectionIndices: [2, 3] },
    { title: 'Execute on pawn', description: 'Evaluator notifies the pawn; abilities grant to ASC; clients see replicated state.', simpleBoxes: ['pawn'], nodes: ['actioneval', 'actionset', 'asc'], connectionIndices: [6, 8] },
];

/** Diagram viewport — simple stays compact; full wiring gets room for all nodes */
const DIAGRAM_HEIGHT: Record<ViewMode, string> = {
    simple: 'h-[17.5rem]',
    full: 'h-[38rem]',
};

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

function nodeById(id: NodeId) {
    return nodes.find(n => n.id === id)!;
}

/** Left/right click strips for step navigation; middle is interactive */
const NAV_ZONE_RATIO = 0.3;

function getDiagramZone(clientX: number, rect: DOMRect): 'left' | 'right' | 'middle' {
    const ratio = (clientX - rect.left) / rect.width;
    if (ratio < NAV_ZONE_RATIO) return 'left';
    if (ratio > 1 - NAV_ZONE_RATIO) return 'right';
    return 'middle';
}

function FlowArrow({ color = 'amber' }: { color?: 'amber' | 'blue' | 'green' }) {
    const stroke = color === 'blue' ? 'bg-blue-500/40' : color === 'green' ? 'bg-green-500/40' : 'bg-amber-500/40';
    const tip = color === 'blue' ? 'border-t-blue-500/50' : color === 'green' ? 'border-t-green-500/50' : 'border-t-amber-500/50';
    return (
        <div className="flex shrink-0 flex-col items-center py-0.5">
            <div className={cn('h-3 w-px', stroke)} />
            <div className={cn('h-0 w-0 border-l-[4px] border-r-[4px] border-t-[5px] border-transparent', tip)} />
        </div>
    );
}

export default function SystemArchitectureVisualizer() {
    const [viewMode, setViewMode] = useState<ViewMode>('simple');
    const [storyStep, setStoryStep] = useState(0);
    const [selectedNode, setSelectedNode] = useState<NodeId | null>(null);
    const [showAllConnections, setShowAllConnections] = useState(false);
    const [diagramHover, setDiagramHover] = useState<'left' | 'right' | null>(null);

    const currentStep = storySteps[storyStep];
    const selectedNodeDef = selectedNode ? nodeById(selectedNode) : null;
    const isLastStep = storyStep === storySteps.length - 1;

    const goNext = useCallback(() => {
        setStoryStep(s => Math.min(storySteps.length - 1, s + 1));
        setSelectedNode(null);
    }, []);

    const goPrev = useCallback(() => {
        setStoryStep(s => Math.max(0, s - 1));
        setSelectedNode(null);
    }, []);

    const handleNodeClick = useCallback((id: NodeId, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedNode(prev => prev === id ? null : id);
    }, []);

    const handleDiagramClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const zone = getDiagramZone(e.clientX, e.currentTarget.getBoundingClientRect());
        if (zone === 'left' && storyStep > 0) goPrev();
        else if (zone === 'right' && !isLastStep) goNext();
    }, [storyStep, isLastStep, goPrev, goNext]);

    const handleDiagramMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const zone = getDiagramZone(e.clientX, e.currentTarget.getBoundingClientRect());
        setDiagramHover(zone === 'middle' ? null : zone);
    }, []);

    const handleDiagramMouseLeave = useCallback(() => {
        setDiagramHover(null);
    }, []);

    const canGoPrev = storyStep > 0;
    const canGoNext = !isLastStep;

    const handleViewModeChange = useCallback((mode: ViewMode) => {
        setViewMode(mode);
        setSelectedNode(null);
        setShowAllConnections(false);
        setDiagramHover(null);
    }, []);

    const isNodeHighlighted = (id: NodeId) => {
        if (selectedNode === id) return true;
        if (selectedNode) {
            return connections.some(c =>
                (c.from === selectedNode && c.to === id) || (c.to === selectedNode && c.from === id)
            );
        }
        return currentStep.nodes.includes(id);
    };

    const activeConnections = connections.filter((_, i) =>
        selectedNode
            ? connections[i].from === selectedNode || connections[i].to === selectedNode
            : currentStep.connectionIndices.includes(i)
    );

    const connectionSlots = Array.from({ length: MAX_CONNECTION_SLOTS }, (_, i) => activeConnections[i] ?? null);

    const renderNode = (node: NodeDef) => {
        const colors = palette[node.color] || palette.blue;
        const highlighted = isNodeHighlighted(node.id);
        const isSelected = selectedNode === node.id;
        const rowHeight = viewMode === 'full' ? 'h-[42px]' : 'h-[38px]';

        return (
            <button
                key={node.id}
                type="button"
                onClick={(e) => handleNodeClick(node.id, e)}
                className={cn(
                    'ue-component-row flex w-full items-center gap-2 rounded-[2px] border px-2.5 text-left',
                    rowHeight,
                    'cursor-pointer transition-colors duration-200 hover:bg-[#242424]',
                    highlighted ? `${colors.bg} ${colors.border} ${colors.glow}` : 'border-[#383838]/60 bg-[#1A1A1A]/50 opacity-55',
                    isSelected && 'ring-1 ring-[#0070E0]'
                )}
            >
                {node.side === 'data' ? (
                    <UeDataAssetThumbnailIcon className="h-4 w-4 shrink-0" />
                ) : (
                    <UeActorComponentIcon className="h-4 w-4 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                    <div className={cn('truncate text-sm font-medium leading-none', highlighted ? colors.text : 'text-[#C0C0C0]')}>
                        {node.friendlyLabel}
                    </div>
                    <div className={cn(
                        'truncate font-mono text-[11px] leading-none',
                        highlighted || isSelected ? 'mt-1 text-[#707070]' : 'mt-1 text-transparent'
                    )}>
                        {node.label}
                    </div>
                </div>
            </button>
        );
    };

    const renderSimpleBox = (boxId: SimpleBoxId) => {
        const box = simpleBoxPalette[boxId];
        const colors = palette[box.color];
        const Icon = box.icon;
        const highlighted = currentStep.simpleBoxes.includes(boxId);

        return (
            <div
                key={boxId}
                className={cn(
                    'flex h-[68px] w-full max-w-sm items-center gap-3 rounded-lg border-2 px-4 transition-colors duration-200',
                    highlighted ? `${colors.bg} ${colors.border} ${colors.glow}` : 'border-[#383838]/60 bg-[#1A1A1A]/40 opacity-50'
                )}
            >
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-md border', colors.border, colors.bg)}>
                    <Icon className={cn('h-4 w-4', colors.text)} />
                </div>
                <div className="min-w-0 text-left">
                    <div className={cn('text-sm font-semibold leading-tight', highlighted ? colors.text : 'text-[#C0C0C0]')}>
                        {box.title}
                    </div>
                    <div className="mt-0.5 text-xs leading-snug text-[#888888]">{box.subtitle}</div>
                </div>
            </div>
        );
    };

    const renderStepPanel = () => (
        <>
            <div className="mb-2 flex items-center gap-2">
                <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-[#0078d4]">
                    Step {storyStep + 1}/{storySteps.length}
                </span>
                <span className="text-sm font-semibold text-[#C0C0C0]">{currentStep.title}</span>
            </div>
            <p className="mb-2 h-[2.75rem] text-sm leading-snug text-[#AAAAAA]">{currentStep.description}</p>
            <div className="mb-2 h-[2.5rem] space-y-0.5">
                {connectionSlots.map((c, i) => (
                    <div key={i} className="flex h-5 items-center gap-1.5 text-xs text-[#888888]">
                        {c ? (
                            <>
                                <ArrowRight className="h-3 w-3 shrink-0 text-[#0078d4]" />
                                <span className="truncate">{nodeById(c.from).friendlyLabel} → {nodeById(c.to).friendlyLabel}</span>
                                <span className="truncate text-[#666666]">· {c.label}</span>
                            </>
                        ) : null}
                    </div>
                ))}
            </div>
            <div className="flex gap-1">
                {storySteps.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => { setStoryStep(i); setSelectedNode(null); }}
                        className={cn(
                            'h-1.5 flex-1 rounded-full transition-colors',
                            i === storyStep ? 'bg-[#0078d4]' : i < storyStep ? 'bg-[#0078d4]/40' : 'bg-[#383838] hover:bg-[#484848]'
                        )}
                        aria-label={`Go to step ${i + 1}`}
                    />
                ))}
            </div>
        </>
    );

    const renderNodeDetail = () => {
        if (!selectedNodeDef) return null;
        const colors = palette[selectedNodeDef.color] || palette.blue;
        const Icon = selectedNodeDef.icon;

        return (
            <>
                <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                        <div
                            className={cn('flex h-7 w-7 shrink-0 items-center justify-center', colors.text)}
                            style={{ clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)', background: colors.hexFill }}
                        >
                            <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                            <div className={cn('text-sm font-bold', colors.text)}>{selectedNodeDef.friendlyLabel}</div>
                            <div className="truncate font-mono text-[11px] text-[#707070]">{selectedNodeDef.label}</div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSelectedNode(null)}
                        className="shrink-0 rounded-[2px] border border-[#383838] p-1 hover:bg-[#242424]"
                        aria-label="Back to steps"
                    >
                        <X className="h-3.5 w-3.5 text-[#AAAAAA]" />
                    </button>
                </div>
                <div className="h-[calc(100%-2.5rem)] overflow-y-auto pr-1">
                    <p className="mb-2 text-sm text-[#AAAAAA]">{selectedNodeDef.description}</p>
                    <ul className="space-y-1 text-sm text-[#BBBBBB]">
                        {selectedNodeDef.details.map((detail, i) => (
                            <li key={i} className="flex gap-1.5">
                                <span className={cn('shrink-0', colors.text)}>▸</span>
                                <span>{detail}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </>
        );
    };

    return (
        <UePanel
            title="System Architecture"
            breadcrumb={['Content', 'Plugins', 'SoulslikeEnemyCombat']}
            assetType="component"
            bodyClassName="flex flex-col p-3 text-sm"
            caption={
                <span className="text-sm leading-snug text-[#AAAAAA]">
                    Config → controller (decides) → pawn (replicates). Click the outer edges of the diagram to step back or forward; the center is free for component clicks.{' '}
                    <a href="/docs/soulslike-combat/architecture" className="text-[#00A2FF] hover:underline">Core Architecture</a>
                </span>
            }
        >
            {/* Toolbar — fixed height */}
            <div className="mb-2 h-9 shrink-0">
                <div className={cn(ueDetailsPanel(), 'inline-flex rounded-[2px] p-0.5')}>
                    {(['simple', 'full'] as const).map(mode => (
                        <button
                            key={mode}
                            type="button"
                            onClick={() => handleViewModeChange(mode)}
                            className={cn(
                                'inline-flex items-center gap-1.5 rounded-[2px] px-2.5 py-1 text-sm font-medium transition-colors',
                                viewMode === mode ? 'bg-[#0078d4] text-white' : 'text-[#888888] hover:text-[#C0C0C0]'
                            )}
                        >
                            {mode === 'simple' ? <Layers className="h-3.5 w-3.5" /> : <ListTree className="h-3.5 w-3.5" />}
                            {mode === 'simple' ? 'Simple' : 'Full wiring'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Step panel — fixed height block */}
            <div className={cn(ueDetailsPanel(), 'mb-2 h-[8.75rem] shrink-0 overflow-hidden p-3')}>
                {selectedNodeDef && viewMode === 'full' ? renderNodeDetail() : renderStepPanel()}
            </div>

            {/* Diagram — height depends on view mode */}
            <div
                className={cn(
                    ueDetailsPanel(),
                    'relative mb-2 shrink-0 overflow-hidden p-3',
                    DIAGRAM_HEIGHT[viewMode]
                )}
                onMouseMove={handleDiagramMouseMove}
                onMouseLeave={handleDiagramMouseLeave}
                onClick={handleDiagramClick}
                onKeyDown={(e) => {
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        if (canGoPrev) goPrev();
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        if (canGoNext) goNext();
                    }
                }}
            >
                {/* Edge glow — narrow strip; click zones are wider (30%) */}
                <div
                    aria-hidden
                    className={cn(
                        'pointer-events-none absolute inset-y-0 left-0 z-20 w-8 transition-opacity duration-200',
                        diagramHover === 'left' && canGoPrev ? 'opacity-100' : 'opacity-0'
                    )}
                    style={{
                        background: 'linear-gradient(to right, rgba(239, 68, 68, 0.2), transparent)',
                        boxShadow: 'inset 2px 0 10px rgba(239, 68, 68, 0.35)',
                    }}
                />
                <div
                    aria-hidden
                    className={cn(
                        'pointer-events-none absolute inset-y-0 right-0 z-20 w-8 transition-opacity duration-200',
                        diagramHover === 'right' && canGoNext ? 'opacity-100' : 'opacity-0'
                    )}
                    style={{
                        background: 'linear-gradient(to left, rgba(0, 120, 212, 0.2), transparent)',
                        boxShadow: 'inset -2px 0 10px rgba(0, 120, 212, 0.35)',
                    }}
                />

                <div className={cn('relative z-0 h-full', viewMode === 'full' && 'overflow-y-auto')}>
                {viewMode === 'simple' ? (
                    <div className="flex h-full flex-col items-center justify-center">
                        {renderSimpleBox('config')}
                        <FlowArrow color="amber" />
                        {renderSimpleBox('controller')}
                        <FlowArrow color="blue" />
                        {renderSimpleBox('pawn')}
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <div className="mx-auto w-full max-w-md shrink-0">{dataNodes.map(renderNode)}</div>
                        <div className="flex justify-center">
                            <FlowArrow color="amber" />
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-start">
                            <div className="rounded-md border border-dashed border-blue-500/20 p-3">
                                <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#888888]">
                                    <Server className="h-3.5 w-3.5" /> Controller
                                </div>
                                {controllerGroups.map(group => (
                                    <div key={group.title} className="mb-3 last:mb-0">
                                        <div className="mb-1.5 text-[11px] font-semibold uppercase text-[#666666]">{group.title}</div>
                                        <div className="space-y-1.5">{group.ids.map(id => renderNode(nodeById(id)))}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="rounded-md border border-dashed border-green-500/20 p-3">
                                <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#888888]">
                                    <Monitor className="h-3.5 w-3.5" /> Pawn
                                </div>
                                <div className="space-y-1.5">{pawnNodes.map(renderNode)}</div>
                            </div>
                        </div>
                        <div className="shrink-0 pt-1">
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setShowAllConnections(v => !v); }}
                                className="flex w-full items-center justify-between rounded-[2px] border border-[#383838]/60 px-2 py-1 text-xs text-[#888888] hover:bg-[#242424]"
                            >
                                <span>All connections ({connections.length})</span>
                                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', showAllConnections && 'rotate-180')} />
                            </button>
                            {showAllConnections && (
                                <div className="mt-1 grid grid-cols-1 gap-0.5 sm:grid-cols-2">
                                    {connections.map((c, i) => {
                                        const relevant = selectedNode
                                            ? c.from === selectedNode || c.to === selectedNode
                                            : currentStep.connectionIndices.includes(i);
                                        return (
                                            <div key={i} className={cn('flex items-center gap-1 px-1.5 py-0.5 text-xs', relevant ? 'text-[#BBBBBB]' : 'text-[#555555]')}>
                                                <ArrowRight className="h-3 w-3 shrink-0" />
                                                <span className="truncate">{nodeById(c.from).friendlyLabel} → {nodeById(c.to).friendlyLabel}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                </div>
            </div>

            {/* Bottom nav — fixed height, never moves */}
            <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-t border-[#383838]/40 pt-2">
                <button
                    type="button"
                    onClick={goPrev}
                    disabled={storyStep === 0}
                    className={cn(
                        'inline-flex w-[5.5rem] items-center justify-center gap-1 rounded-[2px] border px-3 py-1.5 text-sm transition-colors',
                        storyStep === 0
                            ? 'cursor-not-allowed border-[#383838] opacity-30'
                            : 'border-[rgba(130,100,100,0.45)] bg-[rgba(110,85,85,0.14)] text-[#a89494] hover:bg-[rgba(130,100,100,0.22)] hover:text-[#bfb0b0]'
                    )}
                >
                    <ChevronLeft className="h-4 w-4" /> Prev
                </button>
                <span className="min-w-0 flex-1 truncate text-center text-xs text-[#666666]">
                    Step {storyStep + 1} of {storySteps.length} · {currentStep.title}
                </span>
                <button
                    type="button"
                    onClick={goNext}
                    disabled={isLastStep}
                    className={cn(
                        'inline-flex w-[5.5rem] items-center justify-center gap-1 rounded-[2px] border px-3 py-1.5 text-sm transition-colors',
                        isLastStep
                            ? 'cursor-not-allowed border-[#383838] opacity-30'
                            : 'border-[rgba(95,115,135,0.45)] bg-[rgba(80,95,115,0.14)] text-[#94a0ad] hover:bg-[rgba(95,115,135,0.22)] hover:text-[#b0bac4]'
                    )}
                >
                    Next <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </UePanel>
    );
}

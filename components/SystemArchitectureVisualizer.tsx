"use client"

import { useEffect, useState, useCallback } from 'react';
import {
    Brain, Zap, Shield, Move, Settings, Radio,
    Hexagon, Server, Monitor, ChevronRight, ArrowRight, Network
} from 'lucide-react';
import { UePanel, ueDetailsPanel, UeActorComponentIcon, UeDataAssetThumbnailIcon } from '@/components/ue-editor';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type NodeId =
    | 'aiconfig'
    | 'combatcontroller'
    | 'secbrain'
    | 'actioneval'
    | 'reactioneval'
    | 'movementeval'
    | 'actionset'
    | 'reactionset'
    | 'combatrole'
    | 'asc';

type Side = 'controller' | 'pawn' | 'data';

interface NodeDef {
    id: NodeId;
    label: string;
    shortLabel: string;
    icon: typeof Brain;
    color: string;
    side: Side;
    description: string;
    details: string[];
}

interface ConnectionDef {
    from: NodeId;
    to: NodeId;
    label: string;
    description: string;
}

// ---------------------------------------------------------------------------
// Colour palette (matches existing visualizers)
// ---------------------------------------------------------------------------

const palette: Record<string, {
    bg: string; border: string; text: string; glow: string;
    hexFill: string; hexStroke: string;
}> = {
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/50', text: 'text-blue-400', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.25)]', hexFill: 'rgba(59,130,246,0.12)', hexStroke: 'rgba(59,130,246,0.6)' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/50', text: 'text-green-400', glow: 'shadow-[0_0_20px_rgba(34,197,94,0.25)]', hexFill: 'rgba(34,197,94,0.12)', hexStroke: 'rgba(34,197,94,0.6)' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/50', text: 'text-orange-400', glow: 'shadow-[0_0_20px_rgba(249,115,22,0.25)]', hexFill: 'rgba(249,115,22,0.12)', hexStroke: 'rgba(249,115,22,0.6)' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/50', text: 'text-purple-400', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.25)]', hexFill: 'rgba(168,85,247,0.12)', hexStroke: 'rgba(168,85,247,0.6)' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/50', text: 'text-cyan-400', glow: 'shadow-[0_0_20px_rgba(6,182,212,0.25)]', hexFill: 'rgba(6,182,212,0.12)', hexStroke: 'rgba(6,182,212,0.6)' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/50', text: 'text-amber-400', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]', hexFill: 'rgba(245,158,11,0.12)', hexStroke: 'rgba(245,158,11,0.6)' },
    red: { bg: 'bg-red-500/10', border: 'border-red-500/50', text: 'text-red-400', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.25)]', hexFill: 'rgba(239,68,68,0.12)', hexStroke: 'rgba(239,68,68,0.6)' },
    slate: { bg: 'bg-slate-500/10', border: 'border-slate-500/50', text: 'text-slate-400', glow: 'shadow-[0_0_20px_rgba(100,116,139,0.15)]', hexFill: 'rgba(100,116,139,0.12)', hexStroke: 'rgba(100,116,139,0.5)' },
    indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/50', text: 'text-indigo-400', glow: 'shadow-[0_0_20px_rgba(99,102,241,0.25)]', hexFill: 'rgba(99,102,241,0.12)', hexStroke: 'rgba(99,102,241,0.6)' },
};

// ---------------------------------------------------------------------------
// Node definitions
// ---------------------------------------------------------------------------

const nodes: NodeDef[] = [
    {
        id: 'aiconfig', label: 'EnemyAIConfig', shortLabel: 'AIConfig',
        icon: Settings, color: 'amber', side: 'data',
        description: 'Data asset that defines everything about an enemy\'s behavior.',
        details: [
            'Resolution: Pawn IEnemyAIConfigProvider → Controller DefaultAIConfig',
            'Contains: DefaultActionSet, RoleActionSets, DefaultReactionSet, RoleReactionSets',
            'Contains: DefaultMovementProfile, RoleMovementProfiles, DefaultStateTree',
            'Customize: Create a new Data Asset → EnemyAIConfig, assign to pawn or controller',
        ],
    },
    {
        id: 'combatcontroller', label: 'SECCombatControllerComponent', shortLabel: 'CombatController',
        icon: Network, color: 'blue', side: 'controller',
        description: 'Orchestrator. Caches AIConfig, syncs everything on role changes.',
        details: [
            'Lives on: AI Controller (auto-created by EnemyControllerBase)',
            'On possession: resolves AIConfig, registers with role subsystem',
            'On role change: calls SyncStateForCombatRole() → syncs actions, reactions, movement',
            'Customize: Override SyncStateForCombatRole in Blueprint for extra sync logic',
        ],
    },
    {
        id: 'secbrain', label: 'SECBrainComponent', shortLabel: 'SECBrain',
        icon: Brain, color: 'indigo', side: 'controller',
        description: 'The brain. Runs the config\'s StateTree, or a native C++ combat loop when none is set.',
        details: [
            'Lives on: AI Controller (auto-created by EnemyControllerBase)',
            'On possession: reads AIConfig. DefaultStateTree set → creates and runs a StateTree at runtime; empty → runs the native loop',
            'Native loop: build decision context → move → poll and execute the best action, each tick',
            'Swaps safely if the config changes: tears down the old brain before starting the new one',
            'Customize: leave DefaultStateTree empty to skip StateTree entirely, or assign one to author graph behavior',
        ],
    },
    {
        id: 'actioneval', label: 'ActionEvaluationComponent', shortLabel: 'ActionEval',
        icon: Zap, color: 'green', side: 'controller',
        description: 'Scores actions and executes the best one via GAS or Behavior Trees.',
        details: [
            'Lives on: AI Controller',
            'Queries: current ActionSet for available actions',
            'Scoring: SelectionWeight × opt-in Scorers (Distance, Angle, …) × Novelty × Chain, gated by Gates',
            'Customize: add Scorers and Gates, or override CanExecuteAction() in Blueprint',
        ],
    },
    {
        id: 'reactioneval', label: 'ReactionEvaluationComponent', shortLabel: 'ReactionEval',
        icon: Shield, color: 'purple', side: 'controller',
        description: 'Evaluates and executes event-driven reactions (parry, dodge, counter).',
        details: [
            'Lives on: AI Controller',
            'Your code calls: EvaluateBestReaction() → ExecuteReaction()',
            'Gates: enabled, cooldown, RequiresTags, BlockTags, BlockReactions tag',
            'Customize: Trigger from OnDamageReceived, OnProjectileDetected, etc.',
        ],
    },
    {
        id: 'movementeval', label: 'MovementEvaluatorComponent', shortLabel: 'MovementEval',
        icon: Move, color: 'cyan', side: 'controller',
        description: 'Evaluates movement directions for tactical positioning.',
        details: [
            'Lives on: AI Controller',
            'Evaluates: distance, strafing, avoidance, hybrid pathfinding',
            'Profile comes from: EnemyAIConfig → RoleMovementProfiles',
            'Customize: Create UPositioningRule subclass for custom direction scoring',
        ],
    },
    {
        id: 'actionset', label: 'SECActionSetComponent', shortLabel: 'ActionSetComp',
        icon: Zap, color: 'green', side: 'pawn',
        description: 'Pawn-side provider for action sets. Handles resolution chain and replication.',
        details: [
            'Resolution: RuntimeOverride → Weapon → Config Role → Config Default → Component Default → null',
            'Replicates: CurrentActionId, bActionExecuting, ActiveActionSet to clients',
            'Inject: SetRuntimeOverride() for boss phases, SetEquippedWeapon() for weapon-driven AI',
            'Inject: Implement ISECWeaponActionSetProvider on weapon actor',
        ],
    },
    {
        id: 'reactionset', label: 'SECReactionSetComponent', shortLabel: 'ReactionSetComp',
        icon: Shield, color: 'purple', side: 'pawn',
        description: 'Pawn-side provider for reaction sets. Mirrors ActionSetComponent pattern.',
        details: [
            'Resolution: RuntimeOverride → Weapon → Config Role → Config Default → Component Default → null',
            'Replicates: CurrentReactionId, bReactionExecuting, ActiveReactionSet to clients',
            'Inject: SetRuntimeOverride() for boss phases',
            'Inject: Implement ISECWeaponReactionSetProvider on weapon actor',
            'Swap modes: Immediate (cancel mid-reaction) or WaitForCompletion (queue swap)',
        ],
    },
    {
        id: 'combatrole', label: 'SECCombatRoleComponent', shortLabel: 'RoleComp',
        icon: Radio, color: 'orange', side: 'pawn',
        description: 'Replicates the AI\'s assigned combat role to clients for UI/VFX.',
        details: [
            'Lives on: Pawn (replicated)',
            'Updated by: SECCombatControllerComponent on role changes',
            'Read by: Client widgets, UMG health bars, role indicators',
            'Customize: Bind to OnCombatRoleChanged delegate for visual updates',
        ],
    },
    {
        id: 'asc', label: 'AbilitySystemComponent', shortLabel: 'ASC',
        icon: Hexagon, color: 'red', side: 'pawn',
        description: 'Unreal GAS component. Executes abilities granted by Action/Reaction sets.',
        details: [
            'Lives on: Pawn (via IAbilitySystemInterface)',
            'Abilities auto-granted from active ActionSet and ReactionSet',
            'Used by: ActionEvaluationComponent and ReactionEvaluationComponent',
            'Customize: Standard GAS workflow - create UGameplayAbilityBase subclasses',
        ],
    },
];

// ---------------------------------------------------------------------------
// Connection definitions (data flow lines)
// ---------------------------------------------------------------------------

const connections: ConnectionDef[] = [
    { from: 'aiconfig', to: 'combatcontroller', label: 'Cached on possession', description: 'Controller reads and caches AIConfig from pawn or its own defaults' },
    { from: 'aiconfig', to: 'secbrain', label: 'Picks the brain', description: 'On possession SECBrain reads DefaultStateTree: set runs a StateTree, empty runs the native combat loop' },
    { from: 'secbrain', to: 'actioneval', label: 'Native loop polls', description: 'In native mode SECBrain drives action scoring and execution each tick' },
    { from: 'secbrain', to: 'movementeval', label: 'Native loop moves', description: 'In native mode SECBrain runs movement evaluation each tick' },
    { from: 'combatcontroller', to: 'actionset', label: 'SyncForCombatRole()', description: 'On role change, tells ActionSetComponent to resolve and apply the correct ActionSet' },
    { from: 'combatcontroller', to: 'reactionset', label: 'SyncForCombatRole()', description: 'On role change, tells ReactionSetComponent to resolve and apply the correct ReactionSet' },
    { from: 'actioneval', to: 'actionset', label: 'Notify Started/Completed', description: 'Pushes action execution state to the pawn for client replication' },
    { from: 'reactioneval', to: 'reactionset', label: 'Notify Started/Completed', description: 'Pushes reaction execution state to the pawn for client replication' },
    { from: 'actionset', to: 'asc', label: 'Grant abilities', description: 'ActionSet abilities are auto-granted to the ASC when applied' },
    { from: 'reactionset', to: 'asc', label: 'Grant abilities', description: 'ReactionSet abilities are auto-granted to the ASC when applied' },
];

// ---------------------------------------------------------------------------
// Layout helpers
// ---------------------------------------------------------------------------

const controllerNodes = nodes.filter(n => n.side === 'controller');
const pawnNodes = nodes.filter(n => n.side === 'pawn');
const dataNodes = nodes.filter(n => n.side === 'data');

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SystemArchitectureVisualizer() {
    const [selectedNode, setSelectedNode] = useState<NodeId | null>(null);
    const [activeConnection, setActiveConnection] = useState(0);

    // Auto-cycle active connection
    useEffect(() => {
        let mounted = true;
        const loop = async () => {
            while (mounted) {
                for (let i = 0; i < connections.length; i++) {
                    if (!mounted) break;
                    setActiveConnection(i);
                    await new Promise(r => setTimeout(r, 2500));
                }
            }
        };
        loop();
        return () => { mounted = false; };
    }, []);

    const handleNodeClick = useCallback((id: NodeId) => {
        setSelectedNode(prev => prev === id ? null : id);
    }, []);

    const isNodeHighlighted = (id: NodeId) => {
        if (selectedNode === id) return true;
        const conn = connections[activeConnection];
        if (!selectedNode && (conn.from === id || conn.to === id)) return true;
        if (selectedNode) {
            return connections.some(c =>
                (c.from === selectedNode && c.to === id) ||
                (c.to === selectedNode && c.from === id)
            );
        }
        return false;
    };

    const selectedNodeDef = selectedNode ? nodes.find(n => n.id === selectedNode) : null;

    // ---------------------------------------------------------------------------
    // Render helpers
    // ---------------------------------------------------------------------------

    const renderNode = (node: NodeDef) => {
        const colors = palette[node.color] || palette.blue;
        const highlighted = isNodeHighlighted(node.id);
        const isSelected = selectedNode === node.id;

        return (
            <button
                key={node.id}
                onClick={() => handleNodeClick(node.id)}
                className={cn(
                    "ue-component-row group relative flex items-center gap-2 rounded-[2px] border px-2 py-1.5 transition-all duration-500 text-left w-full",
                    "hover:bg-[#242424] cursor-pointer",
                    highlighted
                        ? `${colors.bg} ${colors.border} ${colors.glow} scale-[1.01]`
                        : "border-[#383838]/60 bg-[#1A1A1A]/50 opacity-70 scale-100",
                    isSelected && "ue-component-row-selected ring-1 ring-[#0070E0]"
                )}
                data-selected={isSelected}
            >
                {node.side === 'data' ? (
                    <UeDataAssetThumbnailIcon className="h-4 w-4 shrink-0" />
                ) : (
                    <UeActorComponentIcon className="h-4 w-4 shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                    <div className={cn(
                        "truncate text-[11px] transition-colors duration-500",
                        highlighted ? colors.text : "text-[#C0C0C0]"
                    )}>
                        {node.shortLabel}
                        <span className="text-[#808080]"> ({node.label.replace(/\s+/g, '')})</span>
                    </div>
                    <div className={cn(
                        "truncate text-[9px] leading-tight transition-colors duration-500",
                        highlighted ? "text-[#808080]" : "text-[#575757]"
                    )}>
                        {node.description.split('.')[0]}
                    </div>
                </div>

                {isSelected && (
                    <ChevronRight className={cn("h-3 w-3 flex-shrink-0 transition-colors", colors.text)} />
                )}
            </button>
        );
    };

    const renderColumn = (title: string, icon: typeof Server, columnNodes: NodeDef[], borderColor: string) => (
        <div className={cn(
            "flex flex-col gap-2 rounded-lg border-2 border-dashed p-3 min-w-0",
            borderColor
        )}>
            <div className="flex items-center gap-2 mb-1 px-1">
                {icon === Server
                    ? <Server className="h-3.5 w-3.5 text-muted-foreground" />
                    : <Monitor className="h-3.5 w-3.5 text-muted-foreground" />
                }
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {title}
                </span>
            </div>
            {columnNodes.map(renderNode)}
        </div>
    );

    // Active connection flow indicator
    const conn = connections[activeConnection];
    const flowLabel = selectedNode ? null : conn;

    return (
        <UePanel
            title="System Architecture"
            breadcrumb={["Content", "Plugins", "SoulslikeEnemyCombat"]}
            assetType="component"
            bodyClassName="p-3"
            caption={
                <>
                    <span className="text-[#00A2FF]">Controller-side</span> components handle decisions.{' '}
                    <span className="text-[#6CC644]">Pawn-side</span> components handle resolution chains and replication.{' '}
                    The <span className="text-[#FFB800]">AIConfig</span> data asset drives everything.
                </>
            }
        >
            {/* Data Asset Row */}
            <div className="mx-auto max-w-[200px] mb-3">
                {dataNodes.map(renderNode)}
            </div>

            {/* Arrow down from AIConfig */}
            <div className="flex justify-center mb-3">
                <div className="flex flex-col items-center">
                    <div className="h-4 w-px bg-amber-500/40" />
                    <div className="h-0 w-0 border-l-[4px] border-r-[4px] border-t-[5px] border-transparent border-t-amber-500/50" />
                </div>
            </div>

            {/* Flow indicator */}
            {flowLabel && (
                <div className={cn(ueDetailsPanel(), "mx-auto mb-3 flex max-w-fit items-center justify-center gap-2 px-3 py-1.5")}>
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0078d4]" />
                    <span className="font-mono text-[11px] text-[#888888]">
                        {flowLabel.label}
                    </span>
                    <span className="text-[10px] text-[#666666]">
                        ({nodes.find(n => n.id === flowLabel.from)?.shortLabel} → {nodes.find(n => n.id === flowLabel.to)?.shortLabel})
                    </span>
                </div>
            )}

            {/* Two-column layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {renderColumn("Controller (Server)", Server, controllerNodes, "border-blue-500/20")}
                {renderColumn("Pawn (Replicated)", Monitor, pawnNodes, "border-green-500/20")}
            </div>

            {/* Cross-connection legend */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 px-1">
                {connections.map((c, i) => {
                    const isActive = !selectedNode && i === activeConnection;
                    const isRelevant = selectedNode && (c.from === selectedNode || c.to === selectedNode);

                    return (
                        <div
                            key={i}
                            className={cn(
                                "flex items-center gap-1.5 rounded px-2 py-0.5 transition-all duration-300 text-[10px]",
                                (isActive || isRelevant) ? "bg-primary/5 text-foreground/80" : "text-muted-foreground/40"
                            )}
                        >
                            <ArrowRight className={cn(
                                "h-2.5 w-2.5 flex-shrink-0 transition-colors",
                                (isActive || isRelevant) ? "text-primary" : "text-muted-foreground/30"
                            )} />
                            <span className="font-mono truncate">
                                {nodes.find(n => n.id === c.from)?.shortLabel}
                            </span>
                            <span className="text-muted-foreground/30">→</span>
                            <span className="font-mono truncate">
                                {nodes.find(n => n.id === c.to)?.shortLabel}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Detail panel (slides in when a node is selected) */}
            <div className={cn(
                "overflow-hidden transition-all duration-500 ease-in-out",
                selectedNodeDef ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
            )}>
                {selectedNodeDef && (() => {
                    const colors = palette[selectedNodeDef.color] || palette.blue;
                    const Icon = selectedNodeDef.icon;

                    // Build resolution chain for action/reaction set
                    const isActionSetNode = selectedNodeDef.id === 'actionset';
                    const isReactionSetNode = selectedNodeDef.id === 'reactionset';
                    const showResolutionChain = isActionSetNode || isReactionSetNode;
                    const chainName = isActionSetNode ? 'Action Set' : 'Reaction Set';
                    const chainSteps = [
                        { label: 'Runtime Override', desc: `SetRuntimeOverride(${isActionSetNode ? 'ActionSet' : 'ReactionSet'})`, color: 'text-red-400' },
                        { label: 'Equipped Weapon', desc: `ISEC${isActionSetNode ? 'Weapon' : 'WeaponReaction'}SetProvider`, color: 'text-orange-400' },
                        { label: 'Config Role-Specific', desc: `EnemyAIConfig → Role${isActionSetNode ? 'Action' : 'Reaction'}Sets[Role]`, color: 'text-blue-400' },
                        { label: 'Config Default', desc: `EnemyAIConfig → Default${isActionSetNode ? 'Action' : 'Reaction'}Set`, color: 'text-cyan-400' },
                        { label: 'Component Default', desc: `${selectedNodeDef.shortLabel} → Default${isActionSetNode ? 'Action' : 'Reaction'}Set property`, color: 'text-green-400' },
                        { label: 'None', desc: isActionSetNode ? 'Movement only (no attacks)' : 'No reactions', color: 'text-slate-400' },
                    ];

                    // Config resolution for AIConfig node
                    const isConfigNode = selectedNodeDef.id === 'aiconfig';
                    const configSteps = [
                        { label: 'Pawn', desc: 'Pawn implements IEnemyAIConfigProvider → GetAIConfig()', color: 'text-amber-400' },
                        { label: 'Controller Default', desc: 'SECCombatControllerComponent → DefaultAIConfig property', color: 'text-blue-400' },
                    ];

                    return (
                        <div className={cn(
                            "rounded-lg border-2 p-4",
                            colors.bg, colors.border
                        )}>
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className={cn("flex h-8 w-8 items-center justify-center", colors.text)}
                                    style={{
                                        clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
                                        background: colors.hexFill,
                                    }}
                                >
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className={cn("text-sm font-bold", colors.text)}>{selectedNodeDef.label}</div>
                                    <div className="text-xs text-foreground/60">{selectedNodeDef.description}</div>
                                </div>
                            </div>

                            {/* Details */}
                            <ul className="space-y-1.5 mb-3">
                                {selectedNodeDef.details.map((detail, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-foreground/70">
                                        <span className={cn("mt-0.5 text-[10px]", colors.text)}>▸</span>
                                        <span>{detail}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Resolution chain */}
                            {showResolutionChain && (
                                <div className="mt-3 pt-3 border-t border-border/30">
                                    <div className="text-xs font-semibold text-foreground/80 mb-2">
                                        {chainName} Resolution Priority (first match wins):
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        {chainSteps.map((step, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <span className={cn(
                                                    "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                                                    "bg-foreground/5 border border-foreground/10 text-foreground/50"
                                                )}>
                                                    {i + 1}
                                                </span>
                                                <span className={cn("text-xs font-semibold", step.color)}>{step.label}</span>
                                                <span className="text-[10px] text-foreground/40">- {step.desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Config resolution */}
                            {isConfigNode && (
                                <div className="mt-3 pt-3 border-t border-border/30">
                                    <div className="text-xs font-semibold text-foreground/80 mb-2">
                                        Config Resolution (first found wins):
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        {configSteps.map((step, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <span className={cn(
                                                    "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                                                    "bg-foreground/5 border border-foreground/10 text-foreground/50"
                                                )}>
                                                    {i + 1}
                                                </span>
                                                <span className={cn("text-xs font-semibold", step.color)}>{step.label}</span>
                                                <span className="text-[10px] text-foreground/40">- {step.desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Connected components */}
                            <div className="mt-3 pt-3 border-t border-border/30">
                                <div className="text-xs font-semibold text-foreground/80 mb-1.5">Connected to:</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {connections
                                        .filter(c => c.from === selectedNodeDef.id || c.to === selectedNodeDef.id)
                                        .map((c, i) => {
                                            const otherId = c.from === selectedNodeDef.id ? c.to : c.from;
                                            const other = nodes.find(n => n.id === otherId)!;
                                            const otherColors = palette[other.color] || palette.blue;
                                            const direction = c.from === selectedNodeDef.id ? '→' : '←';

                                            return (
                                                <button
                                                    key={i}
                                                    onClick={(e) => { e.stopPropagation(); handleNodeClick(otherId); }}
                                                    className={cn(
                                                        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-mono border transition-colors",
                                                        "hover:scale-105 cursor-pointer",
                                                        otherColors.bg, otherColors.border, otherColors.text
                                                    )}
                                                >
                                                    <span className="text-foreground/30">{direction}</span>
                                                    {other.shortLabel}
                                                    <span className="text-foreground/30 font-normal">({c.label})</span>
                                                </button>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </div>
        </UePanel>
    );
}

import Image from "next/image";
import * as runtime from "react/jsx-runtime";
import { Callout } from "./callout";
import { Collapsible } from "./collapsible";
import { Protip } from '@/components/Protip';
import ZoomableImage from "@/components/ZoomableImage";
import GameStatusBadge from './GameStatusBadge';
import VideoLoop from "./VideoLoop";
import { Breadcrumb } from "./breadcrumb";
import { DocNav } from "./doc-nav";
import MovementVisualizer from '@/components/MovementVisualizer';
import ActionFlowVisualizer from '@/components/ActionFlowVisualizer';
import ReactionFlowVisualizer from '@/components/ReactionFlowVisualizer';
import CombatRoleVisualizer from '@/components/CombatRoleVisualizer';
import ThreatVisualizer from '@/components/ThreatVisualizer';
import AwarenessVisualizer from '@/components/AwarenessVisualizer';
import MeleeTraceVisualizer from '@/components/MeleeTraceVisualizer';
import PerformanceVisualizer from '@/components/PerformanceVisualizer';
import TargetingVisualizer from '@/components/TargetingVisualizer';
import BlueprintUE from '@/components/BlueprintUE';
import ArchitectureDiagram from '@/components/ArchitectureDiagram';
import SystemArchitectureVisualizer from '@/components/SystemArchitectureVisualizer';
import PurchaseFlowVisualizer from '@/components/PurchaseFlowVisualizer';
import ScorerStackVisualizer from '@/components/ScorerStackVisualizer';
import StateTreeDiagram from '@/components/StateTreeDiagram';
import ArchitectureFlowDiagram from '@/components/ArchitectureFlowDiagram';
import MovementEvaluatorDetails from '@/components/MovementEvaluatorDetails';
import MovementProfileDetails from '@/components/MovementProfileDetails';
import DistanceBandVisualizer from '@/components/DistanceBandVisualizer';
import ActionCooldownDetails from '@/components/ActionCooldownDetails';
import ExecutionMethodExplorer from '@/components/ExecutionMethodExplorer';
import RangeEvalDetails from '@/components/RangeEvalDetails';
import ReactionSpecDetails from '@/components/ReactionSpecDetails';
import ReactionPreconditionDetails from '@/components/ReactionPreconditionDetails';
import ReactionScoringDetails from '@/components/ReactionScoringDetails';
import ReactionBlockingTagsDetails from '@/components/ReactionBlockingTagsDetails';
import CombatRoleConfigDetails from '@/components/CombatRoleConfigDetails';
import CombatRoleTimingDetails from '@/components/CombatRoleTimingDetails';
import DistanceRoleEvaluatorDetails from '@/components/DistanceRoleEvaluatorDetails';
import CooldownRoleEvaluatorDetails from '@/components/CooldownRoleEvaluatorDetails';
import TargetingConfigDetails from '@/components/TargetingConfigDetails';
import ProjectTargetingDetails from '@/components/ProjectTargetingDetails';
import AwarenessFilteredTargetSelectorDetails from '@/components/AwarenessFilteredTargetSelectorDetails';
import AwarenessEnemyAIConfigDetails from '@/components/AwarenessEnemyAIConfigDetails';
import AwarenessConfigSensesDetails from '@/components/AwarenessConfigSensesDetails';
import AwarenessConfigEscalationDetails from '@/components/AwarenessConfigEscalationDetails';
import AwarenessConfigMemoryDetails from '@/components/AwarenessConfigMemoryDetails';
import TargetSelectionContextDetails from '@/components/TargetSelectionContextDetails';
import MeleeTraceTeamFilterDetails from '@/components/MeleeTraceTeamFilterDetails';
import MeleeTraceComponentDetails from '@/components/MeleeTraceComponentDetails';
import SECDamageConfigDetails from '@/components/SECDamageConfigDetails';
import MeleeTraceNotifyDetails from '@/components/MeleeTraceNotifyDetails';
import WeaponTraceSocketDetails from '@/components/WeaponTraceSocketDetails';
import CombatRoleReplicatedDetails from '@/components/CombatRoleReplicatedDetails';
import MultiplayerActionStateDetails from '@/components/MultiplayerActionStateDetails';
import StateTreeBehaviorConfigDetails from '@/components/StateTreeBehaviorConfigDetails';
import BotStateTreeAIConfigDetails from '@/components/BotStateTreeAIConfigDetails';
import PerformanceMovementTuningDetails from '@/components/PerformanceMovementTuningDetails';
import ActionEvaluationDebugDetails from '@/components/ActionEvaluationDebugDetails';
import MovementEvaluatorDebugDetails from '@/components/MovementEvaluatorDebugDetails';
import ThreatDetectionDetails from '@/components/ThreatDetectionDetails';
import ThreatResponseWiringDetails from '@/components/ThreatResponseWiringDetails';
import ThreatResponseProfileDetails from '@/components/ThreatResponseProfileDetails';
import RegisterCombatTargetBlueprint from '@/components/RegisterCombatTargetBlueprint';
import ActionScoreFormula from '@/components/ActionScoreFormula';
import Reviews from '@/components/Reviews';

const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

const components = {
  Image,
  Callout,
  Collapsible,
  Protip,
  ZoomableImage,
  VideoLoop,
  GameStatusBadge,
  Breadcrumb,
  DocNav,
  MovementVisualizer,
  ActionFlowVisualizer,
  ReactionFlowVisualizer,
  CombatRoleVisualizer,
  ThreatVisualizer,
  AwarenessVisualizer,
  MeleeTraceVisualizer,
  PerformanceVisualizer,
  TargetingVisualizer,
  BlueprintUE,
  ArchitectureDiagram,
  SystemArchitectureVisualizer,
  PurchaseFlowVisualizer,
  ScorerStackVisualizer,
  StateTreeDiagram,
  ArchitectureFlowDiagram,
  MovementEvaluatorDetails,
  MovementProfileDetails,
  DistanceBandVisualizer,
  ActionCooldownDetails,
  ExecutionMethodExplorer,
  RangeEvalDetails,
  ReactionSpecDetails,
  ReactionPreconditionDetails,
  ReactionScoringDetails,
  ReactionBlockingTagsDetails,
  CombatRoleConfigDetails,
  CombatRoleTimingDetails,
  DistanceRoleEvaluatorDetails,
  CooldownRoleEvaluatorDetails,
  TargetingConfigDetails,
  ProjectTargetingDetails,
  AwarenessFilteredTargetSelectorDetails,
  AwarenessEnemyAIConfigDetails,
  AwarenessConfigSensesDetails,
  AwarenessConfigEscalationDetails,
  AwarenessConfigMemoryDetails,
  TargetSelectionContextDetails,
  MeleeTraceTeamFilterDetails,
  MeleeTraceComponentDetails,
  SECDamageConfigDetails,
  MeleeTraceNotifyDetails,
  WeaponTraceSocketDetails,
  CombatRoleReplicatedDetails,
  MultiplayerActionStateDetails,
  StateTreeBehaviorConfigDetails,
  BotStateTreeAIConfigDetails,
  RegisterCombatTargetBlueprint,
  PerformanceMovementTuningDetails,
  ActionEvaluationDebugDetails,
  MovementEvaluatorDebugDetails,
  ThreatDetectionDetails,
  ThreatResponseWiringDetails,
  ThreatResponseProfileDetails,
  ActionScoreFormula,
  Reviews,
  // Prevent hydration errors from block elements nested inside <p>
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <div className="mb-4 leading-7" {...props}>{children}</div>
  ),
};

interface MdxProps {
  code: string;
}

export function MDXContent({ code }: MdxProps) {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
}
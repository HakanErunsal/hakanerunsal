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
import RangeEvalDetails from '@/components/RangeEvalDetails';
import ReactionSpecDetails from '@/components/ReactionSpecDetails';
import ReactionPreconditionDetails from '@/components/ReactionPreconditionDetails';
import ReactionScoringDetails from '@/components/ReactionScoringDetails';
import ReactionBlockingTagsDetails from '@/components/ReactionBlockingTagsDetails';
import CombatRoleConfigDetails from '@/components/CombatRoleConfigDetails';
import CombatRoleTimingDetails from '@/components/CombatRoleTimingDetails';
import DistanceRoleEvaluatorDetails from '@/components/DistanceRoleEvaluatorDetails';
import CooldownRoleEvaluatorDetails from '@/components/CooldownRoleEvaluatorDetails';
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
  RangeEvalDetails,
  ReactionSpecDetails,
  ReactionPreconditionDetails,
  ReactionScoringDetails,
  ReactionBlockingTagsDetails,
  CombatRoleConfigDetails,
  CombatRoleTimingDetails,
  DistanceRoleEvaluatorDetails,
  CooldownRoleEvaluatorDetails,
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
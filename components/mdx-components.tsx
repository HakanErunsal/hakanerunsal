import Image from "next/image";
import * as runtime from "react/jsx-runtime";
import { Callout } from "./callout";
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
import Reviews from '@/components/Reviews';

const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

const components = {
  Image,
  Callout,
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
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
import MeleeTraceVisualizer from '@/components/MeleeTraceVisualizer';
import PerformanceVisualizer from '@/components/PerformanceVisualizer';
import TargetingVisualizer from '@/components/TargetingVisualizer';
import BlueprintUE from '@/components/BlueprintUE';
import ArchitectureDiagram from '@/components/ArchitectureDiagram';
import SystemArchitectureVisualizer from '@/components/SystemArchitectureVisualizer';

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
  MeleeTraceVisualizer,
  PerformanceVisualizer,
  TargetingVisualizer,
  BlueprintUE,
  ArchitectureDiagram,
  SystemArchitectureVisualizer,
};

interface MdxProps {
  code: string;
}

export function MDXContent({ code }: MdxProps) {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
}
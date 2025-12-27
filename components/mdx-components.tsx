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
import CombatRoleVisualizer from '@/components/CombatRoleVisualizer';
import ThreatVisualizer from '@/components/ThreatVisualizer';
import MeleeTraceVisualizer from '@/components/MeleeTraceVisualizer';

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
  CombatRoleVisualizer,
  ThreatVisualizer,
  MeleeTraceVisualizer,
};

interface MdxProps {
  code: string;
}

export function MDXContent({ code }: MdxProps) {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
}
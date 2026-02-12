"use client"

import { useEffect, useState } from 'react';
import { Brain, Zap, Workflow, Move, Target, Shield, ArrowDown, ChevronDown } from 'lucide-react';

interface LayerItem {
  label: string;
  items: string[];
  icon: 'brain' | 'zap' | 'workflow' | 'move' | 'target' | 'shield';
  color: string;       // e.g. "blue", "green", "orange", "purple"
}

interface ArchitectureDiagramProps {
  layers: LayerItem[];
  caption?: string;
}

const iconMap = {
  brain: Brain,
  zap: Zap,
  workflow: Workflow,
  move: Move,
  target: Target,
  shield: Shield,
};

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string; arrow: string }> = {
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/40',
    text: 'text-blue-400',
    glow: 'shadow-[0_0_24px_rgba(59,130,246,0.15)]',
    arrow: 'text-blue-500/50',
  },
  green: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/40',
    text: 'text-green-400',
    glow: 'shadow-[0_0_24px_rgba(34,197,94,0.15)]',
    arrow: 'text-green-500/50',
  },
  orange: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/40',
    text: 'text-orange-400',
    glow: 'shadow-[0_0_24px_rgba(249,115,22,0.15)]',
    arrow: 'text-orange-500/50',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/40',
    text: 'text-purple-400',
    glow: 'shadow-[0_0_24px_rgba(168,85,247,0.15)]',
    arrow: 'text-purple-500/50',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/40',
    text: 'text-cyan-400',
    glow: 'shadow-[0_0_24px_rgba(6,182,212,0.15)]',
    arrow: 'text-cyan-500/50',
  },
};

export default function ArchitectureDiagram({ layers, caption }: ArchitectureDiagramProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let mounted = true;

    const sequence = async () => {
      while (mounted) {
        for (let i = 0; i < layers.length; i++) {
          if (!mounted) break;
          setActiveIndex(i);
          await new Promise(r => setTimeout(r, 2000));
        }
      }
    };

    sequence();
    return () => { mounted = false; };
  }, [layers.length]);

  return (
    <div className="my-8 rounded-lg border border-border bg-black/20 p-6 sm:p-8">
      <div className="mx-auto flex max-w-[540px] flex-col items-center gap-0">
        {layers.map((layer, idx) => {
          const colors = colorMap[layer.color] || colorMap.blue;
          const Icon = iconMap[layer.icon] || Brain;
          const isActive = idx === activeIndex;

          return (
            <div key={idx} className="flex w-full flex-col items-center">
              {/* Arrow between layers */}
              {idx > 0 && (
                <div className="flex h-8 items-center">
                  <ChevronDown
                    className={`h-5 w-5 transition-all duration-500 ${
                      isActive || idx - 1 === activeIndex
                        ? (colorMap[layers[idx - 1].color] || colorMap.blue).arrow
                        : 'text-muted-foreground/20'
                    }`}
                  />
                </div>
              )}

              {/* Layer card */}
              <div
                className={`
                  w-full rounded-lg border-2 p-4 transition-all duration-500
                  ${isActive
                    ? `${colors.bg} ${colors.border} ${colors.glow} scale-[1.02]`
                    : 'border-border/40 bg-card/30 opacity-60 scale-100'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`
                      mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border transition-all duration-500
                      ${isActive
                        ? `${colors.bg} ${colors.border} ${colors.text}`
                        : 'border-border bg-card text-muted-foreground'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-semibold transition-colors duration-500 ${
                        isActive ? colors.text : 'text-muted-foreground'
                      }`}
                    >
                      {layer.label}
                    </div>
                    <ul className="mt-1.5 space-y-0.5">
                      {layer.items.map((item, itemIdx) => (
                        <li
                          key={itemIdx}
                          className={`text-xs transition-colors duration-500 ${
                            isActive ? 'text-foreground/80' : 'text-muted-foreground/60'
                          }`}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {caption && (
        <div className="mt-5 text-center text-sm text-muted-foreground">
          {caption}
        </div>
      )}
    </div>
  );
}

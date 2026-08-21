"use client";

import { useLayoutEffect, useState } from "react";

interface UeBlueprintWireProps {
  /** The wire's own graph, whose top-left corner anchor points are measured against. */
  containerRef: React.RefObject<HTMLElement | null>;
  fromRef: React.RefObject<HTMLElement | null>;
  toRef: React.RefObject<HTMLElement | null>;
  color: string;
}

interface WirePoints {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** SGraphPanel's connection curve: a cubic bezier leaving and entering each pin horizontally, the S-curve UE draws between two pins that are not level with each other. */
export function UeBlueprintWire({ containerRef, fromRef, toRef, color }: UeBlueprintWireProps) {
  const [points, setPoints] = useState<WirePoints | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const from = fromRef.current;
    const to = toRef.current;
    if (!container || !from || !to) return;

    function measure() {
      const containerRect = container!.getBoundingClientRect();
      // A collapsed ancestor <details> renders this at zero size; wait for the
      // resize the observer below reports once it opens rather than drawing a
      // wire to the corner.
      if (containerRect.width === 0 && containerRect.height === 0) return;

      const fromRect = from!.getBoundingClientRect();
      const toRect = to!.getBoundingClientRect();

      setPoints({
        x1: fromRect.left + fromRect.width / 2 - containerRect.left,
        y1: fromRect.top + fromRect.height / 2 - containerRect.top,
        x2: toRect.left + toRect.width / 2 - containerRect.left,
        y2: toRect.top + toRect.height / 2 - containerRect.top,
      });
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef, fromRef, toRef]);

  if (!points) return null;

  const dx = Math.max(40, Math.abs(points.x2 - points.x1) * 0.5);
  const path = `M ${points.x1} ${points.y1} C ${points.x1 + dx} ${points.y1}, ${points.x2 - dx} ${points.y2}, ${points.x2} ${points.y2}`;

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
      <path d={path} fill="none" stroke={color} strokeWidth={2} />
    </svg>
  );
}

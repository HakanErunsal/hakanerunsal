"use client";

import React from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ helpers */

/** Deterministic 0..1 from an integer, so server and client render the same dots. */
function hash01(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const R = 260; // footprint radius, in svg units
const PEAK = 150; // peak height
const FLOOR = 220; // floor line
const CX = 300; // centre

/** The same shape the mound uses: peak * (1 - t^sharp)^shoulder. */
function domeZ(t: number, sharpness = 2, shoulder = 1.6): number {
  const a = Math.max(0, 1 - Math.pow(Math.abs(t), sharpness));
  return PEAK * Math.pow(a, shoulder);
}

function surfacePoints(dropCm = 0, samples = 40): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= samples; i++) {
    const t = -1 + (2 * i) / samples;
    const z = Math.max(0, Math.min(domeZ(t), PEAK - dropCm));
    pts.push([CX + t * R, FLOOR - z]);
  }
  return pts;
}

function toPath(pts: Array<[number, number]>): string {
  return pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
}

function Figure({
  caption,
  children,
  className,
}: {
  caption?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure className={cn("my-8", className)}>
      <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
        {children}
      </div>
      {caption ? (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/* --------------------------------------------------------------- 2. shift */

export function MoundShiftDiagram({
  caption = "One replicated integer is a ceiling the dome gets cut against. The skirt never moves; the crown flattens into a table that sinks.",
}: {
  caption?: string;
}) {
  const levels = [0, 34, 68, 102];
  return (
    <Figure caption={caption}>
      <svg
        viewBox="0 0 600 250"
        className="w-full"
        role="img"
        aria-label="The mound losing its crown as the shift ceiling comes down"
      >
        <line
          x1="20"
          y1={FLOOR}
          x2="580"
          y2={FLOOR}
          className="stroke-border"
          strokeWidth={1.5}
        />
        {levels.map((d, i) => (
          <path
            key={d}
            d={toPath(surfacePoints(d))}
            fill="none"
            className={i === 0 ? "stroke-primary" : "stroke-primary/35"}
            strokeWidth={i === 0 ? 2.25 : 1.5}
            strokeDasharray={i === 0 ? undefined : "5 5"}
          />
        ))}
        <g className="text-[11px]" fontFamily="ui-sans-serif, system-ui">
          <text x="300" y="60" textAnchor="middle" className="fill-primary">
            ShiftSteps = 0
          </text>
          <text
            x="300"
            y="98"
            textAnchor="middle"
            className="fill-muted-foreground"
          >
            ShiftSteps = 37
          </text>
          <text
            x="300"
            y="132"
            textAnchor="middle"
            className="fill-muted-foreground"
          >
            ShiftSteps = 75
          </text>
          <text
            x="300"
            y="166"
            textAnchor="middle"
            className="fill-muted-foreground"
          >
            ShiftSteps = 112
          </text>
          <text x="86" y="212" className="fill-muted-foreground">
            the skirt never moves
          </text>
          <text
            x="300"
            y="240"
            textAnchor="middle"
            className="fill-muted-foreground"
          >
            SurfaceZ = max(0, min(Dome(x, y), Peak &#8722; ShiftSteps &#215; ShiftStepCm))
          </text>
        </g>
      </svg>
    </Figure>
  );
}

/* --------------------------------------------------------- 3. lattice ids */

export function LatticeIndexDiagram({
  caption = "No straw is stored anywhere. Each one is a number, and the number rebuilds it.",
}: {
  caption?: string;
}) {
  const cols = 12;
  const rows = 6;
  const gap = 40;
  const ox = 60;
  const oy = 48;
  const tile = 4;

  const dots: React.ReactNode[] = [];
  for (let iy = 0; iy < rows; iy++) {
    for (let ix = 0; ix < cols; ix++) {
      const jx = (hash01(ix * 17 + iy * 31) - 0.5) * gap * 0.5;
      const jy = (hash01(ix * 29 + iy * 13 + 7) - 0.5) * gap * 0.5;
      const hot = ix === 6 && iy === 2;
      dots.push(
        <circle
          key={`${ix}-${iy}`}
          cx={ox + ix * gap + jx}
          cy={oy + iy * gap + jy}
          r={hot ? 6 : 3.2}
          className={hot ? "fill-primary" : "fill-amber-500/70"}
        />
      );
    }
  }

  const tileLines: React.ReactNode[] = [];
  for (let c = tile; c < cols; c += tile) {
    tileLines.push(
      <line
        key={c}
        x1={ox + c * gap - gap / 2}
        y1={oy - 28}
        x2={ox + c * gap - gap / 2}
        y2={oy + rows * gap - 8}
        className="stroke-border"
        strokeWidth={1}
        strokeDasharray="3 5"
      />
    );
  }

  return (
    <Figure caption={caption}>
      <svg
        viewBox="0 0 600 300"
        className="w-full"
        role="img"
        aria-label="Straw lattice and site ids"
      >
        {tileLines}
        {dots}
        <g className="text-[11px]" fontFamily="ui-sans-serif, system-ui">
          <text x={ox + 6 * gap + 14} y={oy + 2 * gap - 12} className="fill-primary">
            site = (iz × LatY + iy) × LatX + ix
          </text>
          <text x={ox - 26} y={oy - 20} className="fill-muted-foreground">
            tile 0
          </text>
          <text x={ox + 4 * gap - 26} y={oy - 20} className="fill-muted-foreground">
            tile 1
          </text>
          <text x={ox + 8 * gap - 26} y={oy - 20} className="fill-muted-foreground">
            tile 2
          </text>
          <text
            x="300"
            y="288"
            textAnchor="middle"
            className="fill-muted-foreground"
          >
            one integer in, one straw out. Same answer on every machine.
          </text>
        </g>
      </svg>
    </Figure>
  );
}

/* ----------------------------------------------------------- 4. shot slate */

export function ShotSlate({
  id,
  title,
  length,
  camera,
  shows,
  src,
}: {
  id: string;
  title: string;
  length?: string;
  camera?: string;
  shows?: string[];
  src?: string;
}) {
  return (
    <div className="my-8 overflow-hidden rounded-lg border border-dashed border-primary/50 bg-primary/[0.04]">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-dashed border-primary/30 px-4 py-2.5">
        <span className="rounded bg-primary/15 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
          {id}
        </span>
        <span className="font-heading text-sm font-semibold text-foreground">
          {title}
        </span>
        {length ? (
          <span className="ml-auto font-mono text-[11px] text-muted-foreground">
            {length}
          </span>
        ) : null}
      </div>

      {src ? (
        <video src={src} autoPlay loop muted playsInline className="block w-full" />
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-muted/30">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground/70">
            clip goes here
          </span>
        </div>
      )}

      <div className="space-y-2 px-4 py-3 text-sm">
        {camera ? (
          <p className="m-0 text-muted-foreground">
            <span className="font-semibold text-foreground">Camera: </span>
            {camera}
          </p>
        ) : null}
        {shows?.length ? (
          <div>
            <span className="text-sm font-semibold text-foreground">
              Should show:
            </span>
            <ul className="m-0 mt-1 list-disc pl-5 text-muted-foreground">
              {shows.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

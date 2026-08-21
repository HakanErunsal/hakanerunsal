"use client";

import { ReactNode, RefObject } from "react";
import { UE } from "./ue-theme";

interface UeSceneFrameProps {
  /** Editor window title shown on the scene's title bar. */
  title: string;
  /** One line under the scene saying what it shows. */
  caption?: string;
  /** Rendered width in pixels. */
  width?: number;
  /** Fixed body height, so a scene does not resize as its steps play. */
  height?: number;
  frameRef?: RefObject<HTMLDivElement>;
  children?: ReactNode;
}

/**
 * The editor-window chrome every animated scene sits inside, so a scene and a
 * recorded clip present the same way on a page.
 */
export function UeSceneFrame({
  title,
  caption,
  width = 400,
  height = 260,
  frameRef,
  children,
}: UeSceneFrameProps) {
  return (
    <figure className="not-prose my-4" style={{ maxWidth: width }}>
      <div
        ref={frameRef}
        className="overflow-hidden rounded-[4px] border"
        style={{ borderColor: UE.windowBorder, background: UE.background }}
      >
        <div
          className="flex items-center gap-1.5 border-b px-2 py-1"
          style={{ borderColor: UE.windowBorder, background: UE.title }}
        >
          <span className="h-2 w-2 rounded-full" style={{ background: UE.dropdownOutline }} />
          <span className="text-[11px]" style={{ color: UE.foreground }}>
            {title}
          </span>
        </div>
        <div className="relative" style={{ height, background: UE.background }}>
          {children}
        </div>
      </div>
      {caption && (
        <figcaption className="mt-1.5 !text-left text-[13px] leading-snug text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

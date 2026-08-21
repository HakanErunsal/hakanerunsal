"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { UE } from "@/components/ue-editor/ue-theme";

interface UeClipProps {
  /** Path to the clip, relative to the page: "../images/clip_name.mp4". Leave unset to reserve the slot. */
  src?: string;
  /** One line under the clip saying what it shows. */
  caption?: string;
  /** What to record. Shown in the authoring placeholder while src is unset, and used as the accessible label. */
  shot?: string;
  /** Rendered width in pixels. Editor captures are authored square at 400. */
  width?: number;
}

/**
 * Short, silent, looping capture of one editor step. Click to enlarge.
 *
 * With no src the component reserves the slot: an authoring placeholder appears
 * during local development and nothing renders in a built site.
 */
export default function UeClip({ src, caption, shot, width = 400 }: UeClipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggle = () => {
    if (!isOpen) {
      setIsOpen(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      setTimeout(() => setIsOpen(false), 150);
    }
  };

  if (!src) {
    if (process.env.NODE_ENV === "production") return null;
    return (
      <figure className="my-4 not-prose" style={{ maxWidth: width }}>
        <div
          className="flex items-center justify-center rounded-[4px] border-2 border-dashed p-4 text-center"
          style={{
            borderColor: UE.dropdownOutline,
            background: UE.recessed,
            minHeight: Math.round(width * 0.62),
          }}
        >
          <div>
            <div
              className="font-mono text-[10px] uppercase tracking-wide"
              style={{ color: UE.warning }}
            >
              Clip slot
            </div>
            <div className="mt-1 text-[12px] leading-snug" style={{ color: UE.foreground }}>
              {shot ?? caption ?? "Recording pending"}
            </div>
          </div>
        </div>
      </figure>
    );
  }

  return (
    <figure className="my-4 not-prose" style={{ maxWidth: width }}>
      <video
        src={src}
        title={shot ?? caption}
        aria-label={shot ?? caption ?? "Editor capture"}
        className="w-full cursor-zoom-in rounded-[4px] border"
        style={{ borderColor: UE.windowBorder, background: UE.background }}
        autoPlay
        loop
        muted
        playsInline
        onClick={toggle}
      />
      {caption && (
        <figcaption className="mt-1.5 !text-left text-[12px] leading-snug text-muted-foreground">
          {caption}
        </figcaption>
      )}

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/80 transition-opacity duration-150 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={toggle}
          >
            <video
              src={src}
              className="max-h-[95vh] max-w-[95vw] cursor-zoom-out"
              autoPlay
              loop
              muted
              playsInline
              onClick={toggle}
            />
          </div>,
          document.body,
        )}
    </figure>
  );
}

"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/**
 * Instanced-object combo box from the Details panel, opened.
 *
 * An Instanced UPROPERTY renders as a class combo: the picked class's DisplayName
 * with a dropdown listing every non-abstract subclass. Selecting one swaps the
 * sub-object, so the properties below the row change with it. Drive it with the
 * class display names and read the pick back through onSelect.
 *
 * The popup renders into document.body so the panel's own clipping cannot cut it
 * off, and it opens upward when the row sits near the bottom of the viewport.
 */

const MIN_MENU_WIDTH = 230;
/** 13px text on an 18px line, plus 3px padding each side. */
const ITEM_HEIGHT = 24;
const MENU_PADDING = 8;
const GAP = 2;
const VIEWPORT_MARGIN = 8;

interface MenuPosition {
  left: number;
  top: number;
  width: number;
  maxHeight: number;
}

export function UeClassPickerCombo({
  value,
  options,
  onSelect,
  label,
}: {
  value: string;
  options: string[];
  onSelect: (next: string) => void;
  /** Screen-reader name for the combo, normally the property label. */
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const place = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const desiredHeight = options.length * ITEM_HEIGHT + MENU_PADDING;
    const spaceBelow = window.innerHeight - rect.bottom - GAP - VIEWPORT_MARGIN;
    const spaceAbove = rect.top - GAP - VIEWPORT_MARGIN;
    const openUp = spaceBelow < desiredHeight && spaceAbove > spaceBelow;

    const width = Math.max(rect.width, MIN_MENU_WIDTH);
    const maxHeight = Math.max(ITEM_HEIGHT * 2, openUp ? spaceAbove : spaceBelow);
    const height = Math.min(desiredHeight, maxHeight);

    setPosition({
      left: Math.min(Math.max(VIEWPORT_MARGIN, rect.left), window.innerWidth - width - VIEWPORT_MARGIN),
      top: openUp ? rect.top - GAP - height : rect.bottom + GAP,
      width,
      maxHeight,
    });
  }, [options.length]);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    // Capture catches scrolling in any ancestor, not the page alone.
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, place]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        className="ue-dp-combo ue-dp-combo--interactive flex w-full max-w-[190px] items-center justify-between gap-1 pl-1.5 pr-1"
      >
        <span className="truncate text-[13px] leading-[21px] text-[color:var(--uekit-foreground-header)]">{value}</span>
        <svg className="h-2.5 w-2.5 shrink-0 text-[color:var(--uekit-hover2)]" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
          <path d="M1 3 L9 3 L5 8 Z" />
        </svg>
      </button>

      {open &&
        position &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            aria-label={label}
            className="ue-dp-picker fixed z-[100] overflow-y-auto py-1"
            style={{
              left: position.left,
              top: position.top,
              width: position.width,
              maxHeight: position.maxHeight,
            }}
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={option === value}
                onClick={() => {
                  onSelect(option);
                  setOpen(false);
                }}
                className={cn(
                  "ue-dp-picker-item flex w-full items-center px-2 py-[3px] text-left text-[13px] leading-[18px]",
                  option === value ? "text-[color:var(--uekit-foreground-hover)]" : "text-[color:var(--uekit-foreground-header)]",
                )}
                data-selected={option === value}
              >
                <span className="truncate">{option}</span>
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}

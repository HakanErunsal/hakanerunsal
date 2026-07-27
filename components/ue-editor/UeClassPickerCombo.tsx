"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Instanced-object combo box from the Details panel, opened.
 *
 * An Instanced UPROPERTY renders as a class combo: the picked class's DisplayName
 * with a dropdown listing every non-abstract subclass. Selecting one swaps the
 * sub-object, so the properties below the row change with it. Drive it with the
 * class display names and read the pick back through onSelect.
 */
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
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative w-full max-w-[190px]">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        className="ue-dp-combo ue-dp-combo--interactive flex w-full items-center justify-between gap-1 pl-1.5 pr-1"
      >
        <span className="truncate text-[11px] leading-[18px] text-[#c9c9c9]">{value}</span>
        <svg className="h-2.5 w-2.5 shrink-0 text-[#9a9a9a]" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
          <path d="M1 3 L9 3 L5 8 Z" />
        </svg>
      </button>

      {open && (
        <div role="listbox" aria-label={label} className="ue-dp-picker absolute left-0 top-[20px] z-20 w-[230px] py-1">
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
                "ue-dp-picker-item flex w-full items-center px-2 py-[3px] text-left text-[11px] leading-[16px]",
                option === value ? "text-[#ffffff]" : "text-[#c9c9c9]",
              )}
              data-selected={option === value}
            >
              <span className="truncate">{option}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

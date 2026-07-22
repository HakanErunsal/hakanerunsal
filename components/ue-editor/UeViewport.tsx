import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ueViewport } from "./ue-theme";

interface UeViewportProps {
  className?: string;
  children: React.ReactNode;
  onMouseMove?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}

export const UeViewport = forwardRef<HTMLDivElement, UeViewportProps>(
  function UeViewport({ className, children, ...handlers }, ref) {
    return (
      <div ref={ref} className={ueViewport(cn("cursor-crosshair", className))} {...handlers}>
        {children}
      </div>
    );
  },
);

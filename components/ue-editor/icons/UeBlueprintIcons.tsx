/** UE-style Blueprint node header icons */

export function UeFunctionIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <text
        x="2"
        y="13"
        fill="currentColor"
        fontSize="13"
        fontStyle="italic"
        fontWeight="700"
        fontFamily="Segoe UI, system-ui, sans-serif"
      >
        f
      </text>
    </svg>
  );
}

export function UeBreakStructIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <circle cx="4" cy="8" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6.5 8 H10" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 6 V10" stroke="currentColor" strokeWidth="1.2" />
      <path d="M12 5 V11" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function UeEventIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <polygon points="3,2 13,8 3,14" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

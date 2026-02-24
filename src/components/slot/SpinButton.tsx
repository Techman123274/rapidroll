"use client";

import { SPIN_BUTTON_HOVER_IMAGE, SPIN_BUTTON_IMAGE } from "@/lib/slot-engine/cyberCrimeAssets";

interface SpinButtonProps {
  disabled: boolean;
  isSpinning: boolean;
  onClick: () => void;
  label?: string;
}

export function SpinButton({ disabled, isSpinning, onClick, label = "SPIN" }: SpinButtonProps) {
  const useImage = Boolean(SPIN_BUTTON_IMAGE);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isSpinning}
      className={`
        slot-spin-btn relative min-h-[56px] min-w-[140px] rounded-xl px-8 py-4 text-lg font-bold uppercase
        tracking-wider transition-all duration-200
        ${disabled || isSpinning
          ? "cursor-not-allowed opacity-60"
          : "hover:opacity-95 active:scale-[0.98]"
        }
      `}
      style={
        useImage
          ? {
              background: `center/contain no-repeat url(${SPIN_BUTTON_IMAGE})`,
              color: disabled || isSpinning ? "inherit" : "transparent",
            }
          : undefined
      }
      onMouseEnter={(e) => {
        if (useImage && !disabled && !isSpinning && SPIN_BUTTON_HOVER_IMAGE) {
          e.currentTarget.style.background = `center/contain no-repeat url(${SPIN_BUTTON_HOVER_IMAGE})`;
        }
      }}
      onMouseLeave={(e) => {
        if (useImage && SPIN_BUTTON_IMAGE) {
          e.currentTarget.style.background = `center/contain no-repeat url(${SPIN_BUTTON_IMAGE})`;
        }
      }}
      aria-label={label}
    >
      {isSpinning ? (
        <span className="inline-flex items-center gap-2">
          <span className="slot-spin-dot h-2 w-2 rounded-full bg-cyan-400" />
          <span className="slot-spin-dot animation-delay-100 h-2 w-2 rounded-full bg-cyan-400" />
          <span className="slot-spin-dot animation-delay-200 h-2 w-2 rounded-full bg-cyan-400" />
        </span>
      ) : useImage ? (
        <span className="pointer-events-none opacity-0 select-none">{label}</span>
      ) : (
        label
      )}
    </button>
  );
}

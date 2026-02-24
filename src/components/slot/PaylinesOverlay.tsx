"use client";

import { PAYLINES } from "@/lib/slot-engine/cyberCrimeConfig";

interface PaylinesOverlayProps {
  winningLines: number[];
  showAllLines?: boolean;
  isSpinning: boolean;
}

export function PaylinesOverlay({
  winningLines,
  showAllLines = true,
  isSpinning,
}: PaylinesOverlayProps) {
  const winningSet = new Set(winningLines);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 flex items-stretch justify-stretch overflow-hidden rounded-xl"
      aria-hidden
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 5 3"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="payline-glow-win" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(34,211,238,0)" />
            <stop offset="20%" stopColor="rgba(34,211,238,0.6)" />
            <stop offset="50%" stopColor="rgba(168,85,247,0.7)" />
            <stop offset="80%" stopColor="rgba(34,211,238,0.6)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0)" />
          </linearGradient>
          <filter id="payline-glow">
            <feGaussianBlur stdDeviation="0.03" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {PAYLINES.map((line, index) => {
          const isWinner = winningSet.has(index);
          const show = showAllLines || isWinner;
          if (!show) return null;

          const points = line
            .map((row, reel) => `${reel + 0.5},${row + 0.5}`)
            .join(" ");

          return (
            <polyline
              key={index}
              points={points}
              fill="none"
              stroke={isWinner ? "url(#payline-glow-win)" : "rgba(34,211,238,0.15)"}
              strokeWidth={isWinner ? 0.12 : 0.06}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={isWinner ? "url(#payline-glow)" : undefined}
              className={isWinner ? "payline-winner" : ""}
            />
          );
        })}
      </svg>
    </div>
  );
}

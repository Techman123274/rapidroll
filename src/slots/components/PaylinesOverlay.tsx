"use client";

import { PAYLINES_50 } from "@/slots/engine/PaylineEvaluator";

interface PaylinesOverlayProps {
  winningLines: number[];
  showAll?: boolean;
}

export function PaylinesOverlay({ winningLines, showAll = true }: PaylinesOverlayProps) {
  const winningSet = new Set(winningLines);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-stretch justify-stretch rounded-2xl">
      <svg className="h-full w-full" viewBox="0 0 5 3" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cyber-payline-win" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(34,211,238,0)" />
            <stop offset="20%" stopColor="rgba(34,211,238,0.8)" />
            <stop offset="50%" stopColor="rgba(168,85,247,0.9)" />
            <stop offset="80%" stopColor="rgba(34,211,238,0.8)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0)" />
          </linearGradient>
        </defs>
        {PAYLINES_50.lines.map((line, i) => {
          const isWin = winningSet.has(i);
          if (!showAll && !isWin) return null;

          const points = line
            .map((row, reel) => `${reel + 0.5},${row + 0.5}`)
            .join(" ");

          return (
            <polyline
              key={i}
              points={points}
              fill="none"
              stroke={isWin ? "url(#cyber-payline-win)" : "rgba(56,189,248,0.18)"}
              strokeWidth={isWin ? 0.12 : 0.05}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isWin ? "payline-winner" : ""}
            />
          );
        })}
      </svg>
    </div>
  );
}


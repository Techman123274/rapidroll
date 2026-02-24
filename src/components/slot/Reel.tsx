"use client";

import { useEffect, useState, useRef } from "react";
import { getSymbolImageUrl } from "@/lib/slot-engine/cyberCrimeAssets";

const CELL_HEIGHT = 72;
const ROWS_VISIBLE = 3;

interface ReelProps {
  reelIndex: number;
  symbols: [string, string, string];
  isSpinning: boolean;
  stopDelayMs: number;
  onStopped?: () => void;
  winningRows?: [boolean, boolean, boolean];
}

function SymbolCell({
  id,
  reelIndex,
  cellIndex,
  isWinning,
}: {
  id: string;
  reelIndex: number;
  cellIndex: number;
  isWinning?: boolean;
}) {
  const src = getSymbolImageUrl(id);
  return (
    <div
      className={`flex h-[72px] w-full flex-shrink-0 items-center justify-center rounded transition-shadow duration-300 ${isWinning ? "symbol-cell-win" : ""}`}
      style={{ height: CELL_HEIGHT }}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="h-14 w-14 object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
          onError={(e) => {
            const t = e.currentTarget;
            t.style.display = "none";
            if (!t.nextElementSibling) {
              const fallback = document.createElement("span");
              fallback.className = "text-lg font-bold text-cyan-400";
              fallback.textContent = id.slice(0, 2);
              t.parentNode?.appendChild(fallback);
            }
          }}
        />
      ) : (
        <span className="text-lg font-bold text-cyan-400">{id.slice(0, 2)}</span>
      )}
    </div>
  );
}

/** Ease out with slight overshoot (back) for a satisfying stop */
function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export function Reel({
  reelIndex,
  symbols,
  isSpinning,
  stopDelayMs,
  onStopped,
  winningRows,
}: ReelProps) {
  const [hasStopped, setHasStopped] = useState(false);
  const translateY = useRef(0);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!isSpinning) {
      translateY.current = 0;
      setHasStopped(false);
      forceUpdate((n) => n + 1);
      return;
    }
    setHasStopped(false);
    const startY = -CELL_HEIGHT * ROWS_VISIBLE;
    translateY.current = startY;
    forceUpdate((n) => n + 1);

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / stopDelayMs, 1);
      const eased = easeOutBack(progress);
      translateY.current = startY + (0 - startY) * eased;
      if (progress >= 1) {
        translateY.current = 0;
        setHasStopped(true);
        onStopped?.();
        forceUpdate((n) => n + 1);
      } else {
        forceUpdate((n) => n + 1);
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isSpinning, stopDelayMs, onStopped]);

  const visibleHeight = CELL_HEIGHT * ROWS_VISIBLE;
  const strip = [
    symbols[0],
    symbols[1],
    symbols[2],
    symbols[0],
    symbols[1],
    symbols[2],
  ];

  return (
    <div
      className={`reel-container relative w-full overflow-hidden rounded-lg border border-cyan-500/30 bg-black/40 ${isSpinning ? "reel-spinning" : ""}`}
      style={{ height: visibleHeight, minWidth: "64px" }}
    >
      <div
        className="reel-strip flex flex-col items-center justify-start"
        style={{
          transform: `translateY(${translateY.current}px)`,
          willChange: isSpinning ? "transform" : "auto",
        }}
      >
        {strip.map((id, i) => (
          <SymbolCell
            key={`${reelIndex}-${i}-${id}`}
            id={id}
            reelIndex={reelIndex}
            cellIndex={i}
            isWinning={winningRows ? winningRows[i % 3] : false}
          />
        ))}
      </div>
      {hasStopped && (
        <div
          className="pointer-events-none absolute inset-0 animate-[reel-bounce_0.25s_ease-out]"
          aria-hidden
        />
      )}
    </div>
  );
}

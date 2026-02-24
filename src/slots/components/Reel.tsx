"use client";

import { useEffect, useRef, useState } from "react";
import { SymbolCell } from "./SymbolCell";

interface ReelProps {
  index: number;
  symbols: string[]; // length 3
  spinning: boolean;
  stopTimeMs: number;
  onStopped?: () => void;
  winningRows?: [boolean, boolean, boolean];
  turbo?: boolean;
}

const CELL_HEIGHT = 72;
const VISIBLE_ROWS = 3;

export function Reel({
  index,
  symbols,
  spinning,
  stopTimeMs,
  onStopped,
  winningRows,
  turbo,
}: ReelProps) {
  const [hasStopped, setHasStopped] = useState(false);
  const translateYRef = useRef(0);
  const [, force] = useState(0);

  useEffect(() => {
    if (!spinning) {
      translateYRef.current = 0;
      setHasStopped(false);
      force((n) => n + 1);
      return;
    }

    setHasStopped(false);
    const start = performance.now();
    const duration = turbo ? stopTimeMs * 0.5 : stopTimeMs;
    const startY = -CELL_HEIGHT * VISIBLE_ROWS;
    translateYRef.current = startY;
    force((n) => n + 1);

    let raf = 0;

    const easeInExpo = (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1)));
    const easeOutBack = (t: number) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const accelPhase = Math.min(t * 2, 1);
      const decelPhase = t;

      const eased =
        t < 0.5
          ? easeInExpo(accelPhase) * 0.7
          : 0.7 + (easeOutBack(decelPhase) * 0.3);

      translateYRef.current = startY + (0 - startY) * eased;

      if (t >= 1) {
        translateYRef.current = 0;
        setHasStopped(true);
        onStopped?.();
        force((n) => n + 1);
        return;
      }

      force((n) => n + 1);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [spinning, stopTimeMs, turbo, onStopped]);

  const visibleHeight = CELL_HEIGHT * VISIBLE_ROWS;
  const strip = [...symbols, ...symbols];

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-cyan-500/30 bg-black/60 ${
        spinning ? "reel-spinning" : ""
      }`}
      style={{ height: visibleHeight, minWidth: 72 }}
    >
      <div
        className="reel-strip flex flex-col items-center justify-start"
        style={{
          transform: `translateY(${translateYRef.current}px)`,
          willChange: spinning ? "transform" : "auto",
        }}
      >
        {strip.map((s, i) => (
          <SymbolCell
            key={`${index}-${i}-${s}`}
            symbolId={s}
            isWinning={winningRows ? winningRows[i % 3] : false}
          />
        ))}
      </div>
      {hasStopped && (
        <div className="pointer-events-none absolute inset-0 animate-[reel-bounce_0.25s_ease-out]" />
      )}
    </div>
  );
}


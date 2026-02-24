"use client";

import { useEffect, useState } from "react";

interface WinCounterProps {
  amount: number;
  bigWinThreshold?: number;
}

export function WinCounter({ amount, bigWinThreshold = 10 }: WinCounterProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = display;
    const target = amount;
    if (target === start) return;

    const duration = 600;
    const startTime = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = start + (target - start) * eased;
      setDisplay(Math.round(value * 100) / 100);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount]);

  const isBig = amount >= bigWinThreshold;

  return (
    <div
      className={`flex flex-col items-end rounded-lg border px-3 py-2 text-right text-xs ${
        isBig
          ? "border-amber-400/70 bg-black/60"
          : "border-cyan-500/40 bg-black/40"
      }`}
    >
      <span className="text-[10px] uppercase tracking-widest text-cyan-300/80">
        Win
      </span>
      <span
        className={`mt-0.5 font-mono text-lg font-bold tabular-nums ${
          isBig ? "win-display-big text-amber-300" : "text-cyan-200"
        }`}
      >
        {display.toFixed(2)}
      </span>
    </div>
  );
}


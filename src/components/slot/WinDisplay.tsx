"use client";

import { useEffect, useState } from "react";

interface WinDisplayProps {
  amount: number;
  visible: boolean;
  isBigWin?: boolean;
}

export function WinDisplay({ amount, visible, isBigWin }: WinDisplayProps) {
  const [displayAmount, setDisplayAmount] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (!visible) {
      setDisplayAmount(0);
      return;
    }
    setKey((k) => k + 1);
    const target = amount;
    const start = 0;
    const duration = 600;
    const startTime = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 2);
      setDisplayAmount(Math.round((start + (target - start) * ease) * 100) / 100);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, amount]);

  if (!visible && amount === 0) {
    return (
      <div className="win-display-container flex flex-col items-center justify-center gap-1">
        <span className="text-xs uppercase tracking-wider text-slate-500">Win</span>
        <span className="text-xl font-bold tabular-nums text-slate-600">0.00</span>
      </div>
    );
  }

  return (
    <div
      key={key}
      className={`win-display-container flex flex-col items-center justify-center gap-1 ${visible ? "win-display-visible" : ""}`}
    >
      <span className="text-xs uppercase tracking-wider text-cyan-400/90">Win</span>
      <span
        className={`tabular-nums font-bold ${isBigWin ? "win-display-big text-2xl text-amber-400" : "text-xl text-cyan-300"}`}
      >
        {displayAmount.toFixed(2)}
      </span>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { gameSounds } from "@/lib/game-sounds";
import { BACKGROUND_IMAGE } from "@/lib/slot-engine/cyberCrimeAssets";
import { Reel } from "./Reel";
import { PaylinesOverlay } from "./PaylinesOverlay";
import { WinCounter } from "./WinCounter";
import type { BonusState } from "@/slots/engine/BonusEngine";

interface ApiSpinResponse {
  ok: true;
  grid: string[][];
  totalWin: number;
  paylinesHit: { lineIndex: number }[];
  scatter: { scatterCount: number; scatterWin: number; bonusTriggered: boolean };
  multipliers: { combinedMultiplier: number };
  bonusState?: BonusState;
  bonusTriggered: boolean;
  balance: string;
}

type VolatilityMode = "low" | "medium" | "high";

export function SlotMachine() {
  const { data: session, status } = useSession();
  const [balance, setBalance] = useState(0);
  const [betPerLine, setBetPerLine] = useState(0.2);
  const [linesCount] = useState(50);
  const [volatility, setVolatility] = useState<VolatilityMode>("medium");
  const [spinning, setSpinning] = useState(false);
  const [grid, setGrid] = useState<string[][] | null>(null);
  const [winningLines, setWinningLines] = useState<number[]>([]);
  const [lastWin, setLastWin] = useState(0);
  const [bonusState, setBonusState] = useState<BonusState | undefined>(undefined);
  const [autoSpin, setAutoSpin] = useState<null | number>(null);
  const [turbo, setTurbo] = useState(false);
  const [reelsStopped, setReelsStopped] = useState(0);

  const totalBet = useMemo(() => betPerLine * linesCount, [betPerLine, linesCount]);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch("/api/user/balance")
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.balance === "string") setBalance(parseFloat(d.balance));
      })
      .catch(() => {});
  }, [session?.user?.id]);

  const canSpin = !!session?.user?.id && !spinning && (bonusState?.active || balance >= totalBet);

  const handleReelStopped = useCallback(() => {
    setReelsStopped((n) => n + 1);
    gameSounds.slotReelStop();
  }, []);

  const handleServerSpin = useCallback(async () => {
    if (!session?.user?.id) return;

    const body = {
      betPerLine,
      linesCount,
      volatilityMode: volatility,
      bonusState,
    };

    const res = await fetch("/api/slot/spin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.error ?? "Spin failed");
      return;
    }
    const data = (await res.json()) as ApiSpinResponse;

    setGrid(data.grid);
    setWinningLines(data.paylinesHit.map((l) => l.lineIndex));
    setLastWin(data.totalWin);
    setBonusState(data.bonusState);
    setBalance(parseFloat(data.balance));

    if (data.totalWin > 0 || data.bonusTriggered) {
      if (data.bonusTriggered) {
        gameSounds.slotBonusTrigger();
      } else if (data.totalWin >= totalBet * 10) {
        gameSounds.slotBigWin();
      } else {
        gameSounds.slotSmallWin();
      }
    }

    console.log("Cyber Crime v2 spin:", data);
  }, [session?.user?.id, betPerLine, linesCount, volatility, bonusState, totalBet]);

  const spin = useCallback(async () => {
    if (!canSpin) return;
    setSpinning(true);
    setReelsStopped(0);
    setWinningLines([]);
    gameSounds.slotSpinStart();
    await handleServerSpin();
  }, [canSpin, handleServerSpin]);

  useEffect(() => {
    if (!spinning) return;
    if (reelsStopped < 5) return;
    const t = setTimeout(() => {
      setSpinning(false);
      setReelsStopped(0);
      if (autoSpin && autoSpin > 0) {
        spin();
      }
    }, turbo ? 100 : 250);
    return () => clearTimeout(t);
  }, [spinning, reelsStopped, autoSpin, turbo, spin]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070707]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#070707] p-6">
        <p className="text-white">Please log in to play Cyber Crime</p>
        <Link
          href="/login"
          className="rounded-xl bg-cyan-500 px-6 py-2 font-bold text-black"
        >
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-full bg-[#070707] bg-cover bg-center p-4 sm:p-6"
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
    >
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 mx-auto max-w-5xl space-y-4">
        <header className="flex items-center justify-between gap-4">
          <Link
            href="/play"
            className="flex items-center gap-2 text-slate-300 transition-colors hover:text-cyan-400"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Link>
          <div className="flex items-center gap-4">
            <div className="rounded-lg border border-cyan-500/40 bg-black/60 px-4 py-2 text-xs">
              <div className="flex items-baseline gap-2">
                <span className="text-cyan-300/80">Balance</span>
                <span className="font-mono text-lg font-bold text-cyan-100">
                  {balance.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="hidden rounded-lg border border-slate-700/60 bg-black/50 px-3 py-2 text-[10px] text-slate-400 sm:block">
              <div>RTP (dev): 96%</div>
              <div className="mt-0.5 flex items-center gap-1">
                Volatility:
                <select
                  value={volatility}
                  onChange={(e) => setVolatility(e.target.value as VolatilityMode)}
                  className="rounded bg-black/60 px-1 py-0.5 text-[10px]"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <WinCounter amount={lastWin} bigWinThreshold={totalBet * 10} />
          </div>
        </header>

        <section className="rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-cyan-950/40 via-black/80 to-violet-950/40 p-4 shadow-[0_0_80px_rgba(34,211,238,0.25)] backdrop-blur-md">
          <div className="relative mx-auto max-w-3xl rounded-3xl border border-cyan-500/50 bg-black/70 p-4">
            <div className="relative grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((reelIndex) => (
                <Reel
                  key={reelIndex}
                  index={reelIndex}
                  symbols={
                    grid
                      ? [grid[reelIndex][0], grid[reelIndex][1], grid[reelIndex][2]]
                      : ["symbol_1", "symbol_2", "symbol_3"]
                  }
                  spinning={spinning}
                  stopTimeMs={1200 + reelIndex * 150}
                  onStopped={handleReelStopped}
                  winningRows={computeWinningRows(reelIndex, winningLines)}
                  turbo={turbo}
                />
              ))}
              <PaylinesOverlay winningLines={winningLines} showAll />
            </div>
            <p className="mt-2 text-center text-[10px] uppercase tracking-widest text-cyan-400/80">
              50 paylines • Left to right
            </p>
          </div>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-black/70 p-4">
          <div className="flex flex-col gap-2 text-xs text-slate-300">
            <span className="text-slate-400">Bet per line</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0.1}
                max={5}
                step={0.1}
                value={betPerLine}
                onChange={(e) => setBetPerLine(parseFloat(e.target.value))}
                disabled={spinning}
              />
              <span className="w-16 text-right font-mono">{betPerLine.toFixed(2)}</span>
            </div>
            <span className="text-[11px] text-slate-500">
              Total bet: {totalBet.toFixed(2)} ({linesCount} lines)
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1 text-[11px] text-slate-400">
              <input
                type="checkbox"
                className="h-3 w-3"
                checked={turbo}
                onChange={(e) => setTurbo(e.target.checked)}
              />
              Turbo
            </label>
            <select
              value={autoSpin ?? 0}
              onChange={(e) => {
                const v = Number(e.target.value);
                setAutoSpin(v > 0 ? v : null);
              }}
              className="rounded-lg bg-black/70 px-2 py-1 text-[11px] text-slate-200"
            >
              <option value={0}>Manual</option>
              <option value={10}>Auto 10</option>
              <option value={50}>Auto 50</option>
              <option value={100}>Auto 100</option>
            </select>
            <button
              type="button"
              onClick={spin}
              disabled={!canSpin}
              className={`relative min-w-[140px] rounded-xl px-8 py-3 text-sm font-bold uppercase tracking-widest text-black transition-all ${
                !canSpin
                  ? "cursor-not-allowed bg-slate-700 text-slate-500"
                  : "bg-gradient-to-b from-cyan-400 to-cyan-600 shadow-[0_0_28px_rgba(34,211,238,0.6)] hover:from-cyan-300 hover:to-cyan-500 active:scale-[0.97]"
              }`}
            >
              {spinning ? "Spinning..." : "Spin"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function computeWinningRows(
  reelIndex: number,
  winningLines: number[]
): [boolean, boolean, boolean] {
  if (!winningLines.length) return [false, false, false];
  // Reuse PAYLINES_50 from the engine for consistency
  const { PAYLINES_50 } = require("@/slots/engine/PaylineEvaluator") as typeof import("@/slots/engine/PaylineEvaluator");
  const rows: [boolean, boolean, boolean] = [false, false, false];
  for (const line of winningLines) {
    const def = PAYLINES_50.lines[line];
    if (!def) continue;
    const row = def[reelIndex];
    if (row >= 0 && row <= 2) rows[row] = true;
  }
  return rows;
}


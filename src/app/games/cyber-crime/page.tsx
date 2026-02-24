"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft } from "lucide-react";
import { PAYLINE_COUNT, PAYLINES } from "@/lib/slot-engine/cyberCrimeConfig";
import { spin as engineSpin } from "@/lib/slot-engine/cyberCrimeEngine";
import { Reel } from "@/components/slot/Reel";
import { PaylinesOverlay } from "@/components/slot/PaylinesOverlay";
import { SpinButton } from "@/components/slot/SpinButton";
import { WinDisplay } from "@/components/slot/WinDisplay";
import { placeSlotBet, creditSlotWin } from "./slot-actions";
import { gameSounds } from "@/lib/game-sounds";
import { BACKGROUND_IMAGE } from "@/lib/slot-engine/cyberCrimeAssets";
import type { SpinResult } from "@/lib/slot-engine/cyberCrimeEngine";

const BET_OPTIONS = [0.1, 0.25, 0.5, 1, 2, 5, 10];
const SPIN_DURATION_MS = 1200;
const STAGGER_MS = 120;

/** Which of the 3 rows on this reel are part of a winning line */
function getWinningRowsForReel(
  reelIndex: number,
  winningLines: number[]
): [boolean, boolean, boolean] {
  const rows: [boolean, boolean, boolean] = [false, false, false];
  for (const lineIdx of winningLines) {
    const row = PAYLINES[lineIdx][reelIndex];
    rows[row] = true;
  }
  return rows;
}

function useBalance(session: { user?: { id?: string } } | null) {
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    if (!session?.user?.id) {
      setBalance(0);
      return;
    }
    fetch("/api/user/balance")
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.balance === "string") setBalance(parseFloat(d.balance));
      })
      .catch(() => {});
  }, [session?.user?.id]);
  return { balance, setBalance };
}

export default function CyberCrimePage() {
  const { data: session, status } = useSession();
  const { balance, setBalance } = useBalance(session);
  const [betIndex, setBetIndex] = useState(2);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastResult, setLastResult] = useState<SpinResult | null>(null);
  const [winVisible, setWinVisible] = useState(false);
  const [reelsStopped, setReelsStopped] = useState(0);

  const betPerLine = BET_OPTIONS[betIndex];
  const totalBet = betPerLine * PAYLINE_COUNT;
  const canSpin = !isSpinning && balance >= totalBet && session?.user?.id;

  const handleReelStopped = useCallback(() => {
    setReelsStopped((n) => {
      const next = n + 1;
      gameSounds.slotReelStop();
      return next;
    });
  }, []);

  const handleSpin = useCallback(async () => {
    if (!session?.user?.id || isSpinning || balance < totalBet) return;

    setIsSpinning(true);
    setLastResult(null);
    setWinVisible(false);
    setReelsStopped(0);
    gameSounds.slotSpinStart();

    const betRes = await placeSlotBet(totalBet);
    if (!betRes.ok) {
      setIsSpinning(false);
      console.error("Slot bet failed:", betRes.error);
      alert(betRes.error);
      return;
    }
    setBalance(parseFloat(betRes.balance));

    const result = engineSpin(betPerLine, PAYLINE_COUNT);
    setLastResult(result);
    if (result.wins > 0 || result.bonusTriggered) {
      if (result.bonusTriggered) gameSounds.slotBonusTrigger();
      else if (result.wins >= totalBet * 2) gameSounds.slotBigWin();
      else gameSounds.slotSmallWin();
    }

    const creditRes = await creditSlotWin(totalBet, result.wins, result.grid);
    if (creditRes.ok) {
      setBalance(parseFloat(creditRes.balance));
    }

    setWinVisible(true);
    console.log("Cyber Crime spin result:", {
      grid: result.grid,
      wins: result.wins,
      winningLines: result.winningLines,
      scatterCount: result.scatterCount,
      bonusTriggered: result.bonusTriggered,
    });
  }, [session?.user?.id, isSpinning, balance, totalBet, betPerLine, setBalance]);

  useEffect(() => {
    if (!isSpinning || reelsStopped < 5) return;
    const t = setTimeout(() => setIsSpinning(false), 200);
    return () => clearTimeout(t);
  }, [isSpinning, reelsStopped]);

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
      style={{
        backgroundImage: `url(${BACKGROUND_IMAGE})`,
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/play"
            className="flex items-center gap-2 text-slate-300 transition-colors hover:text-cyan-400"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Link>
          <div className="flex items-center gap-4">
            <div className="rounded-lg border border-cyan-500/30 bg-black/50 px-4 py-2">
              <span className="text-xs text-cyan-400/80">Balance</span>
              <span className="ml-2 font-mono font-bold text-cyan-300">
                {balance.toFixed(2)}
              </span>
            </div>
            <WinDisplay
              amount={lastResult?.wins ?? 0}
              visible={winVisible}
              isBigWin={(lastResult?.wins ?? 0) >= totalBet * 2 || (lastResult?.bonusTriggered ?? false)}
            />
          </div>
        </div>

        <div className="slot-machine relative rounded-2xl border-2 border-cyan-500/40 bg-black/70 p-4 shadow-[0_0_60px_rgba(34,211,238,0.15)] backdrop-blur-sm">
          <div className="relative grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4].map((reelIndex) => (
              <Reel
                key={reelIndex}
                reelIndex={reelIndex}
                symbols={
                  lastResult
                    ? [
                        lastResult.grid[reelIndex][0],
                        lastResult.grid[reelIndex][1],
                        lastResult.grid[reelIndex][2],
                      ]
                    : ["symbol_1", "symbol_2", "symbol_3"]
                }
                isSpinning={isSpinning}
                stopDelayMs={SPIN_DURATION_MS + reelIndex * STAGGER_MS}
                onStopped={reelIndex < 5 ? handleReelStopped : undefined}
                winningRows={
                  lastResult?.winningLines?.length
                    ? getWinningRowsForReel(reelIndex, lastResult.winningLines)
                    : undefined
                }
              />
            ))}
            <PaylinesOverlay
              winningLines={lastResult?.winningLines ?? []}
              showAllLines={true}
              isSpinning={isSpinning}
            />
          </div>
          <p className="mt-2 text-center text-xs text-cyan-400/80">
            20 paylines • Left to right
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-400">Bet per line</span>
            {BET_OPTIONS.map((b, i) => (
              <button
                key={b}
                type="button"
                onClick={() => setBetIndex(i)}
                disabled={isSpinning}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  betIndex === i
                    ? "bg-cyan-500 text-black"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                } ${isSpinning ? "cursor-not-allowed opacity-70" : ""}`}
              >
                {b}
              </button>
            ))}
            <span className="text-xs text-slate-500">
              Total: {totalBet.toFixed(2)} (20 lines)
            </span>
          </div>
          <SpinButton
            disabled={!canSpin}
            isSpinning={isSpinning}
            onClick={handleSpin}
          />
        </div>

        {balance < totalBet && balance > 0 && (
          <p className="mt-4 text-center text-sm text-amber-400">
            Insufficient balance for current bet. Lower your bet or add funds.
          </p>
        )}
      </div>
    </div>
  );
}

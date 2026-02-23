"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { gameSounds } from "@/lib/game-sounds";
import { setMasterVolume, setMuted } from "@/lib/sound-settings";

const GRID_SIZE = 5;
const GRID_CELLS = GRID_SIZE * GRID_SIZE;

type TileState = "hidden" | "diamond" | "mine";

interface GameState {
  grid: TileState[];
  mines: number[];
  diamonds: number[];
  multiplier: number;
  betAmount: number;
  roundActive: boolean;
  roundWon: boolean | null;
}

function getNextMultiplier(current: number) {
  return Math.round((current * 1.15) * 100) / 100;
}

export default function CryptoMinesGame() {
  const [minesCount, setMinesCount] = useState(3);
  const [soundMuted, setSoundMuted] = useState(false);
  const [soundVolume, setSoundVolume] = useState(1);
  const [balance, setBalance] = useState(() => {
    if (typeof window === "undefined") return 1000;
    return parseFloat(localStorage.getItem("gameBalance") ?? "1000");
  });
  const [betAmount, setBetAmount] = useState(0.1);
  const [clientSeed, setClientSeed] = useState(() =>
    Math.random().toString(36).slice(2, 10)
  );
  const [serverSeedHash, setServerSeedHash] = useState("");
  const [gameState, setGameState] = useState<GameState>({
    grid: [],
    mines: [],
    diamonds: [],
    multiplier: 1,
    betAmount: 0,
    roundActive: false,
    roundWon: null,
  });

  const diamondsCount = GRID_CELLS - minesCount;
  const nextMult = gameState.roundActive
    ? getNextMultiplier(gameState.multiplier)
    : null;

  useEffect(() => {
    setMuted(soundMuted);
  }, [soundMuted]);

  useEffect(() => {
    setMasterVolume(soundVolume);
  }, [soundVolume]);

  const initRound = useCallback(() => {
    const indices = Array.from({ length: GRID_CELLS }, (_, i) => i);
    const shuffled = [...indices].sort(() => Math.random() - 0.5);
    const mines = shuffled.slice(0, minesCount);
    const diamonds = shuffled.slice(minesCount, GRID_CELLS);

    setGameState({
      grid: Array(GRID_CELLS).fill("hidden"),
      mines,
      diamonds,
      multiplier: 1,
      betAmount,
      roundActive: true,
      roundWon: null,
    });
    gameSounds.bet();
  }, [minesCount, betAmount]);

  const flipTile = useCallback(
    (index: number) => {
      if (!gameState.roundActive || gameState.roundWon !== null) return;
      if (gameState.grid[index] !== "hidden") return;
      if (balance < betAmount) return;

      const isMine = gameState.mines.includes(index);
      const isDiamond = gameState.diamonds.includes(index);

      if (isMine) {
        if (!soundMuted) {
          gameSounds.mineExplosion();
        }
        setBalance((b) => Math.max(0, b - gameState.betAmount));
        setGameState((s) => ({
          ...s,
          grid: s.grid.map((_, i) => (i === index ? "mine" : s.grid[i])),
          roundActive: false,
          roundWon: false,
        }));
        return;
      }

      if (isDiamond) {
        const newMultiplier = getNextMultiplier(gameState.multiplier);
        if (!soundMuted) {
          gameSounds.safeClick();
        }
        const newGrid = [...gameState.grid];
        newGrid[index] = "diamond";

        setGameState((s) => ({
          ...s,
          grid: newGrid,
          multiplier: newMultiplier,
        }));
      }
    },
    [gameState, balance, betAmount, soundMuted]
  );

  const cashout = useCallback(() => {
    if (!gameState.roundActive || gameState.roundWon !== null) return;

    const win = gameState.betAmount * gameState.multiplier;
    setBalance((b) => b + win);
    if (!soundMuted) {
      gameSounds.winSequence();
    }
    setGameState((s) => ({ ...s, roundActive: false, roundWon: true }));
  }, [gameState, soundMuted]);

  const startRound = useCallback(() => {
    if (balance < betAmount || gameState.roundActive) return;
    setBalance((b) => b - betAmount);
    initRound();
  }, [balance, betAmount, gameState.roundActive, initRound]);

  if (typeof window !== "undefined") {
    localStorage.setItem("gameBalance", balance.toString());
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#070707]">
      {/* Top nav */}
      <header className="border-b border-[#1a1a1a] px-4 py-3">
        <Link
          href="/originals"
          className="text-sm text-gray-400 transition-colors hover:text-white"
        >
          ← Back to Originals
        </Link>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 lg:flex-row lg:items-start lg:justify-center">
        {/* LEFT: Game Board */}
        <div className="flex flex-1 flex-col">
          {/* Game header bar */}
          <div className="mb-4 flex flex-wrap items-center gap-4 rounded-xl border border-primary/30 bg-[#0d0d0d] px-4 py-3">
            <span className="flex items-center gap-2 font-bold text-white">
              <span className="text-primary">⛏</span> CRYPTO MINES
            </span>
            <span className="text-primary">
              MULT <span className="font-mono font-bold">{gameState.multiplier.toFixed(2)}x</span>
            </span>
            <span className="text-gray-500">
              NEXT{" "}
              <span className="font-mono text-white">
                {nextMult != null ? `${nextMult.toFixed(2)}x` : "-"}
              </span>
            </span>
            <span className="text-primary">
              BET <span className="font-mono font-bold">{betAmount}</span>
            </span>
            <div className="ml-auto flex items-center gap-3 text-xs text-gray-400">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={soundMuted}
                  onChange={(e) => setSoundMuted(e.target.checked)}
                  className="h-3 w-3 rounded border-[#333] bg-[#141414]"
                />
                <span>Mute</span>
              </label>
              <div className="flex items-center gap-1">
                <span>Vol</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={soundVolume}
                  onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                  className="h-1 w-20 accent-primary"
                />
              </div>
            </div>
          </div>

          {/* Grid */}
          <div
            className="grid max-w-sm gap-2"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              aspectRatio: "1",
            }}
          >
            {Array.from({ length: GRID_CELLS }, (_, i) => (
              <Tile
                key={i}
                state={gameState.grid[i] as TileState}
                onClick={() => flipTile(i)}
                disabled={
                  !gameState.roundActive ||
                  gameState.grid[i] !== "hidden" ||
                  gameState.roundWon !== null
                }
              />
            ))}
          </div>

          {gameState.roundActive && (
            <div className="mt-4 flex gap-4">
              <button
                onClick={cashout}
                disabled={gameState.roundWon !== null}
                className="rounded-xl bg-accent-green px-6 py-2 font-bold text-black"
              >
                Cash Out {gameState.multiplier.toFixed(2)}x
              </button>
            </div>
          )}

          {gameState.roundWon === true && (
            <div className="mt-4 flex items-center gap-3 text-accent-green">
              <p>
                +{(gameState.betAmount * gameState.multiplier).toFixed(2)} won
              </p>
              <div className="flex gap-1 text-2xl animate-pulse">
                <span>🎆</span>
                <span>🎇</span>
                <span>🎆</span>
              </div>
            </div>
          )}
          {gameState.roundWon === false && (
            <p className="mt-4 text-danger">Mine hit -{gameState.betAmount}</p>
          )}
        </div>

        {/* RIGHT: Game Setup & Provably Fair */}
        <div className="flex w-full flex-col gap-4 lg:w-80 lg:shrink-0">
          {/* Balance */}
          <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-[#0d0d0d] px-4 py-2">
            <span className="text-primary">◆</span>
            <span className="font-bold text-white">{balance.toFixed(2)}</span>
          </div>

          {/* GAME SETUP */}
          <div className="rounded-xl border border-primary/30 bg-[#0d0d0d] p-4">
            <h3 className="mb-4 font-bold text-white">GAME SETUP</h3>

            <div className="mb-4">
              <label className="mb-2 block text-sm text-gray-400">
                Bet Amount
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBetAmount(Math.max(0.01, betAmount - 0.1))}
                  disabled={gameState.roundActive}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#333] bg-[#141414] text-white hover:bg-[#1a1a1a]"
                >
                  −
                </button>
                <input
                  type="number"
                  step={0.1}
                  min={0.01}
                  max={balance}
                  value={betAmount}
                  onChange={(e) =>
                    setBetAmount(Math.max(0.01, parseFloat(e.target.value) || 0.01))
                  }
                  disabled={gameState.roundActive}
                  className="flex-1 rounded-lg border border-[#333] bg-[#141414] px-3 py-2 text-center text-white"
                />
                <button
                  type="button"
                  onClick={() => setBetAmount(betAmount + 0.1)}
                  disabled={gameState.roundActive}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#333] bg-[#141414] text-white hover:bg-[#1a1a1a]"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm text-gray-400">
                Mines ({minesCount})
              </label>
              <input
                type="range"
                min={1}
                max={24}
                value={minesCount}
                onChange={(e) => setMinesCount(parseInt(e.target.value))}
                disabled={gameState.roundActive}
                className="w-full accent-primary"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>1</span>
                <span>24</span>
              </div>
            </div>

            <button
              onClick={startRound}
              disabled={balance < betAmount || gameState.roundActive}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bold text-black shadow-[0_0_20px_rgba(255,223,0,0.4)] disabled:opacity-50"
            >
              <span>⛏</span> START MINING
            </button>
          </div>

          {/* PROVABLY FAIR */}
          <div className="rounded-xl border border-primary/30 bg-[#0d0d0d] p-4">
            <h3 className="mb-4 flex items-center gap-2 font-bold text-white">
              <span className="text-primary">🛡</span> PROVABLY FAIR
            </h3>

            <div className="mb-3">
              <label className="mb-1 block text-xs text-gray-400">
                Server Seed Hash
              </label>
              <input
                type="text"
                value={serverSeedHash}
                onChange={(e) => setServerSeedHash(e.target.value)}
                placeholder="-"
                className="w-full rounded-lg border border-[#333] bg-[#141414] px-3 py-2 text-sm text-white placeholder:text-gray-600"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-xs text-gray-400">
                Client Seed
              </label>
              <input
                type="text"
                value={clientSeed}
                onChange={(e) => setClientSeed(e.target.value)}
                className="w-full rounded-lg border border-[#333] bg-[#141414] px-3 py-2 text-sm text-white"
              />
            </div>

            <p className="text-xs text-gray-500">
              The hash is shown before game start. After game over, the raw seed
              is revealed so you can verify SHA-256(seed) === hash.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tile({
  state,
  onClick,
  disabled,
}: {
  state: TileState;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        flex aspect-square items-center justify-center rounded-xl text-2xl transition-all
        ${state === "hidden" ? "border border-primary/30 bg-[#1a1a1a] shadow-[0_0_8px_rgba(255,223,0,0.15)] hover:bg-[#252525] hover:shadow-[0_0_12px_rgba(255,223,0,0.25)] active:scale-95" : ""}
        ${state === "diamond" ? "border border-accent-green/50 bg-accent-green/20 text-accent-green" : ""}
        ${state === "mine" ? "border border-danger/50 bg-danger/20 text-danger animate-[shake_0.5s]" : ""}
        ${disabled && state === "hidden" ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
      `}
    >
      {state === "hidden" && "?"}
      {state === "diamond" && "💎"}
      {state === "mine" && "💥"}
    </button>
  );
}

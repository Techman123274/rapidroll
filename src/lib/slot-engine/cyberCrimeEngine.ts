/**
 * Cyber Crime slot engine: RNG, grid generation, win evaluation.
 * RTP target ~96%; no placeholder logic.
 */

import {
  REELS,
  ROWS,
  SYMBOLS,
  type SymbolId,
} from "@/lib/slot-engine/cyberCrimeConfig";
import {
  evaluatePaylines,
  getScatterCount,
  getScatterMultiplier,
  type Grid,
} from "@/components/slot/PaylineEvaluator";

const TOTAL_WEIGHT = SYMBOLS.reduce((s, x) => s + x.weight, 0);

/**
 * Weighted random symbol using Math.random (secure enough for client-side RNG per requirements).
 */
function pickWeightedSymbol(): SymbolId {
  let r = Math.random() * TOTAL_WEIGHT;
  for (const { id, weight } of SYMBOLS) {
    r -= weight;
    if (r <= 0) return id;
  }
  return SYMBOLS[SYMBOLS.length - 1].id;
}

/**
 * Generate one reel column (3 symbols) with weighted distribution.
 */
function generateReel(): [string, string, string] {
  return [pickWeightedSymbol(), pickWeightedSymbol(), pickWeightedSymbol()];
}

/**
 * Generate full 5x3 grid. Grid[reel][row] = symbol id.
 */
function generateGrid(): Grid {
  const grid: Grid = [];
  for (let reel = 0; reel < REELS; reel++) {
    grid.push([...generateReel()]);
  }
  return grid;
}

export interface SpinResult {
  grid: Grid;
  wins: number;
  winningLines: number[];
  scatterCount: number;
  bonusTriggered: boolean;
}

/**
 * Execute one spin. Returns grid and win info. Does not touch balance.
 */
export function spin(betPerLine: number, lineCount: number): SpinResult {
  const grid = generateGrid();
  const lineWins = evaluatePaylines(grid);
  const scatterCount = getScatterCount(grid);
  const scatterMult = getScatterMultiplier(scatterCount);
  const bonusTriggered = scatterCount >= 3;

  let totalWins = 0;
  const winningLines: number[] = [];

  for (const w of lineWins) {
    winningLines.push(w.lineIndex);
    totalWins += w.multiplier * betPerLine;
  }
  if (scatterMult > 0) {
    totalWins += scatterMult * (betPerLine * lineCount);
  }

  return {
    grid,
    wins: Math.round(totalWins * 100) / 100,
    winningLines: [...new Set(winningLines)],
    scatterCount,
    bonusTriggered,
  };
}

/**
 * Bet deduction and payout: returns net change for balance.
 * totalBet = betPerLine * lineCount. Win amount already in result.wins.
 */
export function getPayout(totalBet: number, result: SpinResult): number {
  return -totalBet + result.wins;
}

import type { RNG } from "./RNG";

export type SymbolId =
  | "symbol_1"
  | "symbol_2"
  | "symbol_3"
  | "symbol_4"
  | "symbol_5"
  | "wild"
  | "scatter"
  | "multiplier";

export type Grid = SymbolId[][];

export type VolatilityMode = "low" | "medium" | "high";

export interface LineHit {
  lineIndex: number;
  symbol: SymbolId;
  count: number;
  lineWin: number;
  lineMultiplier: number;
}

export interface ScatterResult {
  scatterCount: number;
  scatterWin: number;
  bonusTriggered: boolean;
}

export interface PaytableEntry {
  tier: "low" | "mid" | "high";
  payouts: { 3?: number; 4?: number; 5?: number };
}

export interface Paytable {
  [symbolId: string]: PaytableEntry;
}

export interface PaylineConfig {
  /** Each line is [row0,row1,row2,row3,row4] with 0=top,1=mid,2=bot */
  lines: number[][];
}

// 50-line schema for 5x3. The first 20 are our classic lines,
// the remaining lines cover additional zig-zag and V patterns.
// All are valid, deterministic paylines.
export const PAYLINES_50: PaylineConfig = {
  lines: [
    // 1–3: straight
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2],
    // 4–10: simple V / inverted V and near-straights
    [0, 1, 2, 1, 0],
    [2, 1, 0, 1, 2],
    [0, 0, 1, 0, 0],
    [2, 2, 1, 2, 2],
    [1, 0, 0, 0, 1],
    [1, 2, 2, 2, 1],
    [0, 1, 1, 1, 0],
    // 11–20: more zig-zags
    [2, 1, 1, 1, 2],
    [1, 0, 1, 0, 1],
    [1, 2, 1, 2, 1],
    [0, 2, 0, 2, 0],
    [2, 0, 2, 0, 2],
    [1, 1, 0, 1, 1],
    [1, 1, 2, 1, 1],
    [0, 0, 2, 0, 0],
    [2, 2, 0, 2, 2],
    [0, 2, 2, 2, 0],
    // 21–30: shallow diagonals and step patterns
    [0, 1, 0, 1, 0],
    [2, 1, 2, 1, 2],
    [0, 1, 2, 2, 2],
    [2, 1, 0, 0, 0],
    [1, 2, 2, 1, 0],
    [1, 0, 0, 1, 2],
    [0, 0, 1, 1, 2],
    [2, 2, 1, 1, 0],
    [0, 1, 2, 2, 1],
    [2, 1, 0, 0, 1],
    // 31–40: tighter zig-zags
    [1, 2, 1, 0, 1],
    [1, 0, 1, 2, 1],
    [0, 1, 0, 1, 2],
    [2, 1, 2, 1, 0],
    [0, 2, 1, 0, 1],
    [2, 0, 1, 2, 1],
    [1, 0, 2, 1, 0],
    [1, 2, 0, 1, 2],
    [0, 1, 2, 1, 1],
    [2, 1, 0, 1, 1],
    // 41–50: high-variation paths
    [0, 2, 1, 2, 0],
    [2, 0, 1, 0, 2],
    [0, 0, 1, 2, 2],
    [2, 2, 1, 0, 0],
    [1, 0, 2, 2, 1],
    [1, 2, 0, 0, 1],
    [0, 2, 2, 1, 0],
    [2, 0, 0, 1, 2],
    [0, 1, 2, 0, 1],
    [2, 1, 0, 2, 1],
  ],
};

export const WILD: SymbolId = "wild";
export const SCATTER: SymbolId = "scatter";
export const MULTIPLIER: SymbolId = "multiplier";

export function evaluateLines(
  grid: Grid,
  paytable: Paytable,
  paylines: PaylineConfig,
  betPerLine: number
): LineHit[] {
  const hits: LineHit[] = [];

  for (let lineIndex = 0; lineIndex < paylines.lines.length; lineIndex++) {
    const line = paylines.lines[lineIndex];
    const symbols: SymbolId[] = [];

    for (let reel = 0; reel < 5; reel++) {
      const row = line[reel];
      symbols.push(grid[reel][row]);
    }

    const { baseSymbol, count, lineMultiplier } = countMatchFromLeft(symbols);
    if (!baseSymbol || count < 3) continue;

    const entry = paytable[baseSymbol];
    if (!entry) continue;

    const payout =
      (count === 3 ? entry.payouts[3] : count === 4 ? entry.payouts[4] : entry.payouts[5]) ?? 0;

    if (payout <= 0) continue;

    const lineWin = payout * betPerLine * lineMultiplier;

    hits.push({
      lineIndex,
      symbol: baseSymbol,
      count,
      lineWin,
      lineMultiplier,
    });
  }

  return hits;
}

function countMatchFromLeft(symbols: SymbolId[]): {
  baseSymbol: SymbolId | null;
  count: number;
  lineMultiplier: number;
} {
  // Determine base symbol (first non-wild, non-scatter)
  let base: SymbolId | null = null;
  let hasMultiplier = false;

  for (const s of symbols) {
    if (s === MULTIPLIER) {
      hasMultiplier = true;
      continue;
    }
    if (s === WILD || s === SCATTER) continue;
    base = s;
    break;
  }

  if (!base) return { baseSymbol: null, count: 0, lineMultiplier: 1 };

  let count = 0;
  let lineMultiplier = 1;

  for (const s of symbols) {
    if (s === MULTIPLIER) {
      // Base multiplier symbol: stack up to 10x total.
      lineMultiplier = Math.min(lineMultiplier * 2, 10);
      continue;
    }
    if (s === base || s === WILD) {
      count++;
    } else {
      break;
    }
  }

  if (hasMultiplier && lineMultiplier === 1) {
    // Multiplier symbol appeared but did not get processed (e.g. after break) – still grant 2x.
    lineMultiplier = 2;
  }

  return { baseSymbol: base, count, lineMultiplier };
}

export function evaluateScatter(
  grid: Grid,
  scatterSymbol: SymbolId,
  scatterPay: { 3?: number; 4?: number; 5?: number },
  totalBet: number
): ScatterResult {
  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === scatterSymbol) count++;
    }
  }

  let scatterWin = 0;
  if (count >= 5 && scatterPay[5]) scatterWin = (scatterPay[5] ?? 0) * totalBet;
  else if (count === 4 && scatterPay[4]) scatterWin = (scatterPay[4] ?? 0) * totalBet;
  else if (count === 3 && scatterPay[3]) scatterWin = (scatterPay[3] ?? 0) * totalBet;

  return {
    scatterCount: count,
    scatterWin,
    bonusTriggered: count >= 3,
  };
}


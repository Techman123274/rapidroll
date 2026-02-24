/**
 * Payline evaluation for Cyber Crime slot.
 * Pure functions: grid + paytable → line wins and scatter count.
 */

import {
  PAYLINES,
  PAYTABLE,
  SCATTER_PAY,
  WILD_ID,
  SCATTER_ID,
  type SymbolId,
} from "@/lib/slot-engine/cyberCrimeConfig";

export type Grid = string[][];

/** One evaluated line: lineIndex, symbol, count, multiplier (per line). */
export interface LineWin {
  lineIndex: number;
  symbol: string;
  count: number;
  multiplier: number;
}

/**
 * Resolve symbol for pay: wild substitutes for any non-scatter.
 * Returns the "base" symbol for this position (first non-wild from left, or wild if all wild).
 */
function resolveSymbolForPay(symbols: string[]): string | null {
  let base: string | null = null;
  for (const s of symbols) {
    if (s === WILD_ID) continue;
    if (s === SCATTER_ID) return null;
    base = s;
    break;
  }
  return base ?? (symbols.every((s) => s === WILD_ID) ? WILD_ID : null);
}

/**
 * Count consecutive matching symbols from left (wild substitutes).
 * Returns [matchCount, baseSymbol]. Max count 5.
 */
function countMatchFromLeft(symbols: string[]): { count: number; base: string } {
  const base = resolveSymbolForPay(symbols);
  if (!base || base === WILD_ID) return { count: 0, base: "" };
  let count = 0;
  for (const s of symbols) {
    if (s === base || s === WILD_ID) count++;
    else break;
  }
  return { count, base };
}

/**
 * Evaluate all paylines. Scatter is not evaluated per line; use getScatterCount.
 */
export function evaluatePaylines(grid: Grid): LineWin[] {
  const wins: LineWin[] = [];
  const paytable = PAYTABLE as Record<string, [number, number, number]>;

  for (let lineIndex = 0; lineIndex < PAYLINES.length; lineIndex++) {
    const line = PAYLINES[lineIndex];
    const symbols: string[] = [];
    for (let reel = 0; reel < 5; reel++) {
      const row = line[reel];
      symbols.push(grid[reel][row]);
    }
    const { count, base } = countMatchFromLeft(symbols);
    if (count >= 3 && base && paytable[base]) {
      const [m3, m4, m5] = paytable[base];
      const mult = count === 3 ? m3 : count === 4 ? m4 : m5;
      if (mult > 0) {
        wins.push({ lineIndex, symbol: base, count, multiplier: mult });
      }
    }
  }
  return wins;
}

/**
 * Count scatters on the grid (any position).
 */
export function getScatterCount(grid: Grid): number {
  let n = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === SCATTER_ID) n++;
    }
  }
  return n;
}

/**
 * Scatter payout multiplier from count (3, 4, or 5). Returns 0 if &lt; 3.
 */
export function getScatterMultiplier(scatterCount: number): number {
  if (scatterCount < 3) return 0;
  if (scatterCount >= 5) return SCATTER_PAY[2];
  if (scatterCount === 4) return SCATTER_PAY[1];
  return SCATTER_PAY[0];
}

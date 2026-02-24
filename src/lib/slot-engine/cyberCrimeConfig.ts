/**
 * Cyber Crime slot – config only.
 * Symbol weights and paytable live here for RTP tuning.
 */

export const REELS = 5;
export const ROWS = 3;
export const PAYLINE_COUNT = 20;

export const SYMBOLS = [
  { id: "symbol_1", weight: 10 },
  { id: "symbol_2", weight: 9 },
  { id: "symbol_3", weight: 8 },
  { id: "symbol_4", weight: 7 },
  { id: "symbol_5", weight: 6 },
  { id: "wild", weight: 3 },
  { id: "scatter", weight: 2 },
] as const;

export type SymbolId = (typeof SYMBOLS)[number]["id"];

export const WILD_ID = "wild" as const;
export const SCATTER_ID = "scatter" as const;

/** Pay per line: symbolId -> [count 3, count 4, count 5]. Multiplier × bet per line. */
export const PAYTABLE: Record<string, [number, number, number]> = {
  symbol_1: [0.2, 0.5, 2],
  symbol_2: [0.2, 0.5, 1.5],
  symbol_3: [0.15, 0.4, 1.2],
  symbol_4: [0.15, 0.4, 1],
  symbol_5: [0.1, 0.3, 0.8],
  wild: [0, 0, 0],
  scatter: [0, 0, 0],
};

/** Scatter pay: [3, 4, 5] scatters anywhere. Multiplier × total bet. */
export const SCATTER_PAY: [number, number, number] = [2, 5, 20];

/** 20 fixed paylines: each line is [row for reel0, reel1, reel2, reel3, reel4]. Row 0=top, 1=mid, 2=bot. */
export const PAYLINES: readonly [number, number, number, number, number][] = [
  [0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1],
  [2, 2, 2, 2, 2],
  [0, 1, 2, 1, 0],
  [2, 1, 0, 1, 2],
  [0, 0, 1, 0, 0],
  [2, 2, 1, 2, 2],
  [1, 0, 0, 0, 1],
  [1, 2, 2, 2, 1],
  [0, 1, 1, 1, 0],
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
];

import type { RNG } from "./RNG";
import type { SymbolId } from "./PaylineEvaluator";

export interface ReelStripConfig {
  reels: SymbolId[][];
}

export interface SpinReelsConfig {
  strips: ReelStripConfig;
}

/**
 * Generates visible 5x3 grid from configured reel strips.
 * Each reel has an underlying strip; a random starting index is chosen,
 * then the top 3 symbols from that index form the visible window.
 */
export function spinReels(config: SpinReelsConfig, rng: RNG): SymbolId[][] {
  const { reels } = config.strips;
  if (reels.length !== 5) {
    throw new Error("ReelController: expected 5 reels");
  }

  const grid: SymbolId[][] = [];

  for (let r = 0; r < 5; r++) {
    const strip = reels[r];
    if (strip.length < 3) {
      throw new Error("ReelController: strip too short");
    }
    const startIndex = rng.int(0, strip.length - 1);
    const column: SymbolId[] = [];
    for (let row = 0; row < 3; row++) {
      const idx = (startIndex + row) % strip.length;
      column.push(strip[idx]);
    }
    grid.push(column);
  }

  return grid;
}


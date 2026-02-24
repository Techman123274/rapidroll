import type { SymbolId } from "./PaylineEvaluator";

export type VolatilityMode = "low" | "medium" | "high";

export interface SymbolWeight {
  id: SymbolId;
  weight: number;
}

export interface VolatilityConfig {
  mode: VolatilityMode;
  /** Symbol distribution used to build reel strips or direct draws */
  symbolWeights: SymbolWeight[];
  /** Global multiplier applied to high-tier wins to shape volatility */
  highTierWinBoost: number;
}

/**
 * Basic volatility controller – in a real casino environment this would be
 * tuned via large-scale simulations. Here we provide distinct, deterministic
 * parameter sets for each mode.
 */
export function getVolatilityConfig(mode: VolatilityMode = "medium"): VolatilityConfig {
  switch (mode) {
    case "low":
      return {
        mode,
        symbolWeights: [
          { id: "symbol_1", weight: 18 },
          { id: "symbol_2", weight: 16 },
          { id: "symbol_3", weight: 14 },
          { id: "symbol_4", weight: 12 },
          { id: "symbol_5", weight: 10 },
          { id: "wild", weight: 4 },
          { id: "scatter", weight: 3 },
          { id: "multiplier", weight: 2 },
        ],
        highTierWinBoost: 0.8,
      };
    case "high":
      return {
        mode,
        symbolWeights: [
          { id: "symbol_1", weight: 12 },
          { id: "symbol_2", weight: 10 },
          { id: "symbol_3", weight: 8 },
          { id: "symbol_4", weight: 6 },
          { id: "symbol_5", weight: 5 },
          { id: "wild", weight: 3 },
          { id: "scatter", weight: 2 },
          { id: "multiplier", weight: 2 },
        ],
        highTierWinBoost: 1.4,
      };
    case "medium":
    default:
      return {
        mode: "medium",
        symbolWeights: [
          { id: "symbol_1", weight: 16 },
          { id: "symbol_2", weight: 14 },
          { id: "symbol_3", weight: 12 },
          { id: "symbol_4", weight: 10 },
          { id: "symbol_5", weight: 8 },
          { id: "wild", weight: 3 },
          { id: "scatter", weight: 2 },
          { id: "multiplier", weight: 2 },
        ],
        highTierWinBoost: 1.0,
      };
  }
}


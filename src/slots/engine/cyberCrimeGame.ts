import type { Paytable } from "./PaylineEvaluator";
import type { SlotEngineConfig } from "./SlotEngine";
import { SlotEngine } from "./SlotEngine";

// Cyber Crime symbol tiers & payouts (multipliers × bet per line)
export const CYBER_CRIME_PAYTABLE: Paytable = {
  symbol_1: {
    tier: "low",
    payouts: { 3: 1, 4: 2, 5: 3 },
  },
  symbol_2: {
    tier: "low",
    payouts: { 3: 1, 4: 3, 5: 4 },
  },
  symbol_3: {
    tier: "mid",
    payouts: { 3: 2, 4: 5, 5: 12 },
  },
  symbol_4: {
    tier: "mid",
    payouts: { 3: 3, 4: 8, 5: 20 },
  },
  symbol_5: {
    tier: "high",
    payouts: { 3: 5, 4: 20, 5: 80 },
  },
  wild: {
    tier: "high",
    payouts: { 3: 8, 4: 30, 5: 100 },
  },
  scatter: {
    tier: "mid",
    payouts: { 3: 0, 4: 0, 5: 0 },
  },
  multiplier: {
    tier: "mid",
    payouts: { 3: 0, 4: 0, 5: 0 },
  },
};

// Scatter win multipliers × total bet
export const CYBER_CRIME_SCATTER_PAY: { 3?: number; 4?: number; 5?: number } = {
  3: 2,
  4: 10,
  5: 50,
};

export const CYBER_CRIME_BONUS_CONFIG = {
  spinsOnTrigger: 10,
  baseMultiplier: 2,
  multiplierStep: 1,
  maxMultiplier: 10,
  scatterSymbol: "scatter" as const,
  scatterForTrigger: 3,
};

export function createCyberCrimeEngine(): SlotEngine {
  const config: SlotEngineConfig = {
    paytable: CYBER_CRIME_PAYTABLE,
    scatterPay: CYBER_CRIME_SCATTER_PAY,
    volatilityMode: "medium",
    rtpTarget: 0.96,
    bonus: CYBER_CRIME_BONUS_CONFIG,
  };
  return new SlotEngine(config);
}


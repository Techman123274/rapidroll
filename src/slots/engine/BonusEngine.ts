import type { Grid, SymbolId } from "./PaylineEvaluator";

export interface BonusState {
  active: boolean;
  spinsRemaining: number;
  currentMultiplier: number;
  totalBonusWin: number;
}

export interface BonusConfig {
  spinsOnTrigger: number;
  baseMultiplier: number;
  multiplierStep: number;
  maxMultiplier: number;
  scatterSymbol: SymbolId;
  scatterForTrigger: number;
}

export function createInitialBonusState(): BonusState {
  return {
    active: false,
    spinsRemaining: 0,
    currentMultiplier: 1,
    totalBonusWin: 0,
  };
}

export function maybeStartBonus(
  grid: Grid,
  config: BonusConfig,
  existing: BonusState | undefined
): BonusState | undefined {
  const state = existing ?? createInitialBonusState();
  if (state.active) return state;

  let scatterCount = 0;
  for (const col of grid) {
    for (const s of col) {
      if (s === config.scatterSymbol) scatterCount++;
    }
  }
  if (scatterCount < config.scatterForTrigger) return state;

  return {
    active: true,
    spinsRemaining: config.spinsOnTrigger,
    currentMultiplier: config.baseMultiplier,
    totalBonusWin: 0,
  };
}

export function applyBonusWin(
  win: number,
  bonus: BonusState | undefined,
  config?: BonusConfig
): { effectiveWin: number; newBonus?: BonusState } {
  if (!bonus || !bonus.active) return { effectiveWin: win };

  const boosted = win * bonus.currentMultiplier;
  const totalBonusWin = bonus.totalBonusWin + boosted;
  const spinsRemaining = Math.max(0, bonus.spinsRemaining - 1);

  const step = config?.multiplierStep ?? 1;
  const max = config?.maxMultiplier ?? bonus.currentMultiplier;
  const nextMultiplier = Math.min(bonus.currentMultiplier + step, max);

  const newState: BonusState = {
    active: spinsRemaining > 0,
    spinsRemaining,
    currentMultiplier: spinsRemaining > 0 ? nextMultiplier : 1,
    totalBonusWin,
  };

  return { effectiveWin: boosted, newBonus: newState };
}



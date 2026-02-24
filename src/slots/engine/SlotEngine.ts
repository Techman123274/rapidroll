import { DefaultRNG, type RNG } from "./RNG";
import {
  type Grid,
  type Paytable,
  type LineHit,
  type ScatterResult,
  PAYLINES_50,
  WILD,
  SCATTER,
  MULTIPLIER,
  evaluateLines,
  evaluateScatter,
} from "./PaylineEvaluator";
import { spinReels, type SpinReelsConfig } from "./ReelController";
import {
  getVolatilityConfig,
  type VolatilityMode,
  type VolatilityConfig,
} from "./VolatilityController";
import {
  type BonusState,
  type BonusConfig,
  createInitialBonusState,
  maybeStartBonus,
  applyBonusWin,
} from "./BonusEngine";

export interface SlotEngineConfig {
  paytable: Paytable;
  scatterPay: { 3?: number; 4?: number; 5?: number };
  volatilityMode: VolatilityMode;
  rtpTarget: number;
  bonus: BonusConfig;
}

export interface SpinRequest {
  betPerLine: number;
  linesCount: number;
  bonusState?: BonusState;
}

export interface SpinOutcome {
  grid: Grid;
  totalWin: number;
  paylinesHit: LineHit[];
  scatter: ScatterResult;
  multipliers: {
    combinedMultiplier: number;
  };
  bonusTriggered: boolean;
  bonusState?: BonusState;
}

export class SlotEngine {
  private readonly config: SlotEngineConfig;
  private readonly volatility: VolatilityConfig;
  private readonly rng: RNG;

  constructor(config: SlotEngineConfig, rng: RNG = new DefaultRNG()) {
    this.config = config;
    this.volatility = getVolatilityConfig(config.volatilityMode);
    this.rng = rng;
  }

  spin(request: SpinRequest): SpinOutcome {
    const linesToUse = Math.min(request.linesCount, PAYLINES_50.lines.length);
    const totalBet = request.betPerLine * linesToUse;

    const reelsConfig = this.buildReelsConfig();
    const grid = spinReels(reelsConfig, this.rng);

    const lineHits = evaluateLines(
      grid,
      this.adjustedPaytable(this.config.paytable),
      { lines: PAYLINES_50.lines.slice(0, linesToUse) },
      request.betPerLine
    );

    const scatter = evaluateScatter(
      grid,
      SCATTER,
      this.config.scatterPay,
      totalBet
    );

    let lineWinTotal = lineHits.reduce((sum, h) => sum + h.lineWin, 0);
    lineWinTotal += scatter.scatterWin;

    // Apply bonus state (free spins multiplier ladder)
    const incomingBonus = request.bonusState ?? createInitialBonusState();
    const maybeBonus = maybeStartBonus(grid, this.config.bonus, incomingBonus);
    const { effectiveWin, newBonus } = applyBonusWin(
      lineWinTotal,
      maybeBonus,
      this.config.bonus
    );

    const totalWin = Math.round(effectiveWin * 100) / 100;

    return {
      grid,
      totalWin,
      paylinesHit: lineHits,
      scatter,
      multipliers: {
        combinedMultiplier: totalWin > 0 ? totalWin / (lineWinTotal || 1) : 1,
      },
      bonusTriggered: !!maybeBonus?.active && !incomingBonus.active,
      bonusState: newBonus,
    };
  }

  private buildReelsConfig(): SpinReelsConfig {
    // For now we build synthetic strips based on symbol weights.
    // Each reel has the same distribution; later we can vary per reel.
    const strips = this.volatility.symbolWeights.map((sw) =>
      Array.from({ length: sw.weight }, () => sw.id)
    );
    return { strips: { reels: strips as Grid } };
  }

  private adjustedPaytable(base: Paytable): Paytable {
    const boost = this.volatility.highTierWinBoost;
    const copy: Paytable = {};
    for (const [symbol, entry] of Object.entries(base)) {
      const payouts: { 3?: number; 4?: number; 5?: number } = {};
      for (const [k, v] of Object.entries(entry.payouts)) {
        const n = Number(k) as 3 | 4 | 5;
        if (!v) continue;
        // Boost high-tier symbols more in high-volatility mode.
        const mul =
          entry.tier === "high" ? boost : entry.tier === "mid" ? (boost + 1) / 2 : 1;
        payouts[n] = Math.round(v * mul * 100) / 100;
      }
      copy[symbol] = { tier: entry.tier, payouts };
    }
    return copy;
  }
}


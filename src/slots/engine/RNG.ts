export interface RNG {
  /** Uniform float in [0, 1) */
  float(): number;
  /** Integer in [min, max] inclusive */
  int(min: number, max: number): number;
}

/**
 * Default RNG wrapper around Math.random.
 * Kept behind an interface so we can later plug in
 * crypto/seeded/provably-fair RNG without touching game math.
 */
export class DefaultRNG implements RNG {
  float(): number {
    return Math.random();
  }

  int(min: number, max: number): number {
    if (!Number.isFinite(min) || !Number.isFinite(max) || max < min) {
      throw new Error("Invalid RNG.int bounds");
    }
    const r = this.float();
    return Math.floor(r * (max - min + 1)) + min;
  }
}


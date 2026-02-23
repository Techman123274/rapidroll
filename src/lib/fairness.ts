import crypto from "crypto";

/**
 * Provably Fair — Commit-Reveal Scheme
 * 1. COMMIT: Server generates seed, hashes it, gives hash before game
 * 2. PLAY: Mine positions derived from (serverSeed + clientSeed + nonce)
 * 3. REVEAL: Raw serverSeed shown after game for verification
 */

export function generateServerSeed(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashSeed(seed: string): string {
  return crypto.createHash("sha256").update(seed).digest("hex");
}

export function deriveMinePositions(
  serverSeed: string,
  clientSeed: string,
  nonce: number,
  mineCount: number,
  gridSize = 25
): number[] {
  const hmac = crypto
    .createHmac("sha256", serverSeed)
    .update(`${clientSeed}:${nonce}`)
    .digest("hex");

  const mines: Set<number> = new Set();
  let cursor = 0;

  while (mines.size < mineCount && cursor < hmac.length - 4) {
    const chunk = hmac.slice(cursor, cursor + 8);
    const value = parseInt(chunk, 16) % gridSize;
    mines.add(value);
    cursor += 8;

    if (cursor >= hmac.length - 4 && mines.size < mineCount) {
      const extended = crypto
        .createHmac("sha256", serverSeed)
        .update(`${clientSeed}:${nonce}:${cursor}`)
        .digest("hex");
      for (let i = 0; i < extended.length - 4 && mines.size < mineCount; i += 8) {
        const v = parseInt(extended.slice(i, i + 8), 16) % gridSize;
        mines.add(v);
      }
      break;
    }
  }

  return Array.from(mines).slice(0, mineCount);
}

export function computeMultiplier(
  mineCount: number,
  revealedCount: number,
  gridSize = 25
): number {
  if (revealedCount === 0) return 1;
  const houseEdge = 0.99;
  let multiplier = houseEdge;
  for (let i = 0; i < revealedCount; i++) {
    multiplier *= (gridSize - i) / (gridSize - mineCount - i);
  }
  return Math.floor(multiplier * 100) / 100;
}

export function nextTileMultiplier(
  mineCount: number,
  revealedCount: number,
  gridSize = 25
): number {
  return computeMultiplier(mineCount, revealedCount + 1, gridSize);
}

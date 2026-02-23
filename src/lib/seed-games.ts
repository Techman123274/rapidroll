/**
 * Seed games into MongoDB. Run via API route /api/seed or a script.
 * Uses dynamic imports so pages can use games-data without loading MongoDB.
 */
import { DEFAULT_GAMES } from "./games-data";

export { DEFAULT_GAMES } from "./games-data";
export type { SeedGame, GameCategory } from "./games-data";

export async function seedGames() {
  const dbConnect = (await import("./mongodb")).default;
  const Game = (await import("@/models/Game")).default;
  await dbConnect();
  for (const game of DEFAULT_GAMES) {
    const { provider, hot, ...dbFields } = game;
    await Game.findOneAndUpdate(
      { slug: game.slug },
      { $set: dbFields },
      { upsert: true, new: true }
    );
  }
}

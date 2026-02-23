import GameGrid from "@/components/GameGrid";
import { DEFAULT_GAMES } from "@/lib/games-data";

export default function OriginalsPage() {
  const originals = DEFAULT_GAMES.filter((g) => g.category === "Originals");

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="mb-1 text-2xl font-bold">Originals</h1>
        <p className="text-sm text-gray-500">
          {originals.length} custom games (Mines, Crash, etc.)
        </p>
      </div>
      <GameGrid games={originals} />
    </div>
  );
}

import GameGrid from "@/components/GameGrid";
import { DEFAULT_GAMES } from "@/lib/games-data";

export default function SlotsPage() {
  const slotGames = DEFAULT_GAMES.filter((g) => g.category === "Slots");

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="mb-1 text-2xl font-bold">Slots</h1>
        <p className="text-sm text-gray-500">
          {slotGames.length} slot games available
        </p>
      </div>
      <GameGrid games={slotGames} />
    </div>
  );
}

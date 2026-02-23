import GameCard from "./GameCard";
import type { SeedGame } from "@/lib/games-data";

interface GameGridProps {
  games: SeedGame[];
  columns?: 2 | 3 | 4 | 5;
}

export default function GameGrid({ games, columns = 4 }: GameGridProps) {
  return (
    <div
      className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-${columns} xl:grid-cols-5`}
      style={{
        // Tailwind doesn't support dynamic class names, use style for responsive columns
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(240px, 1fr))`,
        gap: "1rem",
      }}
    >
      {games.map((game) => (
        <GameCard
          key={game.slug}
          title={game.title}
          slug={game.slug}
          thumbnail={game.thumbnail}
          provider={game.provider}
          hot={game.hot}
        />
      ))}
    </div>
  );
}
